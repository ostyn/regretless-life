const functions = require('firebase-functions');
const Firestore = require('@google-cloud/firestore');
const cors = require('cors')({ origin: true });
const PROJECTID = 'regretless-life-test';
const POSTS_COLLECTION = 'posts';
const MAIL_COLLECTION = 'mail';
const firestore = new Firestore({
    projectId: PROJECTID,
    timestampsInSnapshots: true,
});

exports.submitComment = functions.https.onCall(async (data, context) => {
    const { postId, comment } = (data) || {};
    const formedComment = {
        content: comment.content,
        name: comment.content,
        email: comment.email,
        date: new Date().getTime(),
    }
    await firestore.collection(POSTS_COLLECTION)
        .doc(postId)
        .update({
            comments: Firestore.FieldValue.arrayUnion(formedComment)
        })
    firestore.collection(MAIL_COLLECTION)
        .add({
            to: TEMP_ADMIN_EMAIL_LIST,
            message: {
                subject: "New Comment on regretless.life",
                html: `name: ${formedComment.name}<br><br>email: ${formedComment.email}<br><br>Post: <a href="https://regretless.life/#/post/${postId}">Post here</a><br><br><i>${formedComment.content}</i>`
            }
        })
    return { resp: postId };
});

exports.unsubscribeEmail = functions.https.onCall(async (data, context) => {
    const id = data.id;
    await firestore.collection("subscriptions")
        .doc(id)
        .delete();
    return { msg: "You have been unsubscribed" };
});

exports.subscribeEmail = functions.https.onCall(async (data, context) => {
    const email = data.email;
    var ref = firestore.collection("subscriptions");
    let snapshot = await ref.where("email", "==", email).get();
    if (snapshot.empty) {
        let date = new Date().getTime();
        let docRef = await ref.add({
            email: email,
            date: date
        });
        var mailRef = firestore.collection(MAIL_COLLECTION);
        mailRef.add({
            to: TEMP_ADMIN_EMAIL_LIST,
            message: {
                subject: "You've subscribed to regretless.life",
                html: `email: ${email}<br><br><a href="https://regretless.life/#/unsubscribe/${docRef.id}">Unsubscribe here</a>`
            }
        })
        return { msg: "You have been subscribed. We sent you a test email. Check your spam box, just in case" };
    } else {
        throw new functions.https.HttpsError('already-exists', 'You are already subscribed');
    }
});

exports.getPostsByYearAndLocation = functions.https.onCall(async (data, context) => {
    let snapshot = await firestore.collection(POSTS_COLLECTION)
        .where("isDraft", "==", false)
        .get()
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
    return { resp: years };
});

exports.onPostPublishedTrigger = functions.firestore.document('posts/{docId}')
    .onWrite(async (change, context) => {
        const before = change.before.data();
        const after = change.after.data();
        if ((before.isDraft === undefined || before.isDraft === true) && after.isDraft === false) {
            var ref = firestore.collection("subscriptions");
            let snapshot = await ref.get();
            let subs = [];
            snapshot.forEach(doc => {
                const sub = {
                    ...doc.data(),
                    id: doc.id
                };
                subs.push(sub);
            });
            console.log(`Preparing to send ${subs.length} new post notify emails`);
            var mailRef = firestore.collection(MAIL_COLLECTION);
            subs.forEach((sub) => {
                mailRef.add({
                    to: sub.email,
                    message: {
                        subject: "New post on regretless.life",
                        html: `<a href="https://regretless.life/#/post/${context.params.docId}">${after.title}</a> by ${after.author}` +
                            `<br><br><a href="https://regretless.life/#/unsubscribe/${sub.id}">Unsubscribe here</a>`
                    }
                });
            });
        }
    });