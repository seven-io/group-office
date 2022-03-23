<?php
namespace go\modules\community\sms77\model;

use go\core;

class Settings extends core\Settings {
    /**
     * The sms77 API key
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