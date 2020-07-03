import firebase from "firebase";
export class BaseGenericDao {
    constructor(name) {
        this.name = name;
        this.db = firebase.firestore();
    }
    getCollectionName(){
        return this.name;
    }
    getItems() {
        var ref = this.db.collection(this.name);
        return this.getItemsFromQuery(ref);
    }
    getItemsFromQuery(query) {
        return query.get().then((snapshot) => {
            let items = [];
            snapshot.forEach(doc => {
                const item = {
                    ...doc.data(),
                    id: doc.id
                };
                item.created = item.created.toDate();
                item.updated = item.updated.toDate();
                items.push(this.afterLoadFixup(item));
            });
            return this.sortItems(items);
        }
        );
    }
    saveItem(passedEntry) {
        let id = passedEntry.id;
        passedEntry = this.beforeSaveFixup(passedEntry);
        delete passedEntry.id;
        var ref = this.db.collection(this.name);
        const updatedEntry = {
            ...passedEntry,
            updated: firebase.firestore.FieldValue.serverTimestamp(),
            created: passedEntry.created || firebase.firestore.FieldValue.serverTimestamp()
        };
        if (id)
            return ref.doc(id).set(updatedEntry)
                .then(() => {
                    return id;
                });
        else
            return ref.add(updatedEntry)
                .then((docRef) => {
                    return docRef.id;
                });
    }
    deleteItem(id) {
        var ref = this.db.collection(this.name);
        return ref.doc(id).delete().then(() => {
            return true;
        }).catch((err) => {
            console.log(err);
        });
    }
    beforeSaveFixup(item){
        return item;
    }
    afterLoadFixup(item){
        return item;
    }
    sortItems(items){
        return items;
    }
    strMapToObj(strMap) {
        let obj = Object.create(null);
        for (let [k, v] of strMap) {
            obj[k] = v;
        }
        return obj;
    }
    ObjToStrMap(obj) {
        let map = new Map();
        for (let k in obj) {
            map.set(k, obj[k]);
        }
        return map;
    }
}