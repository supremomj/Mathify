# Mathify Installation Checklist

Use this checklist when setting up Mathify on a new machine.

## ✅ Prerequisites

- [ ] **Node.js installed** (Version 16 or higher)
  - Download from: https://nodejs.org/
  - Verify: `node --version` (should show v16.x or higher)
  - Verify: `npm --version` (should show 8.x or higher)

## ✅ Installation Steps

- [ ] **Copy project files** to new machine
  - Include: `backend/`, `scripts/`, `src/`, `assets/`, `package.json`
  - Exclude: `node_modules/`, `logs/`, `*.db` files

- [ ] **Open terminal/command prompt** in project root directory

- [ ] **Install dependencies**
  ```bash
  npm install
  ```
  - Wait for installation to complete (2-5 minutes)
  - Should see "added X packages" message

- [ ] **Verify installation**
  - Check that `node_modules/` folder was created
  - No error messages in terminal

## ✅ Database Setup

- [ ] **Start application** (database will be created automatically)
  ```bash
  npm start
  ```

- [ ] **OR manually initialize database**
  ```bash
  npm run db:init
  ```

- [ ] **Seed curriculum data** (recommended)
  ```bash
  npm run seed:curriculum
  npm run seed:grade1
  ```

## ✅ Admin Account Setup

- [ ] **Default admin account** (created automatically on first run)
  - Email: `admin@mathify.com`
  - Password: `admin123`
  - **⚠️ Change password immediately after first login!**

- [ ] **OR create custom admin account**
  ```bash
  node scripts/create-admin.js
  ```

## ✅ Verification

- [ ] **Application launches** without errors
- [ ] **Can login** with admin credentials
- [ ] **Database exists** in user app data directory
- [ ] **Can create student accounts** from admin dashboard
- [ ] **Students can login** and see their dashboard

## ✅ Platform-Specific (if needed)

### Windows
- [ ] No additional steps required

### macOS
- [ ] Allow Electron in Security & Privacy (if prompted)

### Linux
- [ ] Install Electron dependencies (if needed):
  ```bash
  # Ubuntu/Debian
  sudo apt-get install libnss3 libatk-bridge2.0-0 libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libasound2
  ```

## 📝 Notes

- Database location (auto-created):
  - Windows: `C:\Users\[Username]\AppData\Roaming\mathify\mathify.db`
  - macOS: `~/Library/Application Support/mathify/mathify.db`
  - Linux: `~/.config/mathify/mathify.db`

- Logs location: `logs/` folder in project root

- If issues occur, check:
  1. Node.js version is 16+
  2. All dependencies installed (`npm install` completed)
  3. No port conflicts
  4. Write permissions in user directory

## 🆘 Troubleshooting

If something doesn't work:

1. **Delete and reinstall dependencies:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Check logs:**
   - Look in `logs/` folder for error messages

3. **Verify database:**
   ```bash
   npm run db:view
   ```

4. **See detailed guide:**
   - Read `docs/SETUP_GUIDE.md`

## ✅ Ready to Use!

Once all items are checked, the application is ready to use on the new machine!

