// SwagShowRoomTheme Copyright (C) 2025 shopware AG

import deepmerge from 'deepmerge';

import DatePickerPlugin from 'src/plugin/date-picker/date-picker.plugin';

export default class ShowroomDatePickerPlugin extends DatePickerPlugin {
    /**
     * default plugin options
     *
     * @type {*}
     */
    static options = deepmerge(DatePickerPlugin.options, {
        weekNumbers: false,
        allowInput: false,
        disableMobile: true
    });
}
