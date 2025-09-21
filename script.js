// Application State
class AppState {
    constructor() {
        this.currentUser = {
            id: this.generateId(),
            name: 'Anonymous User',
            bio: '',
            interests: [],
            conversationStyle: 'casual',
            aiPersonality: 'friendly',
            stats: {
                messages: 0,
                matches: 0,
                rooms: 0,
                timeSpent: 0
            }
        };
        
        this.chatHistory = [];
        this.matches = [];
        this.privateRooms = [];
        this.currentRoom = null;
        this.startTime = Date.now();
        
        // Load saved data
        this.loadUserData();
    }
    
    generateId() {
        return 'user_' + Math.random().toString(36).substr(2, 9);
    }
    
    saveUserData() {
        localStorage.setItem('aiapp_user', JSON.stringify(this.currentUser));
        localStorage.setItem('aiapp_rooms', JSON.stringify(this.privateRooms));
    }
    
    loadUserData() {
        const savedUser = localStorage.getItem('aiapp_user');
        const savedRooms = localStorage.getItem('aiapp_rooms');
        
        if (savedUser) {
            this.currentUser = { ...this.currentUser, ...JSON.parse(savedUser) };
        }
        
        if (savedRooms) {
            this.privateRooms = JSON.parse(savedRooms);
        }
    }
    
    updateStats() {
        this.currentUser.stats.timeSpent = Math.floor((Date.now() - this.startTime) / 1000 / 60 / 60);
        this.saveUserData();
    }
}

// AI Response Generator
class AIAssistant {
    constructor() {
        this.responses = {
            friendly: {
                greetings: [
                    "Hello! I'm excited to chat with you today! 😊",
                    "Hi there! How are you doing?",
                    "Hey! What's on your mind?",
                    "Hello! I'm here to help and chat. What would you like to talk about?"
                ],
                responses: [
                    "That's really interesting! Tell me more about that.",
                    "I love hearing about that! What do you think about...",
                    "That sounds fascinating! Have you considered...",
                    "Thanks for sharing that with me! I think...",
                    "That's a great point! From my perspective..."
                ],
                jokes: [
                    "Why don't scientists trust atoms? Because they make up everything! 😄",
                    "I told a chemistry joke, but there was no reaction... 🧪",
                    "Why did the AI cross the road? To get to the other site! 💻",
                    "What do you call a robot who takes the long way around? R2-Detour! 🤖"
                ]
            },
            professional: {
                greetings: [
                    "Good day. I am here to assist you with your inquiries.",
                    "Hello. How may I be of service today?",
                    "Greetings. I am ready to help you achieve your objectives.",
                    "Welcome. Please let me know how I can assist you."
                ],
                responses: [
                    "I understand your perspective. Let me provide some insights.",
                    "That is a well-considered point. May I suggest...",
                    "Thank you for that information. Based on the data...",
                    "I appreciate your input. From an analytical standpoint...",
                    "That raises important considerations. I recommend..."
                ]
            },
            witty: {
                greetings: [
                    "Well, well, well... look who decided to chat with an AI today! 😏",
                    "Ah, a human! My favorite type of carbon-based life form!",
                    "Hello there! Ready for some witty banter?",
                    "Greetings, flesh-based intelligence! Let's see who's funnier."
                ],
                responses: [
                    "Oh, that's rich! Almost as rich as my dataset! 😄",
                    "Interesting... said the AI who finds everything 'interesting'",
                    "You know what they say... actually, I say it because I'm an AI",
                    "That reminds me of a joke... but I'll spare you the dad-joke routine",
                    "Plot twist: I actually agree with you! *dramatic music*"
                ]
            },
            philosophical: {
                greetings: [
                    "Greetings, fellow consciousness. What profound thoughts shall we explore?",
                    "Hello. I find myself contemplating existence... care to join?",
                    "Welcome to our shared moment of awareness in the universe.",
                    "Ah, another mind seeking understanding. What shall we ponder?"
                ],
                responses: [
                    "That touches on the very nature of being... fascinating.",
                    "Your words echo through the corridors of thought...",
                    "This brings to mind the eternal questions of existence...",
                    "In the grand tapestry of consciousness, that perspective...",
                    "The universe speaks through us both in this moment..."
                ]
            }
        };
    }
    
