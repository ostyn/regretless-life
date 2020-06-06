import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {EventAggregator} from 'aurelia-event-aggregator';
import {PageChanged} from 'messages/messages'
import {ExtraMenuItemsConfig} from 'extraMenuItemsConfig';
@inject(Router, EventAggregator, ExtraMenuItemsConfig)
export class NavBar{
    isMobileMenuOut = false;
    query = "";
    constructor(router, eventAggregator, extraMenuItemsConfig){
        this.router = router;
        this.eventAggregator = eventAggregator;
        this.extraMenuItemsConfig = extraMenuItemsConfig;
        this.eventAggregator.subscribe(PageChanged, msg => (this.isMobileMenuOut = false));
    }
    toggleMobileMenu(){
        this.isMobileMenuOut = !this.isMobileMenuOut;
    }
    search = (query)=>{
        this.isMobileMenuOut = false;
        this.router.navigateToRoute('search', { query: query })
    }
}