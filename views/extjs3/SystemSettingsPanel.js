go.modules.community.sms77.SystemSettingsPanel = Ext.extend(go.systemsettings.Panel, {
    iconCls: 'ic-sms',
    initComponent() {
        this.items = [
            {         //The account dialog is an go.form.Dialog that loads the current User as entity.
                xtype: 'fieldset',
                items: [
                    {
                        anchor: '100%',
                        boxLabel: t('Create personal address book for each user'),
                        fieldLabel: t('API Key'),
                        name: 'apiKey',
                        xtype: 'textfield',
                    },
                ],
            },
        ]
        go.modules.community.sms77.SystemSettingsPanel.superclass.initComponent.call(this)
    },
    labelWidth: 125,
    title: t('sms77'),
})

