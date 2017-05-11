import {observable, bindable} from 'aurelia-framework'
export class MultiSelectBox {
    @bindable selectedItems = new Set();
    @bindable availableItems = new Set();
    matchingItems = new Set();
    @bindable placeholder;
    @observable currentItem;
    focusTextBox = false;
    selectItem(currentItem) {
        this.selectedItems.add(currentItem);
        this.currentItem = undefined;
        this.focusTextBox = true;
    }
    removeItem(item) {
        this.focusTextBox = true;
        this.selectedItems.delete(item);
        this.buildMatchingItemsList();
    }
    currentItemChanged(newValue, oldValue){
        this.matchingItems = [];
        if(this.currentItem === undefined || this.currentItem === '')
            return;
        this.buildMatchingItemsList();
    }
    buildMatchingItemsList(){
        for(let item of this.availableItems.entries()) {
            if(item[0].includes(this.currentItem) && !this.selectedItems.has(item[0])) {
                this.matchingItems.push(item[0]);
            }
        }
    }
}