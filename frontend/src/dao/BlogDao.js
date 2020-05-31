import { inject } from 'aurelia-framework';
import { HttpClient, json } from 'aurelia-fetch-client';
import firebase from "firebase";
@inject(HttpClient)
export class BlogDao {
    constructor(http) {
        this.http = http;
        this.db = firebase.firestore();
    }
    getNPosts(isDraft, num, start) {
        var ref = this.db.collection("posts");
        let firequery = ref.where("isDraft", "==", isDraft).orderBy("date", "desc").limit(num);
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
            let years = result.data.resp;
            let yearMap = new Map();
            for (let year of Object.keys(years)) {
                if (!yearMap.has(year))
                    yearMap.set(year, new Map());
                for (let countryCode of Object.keys(years[year]))
                    yearMap.get(year).set(countryCode, years[year][countryCode]);
            }
            return yearMap;
        });

    }
    submitComment(postId, comment) {
        var submitComment = firebase.functions().httpsCallable('submitComment');
        return submitComment({ postId: postId, comment: comment }).then(() => {
            return postId
        }).catch((err) => {
            console.log(err);
        });
    }
    subscribe(email) {
        var subscribeEmail = firebase.functions().httpsCallable('subscribeEmail');
        return subscribeEmail({ email: email }).then((resp) => {
            return resp.data;
        }).catch((err) => {
            return { error: err.message };
        });
    }
    unsubscribe(id) {
        var unsubscribeEmail = firebase.functions().httpsCallable('unsubscribeEmail');
        return unsubscribeEmail({ id: id }).then((resp) => {
            return resp.data;
        }).catch((err) => {
            return { error: err.message };
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
        // if (post.locationInfo && post.locationInfo.name && post.locationInfo.name !== "")
        //     postData['location'] = post.locationInfo.name;
        var savePost = firebase.functions().httpsCallable('savePost');
        return savePost({ post: postData }).then((resp) => {
            return resp.data.id;
        }).catch((err) => {
            return { error: err.message };
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
    deleteComment(postId, comment) {
        this.removeUndefinedFields(comment);
        var deleteComment = firebase.functions().httpsCallable('deleteComment');
        return deleteComment({ postId: postId, comment: comment }).then(() => {
            return postId;
        }).catch((err) => {
            console.log(err);
        });
    }
    //Array removals must remove the exact same item. Observables with aurelia were introducing new, undefined fields
    //But since Firestore can't store undefined values anyway, we can by bypass the problem by removing those fields.
    removeUndefinedFields(comment) {
        for (let [key, value] of Object.entries(comment))
            if (value === undefined)
                delete comment[key];
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