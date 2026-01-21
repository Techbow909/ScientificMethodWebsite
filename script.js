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
    const message = (userInput && userInput.value || '').trim();

    if (!message) return;

    // Add user message to chat
    addMessage(message, 'user');
    if (userInput) userInput.value = '';

    // Show loading indicator
    const loadingDiv = document.getElementById('loading');
    if (loadingDiv) loadingDiv.classList.remove('hidden');

    try {
        // If Puter client is available, use it for client-side chat
        if (window.puter && puter.ai && typeof puter.ai.chat === 'function') {
            try {
                const resp = await puter.ai.chat(message, { model: 'gemini-3-flash-preview' });
                let text = '';
                if (typeof resp === 'string') text = resp;
                else if (resp && resp.output) text = resp.output;
                else if (resp && resp.text) text = resp.text;
                else text = JSON.stringify(resp);
                addMessage(text, 'assistant');
            } catch (err) {
                console.error('Puter error:', err);
                addMessage('AI Assistant (client) error.', 'error');
            }
            return;
        }

        // Try server-side proxy first (if you've added one later)
        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message })
            });

            if (res.ok) {
                const data = await res.json().catch(() => ({}));
                if (data && data.response) {
                    addMessage(data.response, 'assistant');
                    return;
                }
            }
            // if server returned non-ok or no usable data, fall through to local responder
        } catch (err) {
            // network/server error - fall back to local responder
            console.warn('Server proxy unavailable, using local responder.', err);
        }

        // Local offline responder (works without any API key)
        const reply = await localResponder(message);
        addMessage(reply, 'assistant');
    } catch (error) {
        console.error('Error:', error);
        addMessage('Sorry, the AI Assistant is currently unavailable.', 'error');
    } finally {
        if (loadingDiv) loadingDiv.classList.add('hidden');
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

// Local offline responder for when no API key / server is available
function localResponder(prompt) {
    return new Promise((resolve) => {
        const p = (prompt || '').toLowerCase();
        const responses = [];

        const map = [
            {k: ['obser', 'notice', 'see'], v: 'Observation: Watch carefully and write down what you notice. Use your senses and record details.'},
            {k: ['question', 'why', 'how', 'ask'], v: 'Question: Turn your observation into a testable question like "Do plants grow better with more sunlight?"'},
            {k: ['research', 'background', 'read', 'learn'], v: 'Research: Look up what others know — books, articles, or ask experts.'},
            {k: ['hypoth', 'if', 'then', 'predict'], v: 'Hypothesis: A testable prediction, often in "If... then..." form.'},
            {k: ['experiment', 'test', 'trial'], v: 'Experiment: Change only one variable, keep others the same, and record results.'},
            {k: ['data', 'analysis', 'graph', 'chart'], v: 'Data Analysis: Organize measurements, draw graphs, and look for patterns.'},
            {k: ['conclusion', 'result', 'right', 'wrong'], v: 'Conclusion: Compare results to your prediction and explain what they mean.'},
            {k: ['commun', 'share', 'present', 'peer'], v: 'Communication: Share your findings so others can review and learn.'},
            {k: ['method', 'steps', 'scientific method'], v: 'The Scientific Method: Observation → Question → Research → Hypothesis → Experiment → Analysis → Conclusion → Communication.'},
            {k: ['help', 'what can i ask', 'examples'], v: 'Try asking about any step (observation, hypothesis, experiment, analysis, conclusion) or ask for an example.'}
        ];

        for (const item of map) {
            if (item.k.some(kw => p.includes(kw))) responses.push(item.v);
        }

        const fallback = 'I don\'t have internet access to call an AI. Try asking about one of these: observation, hypothesis, experiment, data analysis, conclusion, or communication.';

        setTimeout(() => {
            resolve(responses.length ? responses.join(' ') : fallback);
        }, 600);
    });
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}
