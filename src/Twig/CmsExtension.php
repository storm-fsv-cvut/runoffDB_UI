<?php

namespace App\Twig;

use App\Entity\DefinitionEntityInterface;
use App\Repository\CmsRepository;
use Doctrine\ORM\EntityManagerInterface;
use http\Client\Request;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Contracts\Translation\TranslatorInterface;
use Twig\Extension\AbstractExtension;
use Twig\TwigFilter;
use Twig\TwigFunction;

class CmsExtension extends AbstractExtension {

    /**
     * @var CmsRepository
     */
    private $cmsRepository;
    /**
     * @var RequestStack
     */
    private $requestStack;

    public function __construct(RequestStack $requestStack, CmsRepository $cmsRepository) {
        $this->cmsRepository = $cmsRepository;
        $this->requestStack = $requestStack;
    }

    public function getFunctions() {
        return [
            new TwigFunction('title', [$this, 'title']),
            new TwigFunction('content', [$this, 'content']),
        ];
    }

    public function content(string $slug) {
        $locale = $this->requestStack->getCurrentRequest()->getLocale();
        $post = $this->cmsRepository->findBySlug($slug, $locale);
        return $post ? $post->getContent() : "";
    }

    public function title(string $slug) {
        $locale = $this->requestStack->getCurrentRequest()->getLocale();
        $post = $this->cmsRepository->findBySlug($slug, $locale);
        return $post ? $post->getTitle() : "";
    }
}
