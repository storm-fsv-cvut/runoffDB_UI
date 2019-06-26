<?php
namespace App\Grid;
use Dtc\GridBundle\Annotation\Action;

/**
 * @Annotation
 * @Target("ANNOTATION")
 */
class EditAction extends Action {
    /**
     * @var string
     */
    public $label = 'Edit';

    /**
     * @var string
     */
    public $route = 'dtc_grid_edit';
}
