<?php

namespace App\Form;

use App\Entity\Agrotechnology;
use App\Entity\Organization;
use App\Entity\Project;
use App\Entity\Publication;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ProjectType extends AbstractType
{
    public function buildForm(
        FormBuilderInterface $builder,
        array $options
    ): void {
        $builder
            ->add('projectName', TextType::class, ['label' => 'projectName', 'required' => true])
            ->add('descriptionCZ', TextareaType::class, ['label' => 'descriptionCZ', 'required' => false])
            ->add('descriptionEN', TextareaType::class, ['label' => 'descriptionEN', 'required' => false])
            ->add('fundingAgency', TextType::class, ['label' => 'fundingAgency', 'required' => false])
            ->add('projectCode', TextType::class, ['label' => 'projectCode', 'required' => false]);

        $builder->add(
            'organisations',
            EntityType::class,
            [
                'expanded'=>true,
                'multiple'=>true,
                'class' => Organization::class,
                'label' => 'organisations'
            ]
        );

        $builder->add(
            'publications',
            EntityType::class,
            [
                'expanded'=>true,
                'multiple'=>true,
                'class' => Publication::class,
                'label' => 'publications'
            ]
        );

        $builder->add(
            'save',
            SubmitType::class,
            [
                'attr' => ['class' => 'btn btn-success'],
                'label' => 'save'
            ]
        );
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults(
            [
                'data_class' => Project::class,
            ]
        );
    }
}
