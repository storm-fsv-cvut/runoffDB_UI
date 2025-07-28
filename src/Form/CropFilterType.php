<?php

namespace App\Form;

use App\Entity\CropType;
use App\Entity\Locality;
use App\Form\Type\DescendingIdEntityType;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;

class CropFilterType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add(
                'name',
                TextType::class,
                [
                    'required' => false,
                    'label' => 'Name'
                ]
            )
            ->add(
                'class',
                HiddenType::class,
                [
                    'data' => 'App\Entity\Crop'
                ]
            )
            ->add(
                'cropType',
                DescendingIdEntityType::class,
                [
                    'class' => CropType::class,
                    'placeholder' => '',
                    'required' => false,
                    'label' => "Crop type"
                ]
            )
            ->add(
                'search',
                SubmitType::class,
                [
                    'label' => 'Search',
                    'attr' => ['class' => 'btn btn-success  pull-right']
                ]
            )->setMethod("GET");
    }
}
