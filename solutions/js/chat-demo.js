// Chat Demo Functionality
class ChatDemo {
    constructor() {
        console.log('Initializing ChatDemo...');
        this.messagesContainer = document.querySelector('.chatbot-messages');
        this.inputField = document.querySelector('#chat-input');
        this.sendButton = document.querySelector('#send-button');
        
        if (!this.messagesContainer || !this.inputField || !this.sendButton) {
            console.error('Required elements not found');
            return;
        }

        this.isTyping = false;
        this.typingTimeout = null;
        this.messageHistory = [];
        this.currentContext = {};
        
        this.initializeEventListeners();
        this.initializeDemoMessages();
        this.setupMobileKeyboard();
        
        console.log('ChatDemo initialized successfully');
    }

    initializeEventListeners() {
        console.log('Setting up event listeners...');
        
        // Send button click
        this.sendButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Send button clicked');
            this.handleSendMessage();
        });
        
        // Enter key press
        this.inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Enter key pressed');
                this.handleSendMessage();
            }
        });

        // Input focus effects
        this.inputField.addEventListener('focus', () => {
            this.inputField.parentElement.classList.add('input-focused');
            this.scrollToBottom();
        });

        this.inputField.addEventListener('blur', () => {
            this.inputField.parentElement.classList.remove('input-focused');
        });

        // Prevent form submission
        this.inputField.addEventListener('submit', (e) => {
            e.preventDefault();
            e.stopPropagation();
        });

        console.log('Event listeners set up successfully');
    }

    setupMobileKeyboard() {
        // Handle mobile keyboard appearance
        const viewport = document.querySelector('meta[name=viewport]');
        viewport.setAttribute('content', viewport.content + ', height=' + window.innerHeight);
        
        window.addEventListener('resize', () => {
            this.scrollToBottom();
        });
    }

    initializeDemoMessages() {
        // Clear any existing messages first
        this.messagesContainer.innerHTML = '';
        
        const initialMessages = [
            { text: "Hello! I'm your AI assistant. How can I help you today?", type: 'bot' },
            { text: "What services do you offer?", type: 'user' },
            { text: "We offer a wide range of AI-powered solutions including customer service chatbots, virtual assistants, and automated support systems. Would you like to know more about any specific service?", type: 'bot' }
        ];

        // Add messages with a slight delay between each
        initialMessages.forEach((msg, index) => {
            setTimeout(() => {
                this.addMessage(msg.text, msg.type);
            }, index * 500); // 500ms delay between each message
        });
    }

    handleSendMessage() {
        const message = this.inputField.value.trim();
        if (!message) return;

        console.log('Handling message:', message);

        // Disable input while processing
        this.inputField.disabled = true;
        this.sendButton.disabled = true;

        // Add user message immediately
        this.addMessage(message, 'user');
        this.inputField.value = '';
        
        // Show typing indicator and get bot response
        const typingDiv = this.showTypingIndicator();
        
        // Simulate typing delay based on message length
        const delay = Math.min(1500, message.length * 50);
        
        setTimeout(() => {
            this.removeTypingIndicator(typingDiv);
            const response = this.getBotResponse(message);
            this.addMessage(response, 'bot');
            this.scrollToBottom();
            
            // Re-enable input after bot response
            this.inputField.disabled = false;
            this.sendButton.disabled = false;
            this.inputField.focus();
        }, delay);
    }

    addMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type} fade-in`;
        messageDiv.textContent = text;
        this.messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
        
        // Add message to history
        this.messageHistory.push({ text, type, timestamp: Date.now() });
        
        // Trigger animation
        requestAnimationFrame(() => {
            messageDiv.classList.add('visible');
        });
    }

    showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot typing fade-in';
        typingDiv.innerHTML = '<span></span><span></span><span></span>';
        this.messagesContainer.appendChild(typingDiv);
        this.scrollToBottom();
        
        requestAnimationFrame(() => {
            typingDiv.classList.add('visible');
        });
        
        return typingDiv;
    }

    removeTypingIndicator(typingDiv) {
        if (typingDiv && typingDiv.parentNode) {
            typingDiv.classList.add('fade-out');
            setTimeout(() => {
                typingDiv.parentNode.removeChild(typingDiv);
            }, 300);
        }
    }

    simulateBotResponse(userMessage) {
        const typingDiv = this.showTypingIndicator();
        
        // Simulate typing delay based on message length
        const delay = Math.min(1500, userMessage.length * 50);
        
        setTimeout(() => {
            this.removeTypingIndicator(typingDiv);
            const response = this.getBotResponse(userMessage);
            this.addMessage(response, 'bot');
            this.scrollToBottom();
        }, delay);
    }

    getBotResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        // Update context based on user message
        if (message.includes('pricing')) {
            this.currentContext.topic = 'pricing';
        } else if (message.includes('features')) {
            this.currentContext.topic = 'features';
        } else if (message.includes('contact')) {
            this.currentContext.topic = 'contact';
        }

        const responses = {
            'hello': 'Hi there! How can I help you today?',
            'hi': 'Hello! What can I do for you?',
            'help': 'I can help you with product information, pricing, technical support, and more. What would you like to know?',
            'pricing': this.getPricingResponse(),
            'contact': 'You can reach our support team at kaana.sriman@gmail.com or call us at +91-9008747926.',
            'features': this.getFeaturesResponse(),
            'bye': 'Goodbye! Have a great day!',
            'thanks': 'You\'re welcome! Is there anything else I can help you with?',
            'default': this.getDefaultResponse()
        };

        for (const [key, value] of Object.entries(responses)) {
            if (message.includes(key)) {
                return value;
            }
        }
        return responses.default;
    }

    getPricingResponse() {
        const pricingResponses = [
            'Our pricing plans start from $99/month for basic features. Would you like to see our detailed pricing structure?',
            'We offer flexible pricing based on your needs. Basic plan starts at $99/month, Pro at $199/month, and Enterprise is custom-priced. Which plan would you like to know more about?',
            'I can help you find the perfect plan for your business. Would you like to schedule a call with our sales team for a detailed quote?'
        ];
        return pricingResponses[Math.floor(Math.random() * pricingResponses.length)];
    }

    getFeaturesResponse() {
        const featuresResponses = [
            'Our chatbot includes features like natural language processing, multi-language support, and 24/7 availability. Which feature would you like to learn more about?',
            'Key features include AI-powered responses, analytics dashboard, and seamless integrations. What interests you most?',
            'We offer advanced features like sentiment analysis, custom workflows, and API access. Would you like to explore any specific feature?'
        ];
        return featuresResponses[Math.floor(Math.random() * featuresResponses.length)];
    }

    getDefaultResponse() {
        const defaultResponses = [
            'I\'m not sure I understand. Could you please rephrase that?',
            'Could you provide more details about what you\'re looking for?',
            'I\'d be happy to help if you could clarify your question.',
            'Let me know if you need help with pricing, features, or technical support.'
        ];
        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }

    scrollToBottom() {
        requestAnimationFrame(() => {
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
            // Additional scroll for mobile
            if (window.innerWidth < 768) {
                window.scrollTo({
                    top: this.messagesContainer.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    }
}

// Remove auto-initialization
// The chat demo will be initialized by the HTML file