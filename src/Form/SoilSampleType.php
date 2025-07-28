<?php

namespace App\Form;

use App\Entity\Locality;
use App\Entity\Plot;
use App\Entity\Run;
use App\Entity\SoilSample;
use App\Form\Type\DescendingIdEntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class SoilSampleType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('dateSampled', DateType::class, ['widget' => 'single_text'])
            ->add('sampleLocation')
            ->add('descriptionCZ')
            ->add('descriptionEN')
            ->add('sampleDepthM')
            ->add('dateProcessed', DateType::class, ['widget' => 'single_text'])
            ->add('rawDataPath')
            ->add('processedAt')
            ->add('plot', DescendingIdEntityType::class, [
                'class' => Plot::class,
                'label' => 'plot',
                'placeholder' => '',
            ])
            ->add('wrbSoilClass')
            ->add('locality', DescendingIdEntityType::class, [
                'class' => Locality::class,
                'label' => 'locality',
                'placeholder' => '',
            ])
            ->add('Run', DescendingIdEntityType::class, [
                'class' => Run::class,
                'label' => 'run',
                'placeholder' => '',
            ])
            ->add(
                'save',
                SubmitType::class,
                [
                    'attr' => ['class' => 'btn btn-success']
                ]
            );

        $builder->add(
            'rawData',
            FileType::class,
            [
                'label' => 'rawData',
                'multiple' => true,
                'required' => false,
                'mapped' => false
            ]
        );

        $builder->add(
            'measurements',
            CollectionType::class,
            [
                'entry_type' => MeasurementType::class,
                'label' => 'measurement',
                'prototype' => true,
                'allow_add' => true,
                'allow_delete' => true,
                'required' => false
            ]
        );
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults(
            [
                'data_class' => SoilSample::class,
            ]
        );
    }
}
