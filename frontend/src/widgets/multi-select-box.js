import {bindable} from 'aurelia-framework'
export class MultiSelectBox {
    @bindable items = new Set();
    @bindable placeholder;
    currentItem;
    inputItem() {
        this.items.add(this.currentItem);
        this.currentItem = undefined;
    }
    removeItem(item) {
        this.items.delete(item);
    }
}