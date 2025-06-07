<?php

namespace App\Services;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Contracts\Translation\TranslatorInterface;

class DefinitionEntityService
{
    public function __construct(
        private EntityManagerInterface $em,
    )
    {
    }

    public function getDefinitionEntitiesArray(): array
    {
        $definitionEntities = [];
        foreach ($this->em->getMetadataFactory()->getAllMetadata() as $entity) {
            if (in_array(
                'App\Entity\DefinitionEntityInterface',
                $entity->getReflectionClass()->getInterfaceNames(),
                true
            )) {
                $definitionEntities[] = $entity->name;
            }
        }

        return $definitionEntities;
    }
}
