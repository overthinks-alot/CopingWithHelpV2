class Journal {
    constructor() {
        this.entries = [];
    }
    
    addEntry(content, mood) {
        const entry = {
            date: new Date(),
            content: content,
            mood: mood
        };
        this.entries.push(entry);
        this.saveToLocalStorage();
    }
} 