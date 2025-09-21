// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupNavigation();
    setupScrollAnimations();
    setupContactForm();
    setupStatsAnimation();
    setupSkillsAnimation();
    setupMatrixEffect();
}

// Navigation functionality
function setupNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active navigation highlighting
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

// Scroll animations
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // Trigger specific animations based on element type
                if (entry.target.classList.contains('stat-item')) {
                    animateStats();
                }
                if (entry.target.classList.contains('skill-category')) {
                    animateSkills(entry.target);
                }
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.stat-item, .skill-category, .project-card, .contact-item');
    animateElements.forEach(el => observer.observe(el));
}

// Stats counter animation
function setupStatsAnimation() {
    // This will be triggered by intersection observer
}

function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const increment = target / 50; // Animation duration control
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                stat.textContent = Math.ceil(current);
                setTimeout(updateCounter, 30);
            } else {
                stat.textContent = target;
            }
        };
        
        updateCounter();
    });
}

// Skills animation
function setupSkillsAnimation() {
    // This will be triggered by intersection observer
}

function animateSkills(skillCategory) {
    const skillBars = skillCategory.querySelectorAll('.skill-progress');
    
    skillBars.forEach((bar, index) => {
        setTimeout(() => {
            const width = bar.getAttribute('data-width');
            bar.style.width = width + '%';
        }, index * 200);
    });
}

// Contact form handling
function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');
        
        // Simulate form submission
        showNotification('Message sent successfully! Thank you for reaching out.', 'success');
        contactForm.reset();
    });
}

// Matrix effect enhancement
function setupMatrixEffect() {
    const matrixCode = document.querySelector('.matrix-code');
    
    // Add dynamic matrix-like characters
    const characters = '01';
    let matrixText = '';
    
    for (let i = 0; i < 100; i++) {
        matrixText += characters.charAt(Math.floor(Math.random() * characters.length));
        if (i % 10 === 0) matrixText += '<br>';
    }
    
    // Add subtle text overlay
    const textOverlay = document.createElement('div');
    textOverlay.innerHTML = matrixText;
    textOverlay.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: rgba(255, 255, 255, 0.1);
        font-family: monospace;
        font-size: 12px;
        line-height: 1.2;
        pointer-events: none;
        z-index: 1;
    `;
    
    matrixCode.appendChild(textOverlay);
}

// Utility functions
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offsetTop = section.offsetTop - 70;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : '#3498db'};
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Smooth reveal animations for elements
function revealOnScroll() {
    const reveals = document.querySelectorAll('.project-card, .contact-item');
    
    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('reveal');
        }
    });
}

window.addEventListener('scroll', revealOnScroll);

// Add reveal styles
const style = document.createElement('style');
style.textContent = `
    .project-card, .contact-item {
        opacity: 0;
        transform: translateY(50px);
        transition: all 0.6s ease;
    }
    
    .project-card.reveal, .contact-item.reveal {
        opacity: 1;
        transform: translateY(0);
    }
    
    .nav-link.active {
        color: #3498db;
    }
    
    .nav-link.active::after {
        width: 100%;
    }
`;
document.head.appendChild(style);

// Enhanced matrix background animation
function createMatrixRain() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        opacity: 0.1;
        z-index: 0;
    `;
    
    const matrixContainer = document.querySelector('.matrix-animation');
    if (matrixContainer) {
        matrixContainer.appendChild(canvas);
        
        // Resize canvas
        function resizeCanvas() {
            canvas.width = matrixContainer.offsetWidth;
            canvas.height = matrixContainer.offsetHeight;
        }
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        // Matrix rain effect
        const characters = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const fontSize = 14;
        const columns = canvas.width / fontSize;
        const drops = [];
        
        for (let i = 0; i < columns; i++) {
            drops[i] = 1;
        }
        
        function drawMatrix() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = '#00ff00';
            ctx.font = fontSize + 'px monospace';
            
            for (let i = 0; i < drops.length; i++) {
                const text = characters.charAt(Math.floor(Math.random() * characters.length));
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }
        
        setInterval(drawMatrix, 100);
    }
}

// Initialize matrix rain when page loads
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(createMatrixRain, 1000);
});

// Add CSS for enhanced animations
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    @keyframes slideInFromLeft {
        0% {
            transform: translateX(-100%);
            opacity: 0;
        }
        100% {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideInFromRight {
        0% {
            transform: translateX(100%);
            opacity: 0;
        }
        100% {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes bounceIn {
        0% {
            transform: scale(0.3);
            opacity: 0;
        }
        50% {
            transform: scale(1.05);
        }
        70% {
            transform: scale(0.9);
        }
        100% {
            transform: scale(1);
            opacity: 1;
        }
    }
    
    .animate {
        animation-duration: 0.8s;
        animation-fill-mode: both;
    }
    
    .slide-in-left {
        animation-name: slideInFromLeft;
    }
    
    .slide-in-right {
        animation-name: slideInFromRight;
    }
    
    .bounce-in {
        animation-name: bounceIn;
    }
`;
document.head.appendChild(additionalStyles);