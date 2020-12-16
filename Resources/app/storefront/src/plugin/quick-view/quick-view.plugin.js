const SwagCmsExtensionsQuickview = window.PluginManager.getPluginList().SwagCmsExtensionsQuickview.get('class');

export default class CmsExtensionsQuickviewOptions extends SwagCmsExtensionsQuickview {

    static options = {
        
        ...SwagCmsExtensionsQuickview.options,

        /**
         * Add .product-overview to productBoxLinkSelector - used to identify all links or clickable elements
         * inside a product box. This is used to catch all click events and open a quickview instead
         * of executing the default action.
         *
         * @var {string}
         */
        productBoxLinkSelector: [
            'a.product-name',
            'a.product-image-link',
            '.swag-cms-extensions-quickview-listing-button-detail a.btn',
            '.product-overview'
        ].join(', '),
    };
}
