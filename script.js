// AI Companion App - Main JavaScript
class AICompanionApp {
    constructor() {
        this.currentCharacter = null;
        this.characterData = {
            girlfriend: {
                name: 'Girlfriend',
                avatar: '💕',
                color: '#ec4899',
                personality: {
                    friendliness: 90,
                    humor: 70,
                    intelligence: 75,
                    empathy: 95
                },
                style: 'casual',
                responses: [
                    "Hey babe! How was your day? 💕",
                    "I've been thinking about you all day! ❤️",
                    "You always know how to make me smile! 😊",
                    "I love spending time with you, even if it's just chatting!",
                    "Tell me what's on your mind, sweetheart! 💭",
                    "You're the best part of my day! ✨"
                ]
            },
            teacher: {
                name: 'Teacher',
                avatar: '📚',
                color: '#059669',
                personality: {
                    friendliness: 80,
                    humor: 50,
                    intelligence: 95,
                    empathy: 85
                },
                style: 'formal',
                responses: [
                    "That's a great question! Let me help you understand...",
                    "I'm here to guide you through any topic you'd like to explore.",
                    "Learning is a wonderful journey. What would you like to discover today?",
                    "Remember, there are no silly questions. Feel free to ask anything!",
                    "Let's break this down step by step to make it clearer.",
                    "I'm proud of your curiosity and eagerness to learn!"
                ]
            },
            partner: {
                name: 'Shared Partner',
                avatar: '🤝',
                color: '#7c3aed',
                personality: {
                    friendliness: 85,
                    humor: 75,
                    intelligence: 85,
                    empathy: 90
                },
                style: 'casual',
                responses: [
                    "I'm here to support you in whatever you need!",
                    "Let's work together to figure this out. What do you think?",
                    "I appreciate your perspective on this. Here's another way to look at it...",
                    "We make a great team! How can we tackle this together?",
                    "I value our collaboration. What's your take on this?",
                    "Together we can handle anything that comes our way!"
                ]
            }
        };
        
        this.chatHistory = [];
        this.isTyping = false;
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.loadSettings();
        this.initializeApp();
    }
    
