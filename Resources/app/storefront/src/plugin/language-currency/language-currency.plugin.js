// SwagShowRoomTheme Copyright (C) 2025 shopware AG

import Plugin from 'src/plugin-system/plugin.class';
import DomAccess from 'src/helper/dom-access.helper';

export default class LanguageCurrency extends Plugin {

    static options = {
        dropdownSelector: '.language-currency-menu-dropdown'
    };

    init() {
        this._registerEvents();
    }

    /**
     * register triggers
     *
     * @private
     */
    _registerEvents() {
        this._preventDropdownClose();
    }

    /**
     * When we click to the dropdown, it auto close by themself
     *
     * @private
     */
    _preventDropdownClose() {
        const dropdownMenu = DomAccess.querySelector(this.el, this.options.dropdownSelector, false);

        if (!dropdownMenu) {
            return;
        }

        dropdownMenu.addEventListener('click', (event) => {
            event.stopPropagation();
        });
    }
}
