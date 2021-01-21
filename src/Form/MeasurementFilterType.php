<?php

namespace App\Form;

use App\Entity\Crop;
use App\Entity\Locality;
use App\Entity\Organization;
use App\Entity\Phenomenon;
use App\Entity\Plot;
use App\Entity\Record;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\DateIntervalType;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Contracts\Translation\TranslatorInterface;

class MeasurementFilterType extends AbstractType {

    /**
     * @var TranslatorInterface
     */
    private $translator;

    public function __construct(TranslatorInterface $translator) {

        $this->translator = $translator;
    }

    public function buildForm(FormBuilderInterface $builder, array $options) {
        $builder
            ->add('phenomenon', EntityType::class, [
                'class' => Phenomenon::class,
                'required' => false,
                'placeholder' => '',
                'label' => 'Phenomenon'
            ])
            ->add('locality', EntityType::class, [
                'class' => Locality::class,
                'required' => false,
                'placeholder' => '',
                'label' => 'Locality'
            ])
            ->add('organization', EntityType::class, [
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
            ->add('search', SubmitType::class, [
                'label' => 'Search',
                'attr' => ['class' => 'btn btn-success']
            ])->setMethod("GET");
    }

}
