go.modules.community.sms77.MainPanel = Ext.extend(Ext.FormPanel, {
    autoHeight: true,
    cls: 'go-form-panel',
    layout: 'form',
    initComponent() {
        const {settings} = go.Modules.get('community', 'sms77')

        this._updateItems = function(cb, _checked) {
            const isVoice = cb.getValue() === 'voice'
            const from = isVoice ? settings.voiceFrom : settings.smsFrom

            this.inputText.maxLength = isVoice ? 10000 : 1520
            this.inputFrom.setValue(from || '')
            isVoice
                ? this.inputPerformanceTracking.hide()
                : this.inputPerformanceTracking.show()
        }

        this.items = [
            new Ext.BoxComponent({
                autoEl: 'h1',
                html: `${t('sendBulk')} - ${t('name')}`,
            }),
            new Ext.form.FieldSet({
                defaults: {
                    anchor: '100%',
                },
                items: [
                    new Ext.form.Checkbox({
                        boxLabel: t('isOrganization'),
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
                ],
                title: t('filters'),
                xtype: 'fieldset',
            }),
            new Ext.BoxComponent({
                autoEl: 'hr',
            }),
            this.msgType = new go.form.RadioGroup({
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
                    change: this._updateItems,
                    render: this._updateItems,
                    scope: this,
                },
                name: 'msgType',
                value: 'sms',
            }),
            new Ext.Container({
                defaults: {
                    columnWidth: 0.5,
                },
                items: [
                    new Ext.form.Checkbox({
                        boxLabel: t('debug'),
                        hint: t('debugHint'),
                        name: 'debug',
                    }),
                    this.inputPerformanceTracking = new Ext.form.Checkbox({
                        boxLabel: t('performanceTracking'),
                        hint: `<a href='${t('performanceTrackingLink')}' target='_blank'>${t('readMore')}</a>`,
                        name: 'performanceTracking',
                    }),
                ],
                layout: 'column',
                style: {
                    marginLeft: '100px',
                },
            }),
            this.inputFrom = new Ext.form.TextField({
                anchor: '100%',
                fieldLabel: t('from'),
                maxLength: 16,
                name: 'from',
            }),
            this.inputText = new Ext.form.TextArea({
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
                anchor: '100%',
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