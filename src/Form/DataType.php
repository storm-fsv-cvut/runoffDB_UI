<?php

namespace App\Form;

use App\Entity\Data;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\TimeType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class DataType extends AbstractType {
      public function buildForm(FormBuilderInterface $builder, array $options) {
          $builder
              ->add('time', TimeType::class, [
                  'label'=>'time',
                  'widget'=>'single_text',
                  'with_seconds'=>true,
                  'attr'=>['class'=>'time']
              ])
              ->add('value', TextType::class, [
                  'label'=>'time',
                  'attr'=>['class'=>'form-control value']
              ])
              ->add('related_value_X', TextType::class, [
                  'label'=>'related_value_X',
                  'required'=>false,
                  'attr'=>['class'=>'form-control related_value']
              ])
          ->add('related_value_Y', TextType::class, [
              'label'=>'related_value_Y',
              'required'=>false,
              'attr'=>['class'=>'form-control related_value']
          ])
          ->add('related_value_Z', TextType::class, [
              'label'=>'related_value_Z',
              'required'=>false,
              'attr'=>['class'=>'form-control related_value']
          ]);
      }

      public function configureOptions(OptionsResolver $resolver) {
          $resolver->setDefaults([
              'data_class' => Data::class,
          ]);
      }
}
