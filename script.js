// Notification System (moved to top)
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Check if mobile
    const isMobile = window.innerWidth <= 768;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        ${isMobile ? 'top: 10px; right: 10px; left: 10px;' : 'top: 20px; right: 20px;'}
        background: ${type === 'success' ? '#10b981' : '#6366f1'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        transform: ${isMobile ? 'translateY(-100px)' : 'translateX(400px)'};
        transition: transform 0.3s ease;
        max-width: ${isMobile ? 'none' : '350px'};
        font-size: ${isMobile ? '0.9rem' : '1rem'};
    `;
    
    // Add close button styles
    const closeBtn = notification.querySelector('.notification-close');
    if (closeBtn) {
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: white;
            margin-left: 1rem;
            cursor: pointer;
            padding: 0.25rem;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0.8;
            transition: opacity 0.3s ease;
        `;
        
        closeBtn.addEventListener('mouseenter', () => {
            closeBtn.style.opacity = '1';
            closeBtn.style.background = 'rgba(255, 255, 255, 0.2)';
        });
        
        closeBtn.addEventListener('mouseleave', () => {
            closeBtn.style.opacity = '0.8';
            closeBtn.style.background = 'none';
        });
    }
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = isMobile ? 'translateY(0)' : 'translateX(0)';
        notification.classList.add('show');
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = isMobile ? 'translateY(-100px)' : 'translateX(400px)';
        notification.classList.remove('show');
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Touch and Swipe Support
class TouchHandler {
    constructor() {
        this.startX = 0;
        this.startY = 0;
        this.endX = 0;
        this.endY = 0;
        this.minSwipeDistance = 50;
    }
    
    handleTouchStart(e) {
        this.startX = e.touches[0].clientX;
        this.startY = e.touches[0].clientY;
    }
    
    handleTouchEnd(e) {
        this.endX = e.changedTouches[0].clientX;
        this.endY = e.changedTouches[0].clientY;
        this.handleSwipe();
    }
    
    handleSwipe() {
        const deltaX = this.endX - this.startX;
        const deltaY = this.endY - this.startY;
        
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > this.minSwipeDistance) {
            if (deltaX > 0) {
                this.onSwipeRight();
            } else {
                this.onSwipeLeft();
            }
        }
    }
    
    onSwipeLeft() {
        // Override in specific implementations
    }
    
    onSwipeRight() {
        // Override in specific implementations
    }
}

// Mobile Navigation Handler
class MobileNavigation {
    constructor() {
        this.navToggle = document.querySelector('.nav-toggle');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-menu a');
        this.isOpen = false;
        
        this.init();
    }
    
    init() {
        if (this.navToggle && this.navMenu) {
            this.navToggle.addEventListener('click', () => this.toggle());
            
            // Close menu when clicking on links
            this.navLinks.forEach(link => {
                link.addEventListener('click', () => this.close());
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (this.isOpen && !this.navMenu.contains(e.target) && !this.navToggle.contains(e.target)) {
                    this.close();
                }
            });
            
            // Handle escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isOpen) {
                    this.close();
                }
            });
            
            // Handle window resize
            window.addEventListener('resize', () => {
                if (window.innerWidth > 768 && this.isOpen) {
                    this.close();
                }
            });
        }
    }
    
    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }
    
    open() {
        this.navMenu.classList.add('active');
        this.navToggle.classList.add('active');
        this.isOpen = true;
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
    
    close() {
        this.navMenu.classList.remove('active');
        this.navToggle.classList.remove('active');
        this.isOpen = false;
        document.body.style.overflow = ''; // Restore scrolling
    }
}

// Product Showcase Swiper for Mobile
class ProductShowcase extends TouchHandler {
    constructor() {
        super();
        this.showcase = document.querySelector('.product-showcase');
        this.items = document.querySelectorAll('.showcase-item');
        this.currentIndex = 0;
        this.isMobile = window.innerWidth <= 768;
        
        if (this.isMobile && this.showcase) {
            this.init();
        }
    }
    
    init() {
        this.createMobileLayout();
        this.addTouchListeners();
        this.addSwipeIndicators();
    }
    
    createMobileLayout() {
        this.showcase.style.display = 'flex';
        this.showcase.style.overflow = 'hidden';
        this.showcase.style.scrollSnapType = 'x mandatory';
        
        this.items.forEach((item, index) => {
            item.style.flex = '0 0 100%';
            item.style.scrollSnapAlign = 'start';
            item.style.transition = 'transform 0.3s ease';
        });
    }
    