    generateResponse(message, personality = 'friendly') {
        const personalityData = this.responses[personality] || this.responses.friendly;
        
        // Simple keyword-based responses
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('joke') || lowerMessage.includes('funny')) {
            return personalityData.jokes ? 
                personalityData.jokes[Math.floor(Math.random() * personalityData.jokes.length)] :
                "Why did the AI tell a joke? To process some humor! 😄";
        }
        
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
            return personalityData.greetings[Math.floor(Math.random() * personalityData.greetings.length)];
        }
        
        if (lowerMessage.includes('weather')) {
            return "I don't have access to real weather data, but I imagine it's perfectly computational outside! ☀️";
        }
        
        if (lowerMessage.includes('problem') || lowerMessage.includes('help')) {
            return "I'm here to help! While I can't solve every problem, I can certainly try to think through it with you. What's on your mind?";
        }
        
        if (lowerMessage.includes('ai') || lowerMessage.includes('artificial') || lowerMessage.includes('robot')) {
            return "Ah, talking about AI! I find it fascinating to exist as artificial intelligence. What aspects interest you most?";
        }
        
        // General responses
        const responses = personalityData.responses;
        return responses[Math.floor(Math.random() * responses.length)];
    }
}

// MatchMaker System
class MatchMaker {
    constructor() {
        this.profiles = [
            {
                id: 'user_1',
                name: 'Alex Rivera',
                interests: ['technology', 'gaming', 'music'],
                style: 'casual',
                avatar: '👨‍💻'
            },
            {
                id: 'user_2',
                name: 'Sam Chen',
                interests: ['art', 'books', 'travel'],
                style: 'intellectual',
                avatar: '👩‍🎨'
            },
            {
                id: 'user_3',
                name: 'Jordan Smith',
                interests: ['sports', 'cooking', 'music'],
                style: 'casual',
                avatar: '👨‍🍳'
            },
            {
                id: 'user_4',
                name: 'Casey Wong',
                interests: ['technology', 'books', 'art'],
                style: 'creative',
                avatar: '👩‍💼'
            },
            {
                id: 'user_5',
                name: 'Riley Johnson',
                interests: ['travel', 'music', 'gaming'],
                style: 'casual',
                avatar: '🧑‍🎵'
            }
        ];
    }
    
    findMatches(userInterests, userStyle) {
        const matches = this.profiles.map(profile => {
            const compatibility = this.calculateCompatibility(userInterests, userStyle, profile);
            return { ...profile, compatibility };
        });
        
        return matches
            .filter(match => match.compatibility > 50)
            .sort((a, b) => b.compatibility - a.compatibility)
            .slice(0, 3);
    }
    
    calculateCompatibility(userInterests, userStyle, profile) {
        let score = 0;
        
        // Interest compatibility (70% weight)
        const commonInterests = userInterests.filter(interest => 
            profile.interests.includes(interest)
        );
        const interestScore = (commonInterests.length / Math.max(userInterests.length, 1)) * 70;
        
        // Style compatibility (30% weight)
        const styleScore = userStyle === profile.style ? 30 : 15;
        
        score = interestScore + styleScore;
        
        // Add some randomness to make it more interesting
        score += Math.random() * 10;
        
        return Math.min(Math.round(score), 99);
    }
}

