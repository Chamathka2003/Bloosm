# Bloosm Flower Shop - Complete Application

## New Features Added ✨

### 1. **User Authentication System**
- Login and Signup pages with full backend integration
- User sessions stored in localStorage
- Role-based access (USER and ADMIN roles)

### 2. **Admin Dashboard**
- Full product management system
- Add, Edit, Delete flowers
- Update stock quantities and prices
- Manage product availability
- Admin-only access control

### 3. **Enhanced Cart System**
- Cart now works with user authentication
- Users can add flowers to cart
- Update quantities
- Remove items
- Clear entire cart

### 4. **Integrated Navigation**
- Dynamic login/logout display
- Role-based navigation (Admin link for admins)
- User welcome message
- Consistent across all pages

## Demo Credentials

### Admin Account
- **Username:** admin
- **Password:** admin
- **Access:** Full admin dashboard with product management

### Regular User Accounts
- **Username:** user | **Password:** user
- **Username:** john | **Password:** john123

## How to Use

### For Regular Users:
1. Visit `http://localhost:8080`
2. Click "Login" or browse as guest
3. Sign up for a new account or use demo credentials
4. Browse flowers and add to cart
5. Manage your cart and place orders

### For Administrators:
1. Login with admin credentials
2. Access Admin Dashboard from navigation
3. Manage products:
   - Add new flowers with details
   - Edit existing products
   - Update stock and pricing
   - Delete products
   - Toggle availability

## Pages Available

- **Home** (`index.html`) - Main landing page
- **Flowers** (`flowers.html`) - Browse all flowers
- **Cart** (`cart.html`) - Shopping cart
- **Orders** (`orders.html`) - Order history
- **Customer Profile** (`customer.html`) - User profile
- **Login** (`login.html`) - User authentication
- **Signup** (`signup.html`) - New user registration
- **Admin Dashboard** (`admin.html`) - Product management (Admin only)

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/user/{id}` - Get user details

### Flowers (Products)
- `GET /api/flowers` - Get all flowers
- `GET /api/flowers/{id}` - Get flower by ID
- `POST /api/flowers` - Add new flower (Admin)
- `PUT /api/flowers/{id}` - Update flower (Admin)
- `DELETE /api/flowers/{id}` - Delete flower (Admin)

### Cart
- `GET /api/cart/{customerId}` - Get cart items
- `POST /api/cart` - Add to cart
- `PUT /api/cart/{cartItemId}` - Update cart item
- `DELETE /api/cart/{cartItemId}` - Remove from cart
- `DELETE /api/cart/clear/{customerId}` - Clear cart

### Orders
- `GET /api/orders/customer/{customerId}` - Get customer orders
- `POST /api/orders` - Create order

## Technical Stack

- **Backend:** Spring Boot 3.2.1, Java 17
- **Database:** H2 (in-memory)
- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Architecture:** RESTful API

## Running the Application

The application is currently running on `http://localhost:8080`

To restart:
```bash
java -classpath ".mvn\wrapper\maven-wrapper.jar" "-Dmaven.multiModuleProjectDirectory=$PWD" org.apache.maven.wrapper.MavenWrapperMain spring-boot:run
```

## Features Implemented

✅ User registration and login
✅ Admin authentication and authorization
✅ Product CRUD operations
✅ Shopping cart functionality
✅ Order management
✅ Responsive design
✅ Role-based access control
✅ Session management
✅ Dynamic navigation

Enjoy using Bloosm Flower Shop! 🌸
