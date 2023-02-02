![](https://www.seven.io/wp-content/uploads/Logo.svg "seven Logo")

# [seven](https://www.seven.io/) for [Group Office](https://www.group-office.com/)

Adds the possibility to send SMS and make text-to-speech calls.
Depends on the `Address book` module to be activated.

## Installation

1. Download the [latest release](https://github.com/seven-io/groupoffice/releases/latest/download/seven-groupoffice-latest.zip).
2. Copy the plugin contents into the `/groupoffice/go/modules/community` folder.
3. Log in to Group Office as an administrator and to `System settings -> Modules`.
4. Install the plugin by clicking on 'Enable' button.
5. Click `seven` on the sidebar, enter your [API key](https://help.seven.io/en/api-key-access) and click `Save`.

## Usage
### Bulk SMS & text-to-speech calling
1. Click `seven` in the top navigation.
2. Choose a message type - defaults to `SMS`.
3. Enter your text of choice and optionally set a custom sender in the `from` field.
4. Submit by clicking `Send`.

### Property placeholders
Use {{columnName}} for resolving column values for the corresponding contact.

**Example:** *Dear {{firstName}} {{lastName}}* may resolve to *Dear Tommy Tester*


## Support

Need help? Feel free to [contact us](https://www.seven.io/en/company/contact).

[![MIT](https://img.shields.io/badge/License-MIT-teal.svg)](LICENSE)
