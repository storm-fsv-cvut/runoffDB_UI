<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

class OperationIntensityController extends AbstractController
{
    /**
     * @Route("/operation/intensity", name="operation_intensity")
     */
    public function index()
    {
        return $this->render('operation_intensity/index.html.twig', [
            'controller_name' => 'OperationIntensityController',
        ]);
    }
}
