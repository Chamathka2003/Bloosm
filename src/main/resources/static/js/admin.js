const API_URL = 'http://localhost:8080/api';
let currentUser = null;
let editingProductId = null;

// Check if user is logged in and is admin
window.addEventListener('DOMContentLoaded', () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
        window.location.href = 'login.html';
        return;
    }
    
    currentUser = JSON.parse(userStr);
    
    if (currentUser.role !== 'ADMIN') {
        alert('Access denied. Admin only.');
        window.location.href = 'index.html';
        return;
    }
    
    document.getElementById('adminUsername').textContent = `Welcome, ${currentUser.username}`;
    loadProducts();
});

function logout() {
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

async function loadProducts() {
    try {
        const response = await fetch(`${API_URL}/flowers`);
        const products = await response.json();
        
        const tbody = document.getElementById('productsTableBody');
        tbody.innerHTML = '';
        
        products.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><img src="${product.imageUrl || 'images/placeholder.jpg'}" alt="${product.name}" class="product-image"></td>
                <td>${product.name}</td>
                <td>${product.category || 'N/A'}</td>
                <td>${product.color || 'N/A'}</td>
                <td>$${product.price}</td>
                <td>${product.stockQuantity}</td>
                <td>${product.available ? '✓ Yes' : '✗ No'}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-warning" onclick="editProduct(${product.id})">Edit</button>
                        <button class="btn btn-danger" onclick="deleteProduct(${product.id})">Delete</button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading products:', error);
        alert('Failed to load products');
    }
}

function openAddModal() {
    editingProductId = null;
    document.getElementById('modalTitle').textContent = 'Add New Flower';
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
    document.getElementById('imageUrl').value = '';
    document.getElementById('available').checked = true;
    document.getElementById('imagePreview').style.display = 'none';
    document.getElementById('productModal').style.display = 'block';
}

async function editProduct(id) {
    try {
        const response = await fetch(`${API_URL}/flowers/${id}`);
        const product = await response.json();
        
        editingProductId = id;
        document.getElementById('modalTitle').textContent = 'Edit Flower';
        document.getElementById('productId').value = product.id;
        document.getElementById('name').value = product.name;
        document.getElementById('category').value = product.category || '';
        document.getElementById('color').value = product.color || '';
        document.getElementById('price').value = product.price;
        document.getElementById('stockQuantity').value = product.stockQuantity;
        document.getElementById('imageUrl').value = product.imageUrl || '';
        document.getElementById('description').value = product.description || '';
        document.getElementById('available').checked = product.available;
        
        // Show current image preview if exists
        if (product.imageUrl) {
            document.getElementById('previewImg').src = product.imageUrl;
            document.getElementById('imagePreview').style.display = 'block';
        } else {
            document.getElementById('imagePreview').style.display = 'none';
        }
        
        document.getElementById('productModal').style.display = 'block';
    } catch (error) {
        console.error('Error loading product:', error);
        alert('Failed to load product details');
    }
}

async function deleteProduct(id) {
    if (!confirm('Are you sure you want to delete this flower?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/flowers/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            alert('Flower deleted successfully');
            loadProducts();
        } else {
            alert('Failed to delete flower');
        }
    } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete flower');
    }
}

function closeModal() {
    document.getElementById('productModal').style.display = 'none';
}

document.getElementById('productForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Check if there's a file to upload
    const imageFile = document.getElementById('imageFile').files[0];
    let imageUrl = document.getElementById('imageUrl').value;
    
    // Upload image if a new file is selected
    if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        
        try {
            const uploadResponse = await fetch('http://localhost:8080/api/upload/image', {
                method: 'POST',
                body: formData
            });
            
            if (uploadResponse.ok) {
                const uploadData = await uploadResponse.json();
                imageUrl = uploadData.imageUrl;
            } else {
                alert('Failed to upload image');
                return;
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to upload image');
            return;
        }
    }
    
    const productData = {
        name: document.getElementById('name').value,
        category: document.getElementById('category').value,
        color: document.getElementById('color').value,
        price: parseFloat(document.getElementById('price').value),
        stockQuantity: parseInt(document.getElementById('stockQuantity').value),
        imageUrl: imageUrl,
        description: document.getElementById('description').value,
        available: document.getElementById('available').checked
    };
    
    try {
        let response;
        if (editingProductId) {
            // Update existing product
            response = await fetch(`${API_URL}/flowers/${editingProductId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productData)
            });
        } else {
            // Create new product
            response = await fetch(`${API_URL}/flowers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productData)
            });
        }
        
        if (response.ok) {
            alert(editingProductId ? 'Flower updated successfully' : 'Flower added successfully');
            closeModal();
            loadProducts();
        } else {
            alert('Failed to save flower');
        }
    } catch (error) {
        console.error('Error saving product:', error);
        alert('Failed to save flower');
    }
});

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('productModal');
    if (event.target == modal) {
        closeModal();
    }
}

// Preview image when file is selected
document.getElementById('imageFile').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            document.getElementById('previewImg').src = event.target.result;
            document.getElementById('imagePreview').style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});

// ========== ORDER MANAGEMENT FUNCTIONS ==========

let allOrders = [];

// Switch between tabs
function switchTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    if (tabName === 'products') {
        document.getElementById('productsTab').classList.add('active');
        document.querySelector('button[onclick="switchTab(\'products\')"]').classList.add('active');
    } else if (tabName === 'orders') {
        document.getElementById('ordersTab').classList.add('active');
        document.querySelector('button[onclick="switchTab(\'orders\')"]').classList.add('active');
        loadOrders(); // Load orders when tab is opened
    }
}

