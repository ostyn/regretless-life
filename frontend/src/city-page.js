import {City} from 'City.js'
export class CityPage {
    activate(params, routeConfig, navigationInstruction) {
        this.city = new City(params.name);
        routeConfig.navModel.title = "Explore " + this.city.name;
    }
}