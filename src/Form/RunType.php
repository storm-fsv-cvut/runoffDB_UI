<?php


namespace App\Form;


use App\Entity\AssignmentType;
use App\Entity\Plot;
use App\Entity\Run;
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

class RunType extends AbstractType {

    /**
     * @var TranslatorInterface
     */
    private $translator;

    public function __construct(TranslatorInterface $translator) {
        $this->translator = $translator;
    }

    public function buildForm(FormBuilderInterface $builder, array $options) {
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
                'required'=>false
            ])
            ->add('pondingStart', TimeType::class, [
                'label' => 'pondingStart',
                'widget'=>'single_text',
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
            ->add('rawData', FileType::class, [
                'label' => 'rawData',
                'multiple' => true,
                'required' => false,
                'mapped'=>false
            ])
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

    public function configureOptions(OptionsResolver $resolver) {
        $resolver->setDefaults([
            'data_class' => Run::class,
        ]);
    }
}
