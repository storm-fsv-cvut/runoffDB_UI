<?php

declare(strict_types=1);

namespace App\Controller;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class TestController
{
    #[Route('/test', name: 'test_route')]
    public function test(): Response
    {
        return new Response('Test OK');
    }
}