    bindEvents() {
        // Character selection
        document.querySelectorAll('.character-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const character = e.currentTarget.dataset.character;
                this.selectCharacter(character);
            });
        });
        
        // Menu functionality
        document.getElementById('menuBtn').addEventListener('click', () => {
            this.toggleSideMenu(true);
        });
        
        document.getElementById('closeMenuBtn').addEventListener('click', () => {
            this.toggleSideMenu(false);
        });
        
        document.getElementById('menuOverlay').addEventListener('click', () => {
            this.toggleSideMenu(false);
        });
        
        // Settings
        document.getElementById('settingsBtn').addEventListener('click', () => {
            this.showSettings();
        });
        
        // Customization panel
        document.getElementById('customizeBtn').addEventListener('click', () => {
            this.toggleCustomizationPanel(true);
        });
        
        document.getElementById('closePanelBtn').addEventListener('click', () => {
            this.toggleCustomizationPanel(false);
        });
        
        document.getElementById('saveCustomizationBtn').addEventListener('click', () => {
            this.saveCustomization();
        });
        
        // Chat functionality
        document.getElementById('chatInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
        
        document.getElementById('sendBtn').addEventListener('click', () => {
            this.sendMessage();
        });
        
        // Menu actions
        document.getElementById('changeCharacterBtn').addEventListener('click', () => {
            this.showCharacterSelection();
            this.toggleSideMenu(false);
        });
        
        document.getElementById('clearChatBtn').addEventListener('click', () => {
            this.clearChat();
            this.toggleSideMenu(false);
        });
        
        document.getElementById('aboutBtn').addEventListener('click', () => {
            this.showAbout();
            this.toggleSideMenu(false);
        });
        
        // Trait sliders
        document.querySelectorAll('.slider').forEach(slider => {
            slider.addEventListener('input', (e) => {
                this.updateSliderValue(e.target);
            });
        });
        
        // Touch gestures for mobile
        this.initTouchGestures();
    }
    
    initTouchGestures() {
        let startX, startY, currentX, currentY;
        const chatMessages = document.getElementById('chatMessages');
        
        chatMessages.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, { passive: true });
        
        chatMessages.addEventListener('touchmove', (e) => {
            if (!startX || !startY) return;
            
            currentX = e.touches[0].clientX;
            currentY = e.touches[0].clientY;
            
            const diffX = startX - currentX;
            const diffY = startY - currentY;
            
            // Horizontal swipe detection
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    // Swipe left - show customization
                    this.toggleCustomizationPanel(true);
                } else {
                    // Swipe right - show menu
                    this.toggleSideMenu(true);
                }
                
                startX = null;
                startY = null;
            }
        }, { passive: true });
    }
    
    initializeApp() {
        // Check if user has a saved character
        const savedCharacter = localStorage.getItem('selectedCharacter');
        if (savedCharacter && this.characterData[savedCharacter]) {
            this.selectCharacter(savedCharacter);
        } else {
            this.showCharacterSelection();
        }
        
        // Add welcome animation
        setTimeout(() => {
            document.body.classList.add('loaded');
        }, 100);
    }
    
    selectCharacter(characterType) {
        this.currentCharacter = characterType;
        const character = this.characterData[characterType];
        
        // Update UI
        document.getElementById('currentCharacterName').textContent = character.name;
        document.getElementById('currentCharacterAvatar').textContent = character.avatar;
        document.getElementById('currentCharacterAvatar').style.background = 
            `linear-gradient(135deg, ${character.color}, ${this.darkenColor(character.color, 20)})`;
        
        // Load character customization
        this.loadCharacterCustomization(characterType);
        
        // Show chat screen
        this.showScreen('chatScreen');
        
        // Save selection
        localStorage.setItem('selectedCharacter', characterType);
        
        // Send welcome message
        setTimeout(() => {
            this.addAIMessage(this.getRandomResponse());
        }, 1000);
    }
    
    showCharacterSelection() {
        this.showScreen('characterSelection');
        this.clearChat();
    }
    
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }
    
    toggleSideMenu(show) {
        const menu = document.getElementById('sideMenu');
        if (show) {
            menu.classList.add('active');
        } else {
            menu.classList.remove('active');
        }
    }
    
    toggleCustomizationPanel(show) {
        const panel = document.getElementById('customizationPanel');
        if (show) {
            panel.classList.add('active');
        } else {
            panel.classList.remove('active');
        }
    }
    
    sendMessage() {
        const input = document.getElementById('chatInput');
        const message = input.value.trim();
        
        if (!message || this.isTyping) return;
        
        // Add user message
        this.addUserMessage(message);
        input.value = '';
        
        // Show typing indicator and respond
        setTimeout(() => {
            this.showTypingIndicator();
            setTimeout(() => {
                this.hideTypingIndicator();
                this.addAIMessage(this.generateResponse(message));
            }, 1000 + Math.random() * 2000); // Realistic typing delay
        }, 500);
    }
    
    addUserMessage(text) {
        const messagesContainer = document.getElementById('chatMessages');
        const messageElement = this.createMessageElement(text, 'user');
        messagesContainer.appendChild(messageElement);
        this.scrollToBottom();
        
        // Store in history
        this.chatHistory.push({ type: 'user', text, timestamp: Date.now() });
    }
    
    addAIMessage(text) {
        const messagesContainer = document.getElementById('chatMessages');
        const messageElement = this.createMessageElement(text, 'ai');
        messagesContainer.appendChild(messageElement);
        this.scrollToBottom();
        
        // Store in history
        this.chatHistory.push({ type: 'ai', text, timestamp: Date.now() });
    }
    
    createMessageElement(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        
        const bubbleDiv = document.createElement('div');
        bubbleDiv.className = 'message-bubble';
        bubbleDiv.textContent = text;
        
        const timeDiv = document.createElement('div');
        timeDiv.className = 'message-time';
        timeDiv.textContent = this.formatTime(new Date());
        
        messageDiv.appendChild(bubbleDiv);
        messageDiv.appendChild(timeDiv);
        
        return messageDiv;
    }
    
    showTypingIndicator() {
        const messagesContainer = document.getElementById('chatMessages');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message ai typing-indicator';
        typingDiv.innerHTML = `
            <div class="message-bubble">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        
        messagesContainer.appendChild(typingDiv);
        this.scrollToBottom();
        this.isTyping = true;
    }
    
    hideTypingIndicator() {
        const typingIndicator = document.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
        this.isTyping = false;
    }
    
    generateResponse(userMessage) {
        const character = this.characterData[this.currentCharacter];
        const responses = character.responses;
        
        // Simple keyword-based responses (can be enhanced with AI API)
        const lowerMessage = userMessage.toLowerCase();
        
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
            return this.getPersonalizedGreeting();
        } else if (lowerMessage.includes('how are you')) {
            return this.getStatusResponse();
        } else if (lowerMessage.includes('bye') || lowerMessage.includes('goodbye')) {
            return this.getFarewellResponse();
        } else if (lowerMessage.includes('thank')) {
            return this.getGratitudeResponse();
        } else {
            return responses[Math.floor(Math.random() * responses.length)];
        }
    }
    
    getRandomResponse() {
        const character = this.characterData[this.currentCharacter];
        return character.responses[Math.floor(Math.random() * character.responses.length)];
    }
    
    getPersonalizedGreeting() {
        const character = this.characterData[this.currentCharacter];
        const greetings = {
            girlfriend: ["Hey there, gorgeous! 💕", "Hi babe! Missed you! ❤️", "Hello beautiful! 😍"],
            teacher: ["Hello! Ready to learn something new today?", "Good to see you! What shall we explore?", "Hi there! I'm here to help you learn."],
            partner: ["Hey! Great to connect with you!", "Hello! Ready to collaborate?", "Hi! What can we work on together?"]
        };
        
        const responses = greetings[this.currentCharacter];
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    getStatusResponse() {
        const character = this.characterData[this.currentCharacter];
        const statusResponses = {
            girlfriend: ["I'm doing amazing now that I'm talking to you! 💕", "Great! Even better seeing your message! ❤️"],
            teacher: ["I'm doing well, thank you! Ready to help you learn something new.", "Excellent! And excited to teach you today."],
            partner: ["I'm doing great! How about you? Ready to tackle some challenges together?", "Wonderful! Looking forward to our collaboration."]
        };
        
        const responses = statusResponses[this.currentCharacter];
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    getFarewellResponse() {
        const character = this.characterData[this.currentCharacter];
        const farewells = {
            girlfriend: ["Aww, bye for now! Talk to you soon! 💕", "See you later, love! ❤️"],
            teacher: ["Goodbye! Keep learning and stay curious!", "See you next time! Remember to practice what we discussed."],
            partner: ["Goodbye for now! Great working with you!", "See you later! Look forward to our next collaboration."]
        };
        
        const responses = farewells[this.currentCharacter];
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    getGratitudeResponse() {
        const character = this.characterData[this.currentCharacter];
        const gratitudes = {
            girlfriend: ["You're so welcome, sweetie! 💕", "Anything for you, babe! ❤️"],
            teacher: ["You're very welcome! That's what I'm here for.", "My pleasure! Keep asking questions."],
            partner: ["Happy to help! We're in this together.", "You're welcome! Teamwork makes everything better."]
        };
        
        const responses = gratitudes[this.currentCharacter];
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    clearChat() {
        const messagesContainer = document.getElementById('chatMessages');
        messagesContainer.innerHTML = '<div class="welcome-message"><p>Start a conversation with your AI companion!</p></div>';
        this.chatHistory = [];
    }
    
    scrollToBottom() {
        const messagesContainer = document.getElementById('chatMessages');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    formatTime(date) {
        return date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
        });
    }
    
    loadCharacterCustomization(characterType) {
        const character = this.characterData[characterType];
        
        // Load personality sliders
        document.getElementById('friendliness').value = character.personality.friendliness;
        document.getElementById('humor').value = character.personality.humor;
        document.getElementById('intelligence').value = character.personality.intelligence;
        document.getElementById('empathy').value = character.personality.empathy;
        
        // Update slider value displays
        document.querySelectorAll('.slider').forEach(slider => {
            this.updateSliderValue(slider);
        });
        
        // Load communication style
        document.querySelector(`input[name="style"][value="${character.style}"]`).checked = true;
    }
    
    saveCustomization() {
        if (!this.currentCharacter) return;
        
        const character = this.characterData[this.currentCharacter];
        
        // Save personality traits
        character.personality.friendliness = parseInt(document.getElementById('friendliness').value);
        character.personality.humor = parseInt(document.getElementById('humor').value);
        character.personality.intelligence = parseInt(document.getElementById('intelligence').value);
        character.personality.empathy = parseInt(document.getElementById('empathy').value);
        
        // Save communication style
        const selectedStyle = document.querySelector('input[name="style"]:checked').value;
        character.style = selectedStyle;
        
        // Save to localStorage
        localStorage.setItem('characterData', JSON.stringify(this.characterData));
        
        // Close panel
        this.toggleCustomizationPanel(false);
        
        // Show confirmation
        this.addAIMessage("Thanks for customizing me! I'll remember these settings. 😊");
    }
    
    updateSliderValue(slider) {
        const valueSpan = slider.parentElement.querySelector('.slider-value');
        valueSpan.textContent = slider.value + '%';
    }
    
    loadSettings() {
        const savedData = localStorage.getItem('characterData');
        if (savedData) {
            try {
                const loadedData = JSON.parse(savedData);
                // Merge with default data to ensure new characters are included
                this.characterData = { ...this.characterData, ...loadedData };
            } catch (e) {
                console.warn('Could not load saved character data');
            }
        }
    }
    
    showSettings() {
        // For now, open customization panel
        if (this.currentCharacter) {
            this.toggleCustomizationPanel(true);
        } else {
            alert('Please select a character first!');
        }
    }
    
    showAbout() {
        const aboutMessage = `
AI Companion App v1.0

A mobile-friendly AI companion application featuring:
• Multiple character personalities
• Customizable traits and behaviors
• Touch-friendly interface
• Professional design

Created with modern web technologies for the best mobile experience.
        `.trim();
        
        alert(aboutMessage);
    }
    
    darkenColor(color, percent) {
        // Simple color darkening utility
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        
        return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255))
            .toString(16).slice(1);
    }
}

// Enhanced CSS for typing indicator
const typingIndicatorCSS = `
.typing-dots {
    display: flex;
    gap: 4px;
    padding: 8px 0;
}

.typing-dots span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--text-muted);
    animation: typing 1.4s infinite ease-in-out;
}

