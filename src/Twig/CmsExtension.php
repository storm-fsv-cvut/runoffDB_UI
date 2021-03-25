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

    public function getFunctions():array {
        return [
            new TwigFunction('title', [$this, 'title']),
            new TwigFunction('content', [$this, 'content']),
            new TwigFunction('tooltips', [$this, 'tooltips']),
        ];
    }

    public function content(string $slug):string {
        if($this->requestStack->getCurrentRequest()===null) {
            throw new \Exception('invalid request');
        }
        $language = $this->requestStack->getCurrentRequest()->getLocale();
        $post = $this->cmsRepository->findBySlug($slug, $language);
        return ($post!==null && $post->getContent()!==null) ? $post->getContent() : "";
    }

    public function title(string $slug):string {
        if($this->requestStack->getCurrentRequest()===null) {
            throw new \Exception('invalid request');
        }
        $language = $this->requestStack->getCurrentRequest()->getLocale();
        $post = $this->cmsRepository->findBySlug($slug, $language);
        return ($post!==null && $post->getTitle()!==null) ? $post->getTitle() : "";
    }

    public function tooltips():string {
        if($this->requestStack->getCurrentRequest()===null) {
            throw new \Exception('invalid request');
        }
        $language = $this->requestStack->getCurrentRequest()->getLocale();
        $tips = $this->cmsRepository->findAllByType('tooltip',$language);
        return (string) json_encode($tips);
    }
}
