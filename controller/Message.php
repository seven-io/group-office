<?php
namespace go\modules\community\sms77\controller;

use go\core\Controller;
use go\core\db\Criteria;
use go\core\http\Exception;
use go\core\orm\Query;
use go\modules\community\addressbook\model;
use go\modules\community\sms77\service\Client;

/**
 * The controller for the Contact entity
 * @copyright (c) 2018, Intermesh BV http://www.intermesh.nl
 * @author Merijn Schering <mschering@intermesh.nl>
 * @license http://www.gnu.org/licenses/agpl-3.0.html AGPLv3
 */
class Message extends Controller {
    private function retrievePhones(array $contacts): array {
        $recipients = [];

        foreach ($contacts as $contact) {
            /** @var model\Contact $contact */
            foreach ($contact->phoneNumbers as $phoneNumber) {
                if ($phoneNumber->type !== 'mobile') continue;
                $recipients[] = $phoneNumber->number;
            }
        }

        return array_unique($recipients);
    }

    /**
     * Handle submit bulk message
     * @param array $params
     * @return array
     * @throws \Exception
     */
    public function submitBulk(array $params): array {
        $errors = [];
        $apiKey = $params['apiKey'];
        $filter = $params['filter'];
        $isOrganisation = $filter['isOrganization'];
        $gender = $filter['gender'];
        $msgType = $params['msgType'];
        $from = $params['from'];
        $text = $params['text'];
        $pairs = []; // TODO add personalization

        $query = model\Contact::find();
        if ($isOrganisation) $query->where(['isOrganization' => 1]);
        if ($gender !== '') $query->where(['gender' => $gender]);
        $contacts = $query->execute()->toArray();
        $recipients = $this->retrievePhones($contacts);

        $client = new Client($apiKey);
        $commonArgs = compact('from', 'text');
        $success = false;
        $responses = [];

        if ('voice' === $msgType) {
            foreach ($recipients as $to) {
                $arr = $client->voice(array_merge($commonArgs, compact('to')));
                $responses[] = $arr;
                $success = 100 === $arr['success'];
            }
        }
        else {
            $to = implode(',', $recipients);
            $responses = $client->sms(array_merge($commonArgs, compact('to')));
            $success = 100 === $responses['success'];
        }

        $json = json_encode($responses, JSON_PRETTY_PRINT);

        return compact('errors', 'json', 'success');
    }
}

