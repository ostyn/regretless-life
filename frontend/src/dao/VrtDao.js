import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
@inject(HttpClient)
export class VrtDao {
    constructor(http) {
        this.http = http;
    }
    getRoutes() {
        return this.http.fetch('getRoutes')
            .then(response => {
                return response.json();
            })
            .then(data => {
                return data;
            })
            .catch(ex => {
                console.log(ex);
            });
    }
    getStopsOnRoute(route) {
        return this.http.fetch('getStopsForRoute?routeId=' + route)
            .then(response => {
                return response.json();
            })
            .then(data => {
                return data;
            })
            .catch(ex => {
                console.log(ex);
            });
    }
    getStatusForStop(stop) {
        return this.http.fetch('getStatusForStop?stopId=' + stop)
            .then(response => {
                return response.json();
            })
            .then(data => {
                return data;
            })
            .catch(ex => {
                console.log(ex);
            });
    }
}