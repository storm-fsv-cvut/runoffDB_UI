<?php

declare(strict_types=1);

namespace App\Form;

use App\Entity\Crop;
use App\Entity\Locality;
use App\Entity\ProtectionMeasure;
use App\Form\Type\DescendingIdEntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Contracts\Translation\TranslatorInterface;

class PlotFilterType extends AbstractType
{
    /** @var TranslatorInterface */
    private $translator;

    public function __construct(TranslatorInterface $translator)
    {
        $this->translator = $translator;
    }

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add(
                'name',
                TextType::class,
                [
                    'required' => false,
                    'label' => 'Name',
                ],
            )
            ->add(
                'locality',
                DescendingIdEntityType::class,
                [
                    'class' => Locality::class,
                    'placeholder' => '',
                    'required' => false,
                    'label' => 'Locality',
                ],
            )
            ->add(
                'crop',
                DescendingIdEntityType::class,
                [
                    'class' => Crop::class,
                    'placeholder' => '',
                    'required' => false,
                    'label' => 'Crop',
                ],
            )
            ->add(
                'protectionMeasure',
                DescendingIdEntityType::class,
                [
                    'class' => ProtectionMeasure::class,
                    'placeholder' => '',
                    'required' => false,
                    'label' => 'Protection measure',
                ],
            )
            ->add('dateFrom', DateType::class, [
                'placeholder' => '',
                'required' => false,
                'widget' => 'single_text',
                'label' => ucfirst($this->translator->trans('date from')),
            ])
            ->add('dateTo', DateType::class, [
                'placeholder' => '',
                'required' => false,
                'widget' => 'single_text',
                'label' => ucfirst($this->translator->trans('date to')),
            ])
            ->add(
                'search',
                SubmitType::class,
                [
                    'label' => 'Search',
                    'attr' => ['class' => 'btn btn-success  pull-right'],
                ],
            )->setMethod('GET');
    }
}
