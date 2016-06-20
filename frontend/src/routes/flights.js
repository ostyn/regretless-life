import {inject, bindable, customElement} from 'aurelia-framework';
import {SkyScannerApi} from '../dao/SkyScannerDao.js';
@inject(SkyScannerApi)
@customElement('flights')
export class Flights {
    @bindable name = "Boise";
    @bindable date = "2016-03";
    @bindable selectedAirport = {};
    constructor(skyApi) {
        this.data = "";
        this.selectedAirport = {};
        this.places = {};
        this.skyApi = skyApi;
    }

    dateChanged() {
        this.selectAirport(this.selectedAirport);
    }
    mapCodeToInfo(code) {
        return this.places[code];
    }
    selectAirport = (airport) => {
        this.selectedAirport = airport;
        this.skyApi.getCheapestFlightsForDate(this.date, airport.PlaceId.substring(0, airport.PlaceId.length - 4))
            .then((data) => {
                airport.routes = data;
                data.Quotes.sort(function(a, b) {
                    return parseFloat(a.MinPrice) - parseFloat(b.MinPrice);
                });
                data.Places.forEach(place => {
                    this.places[place.PlaceId] = place;
                });
            });
    }
}