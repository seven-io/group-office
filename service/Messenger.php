<?php
namespace go\modules\community\sms77\service;

use DateTime;
use Exception;
use go\modules\community\addressbook\model;
use ReflectionObject;

class Messenger {
    /**
     * @var Client $client
     */
    private $client;

    /**
     * @var array $commonParams
     */
    private $commonParams = [];

    /**
     * @var model\Contact[] $contacts
     */
    private $contacts = [];

    /**
     * @var string[] $errors
     */
    private $errors = [];

    /**
     * @var bool $isVoice
     */
    private $isVoice;

    /**
     * @var array $params
     */
    private $params;

    /**
     * @var array $requests
     */
    private $requests = [];

    /**
     * @var array $responses
     */
    private $responses = [];

    /**
     * @var bool $success
     */
    private $success = true;

    public function __construct(array $params) {
        $this->params = $params;
        $this->isVoice = 'voice' === $this->params['msgType'];
        try {
            $this->setCommonParams();
        } catch (Exception $e) {
            $this->errors[] = $e->getMessage();
        }
    }

    /**
     * @throws Exception
     */
    private function setCommonParams(): void {
        $debug = $this->params['debug'];
        $from = $this->params['from'];
        $args = compact('debug', 'from');

        if (!$this->isVoice) {
            $delay = $this->params['delay'];
            if ($delay) $delay = (new DateTime($delay))->getTimestamp();

            $args = array_merge($args, [
                'delay' => $delay,
                'flash' => $this->params['flash'],
                'foreign_id' => $this->params['foreignId'],
                'label' => $this->params['label'],
                'performance_tracking' => $this->params['performanceTracking'],
            ]);
        }

        $this->commonParams = $args;
    }

    public function setClient(string $apiKey): void {
        try {
            $this->client = new Client($apiKey);
        } catch (Exception $e) {
            $this->errors[] = $e->getMessage();
        }
    }

    public function setContacts(array $contacts): void {
        $this->contacts = $contacts;
        $this->setRequests();
    }

    private function setRequests() {
        $this->requests = [];
        $text = $this->params['text'];
        $matches = [];
        preg_match_all('/{{+[a-z]+}}/i', $text, $matches);
        $hasPlaceholders = is_array($matches) && !empty($matches[0]);

        if ($hasPlaceholders) foreach ($this->contacts as $contact) {
            $personalText = $text;
            $reflect = new ReflectionObject($contact);

            foreach ($matches[0] as $match) {
                $key = trim($match, '{}');
                $replace = $this->replace($reflect, $key, $contact);
                $personalText = str_replace($match, $replace, $personalText);
                $personalText = preg_replace('/\s+/', ' ', $personalText);
                $personalText = str_replace(' ,', ',', $personalText);
            }
            $personalText = trim($personalText);

            foreach ($this->retrieveContactPhones($contact) as $to) $this->requests[] = [
                'text' => $personalText,
                'to' => $to,
            ];
        }
        else {
            $phones = $this->retrievePhones();

            if ($this->isVoice) foreach ($phones as $to) $this->requests[] = [
                'text' => $text,
                'to' => $to,
            ];
            else $this->requests[] = [
                'text' => $text,
                'to' => implode(',', $phones),
            ];
        }
    }

    private function replace(
        ReflectionObject $reflectionObject,
        string           $key,
        model\Contact    $contact
    ): string {
        $replace = '';

        if ($reflectionObject->hasProperty($key)) {
            $prop = $reflectionObject->getProperty($key);
            $prop->setAccessible(true);
            $replace = $prop->getValue($contact);
        }

        return (string)$replace;
    }

    /**
     * @param model\Contact $contact
     * @param array $types
     * @return string[]
     */
    private function retrieveContactPhones(
        model\Contact $contact,
        array         $types = ['mobile']
    ): array {
        $phones = [];

        foreach ($contact->phoneNumbers as $phoneNumber) {
            if (!in_array($phoneNumber->type, $types)) continue;
            $phones[] = $phoneNumber->number;
        }

        return array_unique($phones);
    }

    /**
     * @return string[]
     */
    private function retrievePhones(): array {
        $phones = [];

        foreach ($this->contacts as $contact)
            array_push($phones, ...$this->retrieveContactPhones($contact));

        return array_unique($phones);
    }

    /**
     * Handle submit bulk message
     * @return array
     * @throws Exception
     */
    public function execute(): array {
        foreach ($this->requests as $request) {
            $args = array_merge($this->commonParams, $request);

            $this->responses[] = $this->isVoice
                ? $this->client->voice($args)
                : $this->client->sms($args);
        }

        return [
            'errors' => $this->errors,
            'json' => json_encode($this->responses, JSON_PRETTY_PRINT),
            'success' => $this->success,
        ];
    }
}