import { inject } from "aurelia-framework";
import { TrackerDao } from "../dao/TrackerDao";
import { EventAggregator } from "aurelia-event-aggregator";

@inject(TrackerDao, EventAggregator)
export class EntryService {
    constructor(trackerDao, eventAggregator){
        this.trackerDao = trackerDao;
        this.ea = eventAggregator;
    }
    notifyListeners(){
        this.ea.publish('entriesUpdated');
    }
    addEntry(entry) {
        this.trackerDao.saveEntry(entry)
            .then((id)=>{
                this.notifyListeners();
            });
    }

    updateEntry(entry) {
        //this.entries.set(entry._id, entry);
    }

    getEntries() {
        return this.trackerDao.getEntries()
            .then((entries)=> {
                return entries;
            })
    }

    getEntry(id) {
        return this.entries.get(id);
    }

    deleteEntry(id) {
        return this.trackerDao.deleteEntry(id)
            .then(resp=>{
                this.notifyListeners();
                return resp;
            });
    }
}