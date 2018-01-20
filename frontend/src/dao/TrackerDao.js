import {inject} from 'aurelia-framework';
import {HttpClient, json} from 'aurelia-fetch-client';
@inject(HttpClient)
export class TrackerDao {
    constructor(http) {
        http.configure(config => {
            config
                .withBaseUrl(window.location.protocol + '//' + window.location.hostname + ':5000/')
                .withDefaults({
                    headers: {
                        'Accept': 'application/json',
                        'Content-type': 'application/json'
                    }
                });
        });
        this.http = http;
    }
    getPost(id) {
        return this.http.fetch('getPost?id=' + id)
            .then(response => {
                return response.json();
            })
            .then(data => {
                return data.resp;
            })
            .catch(ex => {
                console.log(ex);
            });
    }
    saveEntry(passedEntry) {
        var clone = Object.assign({}, passedEntry);
        clone.activities = this.strMapToObj(passedEntry.activities);
        return this.http
            .fetch('saveEntry', {
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
    deletePost(id) {
        return this.http
            .fetch('deletePost', {
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
    subscribe(email) {
        return this.http
            .fetch('subscribe', {
                method: 'post',
                body: json({
                    'email': email,
                }),
            })
            .then(response => {
                if(response.status > 400)
                    throw response;
                return response.json();
            });
    }
    strMapToObj(strMap) {
        let obj = Object.create(null);
        for (let [k,v] of strMap) {
            // We don’t escape the key '__proto__'
            // which can cause problems on older engines
            obj[k] = v;
        }
        return obj;
    }
}