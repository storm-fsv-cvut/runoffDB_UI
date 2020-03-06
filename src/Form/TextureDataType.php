<?php

namespace App\Form;

use App\Entity\Data;
use App\Entity\TextureData;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class TextureDataType extends AbstractType {
      public function buildForm(FormBuilderInterface $builder, array $options) {
          $builder
              ->add('upClassLimit')
              ->add('mass')
              ->add('cumulMass');
      }

      public function configureOptions(OptionsResolver $resolver) {
          $resolver->setDefaults([
              'data_class' => TextureData::class,
          ]);
      }
}
