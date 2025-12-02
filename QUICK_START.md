# Quick Start Guide

Get Lifelink up and running in 15 minutes!

## Prerequisites Check

- [ ] Node.js installed (`node --version` should work)
- [ ] PostgreSQL installed and running
- [ ] Basic terminal/command prompt knowledge

## 5-Minute Setup

### 1. Install Dependencies (2 minutes)

```bash
npm run install-all
```

### 2. Create Database (1 minute)

In pgAdmin or psql:
```sql
CREATE DATABASE lifelink;
\c lifelink
CREATE EXTENSION postgis;
```

### 3. Configure Environment (2 minutes)

**Create `server/.env`:**
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=lifelink
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=change_this_secret_key
ADMIN_SECRET=change_this_admin_key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_number
```

**Create `client/.env.local`:**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 4. Run the Application (1 minute)

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
```

### 5. Open Browser

Go to: `http://localhost:3000`

## That's It! 🎉

Your Lifelink system is now running!

## Next Steps

1. Register a donor at `/donor/register`
2. Submit a blood request at `/blood-request`
3. Access admin dashboard at `/admin/dashboard` (use your ADMIN_SECRET)

## Troubleshooting

**Database error?**
- Check PostgreSQL is running
- Verify password in `.env`

**Port in use?**
- Change PORT in `server/.env`

**Module not found?**
- Run `npm install` in the folder with the error

---

For detailed setup, see `SETUP_GUIDE.md`

