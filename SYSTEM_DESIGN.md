# LifeLink - System Design Document

## 1. System Overview

**LifeLink** is a geolocation-based blood donation management system designed to connect blood donors with patients in need through real-time emergency response capabilities. The system leverages modern web technologies, geospatial databases, and SMS notification services to facilitate life-saving blood donations across India.

### Key Objectives
- Enable rapid emergency blood request fulfillment through automated donor matching
- Maintain real-time blood inventory across multiple blood centers
- Provide geolocation-based search for nearest donors and blood banks
- Streamline blood donation camp management and coordination
- Deliver instant SMS notifications to compatible donors during emergencies

---

## 2. System Architecture

### 2.1 High-Level Architecture

LifeLink follows a **three-tier client-server architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                     PRESENTATION LAYER                       │
│  Next.js 14 Frontend (React + TypeScript + Tailwind CSS)   │
│         - Donor Portal    - Admin Dashboard                 │
│         - Blood Request   - Blood Centers Map               │
│         - Camp Management - Real-time Notifications         │
└─────────────────────────────────────────────────────────────┘
                              ↕ HTTP/REST API
┌─────────────────────────────────────────────────────────────┐
│                     APPLICATION LAYER                        │
│        Node.js + Express.js Backend Server (Port 5000)      │
│  - RESTful API Endpoints    - JWT Authentication           │
│  - Business Logic           - Geospatial Queries            │
│  - SMS Integration          - Scheduled Tasks               │
└─────────────────────────────────────────────────────────────┘
                              ↕ Sequelize ORM
┌─────────────────────────────────────────────────────────────┐
│                      DATA LAYER                              │
│     PostgreSQL Database with PostGIS Extension              │
│  - Donor Records          - Blood Requests                  │
│  - Blood Stocks           - Blood Centers                   │
│  - Camps                  - Geospatial Indexes              │
└─────────────────────────────────────────────────────────────┘
```

**Visual Architecture Diagram:**

![LifeLink System Architecture](C:/Users/sripridha/.gemini/antigravity/brain/ac6a3ebf-a7d4-4b37-ae05-c08696f5af1c/lifelink_architecture_diagram_1764732055968.png)

### 2.2 External Services Integration

- **Twilio SMS Gateway**: Real-time emergency notifications to donors
- **OpenStreetMap (Leaflet)**: Interactive maps for location visualization
- **AI Chat Service**: Optional AI-powered assistant for user queries

---

## 3. Core Components

### 3.1 Frontend (Client)

**Technology Stack:**
- **Framework**: Next.js 14 (React 18) with TypeScript
- **Styling**: Tailwind CSS for responsive design
- **Maps**: React Leaflet for interactive geolocation features
- **State Management**: React Hooks and Context API
- **Animations**: Framer Motion for smooth UI transitions
- **Icons**: Lucide React
- **Charts**: Recharts for analytics visualization
- **Forms**: React Hook Form for validation
- **Notifications**: React Hot Toast

**Key Pages:**
- `/donor/register` - Donor registration with geolocation capture
- `/donor/login` - Authentication portal
- `/blood-request` - Emergency blood request submission
- `/blood-availability` - Real-time blood stock search
- `/blood-centers` - Interactive map of blood banks
- `/camps` - Blood donation camp listings and registration
- `/admin/dashboard` - Administrative control panel
- `/notifications` - Real-time notification center

### 3.2 Backend (Server)

**Technology Stack:**
- **Runtime**: Node.js
- **Framework**: Express.js
- **ORM**: Sequelize for PostgreSQL
- **Authentication**: JWT (JSON Web Tokens) + bcryptjs
- **Validation**: Express Validator
- **SMS Service**: Twilio SDK
- **File Upload**: Multer

**API Route Structure:**
```
/api/auth           - Authentication (register, login)
/api/donors         - Donor profile management
/api/blood-requests - Blood request CRUD operations
/api/blood-stocks   - Blood inventory management
/api/blood-centers  - Blood bank directory
/api/camps          - Camp registration and management
/api/admin          - Administrative operations
/api/ai             - AI chat assistant
/api/webhook        - Twilio SMS webhooks
/api/notifications  - Real-time notification system
```

### 3.3 Database Schema

**PostgreSQL with PostGIS Extension**

**Core Tables:**

1. **donors**
   - Personal information (name, age, gender, father's name)
   - Contact details (mobile, email)
   - Location data (state, district, address, pincode, latitude, longitude)
   - Blood group (A+, A-, B+, B-, AB+, AB-, O+, O-)
   - Status tracking (isActive, status, lastDonationDate)
   - Password (hashed with bcrypt)

2. **blood_requests**
   - Requester and patient information
   - Hospital details and location (with lat/long)
   - Blood group and units required
   - Emergency flag (isEmergency)
   - Status (Pending, Accepted, Completed, Cancelled)
   - Associated donor ID (foreign key)

3. **blood_stocks**
   - Blood center reference (foreign key)
   - Blood group and available units
   - Last updated timestamp

4. **blood_centers**
   - Center name and contact information
   - Address with geolocation (latitude, longitude)
   - Operating hours and facilities

5. **camps**
   - Organizer details
   - Camp location and schedule
   - Status (Pending, Approved, Completed)
   - Expected donors count

**Relationships:**
- One-to-Many: Donor → Blood Requests
- One-to-Many: Blood Center → Blood Stocks

---

## 4. Key Features & Data Flow

### 4.1 Emergency Blood Request Flow

```
1. User submits blood request with emergency flag
   ↓
