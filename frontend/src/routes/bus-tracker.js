import { inject } from 'aurelia-framework';
import { VrtDao } from "dao/VrtDao";
@inject(VrtDao)
export class BusTracker {
    constructor(vrtDao) {
        this.vrtDao = vrtDao;
        this.vrtDao.getRoutes()
            .then((routes) => {
                this.routes = routes;
            });
        this.vrtDao.getStopsOnRoute(undefined)
            .then((stops) => {
                this.stops = stops;
            });
    }
}