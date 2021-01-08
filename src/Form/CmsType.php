<?php

namespace App\Form;

use App\Entity\Cms;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class CmsType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('slug')
            ->add('language', ChoiceType::class, [
                'choices'=>['cs'=>'cs','en'=>'en'],
                'label'=>'language'
            ])
            ->add('title')
            ->add('content');


        $builder->add('save', SubmitType::class, [
            'attr' => ['class' => 'btn btn-success'],
            'label' => 'save'
        ]);
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => Cms::class,
        ]);
    }
}
