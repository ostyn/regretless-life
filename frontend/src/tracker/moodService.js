export class MoodService {
    nextId = 1;
    moods = new Map();
    constructor(){
        let mood = {name: "1", emoji: ":`(", rating: "1", _id: this.nextId++};
        this.moods.set(mood._id, mood);
        mood = {name: "2", emoji: ":(", rating: "2", _id: this.nextId++};
        this.moods.set(mood._id, mood);
        mood = {name: "3", emoji: ":|", rating: "3", _id: this.nextId++};
        this.moods.set(mood._id, mood);
        mood = {name: "4", emoji: ":)", rating: "4", _id: this.nextId++};
        this.moods.set(mood._id, mood);
        mood = {name: "5", emoji: ":D", rating: "5", _id: this.nextId++};
        this.moods.set(mood._id, mood);
    }
    addMood(mood) {
        mood._id = this.nextId++;
        this.moods.set(mood._id, mood);
    }

    updateMood(mood) {
        this.moods.set(mood._id, mood);
    }

    getMoods() {
        return this.moods;
    }

    getMood(id) {
        return this.moods.get(id);
    }

    deleteMood(moodId) {
        this.moods.delete(moodId);
    }

}