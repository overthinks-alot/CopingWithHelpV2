// Add this new file for quote functionality
const quotes = [
    "You are stronger than you know. Your story isn't over yet.",
    "Recovery is not linear. Be patient with yourself.",
    "It's okay not to be okay. It's not okay to stay that way.",
    "Your presence in this world makes a difference.",
    "Small steps are still steps forward.",
    "You've survived 100% of your worst days so far.",
    "Hope is the only thing stronger than fear.",
    "Your mental health matters. You matter.",
    "Every storm runs out of rain.",
    "You are worthy of love and support."
];

function newQuote() {
    const quote = quotes[Math.floor(Math.random() * quotes.length)];
    document.querySelector('.daily-quote blockquote').textContent = quote;
    
    // Add fade animation
    const blockquote = document.querySelector('.daily-quote blockquote');
    blockquote.style.opacity = 0;
    setTimeout(() => {
        blockquote.textContent = quote;
        blockquote.style.opacity = 1;
    }, 300);
}

// Initialize with a random quote when page loads
window.addEventListener('load', newQuote); 