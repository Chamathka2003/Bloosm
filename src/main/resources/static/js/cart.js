// API Base URL
const API_BASE_URL = 'http://localhost:8080/api';

// Get current customer ID
function getCurrentCustomerId() {
    // Check if user is logged in
    const userStr = localStorage.getItem('user');
    if (userStr) {
        try {
            const user = JSON.parse(userStr);
            // For logged-in users, prefer the stored customerId from login
            const storedCustomerId = localStorage.getItem('customerId');
            if (storedCustomerId && storedCustomerId !== '1' && storedCustomerId !== 'null' && storedCustomerId !== 'undefined') {
                return storedCustomerId;
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
    // Add debugging logs to verify customer ID and API response
    console.log('Customer ID used for cart:', customerId);
    fetch(`${API_BASE_URL}/cart/${customerId}`)
        .then(response => {
            console.log('Cart API response status:', response.status);
            return response.json();
        })
        .then(cartItems => {
            console.log('Cart items fetched:', cartItems);
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
            console.error('Error updating cart count:', error);
            const cartCountElements = document.querySelectorAll('#cartCount');
            cartCountElements.forEach(el => el.textContent = '0');
        });
}

// Load cart items
function loadCart() {
    const customerId = getCurrentCustomerId();
    console.log('Loading cart for customer ID:', customerId);
    
    fetch(`${API_BASE_URL}/cart/${customerId}`)
        .then(response => {
            if (!response.ok) throw new Error('Failed to load cart');
            return response.json();
        })
        .then(cartItems => {
            console.log('Cart items loaded:', cartItems);
            if (cartItems.length === 0) {
                document.getElementById('cartContent').style.display = 'none';
                document.getElementById('emptyCart').style.display = 'block';
            } else {
                document.getElementById('cartContent').style.display = 'block';
                document.getElementById('emptyCart').style.display = 'none';
                displayCartItems(cartItems);
                calculateTotal(cartItems);
            }
        })
        .catch(error => {
            console.error('Error loading cart:', error);
            document.getElementById('cartContent').style.display = 'none';
            document.getElementById('emptyCart').style.display = 'block';
        });
}

// Display cart items
function displayCartItems(cartItems) {
    const container = document.getElementById('cartItems');
    
    container.innerHTML = cartItems.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">
                ${item.flower.imageUrl ? `<img src="${item.flower.imageUrl}" alt="${item.flower.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">` : '<span style="font-size: 3rem;">🌸</span>'}
            </div>
            <div class="cart-item-info">
                <h3>${item.flower.name}</h3>
                <p style="color: #666; margin: 5px 0;">${item.flower.category || 'Flower'}</p>
                <p class="cart-item-price">Rs. ${item.price.toFixed(2)} each</p>
                <p style="font-weight: bold; color: #7c104aff;">Subtotal: Rs. ${(item.price * item.quantity).toFixed(2)}</p>
            </div>
            <div class="cart-item-controls">
                <div class="quantity-control">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <input type="number" class="quantity-input" value="${item.quantity}" 
                           onchange="updateQuantity(${item.id}, this.value)" min="1">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">❌ Remove</button>
            </div>
        </div>
    `).join('');
}

// Calculate total
function calculateTotal(cartItems) {
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = cartItems.reduce((sum, item) => 
        sum + (item.price * item.quantity), 0);
    
    document.getElementById('totalItems').textContent = totalItems;
    document.getElementById('totalAmount').textContent = `Rs. ${totalAmount.toFixed(2)}`;
}

// Update quantity
function updateQuantity(cartItemId, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(cartItemId);
        return;
    }
    
    fetch(`${API_BASE_URL}/cart/${cartItemId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: parseInt(newQuantity) })
    })
    .then(response => response.json())
    .then(() => {
        loadCart();
        updateCartCount();
        showNotification('Cart updated!', 'success');
    })
    .catch(error => {
        console.error('Error updating quantity:', error);
        showNotification('Failed to update cart!', 'error');
    });
}

