const functions = require('firebase-functions');
const Firestore = require('@google-cloud/firestore');
const PROJECTID = 'regretless-life-test';
const COLLECTION_NAME = 'posts';
const firestore = new Firestore({
  projectId: PROJECTID,
  timestampsInSnapshots: true,
});
exports.getPostsByYearAndLocation = functions.https.onRequest((req, res) => {
    return firestore.collection(COLLECTION_NAME)
    .get()
    .then(snapshot => {
        let years = {};
        snapshot.forEach(doc => {
            const post = {
                ...doc.data(),
                _id: doc.id
            };
            if(post.locationInfo === undefined)
                return;
            post["year"] = new Date(post.date).getFullYear();
            if(years[post.year] === undefined)
                years[post.year] = {};
            if(years[post.year][post.locationInfo.countryCode] === undefined)
            {
                years[post.year][post.locationInfo.countryCode] = {};
                years[post.year][post.locationInfo.countryCode].countryCode = post.locationInfo.countryCode;
                years[post.year][post.locationInfo.countryCode].country = post.locationInfo.country;
            }
            if(years[post.year][post.locationInfo.countryCode].posts === undefined)
                years[post.year][post.locationInfo.countryCode].posts = [];
            years[post.year][post.locationInfo.countryCode].posts.push(post);
        });
      return res.status(200).send(years);
    }).catch(err => {
      console.error(err);
      return res.status(404).send({ error: 'Unable to retrieve the document' });
    });
});
