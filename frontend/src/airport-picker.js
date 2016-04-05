import {inject, bindable, customElement} from 'aurelia-framework';
import {SkyScannerApi} from 'SkyScannerApi.js';
@inject(SkyScannerApi)
@customElement('airport-picker')
export class AirportPicker {
    @bindable selectAction;
    @bindable query = "";
    constructor(skyApi) {
        this.airport = {};
        this.skyApi = skyApi;
    }

    queryChanged() {
        this.skyApi.getAirports(this.query)
            .then(data => {
                this.data = data;
            });
    }

    selectAirport(airport) {
        this.selectAction(airport)
    }

    getAirportName(airport) {
        if (!airport || !airport.PlaceName)
            return "";
        let name = `${airport.PlaceName}, ${airport.RegionId}${(airport.RegionId !== "") ? ", " : ""}${airport.CountryName}`;
        name = name + " " + airport.PlaceId.substring(0, airport.PlaceId.length - 4);
        return name;
    }
}