import LanguageCurrency from './plugin/language-currency/language-currency.plugin';
import ShowroomCollapseColumn from './plugin/collapse-columns/collapse-columns.plugin';
import ShowroomOffcanvasMenuPlugin from './plugin/main-menu/offcanvas-menu.plugin';
import CustomizedProductsStepByStepWizard from './plugin/customized-product/customized-product.plugin';
import CmsExtensionsQuickviewOptions from './plugin/quick-view/quick-view.plugin';
import WishlistPlugin from './plugin/wishlist/wishlist.plugin';
import ShowroomDatePickerPlugin from './plugin/date-picker/date-picker.plugin';
import ShowroomGallerySliderPlugin from './plugin/slider/gallery-slider.plugin';

const PluginManager = window.PluginManager;
PluginManager.register('LanguageCurrency', LanguageCurrency, '[data-language-currency]');
PluginManager.register('ShowroomCollapseColumn', ShowroomCollapseColumn, '[data-showroom-collapse]');
PluginManager.override('OffcanvasMenu', ShowroomOffcanvasMenuPlugin, '[data-offcanvas-menu]');
PluginManager.register('ShowroomCustomizedProductsStepByStepWizard', CustomizedProductsStepByStepWizard, '*[data-swag-customized-product-step-by-step="true"]');
PluginManager.register('ShowroomCmsExtensionsQuickview', CmsExtensionsQuickviewOptions, '[data-swag-cms-extensions-quickview="true"]');
PluginManager.override('DatePicker', ShowroomDatePickerPlugin, '[data-date-picker]');
PluginManager.override('GallerySlider', ShowroomGallerySliderPlugin, '[data-gallery-slider]');

if (window.wishlistEnabled) {
    PluginManager.override('WishlistWidget', WishlistPlugin, '[data-wishlist-widget]');
} else {
    PluginManager.register('WishlistWidget', WishlistPlugin, '[data-wishlist-widget]');
}
