# LoanFlow Backend

## Project Description

This is the backend foundation for LoanFlow - a fintech loan management platform. It provides a secure, production-ready API with:

- ✅ Express.js server with ES6 modules
- ✅ MongoDB connection with retry logic
- ✅ Security middleware (Helmet, CORS, Rate Limiting)
- ✅ Error handling with environment-specific responses
- ✅ Health check and test endpoints
- ✅ Environment variable validation

---

## Setup Instructions

### Prerequisites

Before you begin, make sure you have:

- Node.js 22 LTS or higher
  - Check your version: `node -v`
  - If you don't have it, download from: https://nodejs.org/
- MongoDB installed locally or MongoDB Atlas account
  - Local: https://www.mongodb.com/try/download/community
  - Atlas: https://www.mongodb.com/cloud/atlas

### Installation


# Clone the repository (if using Git)
git clone https://github.com/AdedayoWilliams09/loanflow-backend
cd backend

# Install dependencies
npm install

# Create environment file from example
cp .env.example .env

# Edit .env with your values (see below)

### Environment Variables
Create a .env file in the root directory with these variables:

Variable	                   Example	                                  Purpose
PORT	                        5000	                                   Server port
MONGO_URI	          mongodb://localhost:27017/loanflow	             MongoDB connection string
FRONTEND_URL	            http://localhost:5173	                       Allowed CORS origin
NODE_ENV	                    development                              	Environment mode

### Running the Server

<!-- Development mode (with auto-reload) -->
npm run dev

<!-- Production mode -->
npm start

### Verification
Once the server is running, you should see:

 MongoDB Connected: localhost
 Database Name: loanflow
 Connection State: 1
 All environment variables validated
 Server running on http://localhost:5000

 ### API Documentation
 #### Health Check Endpoint
 ##### GET /api/health

 Returns the system health status.

 Response Example (200 OK):

 {
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.45,
  "uptimeFormatted": "2m 3s",
  "mongoConnected": true,
  "mongoState": 1,
  "mongoStateDescription": "Connected",
  "environment": "development"
}

#### Test Connection Endpoint
##### GET /api/test

Tests if the API is reachable and working.

Response Example (200 OK):
{
  "success": true,
  "message": "API connection successful",
  "data": {
    "backendStatus": "healthy",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "uptime": 123.45,
    "environment": "development",
    "apiVersion": "1.0.0"
  }
}

Error Response (400 Bad Request - Invalid Query Parameter):

{
  "success": false,
  "message": "Invalid query parameters",
  "errors": [
    {
      "field": "invalid",
      "message": "Unexpected query parameters: invalid"
    }
  ],
  "timestamp": "2024-01-01T00:00:00.000Z"
}

### 404 Not Found
#### GET /api/unknown
##### Response Example (404 Not Found):

{
  "success": false,
  "message": "Route not found: /api/unknown",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/api/unknown"
}

### Testing with Postman

Setting Up Postman
- Download and install Postman: https://www.postman.com/downloads/

- Create a new collection: Click "New" → "Collection"

- Name it: "LoanFlow Backend API"

Test Cases
Test 1: Health Check
Setting	Value
Method	GET
URL	http://localhost:5000/api/health
Headers	Content-Type: application/json

Expected Response:


- Status: 200 OK

- Body contains: "status": "OK", "mongoConnected": true

Test 2: Test Connection

Setting	    Value
Method	    GET
URL	       http://localhost:5000/api/test
Headers	    Content-Type: application/json

Expected Response:

- Status: 200 OK

- Body contains: "success": true, "message": "API connection successful"

Test 3: Invalid Route

Setting	      Value
Method	       GET
URL	       http://localhost:5000/api/unknown
Headers	     Content-Type: application/json

Expected Response:

- Status: 404 Not Found

- Body contains: "message": "Route not found"

Test 4: Invalid Query Parameter

Setting	       Value
Method	       GET
URL     	http://localhost:5000/api/test?invalid=1
Headers    	Content-Type: application/json

Expected Response:

- Status: 400 Bad Request

- Body contains: "message": "Invalid query parameters"

Test 5: Rate Limiting

Test 5: Rate Limiting
Setting      	Value
Method       	GET
URL      	http://localhost:5000/api/test
Headers    	Content-Type: application/json

Note: Make 101 requests in 15 minutes to trigger rate limiting.

Expected Response:

Status: 429 Too Many Requests

Body contains: "message": "Too many requests"

### Folder Structure

