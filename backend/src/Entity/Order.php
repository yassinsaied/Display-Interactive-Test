<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Link;
use App\Filter\OrderSearchFilter;
use App\Repository\OrderRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: OrderRepository::class)]
#[ORM\Table(name: '`order`')]
#[ApiResource(
    operations: [

        new GetCollection(
            uriTemplate: '/customers/{customerId}/orders',
            uriVariables: [
                'customerId' => new Link(
                    fromClass: Customer::class,
                    toProperty: 'customer',
                ),
            ],
            normalizationContext: ['groups' => ['order:read']],
            paginationEnabled: true,
            paginationItemsPerPage: 10,
            paginationClientEnabled: true,
        ),
    ]
)]

#[ApiFilter(OrderSearchFilter::class)]
class Order
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['order:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 50)]
    #[Groups(['order:read'])]
    private ?string $purchaseIdentifier = null;

    #[ORM\Column]
    #[Groups(['order:read'])]
    private ?int $productId = null;

    #[ORM\Column]
    #[Groups(['order:read'])]
    private ?int $quantity = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 10, scale: 2)]
    #[Groups(['order:read'])]
    private ?string $price = null;

    #[ORM\Column(length: 10)]
    #[Groups(['order:read'])]
    private ?string $currency = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    #[Groups(['order:read'])]
    private ?\DateTimeInterface $date = null;

    #[ORM\ManyToOne(inversedBy: 'orders')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['order:read'])]
    private ?Customer $customer = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getPurchaseIdentifier(): ?string
    {
        return $this->purchaseIdentifier;
    }

    public function setPurchaseIdentifier(string $purchaseIdentifier): static
    {
        $this->purchaseIdentifier = $purchaseIdentifier;
        return $this;
    }

    public function getProductId(): ?int
    {
        return $this->productId;
    }

    public function setProductId(int $productId): static
    {
        $this->productId = $productId;
        return $this;
    }

    public function getQuantity(): ?int
    {
        return $this->quantity;
    }

    public function setQuantity(int $quantity): static
    {
        $this->quantity = $quantity;
        return $this;
    }

    public function getPrice(): ?float
    {
        return $this->price !== null ? (float) $this->price : null;
    }

    public function setPrice(string $price): static
    {
        $this->price = $price;
        return $this;
    }

    public function getCurrency(): ?string
    {
        return $this->currency;
    }

    public function setCurrency(string $currency): static
    {
        $this->currency = $currency;
        return $this;
    }

    public function getDate(): ?\DateTimeInterface
    {
        return $this->date;
    }

    public function setDate(\DateTimeInterface $date): static
    {
        $this->date = $date;
        return $this;
    }

    public function getCustomer(): ?Customer
    {
        return $this->customer;
    }

    public function setCustomer(?Customer $customer): static
    {
        $this->customer = $customer;
        return $this;
    }
}
