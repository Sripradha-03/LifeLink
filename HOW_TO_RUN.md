# How to Run Lifelink - Step by Step Guide

## ✅ Yes! Tables Are Created Automatically

When you start the server for the first time, Sequelize (our database tool) will **automatically create all tables** in your database. You don't need to create them manually!

## 📋 Prerequisites Checklist

Before starting, make sure you have:

- [ ] Node.js installed (check with `node --version` in terminal)
- [ ] PostgreSQL installed and running
- [ ] Database `lifelink` created
- [ ] PostGIS extension enabled
- [ ] Environment variables configured

## 🚀 Step-by-Step Instructions

### Step 1: Open Terminal/Command Prompt

**Windows:**
- Press `Win + R`
- Type `cmd` and press Enter
- OR search for "Command Prompt" in Start menu

**Mac/Linux:**
- Press `Cmd + Space` (Mac) or `Ctrl + Alt + T` (Linux)
- Type "Terminal" and press Enter

### Step 2: Navigate to Project Folder

Type this command (replace with your actual path):

```bash
cd C:\Users\sripridha\Desktop\lifelink
```

**Or if you're already in Desktop:**
```bash
cd lifelink
```

**Verify you're in the right folder:**
```bash
dir
```
(You should see folders like `server`, `client`, `package.json`)

### Step 3: Verify Database Setup

**Option A: Using pgAdmin (Easier)**
1. Open pgAdmin
2. Expand "Servers" > "PostgreSQL" > "Databases"
3. Check if `lifelink` database exists
4. If not, right-click "Databases" > Create > Database > Name: `lifelink` > Save
5. Right-click on `lifelink` > Query Tool
6. Run: `CREATE EXTENSION IF NOT EXISTS postgis;`
7. Click Execute (F5)

**Option B: Using Command Line**
```bash
psql -U postgres
```
Then in psql:
```sql
CREATE DATABASE lifelink;
\c lifelink
CREATE EXTENSION IF NOT EXISTS postgis;
\q
```

### Step 4: Configure Environment Variables

**4.1: Create Backend .env File**

1. Navigate to server folder:
```bash
cd server
```

2. Check if `.env` file exists:
```bash
dir
```
(You should see `.env` or `.env.example`)

3. If `.env` doesn't exist, create it:
```bash
copy .env.example .env
```
(Windows) OR
```bash
cp .env.example .env
```
(Mac/Linux)

4. Open `.env` file in a text editor (Notepad, VS Code, etc.)

5. Update these values (IMPORTANT):
```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=lifelink
DB_USER=postgres
DB_PASSWORD=YOUR_POSTGRES_PASSWORD_HERE

JWT_SECRET=change_this_to_any_random_string_12345
ADMIN_SECRET=change_this_to_admin_password_12345

TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

**Replace:**
- `YOUR_POSTGRES_PASSWORD_HERE` with your PostgreSQL password
- `JWT_SECRET` with any random string (e.g., `my_secret_key_2024`)
- `ADMIN_SECRET` with your admin password (e.g., `admin123`)

**4.2: Create Frontend .env.local File**

1. Go back to project root:
```bash
cd ..
```

2. Navigate to client folder:
```bash
cd client
```

3. Create `.env.local` file:
```bash
echo NEXT_PUBLIC_API_URL=http://localhost:5000/api > .env.local
```

**OR manually create the file:**
- Create a new file named `.env.local`
- Add this line: `NEXT_PUBLIC_API_URL=http://localhost:5000/api`

4. Go back to project root:
```bash
cd ..
```

### Step 5: Install Dependencies (If Not Done)

If you haven't installed dependencies yet:

```bash
npm run install-all
```

This will take 5-10 minutes. Wait for it to complete.

**OR install separately:**

```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install
cd ..

# Install client dependencies
cd client
npm install
cd ..
```

### Step 6: Start the Backend Server

**Open Terminal/Command Prompt Window 1:**

1. Navigate to project:
```bash
cd C:\Users\sripridha\Desktop\lifelink
```

2. Start backend:
```bash
cd server
npm run dev
```

**You should see:**
```
Database connected successfully
Server running on port 5000
```

**✅ This is when tables are created automatically!**

