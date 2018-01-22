import {inject, NewInstance} from 'aurelia-framework';
import {HttpClient, json} from 'aurelia-fetch-client';
import {BaseGenericDao} from 'dao/BaseGenericDao';
@inject(NewInstance.of(HttpClient))
export class TrackerDao extends BaseGenericDao {
    constructor(http) {
        super(http, "entries");
    }
    getEntries() {
        return this.http.fetch('getItems')
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
    saveEntry(passedEntry) {
        var clone = Object.assign({}, passedEntry);
        clone.activities = this.strMapToObj(passedEntry.activities);
        return this.http
            .fetch('saveItem', {
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
    deleteEntry(id) {
        return this.http
            .fetch('deleteItem', {
                method: 'delete',
                body: json({
                    'id': id,
                }),
            })
            .then(response => {
                if(response.status > 400)
                    throw response;
                return response.json();
            })
            .then((resp) => {
                return resp;
            });
    }
    strMapToObj(strMap) {
        let obj = Object.create(null);
        for (let [k,v] of strMap) {
            obj[k] = v;
        }
        return obj;
    }
    ObjToStrMap(obj) {
        let map = new Map();
        for (let k in obj) {
            map.set(k, obj[k]);
        }
        return map;
    }
}