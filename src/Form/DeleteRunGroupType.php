<?php

declare(strict_types=1);

namespace App\Form;

use App\Entity\Measurement;
use App\Entity\Run;
use App\Entity\RunGroup;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class DeleteRunGroupType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        /** @var RunGroup $runGroup */
        $runGroup = $options['run_group'];

        /** @var Run $run */
        foreach ($runGroup->getRuns() as $run) {
            /** @var Measurement $measurement */
            foreach ($run->getMeasurements() as $measurement) {
                $builder->add((string) $measurement->getId(), CheckboxType::class, [
                    'label' => '#' . $measurement->getId(),
                    'required' => false,
                    'data' => false,
                ]);
            }
        }

        $builder
            ->add('delete', SubmitType::class, [
                'attr' => ['class' => 'btn btn-danger'],
                'label' => 'delete run group and measurements',
            ]);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => null,
            'run_group' => null,
        ]);
    }
}
