const API_URL = 'http://localhost:8080/api';

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');
    
    errorMessage.style.display = 'none';
    successMessage.style.display = 'none';
    
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Store user data in localStorage
            localStorage.setItem('user', JSON.stringify(data));
            
            // For customer users, store the customer ID from login response
            if (data.role === 'USER' && data.customerId) {
                console.log('✅ LOGIN SUCCESS - User:', data.username, 'Customer ID:', data.customerId);
                localStorage.setItem('customerId', data.customerId.toString());
            }
            
            if (data.role === 'ADMIN') {
                successMessage.textContent = 'Admin login successful! Redirecting to Admin Dashboard (Role 1)...';
                successMessage.style.display = 'block';
                
                setTimeout(() => {
                    window.location.href = 'admin.html';
                }, 1500);
            } else {
                successMessage.textContent = 'Customer login successful! Redirecting to Customer Site (Role 2)...';
                successMessage.style.display = 'block';
                
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            }
        } else {
            errorMessage.textContent = data.error || 'Login failed';
            errorMessage.style.display = 'block';
        }
    } catch (error) {
        console.error('Error:', error);
        errorMessage.textContent = 'An error occurred. Please try again.';
        errorMessage.style.display = 'block';
    }
});
