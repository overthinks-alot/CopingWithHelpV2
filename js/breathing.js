class BreathingExercise {
    constructor() {
        this.isRunning = false;
        this.currentPhase = 'inhale';
        this.timer = null;
        this.circle = document.querySelector('.breathing-circle');
        this.instruction = document.querySelector('.instruction');
        this.timerDisplay = document.querySelector('.timer');
        this.startButton = document.querySelector('.start-breathing');
        this.patternButtons = document.querySelectorAll('.pattern-button');
        this.patternName = document.querySelector('.pattern-name');
        this.patterns = {
            '4-4-4-2': {
                name: '4-4-4-2 Box Breathing',
                description: 'Inhale for 4, hold for 4, exhale for 4, hold for 2',
                phases: {
                    inhale: { duration: 4, next: 'hold', text: 'Breathe In' },
                    hold: { duration: 4, next: 'exhale', text: 'Hold' },
                    exhale: { duration: 4, next: 'hold2', text: 'Breathe Out' },
                    hold2: { duration: 2, next: 'inhale', text: 'Hold' }
                }
            },
            'relaxing': {
                name: 'Relaxing Breath',
                description: 'Inhale for 4, hold for 7, exhale for 8',
                phases: {
                    inhale: { duration: 4, next: 'hold', text: 'Breathe In' },
                    hold: { duration: 7, next: 'exhale', text: 'Hold' },
                    exhale: { duration: 8, next: 'inhale', text: 'Breathe Out' }
                }
            },
            'calming': {
                name: 'Calming Breath',
                description: 'Inhale for 6, hold for 2, exhale for 7',
                phases: {
                    inhale: { duration: 6, next: 'hold', text: 'Breathe In Slowly' },
                    hold: { duration: 2, next: 'exhale', text: 'Hold Briefly' },
                    exhale: { duration: 7, next: 'inhale', text: 'Release Slowly' }
                }
            }
        };
        this.currentPattern = '4-4-4-2';
        this.initializeEventListeners();
        this.updatePatternDisplay();
    }

    initializeEventListeners() {
        this.startButton.addEventListener('click', () => {
            if (this.isRunning) {
                this.stop();
            } else {
                this.start();
            }
        });

        this.patternButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.patternButtons.forEach(b => b.classList.remove('active'));
                button.classList.add('active');
                const pattern = button.dataset.pattern;
                this.setPattern(pattern);
            });
        });
    }

    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.startButton.textContent = 'Stop Exercise';
        this.startButton.classList.add('active');
        this.runCycle();
    }

    stop() {
        this.isRunning = false;
        clearTimeout(this.timer);
        this.startButton.textContent = 'Start Breathing Exercise';
        this.startButton.classList.remove('active');
        this.circle.classList.remove('inhale', 'hold', 'exhale');
        this.instruction.textContent = 'Ready?';
    }

    setPattern(patternKey) {
        if (this.isRunning) {
            this.stop();
        }
        this.currentPattern = patternKey;
        this.currentPhase = 'inhale';
        this.updatePatternDisplay();
    }

    updatePatternDisplay() {
        const pattern = this.patterns[this.currentPattern];
        this.patternName.textContent = pattern.name;
        const descriptionElement = document.querySelector('.pattern-description');
        if (descriptionElement) {
            descriptionElement.textContent = pattern.description;
        }
    }

    runCycle() {
        const pattern = this.patterns[this.currentPattern];
        const phases = pattern.phases;
        let timeLeft = phases[this.currentPhase].duration;
        
        const countdown = () => {
            if (!this.isRunning) return;
            
            this.circle.className = 'breathing-circle ' + this.currentPhase;
            this.instruction.textContent = phases[this.currentPhase].text;
            this.timerDisplay.textContent = timeLeft;

            if (timeLeft > 0) {
                timeLeft--;
                this.timer = setTimeout(countdown, 1000);
            } else {
                this.currentPhase = phases[this.currentPhase].next;
                this.runCycle();
            }
        };

        countdown();
    }
}

// Initialize breathing exercise when the document is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BreathingExercise();
}); 
