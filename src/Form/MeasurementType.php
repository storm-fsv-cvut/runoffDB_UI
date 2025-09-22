<?php

declare(strict_types=1);

namespace App\Form;

use App\Entity\Locality;
use App\Entity\Measurement;
use App\Entity\Methodics;
use App\Entity\Phenomenon;
use App\Entity\Plot;
use App\Form\Type\DescendingIdEntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class MeasurementType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('descriptionCZ', TextareaType::class, ['label' => 'descriptionCZ', 'required' => false])
            ->add('parent_id', HiddenType::class, ['mapped' => false])
            ->add('descriptionEN', TextareaType::class, ['label' => 'descriptionEN', 'required' => false])
            ->add('noteCZ', TextareaType::class, ['label' => 'noteCZ', 'required' => false])
            ->add('noteEN', TextareaType::class, ['label' => 'noteEN', 'required' => false])
            ->add('phenomenon', DescendingIdEntityType::class, [
                'class' => Phenomenon::class,
                'label' => 'phenomenon',
                'placeholder' => '',
            ])
            ->add('locality', DescendingIdEntityType::class, [
                'class' => Locality::class,
                'label' => 'locality',
                'placeholder' => '',
            ])
            ->add('plot', DescendingIdEntityType::class, [
                'class' => Plot::class,
                'label' => 'plot',
                'placeholder' => '',
            ])
            ->add('date', DateType::class, ['widget' => 'single_text'])
            ->add('methodics', DescendingIdEntityType::class, [
                'class' => Methodics::class,
                'choice_label' => function (Methodics $methodics) {
                    return $methodics->getName();
                },
                'placeholder' => '',
                'required' => false,
            ])
            ->add('save', SubmitType::class, [
                'attr' => ['class' => 'btn btn-success'],
                'label' => 'save',
            ]);

        $builder->add(
            'rawData',
            FileType::class,
            [
                'label' => 'rawData',
                'multiple' => true,
                'required' => false,
                'mapped' => false,
            ],
        );

        $builder->add('records', CollectionType::class, [
            'entry_type' => RecordType::class,
            'label' => 'record',
            'mapped' => true,
            'prototype' => true,
            'allow_add' => true,
            'allow_delete' => true,
            'required' => false,
        ]);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Measurement::class,
        ]);
    }
}
