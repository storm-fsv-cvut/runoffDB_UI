<?php
/**
 * Created by PhpStorm.
 * User: ppavel
 * Date: 13.03.2019
 * Time: 22:14
 */

namespace App\Controller;

use App\Repository\CmsRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

class DefaultController extends AbstractController {

    /**
     * @Route("/{_locale}", name="homepage")
     */
    public function index(EntityManagerInterface $entityManager, CmsRepository $cmsRepository,$_locale='cs') {
        $user = $this->getUser();
        return $this->render('default/index.html.twig',['user'=>$user]);
    }
}
