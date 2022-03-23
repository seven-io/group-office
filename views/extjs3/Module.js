go.Modules.register('community', 'sms77', {
    entities: [],
    initModule() {
        console.log('initModule:sms77')
    },
    mainPanel: 'go.modules.community.sms77.MainPanel',
    systemSettingsPanels: [
        "go.modules.community.sms77.SystemSettingsPanel",
    ],
    title: t('name'),
})
