go.Modules.register('community', 'seven', {
    entities: [],
    initModule() {
        console.log('initModule:seven')
    },
    mainPanel: 'go.modules.community.seven.MainPanel',
    systemSettingsPanels: [
        "go.modules.community.seven.SystemSettingsPanel",
    ],
    title: t('name'),
})
