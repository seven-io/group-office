<?php
namespace go\modules\community\seven\model;

use go\core;

class Settings extends core\Settings {
    /**
     * The seven API key
     * @var string $apiKey
     */
    public $apiKey;

    /**
     * The default SMS sender identifier
     * @var string $smsFrom
     */
    public $smsFrom;

    /**
     * The default text-to-speech sender identifier
     * @var string $voiceFrom
     */
    public $voiceFrom;
}
