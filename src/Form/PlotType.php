<?php

declare(strict_types=1);

namespace App\Form;

use App\Entity\Agrotechnology;
use App\Entity\Crop;
use App\Entity\Locality;
use App\Entity\Plot;
use App\Entity\ProtectionMeasure;
use App\Form\Type\DescendingIdEntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\Extension\Core\Type\NumberType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class PlotType extends AbstractType
{
    public function buildForm(
        FormBuilderInterface $builder,
        array $options,
    ): void {
        $builder
            ->add('name', null, [
                'label' => 'name',
                'required' => true,
            ])
            ->add('locality', DescendingIdEntityType::class, [
                'class' => Locality::class,
                'label' => 'locality',
                'required' => false,
                'placeholder' => '',
            ])
            ->add('soilOriginLocality', DescendingIdEntityType::class, [
                'class' => Locality::class,
                'label' => 'soilOriginLocality',
                'required' => false,
                'placeholder' => '',
            ])
            ->add('crop', DescendingIdEntityType::class, [
                'class' => Crop::class,
                'label' => 'crop',
                'required' => false,
                'placeholder' => '',
            ])
            ->add('agrotechnology', DescendingIdEntityType::class, [
                'class' => Agrotechnology::class,
                'label' => 'agrotechnology',
                'required' => false,
                'placeholder' => '',
            ])
            ->add('established', DateType::class, [
                'widget' => 'single_text',
                'label' => 'established',
                'required' => true,
            ])
            ->add('plotWidth', NumberType::class, [
                'label' => 'plotWidth',
                'required' => true,
            ])
            ->add('plotLength', NumberType::class, [
                'label' => 'plotLength',
                'required' => true,
            ])
            ->add('plotSlope', NumberType::class, [
                'label' => 'plotSlope',
                'required' => true,
            ])
            ->add('noteCZ', TextareaType::class, [
                'label' => 'noteCZ',
                'required' => false,
            ])
            ->add('noteEN', TextareaType::class, [
                'label' => 'noteEN',
                'required' => false,
            ])
            ->add('protectionMeasures', DescendingIdEntityType::class, [
                'class' => ProtectionMeasure::class,
                'label' => 'protection measure',
                'multiple' => true,
                'expanded' => true, // nebo true pro checkboxy
                'required' => false,
            ]);
        $builder->add(
            'save',
            SubmitType::class,
            [
                'attr' => ['class' => 'btn btn-success'],
                'label' => 'save',
            ],
        );
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults(
            [
                'data_class' => Plot::class,
            ],
        );
    }
}
