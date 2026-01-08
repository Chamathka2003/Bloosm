// API Base URL
const API_BASE_URL = 'http://localhost:8080/api';

// Get current customer ID from localStorage
function getCurrentCustomerId() {
    // First check if user is logged in
    const userStr = localStorage.getItem('user');
    if (userStr) {
        const user = JSON.parse(userStr);
        // Use user ID as customer ID for logged-in users
        const customerId = user.id.toString();
        localStorage.setItem('customerId', customerId);
        return customerId;
    }
    
    // For guest users
    let customerId = localStorage.getItem('customerId');
    if (!customerId) {
        customerId = '1'; // Default customer ID for demo
        localStorage.setItem('customerId', customerId);
    }
    return customerId;
}

// Update cart count in header
function updateCartCount() {
    const customerId = getCurrentCustomerId();
    fetch(`${API_BASE_URL}/cart/${customerId}`)
        .then(response => response.json())
        .then(cartItems => {
            const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
            const cartCountElements = document.querySelectorAll('#cartCount');
            cartCountElements.forEach(el => {
                el.textContent = totalItems;
                // Add pulse animation
                el.classList.add('updated');
                setTimeout(() => el.classList.remove('updated'), 300);
            });
        })
        .catch(error => console.error('Error updating cart count:', error));
}

// Load featured flowers on homepage
function loadFeaturedFlowers() {
    fetch(`${API_BASE_URL}/flowers/available`)
        .then(response => response.json())
        .then(flowers => {
            const featuredFlowers = flowers.slice(0, 6);
            displayFlowers(featuredFlowers, 'featuredFlowers');
        })
        .catch(error => console.error('Error loading flowers:', error));
}

// Display flowers in a container
function displayFlowers(flowers, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (flowers.length === 0) {
        container.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">මල් හමු නොවුණි</p>';
        return;
    }

    container.innerHTML = flowers.map(flower => `
        <div class="flower-card">
            <div class="flower-image">
                ${flower.imageUrl ? `<img src="${flower.imageUrl}" alt="${flower.name}" style="width: 100%; height: 100%; object-fit: cover;">` : '🌸'}
            </div>
            <div class="flower-info">
                <h3>${flower.name}</h3>
                <p>${flower.description || 'Beautiful flowers'}</p>
                <div class="flower-price">Rs. ${flower.price.toFixed(2)}</div>
                <div class="flower-details">
                    <span>Category: ${flower.category}</span>
                    <span class="${flower.stockQuantity > 0 ? 'stock' : 'out-of-stock'}">
                        ${flower.stockQuantity > 0 ? `Stock: ${flower.stockQuantity}` : 'Out of Stock'}
                    </span>
                </div>
                ${flower.stockQuantity > 0 ? `
                    <button class="btn btn-primary btn-block" onclick="addToCart(${flower.id}, '${flower.name}')">
                        Add to Cart
                    </button>
                ` : '<button class="btn btn-secondary btn-block" disabled>Out of Stock</button>'}
            </div>
        </div>
    `).join('');
}

// Add item to cart
function addToCart(flowerId, flowerName) {
    const customerId = getCurrentCustomerId();
    
    fetch(`${API_BASE_URL}/cart`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            customerId: customerId,
            flowerId: flowerId,
            quantity: 1
        })
    })
    .then(response => {
        if (!response.ok) throw new Error('Failed to add to cart');
        return response.json();
    })
    .then((data) => {
        // For guest users, KEEP customer ID as 1
        const currentId = getCurrentCustomerId();
        if (currentId === '1') {
            // Don't change customer ID for guest users
            console.log('Guest user - keeping customer ID as 1');
        } else {
            // For logged-in users, update if needed
            if (data.cartItem && data.cartItem.customer && data.cartItem.customer.id) {
                localStorage.setItem('customerId', data.cartItem.customer.id.toString());
            } else if (data.customerId) {
                localStorage.setItem('customerId', data.customerId.toString());
            }
        }
        
        // Update cart count immediately
        updateCartCount();
        // Show success notification
        showNotification(`${flowerName} added to cart!`, 'success');
    })
    .catch(error => {
        console.error('Error adding to cart:', error);
        showNotification('Failed to add to cart!', 'error');
    });
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: ${type === 'success' ? '#ff0080' : '#dc3545'};
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        font-weight: 500;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 2500);
}

// Filter by category
function filterByCategory(category) {
    window.location.href = `flowers.html?category=${category}`;
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    
    if (document.getElementById('featuredFlowers')) {
        loadFeaturedFlowers();
    }
});
