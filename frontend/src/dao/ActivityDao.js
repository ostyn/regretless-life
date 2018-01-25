import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import {BaseGenericDao} from 'dao/BaseGenericDao';
@inject(HttpClient)
export class ActivityDao extends BaseGenericDao {
    constructor(http) {
        super(http, "activities");
    }
}