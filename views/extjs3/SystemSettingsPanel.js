go.modules.community.seven.SystemSettingsPanel = Ext.extend(go.systemsettings.Panel, {
    iconCls: 'ic-sms',
    initComponent() {
        this.items = [
            new Ext.form.FieldSet({
                defaults: {
                    anchor: '100%',
                },
                items: [
                    new Ext.form.TextField({
                        fieldLabel: t('apiKey'),
                        inputType: 'password',
                        name: 'apiKey',
                        required: true,
                    }),
                ],
                title: t('general'),
                xtype: 'fieldset',
            }),
            new Ext.form.FieldSet({
                defaults: {
                    anchor: '100%',
                },
                items: [
                    new Ext.form.TextField({
                        fieldLabel: t('from'),
                        maxLength: 16,
                        name: 'smsFrom',
                    }),
                ],
                title: t('sms'),
                xtype: 'fieldset',
            }),
            new Ext.form.FieldSet({
                defaults: {
                    anchor: '100%',
                },
                items: [
                    new Ext.form.TextField({
                        fieldLabel: t('from'),
                        maxLength: 16,
                        name: 'voiceFrom',
                    }),
                ],
                title: t('voice'),
                xtype: 'fieldset',
            }),
        ]
        go.modules.community.seven.SystemSettingsPanel.superclass.initComponent.call(this)
    },
    labelWidth: 125,
    title: t('name'),
})