// Remove from cart
function removeFromCart(cartItemId) {
    if (!confirm('Remove this item?')) return;
    
    fetch(`${API_BASE_URL}/cart/${cartItemId}`, {
        method: 'DELETE'
    })
    .then(() => {
        loadCart();
        updateCartCount();
        showNotification('Item removed from cart!', 'success');
    })
    .catch(error => {
        console.error('Error removing item:', error);
        showNotification('Failed to remove item!', 'error');
    });
}

// Clear cart
function clearCart() {
    if (!confirm('Clear cart?')) return;
    
    const customerId = getCurrentCustomerId();
    
    fetch(`${API_BASE_URL}/cart/clear/${customerId}`, {
        method: 'DELETE'
    })
    .then(() => {
        loadCart();
        updateCartCount();
        showNotification('Cart cleared!', 'success');
    })
    .catch(error => {
        console.error('Error clearing cart:', error);
        showNotification('Failed to clear cart!', 'error');
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

// Checkout
function checkout() {
    const customerId = getCurrentCustomerId();
    
    // Load cart items to populate checkout summary
    fetch(`${API_BASE_URL}/cart/${customerId}`)
        .then(response => response.json())
        .then(cartItems => {
            if (cartItems.length === 0) {
                showNotification('Your cart is empty!', 'error');
                return;
            }
            
            // Calculate totals
            const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
            const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            
            // Update checkout modal totals
            document.getElementById('checkoutTotalItems').textContent = totalItems;
            document.getElementById('checkoutTotalAmount').textContent = `Rs. ${totalAmount.toFixed(2)}`;
            
            // Show the modal
            const modal = document.getElementById('checkoutModal');
            modal.style.display = 'block';
            
            // Load customer data if exists
            fetch(`${API_BASE_URL}/customers/${customerId}`)
                .then(response => response.json())
                .then(customer => {
                    document.getElementById('customerName').value = customer.name || '';
                    document.getElementById('customerEmail').value = customer.email || '';
                    document.getElementById('customerPhone').value = customer.phone || '';
                    document.getElementById('deliveryAddress').value = customer.address || '';
                })
                .catch(() => {
                    // Customer not found, leave fields empty for new customer
                    console.log('New customer - form will be empty');
                });
        })
        .catch(error => {
            console.error('Error loading cart:', error);
            showNotification('Failed to load cart items!', 'error');
        });
}

// Close checkout modal
function closeCheckoutModal() {
    document.getElementById('checkoutModal').style.display = 'none';
}

// Handle checkout form submission
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    loadCart();
    
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const customerId = getCurrentCustomerId();
            const name = document.getElementById('customerName').value.trim();
            const email = document.getElementById('customerEmail').value.trim();
            const phone = document.getElementById('customerPhone').value.trim();
            const address = document.getElementById('deliveryAddress').value.trim();
            const notes = document.getElementById('orderNotes').value.trim();
            
            // Validate fields
            if (!name || !email || !phone || !address) {
                showNotification('Please fill in all required fields!', 'error');
                return;
            }
            
            // Show loading state
            const submitBtn = e.target.querySelector('button[type=\"submit\"]');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Processing Order...';
            
            // First, create/update customer details
            fetch(`${API_BASE_URL}/customers`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: customerId,
                    name: name,
                    email: email,
                    phone: phone,
                    address: address
                })
            })
            .then(response => response.json())
            .then(customer => {
                // Store the customer ID
                localStorage.setItem('customerId', customer.id.toString());
                
                // Create order with customer information
                return fetch(`${API_BASE_URL}/orders`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        customerId: customer.id,
                        customerName: name,
                        customerEmail: email,
                        customerPhone: phone,
                        deliveryAddress: address,
                        notes: notes
                    })
                });
            })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => {
                        throw new Error(text || 'Order failed');
                    });
                }
                return response.json();
            })
            .then(() => {
                showNotification('🎉 Your order has been placed successfully!', 'success');
                closeCheckoutModal();
                setTimeout(() => {
                    window.location.href = 'orders.html';
                }, 1500);
            })
            .catch(error => {
                console.error('Error:', error);
                showNotification('Order placement failed! ' + error.message, 'error');
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            });
        });
    }
});

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('checkoutModal');
    if (event.target == modal) {
        closeCheckoutModal();
    }
}
