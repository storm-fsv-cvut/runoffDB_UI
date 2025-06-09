<?php
namespace App\Controller;

use App\Repository\CmsRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class DefaultController extends AbstractController {
    public function __construct(
        private readonly CmsRepository $cmsRepository,
    )
    {
    }

    #[Route(path: '/{_locale}', name: 'homepage', requirements: ['_locale' => 'cs|en'], defaults: ['_locale' => 'cs'])]
    public function index(string $_locale = 'cs'):Response {
        $cms = $this->cmsRepository->findBySlug('home',$_locale);
        return $this->render('cms/view.html.twig', ['cms'=>$cms]);
    }
}
