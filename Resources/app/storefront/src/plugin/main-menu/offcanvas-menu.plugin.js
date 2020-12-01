import OffcanvasMenuPlugin from 'src/plugin/main-menu/offcanvas-menu.plugin';

export default class ShowroomOffcanvasMenuPlugin extends OffcanvasMenuPlugin {

    /**
     * opens the offcanvas menu
     *
     * @param event
     * @private
     */
    _openMenu(event) {
        super._openMenu(event);
        window.eventEmitter.publish('openMenu')
    }
}
