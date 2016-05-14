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
    getPost(id) {
        return this.http.fetch('getPost?id=' + id)
            .then(response => {
                return response.json();
            })
            .then(data => {
                if(data.resp != null)
                    this.post = data.resp;
                else
                    this.post = undefined;
            })
            .catch(ex => {
                console.log(ex);
            });
    }
    submitPost(title, author, location, content, date) {
        return this.http
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
            .then(response => {
                if(response.status > 400)
                    throw response;
                return response.json();
            })
            .then((submittedPost) => {
                return submittedPost.id
            });
    }
}