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

// Load customer data
function loadCustomerData() {
    const customerId = getCurrentCustomerId();
    
    fetch(`${API_BASE_URL}/customers/${customerId}`)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Customer not found');
        })
        .then(customer => {
            document.getElementById('customerName').value = customer.name || '';
            document.getElementById('customerEmail').value = customer.email || '';
            document.getElementById('customerPhone').value = customer.phone || '';
            document.getElementById('customerAddress').value = customer.address || '';
        })
        .catch(error => {
            console.log('No customer data found');
        });
}

// Load order statistics
function loadOrderStats() {
    const customerId = getCurrentCustomerId();
    
    fetch(`${API_BASE_URL}/orders/customer/${customerId}`)
        .then(response => response.json())
        .then(orders => {
            const totalOrders = orders.length;
            const pendingOrders = orders.filter(o => o.status === 'PENDING').length;
            const completedOrders = orders.filter(o => o.status === 'DELIVERED').length;
            
            document.getElementById('totalOrders').textContent = totalOrders;
            document.getElementById('pendingOrders').textContent = pendingOrders;
            document.getElementById('completedOrders').textContent = completedOrders;
        })
        .catch(error => console.error('Error loading stats:', error));
}

// Handle form submission
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    loadCustomerData();
    loadOrderStats();
    
    document.getElementById('customerForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const customerId = getCurrentCustomerId();
        const customerData = {
            name: document.getElementById('customerName').value,
            email: document.getElementById('customerEmail').value,
            phone: document.getElementById('customerPhone').value,
            address: document.getElementById('customerAddress').value
        };
        
        // Check if customer exists
        fetch(`${API_BASE_URL}/customers/${customerId}`)
            .then(response => {
                if (response.ok) {
                    // Customer exists, update
                    return fetch(`${API_BASE_URL}/customers/${customerId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(customerData)
                    });
                } else {
                    // Create new customer
                    return fetch(`${API_BASE_URL}/customers`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(customerData)
                    }).then(response => response.json())
                      .then(customer => {
                          localStorage.setItem('customerId', customer.id);
                          return { ok: true };
                      });
                }
            })
            .then(response => {
                if (response.ok) {
                    alert('Information saved successfully!');
                } else {
                    throw new Error('Failed to save');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Failed to save information!');
            });
    });
});