If you see "Database connected successfully", Sequelize has:
- ✅ Connected to your database
- ✅ Created all tables automatically
- ✅ Set up relationships between tables

**Keep this window open!** The server must keep running.

### Step 7: Start the Frontend

**Open a NEW Terminal/Command Prompt Window 2:**

1. Navigate to project:
```bash
cd C:\Users\sripridha\Desktop\lifelink
```

2. Start frontend:
```bash
cd client
npm run dev
```

**You should see:**
```
  ▲ Next.js 14.0.4
  - Local:        http://localhost:3000
  - Ready in 2.3s
```

**Keep this window open too!**

### Step 8: Open the Website

1. Open your web browser (Chrome, Firefox, Edge, etc.)
2. Go to: `http://localhost:3000`
3. You should see the Lifelink homepage! 🎉

## 🎯 What Happens When Tables Are Created

When the backend starts, Sequelize automatically:

1. **Checks your database** for existing tables
2. **Creates missing tables** based on models:
   - `donors` table
   - `blood_requests` table
   - `blood_stocks` table
   - `blood_centers` table
   - `camps` table
3. **Sets up relationships** between tables
4. **Creates indexes** for better performance

**You'll see in the terminal:**
```
Executing (default): CREATE TABLE IF NOT EXISTS "donors" ...
Executing (default): CREATE TABLE IF NOT EXISTS "blood_requests" ...
... (and so on)
```

## 🔍 Verify Tables Were Created

**Option 1: Using pgAdmin**
1. Open pgAdmin
2. Navigate to: Servers > PostgreSQL > Databases > lifelink > Schemas > public > Tables
3. You should see 5 tables:
   - donors
   - blood_requests
   - blood_stocks
   - blood_centers
   - camps

**Option 2: Using psql**
```bash
psql -U postgres -d lifelink
```
Then:
```sql
\dt
```
You should see all 5 tables listed.

## 🐛 Troubleshooting

### Problem: "Cannot connect to database"

**Solution:**
- Check PostgreSQL is running
- Verify password in `server/.env` is correct
- Check database name is `lifelink`
- Try: `psql -U postgres` to test connection

### Problem: "Port 5000 already in use"

**Solution:**
1. Change PORT in `server/.env` to `5001`
2. Update `client/.env.local` to: `NEXT_PUBLIC_API_URL=http://localhost:5001/api`
3. Restart both servers

### Problem: "Tables not created"

**Solution:**
- Check database connection in terminal
- Look for error messages
- Verify PostGIS extension is enabled
- Check `server/.env` file has correct database credentials

### Problem: "Module not found"

**Solution:**
```bash
cd server
npm install
cd ../client
npm install
```

### Problem: "Cannot find .env file"

**Solution:**
- Make sure you're in the `server` folder
- Create `.env` file manually if needed
- Copy from `.env.example` if it exists

## ✅ Success Checklist

After running, you should have:

- [ ] Backend server running on port 5000
- [ ] Frontend server running on port 3000
- [ ] Website accessible at http://localhost:3000
- [ ] All 5 tables created in database
- [ ] No error messages in terminal

## 🎉 Next Steps

Once everything is running:

1. **Test the website:**
   - Go to http://localhost:3000
   - Try registering a donor
   - Try submitting a blood request

2. **Check the database:**
   - Open pgAdmin
   - View the tables
   - See if data was saved

3. **Test admin dashboard:**
   - Go to http://localhost:3000/admin/dashboard
   - Enter your ADMIN_SECRET
   - View statistics

## 📝 Quick Command Reference

```bash
# Navigate to project
cd C:\Users\sripridha\Desktop\lifelink

# Start backend (Terminal 1)
cd server
npm run dev

# Start frontend (Terminal 2 - NEW WINDOW)
cd client
npm run dev

# Or start both together (from root)
npm run dev
```

## 💡 Important Notes

1. **Keep both terminals open** while using the website
2. **Tables are created automatically** - no manual SQL needed
3. **First run takes longer** - subsequent runs are faster
4. **Database must be running** - PostgreSQL service must be active
5. **Environment variables are required** - don't skip the .env setup

---

**That's it! Your Lifelink system is now running with all tables created automatically!** 🚀

