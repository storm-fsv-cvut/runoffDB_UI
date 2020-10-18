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

        $builder->add('save', SubmitType::class, [
            'attr' => ['class' => 'btn btn-success'],
            'label' => 'save'
        ]);
    }

}
