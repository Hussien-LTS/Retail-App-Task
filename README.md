# Retail Application Documentation

## Overview

This project is a microservice-based retail application built using **NestJS**. It consists of two microservices:

1. **Product Service**: Manages product-related operations.
2. **Order Service**: Manages order-related operations and interacts with the Product Service.

Each microservice is independent and communicates via REST API.

---

## Application Structure

```
retail-app/
├── order-service/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.config.ts
│   │   ├── orders/
│   │   │   ├── dto/
│   │   │   │   └── order.dtos.ts
│   │   │   ├── order.model.ts
│   │   │   ├── orders.controller.ts
│   │   │   ├── orders.module.ts
│   │   │   └── orders.service.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   └── .env
├── product-service/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.config.ts
│   │   ├── products/
│   │   │   ├── dto/
│   │   │   │   └── create-product.dto
│   │   │   ├── product.model.ts
│   │   │   ├── products.controller.ts
│   │   │   ├── products.module.ts
│   │   │   └── products.service.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   └── .env
└── .gitignore
└── LICENSE
└── README.md
```

---

## Installation

### Prerequisites

- Node.js (v18 or later)
- PostgreSQL
- DBeaver (optional, for database management)

### Steps

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd retail-app
   ```

2. Navigate to each microservice directory (`order-service` and `product-service`) and install dependencies:

   ```bash
   cd order-service
   npm install

   cd ../product-service
   npm install
   ```

3. Configure environment variables in the `.env` files for each service:

#### Example `.env` file for **Product Service**

```
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=DATABASE_USER
DATABASE_PASSWORD=DATABASE_PASSWORD
DATABASE_NAME=DATABASE_NAME
PRODUCT_SERVICE_PORT=3000
REST_API_PORT=3001
```

#### Example `.env` file for **Order Service**

```
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=DATABASE_USER
DATABASE_PASSWORD=DATABASE_PASSWORD
DATABASE_NAME=DATABASE_NAME
ORDER_SERVICE_PORT=3001
PRODUCT_SERVICE_URL=http://localhost:3000
```

4. Set up the databases:
   - Use PostgreSQL to create the `product_service_db` and `order_service_db` databases.
   - Optionally, use DBeaver to manage and inspect the databases.

---

## Running the Application

1. Start the **Product Service**:

   ```bash
   cd product-service
   npm run start:dev
   ```

2. Start the **Order Service**:

   ```bash
   cd order-service
   npm run start:dev
   ```

Both services will start and listen on their respective ports.

---

## API Endpoints

### Product Service

#### Base URL: `http://localhost:3000`

- **GET /products**: Fetch all products.
- **POST /products**: Create a new product.
  - Body: `{ "name": "string", "price": "number", "quantity": "number" }`
- **GET /products/:id**: Fetch a single product by ID.
- **PUT /products/:id**: Update a product by ID.
- **DELETE /products/:id**: Delete a product by ID.

### Order Service

#### Base URL: `http://localhost:3001`

- **GET /orders**: Fetch all orders.
- **POST /orders**: Create a new order.
  - Body: `{ "productId": "number", "quantity": "number" }`
- **GET /orders/:id**: Fetch a single order by ID.
- **PUT /orders/:id**: Update an order by ID.
- **DELETE /orders/:id**: Delete an order by ID.

---

## Database Models

### Product Model

| Field       | Type     |
|-------------|----------|
| id          | number   |
| name        | string   |
| price       | number   |
| quantity    | number   |
| createdAt   | Date     |
| updatedAt   | Date     |

### Order Model

| Field       | Type     |
|-------------|----------|
| id          | number   |
| productId   | number   |
| quantity    | number   |
| totalPrice  | number   |
| createdAt   | Date     |
| updatedAt   | Date     |

---

## Notes

- Ensure both services are running simultaneously to test the full functionality.
- Update the `PRODUCT_SERVICE_URL` in the **Order Service** `.env` file if the Product Service URL or port changes.
- Use tools like Postman to test the API endpoints.
- Update the `DATABASE_USER`, `DATABASE_PASSWORD` and `DATABASE_NAME` in the `.env` file