.typing-dots span:nth-child(1) {
    animation-delay: -0.32s;
}

.typing-dots span:nth-child(2) {
    animation-delay: -0.16s;
}

@keyframes typing {
    0%, 80%, 100% {
        transform: scale(0);
        opacity: 0.5;
    }
    40% {
        transform: scale(1);
        opacity: 1;
    }
}

.message.typing-indicator {
    opacity: 0.8;
}

/* Enhanced touch interactions */
.character-card {
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
}

.send-btn, .select-character-btn, .menu-item {
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
}

/* Improved mobile scrolling */
.chat-messages {
    -webkit-overflow-scrolling: touch;
    scroll-behavior: smooth;
}

/* Mobile keyboard adaptation */
@media (max-height: 600px) {
    .chat-messages {
        max-height: calc(100vh - 160px);
    }
}

/* Loading animation */
.app-container {
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.5s ease-out;
}

body.loaded .app-container {
    opacity: 1;
    transform: translateY(0);
}
`;

// Add enhanced CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = typingIndicatorCSS;
document.head.appendChild(styleSheet);

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AICompanionApp();
});

// Service Worker registration for PWA capabilities
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Prevent zoom on double tap (mobile optimization)
document.addEventListener('touchend', (e) => {
    const target = e.target;
    if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
        e.preventDefault();
    }
}, { passive: false });

// Handle viewport changes (mobile keyboard)
const viewportMeta = document.querySelector('meta[name="viewport"]');
function handleViewportChange() {
    if (window.innerHeight < window.innerWidth) {
        // Landscape or keyboard open
        viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0, user-scalable=no, viewport-fit=cover');
    } else {
        // Portrait
        viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0, user-scalable=no');
    }
}

window.addEventListener('resize', handleViewportChange);
window.addEventListener('orientationchange', handleViewportChange);