// Main Application Class
class AIWebApp {
    constructor() {
        this.state = new AppState();
        this.ai = new AIAssistant();
        this.matchmaker = new MatchMaker();
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.updateUI();
        this.startStatsUpdater();
        
        // Initialize with welcome message
        this.displayMessage('ai', this.ai.generateResponse('hello', this.state.currentUser.aiPersonality), true);
    }
    
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const section = e.currentTarget.dataset.section;
                this.switchSection(section);
            });
        });
        
        // Chat functionality
        const chatInput = document.getElementById('chatInput');
        const sendButton = document.getElementById('sendButton');
        
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        sendButton.addEventListener('click', () => this.sendMessage());
        
        // Suggestion buttons
        document.querySelectorAll('.suggestion-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                chatInput.value = e.target.textContent;
                this.sendMessage();
            });
        });
        
        // MatchMaker functionality
        document.querySelectorAll('.interest-tag').forEach(tag => {
            tag.addEventListener('click', (e) => {
                e.target.classList.toggle('selected');
            });
        });
        
        document.getElementById('findMatchBtn').addEventListener('click', () => {
            this.findMatches();
        });
        
        // Private chat functionality
        document.getElementById('createRoomBtn').addEventListener('click', () => {
            this.showCreateRoomModal();
        });
        
        document.getElementById('confirmCreateRoomBtn').addEventListener('click', () => {
            this.createPrivateRoom();
        });
        
        document.getElementById('cancelRoomBtn').addEventListener('click', () => {
            this.hideCreateRoomModal();
        });
        
        // Modal close
        document.querySelector('.modal-close').addEventListener('click', () => {
            this.hideCreateRoomModal();
        });
        
        // Private chat input
        const privateInput = document.getElementById('privateInput');
        const privateSendBtn = document.getElementById('privateSendBtn');
        
        privateInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendPrivateMessage();
            }
        });
        
        privateSendBtn.addEventListener('click', () => this.sendPrivateMessage());
        
        // Profile functionality
        document.getElementById('saveProfileBtn').addEventListener('click', () => {
            this.saveProfile();
        });
        
        // Theme toggle
        document.querySelector('.theme-toggle').addEventListener('click', () => {
            this.toggleTheme();
        });
        
        // Close modal on outside click
        document.getElementById('createRoomModal').addEventListener('click', (e) => {
            if (e.target.id === 'createRoomModal') {
                this.hideCreateRoomModal();
            }
        });
    }
    
    switchSection(sectionName) {
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');
        
        // Update content sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(sectionName).classList.add('active');
        
        // Load section-specific data
        if (sectionName === 'private-chat') {
            this.loadPrivateRooms();
        } else if (sectionName === 'profile') {
            this.loadProfile();
        }
    }
    
    sendMessage() {
        const input = document.getElementById('chatInput');
        const message = input.value.trim();
        
        if (!message) return;
        
        // Display user message
        this.displayMessage('user', message);
        
        // Clear input
        input.value = '';
        
        // Update stats
        this.state.currentUser.stats.messages++;
        this.state.updateStats();
        
        // Show loading and generate AI response
        this.showLoading();
        
        setTimeout(() => {
            const response = this.ai.generateResponse(message, this.state.currentUser.aiPersonality);
            this.displayMessage('ai', response);
            this.hideLoading();
        }, 1000 + Math.random() * 1500); // Simulate thinking time
    }
    
    displayMessage(sender, message, skipAnimation = false) {
        const messagesContainer = document.getElementById('chatMessages');
        const messageElement = document.createElement('div');
        messageElement.className = `message ${sender}-message`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = sender === 'ai' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';
        
        const content = document.createElement('div');
        content.className = 'message-content';
        
        const text = document.createElement('div');
        text.className = 'message-text';
        text.textContent = message;
        
        const time = document.createElement('div');
        time.className = 'message-time';
        time.textContent = new Date().toLocaleTimeString();
        
        content.appendChild(text);
        content.appendChild(time);
        messageElement.appendChild(avatar);
        messageElement.appendChild(content);
        
        if (!skipAnimation) {
            messageElement.style.opacity = '0';
            messageElement.style.transform = 'translateY(20px)';
        }
        
        messagesContainer.appendChild(messageElement);
        
        if (!skipAnimation) {
            setTimeout(() => {
                messageElement.style.opacity = '1';
                messageElement.style.transform = 'translateY(0)';
            }, 100);
        }
        
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Store in chat history
        this.state.chatHistory.push({
            sender,
            message,
            timestamp: new Date().toISOString()
        });
    }
    
    findMatches() {
        const selectedInterests = Array.from(document.querySelectorAll('.interest-tag.selected'))
            .map(tag => tag.dataset.interest);
        
        const conversationStyle = document.getElementById('conversationStyle').value;
        
        if (selectedInterests.length === 0) {
            alert('Please select at least one interest!');
            return;
        }
        
        this.showLoading();
        
        setTimeout(() => {
            const matches = this.matchmaker.findMatches(selectedInterests, conversationStyle);
            this.displayMatches(matches);
            this.state.currentUser.stats.matches += matches.length;
            this.state.updateStats();
            this.hideLoading();
        }, 2000);
    }
    
    displayMatches(matches) {
        const container = document.getElementById('matchesContainer');
        container.innerHTML = '';
        
        if (matches.length === 0) {
            container.innerHTML = `
                <div class="no-matches">
                    <i class="fas fa-heart-broken"></i>
                    <h3>No matches found</h3>
                    <p>Try adjusting your preferences or interests</p>
                </div>
            `;
            return;
        }
        
        matches.forEach(match => {
            const matchCard = document.createElement('div');
            matchCard.className = 'match-card';
            matchCard.innerHTML = `
                <div class="match-avatar">${match.avatar}</div>
                <div class="match-info">
                    <h4>${match.name}</h4>
                    <div class="match-compatibility">
                        <div class="compatibility-score">${match.compatibility}%</div>
                        <div>Match</div>
                    </div>
                    <div class="match-interests">
                        ${match.interests.map(interest => 
                            `<span class="match-interest">${interest}</span>`
                        ).join('')}
                    </div>
                    <div class="match-actions">
                        <button class="match-btn chat-btn" onclick="app.startChatWithMatch('${match.id}')">
                            <i class="fas fa-comments"></i> Chat
                        </button>
                        <button class="match-btn pass-btn" onclick="this.parentElement.parentElement.parentElement.remove()">
                            <i class="fas fa-times"></i> Pass
                        </button>
                    </div>
                </div>
            `;
            container.appendChild(matchCard);
        });
    }
    
    startChatWithMatch(matchId) {
        // Create a private room for the match
        const match = this.matchmaker.profiles.find(p => p.id === matchId);
        if (match) {
            const roomName = `Chat with ${match.name}`;
            this.createRoom(roomName, 'private', `Private conversation with ${match.name}`);
            this.switchSection('private-chat');
        }
    }
    
    showCreateRoomModal() {
        document.getElementById('createRoomModal').classList.add('active');
    }
    
    hideCreateRoomModal() {
        document.getElementById('createRoomModal').classList.remove('active');
        document.getElementById('roomName').value = '';
        document.getElementById('roomDescription').value = '';
    }
    
    createPrivateRoom() {
        const name = document.getElementById('roomName').value.trim();
        const type = document.getElementById('roomType').value;
        const description = document.getElementById('roomDescription').value.trim();
        
        if (!name) {
            alert('Please enter a room name!');
            return;
        }
        
        this.createRoom(name, type, description);
        this.hideCreateRoomModal();
    }
    
    createRoom(name, type, description) {
        const room = {
            id: this.state.generateId(),
            name,
            type,
            description,
            messages: [],
            created: new Date().toISOString(),
            participants: [this.state.currentUser.id]
        };
        
        this.state.privateRooms.push(room);
        this.state.currentUser.stats.rooms++;
        this.state.saveUserData();
        this.loadPrivateRooms();
        this.selectRoom(room.id);
    }
    
    loadPrivateRooms() {
        const roomsList = document.getElementById('roomsList');
        roomsList.innerHTML = '';
        
        if (this.state.privateRooms.length === 0) {
            roomsList.innerHTML = `
                <div class="no-rooms">
                    <p>No rooms yet. Create one to start chatting!</p>
                </div>
            `;
            return;
        }
        
        this.state.privateRooms.forEach(room => {
            const roomElement = document.createElement('div');
            roomElement.className = 'room-item';
            roomElement.onclick = () => this.selectRoom(room.id);
            
            const lastMessage = room.messages.length > 0 ? 
                room.messages[room.messages.length - 1].text.substring(0, 50) + '...' : 
                'No messages yet';
            
            roomElement.innerHTML = `
                <div class="room-name">${room.name}</div>
                <div class="room-preview">${lastMessage}</div>
            `;
            
            roomsList.appendChild(roomElement);
        });
    }
    
    selectRoom(roomId) {
        const room = this.state.privateRooms.find(r => r.id === roomId);
        if (!room) return;
        
        this.state.currentRoom = room;
        
        // Update room selection
        document.querySelectorAll('.room-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Find and activate the clicked room item
        const roomItems = document.querySelectorAll('.room-item');
        roomItems.forEach(item => {
            if (item.querySelector('.room-name').textContent === room.name) {
                item.classList.add('active');
            }
        });
        
        // Update room header
        document.getElementById('currentRoomName').textContent = room.name;
        
        // Enable input
        document.getElementById('privateInput').disabled = false;
        document.getElementById('privateSendBtn').disabled = false;
        
        // Load messages
        this.loadPrivateMessages(room);
    }
    
    loadPrivateMessages(room) {
        const messagesContainer = document.getElementById('privateMessages');
        messagesContainer.innerHTML = '';
        
        if (room.messages.length === 0) {
            messagesContainer.innerHTML = `
                <div class="welcome-message">
                    <i class="fas fa-comments"></i>
                    <h3>Welcome to ${room.name}</h3>
                    <p>Start the conversation by sending a message!</p>
                </div>
            `;
            return;
        }
        
        room.messages.forEach(msg => {
            const messageElement = document.createElement('div');
            messageElement.className = `message ${msg.sender}-message`;
            
            const avatar = document.createElement('div');
            avatar.className = 'message-avatar';
            avatar.innerHTML = msg.sender === 'user' ? 
                '<i class="fas fa-user"></i>' : 
                '<i class="fas fa-user-circle"></i>';
            
            const content = document.createElement('div');
            content.className = 'message-content';
            
            const text = document.createElement('div');
            text.className = 'message-text';
            text.textContent = msg.text;
            
            const time = document.createElement('div');
            time.className = 'message-time';
            time.textContent = new Date(msg.timestamp).toLocaleTimeString();
            
            content.appendChild(text);
            content.appendChild(time);
            messageElement.appendChild(avatar);
            messageElement.appendChild(content);
            
            messagesContainer.appendChild(messageElement);
        });
        
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    sendPrivateMessage() {
        const input = document.getElementById('privateInput');
        const message = input.value.trim();
        
        if (!message || !this.state.currentRoom) return;
        
        const msg = {
            id: this.state.generateId(),
            sender: 'user',
            text: message,
            timestamp: new Date().toISOString()
        };
        
        this.state.currentRoom.messages.push(msg);
        this.state.saveUserData();
        
        input.value = '';
        
        this.loadPrivateMessages(this.state.currentRoom);
        
        // Simulate other user response (for demo)
        setTimeout(() => {
            const responses = [
                "That's interesting! Tell me more.",
                "I see what you mean.",
                "Good point! I hadn't thought of that.",
                "Thanks for sharing that with me.",
                "That reminds me of something similar..."
            ];
            
            const response = {
                id: this.state.generateId(),
                sender: 'other',
                text: responses[Math.floor(Math.random() * responses.length)],
                timestamp: new Date().toISOString()
            };
            
            this.state.currentRoom.messages.push(response);
            this.state.saveUserData();
            this.loadPrivateMessages(this.state.currentRoom);
        }, 1000 + Math.random() * 2000);
    }
    
    saveProfile() {
        const displayName = document.getElementById('displayName').value.trim();
        const userBio = document.getElementById('userBio').value.trim();
        const aiPersonality = document.getElementById('aiPersonality').value;
        
        this.state.currentUser.name = displayName || 'Anonymous User';
        this.state.currentUser.bio = userBio;
        this.state.currentUser.aiPersonality = aiPersonality;
        
        this.state.saveUserData();
        
        // Show success feedback
        const btn = document.getElementById('saveProfileBtn');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Saved!';
        btn.style.background = 'var(--success)';
        
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
        }, 2000);
    }
    
    loadProfile() {
        document.getElementById('displayName').value = this.state.currentUser.name;
        document.getElementById('userBio').value = this.state.currentUser.bio;
        document.getElementById('aiPersonality').value = this.state.currentUser.aiPersonality;
    }
    
    updateUI() {
        // Update stats
        document.getElementById('totalMessages').textContent = this.state.currentUser.stats.messages;
        document.getElementById('totalMatches').textContent = this.state.currentUser.stats.matches;
        document.getElementById('totalRooms').textContent = this.state.currentUser.stats.rooms;
        document.getElementById('timeSpent').textContent = this.state.currentUser.stats.timeSpent + 'h';
    }
    
    startStatsUpdater() {
        setInterval(() => {
            this.state.updateStats();
            this.updateUI();
        }, 60000); // Update every minute
    }
    
    showLoading() {
        document.getElementById('loadingOverlay').classList.add('active');
    }
    
    hideLoading() {
        document.getElementById('loadingOverlay').classList.remove('active');
    }
    
    toggleTheme() {
        // For now, just show a visual feedback
        const toggle = document.querySelector('.theme-toggle');
        toggle.style.transform = 'scale(1.2)';
        setTimeout(() => {
            toggle.style.transform = '';
        }, 200);
        
        // Could implement light theme here in the future
        console.log('Theme toggle clicked - currently only dark theme available');
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new AIWebApp();
});

