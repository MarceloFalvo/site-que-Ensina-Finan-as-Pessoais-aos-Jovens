// ============================================
// MF Invest - Main JavaScript File
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // Mobile Menu Toggle
    // ============================================
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            
            // Toggle icon
            const icon = this.querySelector('i');
            if (mobileMenu.classList.contains('hidden')) {
                icon.setAttribute('data-lucide', 'menu');
            } else {
                icon.setAttribute('data-lucide', 'x');
            }
            lucide.createIcons();
        });

        // Close mobile menu when clicking on a link
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.add('hidden');
                const icon = mobileMenuBtn.querySelector('i');
                icon.setAttribute('data-lucide', 'menu');
                lucide.createIcons();
            });
        });
    }

    // ============================================
    // Simulador de Economia
    // ============================================
    const salarySlider = document.getElementById('salary-slider');
    const expenseSlider = document.getElementById('expense-slider');
    const salaryDisplay = document.getElementById('salary-display');
    const expenseDisplay = document.getElementById('expense-display');
    const savingsDisplay = document.getElementById('savings-display');
    const savingsPercent = document.getElementById('savings-percent');
    const savingsYear = document.getElementById('savings-year');
    const savings5Years = document.getElementById('savings-5years');

    function formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    }

    function updateSimulator() {
        const salary = parseInt(salarySlider.value);
        const expense = parseInt(expenseSlider.value);
        const savings = salary - expense;
        const percent = salary > 0 ? ((savings / salary) * 100).toFixed(0) : 0;

        salaryDisplay.textContent = formatCurrency(salary);
        expenseDisplay.textContent = formatCurrency(expense);
        savingsDisplay.textContent = formatCurrency(savings);
        savingsPercent.textContent = `${percent}% da sua renda`;
        savingsYear.textContent = formatCurrency(savings * 12);
        savings5Years.textContent = formatCurrency(savings * 60);

        // Update expense slider max value
        expenseSlider.max = salary;
        if (expense > salary) {
            expenseSlider.value = salary;
            updateSimulator();
        }
    }

    if (salarySlider && expenseSlider) {
        salarySlider.addEventListener('input', updateSimulator);
        expenseSlider.addEventListener('input', updateSimulator);
        
        // Initialize
        updateSimulator();
    }

    // ============================================
    // Smooth Scroll Navigation
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed header
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================
    // Scroll Animations (Intersection Observer)
    // ============================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });

    // ============================================
    // Navbar Background on Scroll
    // ============================================
    const navbar = document.querySelector('nav');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 50) {
            navbar.classList.add('shadow-lg');
        } else {
            navbar.classList.remove('shadow-lg');
        }

        lastScrollTop = scrollTop;
    });

    // ============================================
    // Email Validation
    // ============================================
    const emailInputs = document.querySelectorAll('input[type="email"]');
    emailInputs.forEach(input => {
        input.addEventListener('blur', function() {
            const email = this.value;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (email && !emailRegex.test(email)) {
                this.classList.add('border-red-500');
                this.classList.remove('border-slate-700', 'focus:border-green-500');
                
                // Show error message
                let errorMsg = this.nextElementSibling;
                if (!errorMsg || !errorMsg.classList.contains('error-msg')) {
                    errorMsg = document.createElement('p');
                    errorMsg.className = 'error-msg text-red-500 text-sm mt-1';
                    errorMsg.textContent = 'Por favor, insira um email válido';
                    this.parentNode.insertBefore(errorMsg, this.nextSibling);
                }
            } else {
                this.classList.remove('border-red-500');
                this.classList.add('border-slate-700');
                
                // Remove error message
                const errorMsg = this.nextElementSibling;
                if (errorMsg && errorMsg.classList.contains('error-msg')) {
                    errorMsg.remove();
                }
            }
        });
    });

    // ============================================
    // CTA Button Handlers
    // ============================================
    const ctaButtons = document.querySelectorAll('button');
    ctaButtons.forEach(button => {
        if (button.textContent.includes('Começar')) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Get email from nearby input if exists
                const emailInput = this.parentElement.querySelector('input[type="email"]');
                const email = emailInput ? emailInput.value : '';
                
                if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                    showNotification('Bem-vindo ao MF Invest! Em breve você receberá um email.', 'success');
                    
                    // Simulate API call
                    console.log('Signup with email:', email);
                    
                    // Clear input
                    if (emailInput) emailInput.value = '';
                } else if (email) {
                    showNotification('Por favor, insira um email válido', 'error');
                } else {
                    showNotification('Cadastro em breve! Aguarde novidades.', 'info');
                }
            });
        }
    });

    // ============================================
    // Stats Counter Animation
    // ============================================
    const stats = document.querySelectorAll('.text-3xl.font-bold');
    
    const animateCounter = (element, target, suffix = '', isFloat = false) => {
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = (isFloat ? target.toFixed(1) : target) + suffix;
                clearInterval(timer);
            } else {
                element.textContent = (isFloat ? current.toFixed(1) : Math.floor(current)) + suffix;
            }
        }, 30);
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const text = entry.target.textContent;
                if (text.includes('k+')) {
                    animateCounter(entry.target, 10, 'k+');
                } else if (text.includes('★')) {
                    animateCounter(entry.target, 4.8, '★', true);
                } else if (text.includes('%')) {
                    animateCounter(entry.target, 100, '%');
                }
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => {
        if (stat.textContent.includes('k+') || stat.textContent.includes('★') || stat.textContent.includes('%')) {
            statsObserver.observe(stat);
        }
    });

    // ============================================
    // Keyboard Navigation
    // ============================================
    document.addEventListener('keydown', function(e) {
        // Escape key closes mobile menu
        if (e.key === 'Escape' && mobileMenu && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
            const icon = mobileMenuBtn.querySelector('i');
            icon.setAttribute('data-lucide', 'menu');
            lucide.createIcons();
        }
    });

    // ============================================
    // Notification System
    // ============================================
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = 'notification';
        
        const colors = {
            success: 'bg-green-500',
            error: 'bg-red-500',
            info: 'bg-blue-500',
            warning: 'bg-yellow-500'
        };
        
        notification.classList.add(colors[type] || colors.info);
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Trigger animation
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // ============================================
    // Loading State Handler
    // ============================================
    function addLoadingState(button) {
        const originalText = button.innerHTML;
        button.disabled = true;
        button.classList.add('loading');
        button.innerHTML = '<div class="spinner mx-auto"></div>';
        
        return () => {
            button.disabled = false;
            button.classList.remove('loading');
            button.innerHTML = originalText;
        };
    }

    // ============================================
    // Local Storage for User Preferences
    // ============================================
    const UserPreferences = {
        save: function(key, value) {
            try {
                localStorage.setItem(`mf-invest-${key}`, JSON.stringify(value));
            } catch (e) {
                console.warn('Could not save to localStorage:', e);
            }
        },
        
        load: function(key) {
            try {
                const item = localStorage.getItem(`mf-invest-${key}`);
                return item ? JSON.parse(item) : null;
            } catch (e) {
                console.warn('Could not load from localStorage:', e);
                return null;
            }
        },
        
        remove: function(key) {
            try {
                localStorage.removeItem(`mf-invest-${key}`);
            } catch (e) {
                console.warn('Could not remove from localStorage:', e);
            }
        }
    };

    // Load saved simulator values
    const savedSalary = UserPreferences.load('simulator-salary');
    const savedExpense = UserPreferences.load('simulator-expense');
    
    if (savedSalary && salarySlider) {
        salarySlider.value = savedSalary;
    }
    if (savedExpense && expenseSlider) {
        expenseSlider.value = savedExpense;
    }
    if ((savedSalary || savedExpense) && typeof updateSimulator === 'function') {
        updateSimulator();
    }

    // Save simulator values on change
    if (salarySlider) {
        salarySlider.addEventListener('change', function() {
            UserPreferences.save('simulator-salary', this.value);
        });
    }
    if (expenseSlider) {
        expenseSlider.addEventListener('change', function() {
            UserPreferences.save('simulator-expense', this.value);
        });
    }

    // ============================================
    // Console Welcome Message
    // ============================================
    console.log('%c🚀 MF Invest', 'color: #10b981; font-size: 24px; font-weight: bold;');
    console.log('%cEducação financeira gamificada para jovens brasileiros', 'color: #3b82f6; font-size: 14px;');
    console.log('%cInteressado em trabalhar conosco? Entre em contato!', 'color: #6b7280; font-size: 12px;');

    // ============================================
    // Initialize Lucide Icons
    // ============================================
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // ============================================
    // Performance Monitoring (Development)
    // ============================================
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('🔧 Development mode enabled');
        
        if ('PerformanceObserver' in window) {
            const perfObserver = new PerformanceObserver((items) => {
                items.getEntries().forEach((entry) => {
                    console.log('⚡ Performance:', entry.name, `${entry.duration.toFixed(2)}ms`);
                });
            });
            try {
                perfObserver.observe({ entryTypes: ['measure', 'navigation'] });
            } catch (e) {
                console.warn('Performance observer not supported');
            }
        }
    }
});

// ============================================
// Utility Functions (Global)
// ============================================
const Utils = {
    // Format currency
    formatCurrency: (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    },

    // Format percentage
    formatPercent: (value) => {
        return `${value.toFixed(1)}%`;
    },

    // Debounce function
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Check if element is in viewport
    isInViewport: (element) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    // Throttle function
    throttle: (func, limit) => {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Generate random ID
    generateId: () => {
        return '_' + Math.random().toString(36).substr(2, 9);
    },

    // Validate email
    validateEmail: (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }
};

// Export for use in other files if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Utils };
}