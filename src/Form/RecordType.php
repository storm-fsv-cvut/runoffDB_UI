<?php

namespace App\Form;

use App\Entity\QualityIndex;
use App\Entity\Record;
use App\Entity\Unit;
use App\Form\Type\DescendingIdEntityType;
use App\Services\RecordsService;
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
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\OptionsResolver\OptionsResolver;

class RecordType extends AbstractType
{

    /**
     * @var RecordsService
     */
    private $recordsService;

    public function __construct(RecordsService $recordsService) {
        $this->recordsService = $recordsService;
    }

    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('noteCZ',TextareaType::class,['label'=>'noteCZ','required'=>false])
            ->add('isTimeline',CheckboxType::class,['label'=>'isTimeline','required'=>false])
            ->add('noteEN',TextareaType::class,['label'=>'noteEN','required'=>false])
            ->add('descriptionCZ', TextareaType::class, [
                'label' => 'descriptionCZ',
                'required'=>false
            ])
            ->add('descriptionEN', TextareaType::class, [
                'label' => 'descriptionEN',
                'required'=>false
            ])
            ->add('recordType',DescendingIdEntityType::class, ['class'=>\App\Entity\RecordType::class,'label'=>'record type'])
            ->add('qualityIndex',DescendingIdEntityType::class, ['class'=>QualityIndex::class,'label'=>'quality index', 'placeholder' => ""])
            ->add('parent_id', HiddenType::class, ['mapped' => false])
            ->add('unit', DescendingIdEntityType::class, ['class'=>Unit::class,'label'=>'unit','attr'=>['data-change-label'=>true]])
            ->add('relatedValueXUnit', DescendingIdEntityType::class, ['required'=>false,'class'=>Unit::class, 'placeholder' => "",'label'=>'relatedValueXUnit','attr'=>['data-change-label'=>true]])
            ->add('relatedValueYUnit', DescendingIdEntityType::class, ['required'=>false,'class'=>Unit::class, 'placeholder' => "",'label'=>'relatedValueYUnit','attr'=>['data-change-label'=>true]])
            ->add('relatedValueZUnit', DescendingIdEntityType::class, ['required'=>false,'class'=>Unit::class, 'placeholder' => "",'label'=>'relatedValueZUnit','attr'=>['data-change-label'=>true]])
            ->add('sourceRecords', DescendingIdEntityType::class, [
                'required'=>false,
                'class'=>Record::class,
                'choice_label'=>'idAndUnitString',
                'label'=>'sourceRecords',
                'multiple'=>true
            ])
            ->add('datafile', FileType::class, [
                'label'=>'loadDataFile',
                'mapped'=>false,
                'required'=>false,
                'attr'=>['data-validate'=>"/cs/validate-file", 'data-name'=>"datafile"]
            ])
            ->add('skip_first_row', CheckboxType::class, [
                'label'=>'skip_first_row',
                'attr'=>['data-name'=>"skip_first_row","checked"=>"checked"],
                'mapped'=>false,
                'required'=>false
            ])
            ->add('first_column_time', CheckboxType::class, [
                'label'=>'first_column_time',
                'attr'=>['data-name'=>"first_column_time","checked"=>"checked"],
                'mapped'=>false,
                'required'=>false
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

//        $builder->addEventListener(
//            FormEvents::PRE_SUBMIT,
//            function (FormEvent $event) use ($options): void {
//                $form = $event->getForm();
//                $form
//                    ->remove('datas')
//                    ->add('datas', CollectionType::class, [
//                        'entry_type' => DataType::class,
//                        'label'=>'data',
//                        'mapped' => true,
//                        'prototype' => true,
//                        'allow_add' => true,
//                        'allow_delete' => true,
//                        'required'=>false,
//                        'by_reference' => false
//                    ]);
//            }
//        );
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Record::class,
        ]);
    }
}
