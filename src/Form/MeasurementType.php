<?php


namespace App\Form;


use App\Entity\Measurement;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class MeasurementType extends AbstractType {

    public function buildForm(FormBuilderInterface $builder, array $options) {
        $builder
            ->add('run_id', HiddenType::class,['mapped'=>false])
            ->add('descriptionCZ', TextareaType::class, ['label' => 'descriptionCZ'])
            ->add('descriptionEN', TextareaType::class, ['label' => 'descriptionEN'])
            ->add('noteCZ', TextareaType::class, ['label' => 'noteCZ'])
            ->add('noteEN', TextareaType::class, ['label' => 'noteEN'])
            ->add('save', SubmitType::class, [
                'attr' => ['class' => 'btn btn-success'],
                'label' => 'save'
            ]);
    }

    public function configureOptions(OptionsResolver $resolver) {
        $resolver->setDefaults([
            'data_class' => Measurement::class,
        ]);
    }
}
