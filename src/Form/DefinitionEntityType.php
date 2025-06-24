<?php

namespace App\Form;

use Exception;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\DateTimeType;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\FormBuilderInterface;

class DefinitionEntityType extends AbstractType
{

    /**
     * @var EntityManagerInterface
     */
    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {

        $this->entityManager = $entityManager;
    }

    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        if ($builder->getDataClass() === null) {
            throw new Exception("No data class set");
        }
        $metadata = $this->entityManager->getMetadataFactory()->getMetadataFor($builder->getDataClass());

        foreach ($metadata->getFieldNames() as $field) {
            if ($field != 'id') {
                if($metadata->getTypeOfField($field)==='date') {
                    $builder->add($field,DateType::class, [
                        'label' => 'date',
                        'widget'=>'single_text',
                        'required'=>true
                    ]);
                } else {
                    $builder->add($field, null, ['label' => $field]);
                }
            }
        }

        foreach ($metadata->getAssociationNames() as $associationName) {
            $targetClass = ($metadata->getAssociationTargetClass($associationName));
            $targetClassArray = explode("\\", $targetClass);
            if ($metadata->getReflectionClass()->getProperty($associationName)->getDocComment() !== false &&
                strpos(
                    $metadata->getReflectionClass()->getProperty($associationName)->getDocComment(),
                    "mappedBy"
                ) !== false) {
            } else {
                $metadata->getAssociationMappedByTargetField($associationName);
                $nullable = str_contains($metadata->getReflectionProperty($associationName)->getDocComment(),'nullable=true');
                $targetClass = ($metadata->getAssociationTargetClass($associationName));
                $builder->add($associationName, EntityType::class, ['class' => $targetClass, 'required' => !$nullable]);
            }
        }

        $builder->add(
            'save',
            SubmitType::class,
            [
                'attr' => ['class' => 'btn btn-success'],
                'label' => 'save'
            ]
        );
    }

}
