import { inject } from "aurelia-framework";
import { EntryDao } from "../dao/EntryDao";
import { EventAggregator } from "aurelia-event-aggregator";

@inject(EntryDao, EventAggregator)
export class EntryService {
    constructor(entryDao, eventAggregator){
        this.entryDao = entryDao;
        this.ea = eventAggregator;
    }
    notifyListeners(){
        this.ea.publish('entriesUpdated');
    }
    addEntry(entry) {
        this.entryDao.saveItem(entry)
            .then((id)=>{
                this.notifyListeners();
            });
    }

    updateEntry(entry) {
        //this.entries.set(entry._id, entry);
    }

    getEntries() {
        return this.entryDao.getItems()
            .then((entries)=> {
                return entries;
            })
    }

    getEntry(id) {
        return this.entries.get(id);
    }

    deleteEntry(id) {
        return this.entryDao.deleteItem(id)
            .then(resp=>{
                this.notifyListeners();
                return resp;
            });
    }
}