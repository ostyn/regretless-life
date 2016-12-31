import {inject} from 'aurelia-framework';
import {HttpClient, json} from 'aurelia-fetch-client';
@inject(HttpClient)
export class SkyScannerApi {
    posts = [];
    constructor(http) {
        http.configure(config => {
            config
                .withBaseUrl('http://' + window.location.hostname + ':5000/')
                .withDefaults({
                    headers: {
                        'Accept': 'application/json',
                        'Content-type': 'application/json'
                    }
                });
        });
        this.http = http;
    }
    getAirports(query) {
        return this.http.fetch('airportQuery?query=' + query)
            .then(response => {
                return response.json();
            })
            .catch(ex => {
                console.log(ex);
            });
    }
    getCheapestFlightsForDate(date, start, end = 'anywhere') {
        return this.http.fetch('routeQuery?date=' + date + '&start=' + start + '&end=' + end)
            .then(response => {
                return response.json();
            })
            .catch(ex => {
                console.log(ex);
            });
    }
}