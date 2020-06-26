import {BaseGenericDao} from 'dao/BaseGenericDao';
import firebase from "firebase";
export class EntryDao extends BaseGenericDao {
    path;
    constructor() {
        super("entries");
        this.db = firebase.firestore();
    }
    getEntriesFromYearAndMonth(year, month = undefined, day = undefined) {
         let query = this.db.collection("entries").where("year", "==", year);
        if(month !== undefined)
            query = query.where("month", "==", month)
        if(day !== undefined)
            query = query.where("day", "==", day)
        query = query.orderBy("created", "desc");
        return this.getItemsFromQuery(query);
    }
    beforeSaveFixup(item){
        var clone = Object.assign({}, item);
        clone.activities = this.strMapToObj(item.activities);
        return clone;
    }
    afterLoadFixup(item){
        item.activities = this.ObjToStrMap(item.activities);
        return item;
    }
}