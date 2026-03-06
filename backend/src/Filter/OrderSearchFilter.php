<?php

namespace App\Filter;

use ApiPlatform\Doctrine\Orm\Filter\AbstractFilter;
use ApiPlatform\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use ApiPlatform\Metadata\Operation;
use Doctrine\ORM\QueryBuilder;

class OrderSearchFilter extends AbstractFilter
{
    protected function filterProperty(
        string $property,
        mixed $value,
        QueryBuilder $queryBuilder,
        QueryNameGeneratorInterface $queryNameGenerator,
        string $resourceClass,
        ?Operation $operation = null,
        array $context = []
    ): void {
        if ($property !== 'search' || empty($value)) {
            return;
        }

        $paramName = $queryNameGenerator->generateParameterName('search');
        $alias = $queryBuilder->getRootAliases()[0];

        $queryBuilder
            ->andWhere(
                "$alias.purchaseIdentifier LIKE :$paramName OR " .
                    "CONCAT($alias.productId, '') LIKE :$paramName OR " .
                    "CONCAT($alias.quantity, '') LIKE :$paramName OR " .
                    "CONCAT($alias.price, '') LIKE :$paramName"
            )
            ->setParameter($paramName, '%' . $value . '%');
    }

    public function getDescription(string $resourceClass): array
    {
        return [
            'search' => [
                'property' => null,
                'type' => 'string',
                'required' => false,
                'description' => 'Search across purchaseIdentifier, productId, quantity and price (OR)',
            ],
        ];
    }
}
