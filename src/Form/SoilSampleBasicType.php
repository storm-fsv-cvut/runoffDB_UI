<?php

namespace App\Form;

use App\Entity\SoilSample;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class SoilSampleBasicType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('dateSampled')
            ->add('sampleLocation')
            ->add('descriptionCZ')
            ->add('descriptionEN')
            ->add('sampleDepthM')
            ->add('dateProcessed')
            ->add('processedAt')
            ->add('plot')
            ->add('save', SubmitType::class,[
                'attr'=>['class'=>'btn btn-success']
            ]);
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => SoilSample::class,
        ]);
    }
}
