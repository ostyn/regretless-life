export class EntryService {
    nextId = 1;
    entries = new Map();
    constructor(){
        let entry = {activities:undefined, date: undefined, id: 0, mood: undefined, note:'testing123', time: undefined};
        this.entries.set(entry.id, entry);
    }
    addEntry(entry) {
        entry.id = this.nextId++;
        this.entries.set(entry.id, entry);
    }

    updateEntry(entry) {
        this.entries.set(entry.id, entry);
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