<?php

namespace App\Form;

use App\Entity\Locality;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\FormBuilderInterface;

class SequenceFilterType extends AbstractType {
    public function buildForm(FormBuilderInterface $builder, array $options) {
        $builder
            ->add('locality', EntityType::class, [
                'class' => Locality::class,
                'required' => false,
                'placeholder' => '',
                'label' => 'Locality'
            ])
            ->add('date', DateType::class, [
                'placeholder' => '',
                'required' => false,
                'label' => 'Date'
            ])
            ->add('search', SubmitType::class, [
                'label' => 'Search',
                'attr' => ['class' => 'btn btn-success']
            ])->setMethod("GET");
    }

}
