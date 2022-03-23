<?php
namespace go\modules\community\sms77;

use go\modules\community\sms77\model\Settings;
use go\core;

/**
 * @copyright (c) 2019, Intermesh BV http://www.intermesh.nl
 * @author Merijn Schering <mschering@intermesh.nl>
 * @license http://www.gnu.org/licenses/agpl-3.0.html AGPLv3
 */
class Module extends core\Module {
    public function getAuthor(): string {
        return "sms77 e.K. <support@sms77.io>";
    }

    public function getDependencies(): array {
        return array_merge(parent::getDependencies(), ['community/addressbook']);
    }

    /**
     * @return core\Settings|null
     */
    public function getSettings(): ?core\Settings {
        return Settings::get();
    }
}