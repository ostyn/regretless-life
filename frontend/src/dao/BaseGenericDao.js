import {json} from 'aurelia-fetch-client';
export class BaseGenericDao {
    constructor(http, name) {
        this.path = name;
        this.http = http;
    }
    getItems() {
        return this.http.fetch(this.path + '/getItems')
            .then(response => {
                return response.json();
            })
            .then(data => {
                return data.items;
            })
            .catch(ex => {
                console.log(ex);
            });
    }
    saveItem(passedEntry) {
        return this.http
            .fetch(this.path + '/saveItem', {
                method: 'post',
                body: json(passedEntry),
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
            .fetch(this.path + '/deleteItem', {
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