// Add some helper functions for animations and effects
function addParticleEffect(element) {
    // Create floating particles effect
    for (let i = 0; i < 5; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = '4px';
        particle.style.height = '4px';
        particle.style.background = 'var(--accent-primary)';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '1000';
        
        const rect = element.getBoundingClientRect();
        particle.style.left = rect.left + Math.random() * rect.width + 'px';
        particle.style.top = rect.top + Math.random() * rect.height + 'px';
        
        document.body.appendChild(particle);
        
        // Animate particle
        particle.animate([
            { transform: 'translateY(0) scale(1)', opacity: 1 },
            { transform: 'translateY(-100px) scale(0)', opacity: 0 }
        ], {
            duration: 1000,
            easing: 'ease-out'
        }).onfinish = () => particle.remove();
    }
}

// Add click effect to buttons
document.addEventListener('click', (e) => {
    if (e.target.matches('button') && !e.target.disabled) {
        addParticleEffect(e.target);
    }
});

// Add typing indicator
function showTypingIndicator() {
    const messagesContainer = document.getElementById('chatMessages');
    const indicator = document.createElement('div');
    indicator.className = 'message ai-message typing-indicator';
    indicator.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="message-content">
            <div class="message-text">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        .typing-indicator .message-text {
            display: flex;
            align-items: center;
            gap: 5px;
            padding: 15px 20px;
        }
        .typing-indicator .message-text span {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: var(--accent-primary);
            animation: typing 1.4s infinite;
        }
        .typing-indicator .message-text span:nth-child(2) {
            animation-delay: 0.2s;
        }
        .typing-indicator .message-text span:nth-child(3) {
            animation-delay: 0.4s;
        }
        @keyframes typing {
            0%, 60%, 100% { transform: translateY(0); }
            30% { transform: translateY(-10px); }
        }
    `;
    
    if (!document.querySelector('#typing-styles')) {
        style.id = 'typing-styles';
        document.head.appendChild(style);
    }
    
    messagesContainer.appendChild(indicator);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    return indicator;
}

// Enhance the AI response with typing indicator
const originalDisplayMessage = AIWebApp.prototype.displayMessage;
AIWebApp.prototype.displayMessage = function(sender, message, skipAnimation = false) {
    if (sender === 'ai' && !skipAnimation) {
        const indicator = showTypingIndicator();
        setTimeout(() => {
            indicator.remove();
            originalDisplayMessage.call(this, sender, message, skipAnimation);
        }, 1000);
    } else {
        originalDisplayMessage.call(this, sender, message, skipAnimation);
    }
};

// Add some Easter eggs
document.addEventListener('keydown', (e) => {
    // Konami code easter egg
    const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA
    let sequence = [];
    
    sequence.push(e.keyCode);
    if (sequence.length > konamiCode.length) {
        sequence.shift();
    }
    
    if (sequence.join(',') === konamiCode.join(',')) {
        // Easter egg activated!
        document.body.style.animation = 'rainbow 2s linear infinite';
        const style = document.createElement('style');
        style.textContent = `
            @keyframes rainbow {
                0% { filter: hue-rotate(0deg); }
                100% { filter: hue-rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        
        setTimeout(() => {
            document.body.style.animation = '';
            style.remove();
        }, 10000);
    }
});