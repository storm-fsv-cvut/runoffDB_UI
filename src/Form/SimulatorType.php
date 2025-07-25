<?php

namespace App\Form;

use App\Entity\Agrotechnology;
use App\Entity\Organization;
use App\Entity\Project;
use App\Entity\Publication;
use App\Entity\Simulator;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class SimulatorType extends AbstractType
{
    public function buildForm(
        FormBuilderInterface $builder,
        array $options
    ): void {
        $builder
            ->add('nameCZ', TextType::class, ['label' => 'nameCz', 'required' => true])
            ->add('nameEN', TextType::class, ['label' => 'nameEn', 'required' => true])
            ->add('descriptionCZ', TextareaType::class, ['label' => 'descriptionCz', 'required' => false])
            ->add('descriptionEN', TextareaType::class, ['label' => 'descriptionEn', 'required' => false])
            ->add('reference', TextType::class, ['label' => 'reference', 'required' => false])
            ->add('organization', EntityType::class, [
                'class' => Organization::class,
                'label' => 'organization',
            ])
            ->add(
                'publications',
                EntityType::class,
                [
                    'expanded' => true,
                    'multiple' => true,
                    'class' => Publication::class,
                    'label' => 'publications',
                    'choice_label' => function (Publication $publication) {
                        return $publication->getTitle();
                    },
                ]
            )
            ->add(
                'save',
                SubmitType::class,
                [
                    'attr' => ['class' => 'btn btn-success'],
                    'label' => 'save'
                ]
            );

        $builder->add(
            'publications',
            EntityType::class,
            [
                'expanded'=>true,
                'multiple'=>true,
                'class' => Publication::class,
                'label' => 'publications'
            ]
        );

        $builder->add(
            'save',
            SubmitType::class,
            [
                'attr' => ['class' => 'btn btn-success'],
                'label' => 'save'
            ]
        );
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults(
            [
                'data_class' => Simulator::class,
            ]
        );
    }
}
