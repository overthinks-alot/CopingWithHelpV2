class BreathingExercise {
    constructor() {
        this.isRunning = false;
        this.currentPhase = 'inhale';
        this.timer = null;
        this.circle = document.querySelector('.breathing-circle');
        this.instruction = document.querySelector('.instruction');
        this.timerDisplay = document.querySelector('.timer');
        this.startButton = document.querySelector('.start-breathing');
        this.patterns = {
            '4-4-4-2': {
                name: '4-4-4-2 Box Breathing',
                phases: {
                    inhale: { duration: 4, next: 'hold', text: 'Breathe In' },
                    hold: { duration: 4, next: 'exhale', text: 'Hold' },
                    exhale: { duration: 4, next: 'hold2', text: 'Breathe Out' },
                    hold2: { duration: 2, next: 'inhale', text: 'Hold' }
                }
            },
            'relaxing': {
                name: 'Relaxing Breath',
                phases: {
                    inhale: { duration: 4, next: 'hold', text: 'Breathe In' },
                    hold: { duration: 7, next: 'exhale', text: 'Hold' },
                    exhale: { duration: 8, next: 'inhale', text: 'Breathe Out' }
                }
            },
            'calming': {
                name: 'Calming Breath',
                phases: {
                    inhale: { duration: 6, next: 'hold', text: 'Breathe In Slowly' },
                    hold: { duration: 2, next: 'exhale', text: 'Hold Briefly' },
                    exhale: { duration: 7, next: 'inhale', text: 'Release Slowly' }
                }
            }
        };
        this.currentPattern = '4-4-4-2';
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
        this.currentPattern = patternKey;
        this.stop();
        this.updatePatternDisplay();
    }

    updatePatternDisplay() {
        const pattern = this.patterns[this.currentPattern];
        document.querySelector('.pattern-name').textContent = pattern.name;
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

// Initialize breathing exercise
document.addEventListener('DOMContentLoaded', () => {
    const breathing = new BreathingExercise();
    document.querySelector('.start-breathing').addEventListener('click', () => {
        if (breathing.isRunning) {
            breathing.stop();
        } else {
            breathing.start();
        }
    });
}); 