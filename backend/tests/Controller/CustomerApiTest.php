<?php

namespace App\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class CustomerApiTest extends WebTestCase
{
    public function testGetCustomersReturnsSuccessfulResponse(): void
    {
        $client = static::createClient();

        $client->request('GET', '/api/customers');

        $this->assertResponseIsSuccessful();
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
    }

    public function testGetCustomersReturnsJsonArray(): void
    {
        $client = static::createClient();

        $client->request('GET', '/api/customers');

        $content = json_decode($client->getResponse()->getContent(), true);

        $this->assertIsArray($content);
        $this->assertArrayHasKey('hydra:member', $content);
    }

    public function testGetCustomerOrdersWithInvalidIdReturnsEmptyCollection(): void
    {
        $client = static::createClient();

        $client->request('GET', '/api/customers/99999/orders');

        // API Platform retourne une collection vide (200) quand le customer n'existe pas
        $this->assertResponseIsSuccessful();
        $content = json_decode($client->getResponse()->getContent(), true);
        $this->assertArrayHasKey('hydra:member', $content);
        $this->assertEmpty($content['hydra:member']);
        $this->assertSame(0, $content['hydra:totalItems']);
    }

    public function testGetCustomerOrdersReturnsJsonLd(): void
    {
        $client = static::createClient();

        $client->request('GET', '/api/customers/1/orders');

        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
    }

    public function testGetCustomerOrdersResponseHasHydraShape(): void
    {
        $client = static::createClient();

        $client->request('GET', '/api/customers/1/orders');

        $response = $client->getResponse();

        if ($response->getStatusCode() === 200) {
            $content = json_decode($response->getContent(), true);
            $this->assertArrayHasKey('hydra:member', $content);
            $this->assertIsArray($content['hydra:member']);
        } else {
            $this->assertSame(404, $response->getStatusCode());
        }
    }
}
