class AffirmationGenerator {
    constructor() {
        this.affirmations = [
            "I am worthy of love and respect",
            "My feelings are valid",
            "I choose to be confident",
            "I am stronger than I think"
        ];
    }
    
    getRandomAffirmation() {
        return this.affirmations[
            Math.floor(Math.random() * this.affirmations.length)
        ];
    }
} 