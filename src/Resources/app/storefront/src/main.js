import LanguageCurrency from './language-currency/language-currency.plugin';
import ShowroomCollapseColumn from './collapse-columns/collapse-columns.plugin';

const PluginManager = window.PluginManager;
PluginManager.register('LanguageCurrency', LanguageCurrency, '[data-language-currency]');
PluginManager.register('ShowroomCollapseColumn', ShowroomCollapseColumn, '[data-showroom-collapse]');
