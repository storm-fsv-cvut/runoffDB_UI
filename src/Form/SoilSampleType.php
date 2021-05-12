<?php

namespace App\Form;

use App\Entity\Organization;
use App\Entity\SoilSample;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class SoilSampleType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('dateSampled', DateType::class,['widget'=>'single_text'])
            ->add('sampleLocation')
            ->add('descriptionCZ')
            ->add('descriptionEN')
            ->add('sampleDepthM')
            ->add('dateProcessed', DateType::class,['widget'=>'single_text'])
            ->add('rawDataPath')
            ->add('processedAt')
            ->add('plot')
            ->add('wrbSoilClass')
            ->add('locality')
            ->add('Run')
            ->add('save', SubmitType::class,[
                'attr'=>['class'=>'btn btn-success']
            ]);



        $builder->add('measurements', CollectionType::class, [
            'entry_type' => MeasurementType::class,
            'label'=>'measurement',
            'prototype' => true,
            'allow_add' => true,
            'allow_delete' => true,
            'required'=>false
        ]);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => SoilSample::class,
        ]);
    }
}
