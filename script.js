// Notification System (moved to top)
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#6366f1'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM загружен, скрипт инициализирован');

// Mobile Navigation Toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
}

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu if open
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });
});

// Header Background on Scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
});

// Cart functionality
let cartCount = 3; // Начальное количество товаров в корзине
const cartBtn = document.querySelector('.cart-btn');
const cartCountElement = document.querySelector('.cart-count');

// Cart button click handler
if (cartBtn) {
    cartBtn.addEventListener('click', () => {
        showNotification('Корзина открыта! Здесь будут ваши товары.', 'info');
    });
}

// Hero buttons functionality
const heroBtnPrimary = document.querySelector('.hero-buttons .btn-primary');
const heroBtnSecondary = document.querySelector('.hero-buttons .btn-secondary');

if (heroBtnPrimary) {
    heroBtnPrimary.addEventListener('click', () => {
        const catalogSection = document.querySelector('#catalog');
        if (catalogSection) {
            catalogSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
}

if (heroBtnSecondary) {
    heroBtnSecondary.addEventListener('click', () => {
        showNotification('🎉 Промокод DINO20 активирован! Скидка 20% применится при оформлении заказа.', 'success');
    });
}

// Catalog Filter functionality
const filterButtons = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        
        const filterValue = button.getAttribute('data-filter');
        
        productCards.forEach(card => {
            if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                card.style.display = 'block';
                card.style.transform = 'scale(0.8)';
                card.style.opacity = '0';
                
                setTimeout(() => {
                    card.style.transform = 'scale(1)';
                    card.style.opacity = '1';
                }, 100);
            } else {
                card.style.transform = 'scale(0.8)';
                card.style.opacity = '0';
                
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
        
        showNotification(`Показаны товары: ${button.textContent}`, 'info');
    });
});

// Add to cart functionality
const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
addToCartButtons.forEach(button => {
    button.addEventListener('click', function() {
        const productCard = this.closest('.product-card');
        const productName = productCard.querySelector('h3').textContent;
        const productPrice = productCard.querySelector('.current-price').textContent;
        
        // Animate button
        this.style.transform = 'scale(0.95)';
        this.innerHTML = '<i class="fas fa-check"></i> Добавлено!';
        this.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        
        // Update cart count
        cartCount++;
        cartCountElement.textContent = cartCount;
        cartCountElement.style.transform = 'scale(1.3)';
        
        setTimeout(() => {
            cartCountElement.style.transform = 'scale(1)';
        }, 200);
        
        // Show notification
        showNotification(`${productName} добавлен в корзину за ${productPrice}`, 'success');
        
        // Reset button after 2 seconds
        setTimeout(() => {
            this.style.transform = 'scale(1)';
            this.innerHTML = '<i class="fas fa-shopping-cart"></i> В корзину';
            this.style.background = 'linear-gradient(135deg, #6366f1, #8b5cf6)';
        }, 2000);
    });
});

// Quick view functionality
const quickViewButtons = document.querySelectorAll('.quick-view-btn');
quickViewButtons.forEach(button => {
    button.addEventListener('click', function() {
        const productCard = this.closest('.product-card');
        const productName = productCard.querySelector('h3').textContent;
        const productImage = productCard.querySelector('.product-img').src;
        const productPrice = productCard.querySelector('.current-price').textContent;
        const productDescription = productCard.querySelector('.product-description').textContent;
        
        showProductModal(productName, productImage, productPrice, productDescription);
    });
});

// Product modal functionality
function showProductModal(name, image, price, description) {
    // Create modal HTML
    const modal = document.createElement('div');
    modal.className = 'product-modal';
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <button class="modal-close">&times;</button>
                <div class="modal-product">
                    <div class="modal-image">
                        <img src="${image}" alt="${name}">
                    </div>
                    <div class="modal-info">
                        <h2>${name}</h2>
                        <p class="modal-description">${description}</p>
                        <div class="modal-price">${price}</div>
                        <div class="modal-actions">
                            <button class="btn btn-primary modal-add-to-cart">
                                <i class="fas fa-shopping-cart"></i> В корзину
                            </button>
                            <button class="btn btn-secondary modal-buy-now">
                                Купить сейчас
                            </button>
                        </div>
                    </div>
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
    `;
    
    document.body.appendChild(modal);
    
    // Modal event listeners
    const modalClose = modal.querySelector('.modal-close');
    const modalOverlay = modal.querySelector('.modal-overlay');
    const modalAddToCart = modal.querySelector('.modal-add-to-cart');
    const modalBuyNow = modal.querySelector('.modal-buy-now');
    
    modalClose.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            document.body.removeChild(modal);
        }
    });
    
    modalAddToCart.addEventListener('click', () => {
        cartCount++;
        cartCountElement.textContent = cartCount;
        showNotification(`${name} добавлен в корзину за ${price}`, 'success');
        document.body.removeChild(modal);
    });
    
    modalBuyNow.addEventListener('click', () => {
        showNotification(`Переход к оформлению заказа: ${name}`, 'info');
        document.body.removeChild(modal);
    });
}

// Bestsellers "Купить сейчас" buttons
const buyNowButtons = document.querySelectorAll('.bestsellers .btn-primary');
buyNowButtons.forEach(button => {
    button.addEventListener('click', function() {
        const bestsellerCard = this.closest('.bestseller-card');
        const productName = bestsellerCard.querySelector('h3').textContent;
        const productPrice = bestsellerCard.querySelector('.price').textContent;
        
        showNotification(`Оформляем заказ: ${productName} за ${productPrice}`, 'success');
        
        // Animate button
        this.style.transform = 'scale(0.95)';
        this.textContent = 'Оформляем...';
        
        setTimeout(() => {
            this.style.transform = 'scale(1)';
            this.textContent = 'Купить сейчас';
        }, 1500);
    });
});

// Special offer button
const specialOfferBtn = document.querySelector('.special-offer .btn-secondary');
if (specialOfferBtn) {
    specialOfferBtn.addEventListener('click', () => {
        showNotification('🎁 Промокод NEWDINO25 активирован! Скидка 25% для новых покупателей.', 'success');
    });
}

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.product-card, .bestseller-card, .feature, .contact-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});

// Counter Animation
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target + (element.textContent.includes('+') ? '+' : '');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start) + (element.textContent.includes('+') ? '+' : '');
        }
    }, 16);
}

// Animate counters when they come into view
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumber = entry.target.querySelector('.stat-number');
            const text = statNumber.textContent;
            const number = parseInt(text.replace(/\D/g, ''));
            
            if (number && !statNumber.classList.contains('animated')) {
                statNumber.classList.add('animated');
                statNumber.textContent = '0' + (text.includes('+') ? '+' : text.includes('%') ? '%' : '');
                animateCounter(statNumber, number);
            }
        }
    });
}, observerOptions);

document.querySelectorAll('.stat-item').forEach(stat => {
    counterObserver.observe(stat);
});

// Contact Form Handling
const contactForm = document.querySelector('.contact-form');
contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });
    
    // Show loading state
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Отправляем...';
    submitBtn.disabled = true;
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        // Reset form
        this.reset();
        
        // Show success message
        submitBtn.textContent = 'Сообщение отправлено!';
        submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        
        // Reset button after 3 seconds
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.style.background = 'linear-gradient(135deg, #6366f1, #8b5cf6)';
            submitBtn.disabled = false;
        }, 3000);
        
        // Show success notification
        showNotification('Спасибо! Мы свяжемся с вами в течение часа.', 'success');
    }, 2000);
});



// Parallax Effect for Hero Section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const productShowcase = document.querySelector('.product-showcase');
    
    if (hero && productShowcase) {
        productShowcase.style.transform = `translateY(${scrolled * 0.1}px)`;
    }
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Animate hero elements
    const heroElements = document.querySelectorAll('.hero-text > *');
    heroElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.animation = `fadeInUp 0.8s ease forwards ${index * 0.2}s`;
    });
});

// Add CSS animations and modal styles
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .nav-menu.active {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        padding: 1rem;
        border-radius: 0 0 10px 10px;
    }
    
    .nav-toggle.active span:nth-child(1) {
        transform: rotate(-45deg) translate(-5px, 6px);
    }
    
    .nav-toggle.active span:nth-child(2) {
        opacity: 0;
    }
    
    .nav-toggle.active span:nth-child(3) {
        transform: rotate(45deg) translate(-5px, -6px);
    }
    
    .product-modal .modal-overlay {
        background: rgba(0, 0, 0, 0.8);
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
    }
    
    .product-modal .modal-content {
        background: white;
        border-radius: 20px;
        max-width: 800px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
        position: relative;
        animation: modalSlideIn 0.3s ease;
    }
    
    @keyframes modalSlideIn {
        from {
            opacity: 0;
            transform: scale(0.9) translateY(-50px);
        }
        to {
            opacity: 1;
            transform: scale(1) translateY(0);
        }
    }
    
    .product-modal .modal-close {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: none;
        border: none;
        font-size: 2rem;
        cursor: pointer;
        color: #666;
        z-index: 1;
    }
    
    .product-modal .modal-close:hover {
        color: #333;
    }
    
    .product-modal .modal-product {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
        padding: 2rem;
    }
    
    .product-modal .modal-image img {
        width: 100%;
        height: 300px;
        object-fit: cover;
        border-radius: 10px;
    }
    
    .product-modal .modal-info h2 {
        font-size: 1.8rem;
        margin-bottom: 1rem;
        color: #333;
    }
    
    .product-modal .modal-description {
        color: #666;
        margin-bottom: 1rem;
        line-height: 1.6;
    }
    
    .product-modal .modal-price {
        font-size: 1.5rem;
        font-weight: 700;
        color: #6366f1;
        margin-bottom: 1.5rem;
    }
    
    .product-modal .modal-actions {
        display: flex;
        gap: 1rem;
    }
    
    .product-modal .modal-actions .btn {
        flex: 1;
        text-align: center;
    }
    
    @media (max-width: 768px) {
        .nav-menu {
            display: none;
        }
        
        .nav-menu.active {
            display: flex;
        }
        
        .product-modal .modal-product {
            grid-template-columns: 1fr;
            gap: 1rem;
        }
        
        .product-modal .modal-actions {
            flex-direction: column;
        }
    }
`;
document.head.appendChild(style);

// Product cards hover effect
document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Bestseller cards hover effect
document.querySelectorAll('.bestseller-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Lazy loading for better performance
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Footer social links
document.querySelectorAll('.social-links a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const platform = this.querySelector('i').className.split(' ')[1].replace('fa-', '');
        showNotification(`Переход на ${platform.charAt(0).toUpperCase() + platform.slice(1)}`, 'info');
    });
});

// Footer navigation links
document.querySelectorAll('.footer-column a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        showNotification(`Переход на страницу: ${this.textContent}`, 'info');
    });
});

}); // End of DOMContentLoaded