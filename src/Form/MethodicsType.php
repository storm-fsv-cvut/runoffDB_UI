<?php

namespace App\Form;

use App\Entity\Methodics;
use App\Entity\ProcessingStep;
use App\Repository\ProcessingStepRepository;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\UrlType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class MethodicsType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('nameCZ', TextType::class, [
                'label' => 'nameCZ',
            ])
            ->add('nameEN', TextType::class, [
                'label' => 'nameEN',
            ])
            ->add('descriptionCZ', TextareaType::class, ['required' => false, 'label' => 'descriptionCZ'])
            ->add('descriptionEN', TextareaType::class, ['required' => false, 'label' => 'descriptionEN'])
            ->add('noteCZ', TextareaType::class, ['required' => false, 'label' => 'noteCZ'])
            ->add('noteEN', TextareaType::class, ['required' => false, 'label' => 'noteEN'])
            ->add('links', UrlType::class, ['required' => false, 'label' => 'links'])
            ->add('methodicsProcessingSteps', CollectionType::class, [
                'entry_type'   => MethodicsProcessingStepType::class,
                'label'        => 'processingSteps',
                'entry_options'=> ['label' => false],
                'by_reference' => false,
                'allow_add'    => true,
                'allow_delete' => true,
                'prototype'    => true,
                'required'     => false,
            ])
            ->add('uploadedFiles', FileType::class, [
                'label' => 'uploadedFiles',
                'multiple' => true,
                'mapped' => false,
                'required' => false,
            ])
            ->add('save', SubmitType::class, [
                'attr' => ['class' => 'btn btn-success'],
                'label' => 'save'
            ]);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
                                   'data_class' => Methodics::class,
                               ]);
    }
}
