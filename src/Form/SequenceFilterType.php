<?php

namespace App\Form;

use App\Entity\Crop;
use App\Entity\Locality;
use App\Entity\Organization;
use App\Entity\Plot;
use App\Entity\Record;
use App\Entity\Simulator;
use App\Form\Type\DescendingIdEntityType;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\DateIntervalType;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Contracts\Translation\TranslatorInterface;

class SequenceFilterType extends AbstractType {

    /**
     * @var TranslatorInterface
     */
    private $translator;

    public function __construct(TranslatorInterface $translator) {

        $this->translator = $translator;
    }


    public function buildForm(FormBuilderInterface $builder, array $options): void {
        $builder
            ->add('locality', DescendingIdEntityType::class, [
                'class' => Locality::class,
                'required' => false,
                'placeholder' => '',
                'label' => 'Locality'
            ])
            ->add('organization', DescendingIdEntityType::class, [
                'class' => Organization::class,
                'required' => false,
                'placeholder' => '',
                'label' => 'Organization'
            ])
            ->add('dateFrom', DateType::class, [
                'placeholder' =>'',
                'required' => false,
                'widget'=>'single_text',
                'label' =>  ucfirst($this->translator->trans("date from")),
            ])
            ->add('dateTo', DateType::class, [
                'placeholder' => '',
                'required' => false,
                'widget'=>'single_text',
                'label' => ucfirst($this->translator->trans("date to")),
            ])
            ->add('crop', DescendingIdEntityType::class, [
                'class' => Crop::class,
                'required' => false,
                'placeholder' => '',
                'label' => 'Crop'
            ])
            ->add('simulator', DescendingIdEntityType::class, [
                'class' => Simulator::class,
                'required' => false,
                'placeholder' => '',
                'label' => 'Simulator'
            ])
            ->add('search', SubmitType::class, [
                'label' => 'Search',
                'attr' => ['class' => 'btn btn-success pull-right']
            ])
            ->add('export', SubmitType::class, [
                'label' => 'Export result',
                'attr' => ['class' => 'btn btn-primary']
            ])->setMethod("GET");
    }

}
