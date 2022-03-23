go.modules.community.sms77.SystemSettingsPanel = Ext.extend(go.systemsettings.Panel, {
    iconCls: 'ic-sms',
    initComponent() {
        this.items = [
            new Ext.form.FieldSet({
                defaults: {
                    anchor: '100%',
                },
                items: [
                    {
                        fieldLabel: t('API Key'),
                        inputType: 'password',
                        name: 'apiKey',
                        required: true,
                        xtype: 'textfield',
                    },
                ],
                title: t('General'),
                xtype: 'fieldset',
            }),
            new Ext.form.FieldSet({
                defaults: {
                    anchor: '100%',
                },
                items: [
                    {
                        fieldLabel: t('From'),
                        name: 'smsFrom',
                        xtype: 'textfield',
                    },
                ],
                title: t('SMS'),
                xtype: 'fieldset',
            }),
        ]
        go.modules.community.sms77.SystemSettingsPanel.superclass.initComponent.call(this)
    },
    labelWidth: 125,
    title: t('sms77'),
})

