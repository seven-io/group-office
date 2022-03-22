go.modules.community.sms77.MainPanel = Ext.extend(Ext.FormPanel, {
    layoutConfig: {
        triggerWidth: 1000,	// change responsive mode on 1000 pixels
    },
    initComponent() {
        this.items = [
            new Ext.Panel({
                items: [
                    new Ext.Panel({
                        autoHeight: true,
                        items: [
                            {
                                cls: 'go-form-text',
                                html: t('Send bulk SMS - sms77'),
                                xtype: 'box',
                            },
                            {
                                anchor: '100%',
                                fieldLabel: t('From'),
                                name: 'from',
                                xtype: 'textfield',
                            },
                            {
                                allowBlank: false,
                                anchor: '100%',
                                fieldLabel: t('Text'),
                                grow: true,
                                name: 'text',
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
                                                t(success ? 'Success' : 'Error'),
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
                                text: t('Send'),
                                type: 'submit',
                            }),
                        ],
                        layout: 'form',
                    }),
                ],
            }),
        ]

        go.modules.community.sms77.MainPanel.superclass.initComponent.call(this)

        this.on('afterrender', this.runModule, this)
    },
    runModule() {
    },
})