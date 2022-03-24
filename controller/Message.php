<?php
namespace go\modules\community\sms77\controller;

use go\core\Controller;
use go\modules\community\addressbook\model;
use go\modules\community\sms77\service\Client;

/**
 * The controller for handling message related requests
 * @copyright (c) 2021, sms77 e.K. https://www.sms77.io
 * @author sms77 e.K. <support@sms77.io>
 * @license https://opensource.org/licenses/MIT MIT
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

    private function retrieveContacts(array $filter): array {
        $isOrganisation = $filter['isOrganization'];
        $gender = $filter['gender'];

        $query = model\Contact::find();
        if ($isOrganisation) $query->where(['isOrganization' => 1]);
        if ($gender !== '') $query->where(['gender' => $gender]);

        return $query->execute()->toArray();
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
        $debug = $params['debug'];
        $filter = $params['filter'];
        $msgType = $params['msgType'];
        $from = $params['from'];
        $text = $params['text'];
        $pairs = []; // TODO add personalization
        $contacts = $this->retrieveContacts($filter);
        $recipients = $this->retrievePhones($contacts);
        $client = new Client($apiKey);
        $commonArgs = compact('debug', 'from', 'text');
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
            $arr = $client->sms(array_merge($commonArgs, [
                'flash' => $params['flash'],
                'performance_tracking' => $params['performanceTracking'],
                'to' => implode(',', $recipients),
            ]));
            $responses[] = $arr;
            $success = 100 === $arr['success'];
        }

        $json = json_encode($responses, JSON_PRETTY_PRINT);

        return compact('errors', 'json', 'success');
    }
}

