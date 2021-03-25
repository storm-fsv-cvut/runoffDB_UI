<?php

namespace App\Form;

use App\Entity\Data;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\NumberType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\TimeType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class DataType extends AbstractType {
      public function buildForm(FormBuilderInterface $builder, array $options): void {
          $builder
              ->add('time', TimeType::class, [
                  'label'=>'time',
                  'widget'=>'single_text',
                  'with_seconds'=>true,
                  'attr'=>['class'=>'time']
              ])
              ->add('value', NumberType::class, [
                  'label'=>'value',
                  'attr'=>['class'=>'form-control value']
              ])
              ->add('related_value_X', NumberType::class, [
                  'label'=>'related_value_X',
                  'required'=>false,
                  'attr'=>['class'=>'form-control related_value_X']
              ])
          ->add('related_value_Y', NumberType::class, [
              'label'=>'related_value_Y',
              'required'=>false,
              'attr'=>['class'=>'form-control related_value_Y']
          ])
          ->add('related_value_Z', NumberType::class, [
              'label'=>'related_value_Z',
              'required'=>false,
              'attr'=>['class'=>'form-control related_value_Z']
          ]);
      }

      public function configureOptions(OptionsResolver $resolver): void {
          $resolver->setDefaults([
              'data_class' => Data::class,
          ]);
      }
}
