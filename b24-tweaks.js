// ==UserScript==
// @name         B24 tweaks
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  коды полей в карточках CRM и гридах и много чего еще
// @updateURL    https://raw.githubusercontent.com/boriskrg/b24-tweaks/master/b24-tweaks.js
// @downloadURL  https://raw.githubusercontent.com/boriskrg/b24-tweaks/master/b24-tweaks.js
// @author       boriskrg
// @include      *
// @icon         none
// @run-at       document-start
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM.getValue
// @grant        GM.setValue
// ==/UserScript==

class KbConfigService {
    static async init () {
        KbTweaksUtil.addStyle(`
            .kb-b24-config {
                inset: 126px auto auto 170px !important;
                border: 1px solid #3330 !important;
                height: 75% !important;
                margin: 0px !important;
                max-height: 450px !important;
                max-width: 50% !important;
                opacity: 1 !important;
                overflow: auto !important;
                padding: 0px !important;
                position: fixed !important;
                width: 75% !important;
                z-index: 9999 !important;
                box-shadow: 0 0 10px #3333 !important;
                border-radius: 8px !important;
                background: white !important;
            }
            #B24-Tweaks * {
                font-family: OpenSans-Regular !important;
                color: #555 !important;
            }

            div#B24-Tweaks_wrapper {
                height: 100%;
                display: flex;
                flex-direction: column;
            }

            div#B24-Tweaks_section_0 {
                flex: 1;
            }

            div#B24-Tweaks_wrapper > * {
                padding: 5px 20px;

            }

            div#B24-Tweaks_buttons_holder {
                display: flex;
                align-items: baseline;
                justify-content: center;
            }
            #B24-Tweaks button {
                border: 1px solid #ccc6;
                background: #ccc2;
                text-transform: uppercase;
                font-size: 12px;
                font-weight: bold;
                height: 25px;
                width: 80px;
            }
            #B24-Tweaks .config_var {
                margin: 0 0 20px !important;
            }
        `)
        let frame = document.createElement('div')
        frame.style.display = 'none'

        frame.classList.add('kb-b24-config')
        document.body.appendChild(frame)

        const item = new KbConfigService()
        item.gmc = new GM_config({
            id: 'B24-Tweaks',
            title: 'B24 Tweaks',
            frame: frame,
            fields: {
                handleCrmDetailsCodes: {
                    label: 'коды в карточке crm, и мб где-то еще где юзаются UF поля',
                    type: 'checkbox',
                    default: 'true',
                },
                handleGridHeaderCodes: {
                    label: 'коды в заголовках таблиц (гридах). выделение кликом',
                    type: 'checkbox',
                    default: true,
                },
                handleGridSettingsCodes: {
                    label: 'коды в выборе колонок грида',
                    type: 'checkbox',
                    default: true,
                },
                handleBpCodeMonospace: {
                    label: 'моноширный шрифт в PHP коде в БП',
                    type: 'checkbox',
                    default: true,
                },
                handleBpExpandSelect: {
                    label: 'разворачивание некоторых селектов в БП, чтобы по ним можно было искать',
                    type: 'checkbox',
                    default: true,
                },
                handleSidePanelReload: {
                    label: 'кнопка reload для сайд панелей в левом верхнем углу',
                    type: 'checkbox',
                    default: true,
                },
                handleDetailsSelectField: {
                    label: 'коды полей в выборе полей в карточках CRM',
                    type: 'checkbox',
                    default: true,
                },
            },
        })

        await item.gmc.init()
        document.body.addEventListener('keydown', e => {
            if (e.key === 'F2') {
                if (item.gmc.isOpen) {
                    item.gmc.close()
                } else {
                    item.gmc.open()
                    frame.style.display = 'block'
                }
            }
        })

        return item
    }

    async get (key) {
        return await this.gmc.fields[key]?.value
    }
}

class KbTweaks {
    constructor (gmc) {
        this.gmc = gmc

        this.gmc.get('handleCrmDetailsCodes').then(v => v && this.handleCrmDetailsCodes())
        this.gmc.get('handleGridHeaderCodes').then(v => v && this.handleGridHeaderCodes())
        this.gmc.get('handleGridSettingsCodes').then(v => v && this.handleGridSettingsCodes())
        this.gmc.get('handleBpCodeMonospace').then(v => v && this.handleBpCodeMonospace())
        this.gmc.get('handleBpExpandSelect').then(v => v && this.handleBpExpandSelect())
        this.gmc.get('handleSidePanelReload').then(v => v && this.handleSidePanelReload())
        this.gmc.get('handleDetailsSelectField').then(v => v && this.handleDetailsSelectField())
    }

    static async init () {
        const isSuccess = await KbTweaksUtil.waitUntil(
            () => document.body && typeof BX !== 'undefined',
            10_000,
        )
        if (!isSuccess) {
            return
        }

        const gmc = await KbConfigService.init()

        return new KbTweaks(gmc)
    }

    handleCrmDetailsCodes () {
        BX.addCustomEvent(
            'BX.UI.EntityEditorField:onLayout',
            KbTweaksUtil.addCodeToLabel,
        )
        BX.addCustomEvent(
            'BX.Crm.EntityEditorSection:onLayout',
            section => section._fields.forEach(KbTweaksUtil.addCodeToLabel),
        )
    }

