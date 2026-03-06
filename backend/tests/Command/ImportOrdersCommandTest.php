<?php

namespace App\Tests\Command;

use App\Command\ImportOrdersCommand;
use App\Entity\Customer;
use App\Repository\CustomerRepository;
use Doctrine\DBAL\Connection;
use Doctrine\ORM\EntityManagerInterface;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Tester\CommandTester;

class ImportOrdersCommandTest extends TestCase
{
    private EntityManagerInterface&MockObject $entityManager;
    private CustomerRepository&MockObject $customerRepository;
    private Connection&MockObject $connection;
    private string $tempDir;

    protected function setUp(): void
    {
        $this->entityManager = $this->createMock(EntityManagerInterface::class);
        $this->customerRepository = $this->createMock(CustomerRepository::class);
        $this->connection = $this->createMock(Connection::class);
        $this->entityManager->method('getConnection')->willReturn($this->connection);

        $this->tempDir = sys_get_temp_dir() . '/ugo_test_' . uniqid();
        mkdir($this->tempDir . '/data', 0777, true);
    }

    protected function tearDown(): void
    {
        if (is_dir($this->tempDir)) {
            $this->removeDir($this->tempDir);
        }
    }

    private function removeDir(string $dir): void
    {
        $iterator = new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator($dir, \FilesystemIterator::SKIP_DOTS),
            \RecursiveIteratorIterator::CHILD_FIRST
        );
        foreach ($iterator as $file) {
            $file->isDir() ? rmdir($file->getRealPath()) : unlink($file->getRealPath());
        }
        rmdir($dir);
    }

    private function writeCustomersCsv(string $content): void
    {
        file_put_contents($this->tempDir . '/data/customers.csv', $content);
    }

    private function writePurchasesCsv(string $content): void
    {
        file_put_contents($this->tempDir . '/data/purchases.csv', $content);
    }

    private function makeCommandTester(): CommandTester
    {
        $command = new ImportOrdersCommand(
            $this->entityManager,
            $this->customerRepository,
            $this->tempDir
        );

        return new CommandTester($command);
    }

    // -------------------------------------------------------------------------
    // Validation des fichiers
    // -------------------------------------------------------------------------

    public function testFailsWhenCustomersFileMissing(): void
    {
        $tester = $this->makeCommandTester();
        $tester->execute([]);

        $this->assertSame(Command::FAILURE, $tester->getStatusCode());
        $this->assertStringContainsString('Customers file not found', $tester->getDisplay());
    }

    public function testFailsWhenPurchasesFileMissing(): void
    {
        $this->writeCustomersCsv("customer_id;title;lastname;firstname;postal_code;city;email\n");

        $tester = $this->makeCommandTester();
        $tester->execute([]);

        $this->assertSame(Command::FAILURE, $tester->getStatusCode());
        $this->assertStringContainsString('Purchases file not found', $tester->getDisplay());
    }

    // -------------------------------------------------------------------------
    // Import clients
    // -------------------------------------------------------------------------

    public function testImportsCustomers(): void
    {
        $this->writeCustomersCsv(
            "customer_id;title;lastname;firstname;postal_code;city;email\n" .
                "1;2;Norris;Chuck;83600;FrÃ©jus;chuck@norris.com\n" .
                "2;1;Galante;Marie;;;marie@france.fr\n"
        );
        $this->writePurchasesCsv("purchase_identifier;customer_id;product_id;quantity;price;currency;date\n");

        $this->customerRepository->method('find')->willReturn(null);
        $this->connection->expects($this->once())->method('executeStatement');
        $this->entityManager->expects($this->exactly(2))->method('persist');
        $this->entityManager->expects($this->atLeastOnce())->method('flush');

        $tester = $this->makeCommandTester();
        $tester->execute([]);

        $this->assertSame(Command::SUCCESS, $tester->getStatusCode());
        $this->assertStringContainsString('Imported 2 customers', $tester->getDisplay());
        $this->assertStringContainsString('Imported 0 orders', $tester->getDisplay());
    }

    public function testSkipsDuplicateCustomers(): void
    {
        $this->writeCustomersCsv(
            "customer_id;title;lastname;firstname;postal_code;city;email\n" .
                "1;2;Norris;Chuck;83600;FrÃ©jus;chuck@norris.com\n"
        );
        $this->writePurchasesCsv("purchase_identifier;customer_id;product_id;quantity;price;currency;date\n");

        $this->customerRepository->method('find')->willReturn(new Customer());
        $this->connection->expects($this->once())->method('executeStatement');
        $this->entityManager->expects($this->never())->method('persist');
        $this->entityManager->expects($this->atLeastOnce())->method('flush');

        $tester = $this->makeCommandTester();
        $tester->execute([]);

        $this->assertSame(Command::SUCCESS, $tester->getStatusCode());
        $this->assertStringContainsString('Imported 0 customers', $tester->getDisplay());
    }

    public function testTitleMappingIsApplied(): void
    {
        $this->writeCustomersCsv(
            "customer_id;title;lastname;firstname;postal_code;city;email\n" .
                "1;1;Galante;Marie;;;marie@france.fr\n" .
                "2;2;Norris;Chuck;83600;city;chuck@email.fr\n" .
                "3;;Unknown;Person;;;unknown@email.fr\n"
        );
        $this->writePurchasesCsv("purchase_identifier;customer_id;product_id;quantity;price;currency;date\n");

        $this->customerRepository->method('find')->willReturn(null);
        $this->connection->method('executeStatement');

        /** @var Customer[] $captured */
        $captured = [];
        $this->entityManager
            ->method('persist')
            ->willReturnCallback(function (object $entity) use (&$captured): void {
                if ($entity instanceof Customer) {
                    $captured[] = $entity;
                }
            });
        $this->entityManager->method('flush');

        $tester = $this->makeCommandTester();
        $tester->execute([]);

        $this->assertCount(3, $captured);
        $this->assertSame('mme', $captured[0]->getTitle());
        $this->assertSame('m', $captured[1]->getTitle());
        $this->assertNull($captured[2]->getTitle());
    }

    public function testSkipsRowsWithInsufficientColumns(): void
    {
        $this->writeCustomersCsv(
            "customer_id;title;lastname;firstname;postal_code;city;email\n" .
                "1;2\n"
        );
        $this->writePurchasesCsv("purchase_identifier;customer_id;product_id;quantity;price;currency;date\n");

        $this->customerRepository->method('find')->willReturn(null);
        $this->connection->method('executeStatement');
        $this->entityManager->expects($this->never())->method('persist');
        $this->entityManager->method('flush');

        $tester = $this->makeCommandTester();
        $tester->execute([]);

        $this->assertSame(Command::SUCCESS, $tester->getStatusCode());
        $this->assertStringContainsString('Imported 0 customers', $tester->getDisplay());
    }

    // -------------------------------------------------------------------------
    // Import commandes
    // -------------------------------------------------------------------------

    public function testImportsOrders(): void
    {
        $this->writeCustomersCsv("customer_id;title;lastname;firstname;postal_code;city;email\n");
        $this->writePurchasesCsv(
            "purchase_identifier;customer_id;product_id;quantity;price;currency;date\n" .
                "2/01;2;1221;1;10;\"EUR\";2024-11-01\n" .
                "1/01;1;4324;1;7;\"EUR\";2024-11-02\n"
        );

        $this->customerRepository->method('find')->willReturn(new Customer());
        $this->connection->expects($this->once())->method('executeStatement');
        $this->entityManager->expects($this->exactly(2))->method('persist');
        $this->entityManager->expects($this->atLeastOnce())->method('flush');

        $tester = $this->makeCommandTester();
        $tester->execute([]);

        $this->assertSame(Command::SUCCESS, $tester->getStatusCode());
        $this->assertStringContainsString('Imported 2 orders', $tester->getDisplay());
    }

    public function testSkipsOrderWhenCustomerNotFound(): void
    {
        $this->writeCustomersCsv("customer_id;title;lastname;firstname;postal_code;city;email\n");
        $this->writePurchasesCsv(
            "purchase_identifier;customer_id;product_id;quantity;price;currency;date\n" .
                "1/01;999;4324;1;7;\"EUR\";2024-11-02\n"
        );

        $this->customerRepository->method('find')->willReturn(null);
        $this->connection->method('executeStatement');
        $this->entityManager->expects($this->never())->method('persist');
        $this->entityManager->method('flush');

        $tester = $this->makeCommandTester();
        $tester->execute([]);

        $this->assertSame(Command::SUCCESS, $tester->getStatusCode());
        $this->assertStringContainsString('Imported 0 orders', $tester->getDisplay());
    }

    public function testCustomOptionsForFilePaths(): void
    {
        mkdir($this->tempDir . '/custom', 0777, true);
        file_put_contents(
            $this->tempDir . '/custom/clients.csv',
            "customer_id;title;lastname;firstname;postal_code;city;email\n" .
                "1;2;Norris;Chuck;83600;FrÃ©jus;chuck@norris.com\n"
        );
        file_put_contents(
            $this->tempDir . '/custom/orders.csv',
            "purchase_identifier;customer_id;product_id;quantity;price;currency;date\n"
        );

        $this->customerRepository->method('find')->willReturn(null);
        $this->connection->method('executeStatement');
        $this->entityManager->expects($this->once())->method('persist');
        $this->entityManager->method('flush');

        $tester = $this->makeCommandTester();
        $tester->execute([
            '--customers-file' => 'custom/clients.csv',
            '--purchases-file' => 'custom/orders.csv',
        ]);

        $this->assertSame(Command::SUCCESS, $tester->getStatusCode());
        $this->assertStringContainsString('Imported 1 customers', $tester->getDisplay());
    }

    // -------------------------------------------------------------------------
    // Validation â€” empty rows
    // -------------------------------------------------------------------------

    public function testSkipsEmptyCustomerRows(): void
    {
        $this->writeCustomersCsv(
            "customer_id;title;lastname;firstname;postal_code;city;email\n" .
                "1;2;Norris;Chuck;83600;FrÃ©jus;chuck@norris.com\n" .
                ";;;;;;;\n" .
                "2;1;Galante;Marie;;;marie@france.fr\n"
        );
        $this->writePurchasesCsv("purchase_identifier;customer_id;product_id;quantity;price;currency;date\n");

        $this->customerRepository->method('find')->willReturn(null);
        $this->connection->method('executeStatement');
        $this->entityManager->expects($this->exactly(2))->method('persist');
        $this->entityManager->method('flush');

        $tester = $this->makeCommandTester();
        $tester->execute([]);

        $this->assertSame(Command::SUCCESS, $tester->getStatusCode());
        $this->assertStringContainsString('Imported 2 customers', $tester->getDisplay());
    }

    public function testSkipsCustomerRowsWithMissingRequiredFields(): void
    {
        $this->writeCustomersCsv(
            "customer_id;title;lastname;firstname;postal_code;city;email\n" .
                "1;;Norris;Chuck;83600;FrÃ©jus;chuck@norris.com\n" .   // valid (title optional)
                "2;2;;Marie;;;marie@france.fr\n" .                    // invalid: missing lastname
                "3;2;Dupont;;75000;Paris;\n" .                        // invalid: missing firstname
                "4;2;Durand;Paul;75000;Paris;\n"                       // invalid: missing email
        );
        $this->writePurchasesCsv("purchase_identifier;customer_id;product_id;quantity;price;currency;date\n");

        $this->customerRepository->method('find')->willReturn(null);
        $this->connection->method('executeStatement');
        // Only row 1 is valid
        $this->entityManager->expects($this->exactly(1))->method('persist');
        $this->entityManager->method('flush');

        $tester = $this->makeCommandTester();
        $tester->execute([]);

        $this->assertSame(Command::SUCCESS, $tester->getStatusCode());
        $this->assertStringContainsString('Imported 1 customers', $tester->getDisplay());
    }

    public function testSkipsOrderRowsWithInvalidFormats(): void
    {
        $this->writeCustomersCsv("customer_id;title;lastname;firstname;postal_code;city;email\n");
        $this->writePurchasesCsv(
            "purchase_identifier;customer_id;product_id;quantity;price;currency;date\n" .
                ";1;1221;1;10;\"EUR\";2024-11-01\n" .          // invalid: missing purchase_identifier
                "1/01;abc;1221;1;7;\"EUR\";2024-11-02\n" .     // invalid: non-numeric customer_id
                "2/01;2;xyz;1;9;\"EUR\";2024-11-03\n" .        // invalid: non-numeric product_id
                "3/01;3;1221;0;10;\"EUR\";2024-11-04\n" .      // invalid: quantity = 0
                "4/01;4;1221;1;-5;\"EUR\";2024-11-05\n" .      // invalid: negative price
                "5/01;5;1221;1;10;\"EUR\";not-a-date\n"        // invalid: bad date format
        );

        $this->customerRepository->method('find')->willReturn(new Customer());
        $this->connection->method('executeStatement');
        $this->entityManager->expects($this->never())->method('persist');
        $this->entityManager->method('flush');

        $tester = $this->makeCommandTester();
        $tester->execute([]);

        $this->assertSame(Command::SUCCESS, $tester->getStatusCode());
        $this->assertStringContainsString('Imported 0 orders', $tester->getDisplay());
    }

    // -------------------------------------------------------------------------
    // Error CSV files generation
    // -------------------------------------------------------------------------

    public function testCreatesErrorImportDirectory(): void
    {
        $this->writeCustomersCsv("customer_id;title;lastname;firstname;postal_code;city;email\n");
        $this->writePurchasesCsv("purchase_identifier;customer_id;product_id;quantity;price;currency;date\n");

        $this->connection->method('executeStatement');
        $this->entityManager->method('flush');

        $tester = $this->makeCommandTester();
        $tester->execute([]);

        $this->assertDirectoryExists($this->tempDir . '/data/errorImport');
    }

    public function testWritesCustomerErrorsFile(): void
    {
        $this->writeCustomersCsv(
            "customer_id;title;lastname;firstname;postal_code;city;email\n" .
                "2;2;;Marie;;;marie@france.fr\n"  // invalid: missing lastname
        );
        $this->writePurchasesCsv("purchase_identifier;customer_id;product_id;quantity;price;currency;date\n");

        $this->customerRepository->method('find')->willReturn(null);
        $this->connection->method('executeStatement');
        $this->entityManager->method('flush');

        $tester = $this->makeCommandTester();
        $tester->execute([]);

        $errorFile = $this->tempDir . '/data/errorImport/customers_errors.csv';
        $this->assertFileExists($errorFile);

        $content = file_get_contents($errorFile);
        $this->assertIsString($content);
        $this->assertStringContainsString('reason', $content);
        $this->assertStringContainsString('lastname', $content);
    }

    public function testWritesPurchasesErrorsFile(): void
    {
        $this->writeCustomersCsv("customer_id;title;lastname;firstname;postal_code;city;email\n");
        $this->writePurchasesCsv(
            "purchase_identifier;customer_id;product_id;quantity;price;currency;date\n" .
                "1/01;abc;1221;1;7;\"EUR\";2024-11-02\n"  // invalid: non-numeric customer_id
        );

        $this->customerRepository->method('find')->willReturn(null);
        $this->connection->method('executeStatement');
        $this->entityManager->method('flush');

        $tester = $this->makeCommandTester();
        $tester->execute([]);

        $errorFile = $this->tempDir . '/data/errorImport/purchases_errors.csv';
        $this->assertFileExists($errorFile);

        $content = file_get_contents($errorFile);
        $this->assertIsString($content);
        $this->assertStringContainsString('reason', $content);
        $this->assertStringContainsString('customer_id', $content);
    }

    public function testEmptyErrorFilesWhenNoErrors(): void
    {
        $this->writeCustomersCsv(
            "customer_id;title;lastname;firstname;postal_code;city;email\n" .
                "1;2;Norris;Chuck;83600;FrÃ©jus;chuck@norris.com\n"
        );
        $this->writePurchasesCsv(
            "purchase_identifier;customer_id;product_id;quantity;price;currency;date\n" .
                "1/01;1;4324;1;7;\"EUR\";2024-11-02\n"
        );

        $this->customerRepository->method('find')->willReturn(null);
        $this->connection->method('executeStatement');
        $this->entityManager->method('persist');
        $this->entityManager->method('flush');

        // Override find for orders â€” first call returns null (no customer YET), second returns customer
        // Use a counter-based approach
        $customer = new Customer();
        $callCount = 0;
        $this->customerRepository->method('find')->willReturnCallback(
            function () use (&$callCount, $customer) {
                $callCount++;
                return $customer; // always returns found customer
            }
        );

        $tester = $this->makeCommandTester();
        $tester->execute([]);

        $customersErrorFile = $this->tempDir . '/data/errorImport/customers_errors.csv';
        $purchasesErrorFile = $this->tempDir . '/data/errorImport/purchases_errors.csv';

        $this->assertFileExists($customersErrorFile);
        $this->assertFileExists($purchasesErrorFile);

        // Only header row should be present when no errors
        $lines = array_filter(explode("\n", trim((string) file_get_contents($customersErrorFile))));
        $this->assertCount(1, $lines); // only header
    }
}

