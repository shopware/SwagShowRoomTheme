import LanguageCurrency from './plugin/language-currency/language-currency.plugin';
import ShowroomCollapseColumn from './plugin/collapse-columns/collapse-columns.plugin';
import ShowroomOffcanvasMenuPlugin from './plugin/main-menu/offcanvas-menu.plugin';
import CustomizedProductsStepByStepWizard from './plugin/customized-product/customized-product.plugin';
import CmsExtensionsQuickviewOptions from './plugin/quick-view/quick-view.plugin';

const PluginManager = window.PluginManager;
PluginManager.register('LanguageCurrency', LanguageCurrency, '[data-language-currency]');
PluginManager.register('ShowroomCollapseColumn', ShowroomCollapseColumn, '[data-showroom-collapse]');
PluginManager.override('OffcanvasMenu', ShowroomOffcanvasMenuPlugin, '[data-offcanvas-menu]');
PluginManager.override('SwagCustomizedProductsStepByStepWizard', CustomizedProductsStepByStepWizard, '*[data-swag-customized-product-step-by-step="true"]');
PluginManager.override('SwagCmsExtensionsQuickview', CmsExtensionsQuickviewOptions, '[data-swag-cms-extensions-quickview="true"]');
