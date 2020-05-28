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
            const { postId, comment } = (req.body.data) || {};
            const formedComment = {
                content: comment.content,
                name: comment.content,
                email: comment.email,
                date: new Date().getTime(),
            }
            var ref = firestore.collection(COLLECTION_NAME).doc(postId);
            return ref.update({
                comments: Firestore.FieldValue.arrayUnion(formedComment)
            })
                .then(() => {
                    var mailRef = firestore.collection(MAIL_COLLECTION_NAME);
                    mailRef.add({
                        to: TEMP_ADMIN_EMAIL_LIST,
                        message: {
                            subject: "New Comment on regretless.life",
                            html: `name: ${formedComment.name}<br><br>email: ${formedComment.email}<br><br>Post: <a href="https://regretless.life/#/post/${postId}">Post here</a><br><br><i>${formedComment.content}</i>`
                        }
                    })
                    return res.status(200).send({ resp: postId });
                }).catch(err => {
                    console.error(err);
                    return res.status(500).send({ error: 'unable to comment', err });
                });
        }
    })
});
exports.unsubscribeEmail = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        if (req.method === 'POST') {
            const { id } = (req.body.data) || {};
            var ref = firestore.collection("subscriptions").doc(id);
            return ref.delete()
                .then(() => {
                    return res.status(200).send({ data: { msg: "You have been unsubscribed" } });
                }).catch(err => {
                    console.error(err);
                    return res.status(500).send({ data: { error: 'unable to unsubscribe', err } });
                });
        }
    })
});
exports.subscribeEmail = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        if (req.method === 'POST') {
            const { email } = (req.body.data) || {};
            var ref = firestore.collection("subscriptions");
            let date = new Date().getTime();
            return ref.add({
                email: email,
                date: date
            }).then((docRef) => {
                var mailRef = firestore.collection(MAIL_COLLECTION_NAME);
                mailRef.add({
                    to: TEMP_ADMIN_EMAIL_LIST,
                    message: {
                        subject: "You've subscribed to regretless.life",
                        html: `email: ${email}<br><br><a href="https://regretless.life/#/unsubscribe/${docRef.id}">Unsubscribe here</a>`
                    }
                })
                return res.status(200).send({ data: { msg: "You have been subscribed. We sent you a test email. Check your spam box, just in case" } });
            }).catch(err => {
                console.error(err);
                return res.status(500).send({ data: { error: 'unable to subscribe', err } });
            });
        }
    })
});
exports.getPostsByYearAndLocation = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        return firestore.collection(COLLECTION_NAME)
            .where("isDraft", "==", false)
            .get()
            .then(snapshot => {
                let years = {};
                snapshot.forEach(doc => {
                    const fullPost = doc.data();
                    if (fullPost.locationInfo === undefined)
                        fullPost.locationInfo = {};
                    const post = {
                        year: new Date(fullPost.date).getFullYear(),
                        date: fullPost.date,
                        title: fullPost.title,
                        id: doc.id
                    };
                    if (years[post.year] === undefined)
                        years[post.year] = {};
                    if (years[post.year][fullPost.locationInfo.countryCode] === undefined) {
                        years[post.year][fullPost.locationInfo.countryCode] = {};
                        years[post.year][fullPost.locationInfo.countryCode].countryCode = fullPost.locationInfo.countryCode;
                        years[post.year][fullPost.locationInfo.countryCode].country = fullPost.locationInfo.country || "Miscellaneous";
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
exports.onPostPublishedTrigger = functions.firestore
    .document('posts/{docId}')
    .onWrite((change, context) => {
        const before = change.before.data();
        const after = change.after.data();
        if ((before.isDraft === undefined || before.isDraft === true) && after.isDraft === false)
            console.log("EWOK! Something was just published!");
        else
            console.log("no-op");
        return;
    });