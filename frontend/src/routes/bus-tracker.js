import { inject, observable } from 'aurelia-framework';
import { VrtDao } from "dao/VrtDao";
import {Router, activationStrategy} from 'aurelia-router';
@inject(VrtDao, Router)
export class BusTracker {
    currentStop = undefined;
    currentRoute = undefined;
    @observable selectedRoute = undefined;
    @observable selectedStop = undefined;
    notCurrentlyRequesting = true;
    interval = undefined;
    selectedRouteChanged(newVal, oldVal) {
        this.stops = undefined;
        if (this.selectedRoute) {
            this.currentRoute = this.selectedRoute.routeId;
            this.vrtDao.getStopsOnRoute(this.currentRoute)
                .then((stops) => {
                    stops.data.forEach(stop => {
                        if (stop.stopId == this.currentStop)
                            this.selectedStop = stop;
                    });
                    this.stops = stops;
                });
        }
    }
    selectedStopChanged(newVal, oldVal) {
        if (this.selectedStop) {
            this.currentStopInfo = undefined;
            this.currentStop = this.selectedStop.stopId;
            if (this.interval)
                clearInterval(this.interval);
            this.getStatusForCurrentStop();
            this.interval = setInterval(this.getStatusForCurrentStop, 10000);
            this.router.navigate(this.router.generate('bus', {
                stopId : this.currentStop,
                routeId : this.currentRoute
            }));
        }
    }
    determineActivationStrategy(){
        return activationStrategy.noChange;
    }
    activate(params, routeConfig, navigationInstruction) {
        this.currentRoute = params.routeId;
        this.currentStop = params.stopId;
        this.vrtDao.getRoutes()
            .then((routes) => {
                routes.data.forEach(route => {
                    if (route.routeId == this.currentRoute)
                        this.selectedRoute = route;
                });
                this.routes = routes;
            });
    }

    getStatusForCurrentStop = () => {
        if (this.currentStop && this.notCurrentlyRequesting) {
            this.notCurrentlyRequesting = false;
            this.vrtDao.getStatusForStop(this.currentStop)
                .then((info) => {
                    this.notCurrentlyRequesting = true;
                    this.currentStopInfo = info;
                });
        }
    }
    updateTimeSinceLastDataTimestamp() {
        if(this.currentStopInfo)
            this.timeSinceLastDataTimestamp = Math.round((new Date().getTime() - new Date(this.currentStopInfo.time).getTime())/1000);
    }

    constructor(vrtDao, router) {
        this.vrtDao = vrtDao;
        this.router = router;
        setInterval(() => this.updateTimeSinceLastDataTimestamp(), 1000);
    }
}