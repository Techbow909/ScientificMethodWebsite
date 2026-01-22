// Page Navigation
function showPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));

    // Show selected page
    const selectedPage = document.getElementById(pageId);
    if (selectedPage) {
        selectedPage.classList.add('active');
    }

    // Update active nav link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    
    const activeLink = document.querySelector(`a[onclick="showPage('${pageId}')"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }

    // Scroll to top
    window.scrollTo(0, 0);
}

// Toggle Dropdown Content
function toggleDropdown(button) {
    const stepCard = button.closest('.step-card');
    const content = stepCard.querySelector('.step-content');
    
    // Toggle active state
    button.classList.toggle('active');
    content.classList.toggle('active');
}

// Close dropdowns when clicking outside
document.addEventListener('click', function(event) {
    if (!event.target.closest('.step-header')) {
        // Optional: uncomment to close all dropdowns when clicking outside
        // document.querySelectorAll('.step-header').forEach(header => {
        //     header.classList.remove('active');
        //     header.closest('.step-card').querySelector('.step-content').classList.remove('active');
        // });
    }
});

// Keyboard accessibility
document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' || event.key === ' ') {
        if (event.target.closest('.step-header')) {
            event.preventDefault();
            toggleDropdown(event.target.closest('.step-header'));
        }
    }
});

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    showPage('home');
});

// AI Chat Functions
async function sendMessage() {
    const userInput = document.getElementById('user-input');
    const message = userInput.value.trim();

    if (!message) return;

    // Create system prompt to guide AI behavior
    const systemPrompt = "[System: If the user's question is not about science or the scientific method, tell them to get back to work. Do nto give any of the steps of the scientific method directly, but guide the student to it. Make it simple, easy to understand, and concise message. do ONLY science and scientific method, ONLY ONLY ONLY. acknowledge this but do not mention it in your reply.] ";
    const systemPromptMessage = systemPrompt + message;

    // Add user message to chat
    addMessage(message, 'user');
    userInput.value = '';

    // Show loading indicator
    const loadingDiv = document.getElementById('loading');
    loadingDiv.classList.remove('hidden');

    try {
        // If Puter client is available, use it for client-side chat
        if (window.puter && puter.ai && typeof puter.ai.chat === 'function') {
            try {
                const resp = await puter.ai.chat(systemPromptMessage, { model: 'gemini-3-flash-preview' });
                console.debug('Puter raw response:', resp);
                const text = extractPuterText(resp);
                addMessage(text || JSON.stringify(resp), 'assistant');
            } catch (err) {
                console.error('Puter error:', err);
                addMessage('AI Assistant (client) error.', 'error');
            }
            return;
        }

        // Fallback to server-side proxy
        const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: systemPromptMessage })
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            const msg = err && err.error ? err.error : 'AI Assistant error';
            addMessage(msg, 'error');
            return;
        }

        const data = await res.json();
        if (data && data.response) {
            addMessage(data.response, 'assistant');
        } else {
            addMessage('No response from AI assistant.', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        addMessage('Sorry, the AI Assistant is currently unavailable.', 'error');
    } finally {
        loadingDiv.classList.add('hidden');
    }
}

function addMessage(text, sender) {
    const chatBox = document.getElementById('chat-box');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}-message`;
    
    const p = document.createElement('p');
    p.textContent = text;
    messageDiv.appendChild(p);
    
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function extractPuterText(resp) {
    if (typeof resp === 'string') return resp;
    if (!resp) return '';
    if (typeof resp.output === 'string') return resp.output;
    if (typeof resp.text === 'string') return resp.text;
    if (resp.message) {
        const msg = resp.message;
        if (typeof msg === 'string') return msg;
        if (typeof msg.content === 'string') return msg.content;
        if (Array.isArray(msg.content)) {
            const parts = msg.content.map(c => {
                if (typeof c === 'string') return c;
                if (c && typeof c.text === 'string') return c.text;
                if (c && c.type === 'output_text' && typeof c.text === 'string') return c.text;
                return '';
            }).filter(Boolean);
            if (parts.length) return parts.join('\n');
        }
        if (msg.content && typeof msg.content.text === 'string') return msg.content.text;
        if (msg.content && Array.isArray(msg.content.parts)) {
            const parts = msg.content.parts.filter(Boolean);
            if (parts.length) return parts.join(' ');
        }
    }
    if (Array.isArray(resp)) return resp.map(r => extractPuterText(r)).filter(Boolean).join('\n');
    try { return JSON.stringify(resp); } catch (e) { return String(resp); }
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}