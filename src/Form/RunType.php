<?php


namespace App\Form;


use App\Entity\AssignmentType;
use App\Entity\Plot;
use App\Entity\Record;
use App\Entity\Run;
use App\Entity\RunType as RunTypeEntity;
use App\Entity\SoilSample;
use App\Services\RecordsService;
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

class RunType extends AbstractType {

    /**
     * @var TranslatorInterface
     */
    private $translator;
    private RecordsService $recordsService;

    public function __construct(TranslatorInterface $translator, RecordsService $recordsService) {
        $this->translator = $translator;
        $this->recordsService = $recordsService;
    }

    public function buildForm(FormBuilderInterface $builder, array $options): void {
        $builder
            ->add('parent_id', HiddenType::class, ['mapped' => false])
            ->add('plot', EntityType::class, [
                'class' => Plot::class,
                'label' => "plot",
                'required'=>false,
                'placeholder' => $this->translator->trans("not set")
            ])
            ->add('soilSampleBulk', EntityType::class, [
                'class' => SoilSample::class,
                'label' => "soilSampleBulk",
                'required'=>false,
                'placeholder' => $this->translator->trans("not set")
            ])
            ->add('bulkAssignmentType', EntityType::class, [
                'class' => AssignmentType::class,
                'label' => "assignmentType"
            ])
            ->add('soilSampleTexture', EntityType::class, [
                'class' => SoilSample::class,
                'label' => "soilSampleTexture",
                'required'=>false,
                'placeholder' => $this->translator->trans("not set")
            ])
            ->add('textureAssignmentType', EntityType::class, [
                'class' => AssignmentType::class,
                'label' => "assignmentType"
            ])
            ->add('soilSampleCorg', EntityType::class, [
                'class' => SoilSample::class,
                'label' => "soilSampleCorg",
                'required'=>false,
                'placeholder' => $this->translator->trans("not set")
            ])
            ->add('corgAssignmentType', EntityType::class, [
                'class' => AssignmentType::class,
                'label' => "assignmentType"
            ])
            ->add('runoffStart', TimeType::class, [
                'label' => 'runoffStart',
                'widget'=>'single_text',
                'required'=>false,
                'with_seconds'=>true
            ])
            ->add('pondingStart', TimeType::class, [
                'label' => 'pondingStart',
                'widget'=>'single_text',
                'required'=>false,
                'with_seconds'=>true
            ])
            ->add('noteCZ', TextareaType::class, [
                'label' => 'noteCZ',
                'required'=>false
            ])
            ->add('noteEN', TextareaType::class, [
                'label' => 'noteEN',
                'required'=>false
            ])
            ->add('rawData', FileType::class, [
                'label' => 'rawData',
                'multiple' => true,
                'required' => false,
                'mapped'=>false
            ])
            ->add('surfaceCover', EntityType::class, [
                'class'=>Record::class,
                'choices'=>$this->recordsService->getRecordsByPhenomenonKey("surcov"),
                'label' => 'surfaceCover',
                'required'=>false
            ])
            ->add('cropConditionCZ', TextareaType::class, [
                'label' => 'cropConditionCZ',
                'required'=>false
            ])
            ->add('cropConditionEN', TextareaType::class, [
                'label' => 'cropConditionEN',
                'required'=>false
            ])
            ->add('cropBBCH')
            ->add('save', SubmitType::class,[
                'attr'=>['class'=>'btn btn-success']
            ]);

        $builder->add('measurements', CollectionType::class, [
            'entry_type' => MeasurementType::class,
            'label'=>'measurement',
            'prototype' => true,
            'allow_add' => true,
            'allow_delete' => true,
            'required'=>false
        ]);


    }

    public function configureOptions(OptionsResolver $resolver): void {
        $resolver->setDefaults([
            'data_class' => Run::class,
        ]);
    }
}