2. Backend receives request and stores in database
   ↓
3. PostGIS spatial query finds compatible donors within radius
   - Matching blood group (with compatibility rules)
   - Active status = true
   - Within 10km radius (configurable)
   ↓
4. Twilio SMS sent to all matched donors
   - Patient name, blood group, hospital, location
   - Request ID for tracking
   ↓
5. Donors receive SMS and can respond (ACCEPT/REJECT)
   ↓
6. Admin dashboard shows real-time request status
   ↓
7. Request marked as Accepted/Completed by admin
```

### 4.2 Donor Eligibility Management

**Automated Reactivation System:**
- Scheduled task runs every hour
- Checks donors with `isActive = false` and `lastDonationDate` set
- Calculates eligibility based on gender:
  - Male donors: 3 months post-donation
  - Female donors: 4 months post-donation
- Automatically reactivates eligible donors

### 4.3 Geolocation Features

**PostGIS Spatial Queries:**
- **Nearest Donor Search**: Finds donors within specified radius using `ST_Distance_Sphere`
- **Blood Center Proximity**: Locates nearest blood banks
- **Camp Location Mapping**: Displays camps on interactive map

**Location Capture:**
- Browser Geolocation API for automatic coordinates
- Manual address entry with geocoding fallback
- State and district dropdown for Indian locations

### 4.4 Real-time Notifications

**Notification Types:**
- New blood requests (emergency and standard)
- Blood stock updates
- New blood centers registered
- Camp registrations (pending/completed)
- Donor status changes

**Implementation:**
- Polling-based notification system
- Notifications stored in database with timestamps
- Read/unread status tracking
- Category-based filtering

---

## 5. Security & Authentication

### 5.1 Authentication Flow
1. User registers with mobile number and password
2. Password hashed using bcryptjs (10 salt rounds)
3. JWT token generated upon successful login
4. Token includes donor ID and expiration time
5. Protected routes verify JWT token via middleware

### 5.2 Security Measures
- **Password Security**: bcrypt hashing with salt
- **SQL Injection Prevention**: Sequelize ORM parameterized queries
- **CORS Configuration**: Controlled cross-origin access
- **Input Validation**: Express Validator on all endpoints
- **Mobile Number Validation**: 10-digit Indian format
- **Admin Access Control**: Secret key-based authentication

---

## 6. Scalability & Performance

### 6.1 Database Optimization
- **Indexes**: Created on frequently queried fields (mobile, bloodGroup, status)
- **Geospatial Indexes**: PostGIS GIST indexes for location queries
- **Connection Pooling**: Sequelize connection pool management

### 6.2 Caching Strategy
- Static assets cached via Next.js automatic optimization
- API responses can be cached for blood center listings
- Database query results cached for frequently accessed data

### 6.3 Deployment Architecture
- **Frontend**: Vercel/Netlify (serverless deployment)
- **Backend**: Railway/Heroku/DigitalOcean (containerized)
- **Database**: Managed PostgreSQL with PostGIS support
- **SMS Service**: Twilio cloud infrastructure

---

## 7. Technology Justification

| Technology | Purpose | Justification |
|------------|---------|---------------|
| **Next.js 14** | Frontend framework | Server-side rendering, excellent SEO, fast page loads, TypeScript support |
| **PostgreSQL + PostGIS** | Database | Robust geospatial queries, ACID compliance, excellent for location-based features |
| **Sequelize ORM** | Database abstraction | Type-safe queries, migration support, relationship management |
| **Twilio** | SMS notifications | Reliable delivery, webhook support, India coverage |
| **JWT** | Authentication | Stateless, scalable, secure token-based auth |
| **React Leaflet** | Maps | Open-source, no API key required, customizable |
| **Tailwind CSS** | Styling | Rapid development, consistent design, responsive utilities |

---

## 8. Future Enhancements

- **Real-time WebSocket Integration**: Replace polling with WebSocket for instant notifications
- **Mobile Application**: Native iOS/Android apps using React Native
- **Blood Donation History**: Detailed donor contribution tracking
- **Gamification**: Badges and rewards for regular donors
- **Multi-language Support**: Regional language translations
- **Advanced Analytics**: Predictive blood demand forecasting using ML
- **Integration with Government Blood Banks**: National blood bank network connectivity

---

**Document Version**: 1.0  
**Last Updated**: December 2025  
**System Status**: Production Ready
