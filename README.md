# Click2Purchase - Core API

![NestJS](https://img.shields.io/badge/NestJS-Backend-E0234E?style=flat-square&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-Language-3178C6?style=flat-square&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-Payments-008CDD?style=flat-square&logo=stripe&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-API_Docs-85EA2D?style=flat-square&logo=swagger&logoColor=black)

A robust, enterprise-grade RESTful API built to power the Click2Purchase e-commerce platform. Utilizing a modular architecture, it securely handles everything from user authentication and complex catalog filtering to payment webhooks.

**Swagger API Documentation:** https://click2purchase-api.onrender.com/api/docs

**Frontend Repository:** https://github.com/Kos6tya/Click2Purchase-backend

## Key Features

* **Advanced Authentication:** Highly secure JWT-based auth implementing short-lived Access Tokens and long-lived, bcrypt-hashed Refresh Tokens.
* **Role-Based Access Control (RBAC):** Custom Guards to protect Admin-only endpoints and ensure data integrity.
* **Complex Database Queries:** Advanced product filtering (price ranges, categories), full-text searching, and sorting utilizing TypeORM `QueryBuilder`.
* **Stripe Integration:** Secure checkout session generation and raw-body Webhook handling to automatically update order statuses to `PAID`.
* **Media Uploads:** Direct integration with `Cloudinary` via streams (`streamifier`) for efficient, serverless product image hosting.
* **Database Seeding:** Built-in endpoint to instantly populate the database with category trees, rich products, variants, and an admin user.

## Tech Stack

* **Framework:** NestJS (Node.js)
* **Language:** TypeScript
* **Database:** PostgreSQL (Neon.tech / Docker)
* **ORM:** TypeORM
* **Payments:** Stripe API
* **Cloud Storage:** Cloudinary, Multer
* **Documentation:** Swagger (OpenAPI)


## Local Setup & Installation

Follow these steps to get the project running on your local machine.

### 1. Prerequisites
Make sure you have Node.js (v18+) installed.

### 2. Clone the repository
```bash
git clone https://github.com/Kos6tya/Click2Purchase-backend.git
cd Click2Purchase-backend
```

### 3. Install dependencies
```bash
npm install
```

### 4. Set up the local PostgreSQL database
```bash
docker-compose up -d
```

### 5. Create a .env file based on your configuration
```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=supersecretpassword
DB_NAME=click2purchase

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES_IN=7d

STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_key
FRONTEND_URL=http://localhost:3000

CLD_CLOUD_NAME=your_cloud_name
CLD_API_KEY=your_api_key
CLD_API_SECRET=your_api_secret

SWAGGER_PASSWORD=your_password
SEED_SECRET=your_secret_seed_key
```

### 6. Run the application:
```bash
npm run start:dev
```

Open http://localhost:5000/api/docs with your browser to see the result.