    handleGridHeaderCodes () {
        BX.addCustomEvent(
            'Grid::ready',
            async grid => setTimeout(() => {
                KbTweaksUtil.addCodesToGrid(grid)
            }, 50),
        )
        BX.addCustomEvent(
            'Grid::enabled',
            async grid => setTimeout(() => {
                KbTweaksUtil.addCodesToGrid(grid)
            }, 0),
        )
    }

    handleGridSettingsCodes () {
        BX.addCustomEvent('BX.Grid.SettingsWindow:show', () => {
            document.querySelectorAll('.main-grid-settings-window-list-item').forEach(item => {
                const label = item.querySelector('label')
                if (!label) {
                    return
                }
                const originalText = label.innerHTML.split('<br>')[0]
                label.innerHTML = originalText + KbTweaksUtil.getCodeHtml(item.dataset.name, '#aaa', '10px', false)
            })
        })
    }

    handleBpCodeMonospace () {
        KbTweaksUtil.addStyle(`
            .bx-core-adm-dialog textarea[name=execute_code] {
                font-family: monospace;
            }
        `)
    }

    handleBpExpandSelect () {
        if (!window.location.href.includes('crm/configs')) {
            return
        }

        BX.addCustomEvent('onAjaxSuccessFinish', r => {
            if (!r.url.includes('/bitrix/tools/bizproc_get_field.php')) {
                return
            }
            document
                .querySelectorAll('.bx-core-adm-dialog select[id^=id_document_field]')
                .forEach(select => {
                    select.size = 4

                    if (select.value) {
                        const option = select.querySelector(`option[value="${select.value}"]`)
                        option && (select.scrollTop = option.offsetTop)
                    }
                })
        })
    }

    handleSidePanelReload () {
        BX.addCustomEvent('SidePanel.Slider:onLoad', () => {
            if (!window.location.href.includes('IFRAME=Y')) {
                return
            }
            const reload = document.createElement('div')
            reload.classList.add('ui-entity-editor-content-add-lnk', 'bk-reload-button')
            reload.style.position = 'absolute'
            reload.style.left = '4px'
            reload.style.top = 0
            reload.innerText = 'reload'
            reload.addEventListener('click', () => BX.SidePanel.Instance.reload())

            document.body.append(reload)
        })
    }

    handleDetailsSelectField () {
        // for old interface compat
        BX.addCustomEvent('BX.Crm.EntityEditorSection:onOpenChildMenu', (_, menu) => {
            menu.menuItems = menu.menuItems.map(i => {
                i.text = `${i.text} [${i.value}]`
                return i
            })
        })
        BX.addCustomEvent(
            'SidePanel.Slider:onLoad',
            () => window.location.href.includes('IFRAME=Y') && document
                .querySelectorAll('.ui-entity-editor-content-add-lnk')
                .forEach(button => button.addEventListener(
                    'click',
                    () => document
                        .querySelectorAll('.ui-entity-editor-popup-field-selector-list-label')
                        .forEach(l => l.innerHTML += KbTweaksUtil.getCodeHtml(
                            l.getAttribute('for').split('\\')[1],
                            '#bbb',
                            '10px',
                            false,
                        )),
                )),
        )
    }
}

class KbTweaksUtil {
    static async sleep (ms = 200) {
        return new Promise((r) => setTimeout(r, ms))
    }

    static async waitUntil (condition, ms, sleepStep = 200) {
        let i = 0
        while (i < ms) {
            i += sleepStep
            if (condition()) {
                return true
            }
            await KbTweaksUtil.sleep(sleepStep)
        }
        return false
    }

    static getCodeHtml (code, color = '#bbb', fontSize = '12px', braces = true) {
        if (braces) {
            code = `[${code}]`
        }
        return `
            <span class='bk-code'
               href='/bitrix/admin/userfield_admin.php?find_field_name=${code}'
               style='color: ${color}; font-size: ${fontSize}; user-select: all'
            >${code}</span>
        `
    }

    static addCodeToLabel (f) {
        if (!f._wrapper) {
            return
        }
        const label = f._wrapper.querySelector('label')
        if (!label || label.querySelector('.bk-code')) {
            return
        }
        label.innerHTML += KbTweaksUtil.getCodeHtml(f._id)
    }

    static addCodesToGrid (grid) {
        grid.getHead().querySelectorAll('th').forEach(th => {
            if (!th.dataset.name || th.querySelector('.bk-code')) {
                return
            }
            const codeNode = document.createElement('span')
            codeNode.innerHTML = KbTweaksUtil.getCodeHtml(th.dataset.name, '#bbb', '12px', false)
            codeNode.style.userSelect = 'all'
            codeNode.style.position = 'absolute'
            codeNode.style.top = '-2px'
            codeNode.style.left = '15px'
            codeNode.style.fontWeight = 'lighter'
            codeNode.onclick = event => {
                event.stopPropagation()
                window.getSelection().selectAllChildren(codeNode)
            }
            codeNode.onmousedown = event => {
                event.stopPropagation()
            }

            th.append(codeNode)
        })
    }

    static addStyle (s) {
        document.head.insertAdjacentHTML('beforeend', `<style>${s}</style>`)
    }
}

KbTweaks.init()
