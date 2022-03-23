<?php
namespace go\modules\community\sms77\service;

use Exception;
use go\modules\community\sms77\model\Settings;

class Client {
    /**
     * @var string $apiKey
     */
    private $apiKey;

    /**
     * @throws Exception
     */
    public function __construct($apiKey = null) {
        $this->apiKey = $apiKey ?: Settings::get()->apiKey;
        if (!$this->apiKey) throw new Exception('Missing sms77 API key');
    }

    private function request(string $endpoint, array $data) {
        $ch = curl_init('https://gateway.sms77.io/api/' . $endpoint);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Accept: application/json',
            'Content-type: application/json',
            'SentWith: GroupOffice',
            'X-Api-Key: ' . $this->apiKey
        ]);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $json = curl_exec($ch);
        curl_close($ch);
        $obj = json_decode($json, true);
        return $obj ?: $json;
    }

    public function sms(array $data) {
        return $this->request('sms', $data);
    }

    public function voice(array $data) {
        return $this->request('voice', $data);
    }
}