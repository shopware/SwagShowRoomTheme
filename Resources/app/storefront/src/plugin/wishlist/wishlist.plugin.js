import WishlistWidgetPlugin from 'src/plugin/header/wishlist-widget.plugin.js';

export default class WishlistPlugin extends WishlistWidgetPlugin {
    /**
     * @private Display check mark if wishlist have any item.
     */
    _renderCounter() {
        const wishListItems = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><g class="nc-icon-wrapper"><path fill="#26262F" fill-rule="evenodd" d="M7.707 12.293a1 1 0 1 0-1.414 1.414l3 3a1 1 0 0 0 1.414 0l7-7a1 1 0 1 0-1.414-1.414L10 14.586l-2.293-2.293z"/></g></svg>'
        this.el.innerHTML = this._wishlistStorage.getCurrentCounter() > 0 ? wishListItems : '';
    }
}
