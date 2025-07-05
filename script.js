// DOM Elements
const navLinks = document.querySelectorAll('.nav-link');
const tabContents = document.querySelectorAll('.tab-content');
const checkboxes = document.querySelectorAll('input[type="checkbox"]');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Set up tab navigation
    setupTabs();
    
    // Set up checkbox persistence
    setupCheckboxes();
    
    // Set up progress tracking
    setupProgressTracking();
    
    // Set up smooth scrolling
    setupSmoothScrolling();
    
    // Load saved progress
    loadProgress();
    
    // Add mobile menu toggle if needed
    setupMobileMenu();
    
    // Set up print functionality
    setupPrintFunctionality();
});

// Tab Navigation
function setupTabs() {
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all nav links
            navLinks.forEach(navLink => {
                navLink.classList.remove('active');
            });
            
            // Add active class to clicked nav link
            this.classList.add('active');
            
            // Hide all tab contents
            tabContents.forEach(content => {
                content.classList.remove('active');
            });
            
            // Show target tab content
            const targetContent = document.getElementById(targetTab);
            if (targetContent) {
                targetContent.classList.add('active');
                
                // Scroll to top of content
                targetContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            
            // Save current tab to localStorage
            localStorage.setItem('currentTab', targetTab);
        });
    });
}

// Checkbox Persistence
function setupCheckboxes() {
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const checkboxId = this.id;
            const isChecked = this.checked;
            
            // Save checkbox state to localStorage
            localStorage.setItem(`checkbox_${checkboxId}`, isChecked);
            
            // Update progress
            updateProgress();
            
            // Add visual feedback
            if (isChecked) {
                this.parentElement.classList.add('completed');
                showCheckAnimation(this);
            } else {
                this.parentElement.classList.remove('completed');
            }
        });
    });
}

// Progress Tracking
function setupProgressTracking() {
    // Create progress indicators for each category
    const packingCategories = document.querySelectorAll('.packing-category');
    
    packingCategories.forEach(category => {
        const categoryTitle = category.querySelector('h3');
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        progressBar.innerHTML = `
            <div class="progress-track">
                <div class="progress-fill"></div>
            </div>
            <span class="progress-text">0%</span>
        `;
        
        categoryTitle.appendChild(progressBar);
    });
    
    updateProgress();
}

// Update Progress
function updateProgress() {
    const packingCategories = document.querySelectorAll('.packing-category');
    
    packingCategories.forEach(category => {
        const checkboxes = category.querySelectorAll('input[type="checkbox"]');
        const checkedBoxes = category.querySelectorAll('input[type="checkbox"]:checked');
        
        const progress = checkboxes.length > 0 ? (checkedBoxes.length / checkboxes.length) * 100 : 0;
        
        const progressFill = category.querySelector('.progress-fill');
        const progressText = category.querySelector('.progress-text');
        
        if (progressFill && progressText) {
            progressFill.style.width = `${progress}%`;
            progressText.textContent = `${Math.round(progress)}%`;
            
            // Change color based on progress
            if (progress === 100) {
                progressFill.style.backgroundColor = '#28a745';
            } else if (progress >= 50) {
                progressFill.style.backgroundColor = '#ffc107';
            } else {
                progressFill.style.backgroundColor = '#667eea';
            }
        }
    });
    
    // Update overall progress
    updateOverallProgress();
}

// Overall Progress
function updateOverallProgress() {
    const allCheckboxes = document.querySelectorAll('input[type="checkbox"]');
    const allCheckedBoxes = document.querySelectorAll('input[type="checkbox"]:checked');
    
    const overallProgress = allCheckboxes.length > 0 ? (allCheckedBoxes.length / allCheckboxes.length) * 100 : 0;
    
    // Update page title with progress
    document.title = `European Road Trip 2025 - ${Math.round(overallProgress)}% Complete`;
}

// Load Progress
function loadProgress() {
    // Load saved tab
    const savedTab = localStorage.getItem('currentTab');
    if (savedTab) {
        const savedTabLink = document.querySelector(`[data-tab="${savedTab}"]`);
        if (savedTabLink) {
            savedTabLink.click();
        }
    }
    
    // Load saved checkbox states
    checkboxes.forEach(checkbox => {
        const checkboxId = checkbox.id;
        const savedState = localStorage.getItem(`checkbox_${checkboxId}`);
        
        if (savedState === 'true') {
            checkbox.checked = true;
            checkbox.parentElement.classList.add('completed');
        }
    });
    
    // Update progress after loading
    updateProgress();
}

// Smooth Scrolling
function setupSmoothScrolling() {
    // Add smooth scrolling to all internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Mobile Menu
function setupMobileMenu() {
    const nav = document.querySelector('.nav');
    const navTabs = document.querySelector('.nav-tabs');
    
    // Add touch scrolling for mobile navigation
    if (navTabs) {
        navTabs.addEventListener('touchstart', function(e) {
            this.classList.add('scrolling');
        });
        
        navTabs.addEventListener('touchend', function(e) {
            this.classList.remove('scrolling');
        });
    }
    
    // Add keyboard navigation
    navLinks.forEach((link, index) => {
        link.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft' && index > 0) {
                e.preventDefault();
                navLinks[index - 1].focus();
            } else if (e.key === 'ArrowRight' && index < navLinks.length - 1) {
                e.preventDefault();
                navLinks[index + 1].focus();
            }
        });
    });
}

