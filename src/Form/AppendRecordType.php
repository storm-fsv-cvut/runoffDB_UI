<?php

declare(strict_types=1);

namespace App\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Symfony\Component\Form\Extension\Core\Type\NumberType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class AppendRecordType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('recordId', NumberType::class, ['label' => 'record', 'required' => true])
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
