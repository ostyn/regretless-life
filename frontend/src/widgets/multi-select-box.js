import {bindable} from 'aurelia-framework'
export class MultiSelectBox {
    @bindable items = [];
    @bindable placeholder;
    currentItem;
    inputItem() {
        this.items.push(this.currentItem);
        this.currentItem = undefined;
    }
    removeItem(itemIndex) {
        this.items.splice(itemIndex, 1);
    }
}