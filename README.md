# Lifelink - Blood Donation Management System

A highly advanced, fully functional geolocation-based blood donation management system with real-time emergency response capabilities.

## 🌟 Features

### Core Features
- **Geolocation-Based System**: Find nearest blood banks and donors using PostGIS
- **Real-Time Emergency Response**: Automatic SMS notifications to nearby donors via Twilio
- **Live Blood Availability Search**: Search for available blood units across all blood banks
- **Blood Center Directory**: Comprehensive directory with map integration
- **Blood Donation Camps**: Schedule and manage donation camps
- **Donor Management**: Complete donor registration and profile management
- **Blood Request System**: Submit and track blood requests
- **Admin Dashboard**: Comprehensive management dashboard
- **AI-Powered Chat Assistant**: Interactive AI assistant with voice support
- **Advanced Maps**: Google Maps-like functionality with search

### Special Features
- **Blood Group Compatibility**: Visual compatibility chart
- **Emergency SMS Alerts**: Instant notifications to compatible donors
- **India-Focused**: Complete coverage of all Indian states and districts
- **World Map Support**: Global functionality with special focus on India
- **Beautiful Modern UI**: Professional, aesthetic design

## 🛠️ Technology Stack

### Backend
- **Node.js** with Express.js
- **PostgreSQL** with PostGIS extension
- **Sequelize** ORM
- **Twilio** for SMS notifications
- **JWT** for authentication
- **bcryptjs** for password hashing

### Frontend
- **Next.js 14** (React framework)
- **TypeScript**
- **Tailwind CSS** for styling
- **React Leaflet** for maps
- **React Hot Toast** for notifications
- **Framer Motion** for animations
- **Lucide React** for icons

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

