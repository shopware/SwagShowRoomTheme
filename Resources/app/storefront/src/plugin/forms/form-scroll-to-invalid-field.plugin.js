import FormScrollToInvalidFieldPlugin from 'src/plugin/forms/form-scroll-to-invalid-field.plugin';

export default class ShowRoomFromScrollToInvalidFieldPlugin extends FormScrollToInvalidFieldPlugin {
    /**
     * gets called all invalid fields if the form got submitted
     *
     * @param event
     * @private
     */
    _onInvalid(event) {
        if (event.target._ignoreValidityEvent) {
            delete event.target._ignoreValidityEvent;
            return;
        }

        event.stopPropagation();

        if (this._firstInvalidElement) {
            return;
        }

        this._getFirstInvalidFormFields(event);
        this._scrollToInvalidFormFields();

        this.$emitter.publish('onInvalid');
    }
}
