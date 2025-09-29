<?php

declare(strict_types=1);

namespace App\Form;

use App\Entity\Methodics;
use App\Entity\Project;
use App\Entity\Sequence;
use App\Entity\Simulator;
use App\Form\Type\DescendingIdEntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class SequenceType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add(
                'simulator',
                DescendingIdEntityType::class,
                [
                      'mapped' => true,
                      'class' => Simulator::class,
                      'label' => 'projects',
                ],
            )
            ->add('date', DateType::class, ['widget' => 'single_text', 'label' => 'date'])
            ->add('noteCZ', TextareaType::class, [
                'label' => 'noteCZ',
                'required' => false,
                'attr' => ['class' => 'form-control value'],
            ])
            ->add('noteEN', TextareaType::class, [
                'label' => 'noteEN',
                'required' => false,
                'attr' => ['class' => 'form-control value'],
            ])
            ->add('descriptionCZ', TextareaType::class, [
                'label' => 'descriptionCZ',
                'required' => false,
                'attr' => ['class' => 'form-control value'],
            ])
            ->add('descriptionEN', TextareaType::class, [
                'label' => 'descriptionEN',
                'required' => false,
                'attr' => ['class' => 'form-control value'],
            ])
            ->add(
                'projects',
                DescendingIdEntityType::class,
                [
                    'expanded' => true,
                    'mapped' => true,
                    'multiple' => true,
                    'class' => Project::class,
                    'label' => 'projects',
                ],
            )
            ->add(
                'rawData',
                FileType::class,
                [
                    'label' => 'rawData',
                    'multiple' => true,
                    'required' => false,
                    'mapped' => false,
                ],
            )
            ->add('save', SubmitType::class, [
                'attr' => ['class' => 'btn btn-success'],
            ])
            ->add('methodics', DescendingIdEntityType::class, [
                'class' => Methodics::class,
                'choice_label' => function (Methodics $methodics) {
                    return $methodics->getName();
                },
                'placeholder' => '',
                'required' => false,
            ]);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
                                   'data_class' => Sequence::class,
                               ]);
    }
}