1. **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
2. **PostgreSQL** (v12 or higher) with PostGIS extension - [Download](https://www.postgresql.org/download/)
3. **Git** - [Download](https://git-scm.com/)
4. **Code Editor** (VS Code recommended) - [Download](https://code.visualstudio.com/)

## 🚀 Installation & Setup

### Step 1: Clone the Repository

```bash
git clone <your-repo-url>
cd lifelink
```

### Step 2: Install Dependencies

Install all dependencies for root, server, and client:

```bash
npm run install-all
```

Or manually:

```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Step 3: Set Up PostgreSQL Database

1. **Install PostgreSQL** (if not already installed)
2. **Install PostGIS extension**:
   ```sql
   CREATE EXTENSION postgis;
   ```

3. **Create Database**:
   ```sql
   CREATE DATABASE lifelink;
   ```

4. **Connect to database and enable PostGIS**:
   ```sql
   \c lifelink
   CREATE EXTENSION IF NOT EXISTS postgis;
   ```

### Step 4: Configure Environment Variables

1. **Backend Configuration** (`server/.env`):
   ```env
   PORT=5000
   NODE_ENV=development

   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=lifelink
   DB_USER=postgres
   DB_PASSWORD=your_postgres_password

   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   ADMIN_SECRET=your_admin_secret_key

   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_PHONE_NUMBER=your_twilio_phone_number

   OPENAI_API_KEY=your_openai_api_key_for_ai_chat
   ```

2. **Frontend Configuration** (`client/.env.local`):
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

### Step 5: Get API Keys

#### Twilio Setup (for SMS)
1. Sign up at [Twilio](https://www.twilio.com/)
2. Get your Account SID and Auth Token from the dashboard
3. Get a phone number from Twilio
4. Add these to `server/.env`

#### OpenAI/DeepSeek Setup (for AI Chat - Optional)
1. Sign up at [OpenAI](https://openai.com/) or [DeepSeek](https://www.deepseek.com/)
2. Get your API key
3. Add to `server/.env`

### Step 6: Run the Application

#### Development Mode (Both Frontend and Backend)

From the root directory:

```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- Frontend on `http://localhost:3000`

#### Or Run Separately

**Backend only:**
```bash
cd server
npm run dev
```

**Frontend only:**
```bash
cd client
npm run dev
```

## 📁 Project Structure

```
lifelink/
├── server/                 # Backend API
│   ├── config/            # Database configuration
│   ├── models/            # Sequelize models
│   ├── routes/            # API routes
│   ├── middleware/        # Auth middleware
│   ├── utils/             # Utility functions (Twilio, geolocation)
│   └── index.js           # Server entry point
│
├── client/                 # Frontend Next.js app
│   ├── app/               # Next.js app directory
│   │   ├── donor/         # Donor pages
│   │   ├── blood-request/ # Blood request page
│   │   ├── blood-availability/ # Blood search
│   │   ├── blood-centers/ # Blood centers
│   │   ├── camps/         # Camp pages
│   │   └── admin/         # Admin dashboard
│   ├── components/        # React components
│   └── lib/               # Utilities (API client)
│
└── README.md              # This file
```

## 🎯 Usage Guide

### For Donors

1. **Register**: Go to `/donor/register` and fill in your details
2. **Login**: Use `/donor/login` with your mobile number
3. **View Profile**: Access your profile after login
4. **Update Location**: Your location is automatically captured or can be set manually

### For Blood Requesters

1. **Submit Request**: Go to `/blood-request` and fill the form
2. **Mark Emergency**: Check "Emergency" for instant SMS alerts to nearby donors
3. **Track Status**: View your request status

### For Administrators

1. **Access Dashboard**: Go to `/admin/dashboard`
2. **Enter Admin Key**: Use the admin secret from `.env`
3. **Manage Requests**: Update request statuses
4. **View Statistics**: See real-time statistics

### For Camp Organizers

1. **Register Camp**: Go to `/camps/register`
2. **Fill Details**: Complete all required information
3. **Submit**: Camp will be reviewed and approved by admin

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new donor
- `POST /api/auth/login` - Login donor

### Donors
- `GET /api/donors/profile` - Get donor profile (auth required)
- `PUT /api/donors/profile` - Update donor profile (auth required)
- `GET /api/donors` - Get all donors

### Blood Requests
- `POST /api/blood-requests` - Create blood request
- `GET /api/blood-requests` - Get all requests
- `GET /api/blood-requests/:id` - Get single request
- `PUT /api/blood-requests/:id` - Update request

### Blood Stocks
- `GET /api/blood-stocks/search` - Search blood stocks
- `POST /api/blood-stocks` - Create/update stock

### Blood Centers
- `GET /api/blood-centers` - Get all centers
- `GET /api/blood-centers/nearest` - Find nearest centers
- `POST /api/blood-centers` - Create center

### Camps
- `GET /api/camps` - Get all camps
- `POST /api/camps` - Register camp
- `GET /api/camps/:id` - Get single camp

### Admin
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/requests` - All requests
- `GET /api/admin/donors` - All donors
- `PUT /api/admin/requests/:id` - Update request
- `PUT /api/admin/camps/:id` - Update camp

### AI Chat
- `POST /api/ai/chat` - Chat with AI assistant

## 🗄️ Database Schema

### Tables
- **donors**: Donor information and location
- **blood_requests**: Blood requests with emergency flags
- **blood_stocks**: Available blood units in centers
- **blood_centers**: Blood bank and storage unit information
- **camps**: Blood donation camp schedules

All location data uses PostGIS for geospatial queries.

## 🎨 Customization

### Change Logo
Replace the logo in `client/components/Header.tsx` with your SVVV logo.

### Modify Colors
Update Tailwind colors in `client/tailwind.config.js`.

### Add States/Districts
Update the state and district lists in the respective form components.

## 🐛 Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check database credentials in `.env`
- Verify PostGIS extension is installed

### Twilio SMS Not Working
- Verify Twilio credentials
- Check phone number format (include country code)
- Ensure Twilio account has sufficient balance

### Map Not Loading
- Check internet connection (uses OpenStreetMap)
- Verify Leaflet CSS is imported
- Check browser console for errors

### Port Already in Use
- Change PORT in `server/.env`
- Or kill the process using the port

## 📱 Mobile Responsive

The website is fully responsive and works on:
- Desktop
- Tablet
- Mobile devices

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation
- SQL injection protection (Sequelize)
- CORS configuration

## 🚀 Deployment

### Backend Deployment (Heroku/Railway/DigitalOcean)

1. Set environment variables
2. Deploy PostgreSQL database with PostGIS
3. Deploy Node.js application
4. Update API URL in frontend

### Frontend Deployment (Vercel/Netlify)

1. Set `NEXT_PUBLIC_API_URL` to your backend URL
2. Deploy to Vercel/Netlify
3. Configure custom domain (optional)

## 📞 Support

For issues or questions:
- Check the documentation
- Review error logs
- Contact support

## 📄 License

This project is created for educational and humanitarian purposes.

## 🙏 Acknowledgments

- OpenStreetMap for map data
- Twilio for SMS services
- All open-source contributors

---

**Made with ❤️ for saving lives**

