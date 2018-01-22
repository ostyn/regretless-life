import {json} from 'aurelia-fetch-client';
export class BaseGenericDao {
    constructor(http, name) {
        http.configure(config => {
            config
                .withBaseUrl(window.location.protocol + '//' + window.location.hostname + ':5000/' + name +'/')
                .withDefaults({
                    headers: {
                        'Accept': 'application/json',
                        'Content-type': 'application/json'
                    }
                });
        });
        this.http = http;
    }
    getItems() {
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
    saveItem(passedEntry) {
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
    deleteItem(id) {
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