// Print Functionality
function setupPrintFunctionality() {
    // Add print button to each section
    const sections = document.querySelectorAll('.tab-content');
    
    sections.forEach(section => {
        const printButton = document.createElement('button');
        printButton.className = 'print-section-btn';
        printButton.innerHTML = '<i class="fas fa-print"></i> Print Section';
        printButton.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #667eea;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 14px;
            z-index: 1000;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            display: none;
        `;
        
        printButton.addEventListener('click', function() {
            printSection(section);
        });
        
        section.appendChild(printButton);
    });
    
    // Show print button when section is active
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const target = mutation.target;
                const printBtn = target.querySelector('.print-section-btn');
                
                if (printBtn) {
                    if (target.classList.contains('active')) {
                        printBtn.style.display = 'block';
                    } else {
                        printBtn.style.display = 'none';
                    }
                }
            }
        });
    });
    
    sections.forEach(section => {
        observer.observe(section, { attributes: true, attributeFilter: ['class'] });
    });
}

// Print Section
function printSection(section) {
    const printWindow = window.open('', '_blank');
    const sectionHTML = section.innerHTML;
    const styles = Array.from(document.styleSheets)
        .map(styleSheet => {
            try {
                return Array.from(styleSheet.cssRules)
                    .map(rule => rule.cssText)
                    .join('');
            } catch (e) {
                return '';
            }
        })
        .join('');
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>European Road Trip 2025</title>
            <style>
                ${styles}
                body { margin: 20px; }
                .print-section-btn { display: none !important; }
            </style>
        </head>
        <body>
            ${sectionHTML}
        </body>
        </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
}

// Check Animation
function showCheckAnimation(checkbox) {
    const checkmark = document.createElement('div');
    checkmark.className = 'checkmark-animation';
    checkmark.innerHTML = '✓';
    checkmark.style.cssText = `
        position: absolute;
        color: #28a745;
        font-size: 20px;
        font-weight: bold;
        animation: checkPop 0.5s ease-out;
        pointer-events: none;
    `;
    
    checkbox.parentElement.style.position = 'relative';
    checkbox.parentElement.appendChild(checkmark);
    
    setTimeout(() => {
        checkmark.remove();
    }, 500);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes checkPop {
        0% { transform: scale(0) rotate(0deg); opacity: 0; }
        50% { transform: scale(1.2) rotate(180deg); opacity: 1; }
        100% { transform: scale(1) rotate(360deg); opacity: 0; }
    }
    
    .progress-bar {
        margin-left: 1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        flex: 1;
        min-width: 120px;
    }
    
    .progress-track {
        flex: 1;
        height: 8px;
        background: #e0e0e0;
        border-radius: 4px;
        overflow: hidden;
    }
    
    .progress-fill {
        height: 100%;
        background: #667eea;
        transition: width 0.3s ease, background-color 0.3s ease;
        border-radius: 4px;
    }
    
    .progress-text {
        font-size: 0.8rem;
        font-weight: 600;
        color: #666;
        min-width: 35px;
    }
    
    .completed {
        background: #f0f9f0 !important;
        border-color: #28a745 !important;
    }
    
    .packing-category h3 {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        flex-wrap: wrap;
    }
    
    .nav-tabs.scrolling {
        scroll-behavior: smooth;
    }
    
    @media (max-width: 768px) {
        .progress-bar {
            margin-left: 0;
            margin-top: 0.5rem;
        }
        
        .packing-category h3 {
            flex-direction: column;
            align-items: flex-start;
        }
    }
`;
document.head.appendChild(style);

// Export functions for external use
window.TripPlanner = {
    switchTab: function(tabName) {
        const tabLink = document.querySelector(`[data-tab="${tabName}"]`);
        if (tabLink) {
            tabLink.click();
        }
    },
    
    resetProgress: function() {
        if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
            localStorage.clear();
            location.reload();
        }
    },
    
    exportData: function() {
        const data = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            data[key] = localStorage.getItem(key);
        }
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'road-trip-progress.json';
        a.click();
        URL.revokeObjectURL(url);
    },
    
    importData: function(file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);
                Object.keys(data).forEach(key => {
                    localStorage.setItem(key, data[key]);
                });
                location.reload();
            } catch (error) {
                alert('Invalid file format. Please select a valid progress file.');
            }
        };
        reader.readAsText(file);
    }
};

// Add utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimize scroll performance
const optimizedScroll = debounce(() => {
    // Handle scroll events efficiently
    const nav = document.querySelector('.nav');
    if (window.scrollY > 100) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
}, 10);

window.addEventListener('scroll', optimizedScroll);

// Add PWA-like offline functionality
if ('serviceWorker' in navigator) {
    // Register service worker for offline capabilities
    navigator.serviceWorker.register('/sw.js').catch(err => {
        console.log('Service Worker registration failed:', err);
    });
}

// Add beforeunload event to warn about unsaved changes
window.addEventListener('beforeunload', function(e) {
    const hasUnsavedChanges = localStorage.getItem('hasUnsavedChanges');
    if (hasUnsavedChanges === 'true') {
        e.preventDefault();
        e.returnValue = '';
    }
});

// Mark when user makes changes
checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        localStorage.setItem('hasUnsavedChanges', 'true');
    });
});

// Clear unsaved changes flag when explicitly saving
function saveProgress() {
    localStorage.setItem('hasUnsavedChanges', 'false');
    // Show save confirmation
    const saveNotification = document.createElement('div');
    saveNotification.textContent = 'Progress saved!';
    saveNotification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(saveNotification);
    setTimeout(() => {
        saveNotification.remove();
    }, 3000);
}

// Add save notification animation
const saveStyle = document.createElement('style');
saveStyle.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    .nav.scrolled {
        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        background: rgba(255,255,255,0.95);
        backdrop-filter: blur(10px);
    }
`;
document.head.appendChild(saveStyle);
