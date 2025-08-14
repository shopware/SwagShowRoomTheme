// SwagShowRoomTheme Copyright (C) 2025 shopware AG

const PluginManager = window.PluginManager;
PluginManager.register('LanguageCurrency', () => import( './plugin/language-currency/language-currency.plugin'), '[data-language-currency]');
PluginManager.register('ShowroomCollapseColumn', () => import('./plugin/collapse-columns/collapse-columns.plugin'), '[data-showroom-collapse]');
PluginManager.register('ShowroomCustomizedProductsStepByStepWizard', () => import('./plugin/customized-product/customized-product.plugin'), '*[data-swag-customized-product-step-by-step="true"]');
PluginManager.override('DatePicker', () => import('./plugin/date-picker/date-picker.plugin'), '[data-date-picker]');
PluginManager.override('FormScrollToInvalidField',() => import('./plugin/forms/form-scroll-to-invalid-field.plugin'), 'form');
PluginManager.override('OffCanvasMenu', () => import('./plugin/main-menu/off-canvas-menu.plugin'), '[data-off-canvas-menu]');

if (window.wishlistEnabled) {
    PluginManager.override('WishlistWidget', () => import( './plugin/wishlist/wishlist.plugin'), '[data-wishlist-widget]');
} else {
    PluginManager.register('WishlistWidget', () => import( './plugin/wishlist/wishlist.plugin'), '[data-wishlist-widget]');
}
