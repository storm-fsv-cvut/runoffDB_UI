<?php


namespace App\Form;


use App\Entity\AssignmentType;
use App\Entity\Run;
use App\Entity\RunType as RunTypeEntity;
use App\Entity\SoilSample;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\Form\Extension\Core\Type\DateTimeType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\NumberType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\TimeType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class RunType extends AbstractType {
    public function buildForm(FormBuilderInterface $builder, array $options) {
        $builder
            ->add('runType', EntityType::class, [
                'class' => RunTypeEntity::class,
                'label' => "runType"
            ])
            ->add('soilSampleBulk', EntityType::class, [
                'class' => SoilSample::class,
                'label' => "soilSampleBulk"
            ])
            ->add('bulkAssignmentType', EntityType::class, [
                'class' => AssignmentType::class,
                'label' => "assignmentType"
            ])
            ->add('soilSampleTexture', EntityType::class, [
                'class' => SoilSample::class,
                'label' => "soilSampleBulk"
            ])
            ->add('textureAssignmentType', EntityType::class, [
                'class' => AssignmentType::class,
                'label' => "assignmentType"
            ])
            ->add('soilSampleCorq', EntityType::class, [
                'class' => SoilSample::class,
                'label' => "soilSampleBulk"
            ])
            ->add('corqAssignmentType', EntityType::class, [
                'class' => AssignmentType::class,
                'label' => "assignmentType"
            ])
            ->add('runoffStart', TimeType::class, [
                'label' => 'runoffStart',
                'widget'=>'single_text'
            ])
            ->add('pondingStart', TimeType::class, [
                'label' => 'pondingStart',
                'widget'=>'single_text'
            ])
            ->add('precedingPrecipitation', NumberType::class, [
                'label' => 'precedingPrecipitation'
            ])
            ->add('noteCZ', TextareaType::class, [
                'label' => 'noteCZ'
            ])
            ->add('noteEN', TextareaType::class, [
                'label' => 'noteEN'
            ])
            ->add('datetime', DateTimeType::class, [
                'label' => 'datetime',
                'widget'=>'single_text'
            ])
            ->add('rawData', FileType::class, [
                'label' => 'rawData',
                'multiple' => true,
                'required' => false,
                'mapped'=>false
            ])
            ->add('save', SubmitType::class,[
                'attr'=>['class'=>'btn btn-success']
            ]);

        $builder->add('rainIntensityData', CollectionType::class, [
            'entry_type' => DataType::class,
            'label'=>'rain_intensity',
            'mapped' => false,
            'prototype' => true,
            'allow_add' => true,
            'allow_delete' => true,
        ]);

        $builder->add('initMoistureData', CollectionType::class, [
            'entry_type' => DataType::class,
            'label'=>'init_moisture',
            'mapped' => false,
            'prototype' => true,
            'allow_add' => true,
            'allow_delete' => true,
        ]);


    }

    public function configureOptions(OptionsResolver $resolver) {
        $resolver->setDefaults([
            'data_class' => Run::class,
        ]);
    }
}
