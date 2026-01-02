# Mathify Project Structure

## Directory Organization

```
Mathify/
├── backend/              # Backend/server files
│   ├── main.js          # Electron main process
│   ├── render.js        # Electron preload script
│   ├── database.js      # Database operations
│   ├── logger.js        # Logging utility
│   ├── rule-based-ai.js # AI recommendation system
│   ├── curriculum-question-generator.js # Question generation
│   └── ai-adapter.js    # AI integration adapter
│
├── scripts/              # Utility and setup scripts
│   ├── seed-curriculum.js        # Seed curriculum data
│   ├── seed-grade1-quarters.js   # Seed Grade 1 quarters
│   ├── test-backend.js           # Backend testing
│   ├── verify-curriculum.js      # Verify curriculum data
│   ├── view-database.js          # View database contents
│   ├── create-admin.js           # Create admin account
│   ├── create-admin-account.js   # Alternative admin creation
│   ├── set-mariadb-password.js   # MariaDB setup
│   ├── fix-mariadb-auth.js       # MariaDB auth fix
│   ├── db-config.js              # Database configuration
│   ├── db-helper.js              # Database helper utilities
│   └── ai-integration-example.js # AI integration examples
│
├── src/                  # Frontend files
│   ├── landing.html     # Landing page
│   ├── auth.html        # Authentication page
│   ├── student-dashboard.html  # Student dashboard
│   ├── student-dashboard.js    # Student dashboard logic
│   ├── student-dashboard.css   # Student dashboard styles
│   ├── admin-dashboard.html    # Admin dashboard
│   └── style.css        # Global styles
│
├── assets/               # Static assets
│   └── Mathify Logo.png # Application logo
│
├── docs/                 # Documentation
│   ├── README.md
│   ├── BACKEND_SETUP.md
│   ├── GRADE1_QUARTERS_SETUP.md
│   ├── README_BACKEND.md
│   ├── STUDENT_DASHBOARD_FIXES.md
│   └── SYSTEM_ANALYSIS_AND_FLAWS.md
│
├── logs/                 # Application logs
│   └── app-*.log        # Log files
│
├── node_modules/         # Dependencies (auto-generated)
├── package.json          # Project configuration
└── README.md            # Main project README
```

## File Descriptions

### Backend Files (`/backend`)
- **main.js**: Electron main process, handles window creation and IPC
- **render.js**: Preload script for secure IPC communication
- **database.js**: SQLite database operations and schema
- **logger.js**: Logging utility for application events
- **rule-based-ai.js**: Rule-based AI for student recommendations
- **curriculum-question-generator.js**: Generates questions based on curriculum
- **ai-adapter.js**: Adapter for AI service integration

### Scripts (`/scripts`)
- **seed-curriculum.js**: Seeds curriculum topics for all grades
- **seed-grade1-quarters.js**: Seeds Grade 1 quarter-based curriculum
- **test-backend.js**: Tests backend functionality
- **verify-curriculum.js**: Verifies curriculum data integrity
- **view-database.js**: Views database contents
- **create-admin.js**: Creates admin user account
- **db-helper.js**: Database helper utilities

### Frontend Files (`/src`)
- **landing.html**: Landing page with features
- **auth.html**: Login/registration page
- **student-dashboard.html/js/css**: Student interface
- **admin-dashboard.html**: Admin interface
- **style.css**: Global styles

## Running the Application

```bash
# Start the application
npm start

# Seed curriculum data
npm run seed:curriculum

# Seed Grade 1 quarters
npm run seed:grade1

# Database utilities
npm run db:view
npm run db:init
npm run db:reset
```

## Notes

- The `Mathify/Mathify/` folder appears to be a duplicate and can be removed
- Database files (`mathify.db`) are stored in the user's app data directory
- Logs are automatically generated in the `/logs` folder

