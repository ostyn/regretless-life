import { inject } from 'aurelia-framework';
import { HttpClient, json } from 'aurelia-fetch-client';
import firebase from "firebase";
@inject(HttpClient)
export class BlogDao {
    constructor(http) {
        this.http = http;
        this.db = firebase.firestore();
    }
    getAllPosts() {
        return this.findAllPosts();
    }
    getNPosts(num, start) {
        return this.findNPosts("", num, start);
    }
    findAllPosts(query = "") {
        return this.findNPosts(query);
    }
    findNPosts(query, num, start) {
        var ref = this.db.collection("posts");
        let firequery = ref.where("isDraft", "==", false).orderBy("date", "desc").limit(num);
        if(start !== undefined)
            firequery = firequery.startAfter(start)
        return firequery.get().then((snapshot) => {
            let posts = [];
            snapshot.forEach(doc => {
                const post = {
                    ...doc.data(),
                    _id: doc.id
                };
                posts.push(post);
            });
            return posts;
        }
        );
    }

    getPost(id) {
        var ref = this.db.collection("posts");
        return ref.doc(id).get().then((doc) => {
            return {
                ...doc.data(),
                _id: doc.id
            };
        }
        );
    }
    // findNPosts(query = "", start = 0, num = 0) {
    //     return this.http.fetch('findNPosts?query=' + query + "&start=" + start + "&num=" + num)
    //         .then(response => {
    //             return response.json();
    //         })
    //         .then(data => {
    //             return data.resp;
    //         })
    //         .catch(ex => {
    //             console.log(ex);
    //         });
    // }
    getNDraftPosts(num, start) {
        return this.findNDraftPosts("", num, start);
    }
    findNDraftPosts(query = "", num = 0, start = 0) {
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
    getNTaggedPosts(tag, num, start) {
        return this.http.fetch('getNTaggedPosts?tag=' + tag + "&start=" + start + "&num=" + num)
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
                if (data.resp != null)
                    return data.resp;
                else
                    return;
            })
            .catch(ex => {
                console.log(ex);
            });
    }
    getAllPostsByLocation() {
        return this.http.fetch('getAllPostsByLocation')
            .then(response => {
                return response.json();
            })
            .then(data => {
                if (data.resp != null)
                    return data.resp.years;
                else
                    return;
            })
            .catch(ex => {
                console.log(ex);
            });
    }
    getAvailableTags() {
        return this.http.fetch('getAvailableTags')
            .then(response => {
                return response.json();
            })
            .then(data => {
                if (data.resp != null)
                    return data.resp;
                else
                    return;
            })
            .catch(ex => {
                console.log(ex);
            });
    }
    savePost(post) {
        let postData = {
            'id': post._id,
            'title': post.title,
            'author': post.author,
            'content': post.content,
            'heroPhotoUrl': post.heroPhotoUrl,
            'isDraft': post.isDraft,
            'images': post.images,
            'tags': Array.from(post.tags)
        };
        if (post.locationInfo && post.locationInfo.name && post.locationInfo.name !== "")
            postData['location'] = post.locationInfo.name;
        return this.http
            .fetch('savePost', {
                method: 'post',
                body: json(postData),
            })
            .then(response => {
                if (response.status > 400)
                    throw response;
                return response.json();
            })
            .then((submittedPost) => {
                return submittedPost.id
            });
    }

    publishPost(post) {
        let postData = {
            'id': post._id,
            'title': post.title,
            'author': post.author,
            'content': post.content,
            'heroPhotoUrl': post.heroPhotoUrl,
            'isDraft': post.isDraft,
            'images': post.images,
            'tags': Array.from(post.tags)
        };
        if (post.locationInfo && post.locationInfo.name && post.locationInfo.name !== "")
            postData['location'] = post.locationInfo.name;
        return this.http
            .fetch('publishPost', {
                method: 'post',
                body: json(postData),
            })
            .then(response => {
                if (response.status > 400)
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
                    'author': post.author,
                    'location': post.location,
                    'content': post.content,
                    'heroPhotoUrl': post.heroPhotoUrl,
                    'isDraft': post.isDraft,
                    'images': post.images,
                    'tags': Array.from(post.tags)
                }),
            })
            .then(response => {
                if (response.status > 400)
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
                if (response.status > 400)
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
                if (response.status > 400)
                    throw response;
                return response.json();
            })
            .then((post) => {
                return post.id
            });
    }
    submitAdminComment(postId, comment) {
        return this.http
            .fetch('submitAdminComment', {
                method: 'post',
                body: json({
                    'postId': postId,
                    'name': comment.name,
                    'email': comment.email,
                    'content': comment.content,
                }),
            })
            .then(response => {
                if (response.status > 400)
                    throw response;
                return response.json();
            })
            .then((post) => {
                return post.id
            });
    }
    deleteComment(postId, index) {
        return this.http
            .fetch('deleteComment', {
                method: 'delete',
                body: json({
                    'postId': postId,
                    'index': index
                }),
            })
            .then(response => {
                if (response.status > 400)
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
                if (response.status > 400)
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
                if (response.status > 400)
                    throw response;
                return response.json();
            });
    }
    getAuthkey(url) {
        return this.http
            .fetch('getAuthkey?url=' + encodeURIComponent(url), {
                'method': 'get'
            })
            .then(response => {
                if (response.status > 400)
                    throw response;
                return response.json();
            })
            .then((resp) => {
                return resp.authkey;
            });;
    }
    getOneDriveLink(url) {
        return this.http
            .fetch(url, {
                'method': 'get'
            })
            .then(response => {
                if (response.status > 400)
                    throw response;
                return response.json();
            });
    }
}