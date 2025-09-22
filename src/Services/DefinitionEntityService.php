<?php

declare(strict_types=1);

namespace App\Services;

use Doctrine\ORM\EntityManagerInterface;

class DefinitionEntityService
{
    public function __construct(
        private EntityManagerInterface $em,
    ) {
    }

    public function getDefinitionEntitiesArray(): array
    {
        $definitionEntities = [];
        foreach ($this->em->getMetadataFactory()->getAllMetadata() as $entity) {
            if (in_array(
                'App\Entity\DefinitionEntityInterface',
                $entity->getReflectionClass()->getInterfaceNames(),
                true,
            )) {
                $definitionEntities[] = $entity->name;
            }
        }

        return $definitionEntities;
    }
}
