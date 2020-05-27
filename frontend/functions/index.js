const functions = require('firebase-functions');
const Firestore = require('@google-cloud/firestore');
const cors = require('cors')({ origin: true });
const PROJECTID = 'regretless-life-test';
const COLLECTION_NAME = 'posts';
const MAIL_COLLECTION_NAME = 'mail';
const firestore = new Firestore({
    projectId: PROJECTID,
    timestampsInSnapshots: true,
});

exports.submitComment = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        if (req.method === 'POST') {
            // store/insert a new document
            const {postId, comment} = (req.body.data) || {};
            var ref = firestore.collection(COLLECTION_NAME).doc(postId);
            return ref.update({
                comments: Firestore.FieldValue.arrayUnion(comment)
            })
                .then(() => {
                    var mailRef = firestore.collection(MAIL_COLLECTION_NAME);
                    mailRef.add({
                        to:"ostyn@live.com,erikaostyn@gmail.com",
                        message:{
                            subject:"New Comment on regretless.life",
                            html: `name: ${comment.name}<br><br>email: ${comment.email}<br><br>Post: <a href="https://regretless.life/#/post/${postId}">Post here</a><br><br><i>${comment.content}</i>`
                        }
                    })
                    return res.status(200).send({resp:postId});
                }).catch(err => {
                    console.error(err);
                    return res.status(500).send({ error: 'unable to comment', err });
                });
        }
    })
});
exports.getPostsByYearAndLocation = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        return firestore.collection(COLLECTION_NAME)
            .get()
            .then(snapshot => {
                let years = {};
                snapshot.forEach(doc => {
                    const fullPost = doc.data();
                    if (fullPost.locationInfo === undefined)
                        return;
                    const post = {
                        year: new Date(fullPost.date).getFullYear(),
                        date: fullPost.date,
                        title: fullPost.title,
                        location: fullPost.locationInfo.name,
                        id: doc.id
                    };
                    if (years[post.year] === undefined)
                        years[post.year] = {};
                    if (years[post.year][fullPost.locationInfo.countryCode] === undefined) {
                        years[post.year][fullPost.locationInfo.countryCode] = {};
                        years[post.year][fullPost.locationInfo.countryCode].countryCode = fullPost.locationInfo.countryCode;
                        years[post.year][fullPost.locationInfo.countryCode].country = fullPost.locationInfo.country;
                    }
                    if (years[post.year][fullPost.locationInfo.countryCode].posts === undefined)
                        years[post.year][fullPost.locationInfo.countryCode].posts = [];
                    years[post.year][fullPost.locationInfo.countryCode].posts.push(post);
                });
                return res.status(200).send({ data: years });
            }).catch(err => {
                console.error(err);
                return res.status(404).send({ error: 'Unable to retrieve the document' });
            });
    })
});
