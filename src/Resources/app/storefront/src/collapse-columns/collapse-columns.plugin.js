import deepmerge from 'deepmerge';
import CollapseFooterColumnsPlugin from 'src/plugin/collapse/collapse-footer-columns.plugin';

export default class CollapseColumnsPlugin extends CollapseFooterColumnsPlugin {

    /**
     * default collapse options
     *
     * @type {*}
     */
    static options = deepmerge(CollapseFooterColumnsPlugin.options, {
        collapseColumnSelector: '.js-collapse-column',
        collapseColumnTriggerSelector: '.js-collapse-column-trigger',
        collapseColumnContentSelector: '.js-column-content'
    });

    _isInAllowedViewports() {
        return true;
    }
}
