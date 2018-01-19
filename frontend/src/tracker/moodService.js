export class MoodService {
    nextId = 1;
    moods = new Map();
    constructor(){
        let mood = {name: "1", emoji: ":`(", rating: "1", id: this.nextId++};
        this.moods.set(mood.id, mood);
        mood = {name: "2", emoji: ":(", rating: "2", id: this.nextId++};
        this.moods.set(mood.id, mood);
        mood = {name: "3", emoji: ":|", rating: "3", id: this.nextId++};
        this.moods.set(mood.id, mood);
        mood = {name: "4", emoji: ":)", rating: "4", id: this.nextId++};
        this.moods.set(mood.id, mood);
        mood = {name: "5", emoji: ":D", rating: "5", id: this.nextId++};
        this.moods.set(mood.id, mood);
    }
    addMood(mood) {
        mood.id = this.nextId++;
        this.moods.set(mood.id, mood);
    }

    updateMood(mood) {
        this.moods.set(mood.id, mood);
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