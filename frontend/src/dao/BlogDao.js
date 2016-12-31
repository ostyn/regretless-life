import {inject} from 'aurelia-framework';
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
    getNDraftPosts(start, num) {
        return this.findNDraftPosts("", start, num);
    }
    findNDraftPosts(query = "", start = 0, num = 0) {
        return this.http.fetch('findNDraftPosts?query=' + query + "&start=" + start + "&num=" + num)
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

    getDraftPost(id) {
        return this.http.fetch('getDraftPost?id=' + id)
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

    savePost(post) {
        return this.http
            .fetch('savePost', {
                method: 'post',
                body: json({
                    'id': post._id,
                    'title': post.title,
                    'location': post.location,
                    'content': post.content,
                    'heroPhotoUrl': post.heroPhotoUrl,
                    'isDraft':post.isDraft,
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

    publishPost(post) {
        return this.http
            .fetch('publishPost', {
                method: 'post',
                body: json({
                    'id': post._id,
                    'title': post.title,
                    'location': post.location,
                    'content': post.content,
                    'heroPhotoUrl': post.heroPhotoUrl,
                    'isDraft':post.isDraft,
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

    unpublishPost(post) {
        return this.http
            .fetch('unpublishPost', {
                method: 'post',
                body: json({
                    'id': post._id,
                    'title': post.title,
                    'location': post.location,
                    'content': post.content,
                    'heroPhotoUrl': post.heroPhotoUrl,
                    'isDraft':post.isDraft,
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
    submitComment(postId, comment) {
        return this.http
            .fetch('submitComment', {
                method: 'post',
                body: json({
                    'postId': postId,
                    'name': comment.name,
                    'email': comment.email,
                    'content': comment.content,
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
    deleteComment(postId, comment) {
        return this.http
            .fetch('deleteComment', {
                method: 'delete',
                body: json({
                    'postId': postId,
                    'name': comment.name,
                    'email': comment.email,
                    'content': comment.content,
                    'date': comment.date,
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
    unsubscribe(email) {
        return this.http
            .fetch('unsubscribe', {
                method: 'delete',
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
}