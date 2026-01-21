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

    // Add user message to chat
    addMessage(message, 'user');
    userInput.value = '';

    // Show loading indicator
    const loadingDiv = document.getElementById('loading');
    loadingDiv.classList.remove('hidden');

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message })
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
        // AI Chat Functions
        if (window.puter && puter.ai && typeof puter.ai.chat === 'function') {
            try {
                const resp = await puter.ai.chat(message, { model: 'gemini-3-flash-preview' });
                let text = '';

                // Handle different possible response shapes. Prefer the friendly assistant message text.
                if (typeof resp === 'string') {
                    text = resp;
                } else if (resp && resp.message && resp.message.content) {
                    text = resp.message.content;
                } else if (resp && resp.output) {
                    text = resp.output;
                } else if (resp && resp.text) {
                    text = resp.text;
                } else {
                    // Fallback: stringify but avoid dumping large debug fields
                    try {
                        const safe = Object.assign({}, resp);
                        delete safe.extra_content;
                        text = JSON.stringify(safe);
                    } catch (e) {
                        text = String(resp);
                    }
                }

                addMessage(text, 'assistant');
            } catch (err) {
                console.error('Puter error:', err);
                addMessage('AI Assistant (client) error.', 'error');
            }
            return;
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

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}
