<?php


namespace App\Form;


use App\Entity\AssignmentType;
use App\Entity\Plot;
use App\Entity\Run;
use App\Entity\RunGroup;
use App\Entity\RunType as RunTypeEntity;
use App\Entity\SoilSample;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\Form\Extension\Core\Type\DateTimeType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Symfony\Component\Form\Extension\Core\Type\NumberType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\TimeType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Contracts\Translation\TranslatorInterface;

class RunGroupType extends AbstractType {

    /**
     * @var TranslatorInterface
     */
    private $translator;

    public function __construct(TranslatorInterface $translator) {
        $this->translator = $translator;
    }

    public function buildForm(FormBuilderInterface $builder, array $options) {
        $builder
            ->add('runType', EntityType::class, [
                'class' => RunTypeEntity::class,
                'label' => "runType"
            ])
            ->add('precedingPrecipitation', NumberType::class, [
                'label' => 'precedingPrecipitation',
                'required'=>false,
                'required'=>false
            ])
            ->add('noteCZ', TextareaType::class, [
                'label' => 'noteCZ',
                'required'=>false
            ])
            ->add('noteEN', TextareaType::class, [
                'label' => 'noteEN',
                'required'=>false
            ])
            ->add('datetime', DateTimeType::class, [
                'label' => 'datetime',
                'widget'=>'single_text',
                'required'=>true
            ])
            ->add('save', SubmitType::class,[
                'attr'=>['class'=>'btn btn-success']
            ]);

        $builder->add('runs', CollectionType::class, [
            'entry_type' => RunType::class,
            'label'=>'run',
            'prototype' => true,
            'allow_add' => true,
            'allow_delete' => true,
            'required'=>false
        ]);


    }

    public function configureOptions(OptionsResolver $resolver) {
        $resolver->setDefaults([
            'data_class' => RunGroup::class,
        ]);
    }
}
