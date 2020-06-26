import { BaseGenericDao } from 'dao/BaseGenericDao';
import firebase from "firebase";
export class EntryDao extends BaseGenericDao {
    path;
    constructor() {
        super("entries");
        this.db = firebase.firestore();
    }
    getEntriesFromYearAndMonth(year = undefined, month = undefined, day = undefined) {
        let query = this.db.collection("entries");
        if (year !== undefined && year !== "" && !Number.isNaN(year))
            query = query.where("year", "==", year);
        else
            query = query.orderBy("year", "desc");
        if (month !== undefined && month !== "" && !Number.isNaN(month))
            query = query.where("month", "==", month)
        else
            query = query.orderBy("month", "desc");
        if (day !== undefined && day !== "" && !Number.isNaN(day))
            query = query.where("day", "==", day)
        else
            query = query.orderBy("day", "desc");
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