# Bloosm - GitHub Achievement Demo 🚀🌸
This repo is for earning GitHub achievements with a complete Spring Boot flower shop application!

## Bloosm Flower Shop 🌸

A flower trading website built using Spring Boot

## Features

- 🌸 Flower product catalog
- 🛒 Shopping cart
- 📦 Order management
- 👤 Customer profiles
- 💳 Checkout system

## Technical Details

### Backend
- Spring Boot 3.2.1
- Spring Data JPA
- MySQL Database
- REST API

### Frontend
- HTML5
- CSS3 (Custom Styling)
- Vanilla JavaScript
- Responsive Design

## Installation

### Requirements
- Java 17+
- Maven 3.6+
- MySQL 8.0+

### Database Configuration

1. Start MySQL server
2. Create database using the following command:

```sql
CREATE DATABASE bloosm_db;
```

3. Update database information in the `application.properties` file:

```properties
spring.datasource.username=your_mysql_username
spring.datasource.password=your_mysql_password
```

### Running the Project

1. Navigate to project folder:
```bash
cd bloosm
```

2. Build using Maven:
```bash
mvn clean install
```

3. Start the application:
```bash
mvn spring-boot:run
```

4. Open in browser:
```
http://localhost:8080
```

## API Endpoints

### Flowers
- GET `/api/flowers` - All flowers
- GET `/api/flowers/available` - Available flowers in stock
- GET `/api/flowers/{id}` - Get specific flower
- GET `/api/flowers/category/{category}` - Flowers by category
- GET `/api/flowers/search?keyword={keyword}` - Search flowers
- POST `/api/flowers` - Add new flower
- PUT `/api/flowers/{id}` - Update flower
- DELETE `/api/flowers/{id}` - Delete flower

### Cart
- GET `/api/cart/{customerId}` - Cart items
- POST `/api/cart` - Add to cart
- PUT `/api/cart/{cartItemId}` - Update quantity
- DELETE `/api/cart/{cartItemId}` - Remove item
- DELETE `/api/cart/clear/{customerId}` - Clear cart

### Orders
- GET `/api/orders` - All orders
- GET `/api/orders/{id}` - Specific order
- GET `/api/orders/customer/{customerId}` - Customer's orders
- POST `/api/orders` - Create new order
- PUT `/api/orders/{orderId}/status` - Update order status

### Customers
- GET `/api/customers` - All customers
- GET `/api/customers/{id}` - Specific customer
- GET `/api/customers/email/{email}` - Search by email
- POST `/api/customers` - Register new customer
- PUT `/api/customers/{id}` - Update profile

## Structure

```
bloosm/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/bloosm/flowerShop/
│   │   │       ├── controller/      # REST Controllers
│   │   │       ├── entity/          # JPA Entities
│   │   │       ├── repository/      # Data Repositories
│   │   │       ├── service/         # Business Logic
│   │   │       └── FlowerShopApplication.java
│   │   └── resources/
│   │       ├── static/              # Frontend Files
│   │       │   ├── css/
│   │       │   ├── js/
│   │       │   ├── index.html
│   │       │   ├── flowers.html
│   │       │   ├── cart.html
│   │       │   ├── orders.html
│   │       │   └── customer.html
│   │       ├── application.properties
│   │       └── data.sql
│   └── test/
├── pom.xml
└── README.md
```

## Contributing

Your contributions to improve this project are welcome!

## License

© 2025 Bloosm Flower Shop. All rights reserved.

---
*This repository is part of my GitHub achievements journey! 🎯*
