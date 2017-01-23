import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {EventAggregator} from 'aurelia-event-aggregator';
import {PageChanged} from 'messages/messages'
@inject(Router, EventAggregator)
export class NavBar{
    isOut = false;
    constructor(router, eventAggregator){
        this.router = router;
        this.eventAggregator = eventAggregator;
        this.eventAggregator.subscribe(PageChanged, msg => (this.isOut = false));
    }
    toggleDropdown(){
        this.isOut = !this.isOut;
    }
    search(query){
        this.isOut = false;
        this.router.navigateToRoute('search', { query: query })
    }
}