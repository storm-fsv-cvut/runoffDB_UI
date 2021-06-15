<?php


namespace App\Form;


use App\Entity\Project;
use App\Entity\Record;
use App\Entity\Run;
use App\Entity\Sequence;
use App\Services\RecordsService;
use Doctrine\ORM\EntityRepository;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class SequenceType extends AbstractType {
    /**
     * @var RecordsService
     */
    private $recordsService;

    public function __construct(RecordsService $recordsService) {
        $this->recordsService = $recordsService;
    }

    public function buildForm(FormBuilderInterface $builder, array $options): void {
        $builder
            ->add('simulator')
            ->add('date', DateType::class,['widget'=>'single_text', 'label'=>'date'])
            ->add('cropBBCH')
            ->add(
                'projects',
                EntityType::class,
                [
                    'expanded'=>true,
                    'mapped' => true,
                    'multiple'=>true,
                    'class' => Project::class,
                    'label' => 'projects'
                ]
            )
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
            ->add('save', SubmitType::class,[
                'attr'=>['class'=>'btn btn-success']
            ]);

        $builder->add('runGroups', CollectionType::class, [
            'entry_type' => RunGroupType::class,
            'label'=>'run_group',
            'mapped' => true,
            'prototype' => true,
            'allow_add' => true,
            'allow_delete' => true
        ]);
    }
    public function configureOptions(OptionsResolver $resolver): void {
        $resolver->setDefaults([
            'data_class' => Sequence::class,
        ]);
    }
}
