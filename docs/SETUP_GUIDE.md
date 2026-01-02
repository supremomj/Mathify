# Mathify Setup Guide

Complete guide for setting up Mathify on a new machine or device.

## Prerequisites

### Required Software

1. **Node.js** (Version 16 or higher)
   - Download from: https://nodejs.org/
   - Verify installation:
     ```bash
     node --version
     npm --version
     ```

2. **npm** (comes with Node.js)
   - Verify installation:
     ```bash
     npm --version
     ```

### Optional but Recommended

- **Git** (for version control)
  - Download from: https://git-scm.com/

## Installation Steps

### 1. Copy Project Files

Copy the entire Mathify project folder to the new machine. Make sure to include:
- All files in the root directory
- `backend/` folder
- `scripts/` folder
- `src/` folder
- `assets/` folder
- `package.json` file

**Note:** You can exclude:
- `node_modules/` folder (will be reinstalled)
- `logs/` folder (will be created automatically)
- `*.db` files (database will be created automatically)
- `Mathify/Mathify/` duplicate folder (if present)

### 2. Install Dependencies

Open a terminal/command prompt in the project root directory and run:

```bash
npm install
```

This will install all required packages:
- `electron` - Desktop application framework
- `sqlite3` - Database
- `bcrypt` - Password hashing
- `openai` - AI integration (optional)

**Expected time:** 2-5 minutes depending on internet speed

### 3. Database Setup

The database will be created automatically on first run. However, you can manually initialize it:

```bash
# Initialize database
npm run db:init

# Or seed curriculum data
npm run seed:curriculum

# Seed Grade 1 quarters
npm run seed:grade1
```

### 4. Create Admin Account

Create an admin account to manage the application:

```bash
node scripts/create-admin.js
```

Or use the alternative:
```bash
node scripts/create-admin-account.js
```

Follow the prompts to create your admin account.

## Running the Application

### Start the Application

```bash
npm start
```

This will:
1. Initialize the database (if not already done)
2. Create default admin account (if none exists)
3. Launch the Electron application window

### First Run

On first run, the application will:
- Create database in user's app data directory:
  - **Windows:** `C:\Users\[Username]\AppData\Roaming\mathify\mathify.db`
  - **macOS:** `~/Library/Application Support/mathify/mathify.db`
  - **Linux:** `~/.config/mathify/mathify.db`
- Set up all required tables
- Create default admin account (email: `admin@mathify.com`, password: `admin123`)

## Platform-Specific Notes

### Windows

- **No additional setup required**
- Application will create database in `AppData\Roaming\mathify\`
- Make sure you have write permissions in the user directory

### macOS

- **No additional setup required**
- Application will create database in `~/Library/Application Support/mathify/`
- May need to allow Electron in Security & Privacy settings on first run

### Linux

- **No additional setup required**
- Application will create database in `~/.config/mathify/`
- May need to install additional dependencies:
  ```bash
  # Ubuntu/Debian
  sudo apt-get install libnss3 libatk-bridge2.0-0 libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libasound2

  # Fedora
  sudo dnf install nss atk at-spi2-atk libdrm libxkbcommon libXcomposite libXdamage libXfixes libXrandr libgbm alsa-lib
  ```

## Available Scripts

```bash
# Start the application
npm start

# Database utilities
npm run db:view      # View database contents
npm run db:init      # Initialize database
npm run db:reset     # Reset database (WARNING: deletes all data)
npm run db:help      # Show database help

# Seed data
npm run seed:curriculum   # Seed all curriculum topics
npm run seed:grade1       # Seed Grade 1 quarter topics

# Testing
node scripts/test-backend.js    # Test backend functionality
node scripts/verify-curriculum.js  # Verify curriculum data
```

## Troubleshooting

### Issue: "Cannot find module 'electron'"

**Solution:**
```bash
npm install
```

### Issue: "Database not found" or "Cannot create database"

**Solution:**
- Check write permissions in user directory
- Manually create the app data directory:
  - Windows: `C:\Users\[Username]\AppData\Roaming\mathify\`
  - macOS: `~/Library/Application Support/mathify/`
  - Linux: `~/.config/mathify/`

### Issue: "Port already in use"

**Solution:**
- Close any other instances of the application
- Restart your computer if the port is still locked

### Issue: Application won't start

**Solution:**
1. Delete `node_modules/` folder
2. Delete `package-lock.json`
3. Run `npm install` again
4. Try `npm start` again

### Issue: "Module not found" errors

**Solution:**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

## File Structure After Setup

```
Mathify/
├── backend/              # Backend files
├── scripts/              # Utility scripts
├── src/                  # Frontend files
├── assets/               # Static assets
├── docs/                 # Documentation
├── node_modules/         # Dependencies (auto-generated)
├── logs/                 # Log files (auto-generated)
├── package.json          # Project configuration
└── README.md            # Main README
```

## Database Location

The database is stored in the user's application data directory, not in the project folder. This ensures:
- Data persists across application updates
- Each user has their own database
- Data is stored in a standard location

To view the database location:
- Check the console output when the app starts
- Or check the logs in the `logs/` folder

## Security Notes

1. **Default Admin Password**: Change the default admin password immediately after first setup
2. **Database Location**: The database contains user data - keep it secure
3. **Logs**: Log files may contain sensitive information - review before sharing

## Next Steps

After setup:
1. ✅ Create admin account (if not auto-created)
2. ✅ Seed curriculum data: `npm run seed:curriculum`
3. ✅ Seed Grade 1 quarters: `npm run seed:grade1`
4. ✅ Create student accounts through admin dashboard
5. ✅ Start using the application!

## Support

If you encounter issues:
1. Check the `logs/` folder for error messages
2. Review this setup guide
3. Check the documentation in `docs/` folder
4. Verify all prerequisites are installed correctly

