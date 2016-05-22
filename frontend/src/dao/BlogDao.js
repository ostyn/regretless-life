import {inject} from 'aurelia-framework';
import {HttpClient, json} from 'aurelia-fetch-client';
@inject(HttpClient)
export class SkyScannerApi {
    posts = [];
    remaining = 0;
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
        return this.findAllPosts();
    }
    getNPosts(start, num) {
        return this.findNPosts("", start, num);
    }
    findAllPosts(query = "") {
        return this.findNPosts(query);
    }
    findNPosts(query = "", start = 0, num = 0) {
        return this.http.fetch('findNPosts?query=' + query + "&start=" + start + "&num=" + num)
            .then(response => {
                return response.json();
            })
            .then(data => {
                this.posts = data.resp.posts;
                this.remaining = data.resp.remainingPosts;
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
    updatePost(id, title, author, location, content, date) {
        return this.http
            .fetch('updatePost', {
                method: 'post',
                body: json({
                    'id': id,
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