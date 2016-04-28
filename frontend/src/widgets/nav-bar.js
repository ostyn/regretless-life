import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
@inject(Router)
export class NavBar{
    isOut = false;
    constructor(router){
        this.router = router;
    }
    toggleDropdown(){
        this.isOut = !this.isOut;
    }
    search(query){
        this.isOut = false;
        this.router.navigateToRoute('search', { query: query })
    }
}