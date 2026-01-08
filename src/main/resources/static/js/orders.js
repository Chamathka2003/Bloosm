// API Base URL
const API_BASE_URL = 'http://localhost:8080/api';

// Get current customer ID
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
        customerId = '1';
        localStorage.setItem('customerId', customerId);
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
            cartCountElements.forEach(el => el.textContent = totalItems);
        })
        .catch(error => {
            console.error('Error updating cart count:', error);
            const cartCountElements = document.querySelectorAll('#cartCount');
            cartCountElements.forEach(el => el.textContent = '0');
        });
}

// Load orders
function loadOrders() {
    const customerId = getCurrentCustomerId();
    
    fetch(`${API_BASE_URL}/orders/customer/${customerId}`)
        .then(response => response.json())
        .then(orders => {
            if (orders.length === 0) {
                document.getElementById('ordersContent').style.display = 'none';
                document.getElementById('emptyOrders').style.display = 'block';
            } else {
                displayOrders(orders);
            }
        })
        .catch(error => console.error('Error loading orders:', error));
}

// Display orders
function displayOrders(orders) {
    const container = document.getElementById('ordersList');
    
    // Sort orders by date (newest first)
    orders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
    
    container.innerHTML = orders.map(order => `
        <div class="order-card">
            <div class="order-header">
                <div>
                    <div class="order-id">ඇණවුම් #${order.id}</div>
                    <div style="color: #666; font-size: 0.9rem;">
                        ${new Date(order.orderDate).toLocaleDateString('si-LK', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </div>
                </div>
                <span class="order-status status-${order.status.toLowerCase()}">
                    ${getStatusText(order.status)}
                </span>
            </div>
            
            ${order.customer ? `
                <div class="customer-details">
                    <h4>පාරිභෝගික විස්තර</h4>
                    <p><strong>නම:</strong> ${order.customer.name}</p>
                    <p><strong>ඊමේල්:</strong> ${order.customer.email}</p>
                    ${order.customer.phone ? `<p><strong>දුරකථනය:</strong> ${order.customer.phone}</p>` : ''}
                    <p><strong>ලිපිනය:</strong> ${order.deliveryAddress}</p>
                </div>
            ` : ''}
            
            <div class="order-items">
                <h4 style="color: #ff1493; margin-bottom: 0.8rem; font-size: 1.1rem;">අයිතම විස්තර</h4>
                ${order.orderItems.map(item => `
                    <div class="order-item">
                        <div>
                            <strong>${item.flower.name}</strong>
                            <span style="color: #666;"> x ${item.quantity}</span>
                        </div>
                        <span>Rs. ${item.subtotal.toFixed(2)}</span>
                    </div>
                `).join('')}
            </div>
            
            ${order.notes ? `
                <div style="margin-top: 1rem; padding: 10px; background: #f8f9fa; border-radius: 4px;">
                    <strong>විශේෂ සටහන්:</strong><br>
                    ${order.notes}
                </div>
            ` : ''}
            
            ${order.deliveryDate ? `
                <div style="margin-top: 0.5rem; color: #28a745;">
                    <strong>✓ භාර දුන් දිනය:</strong> ${new Date(order.deliveryDate).toLocaleDateString('si-LK')}
                </div>
            ` : ''}
            
            <div class="order-total">
                Total Amount: Rs. ${order.totalAmount.toFixed(2)}
            </div>
        </div>
    `).join('');
}

// Get status text in English
function getStatusText(status) {
    const statusMap = {
        'PENDING': 'Pending',
        'CONFIRMED': 'Confirmed',
        'DELIVERED': 'Delivered',
        'CANCELLED': 'Cancelled'
    };
    return statusMap[status] || status;
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    loadOrders();
});
