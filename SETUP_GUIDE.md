# Complete Setup Guide for Beginners

This guide will help you set up the Lifelink website step by step, even if you have no computer knowledge.

## 📚 What You'll Need

1. A computer (Windows, Mac, or Linux)
2. Internet connection
3. About 1-2 hours of time

## 🎯 Step-by-Step Instructions

### Part 1: Installing Required Software

#### Step 1.1: Install Node.js

1. Go to [https://nodejs.org/](https://nodejs.org/)
2. Download the LTS (Long Term Support) version
3. Run the installer
4. Click "Next" through all steps (use default settings)
5. Restart your computer after installation

**Verify Installation:**
- Open Command Prompt (Windows) or Terminal (Mac/Linux)
- Type: `node --version`
- You should see a version number like `v18.17.0`

#### Step 1.2: Install PostgreSQL

1. Go to [https://www.postgresql.org/download/](https://www.postgresql.org/download/)
2. Select your operating system
3. Download the installer
4. Run the installer
5. **Important**: Remember the password you set for the `postgres` user
6. Complete the installation

**Verify Installation:**
- Open pgAdmin (installed with PostgreSQL)
- You should see the PostgreSQL server

#### Step 1.3: Install Git (Optional but Recommended)

1. Go to [https://git-scm.com/downloads](https://git-scm.com/downloads)
2. Download for your operating system
3. Install with default settings

#### Step 1.4: Install VS Code (Code Editor)

1. Go to [https://code.visualstudio.com/](https://code.visualstudio.com/)
2. Download VS Code
3. Install it
4. Open VS Code

### Part 2: Setting Up the Project

#### Step 2.1: Get the Project Files

**Option A: If you have the files already:**
- Extract the ZIP file to a folder (e.g., `C:\Users\YourName\Desktop\lifelink`)

**Option B: If using Git:**
- Open Command Prompt/Terminal
- Navigate to your desired folder: `cd Desktop`
- Clone: `git clone <your-repo-url>`
- Navigate into folder: `cd lifelink`

#### Step 2.2: Install Project Dependencies

1. Open Command Prompt/Terminal
2. Navigate to the project folder:
   ```bash
   cd path\to\lifelink
   ```
3. Install dependencies:
   ```bash
   npm run install-all
   ```
   This will take 5-10 minutes. Wait for it to complete.

### Part 3: Setting Up the Database

#### Step 3.1: Create Database

1. Open **pgAdmin** (installed with PostgreSQL)
2. Right-click on "Databases"
3. Select "Create" > "Database"
4. Name: `lifelink`
5. Click "Save"

#### Step 3.2: Enable PostGIS

1. In pgAdmin, expand the `lifelink` database
2. Right-click on "Extensions"
3. Select "Create" > "Extension"
4. Search for "postgis"
5. Select "postgis" and click "Save"

**Alternative (Using SQL):**
1. In pgAdmin, click on "Tools" > "Query Tool"
2. Type:
   ```sql
   CREATE DATABASE lifelink;
   ```
3. Click Execute (F5)
4. Connect to `lifelink` database
5. Run:
   ```sql
   CREATE EXTENSION IF NOT EXISTS postgis;
   ```

### Part 4: Configure Environment Variables

#### Step 4.1: Backend Configuration

1. Navigate to the `server` folder
2. Copy `.env.example` and rename it to `.env`
3. Open `.env` in a text editor
4. Update these values:

```env
DB_PASSWORD=your_postgres_password_here
JWT_SECRET=any_random_long_string_here
ADMIN_SECRET=your_admin_password_here
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_number
```

**Important:**
- Replace `your_postgres_password_here` with the password you set during PostgreSQL installation
- Generate random strings for JWT_SECRET and ADMIN_SECRET (you can use [this generator](https://randomkeygen.com/))

#### Step 4.2: Frontend Configuration

1. Navigate to the `client` folder
2. Create a file named `.env.local`
3. Add this line:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Part 5: Setting Up Twilio (For SMS)

1. Go to [https://www.twilio.com/](https://www.twilio.com/)
2. Sign up for a free account
3. Verify your phone number
4. Go to Console Dashboard
5. Copy:
   - Account SID
   - Auth Token
   - Phone Number
6. Add these to `server/.env`

**Note:** Twilio free trial has limitations. For production, you'll need a paid account.

### Part 6: Running the Application

#### Step 6.1: Start the Backend

1. Open Command Prompt/Terminal
2. Navigate to project: `cd path\to\lifelink`
3. Start backend:
   ```bash
   cd server
   npm run dev
   ```
4. You should see: "Server running on port 5000"
5. **Keep this window open**

#### Step 6.2: Start the Frontend

1. Open a **NEW** Command Prompt/Terminal window
2. Navigate to project: `cd path\to\lifelink`
3. Start frontend:
   ```bash
   cd client
   npm run dev
   ```
4. You should see: "Ready on http://localhost:3000"
5. **Keep this window open**

#### Step 6.3: Access the Website

1. Open your web browser
2. Go to: `http://localhost:3000`
3. You should see the Lifelink homepage!

### Part 7: Testing the System

1. **Test Donor Registration:**
   - Go to `/donor/register`
   - Fill in the form
   - Submit

2. **Test Blood Request:**
   - Go to `/blood-request`
   - Fill in the form
   - Mark as emergency
   - Submit

3. **Test Admin Dashboard:**
   - Go to `/admin/dashboard`
   - Enter your admin secret (from `.env`)
   - View statistics

## 🐛 Common Problems and Solutions

### Problem: "Cannot find module"
**Solution:** Run `npm install` in the folder where the error occurs

### Problem: "Port 5000 already in use"
**Solution:** 
- Change PORT in `server/.env` to `5001`
- Update `client/.env.local` to use port `5001`

### Problem: "Database connection failed"
**Solution:**
- Check PostgreSQL is running
- Verify password in `server/.env`
- Check database name is `lifelink`

### Problem: "Twilio SMS not working"
**Solution:**
- Verify Twilio credentials
- Check account has balance
- Verify phone number format

### Problem: "Map not loading"
**Solution:**
- Check internet connection
- Maps require internet (uses OpenStreetMap)

## 📱 Next Steps

1. **Customize the Logo:**
   - Replace logo in `client/components/Header.tsx`

2. **Add Real Data:**
   - Add blood centers via admin panel
   - Register real donors
   - Create blood stocks

3. **Deploy Online:**
   - Use services like Vercel (frontend) and Railway (backend)
   - Follow their deployment guides

## 🎓 Learning Resources

- **Node.js:** [https://nodejs.org/en/docs/](https://nodejs.org/en/docs/)
- **PostgreSQL:** [https://www.postgresql.org/docs/](https://www.postgresql.org/docs/)
- **Next.js:** [https://nextjs.org/docs](https://nextjs.org/docs)
- **React:** [https://react.dev/](https://react.dev/)

## 💡 Tips for Beginners

1. **Take it slow:** Don't rush through the steps
2. **Read error messages:** They often tell you what's wrong
3. **Use Google:** Search for error messages
4. **Ask for help:** Join developer communities
5. **Practice:** Try making small changes to understand the code

## ✅ Checklist

Before you consider setup complete:

- [ ] Node.js installed and verified
- [ ] PostgreSQL installed and running
- [ ] Database `lifelink` created
- [ ] PostGIS extension enabled
- [ ] `.env` files configured
- [ ] Twilio account set up (optional but recommended)
- [ ] Backend server running
- [ ] Frontend server running
- [ ] Website accessible in browser
- [ ] Can register a donor
- [ ] Can submit a blood request
- [ ] Admin dashboard accessible

## 🎉 Congratulations!

If you've completed all steps, you now have a fully functional blood donation management system!

---

**Need Help?** Review the main README.md for more detailed information.

