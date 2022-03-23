go.modules.community.sms77.MainPanel = Ext.extend(Ext.FormPanel, {
    layoutConfig: {
        triggerWidth: 1000,	// change responsive mode on 1000 pixels
    },
    initComponent() {
        const {settings} = go.Modules.entities.find(e => e.name === 'sms77')

        this.items = [
            new Ext.Panel({
                autoHeight: true,
                items: [
                    {
                        html: `${t('sendBulk')} - ${t('name')}`,
                        xtype: 'box',
                    },
                    {
                        value: settings.apiKey,
                        xtype: 'hidden',
                    },
                    {
                        anchor: '100%',
                        fieldLabel: t('from'),
                        name: 'from',
                        value: settings.smsFrom,
                        xtype: 'textfield',
                    },
                    {
                        allowBlank: false,
                        anchor: '100%',
                        fieldLabel: t('text'),
                        grow: true,
                        name: 'text',
                        required: true,
                        xtype: 'textarea',
                    },
                    new Ext.Button({
                        cls: 'primary',
                        handler() {
                            if (this.submitting) return

                            go.Jmap.request({
                                callback(options, success, response) {
                                    Ext.getBody().unmask()

                                    Ext.MessageBox.alert(
                                        t(success ? 'success' : 'error'),
                                        response.errors.length
                                            ? response.errors.join('<br />')
                                            : response.json,
                                    )
                                },
                                method: 'community/sms77/Message/submitBulk',
                                params: this.getForm().getFieldValues(),
                            })
                        },
                        scope: this,
                        text: t('send'),
                        type: 'submit',
                    }),
                ],
                layout: 'form',
            }),
        ]

        go.modules.community.sms77.MainPanel.superclass.initComponent.call(this)

        this.on('afterrender', this.runModule, this)
    },
    runModule() {
    },
})