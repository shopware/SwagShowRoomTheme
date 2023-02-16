import DomAccess from 'src/helper/dom-access.helper';

function wrapper() {
    try {
        const SwagCustomizedProductsStepByStepWizard = window.PluginManager.getPlugin('SwagCustomizedProductsStepByStepWizard').get('class');

        class CustomizedProductsStepByStepWizard extends SwagCustomizedProductsStepByStepWizard {

            /**
             * Plugin init
             * @type {{containerSelector: string, pageSelector: string, startStepByStepSelector: string, pagerSelector: string}}
             */
            init() {
                this.translations = {
                    btnPrev: DomAccess.getDataAttribute(
                        this.el,
                        'swag-customized-product-step-by-step-translation-btnprev'
                    ),
                    btnNext: DomAccess.getDataAttribute(
                        this.el,
                        'swag-customized-product-step-by-step-translation-btnnext'
                    ),
                    btnFinish: DomAccess.getDataAttribute(
                        this.el,
                        'swag-customized-product-step-by-step-translation-btnfinish'
                    ),
                    required: DomAccess.getDataAttribute(
                        this.el,
                        'swag-customized-product-step-by-step-translation-required'
                    )
                };

                this.containerEl = DomAccess.querySelector(this.el, SwagCustomizedProductsStepByStepWizard.options.containerSelector);
                this.buyButton = DomAccess.querySelector(document, SwagCustomizedProductsStepByStepWizard.options.buyButtonSelector);

                this.form = this.el.closest('form');

                // Setup pages (and associated variables)
                this.pages = DomAccess.querySelectorAll(this.el, SwagCustomizedProductsStepByStepWizard.options.pageSelector);
                this.pages = this.collectPages(this.pages);

                this.pagesCount = this.pages.length;
                this.currentPage = 1;

                // Resize current page to the content height of the page
                this.setPageHeight(this.currentPage);

                // Get the configure elements and add an event listener
                this.configureElements = DomAccess.querySelectorAll(this.el, SwagCustomizedProductsStepByStepWizard.options.configureStepByStepSelector);

                // Set up navigation element
                this.navigationEntries = this.collectNavigationEntries(this.pages);
                this.navigationEl = DomAccess.querySelector(this.el, SwagCustomizedProductsStepByStepWizard.options.navigationSelector);
                this.navigationEl.innerHTML = this.renderNavigationSelection();

                // Setup pager element after setup navigationEntries
                this.pagerEl = DomAccess.querySelector(this.el, SwagCustomizedProductsStepByStepWizard.options.pagerSelector);
                this.pagerEl.innerHTML = this.renderPager();

                // History management
                if (SwagCustomizedProductsStepByStepWizard.options.history.enabled) {
                    this.parseLocationHashOnAndJumpToPage();
                    this.updateHistory();
                }

                super._registerEvents();
            }

            /**
             * Returns the template string of the pager, including navigation buttons
             *
             * @returns {String}
             */
            renderPager() {
                const showPager = () => {
                    return this.currentPage <= 1 || this.currentPage >= this.pagesCount;
                };

                /** Returns the disable attribute for the prev button */
                const disableBtnPrev = () => {
                    return this.currentPage <= 1 ? ' disabled="true"' : '';
                };

                /** Returns the disable attribute for the next button */
                const disableBtnNext = () => {
                    if ((this.currentPage - 1) >= (this.pagesCount - 2) && !this.isValidConfiguration()) {
                        return ' disabled="true"';
                    }
                    return this.currentPage >= this.pagesCount ? ' disabled="true"' : '';
                };

                /** Returns the button text for the next button */
                const btnNextText = () => {
                    if ((this.currentPage - 1) >= (this.pagesCount - 2)) {
                        return this.translations.btnFinish;
                    }
                    return this.translations.btnNext;
                };

                const renderPageButton = (entry) => {
                    if (entry.pageNum < (this.currentPage - 1)) {
                        return `
                    <span class="swag-customized-products-pager prev-page d-flex justify-content-center align-items-center">
                        <svg value="${entry.pageNum}"
                            xmlns="http://www.w3.org/2000/svg"
                            width="28"
                            height="28" viewBox="0 0 24 24">
                                <g class="nc-icon-wrapper">
                                <path fill="#fff" fill-rule="evenodd" d="M9.707 11.293a1 1 0 1 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4a1 1 0 1 0-1.414-1.414L11 12.586l-1.293-1.293z"/>
                            </g>
                        </svg>
                    </span>
                `;
                    } else if (entry.pageNum === (this.currentPage - 1)) {
                        return `
                <span class="swag-customized-products-pager current-page d-flex justify-content-center align-items-center">
                    ${entry.pageNum}
                </span>
            `;
                    }
                    return `
                <span class="swag-customized-products-pager next-page d-flex justify-content-center align-items-center">
                    ${entry.pageNum}
                </span>
            `;
                };

                return `
            <div class="swag-customized-products-pager${showPager() ? ' d-none' : ''}">
                <div class="swag-customized-products-pager__page-number d-flex mr-2">
                    ${this.navigationEntries.map(renderPageButton)}
                </div>

                <button class="swag-customized-products-pager__button btn-prev btn btn-sm btn-outline-primary" tabindex="0"
                        ${disableBtnPrev()}>
                    ${this.translations.btnPrev}
                </button>

                <button class="swag-customized-products-pager__button btn-next btn btn-sm btn-primary ml-2" tabindex="0"
                        ${disableBtnNext()}>
                    ${btnNextText()}
                </button>
            </div>
        `;
            }
        }

        return CustomizedProductsStepByStepWizard
    } catch (e) {}
}

export default wrapper()
