import { inject } from "aurelia-framework";
import { TrackerDao } from "../dao/TrackerDao";
@inject(TrackerDao)
export class EntryService {
    nextId = 1;
    entries = new Map();
    constructor(trackerDao){
        this.trackerDao = trackerDao;
        let entry = {activities:undefined, date: undefined, _id: 0, mood: undefined, note:'testing123', time: undefined};
        this.entries.set(entry._id, entry);
    }
    addEntry(entry) {
        this.trackerDao.saveEntry(entry)
            .then((id)=>{
                entry._id = id;
                this.entries.set(id, entry);
            })
    }

    updateEntry(entry) {
        this.entries.set(entry._id, entry);
    }

    getEntries() {
        return this.entries;
    }

    getEntry(id) {
        return this.entries.get(id);
    }

    deleteEntry(id) {
        this.entries.delete(id);
    }
}