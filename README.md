# Bloosm - GitHub Achievement Demo 🚀🌸
This repo is for earning GitHub achievements with a complete Spring Boot flower shop application!

## Bloosm මල් සාප්පුව 🌸

Spring Boot භාවිතයෙන් නිර්මාණය කරන ලද මල් වෙළඳ වෙබ් අඩවිය

## විශේෂාංග

- 🌸 මල් නිෂ්පාදන නාමාවලිය
- 🛒 සාප්පු කරත්තය
- 📦 ඇණවුම් කළමනාකරණය
- 👤 පාරිභෝගික පැතිකඩ
- 💳 Checkout පද්ධතිය

## තාක්ෂණික විස්තර

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

## ස්ථාපනය

### අවශ්‍ය දේ
- Java 17+
- Maven 3.6+
- MySQL 8.0+

### දත්ත සමුදාය හැඩගැස්වීම

1. MySQL server එක ආරම්භ කරන්න
2. පහත විධානයෙන් database එක සාදන්න:

```sql
CREATE DATABASE bloosm_db;
```

3. `application.properties` file එකේ database තොරතුරු යාවත්කාලීන කරන්න:

```properties
spring.datasource.username=your_mysql_username
spring.datasource.password=your_mysql_password
```

### ව්‍යාපෘතිය ක්‍රියාත්මක කිරීම

1. Project folder එකට යන්න:
```bash
cd bloosm
```

2. Maven භාවිතයෙන් build කරන්න:
```bash
mvn clean install
```

3. Application එක ආරම්භ කරන්න:
```bash
mvn spring-boot:run
```

4. Browser එකෙන් විවෘත කරන්න:
```
http://localhost:8080
```

## API Endpoints

### Flowers
- GET `/api/flowers` - සියලු මල්
- GET `/api/flowers/available` - තොගයේ ඇති මල්
- GET `/api/flowers/{id}` - විශේෂිත මලක් ලබාගන්න
- GET `/api/flowers/category/{category}` - වර්ගය අනුව මල්
- GET `/api/flowers/search?keyword={keyword}` - මල් සොයන්න
- POST `/api/flowers` - නව මලක් එකතු කරන්න
- PUT `/api/flowers/{id}` - මල යාවත්කාලීන කරන්න
- DELETE `/api/flowers/{id}` - මල මකන්න

### Cart
- GET `/api/cart/{customerId}` - කරත්තයේ අයිතම
- POST `/api/cart` - කරත්තයට එකතු කරන්න
- PUT `/api/cart/{cartItemId}` - ප්‍රමාණය යාවත්කාලීන කරන්න
- DELETE `/api/cart/{cartItemId}` - අයිතමය ඉවත් කරන්න
- DELETE `/api/cart/clear/{customerId}` - කරත්තය හිස් කරන්න

### Orders
- GET `/api/orders` - සියලු ඇණවුම්
- GET `/api/orders/{id}` - විශේෂිත ඇණවුමක්
- GET `/api/orders/customer/{customerId}` - පාරිභෝගිකයාගේ ඇණවුම්
- POST `/api/orders` - නව ඇණවුමක් සාදන්න
- PUT `/api/orders/{orderId}/status` - ඇණවුම් තත්වය යාවත්කාලීන කරන්න

### Customers
- GET `/api/customers` - සියලු පාරිභෝගිකයින්
- GET `/api/customers/{id}` - විශේෂිත පාරිභෝගිකයෙක්
- GET `/api/customers/email/{email}` - email අනුව සොයන්න
- POST `/api/customers` - නව පාරිභෝගිකයෙක් ලියාපදිංචි කරන්න
- PUT `/api/customers/{id}` - පැතිකඩ යාවත්කාලීන කරන්න

## ව්‍යුහය

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

## දායකත්වය

මෙම ව්‍යාපෘතිය වැඩිදියුණු කිරීම සඳහා ඔබේ දායකත්වය සාදරයෙන් පිළිගනිමු!

## බලපත්‍රය

© 2025 Bloosm මල් සාප්පුව. සියලු හිමිකම් ඇවිරිණි.

---
*This repository is part of my GitHub achievements journey! 🎯*
