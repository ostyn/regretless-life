import {inject} from 'aurelia-framework';
import {HttpClient, json} from 'aurelia-fetch-client';
import {BaseGenericDao} from 'dao/BaseGenericDao';
@inject(HttpClient)
export class EntryDao extends BaseGenericDao {
    path;
    constructor(http) {
        super(http, "entries");
        this.path = "entries";
    }
    getItems() {
        return this.http.fetch(this.path + '/getItems')
            .then(response => {
                return response.json();
            })
            .then(data => {
                data.items.forEach(element => {
                    element.activities = this.ObjToStrMap(element.activities);
                });
                return data.items;
            })
            .catch(ex => {
                console.log(ex);
            });
    }
    saveItem(passedEntry) {
        var clone = Object.assign({}, passedEntry);
        clone.activities = this.strMapToObj(passedEntry.activities);
        return this.http
            .fetch(this.path + '/saveItem', {
                method: 'post',
                body: json(clone),
            })
            .then(response => {
                if(response.status > 400)
                    throw response;
                return response.json();
            })
            .then((entry) => {
                return entry._id
            });
    }
}