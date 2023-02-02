<?php
namespace go\modules\community\seven\controller;

use Exception;
use go\core\Controller;
use go\modules\community\addressbook\model\Contact;
use go\modules\community\seven\service\Messenger;

/**
 * The controller for handling message related requests
 * @copyright (c) 2021, seven communications GmbH & Co. KG https://www.seven.io
 * @author seven communications GmbH & Co. <support@seven.io>
 * @license https://opensource.org/licenses/MIT MIT
 */
class Message extends Controller {
    /**
     * Handle submit bulk message
     * @param array $params
     * @return array
     * @throws Exception
     */
    public function submitBulk(array $params): array {
        $messenger = new Messenger($params);
        $messenger->setContacts($this->getBulkContacts($params['filter']));
        $messenger->setClient($params['apiKey']);
        return $messenger->execute();
    }

    private function getBulkContacts(array $filter): array {
        $isOrganisation = $filter['isOrganization'];
        $gender = $filter['gender'];

        $query = Contact::find();
        if ($isOrganisation) $query->where(['isOrganization' => 1]);
        if ($gender !== '') $query->where(['gender' => $gender]);

        return $query->execute()->toArray();
    }
}

