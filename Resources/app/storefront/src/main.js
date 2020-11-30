import LanguageCurrency from './plugin/language-currency/language-currency.plugin';
import ShowroomCollapseColumn from './plugin/collapse-columns/collapse-columns.plugin';
import ShowroomOffcanvasMenuPlugin from './plugin/main-menu/offcanvas-menu.plugin';

const PluginManager = window.PluginManager;
PluginManager.register('LanguageCurrency', LanguageCurrency, '[data-language-currency]');
PluginManager.register('ShowroomCollapseColumn', ShowroomCollapseColumn, '[data-showroom-collapse]');
PluginManager.override('OffcanvasMenu', ShowroomOffcanvasMenuPlugin, '[data-offcanvas-menu]');
