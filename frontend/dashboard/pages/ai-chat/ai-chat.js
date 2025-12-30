// AI Chat Page JavaScript

let chatHistory = [];

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.focus();
    }

    // Load chat history from localStorage
    loadChatHistory();
});

// Handle Key Press
function handleKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

// Send Message
function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();

    if (!message) return;

    // Add user message
    addMessage(message, 'user');

    // Clear input
    input.value = '';

    // Show typing indicator
    showTypingIndicator();

    // Simulate AI response (in real app, this would call an API)
    setTimeout(() => {
        hideTypingIndicator();
        const response = generateAIResponse(message);
        addMessage(response, 'ai');
    }, 1500);
}

// Send Quick Message
function sendQuickMessage(message) {
    document.getElementById('chatInput').value = message;
    sendMessage();
}

// Add Message
function addMessage(text, type) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;

    const avatar = type === 'user' ? '👤' : '🤖';
    const time = new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });

    messageDiv.innerHTML = `
        <div class="message-avatar">${avatar}</div>
        <div class="message-content">
            <div class="message-text">${formatMessage(text)}</div>
            <div class="message-time">${time}</div>
        </div>
    `;

    messagesContainer.appendChild(messageDiv);
    scrollToBottom();

    // Save to history
    chatHistory.push({ text, type, time: new Date().toISOString() });
    saveChatHistory();
}

// Format Message (support markdown-like formatting)
function formatMessage(text) {
    // Convert newlines to <br>
    text = text.replace(/\n/g, '<br>');

    // Bold text **text**
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Italic text *text*
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Code blocks `code`
    text = text.replace(/`(.*?)`/g, '<code>$1</code>');

    return text;
}

// Show Typing Indicator
function showTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) {
        indicator.style.display = 'block';
        scrollToBottom();
    }
}

// Hide Typing Indicator
function hideTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) {
        indicator.style.display = 'none';
    }
}

