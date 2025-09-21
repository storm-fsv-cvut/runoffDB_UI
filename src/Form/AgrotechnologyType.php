<?php

declare(strict_types=1);

namespace App\Form;

use App\Entity\Agrotechnology;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class AgrotechnologyType extends AbstractType
{
    public function buildForm(
        FormBuilderInterface $builder,
        array $options,
    ): void {
        $builder
            ->add('nameCZ', TextType::class, ['label' => 'nameCZ', 'required' => false])
            ->add('nameEN', TextType::class, ['label' => 'nameEN', 'required' => false])
            ->add('descriptionCZ', TextareaType::class, ['label' => 'descriptionCZ', 'required' => false])
            ->add('descriptionEN', TextareaType::class, ['label' => 'descriptionEN', 'required' => false])
            ->add('managTyp', TextType::class, ['label' => 'managTyp', 'required' => false])
            ->add('noteCZ', TextareaType::class, ['label' => 'noteCZ', 'required' => false])
            ->add('noteEN', TextareaType::class, ['label' => 'noteEN', 'required' => false]);

        $builder->add(
            'tillageSequences',
            CollectionType::class,
            [
                'entry_type' => TillageSequenceType::class,
                'label' => 'tillageSequences',
                'mapped' => true,
                'prototype' => true,
                'allow_add' => true,
                'allow_delete' => true,
                'required' => false,
                'by_reference' => false,
            ],
        );

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
                'data_class' => Agrotechnology::class,
            ],
        );
    }
}
