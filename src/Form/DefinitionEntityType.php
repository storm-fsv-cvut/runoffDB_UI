<?php

namespace App\Form;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\FormBuilderInterface;

class DefinitionEntityType extends AbstractType {

    /**
     * @var EntityManagerInterface
     */
    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager) {

        $this->entityManager = $entityManager;
    }

    public function buildForm(FormBuilderInterface $builder, array $options) {
        $metadata = $this->entityManager->getMetadataFactory()->getMetadataFor($builder->getDataClass());
        foreach ($metadata->getFieldNames() as $field) {
            if ($field != 'id') {
                $builder->add($field, null, ['label' => $field]);
            }
        }
        foreach ($metadata->getAssociationNames() as $associationName) {
            $targetClass = ($metadata->getAssociationTargetClass($associationName));
            $targetClassArray = explode("\\",$targetClass);
            if (strpos($metadata->getReflectionClass()->getProperty($associationName)->getDocComment(), "mappedBy")) {
                if (class_exists("App\Form\\".end($targetClassArray)."Type")) {
                    $builder->add($associationName, CollectionType::class, [
                        'entry_type' => "App\Form\\".end($targetClassArray)."Type",
                        'label' => $associationName,
                        'mapped' => true,
                        'prototype' => true,
                        'allow_add' => true,
                        'allow_delete' => true,
                        'required' => false,
                        'by_reference' => false
                    ]);
                }
            } else {
                $metadata->getAssociationMappedByTargetField($associationName);
                $targetClass = ($metadata->getAssociationTargetClass($associationName));
                $builder->add($associationName, EntityType::class, ['class' => $targetClass]);
            }
        }

        $builder->add('save', SubmitType::class);
    }

}