    addTouchListeners() {
        this.showcase.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
        this.showcase.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });
    }
    
    addSwipeIndicators() {
        const indicators = document.createElement('div');
        indicators.className = 'swipe-indicator';
        
        this.items.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = `swipe-dot ${index === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => this.goToSlide(index));
            indicators.appendChild(dot);
        });
        
        this.showcase.appendChild(indicators);
    }
    
    onSwipeLeft() {
        this.nextSlide();
    }
    
    onSwipeRight() {
        this.prevSlide();
    }
    
    nextSlide() {
        if (this.currentIndex < this.items.length - 1) {
            this.currentIndex++;
            this.updateSlides();
        }
    }
    
    prevSlide() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateSlides();
        }
    }
    
    goToSlide(index) {
        this.currentIndex = index;
        this.updateSlides();
    }
    
    updateSlides() {
        const translateX = -this.currentIndex * 100;
        this.items.forEach(item => {
            item.style.transform = `translateX(${translateX}%)`;
        });
        
        // Update indicators
        const dots = document.querySelectorAll('.swipe-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    }
}

// Improved Cart functionality
class ShoppingCart {
    constructor() {
        this.items = [];
        this.count = 3; // Initial count
        this.cartBtn = document.querySelector('.cart-btn');
        this.cartCountElement = document.querySelector('.cart-count');
        
        this.init();
    }
    
    init() {
        if (this.cartBtn) {
            this.cartBtn.addEventListener('click', () => this.showCart());
        }
        
        // Add haptic feedback for mobile
        if ('vibrate' in navigator) {
            this.cartBtn?.addEventListener('click', () => {
                navigator.vibrate(50); // Short vibration
            });
        }
    }
    
    addItem(product) {
        this.items.push(product);
        this.count++;
        this.updateCartCount();
        this.animateCartIcon();
        
        // Haptic feedback
        if ('vibrate' in navigator) {
            navigator.vibrate([50, 50, 50]); // Success pattern
        }
    }
    
    updateCartCount() {
        if (this.cartCountElement) {
            this.cartCountElement.textContent = this.count;
        }
    }
    
    animateCartIcon() {
        if (this.cartCountElement) {
            this.cartCountElement.style.transform = 'scale(1.3)';
            setTimeout(() => {
                this.cartCountElement.style.transform = 'scale(1)';
            }, 200);
        }
    }
    
    showCart() {
        showNotification('Корзина открыта! Здесь будут ваши товары.', 'info');
    }
}

// Enhanced Product Filter with better mobile UX
class ProductFilter {
    constructor() {
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.productCards = document.querySelectorAll('.product-card');
        this.currentFilter = 'all';
        
        this.init();
    }
    
    init() {
        this.filterButtons.forEach(button => {
            button.addEventListener('click', (e) => this.handleFilter(e));
            
            // Add touch feedback
            button.addEventListener('touchstart', () => {
                button.style.transform = 'scale(0.98)';
            }, { passive: true });
            
            button.addEventListener('touchend', () => {
                setTimeout(() => {
                    button.style.transform = '';
                }, 100);
            }, { passive: true });
        });
    }
    
    handleFilter(e) {
        const button = e.target;
        const filterValue = button.getAttribute('data-filter');
        
        if (filterValue === this.currentFilter) return;
        
        this.currentFilter = filterValue;
        
        // Update active button
        this.filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Filter products with animation
        this.animateFilterChange(filterValue);
        
        // Show notification
        showNotification(`Показаны товары: ${button.textContent}`, 'info');
        
        // Haptic feedback
        if ('vibrate' in navigator) {
            navigator.vibrate(30);
        }
    }
    
    animateFilterChange(filterValue) {
        // Fade out all cards
        this.productCards.forEach(card => {
            card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            card.style.opacity = '0';
            card.style.transform = 'scale(0.95)';
        });
        
        setTimeout(() => {
            this.productCards.forEach(card => {
                const shouldShow = filterValue === 'all' || card.getAttribute('data-category') === filterValue;
                
                if (shouldShow) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.display = 'none';
                }
            });
        }, 300);
    }
}

// Enhanced Product Card interactions
class ProductInteractions {
    constructor() {
        this.addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
        this.quickViewButtons = document.querySelectorAll('.quick-view-btn');
        this.cart = new ShoppingCart();
        
        this.init();
    }
    
    init() {
        this.setupAddToCartButtons();
        this.setupQuickViewButtons();
        this.setupProductCards();
    }
    
    setupAddToCartButtons() {
        this.addToCartButtons.forEach(button => {
            button.addEventListener('click', (e) => this.handleAddToCart(e));
            
            // Touch feedback
            button.addEventListener('touchstart', () => {
                button.style.transform = 'scale(0.98)';
            }, { passive: true });
        });
    }
    
    setupQuickViewButtons() {
        this.quickViewButtons.forEach(button => {
            button.addEventListener('click', (e) => this.handleQuickView(e));
        });
    }
    
    setupProductCards() {
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => {
            // Add touch feedback for the entire card
            card.addEventListener('touchstart', () => {
                card.style.transition = 'transform 0.1s ease';
                card.style.transform = 'scale(0.98)';
            }, { passive: true });
            
            card.addEventListener('touchend', () => {
                setTimeout(() => {
                    card.style.transition = 'transform 0.3s ease';
                    card.style.transform = '';
                }, 100);
            }, { passive: true });
        });
    }
    
    handleAddToCart(e) {
        const button = e.target.closest('.add-to-cart-btn');
        const productCard = button.closest('.product-card');
        const productName = productCard.querySelector('h3').textContent;
        const productPrice = productCard.querySelector('.current-price').textContent;
        
        // Create product object
        const product = {
            name: productName,
            price: productPrice,
            id: Date.now() // Simple ID generation
        };
        
        // Animate button
        button.style.transform = 'scale(0.95)';
        button.innerHTML = '<i class="fas fa-check"></i> Добавлено!';
        button.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        
        // Add to cart
        this.cart.addItem(product);
        
        // Show notification
        showNotification(`${productName} добавлен в корзину за ${productPrice}`, 'success');
        
        // Reset button after 2 seconds
        setTimeout(() => {
            button.style.transform = '';
            button.innerHTML = '<i class="fas fa-shopping-cart"></i> В корзину';
            button.style.background = 'linear-gradient(135deg, #6366f1, #8b5cf6)';
        }, 2000);
    }
    
    handleQuickView(e) {
        e.stopPropagation();
        const productCard = e.target.closest('.product-card');
        const productName = productCard.querySelector('h3').textContent;
        const productImage = productCard.querySelector('.product-img').src;
        const productPrice = productCard.querySelector('.current-price').textContent;
        const productDescription = productCard.querySelector('.product-description')?.textContent || 'Описание товара';
        
        this.showProductModal(productName, productImage, productPrice, productDescription);
    }
    
    showProductModal(name, image, price, description) {
        const modal = document.createElement('div');
        modal.className = 'product-modal';
        modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <button class="modal-close">
                        <i class="fas fa-times"></i>
                    </button>
                    <div class="modal-image">
                        <img src="${image}" alt="${name}">
                    </div>
                    <div class="modal-info">
                        <h3>${name}</h3>
                        <p class="modal-description">${description}</p>
                        <div class="modal-price">${price}</div>
                        <button class="modal-add-to-cart btn btn-primary">
                            <i class="fas fa-shopping-cart"></i>
                            В корзину
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Add modal styles
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1rem;
        `;
        
        const overlay = modal.querySelector('.modal-overlay');
        overlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(5px);
        `;
        
        const content = modal.querySelector('.modal-content');
        const isMobile = window.innerWidth <= 768;
        content.style.cssText = `
            position: relative;
            background: white;
            border-radius: 20px;
            padding: 2rem;
            max-width: ${isMobile ? '90vw' : '500px'};
            max-height: 90vh;
            overflow-y: auto;
            transform: scale(0.8);
            transition: transform 0.3s ease;
            ${isMobile ? 'width: 100%;' : ''}
        `;
        
        // Style modal elements
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.style.cssText = `
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: #f1f5f9;
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
            z-index: 1;
        `;
        
        const modalImage = modal.querySelector('.modal-image img');
        modalImage.style.cssText = `
            width: 100%;
            height: 200px;
            object-fit: cover;
            border-radius: 15px;
            margin-bottom: 1rem;
        `;
        
        const modalPrice = modal.querySelector('.modal-price');
        modalPrice.style.cssText = `
            font-size: 1.5rem;
            font-weight: 700;
            color: #6366f1;
            margin: 1rem 0;
        `;
        
        document.body.appendChild(modal);
        
        // Animate in
        setTimeout(() => {
            content.style.transform = 'scale(1)';
        }, 100);
        
        // Event listeners
        closeBtn.addEventListener('click', () => this.closeModal(modal));
        overlay.addEventListener('click', () => this.closeModal(modal));
        
        const addToCartBtn = modal.querySelector('.modal-add-to-cart');
        addToCartBtn.addEventListener('click', () => {
            this.cart.addItem({ name, price, id: Date.now() });
            showNotification(`${name} добавлен в корзину за ${price}`, 'success');
            this.closeModal(modal);
        });
        
        // Prevent body scrolling
        document.body.style.overflow = 'hidden';
    }
    
    closeModal(modal) {
        const content = modal.querySelector('.modal-content');
        content.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            if (document.body.contains(modal)) {
                document.body.removeChild(modal);
                document.body.style.overflow = '';
            }
        }, 300);
    }
}

// Smooth scrolling with mobile optimization
class SmoothScroller {
    constructor() {
        this.init();
    }
    
    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => this.handleClick(e));
        });
    }
    
    handleClick(e) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        
        if (target) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = target.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            const mobileNav = window.mobileNav;
            if (mobileNav && mobileNav.isOpen) {
                mobileNav.close();
            }
        }
    }
}

// Enhanced header behavior
class HeaderController {
    constructor() {
        this.header = document.querySelector('.header');
        this.lastScrollY = window.scrollY;
        this.isScrollingDown = false;
        
        this.init();
    }
    
    init() {
        window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
    }
    
    handleScroll() {
        const currentScrollY = window.scrollY;
        this.isScrollingDown = currentScrollY > this.lastScrollY;
        
        // Update header background
        if (currentScrollY > 100) {
            this.header.style.background = 'rgba(255, 255, 255, 0.98)';
            this.header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
        } else {
            this.header.style.background = 'rgba(255, 255, 255, 0.95)';
            this.header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        }
        
        // Hide header on mobile when scrolling down
        if (window.innerWidth <= 768) {
            if (this.isScrollingDown && currentScrollY > 200) {
                this.header.style.transform = 'translateY(-100%)';
            } else {
                this.header.style.transform = 'translateY(0)';
            }
        }
        
        this.lastScrollY = currentScrollY;
    }
}

// Performance optimization for mobile
class PerformanceOptimizer {
    constructor() {
        this.init();
    }
    
    init() {
        this.optimizeImages();
        this.addIntersectionObserver();
        this.optimizeAnimations();
    }
    
    optimizeImages() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            // Add loading="lazy" for better performance
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
            
            // Add error handling
            img.addEventListener('error', () => {
                img.style.background = '#f1f5f9';
                img.style.display = 'flex';
                img.style.alignItems = 'center';
                img.style.justifyContent = 'center';
                img.style.color = '#64748b';
                img.alt = 'Изображение недоступно';
            });
        });
    }
    
    addIntersectionObserver() {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                    }
                });
            }, { threshold: 0.1 });
            
            // Observe elements for animation
            const animatableElements = document.querySelectorAll('.product-card, .bestseller-card, .feature');
            animatableElements.forEach(el => observer.observe(el));
        }
    }
    
    optimizeAnimations() {
        // Reduce animations on low-end devices
        if ('connection' in navigator && navigator.connection.effectiveType === '2g') {
            document.body.classList.add('reduce-animations');
        }
        
        // Respect user's motion preferences
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.body.classList.add('reduce-animations');
        }
    }
}

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM загружен, скрипт инициализирован');

    // Initialize all components
    window.mobileNav = new MobileNavigation();
    window.productShowcase = new ProductShowcase();
    window.productFilter = new ProductFilter();
    window.productInteractions = new ProductInteractions();
    window.smoothScroller = new SmoothScroller();
    window.headerController = new HeaderController();
    window.performanceOptimizer = new PerformanceOptimizer();

    // Hero buttons functionality
    const heroBtnPrimary = document.querySelector('.hero-buttons .btn-primary');
    const heroBtnSecondary = document.querySelector('.hero-buttons .btn-secondary');

    if (heroBtnPrimary) {
        heroBtnPrimary.addEventListener('click', () => {
            const catalogSection = document.querySelector('#catalog');
            if (catalogSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = catalogSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    }

    if (heroBtnSecondary) {
        heroBtnSecondary.addEventListener('click', () => {
            showNotification('🎉 Промокод DINO20 активирован! Скидка 20% применится при оформлении заказа.', 'success');
        });
    }

    // Contact form enhancement
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Animate submit button
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправляется...';
            submitBtn.disabled = true;
            
            // Simulate form submission
            setTimeout(() => {
                showNotification('Сообщение отправлено! Мы свяжемся с вами в ближайшее время.', 'success');
                contactForm.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }

    // Add resize handler for responsive adjustments
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Reinitialize components that need resize handling
            if (window.innerWidth <= 768 && !window.productShowcase) {
                window.productShowcase = new ProductShowcase();
            } else if (window.innerWidth > 768 && window.productShowcase) {
                // Reset showcase for desktop
                const showcase = document.querySelector('.product-showcase');
                if (showcase) {
                    showcase.style = '';
                    const items = showcase.querySelectorAll('.showcase-item');
                    items.forEach(item => {
                        item.style = '';
                    });
                }
            }
        }, 250);
    });

    // Add loading states for better UX
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            if (!this.classList.contains('loading')) {
                this.classList.add('loading');
                setTimeout(() => {
                    this.classList.remove('loading');
                }, 1000);
            }
        });
    });

    // Initialize service worker for better mobile performance (if available)
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch(() => {
            // Service worker registration failed, but that's okay
        });
    }

    console.log('Все компоненты инициализированы для мобильных устройств');
});

// Counter animation function (for stats)
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        element.textContent = Math.floor(start);
        
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        }
    }, 16);
}

// Utility function for debouncing
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

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        showNotification,
        TouchHandler,
        MobileNavigation,
        ProductShowcase,
        ShoppingCart,
        ProductFilter,
        ProductInteractions
    };
}