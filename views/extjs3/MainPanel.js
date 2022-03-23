go.modules.community.sms77.MainPanel = Ext.extend(Ext.FormPanel, {
    autoHeight: true,
    cls: 'go-form-panel',
    layout: 'form',
    initComponent() {
        const {settings} = go.Modules.entities.find(e => e.name === 'sms77')

        this._init = function(cb, _checked) {
            const isVoice = cb.getValue() === 'voice'
            const from = isVoice ? settings.voiceFrom : settings.smsFrom

            this.msgText.maxLength = isVoice ? 10000 : 1520
            this.msgFrom.setValue(from || '')
        }

        this.items = [
            new Ext.BoxComponent({
                autoEl: 'h1',
                html: `${t('sendBulk')} - ${t('name')}`,
            }),
            new Ext.form.Checkbox({
                boxLabel: t('isOrganization'),
                checked: false,
                fieldLabel: '',
                hint: t('isOrganizationHint'),
                name: 'filter.isOrganization',
            }),
            new go.form.RadioGroup({
                fieldLabel: t('Gender', 'addressbook', 'community'),
                items: [
                    {
                        boxLabel: t('allGenders'),
                        inputValue: '',
                    },
                    {
                        boxLabel: t('Unknown', 'addressbook', 'community'),
                        inputValue: null,
                    },
                    {
                        boxLabel: t('Male', 'addressbook', 'community'),
                        inputValue: 'M',
                    },
                    {
                        boxLabel: t('Female', 'addressbook', 'community'),
                        inputValue: 'F',
                    },
                ],
                name: 'filter.gender',
                value: '',
                xtype: 'radiogroup',
            }),
            new go.form.RadioGroup({
                allowBlank: false,
                fieldLabel: t('msgType'),
                items: [
                    {
                        boxLabel: t('sms'),
                        inputValue: 'sms',
                    },
                    {
                        boxLabel: t('voice'),
                        inputValue: 'voice',
                    },
                ],
                listeners: {
                    change: this._init,
                    render: this._init,
                    scope: this,
                },
                name: 'msgType',
                value: 'sms',
            }),
            this.msgFrom = new Ext.form.TextField({
                anchor: '100%',
                fieldLabel: t('from'),
                maxLength: 16,
                name: 'from',
                value: settings.smsFrom,
            }),
            this.msgText = new Ext.form.TextArea({
                allowBlank: false,
                anchor: '100%',
                fieldLabel: t('text'),
                grow: true,
                name: 'text',
                required: true,
            }),
            new Ext.form.Hidden({
                name: 'apiKey',
                value: settings.apiKey,
            }),
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
        ]

        go.modules.community.sms77.MainPanel.superclass.initComponent.call(this)

        this.on('afterrender', this.runModule, this)
    },
    runModule() {
    },
    title: t('name'),
})