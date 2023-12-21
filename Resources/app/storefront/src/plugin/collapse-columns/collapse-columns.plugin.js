import CollapseFooterColumnsPlugin from 'src/plugin/collapse/collapse-footer-columns.plugin';
import deepmerge from 'deepmerge';
import Iterator from 'src/helper/iterator.helper';

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
        const collapseShowClass = this.options.collapseShowClass;

        // stylelint-disable-next-line
        new bootstrap.Collapse(collapse, { collapse: true });

        const collapseList = document.querySelectorAll('.product-detail-configurator-collapse .collapse.show')
        Iterator.iterate(collapseList, (collapseEl) => {
            // stylelint-disable-next-line
            new bootstrap.Collapse(collapseEl).hide()
        })

        collapse.addEventListener('shown.bs.collapse', () => {
            trigger.classList.add(collapseShowClass);
            this.$emitter.publish('onCollapseShown');
        });

        collapse.addEventListener('hidden.bs.collapse', () => {
            trigger.classList.remove(collapseShowClass);
            this.$emitter.publish('onCollapseHidden');
        });
    }
}
