class CWHBot {
    constructor() {
        this.responses = {
            greeting: [
                "Hi! I'm here to listen and support you. How are you feeling today?",
                "Welcome to your safe space. Would you like to talk about what's on your mind?",
                "Hello! I'm glad you're here. How can I support you today?"
            ],
            anxiety: [
                "I hear you. Anxiety can feel overwhelming. Would you like to try a breathing exercise together?",
                "It's brave of you to talk about your anxiety. Let's explore what might help you feel more grounded.",
                "When you're feeling anxious, remember that you're not alone. Would you like to talk about what triggers these feelings?"
            ],
            depression: [
                "I'm here with you. Depression can make everything feel heavy, but you don't have to carry it alone.",
                "Your feelings are valid. Would you like to explore some small steps we could take together?",
                "Even reaching out is a sign of strength. What kind of support would be most helpful right now?"
            ],
            loneliness: [
                "Feeling lonely can be really difficult. Would you like to talk about ways to connect with others?",
                "I understand feeling left out. Remember that your worth isn't determined by others' actions.",
                "It's okay to feel this way. Let's explore what meaningful connection means to you."
            ],
            selfHarm: [
                "I'm concerned about you and want to make sure you're safe. Would you like to talk to a crisis counselor? You can call 988 anytime.",
                "Your life has value. Please reach out to the Crisis Text Line by texting HOME to 741741.",
                "You deserve support and care. Can I connect you with immediate help?"
            ],
            encouragement: [
                "You're taking important steps by reaching out. That takes courage.",
                "Every small step matters. You're doing better than you think.",
                "I believe in your ability to get through this. You've overcome difficult times before."
            ]
        };
        this.currentTopic = null;
    }

    analyzeInput(input) {
        input = input.toLowerCase();
        if (input.includes('suicide') || input.includes('kill myself') || input.includes('end it all')) {
            return 'selfHarm';
        } else if (input.includes('anxious') || input.includes('panic') || input.includes('worry')) {
            return 'anxiety';
        } else if (input.includes('depress') || input.includes('sad') || input.includes('hopeless')) {
            return 'depression';
        } else if (input.includes('alone') || input.includes('lonely') || input.includes('left out')) {
            return 'loneliness';
        } else if (input.includes('hi') || input.includes('hello') || input.includes('hey')) {
            return 'greeting';
        }
        return 'encouragement';
    }

    getResponse(input) {
        const topic = this.analyzeInput(input);
        this.currentTopic = topic;
        return this.getRandomResponse(topic);
    }

    getRandomResponse(category) {
        const responses = this.responses[category];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    suggestResources() {
        if (this.currentTopic === 'anxiety') {
            return "Would you like to try our breathing exercise? It might help calm your anxiety.";
        } else if (this.currentTopic === 'depression') {
            return "Have you seen today's affirmation? Sometimes a positive reminder can help lift our spirits.";
        }
        return null;
    }
}

const bot = new CWHBot();
let chatOpen = false;

function openChat() {
    document.getElementById('chatbot-container').classList.remove('chatbot-hidden');
    chatOpen = true;
    addMessage("Hi! I'm here to listen and support you. How are you feeling today?", 'bot');
    showQuickOptions();
}

function closeChat() {
    document.getElementById('chatbot-container').classList.add('chatbot-hidden');
    chatOpen = false;
}

function showQuickOptions() {
    const quickOptions = [
        "I'm feeling anxious",
        "I'm feeling lonely",
        "I'm feeling depressed",
        "I need encouragement"
    ];
    
    const quickAccess = document.createElement('div');
    quickAccess.className = 'quick-access';
    
    quickOptions.forEach(option => {
        const button = document.createElement('button');
        button.className = 'quick-button';
        button.textContent = option;
        button.onclick = () => sendMessage(option);
        quickAccess.appendChild(button);
    });
    
    document.getElementById('chat-messages').appendChild(quickAccess);
}

function addMessage(message, sender) {
    const chatMessages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);
    
    // Add typing animation for bot messages
    if (sender === 'bot') {
        messageDiv.classList.add('typing');
        setTimeout(() => {
            messageDiv.classList.remove('typing');
            messageDiv.textContent = message;
        }, 1000);
    } else {
        messageDiv.textContent = message;
    }
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function sendMessage(text = null) {
    const input = document.getElementById('user-input');
    const message = text || input.value.trim();
    
    if (message) {
        addMessage(message, 'user');
        input.value = '';
        
        setTimeout(() => {
            const response = bot.getResponse(message);
            addMessage(response, 'bot');
            
            const resourceSuggestion = bot.suggestResources();
            if (resourceSuggestion) {
                setTimeout(() => {
                    addMessage(resourceSuggestion, 'bot');
                }, 1500);
            }
        }, 1000);
    }
}

// Allow Enter key to send messages
document.getElementById('user-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
}); 