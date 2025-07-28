<?php

namespace App\Form;

use App\Entity\Operation;
use App\Entity\TillageSequence;
use App\Form\Type\DescendingIdEntityType;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class TillageSequenceType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('date', DateType::class, ['widget'=>'single_text'])
            ->add('operation', DescendingIdEntityType::class,['class'=>Operation::class,'label'=>'operation']);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => TillageSequence::class,
        ]);
    }
}
