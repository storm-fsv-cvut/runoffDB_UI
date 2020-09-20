<?php

namespace App\Twig;

use App\Entity\DefinitionEntityInterface;
use App\Entity\LocalisableInterface;
use Doctrine\ORM\EntityManagerInterface;
use http\Client\Request;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Contracts\Translation\TranslatorInterface;
use Twig\Extension\AbstractExtension;
use Twig\TwigFilter;
use Twig\TwigFunction;

class LocaliseEntityExtension extends AbstractExtension {

    /**
     * @var RequestStack
     */
    private $requestStack;

    /**
     * @var Request
     */
    private $request;

    public function __construct(RequestStack $requestStack) {
        $this->requestStack = $requestStack;
        $this->request = $requestStack->getCurrentRequest();
    }

    public function getFilters() {
        return [
            new TwigFilter('localize',[$this,'localizeEntity'])
        ];
    }

    public function localizeEntity(LocalisableInterface $entity) {
        $locale = $this->request->getLocale() ? $this->request->getLocale() : $this->request->getDefaultLocale();
        $entity->setLocale($locale);
        return $entity->__toString();
    }
}