backend/
├── config/
│   └── db.js           # MongoDB connection with retry logic
├── controllers/
│   ├── healthController.js   # Health check logic
│   └── testController.js     # Test connection logic
├── middleware/
│   └── errorMiddleware.js    # Global error handling
├── routes/
│   ├── healthRoutes.js       # Health check route
│   └── testRoutes.js         # Test connection route
├── .env.example              # Environment variables template
├── .gitignore                # Git ignore file
├── package.json              # Dependencies and scripts
├── server.js                 # Main application file
└── README.md                 # This file



### Troubleshooting
#### MongoDB Connection Failed
Symptoms:

 MongoDB Connection Error: MongooseServerSelectionError
Failed to connect to MongoDB after all retries.


#### Solutions:

- Check that MongoDB is running:

 <!-- For local MongoDB -->
mongod --version
<!-- If not running, start it: -->
sudo systemctl start mongod  # Linux
brew services start mongodb-community  # Mac

- Verify your MONGO_URI in .env is correct

- Check your network/firewall settings

- If using MongoDB Atlas, check IP whitelist

### Port Already in Use
Symptoms: Error: listen EADDRINUSE: address already in use :::5000

##### Solutions:

- Change the PORT in your .env file

- Find and kill the process using the port:
<!-- # On Linux/Mac -->
lsof -i :5000
kill -9 <PID>
<!-- # On Windows -->
netstat -ano | findstr :5000
taskkill /PID <PID> /F

### CORS Issues
##### Symptoms: 
Access to fetch at 'http://localhost:5000' from origin 'http://localhost:5173' has been blocked by CORS policy

### Solutions:

- Verify FRONTEND_URL in .env matches your frontend URL

- Make sure CORS middleware is correctly configured

- Check that the frontend is making requests to the correct URL

### Environment Variables Not Loading

Symptoms:

text
 Missing required environment variables:
   - MONGO_URI

   Solutions:

- Ensure .env file exists in the backend root directory

- Check that the variable names exactly match what's expected

- No spaces around the = sign: MONGO_URI=mongodb://...



## Homepage Implementation

### New API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/testimonials` | GET | Get active testimonials |
| `/api/faqs` | GET | Get active FAQs |
| `/api/loan-products` | GET | Get active loan products |
| `/api/settings/statistics` | GET | Get trust statistics |
| `/api/settings/hero` | GET | Get hero content |
| `/api/settings/features` | GET | Get feature cards |

### New Models/Schemas

| Model | Description |
|-------|-------------|
| `Testimonial` | Customer testimonials with ratings |
| `FAQ` | Frequently asked questions with categories |
| `LoanProduct` | Loan product information |
| `Settings` | Key-value settings (hero, stats, features) |

### New Environment Variables
None added in this phase

### New Dependencies Installed
| Package | Version | Purpose |
|---------|---------|---------|
| swagger-ui-express | 5.0.0 | API documentation |

### Postman Test Cases

| Test Case | Endpoint | Method | Status | Expected Response |
|-----------|----------|--------|--------|-------------------|
| Get Testimonials | `/api/testimonials` | GET | 200 | Array of testimonial objects |
| Get FAQs | `/api/faqs?limit=6` | GET | 200 | Array of FAQ objects |
| Get Loan Products | `/api/loan-products?limit=4` | GET | 200 | Array of loan product objects |
| Get Statistics | `/api/settings/statistics` | GET | 200 | Stats object |
| Get Hero Content | `/api/settings/hero` | GET | 200 | Hero content object |
| Get Features | `/api/settings/features` | GET | 200 | Features array |

### Deployment
- **Render URL**: https://loanflow-backend.onrender.com
- **Swagger UI**: https://[your-username].github.io/loanflow-backend




## Phase 2: About Page Implementation

### New API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/team` | GET | Get active team members |
| `/api/team/:id` | GET | Get single team member |
| `/api/settings/about` | GET | Get about page settings |
| `/api/settings/about` | PUT | Update about page settings |

### New Models/Schemas

| Model | Description |
|-------|-------------|
| `TeamMember` | Team member information with Cloudinary support |
| `AboutSettings` | About page content (mission, story, values) |

### New Environment Variables
None added in this phase

### New Dependencies Installed
None - using existing dependencies

### Postman Test Cases

| Test Case | Endpoint | Method | Expected Status | Expected Response |
|-----------|----------|--------|-----------------|-------------------|
| Get Team Members | `/api/team` | GET | 200 | Array of team member objects |
| Get Single Team Member | `/api/team/:id` | GET | 200 | Single team member object |
| Get About Settings | `/api/settings/about` | GET | 200 | About settings object |
| Update About Settings | `/api/settings/about` | PUT | 200 | Updated about settings object |

### Deployment
- **Render URL**: https://loanflow-backend.onrender.com
- **Swagger UI**: https://[your-username].github.io/loanflow-backend

### Known Issues/Limitations
- Team member photos not yet integrated with Cloudinary (coming in Phase 5)
- Admin authentication not yet implemented (coming in Phase 3)


