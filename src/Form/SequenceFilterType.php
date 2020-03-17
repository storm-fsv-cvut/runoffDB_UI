<?php

namespace App\Form;

use App\Entity\Crop;
use App\Entity\Locality;
use App\Entity\Plot;
use App\Entity\Record;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\DateIntervalType;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class SequenceFilterType extends AbstractType {
    public function buildForm(FormBuilderInterface $builder, array $options) {
        $builder
            ->add('plot', EntityType::class, [
                'class' => Plot::class,
                'required' => false,
                'placeholder' => '',
                'label' => 'Plot'
            ])
            ->add('date', DateType::class, [
                'placeholder' => '',
                'required' => false,
                'widget'=>'single_text',
                'label' => 'Date'
            ])
            ->add('crop', EntityType::class, [
                'class' => Crop::class,
                'required' => false,
                'placeholder' => '',
                'label' => 'Crop'
            ])
            ->add('search', SubmitType::class, [
                'label' => 'Search',
                'attr' => ['class' => 'btn btn-success']
            ])->setMethod("GET");
    }

}
