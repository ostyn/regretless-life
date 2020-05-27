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
        if (start !== undefined)
            firequery = firequery.startAfter(start);
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
    getNTaggedPosts(tag, num, start) {
        var ref = this.db.collection("posts");
        let firequery = ref.where("isDraft", "==", false).where('tags', 'array-contains', tag).orderBy("date", "desc").limit(num);
        if (start !== undefined)
            firequery = firequery.startAfter(start);
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
    getNextPost(date) {
        var ref = this.db.collection("posts");
        return ref.where("isDraft", "==", false).orderBy("date", "desc").startAfter(date).limit(1).get().then((snapshot) => {
            let nextDoc;
            snapshot.forEach(doc => {
                nextDoc = {
                    ...doc.data(),
                    _id: doc.id
                };
            });
            return nextDoc;
        });
    }
    getPrevPost(date) {
        var ref = this.db.collection("posts");
        return ref.where("isDraft", "==", false).orderBy("date", "desc").endBefore(date).limitToLast(1).get().then((snapshot) => {
            let prevDoc;
            snapshot.forEach(doc => {
                prevDoc = {
                    ...doc.data(),
                    _id: doc.id
                };
            });
            return prevDoc;
        });
    }
    getAllPostsByLocation() {
        var getPostsByYearAndLocation = firebase.functions().httpsCallable('getPostsByYearAndLocation');
        return getPostsByYearAndLocation({}).then((result) => {
            let respData = result.data;
            let yearMap = new Map();
            for (let year of Object.keys(respData)) {
                if (!yearMap.has(year))
                    yearMap.set(year, new Map());
                for (let countryCode of Object.keys(respData[year]))
                    yearMap.get(year).set(countryCode, respData[year][countryCode]);
            }
            return yearMap;
        });

    }
    submitComment(postId, comment) {
        var submitComment = firebase.functions().httpsCallable('submitComment');
        return submitComment({postId:postId, comment: comment}).then(()=>{
            return postId
        }).catch((err)=>{
            console.log(err);
        });
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