## Phase 3: Loan Products Page Implementation

### New API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/loan-products` | GET | Get loan products with filtering, search, pagination |
| `/api/loan-products/types` | GET | Get distinct product types |

### Updated Models/Schemas
- `LoanProduct` - Enhanced with filtering support (no schema changes needed)

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| type | string | Filter by product type |
| minAmount | number | Minimum loan amount |
| maxAmount | number | Maximum loan amount |
| duration | number | Repayment period in months |
| search | string | Search term for name/description |
| page | number | Page number |
| limit | number | Items per page |
| isActive | boolean | Filter by active status |

### New Environment Variables
None added in this phase

### New Dependencies Installed
None - using existing dependencies

### Postman Test Cases

| Test Case | Endpoint | Method | Expected Status | Expected Response |
|-----------|----------|--------|-----------------|-------------------|
| Get All Products | `/api/loan-products` | GET | 200 | Array of products with pagination |
| Filter by Type | `/api/loan-products?type=Personal` | GET | 200 | Filtered products |
| Filter by Amount | `/api/loan-products?minAmount=100000` | GET | 200 | Filtered products |
| Search Products | `/api/loan-products?search=business` | GET | 200 | Searched products |
| Get Product Types | `/api/loan-products/types` | GET | 200 | Array of product types |
| Pagination | `/api/loan-products?page=2&limit=5` | GET | 200 | Paginated results |

### Deployment
- **Render URL**: https://loanflow-backend.onrender.com
- **Swagger UI**: https://[your-username].github.io/loanflow-backend

### Known Issues/Limitations
- URL query params not yet supported (coming in Phase 3.5)
- Admin panel for product management coming in Phase 5



## Phase 4: FAQ Page Implementation

### New API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/faqs` | GET | Get FAQs with category filtering and search |
| `/api/faqs/categories` | GET | Get distinct FAQ categories |

### Updated Models/Schemas
- `FAQ` - Enhanced with filtering support (no schema changes needed)

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| category | string | Filter by category (general, loans, repayment, account) |
| search | string | Search term for question text |
| limit | number | Number of FAQs to return |
| isActive | boolean | Filter by active status |

### New Environment Variables
None added in this phase

### New Dependencies Installed
None - using existing dependencies

### Postman Test Cases

| Test Case | Endpoint | Method | Expected Status | Expected Response |
|-----------|----------|--------|-----------------|-------------------|
| Get All FAQs | `/api/faqs` | GET | 200 | Array of FAQ objects |
| Filter by Category | `/api/faqs?category=loans` | GET | 200 | Filtered FAQs |
| Search FAQs | `/api/faqs?search=approval` | GET | 200 | Searched FAQs |
| Get Categories | `/api/faqs/categories` | GET | 200 | Array of categories |
| Combined Filter | `/api/faqs?category=loans&search=approve` | GET | 200 | Filtered and searched FAQs |


## Phase 5: Contact Page Implementation

### New API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/contact` | POST | Submit contact form |
| `/api/email/test` | POST | Test email configuration |

### New Models/Schemas

| Model | Description |
|-------|-------------|
| `ContactSubmission` | Contact form submissions with status tracking |

### New Middleware
- Rate limiting: 5 submissions per hour per IP (already configured globally)

### New Environment Variables

| Variable | Description |
|----------|-------------|
| GMAIL_USER | Gmail account email |
| GMAIL_CLIENT_ID | Google OAuth2 client ID |
| GMAIL_CLIENT_SECRET | Google OAuth2 client secret |
| GMAIL_REFRESH_TOKEN | Google OAuth2 refresh token |
| GMAIL_CALLBACK_URL | OAuth2 callback URL |
| CONTACT_EMAIL | Email to receive contact notifications |

### New Dependencies Installed
| Package | Version | Purpose |
|---------|---------|---------|
| nodemailer | Latest | Email sending |
| googleapis | Latest | Google OAuth2 |

### Postman Test Cases

| Test Case | Endpoint | Method | Expected Status | Expected Response |
|-----------|----------|--------|-----------------|-------------------|
| Submit Contact | `/api/contact` | POST | 201 | Success message with ID |
| Missing Required Field | `/api/contact` | POST | 400 | Validation errors |
| Invalid Email | `/api/contact` | POST | 400 | Email validation error |
| Short Message | `/api/contact` | POST | 400 | Message length error |
| Test Email | `/api/email/test` | POST | 200 | Success message |
| Rate Limiting | `/api/contact` | POST | 429 | Rate limit exceeded |





### Links
- [Frontend README](https://github.com/AdedayoWilliams09/loanflow-frontend) - Documentation for the frontend



