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
