<?php

namespace App\Form;


use App\Entity\Organization;
use App\Entity\User;
use App\Form\Type\DescendingIdEntityType;
use App\Security\UserRole;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\RepeatedType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class UserType extends AbstractType {
    public function buildForm(FormBuilderInterface $builder, array $options): void {
        $builder
            ->add('fullname', TextType::class)
            ->add('email', EmailType::class)
            ->add('username', TextType::class)
            ->add('organization', DescendingIdEntityType::class, ['class'=>Organization::class, 'label'=>'organization'])
            ->add('role', ChoiceType::class, [
                'choices' => [
                    UserRole::ROLE_ADMIN=>UserRole::ROLE_ADMIN,
                    UserRole::ROLE_EDITOR=>UserRole::ROLE_EDITOR,
                    UserRole::ROLE_INSTITUTION_EDITOR=>UserRole::ROLE_INSTITUTION_EDITOR,
                    UserRole::ROLE_READER=>UserRole::ROLE_READER,
                    UserRole::ROLE_GUEST=>UserRole::ROLE_GUEST
                ],
                'multiple'=>false
            ])
            ->add('newpass', RepeatedType::class, [
                'type' => PasswordType::class,
                'mapped' => false,
                'invalid_message' => 'Pole hesla musí být shodná.',
                'options' => ['attr' => ['class' => 'password-field']],
                'required' => false,
                'first_options' => ['label' => 'Heslo', 'always_empty' => true],
                'second_options' => ['label' => 'Heslo znovu', 'always_empty' => true],
            ])
            ->add('save', SubmitType::class);
    }

    public function configureOptions(OptionsResolver $resolver): void {
        $resolver->setDefaults([
            'data_class' => User::class,
        ]);
    }
}
