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

    init() {
        this._columns = this.el.querySelectorAll(this.options.collapseColumnSelector);
        this._registerEvents();

        document.$emitter.subscribe('openMenu', (event) => {
            this._columns = document.querySelectorAll(this.options.collapseColumnSelector);
            this._registerEvents();
        })
    }

    _isInAllowedViewports() {
        return true;
    }

    _onClickCollapseTrigger(event) {
        const trigger = event.target;
        const collapse = trigger.parentNode.parentNode.querySelector(this.options.collapseColumnContentSelector);

        const $collapse = $(collapse);
        const collapseShowClass = this.options.collapseShowClass;

        $collapse.collapse('toggle');

        // product variant dropdown selector
        $('.product-detail-configurator-collapse .collapse').collapse('hide');

        $collapse.on('shown.bs.collapse', () => {
            trigger.classList.add(collapseShowClass);
            this.$emitter.publish('onCollapseShown');
        });

        $collapse.on('hidden.bs.collapse', () => {
            trigger.classList.remove(collapseShowClass);
            this.$emitter.publish('onCollapseHidden');
        });

        this.$emitter.publish('onClickCollapseTrigger');
    }
}
