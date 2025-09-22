<?php

declare(strict_types=1);

namespace App\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Symfony\Component\Form\Extension\Core\Type\NumberType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class AppendMeasurementType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('measurementId', NumberType::class, ['label' => 'measurementId', 'required' => true])
            ->add('parent_id', HiddenType::class, ['mapped' => false])
            ->add(
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
    }
}
