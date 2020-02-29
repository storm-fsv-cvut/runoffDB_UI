<?php


namespace App\Form;


use App\Entity\Run;
use App\Entity\Sequence;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class SequenceType extends AbstractType {
    public function __construct() {
    }

    public function buildForm(FormBuilderInterface $builder, array $options) {
        $builder
            ->add('simulator')
            ->add('plot')
            ->add('date')
            ->add('cropBBCH')
            ->add('canopyCover')
            ->add('cropCondition')
            ->add('save', SubmitType::class,[
                'attr'=>['class'=>'btn btn-success']
            ]);

        $builder->add('runs', CollectionType::class, [
            'entry_type' => RunType::class,
            'label'=>'rain_intensity',
            'mapped' => true,
            'prototype' => true,
            'allow_add' => true,
            'allow_delete' => true,
        ]);
    }
    public function configureOptions(OptionsResolver $resolver) {
        $resolver->setDefaults([
            'data_class' => Sequence::class,
        ]);
    }
}
