// API Base URL
const API_BASE_URL = 'http://localhost:8080/api';

// Get current customer ID
function getCurrentCustomerId() {
    // Check if user is logged in
    const userStr = localStorage.getItem('user');
    if (userStr) {
        try {
            const user = JSON.parse(userStr);
            // For logged-in users, use the stored customerId from login
            // This is the actual customer ID from the database, not the user ID
            const customerId = localStorage.getItem('customerId');
            if (customerId && customerId !== '1' && customerId !== 'null' && customerId !== 'undefined') {
                return customerId;
            }
            // Fallback to user ID if customerId not set
            return user.id.toString();
        } catch (e) {
            console.error('Error parsing user data:', e);
        }
    }
    
    // Guest user: use ID 1
    let customerId = localStorage.getItem('customerId');
    if (!customerId || customerId === 'null' || customerId === 'undefined') {
        customerId = '1';
        localStorage.setItem('customerId', '1');
    }
    return customerId;
}

// Update cart count
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
        .catch(error => {
            console.error('Error:', error);
            const cartCountElements = document.querySelectorAll('#cartCount');
            cartCountElements.forEach(el => el.textContent = '0');
        });
}

// Load all flowers
function loadFlowers(category = '', searchTerm = '') {
    let url = `${API_BASE_URL}/flowers/available`;
    
    if (category) {
        url = `${API_BASE_URL}/flowers/category/${category}`;
    } else if (searchTerm) {
        url = `${API_BASE_URL}/flowers/search?keyword=${searchTerm}`;
    }
    
    fetch(url)
        .then(response => response.json())
        .then(flowers => displayFlowers(flowers))
        .catch(error => console.error('Error loading flowers:', error));
}

// Display flowers
function displayFlowers(flowers) {
    const container = document.getElementById('flowersGrid');
    
    if (flowers.length === 0) {
        container.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">No flowers found</p>';
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
                ${flower.color ? `<p style="margin-top: 0.5rem;">Color: ${flower.color}</p>` : ''}
                ${flower.stockQuantity > 0 ? `
                    <button class="btn btn-primary btn-block" onclick="addToCart(${flower.id}, '${flower.name}')">
                        Add to Cart
                    </button>
                ` : '<button class="btn btn-secondary btn-block" disabled>Out of Stock</button>'}
            </div>
        </div>
    `).join('');
}

// Add to cart
function addToCart(flowerId, flowerName) {
    const customerId = getCurrentCustomerId();
    console.log('🛒 ADD TO CART - Customer ID:', customerId, 'Flower ID:', flowerId);
    
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
        if (!response.ok) throw new Error('Failed');
        return response.json();
    })
    .then((data) => {
        console.log('✅ ADD TO CART RESPONSE:', data);
        // Update cart count immediately
        updateCartCount();
        // Show success notification
        showNotification(`${flowerName} added to cart!`, 'success');
    })
    .catch(error => {
        console.error('❌ ADD TO CART ERROR:', error);
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

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    
    // Check for category filter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    
    if (category) {
        document.getElementById('categoryFilter').value = category;
        loadFlowers(category);
    } else {
        loadFlowers();
    }
    
    // Search functionality
    document.getElementById('searchInput').addEventListener('input', (e) => {
        const searchTerm = e.target.value;
        if (searchTerm.length >= 2) {
            loadFlowers('', searchTerm);
        } else if (searchTerm.length === 0) {
            loadFlowers();
        }
    });
    
    // Category filter
    document.getElementById('categoryFilter').addEventListener('change', (e) => {
        loadFlowers(e.target.value);
    });
});
