<?php

namespace App\Twig;

use Exception;;
use App\Entity\LocalisableInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;
use Twig\Extension\AbstractExtension;
use Twig\TwigFilter;

class LocaliseEntityExtension extends AbstractExtension {

    private RequestStack $requestStack;

    private ?Request $request;

    public function __construct(RequestStack $requestStack) {
        $this->requestStack = $requestStack;
        $this->request = $requestStack->getCurrentRequest();
    }

    public function getFilters():array {
        return [
            new TwigFilter('localize',[$this,'localizeEntity'])
        ];
    }

    public function localizeEntity(LocalisableInterface $entity):string {
        if ($this->request===null) {
            throw new Exception("Invalid request");
        }
        $locale = $this->request->getLocale();
        $entity->setLocale($locale);
        return $entity->__toString();
    }
}
