<?php

namespace App\Form;

use App\Entity\Locality;
use App\Entity\Organization;
use App\Entity\Project;
use App\Entity\Record;
use App\Entity\Sequence;
use App\Entity\Simulator;
use App\Repository\OrganizationRepository;
use App\Repository\PhenomenonRepository;
use App\Repository\RecordRepository;
use App\Services\RecordsService;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Form;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Contracts\Translation\TranslatorInterface;

class SequenceBasicType extends AbstractType
{
    /**
     * @var TranslatorInterface
     */
    private $translator;
    /**
     * @var OrganizationRepository
     */
    private $organizationRepository;
    /**
     * @var RecordsService
     */
    private $recordsService;


    public function __construct(TranslatorInterface $translator, OrganizationRepository $organizationRepository, RecordsService $recordsService) {
        $this->translator = $translator;
        $this->organizationRepository = $organizationRepository;
        $this->recordsService = $recordsService;
    }

    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('simulator')
            ->add('date', DateType::class,['widget'=>'single_text'])
            ->add(
                'projects',
                EntityType::class,
                [
                    'expanded'=>true,
                    'multiple'=>true,
                    'class' => Project::class,
                    'label' => 'projects'
                ]
            )

            ->add('save', SubmitType::class,[
                'attr'=>['class'=>'btn btn-success']
            ]);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Sequence::class,
        ]);
    }
}
