<?php


namespace App\Form;


use App\Entity\AssignmentType;
use App\Entity\Measurement;
use App\Entity\Plot;
use App\Entity\Run;
use App\Entity\RunGroup;
use App\Entity\RunType as RunTypeEntity;
use App\Entity\SoilSample;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\Form\Extension\Core\Type\DateTimeType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Symfony\Component\Form\Extension\Core\Type\NumberType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\TimeType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Contracts\Translation\TranslatorInterface;

class DeleteRunGroupType extends AbstractType {

    /**
     * @var TranslatorInterface
     */
    private $translator;

    public function __construct(TranslatorInterface $translator) {
        $this->translator = $translator;
    }

    public function buildForm(FormBuilderInterface $builder, array $options): void {
        /** @var RunGroup $runGroup */
        $runGroup = $options['run_group'];

        /** @var Run $run */
        foreach ($runGroup->getRuns() as $run) {
            /** @var Measurement $measurement */
            foreach ($run->getMeasurements() as $measurement) {
                $builder->add($measurement->getId(), CheckboxType::class, [
                    'label' => '#'.$measurement->getId(),
                    'required' => false,
                    'data' => false
                ]);
            }
        }

        $builder
            ->add('delete', SubmitType::class,[
                'attr'=>['class'=>'btn btn-danger'],
                'label'=>'delete run group and measurements'
            ]);
    }

    public function configureOptions(OptionsResolver $resolver): void {
        $resolver->setDefaults([
            'data_class' => null,
            'run_group' => null
        ]);
    }
}
