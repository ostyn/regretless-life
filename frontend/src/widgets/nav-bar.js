import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {EventAggregator} from 'aurelia-event-aggregator';
import {PageChanged} from 'messages/messages'
@inject(Router, EventAggregator, Element)
export class NavBar{
    isMobileMenuOut = false;
    showSearchBox = false;
    query = "";
    constructor(router, eventAggregator, element){
        this.router = router;
        this.eventAggregator = eventAggregator;
        this.eventAggregator.subscribe(PageChanged, msg => (this.isMobileMenuOut = false));
    }
    toggleMobileMenu(){
        this.isMobileMenuOut = !this.isMobileMenuOut;
    }
    toggleSearchBox(){
        this.showSearchBox = !this.showSearchBox;
    }
    search(query){
        this.isMobileMenuOut = false;
        this.router.navigateToRoute('search', { query: query })
    }
}