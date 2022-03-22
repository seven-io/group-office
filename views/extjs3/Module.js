go.Modules.register('community', 'sms77', {
    entities: [],  //All module entities must be defined here. Stores will be created for them.
    initModule() {     //Put code to initialize the module here after the user is authenticated and has access to the module.
        console.log('initModule:sms77')
    },
    mainPanel: 'go.modules.community.sms77.MainPanel',
    systemSettingsPanels: [
        "go.modules.community.sms77.SystemSettingsPanel",
    ],
    title: t('sms77'),      //The title is shown in the menu and tab bar
})
