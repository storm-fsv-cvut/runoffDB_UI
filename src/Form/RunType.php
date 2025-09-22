<?php

declare(strict_types=1);

namespace App\Form;

use App\Entity\AssignmentType;
use App\Entity\Methodics;
use App\Entity\Plot;
use App\Entity\Record;
use App\Entity\Run;
use App\Entity\SoilSample;
use App\Form\Type\DescendingIdEntityType;
use App\Services\RecordsService;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\TimeType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Contracts\Translation\TranslatorInterface;

class RunType extends AbstractType
{
    /** @var TranslatorInterface */
    private $translator;
    private RecordsService $recordsService;

    public function __construct(TranslatorInterface $translator, RecordsService $recordsService)
    {
        $this->translator = $translator;
        $this->recordsService = $recordsService;
    }

    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('parent_id', HiddenType::class, ['mapped' => false])
            ->add('plot', DescendingIdEntityType::class, [
                'class' => Plot::class,
                'label' => 'plot',
                'required' => false,
                'placeholder' => $this->translator->trans('not set'),
            ])
            ->add('soilSampleBulk', DescendingIdEntityType::class, [
                'class' => SoilSample::class,
                'label' => 'soilSampleBulk',
                'required' => false,
                'placeholder' => $this->translator->trans('not set'),
            ])
            ->add('bulkAssignmentType', DescendingIdEntityType::class, [
                'class' => AssignmentType::class,
                'label' => 'assignmentType',
            ])
            ->add('soilSampleTexture', DescendingIdEntityType::class, [
                'class' => SoilSample::class,
                'label' => 'soilSampleTexture',
                'required' => false,
                'placeholder' => $this->translator->trans('not set'),
            ])
            ->add('textureAssignmentType', DescendingIdEntityType::class, [
                'class' => AssignmentType::class,
                'label' => 'assignmentType',
            ])
            ->add('soilSampleCorg', DescendingIdEntityType::class, [
                'class' => SoilSample::class,
                'label' => 'soilSampleCorg',
                'required' => false,
                'placeholder' => $this->translator->trans('not set'),
            ])
            ->add('corgAssignmentType', DescendingIdEntityType::class, [
                'class' => AssignmentType::class,
                'label' => 'assignmentType',
            ])
            ->add('runoffStart', TimeType::class, [
                'label' => 'runoffStart',
                'widget' => 'single_text',
                'required' => false,
                'with_seconds' => true,
            ])
            ->add('pondingStart', TimeType::class, [
                'label' => 'pondingStart',
                'widget' => 'single_text',
                'required' => false,
                'with_seconds' => true,
            ])
            ->add('noteCZ', TextareaType::class, [
                'label' => 'noteCZ',
                'required' => false,
            ])
            ->add('noteEN', TextareaType::class, [
                'label' => 'noteEN',
                'required' => false,
            ])
            ->add('rawData', FileType::class, [
                'label' => 'rawData',
                'multiple' => true,
                'required' => false,
                'mapped' => false,
            ])
            ->add('surfaceCover', DescendingIdEntityType::class, [
                'class' => Record::class,
                'choices' => $this->recordsService->getRecordsByPhenomenonKey('surcov'),
                'label' => 'surfaceCover',
                'required' => false,
            ])
            ->add('cropConditionCZ', TextareaType::class, [
                'label' => 'cropConditionCZ',
                'required' => false,
            ])
            ->add('cropConditionEN', TextareaType::class, [
                'label' => 'cropConditionEN',
                'required' => false,
            ])
            ->add('cropBBCH')
            ->add('methodics', DescendingIdEntityType::class, [
                'class' => Methodics::class,
                'choice_label' => function (Methodics $methodics) {
                    return $methodics->getName();
                },
                'placeholder' => '',
                'required' => false,
            ])
            ->add('referenceRun', DescendingIdEntityType::class, [
                'class' => Run::class,
                'label' => 'reference',
                'placeholder' => '',
                'required' => false,
            ])
            ->add('save', SubmitType::class, [
                'attr' => ['class' => 'btn btn-success'],
            ]);

        $builder->add('measurements', CollectionType::class, [
            'entry_type' => MeasurementType::class,
            'label' => 'measurement',
            'prototype' => true,
            'allow_add' => true,
            'allow_delete' => true,
            'required' => false,
        ]);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Run::class,
        ]);
    }
}