// Generate AI Response (simulated)
function generateAIResponse(userMessage) {
    const message = userMessage.toLowerCase();

    // Health status queries
    if (message.includes('health status') || message.includes('how am i') || message.includes('my health')) {
        return `Based on your current health data, you're doing great! Your health score is **92**, which is excellent. Here's a quick summary:

• **Heart Rate**: 72 bpm (Normal range)
• **SpO2**: 98% (Optimal)
• **Blood Pressure**: 120/80 mmHg (Normal)
• **Steps Today**: 8,432 (Good activity level)

Your overall health is in excellent condition. Keep maintaining your current lifestyle!`;
    }

    // Recommendations
    if (message.includes('recommendation') || message.includes('suggest') || message.includes('advice')) {
        return `Here are some personalized health recommendations for you:

1. **Continue Regular Exercise**: You're doing great with 8,432 steps today. Aim for 10,000 steps daily for optimal health.

2. **Maintain Hydration**: Drink at least 8 glasses of water daily to support your body's functions.

3. **Sleep Quality**: Ensure 7-9 hours of quality sleep each night for optimal recovery.

4. **Balanced Diet**: Your current calorie intake looks good. Continue focusing on whole foods and balanced meals.

5. **Stress Management**: Your stress levels are low, which is excellent. Keep practicing mindfulness activities.

Would you like more specific recommendations for any particular area?`;
    }

    // Health metrics
    if (message.includes('metric') || message.includes('data') || message.includes('explain')) {
        return `Let me explain your recent health metrics:

**Heart Rate (72 bpm)**: Your heart rate is within the normal resting range (60-100 bpm). This indicates good cardiovascular health.

**SpO2 (98%)**: Your blood oxygen saturation is optimal. Normal range is 95-100%, so you're doing excellent.

**Blood Pressure (120/80 mmHg)**: This is considered normal. The systolic (120) and diastolic (80) pressures are both in healthy ranges.

**Steps (8,432)**: You're very active! This is great for cardiovascular health and overall fitness.

All your metrics are looking healthy! Is there a specific metric you'd like me to explain in more detail?`;
    }

    // Health tips
    if (message.includes('tip') || message.includes('improve') || message.includes('better')) {
        return `Here are some actionable tips to improve your health:

**Physical Activity**:
• Add 10 minutes of strength training 3x per week
• Try interval training for better cardiovascular benefits
• Take walking breaks every hour if you have a sedentary job

**Nutrition**:
• Include more leafy greens in your meals
• Reduce processed foods
• Stay hydrated throughout the day

**Mental Health**:
• Practice 10 minutes of meditation daily
• Maintain social connections
• Get adequate sleep (7-9 hours)

**Preventive Care**:
• Schedule regular health checkups
• Monitor your health metrics daily
• Stay up to date with vaccinations

Would you like more specific tips for any area?`;
    }

    // Health concerns
    if (message.includes('concern') || message.includes('problem') || message.includes('issue') || message.includes('worry')) {
        return `Based on your current health data, I don't see any immediate concerns. Your health metrics are all within normal ranges:

✅ Heart rate is normal
✅ Oxygen saturation is optimal
✅ Blood pressure is healthy
✅ Activity levels are good

However, it's always important to:
• Consult with healthcare professionals for medical advice
• Report any symptoms or changes you notice
• Keep monitoring your health metrics regularly

If you have specific symptoms or concerns, please consult with a healthcare provider. Is there something specific you're worried about?`;
    }

    // Heart rate queries
    if (message.includes('heart') || message.includes('cardiac') || message.includes('cardiovascular')) {
        return `Your heart health looks excellent! Here's what I can tell you:

**Current Heart Rate**: 72 bpm (Normal resting range: 60-100 bpm)

**What this means**:
• Your heart is functioning efficiently
• Good cardiovascular fitness
• Normal rhythm and rate

**To maintain heart health**:
• Continue regular exercise
• Maintain a balanced diet
• Manage stress levels
• Get adequate sleep
• Avoid smoking and excessive alcohol

Your heart rate variability and overall cardiovascular metrics indicate good heart health. Keep up the great work!`;
    }

    // BMI queries
    if (message.includes('bmi') || message.includes('weight') || message.includes('body mass')) {
        return `Based on your profile data, your BMI is approximately **22.9**, which falls in the **Normal** range (18.5-24.9).

**What this means**:
• You're at a healthy weight for your height
• Lower risk of weight-related health issues
• Good balance between muscle and fat

**To maintain a healthy BMI**:
• Continue your current activity level
• Eat a balanced diet
• Monitor your weight regularly
• Focus on body composition, not just weight

Would you like me to explain how BMI is calculated or provide more specific weight management advice?`;
    }

    // Default response
    return `I understand you're asking about "${userMessage}". 

As your AI Health Assistant, I can help you with:
• Understanding your health metrics
• Providing health recommendations
• Explaining medical terms
• Tracking your health progress
• Answering health-related questions

Could you rephrase your question or ask about something specific like your heart rate, health status, or recommendations?`;
}

// Scroll to Bottom
function scrollToBottom() {
    const messagesContainer = document.getElementById('chatMessages');
    if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

// Clear Chat
function clearChat() {
    if (confirm('Are you sure you want to clear the chat history?')) {
        const messagesContainer = document.getElementById('chatMessages');
        messagesContainer.innerHTML = `
            <div class="message ai-message">
                <div class="message-avatar">🤖</div>
                <div class="message-content">
                    <div class="message-text">
                        Chat cleared! How can I assist you today?
                    </div>
                    <div class="message-time">Just now</div>
                </div>
            </div>
        `;

        chatHistory = [];
        saveChatHistory();
    }
}

// Save Chat History
function saveChatHistory() {
    try {
        localStorage.setItem('aiChatHistory', JSON.stringify(chatHistory));
    } catch (e) {
        console.error('Failed to save chat history:', e);
    }
}

// Load Chat History
function loadChatHistory() {
    try {
        const saved = localStorage.getItem('aiChatHistory');
        if (saved) {
            chatHistory = JSON.parse(saved);
            // Optionally restore messages (commented out to keep it simple)
            // chatHistory.forEach(msg => {
            //     addMessage(msg.text, msg.type);
            // });
        }
    } catch (e) {
        console.error('Failed to load chat history:', e);
    }
}

