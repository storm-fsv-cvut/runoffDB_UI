<?php

namespace App\Form;

use App\Entity\Record;
use App\Entity\Unit;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class RecordType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('noteCZ',TextareaType::class,['label'=>'noteCZ','required'=>false])
            ->add('noteEN',TextareaType::class,['label'=>'noteEN','required'=>false])
            ->add('isTimeline',CheckboxType::class,['label'=>'isTimeline','data'=>true,'required'=>false])
            ->add('recordType')
            ->add('parent_id', HiddenType::class, ['mapped' => false])
            ->add('unit', EntityType::class, ['class'=>Unit::class,'label'=>'unit','attr'=>['data-change-label'=>true]])
            ->add('relatedValueXUnit', EntityType::class, ['required'=>false,'class'=>Unit::class, 'placeholder' => "",'label'=>'relatedValueXUnit','attr'=>['data-change-label'=>true]])
            ->add('relatedValueYUnit', EntityType::class, ['required'=>false,'class'=>Unit::class, 'placeholder' => "",'label'=>'relatedValueYUnit','attr'=>['data-change-label'=>true]])
            ->add('relatedValueZUnit', EntityType::class, ['required'=>false,'class'=>Unit::class, 'placeholder' => "",'label'=>'relatedValueZUnit','attr'=>['data-change-label'=>true]])
            ->add('sourceRecords', EntityType::class, ['required'=>false,'class'=>Record::class,'label'=>'sourceRecords', 'multiple'=>true])
            ->add('datafile', FileType::class, [
                'label'=>'loadDataFile',
                'mapped'=>false,
                'required'=>false,
                'attr'=>['data-validate'=>"/validate-file"]
            ])
            ->add('save', SubmitType::class,[
                'attr'=>['class'=>'btn btn-success'],
                'label'=>'save'
            ]);

        $builder->add('datas', CollectionType::class, [
            'entry_type' => DataType::class,
            'label'=>'data',
            'mapped' => true,
            'prototype' => true,
            'allow_add' => true,
            'allow_delete' => true,
            'required'=>false,
            'by_reference' => false
        ]);
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => Record::class,
        ]);
    }
}
