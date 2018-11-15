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

    }
    setRoute(route){
        this.vrtDao.getStopsOnRoute(route)
            .then((stops) => {
                this.stops = stops;
            });
    }
    setStop(stop){
        this.vrtDao.getStatusForStop(stop)
            .then((info) => {
                this.currentStopInfo = info;
            });
    }
}