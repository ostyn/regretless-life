import { inject, observable } from 'aurelia-framework';
import { VrtDao } from "dao/VrtDao";
@inject(VrtDao)
export class BusTracker {
    @observable selectedRoute = undefined;
    @observable selectedStop = undefined;
    notCurrentlyRequesting = true;
    selectedRouteChanged(newVal, oldVal) {
        this.stops = undefined;
        this.vrtDao.getStopsOnRoute(this.selectedRoute.routeId)
            .then((stops) => {
                this.stops = stops;
            });
    }
    selectedStopChanged(newVal, oldVal) {
        this.currentStopInfo = undefined;
        this.vrtDao.getStatusForStop(this.selectedStop.stopId)
            .then((info) => {
                this.currentStopInfo = info;
            });
    }

    activate(params, routeConfig, navigationInstruction) {
        this.vrtDao.getRoutes()
            .then((routes) => {
                routes.data.forEach(route => {
                    if (route.routeId == params.routeId)
                        this.selectedRoute = route;
                });
                this.routes = routes;
            });
        this.vrtDao.getStopsOnRoute(params.routeId)
            .then((stops) => {
                stops.data.forEach(stop => {
                    if (stop.stopId == params.stopId)
                        this.selectedStop = stop;
                });
                this.stops = stops;
            });
            setInterval(this.getStatusForCurrentStop, 10000);
        ;
    }

    getStatusForCurrentStop = () => {
        if (this.notCurrentlyRequesting) {
            this.notCurrentlyRequesting = false;
            this.vrtDao.getStatusForStop(this.selectedStop.stopId)
                .then((info) => {
                    this.notCurrentlyRequesting = true;
                    this.currentStopInfo = info;
                });
        }
    }


    constructor(vrtDao) {
        this.vrtDao = vrtDao;
    }
}