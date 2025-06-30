<?php

namespace App\Controller;

use App\Entity\User;
use App\Form\UserType;
use App\Repository\UserRepository;
use App\Security\SecurityService;
use Doctrine\ORM\EntityManagerInterface;
use Knp\Component\Pager\PaginatorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;
use Symfony\Component\Routing\Attribute\Route;

class SecurityController extends AbstractController
{
    public function __construct(
        private readonly SecurityService $securityService,
    ) {}

    #[Route('/{_locale}/login', name: 'app_login')]
    public function login(AuthenticationUtils $authenticationUtils): Response
    {
        $error = $authenticationUtils->getLastAuthenticationError();
        $lastUsername = $authenticationUtils->getLastUsername();

        return $this->render('security/login.html.twig', [
            'last_username' => $lastUsername,
            'error' => $error,
        ]);
    }

    #[Route('/{_locale}/logout', name: 'app_logout')]
    public function logout(AuthenticationUtils $authenticationUtils): Response
    {
        $error = $authenticationUtils->getLastAuthenticationError();
        $lastUsername = $authenticationUtils->getLastUsername();

        return $this->render('security/login.html.twig', [
            'last_username' => $lastUsername,
            'error' => $error,
        ]);
    }

    #[Route('/{_locale}/user/{id}', name: 'user')]
    public function user(UserRepository $userRepository, Request $request, ?int $id = null): Response
    {
        $user = $id !== null ? $userRepository->find($id) : null;
        $this->denyAccessUnlessGranted('edituser', $user);

        $form = $this->createForm(UserType::class, $user);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $user = $form->getData();
            $newpass = $form->get('newpass')->getData();
            if($newpass !== null && $newpass !== '') {
                $this->securityService->changePass($user, $newpass);
            }
        }

        return $this->render('security/user.html.twig', [
            'form' => $form->createView(),
        ]);
    }

    #[Route('/{_locale}/delete-user/{id}', name: 'delete_user')]
    public function deleteUser(
        UserRepository $userRepository,
        EntityManagerInterface $entityManager,
        ?int $id = null
    ): Response {
        $this->denyAccessUnlessGranted('admin');

        $user = $userRepository->find($id);
        if ($user === null) {
            throw new \Exception("User doesn't exist");
        }

        $entityManager->remove($user);
        $entityManager->flush();

        return $this->redirectToRoute('users');
    }

    #[Route('/{_locale}/users', name: 'users')]
    public function list(
        EntityManagerInterface $entityManager,
        Request $request,
        PaginatorInterface $paginator
    ): Response {
        $this->denyAccessUnlessGranted('admin');

        $repo = $entityManager->getRepository(User::class);
        $pagination = $paginator->paginate(
            $repo->createQueryBuilder('e'),
            $request->query->getInt('page', 1),
            20
        );

        return $this->render('security/list.html.twig', [
            'pagination' => $pagination,
        ]);
    }

    public function userMenu(): Response
    {
        $user = $this->getUser();
        return $this->render('security/usermenu.html.twig', ['user' => $user]);
    }
}
