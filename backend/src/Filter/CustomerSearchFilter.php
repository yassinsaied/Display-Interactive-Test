<?php

namespace App\Filter;

use ApiPlatform\Doctrine\Orm\Filter\AbstractFilter;
use ApiPlatform\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use ApiPlatform\Metadata\Operation;
use Doctrine\ORM\QueryBuilder;

class CustomerSearchFilter extends AbstractFilter
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
                $queryBuilder->expr()->orX(
                    $queryBuilder->expr()->like("$alias.lastname", ":$paramName"),
                    $queryBuilder->expr()->like("$alias.firstname", ":$paramName"),
                    $queryBuilder->expr()->like("$alias.email", ":$paramName"),
                    $queryBuilder->expr()->like("$alias.city", ":$paramName")
                )
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
                'description' => 'Search across lastname, firstname, email and city (OR)',
            ],
        ];
    }
}
