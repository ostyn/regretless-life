import { inject } from "aurelia-framework";
import { MoodDao } from "../dao/MoodDao";
import { EventAggregator } from "aurelia-event-aggregator";

@inject(MoodDao, EventAggregator)
export class MoodService {
    moodsCache = [];
    constructor(moodDao, eventAggregator) {
        this.moodDao = moodDao;
        this.ea = eventAggregator;
        this.updateCacheThenNotify();
    }
    notifyListeners(){
        this.ea.publish('moodsUpdated');
    }

    updateCacheThenNotify() {
        this.fetchMoods()
            .then((moods) => {
                this.moodsCache = moods;
                this.notifyListeners();
            });
    }

    saveMood(mood) {
        return this.moodDao.saveItem(mood)
            .then((id)=>{
                this.updateCacheThenNotify();
            });
    }

    fetchMoods() {
        return this.moodDao.getItems()
            .then(moods => moods);
    }

    getMoods() {
        return this.moodsCache;
    }

    deleteMood(id) {
        return this.moodDao.deleteItem(id)
            .then(resp=>{
                this.updateCacheThenNotify();
                return resp;
            });
    }
}