<?php
namespace go\modules\community\sms77\controller;

use go\core\Controller;
use go\core\http\Exception;
use go\modules\community\addressbook\model;
use go\modules\community\sms77\service\Client;

/**
 * The controller for the Contact entity
 * @copyright (c) 2018, Intermesh BV http://www.intermesh.nl
 * @author Merijn Schering <mschering@intermesh.nl>
 * @license http://www.gnu.org/licenses/agpl-3.0.html AGPLv3
 */
class Message extends Controller {
    /**
     * Handle submit bulk message
     * @param array $params
     * @return array
     * @throws \Exception
     */
    public function submitBulk(array $params): array {
        $errors = [];
        $from = $params['from'];
        $text = $params['text'];

        $contacts = model\Contact::find();
        $pairs = []; // TODO add personalization
        $to = [];

        foreach ($contacts as $contact) {
            /** @var model\Contact $contact */
            foreach ($contact->phoneNumbers as $phoneNumber) {
                if ($phoneNumber->type !== 'mobile') continue;
                $to[] = $phoneNumber->number;
            }
        }
        $to = array_unique($to);
        $to = implode(',', $to);

        $arr = (new Client)->sms(compact('from', 'text', 'to'));
        $success = 100 === $arr['success'];
        $json = json_encode($arr, JSON_PRETTY_PRINT);

        return compact('errors', 'json', 'success');
    }
}