// Load all orders
async function loadOrders() {
    try {
        const response = await fetch(`${API_URL}/orders`);
        allOrders = await response.json();
        
        displayOrders(allOrders);
    } catch (error) {
        console.error('Error loading orders:', error);
        alert('Failed to load orders');
    }
}

// Display orders in table
function displayOrders(orders) {
    const tbody = document.getElementById('ordersTableBody');
    tbody.innerHTML = '';
    
    if (orders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px;">No orders found</td></tr>';
        return;
    }
    
    orders.forEach(order => {
        const row = document.createElement('tr');
        const totalItems = order.orderItems ? order.orderItems.length : 0;
        const customerName = order.customer ? order.customer.name : 'Guest';
        const orderDate = new Date(order.orderDate).toLocaleDateString();
        
        row.innerHTML = `
            <td>#${order.id}</td>
            <td>${customerName}</td>
            <td>${totalItems} item(s)</td>
            <td>$${order.totalAmount.toFixed(2)}</td>
            <td><span class="status-badge status-${order.status.toLowerCase()}">${order.status}</span></td>
            <td>${orderDate}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-primary" onclick="viewOrderDetails(${order.id})">View Details</button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Filter orders by status
function filterOrders() {
    const statusFilter = document.getElementById('statusFilter').value;
    
    if (statusFilter === '') {
        displayOrders(allOrders);
    } else {
        const filtered = allOrders.filter(order => order.status === statusFilter);
        displayOrders(filtered);
    }
}

// View order details
async function viewOrderDetails(orderId) {
    try {
        const response = await fetch(`${API_URL}/orders/${orderId}`);
        const order = await response.json();
        
        const orderDate = new Date(order.orderDate).toLocaleString();
        const customerName = order.customer ? order.customer.name : 'Guest';
        const customerEmail = order.customer ? order.customer.email : 'N/A';
        
        let orderItemsHtml = '';
        if (order.orderItems && order.orderItems.length > 0) {
            orderItemsHtml = order.orderItems.map(item => `
                <div class="order-item">
                    <div>
                        <strong>${item.flower ? item.flower.name : 'Unknown'}</strong><br>
                        <small>Quantity: ${item.quantity}</small>
                    </div>
                    <div style="text-align: right;">
                        <strong>$${item.price.toFixed(2)}</strong><br>
                        <small>Subtotal: $${(item.price * item.quantity).toFixed(2)}</small>
                    </div>
                </div>
            `).join('');
        } else {
            orderItemsHtml = '<p>No items in this order</p>';
        }
        
        const detailsContent = `
            <div class="order-info">
                <div class="order-info-row">
                    <strong>Order ID:</strong>
                    <span>#${order.id}</span>
                </div>
                <div class="order-info-row">
                    <strong>Customer Name:</strong>
                    <span>${customerName}</span>
                </div>
                <div class="order-info-row">
                    <strong>Customer Email:</strong>
                    <span>${customerEmail}</span>
                </div>
                <div class="order-info-row">
                    <strong>Order Date:</strong>
                    <span>${orderDate}</span>
                </div>
                <div class="order-info-row">
                    <strong>Status:</strong>
                    <span class="status-badge status-${order.status.toLowerCase()}">${order.status}</span>
                </div>
                <div class="order-info-row">
                    <strong>Total Amount:</strong>
                    <span style="font-size: 18px; color: #667eea;"><strong>$${order.totalAmount.toFixed(2)}</strong></span>
                </div>
            </div>
            
            <h4>Order Items:</h4>
            <div class="order-items-list">
                ${orderItemsHtml}
            </div>
            
            <div class="status-update-form">
                <h4>Update Order Status:</h4>
                <select id="updateStatus" style="padding: 8px; border-radius: 5px; border: 1px solid #ddd; margin-right: 10px;">
                    <option value="PENDING" ${order.status === 'PENDING' ? 'selected' : ''}>Pending</option>
                    <option value="CONFIRMED" ${order.status === 'CONFIRMED' ? 'selected' : ''}>Confirmed</option>
                    <option value="DELIVERED" ${order.status === 'DELIVERED' ? 'selected' : ''}>Delivered</option>
                    <option value="CANCELLED" ${order.status === 'CANCELLED' ? 'selected' : ''}>Cancelled</option>
                </select>
                <button class="btn btn-success" onclick="updateOrderStatus(${order.id})">Update Status</button>
            </div>
        `;
        
        document.getElementById('orderDetailsContent').innerHTML = detailsContent;
        document.getElementById('orderDetailsModal').style.display = 'block';
        
    } catch (error) {
        console.error('Error loading order details:', error);
        alert('Failed to load order details');
    }
}

// Update order status
async function updateOrderStatus(orderId) {
    const newStatus = document.getElementById('updateStatus').value;
    
    try {
        const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: newStatus })
        });
        
        if (response.ok) {
            alert('Order status updated successfully');
            closeOrderModal();
            loadOrders(); // Refresh orders list
        } else {
            alert('Failed to update order status');
        }
    } catch (error) {
        console.error('Error updating order status:', error);
        alert('Failed to update order status');
    }
}

// Close order details modal
function closeOrderModal() {
    document.getElementById('orderDetailsModal').style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const productModal = document.getElementById('productModal');
    const orderModal = document.getElementById('orderDetailsModal');
    
    if (event.target == productModal) {
        closeModal();
    }
    if (event.target == orderModal) {
        closeOrderModal();
    }
}
