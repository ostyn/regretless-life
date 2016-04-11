import {inject} from 'aurelia-framework';
import {HttpClient, json} from 'aurelia-fetch-client';
@inject(HttpClient)
export class SkyScannerApi {
    posts = ['a', 'b', 'c'];
    constructor(http) {
        http.configure(config => {
            config
                .withBaseUrl('http://localhost:5000/')
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
    getAllPosts() {
        return this.http.fetch('findAllPosts')
            .then(response => {
                return response.json();
            })
            .then(data => {
                this.posts = data.resp;
            })
            .catch(ex => {
                console.log(ex);
            });
    }
    findAllPosts(query) {
        return this.http.fetch('findAllPosts?query=' + query)
            .then(response => {
                return response.json();
            })
            .then(data => {
                this.posts = data.resp;
            })
            .catch(ex => {
                console.log(ex);
            });
    }
    submitPost(title, author, location, content, date) {
        this.http
            .fetch('submitPost', {
                method: 'post',
                body: json({
                    'title': title,
                    'author': author,
                    'location': location,
                    'content': content,
                    'date': date,
                }),
            })
            .then(response => response.json())
            .then(savedComment => {
                alert(`Saved comment! ID: ${savedComment.id}`);
            })
            .catch(error => {
                alert('Error saving comment!');
            });
    }
}