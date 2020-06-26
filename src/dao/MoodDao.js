import {BaseGenericDao} from 'dao/BaseGenericDao';
export class MoodDao extends BaseGenericDao {
    constructor() {
        super("moods");
    }
    sortItems(items){
        [].sort
        return items.sort((a,b)=>a.rating-b.rating);
    }
}