<?php

namespace App\Form;

use App\Entity\MethodicsProcessingStep;
use App\Entity\ProcessingStep;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\IntegerType;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use App\Repository\ProcessingStepRepository;

class MethodicsProcessingStepType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('processingStep', EntityType::class, [
                'class' => ProcessingStep::class,
                'choice_label' => 'name',
                'placeholder' => '— vyber krok —',
                'query_builder' => fn (ProcessingStepRepository $r) => $r->createSortedQueryBuilder(),
            ])
            ->add('sort', IntegerType::class, [
                'empty_data' => '0',
            ]);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
                                   'data_class' => MethodicsProcessingStep::class,
                               ]);
    }
}
