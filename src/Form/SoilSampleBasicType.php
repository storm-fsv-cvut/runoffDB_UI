<?php

declare(strict_types=1);

namespace App\Form;

use App\Entity\Plot;
use App\Entity\SoilSample;
use App\Form\Type\DescendingIdEntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class SoilSampleBasicType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('dateSampled', DateType::class, ['widget' => 'single_text'])
            ->add('sampleLocation')
            ->add('descriptionCZ')
            ->add('descriptionEN')
            ->add('sampleDepthM')
            ->add('dateProcessed', DateType::class, ['widget' => 'single_text'])
            ->add('processedAt')
            ->add('wrbSoilClass')
            ->add('plot', DescendingIdEntityType::class, [
                'class' => Plot::class,
                'label' => 'plot',
                'placeholder' => '',
            ])
            ->add('save', SubmitType::class, [
                'attr' => ['class' => 'btn btn-success'],
            ]);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => SoilSample::class,
        ]);
    }
}
