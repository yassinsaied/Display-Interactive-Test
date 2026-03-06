<?php

namespace App\Command;

use App\Entity\Customer;
use App\Entity\Order;
use App\Repository\CustomerRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'ugo:orders:import',
    description: 'Import customers and orders from CSV files',
)]
class ImportOrdersCommand extends Command
{
    private const TITLE_MAPPING = [
        '1' => 'mme',
        '2' => 'm',
    ];

    private const CUSTOMER_HEADERS = ['customer_id', 'title', 'lastname', 'firstname', 'postal_code', 'city', 'email'];
    private const PURCHASE_HEADERS = ['purchase_identifier', 'customer_id', 'product_id', 'quantity', 'price', 'currency', 'date'];

    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly CustomerRepository $customerRepository,
        private readonly string $projectDir
    ) {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this
            ->addOption('customers-file', null, InputOption::VALUE_OPTIONAL, 'Path to customers CSV file', 'data/customers.csv')
            ->addOption('purchases-file', null, InputOption::VALUE_OPTIONAL, 'Path to purchases CSV file', 'data/purchases.csv');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $customersFile = $this->projectDir . '/' . $input->getOption('customers-file');
        $purchasesFile = $this->projectDir . '/' . $input->getOption('purchases-file');

        $io->title('UGO Orders Import');

        // Validate files exist
        if (!file_exists($customersFile)) {
            $io->error(sprintf('Customers file not found: %s', $customersFile));
            return Command::FAILURE;
        }

        if (!file_exists($purchasesFile)) {
            $io->error(sprintf('Purchases file not found: %s', $purchasesFile));
            return Command::FAILURE;
        }

        // Ensure error output directory exists
        $errorDir = $this->projectDir . '/data/errorImport';
        if (!is_dir($errorDir)) {
            mkdir($errorDir, 0777, true);
        }

        // Import customers
        $io->section('Importing customers...');
        [$customersCount, $customerErrors] = $this->importCustomers($customersFile, $io);
        $this->writeErrorCsv(
            $errorDir . '/customers_errors.csv',
            self::CUSTOMER_HEADERS,
            $customerErrors
        );
        $io->success(sprintf('Imported %d customers', $customersCount));
        if (count($customerErrors) > 0) {
            $io->warning(sprintf('%d invalid customer row(s) written to data/errorImport/customers_errors.csv', count($customerErrors)));
        }

        // Import orders
        $io->section('Importing orders...');
        [$ordersCount, $orderErrors] = $this->importOrders($purchasesFile, $io);
        $this->writeErrorCsv(
            $errorDir . '/purchases_errors.csv',
            self::PURCHASE_HEADERS,
            $orderErrors
        );
        $io->success(sprintf('Imported %d orders', $ordersCount));
        if (count($orderErrors) > 0) {
            $io->warning(sprintf('%d invalid order row(s) written to data/errorImport/purchases_errors.csv', count($orderErrors)));
        }

        $io->success('Import completed successfully!');

        return Command::SUCCESS;
    }

    /**
     * @return array{int, list<array<string, string>>}
     */
    private function importCustomers(string $filePath, SymfonyStyle $io): array
    {
        $handle = fopen($filePath, 'r');
        if ($handle === false) {
            throw new \RuntimeException('Cannot open customers file');
        }

        $count = 0;
        $errors = [];
        $isFirstRow = true;

        while (($row = fgetcsv($handle, 0, ';')) !== false) {
            // Skip header row
            if ($isFirstRow) {
                $isFirstRow = false;
                continue;
            }

            // Detect and skip truly empty rows (all fields empty/whitespace)
            if ($this->isEmptyRow($row)) {
                $errors[] = $this->buildErrorRow($row, 7, 'Empty row');
                continue;
            }

            // Validate minimum column count
            if (count($row) < 7) {
                $errors[] = $this->buildErrorRow($row, 7, sprintf('Insufficient columns: expected 7, got %d', count($row)));
                continue;
            }

            // Validate required fields
            $validationError = $this->validateCustomerRow($row);
            if ($validationError !== null) {
                $errors[] = $this->buildErrorRow($row, 7, $validationError);
                continue;
            }

            $customerId = (int) trim($row[0]);

            // Check if customer already exists
            $existingCustomer = $this->customerRepository->find($customerId);
            if ($existingCustomer) {
                $io->note(sprintf('Customer ID %d already exists, skipping', $customerId));
                continue;
            }

            $customer = new Customer();
            $customer->setId($customerId);
            $customer->setTitle($this->mapTitle(trim($row[1])));
            $customer->setLastname($this->sanitize($row[2]));
            $customer->setFirstname($this->sanitize($row[3]));
            $customer->setPostalCode($this->sanitize($row[4]));
            $customer->setCity($this->sanitize($row[5]));
            $customer->setEmail($this->sanitize($row[6]));

            $this->entityManager->persist($customer);
            $count++;

            // Batch flush every 50 records
            if ($count % 50 === 0) {
                $this->entityManager->flush();
                $io->note(sprintf('Processed %d customers...', $count));
            }
        }

        fclose($handle);
        $this->entityManager->flush();

        // Reset auto-increment to continue from last ID
        $connection = $this->entityManager->getConnection();
        $connection->executeStatement('ALTER TABLE customer AUTO_INCREMENT = 1');

        return [$count, $errors];
    }

    /**
     * @return array{int, list<array<string, string>>}
     */
    private function importOrders(string $filePath, SymfonyStyle $io): array
    {
        $handle = fopen($filePath, 'r');
        if ($handle === false) {
            throw new \RuntimeException('Cannot open purchases file');
        }

        $count = 0;
        $errors = [];
        $isFirstRow = true;

        while (($row = fgetcsv($handle, 0, ';')) !== false) {
            // Skip header row
            if ($isFirstRow) {
                $isFirstRow = false;
                continue;
            }

            // Detect and skip truly empty rows
            if ($this->isEmptyRow($row)) {
                $errors[] = $this->buildErrorRow($row, 7, 'Empty row');
                continue;
            }

            // Validate minimum column count
            if (count($row) < 7) {
                $errors[] = $this->buildErrorRow($row, 7, sprintf('Insufficient columns: expected 7, got %d', count($row)));
                continue;
            }

            // Validate required fields and formats
            $validationError = $this->validateOrderRow($row);
            if ($validationError !== null) {
                $errors[] = $this->buildErrorRow($row, 7, $validationError);
                continue;
            }

            $customerId = (int) trim($row[1]);
            $customer = $this->customerRepository->find($customerId);

            if (!$customer) {
                $io->warning(sprintf('Customer ID %d not found, skipping order %s', $customerId, $row[0]));
                $errors[] = $this->buildErrorRow($row, 7, sprintf('Customer ID %d not found', $customerId));
                continue;
            }

            $order = new Order();
            $order->setPurchaseIdentifier(trim($row[0]));
            $order->setCustomer($customer);
            $order->setProductId((int) trim($row[2]));
            $order->setQuantity((int) trim($row[3]));
            $order->setPrice(trim($row[4]));
            $order->setCurrency(trim(trim($row[5]), '"'));
            $order->setDate(new \DateTime(trim($row[6])));

            $this->entityManager->persist($order);
            $count++;

            // Batch flush every 50 records
            if ($count % 50 === 0) {
                $this->entityManager->flush();
                $io->note(sprintf('Processed %d orders...', $count));
            }
        }

        fclose($handle);
        $this->entityManager->flush();

        return [$count, $errors];
    }

    /**
     * Returns true when all fields in the row are empty/whitespace-only.
     *
     * @param array<int, string|null> $row
     */
    private function isEmptyRow(array $row): bool
    {
        foreach ($row as $field) {
            if (trim((string) $field) !== '') {
                return false;
            }
        }
        return true;
    }

    /**
     * Validates a customer row. Returns an error message or null on success.
     *
     * @param array<int, string> $row
     */
    private function validateCustomerRow(array $row): ?string
    {
        // customer_id must be a positive integer
        if (!ctype_digit(trim($row[0])) || (int) trim($row[0]) <= 0) {
            return sprintf('Invalid customer_id: "%s" (must be a positive integer)', trim($row[0]));
        }

        // lastname is required
        if (trim($row[2]) === '') {
            return 'Missing required field: lastname';
        }

        // firstname is required
        if (trim($row[3]) === '') {
            return 'Missing required field: firstname';
        }

        // email is required and must contain @
        if (trim($row[6]) === '') {
            return 'Missing required field: email';
        }

        if (!str_contains(trim($row[6]), '@')) {
            return sprintf('Invalid email format: "%s"', trim($row[6]));
        }

        return null;
    }

    /**
     * Validates an order row. Returns an error message or null on success.
     *
     * @param array<int, string> $row
     */
    private function validateOrderRow(array $row): ?string
    {
        // purchase_identifier is required
        if (trim($row[0]) === '') {
            return 'Missing required field: purchase_identifier';
        }

        // customer_id must be a positive integer
        if (!ctype_digit(trim($row[1])) || (int) trim($row[1]) <= 0) {
            return sprintf('Invalid customer_id: "%s" (must be a positive integer)', trim($row[1]));
        }

        // product_id must be a positive integer
        if (!ctype_digit(trim($row[2])) || (int) trim($row[2]) <= 0) {
            return sprintf('Invalid product_id: "%s" (must be a positive integer)', trim($row[2]));
        }

        // quantity must be a positive integer
        if (!ctype_digit(trim($row[3])) || (int) trim($row[3]) <= 0) {
            return sprintf('Invalid quantity: "%s" (must be a positive integer)', trim($row[3]));
        }

        // price must be a positive numeric value
        $price = trim($row[4]);
        if (!is_numeric($price) || (float) $price <= 0) {
            return sprintf('Invalid price: "%s" (must be a positive number)', $price);
        }

        // currency is required
        if (trim(trim($row[5]), '"') === '') {
            return 'Missing required field: currency';
        }

        // date must be a valid date
        $date = trim($row[6]);
        if ($date === '' || \DateTime::createFromFormat('Y-m-d', $date) === false) {
            return sprintf('Invalid date format: "%s" (expected YYYY-MM-DD)', $date);
        }

        return null;
    }

    /**
     * Builds an error row array padded to exactly $expectedColumns fields, plus a 'reason' field.
     *
     * @param array<int, string|null> $row
     * @return array<string, string>
     */
    private function buildErrorRow(array $row, int $expectedColumns, string $reason): array
    {
        $padded = array_map(fn($v) => (string) ($v ?? ''), $row);
        while (count($padded) < $expectedColumns) {
            $padded[] = '';
        }
        $padded = array_slice($padded, 0, $expectedColumns);
        $padded[] = $reason;
        return $padded;
    }

    /**
     * Writes error rows to a CSV file.
     *
     * @param string[] $headers
     * @param list<array<string, string>> $errors
     */
    private function writeErrorCsv(string $filePath, array $headers, array $errors): void
    {
        $handle = fopen($filePath, 'w');
        if ($handle === false) {
            return;
        }

        // Write header row with extra 'reason' column
        fputcsv($handle, [...$headers, 'reason'], ';');

        foreach ($errors as $row) {
            fputcsv($handle, $row, ';');
        }

        fclose($handle);
    }

    private function mapTitle(?string $title): ?string
    {
        if ($title === null || $title === '') {
            return null;
        }

        return self::TITLE_MAPPING[$title] ?? null;
    }

    private function sanitize(?string $value): ?string
    {
        if ($value === null) {
            return null;
        }
        return trim($value) ?: null;
    }
}

