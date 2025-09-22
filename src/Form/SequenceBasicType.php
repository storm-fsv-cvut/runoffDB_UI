<?php

declare(strict_types=1);

namespace App\Form;

use App\Entity\Project;
use App\Entity\Sequence;
use App\Entity\Simulator;
use App\Form\Type\DescendingIdEntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class SequenceBasicType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('simulator', DescendingIdEntityType::class, [
                'class' => Simulator::class,
                'label' => 'simulator',
                'placeholder' => '',
            ])
            ->add('date', DateType::class, ['widget' => 'single_text'])
            ->add(
                'projects',
                DescendingIdEntityType::class,
                [
                    'expanded' => true,
                    'multiple' => true,
                    'class' => Project::class,
                    'label' => 'projects',
                ],
            )
            ->add('save', SubmitType::class, [
                'attr' => ['class' => 'btn btn-success'],
            ]);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
                                   'data_class' => Sequence::class,
                               ]);
    }
}
