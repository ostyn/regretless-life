import {inject} from 'aurelia-framework';
import 'fetch';
import {HttpClient, json} from 'aurelia-fetch-client';
@inject(HttpClient)
export class BlogDao {
    posts = [];
    remaining = 0;
    constructor(http) {
        http.configure(config => {
            config
                .withBaseUrl('http://' + window.location.hostname + '/data/')
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
                return data.resp;
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
                return data.resp;
            })
            .catch(ex => {
                console.log(ex);
            });
    }

    getSurroundingPosts(date) {
        return this.http.fetch('getSurroundingPosts?date=' + date)
            .then(response => {
                return response.json();
            })
            .then(data => {
                if(data.resp != null)
                    return data.resp;
                else
                    return;
            })
            .catch(ex => {
                console.log(ex);
            });
    }

    submitPost(title, author, location, content, heroPhotoUrl) {
        return this.http
            .fetch('submitPost', {
                method: 'post',
                body: json({
                    'title': title,
                    'author': author,
                    'location': location,
                    'content': content,
                    'heroPhotoUrl': heroPhotoUrl,
                    'date': new Date().getTime(),
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
    updatePost(id, title, author, location, content, heroPhotoUrl) {
        return this.http
            .fetch('updatePost', {
                method: 'post',
                body: json({
                    'id': id,
                    'title': title,
                    'author': author,
                    'location': location,
                    'content': content,
                    'heroPhotoUrl': heroPhotoUrl,
                    'date': new Date().getTime(),
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
    submitComment(postId, name, content, email = "") {
        return this.http
            .fetch('submitComment', {
                method: 'post',
                body: json({
                    'postId': postId,
                    'name': name,
                    'email': email,
                    'content': content,
                    'date': new Date().getTime(),
                }),
            })
            .then(response => {
                if(response.status > 400)
                    throw response;
                return response.json();
            })
            .then((post) => {
                return post.id
            });
    }
}