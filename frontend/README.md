# Super Admin System

A complete Super Admin management system with multilingual support built with Node.js, Express, MongoDB, and React.

## Features

### Backend
- **Authentication**: JWT-based secure authentication
- **User Management**: Complete CRUD operations for users
- **Role Management**: Create roles and assign to users
- **Audit Logs**: Automatic logging of all critical actions
- **Analytics**: Dashboard with user statistics and activity metrics
- **Security**: Password hashing with bcrypt, role-based access control

### Frontend
- **Multilingual Support**: 6 languages (English, Hindi, Marathi, German, French, Chinese)
- **Automatic Language Detection**: Detects browser language on first load
- **Manual Language Switching**: Easy language switcher component
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Updates**: Instant UI updates without page reload

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing
- Jest & Supertest for testing

### Frontend
- React 18
- Vite
- React Router v6
- Axios
- i18next & react-i18next
- Custom CSS

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd superadmin-system
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/superadmin
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRY=24h
NODE_ENV=development
```

Seed the database:

```bash
npm run seed
```

Start the backend server:

```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Default Credentials

After seeding the database, use these credentials:

**Super Admin:**
- Email: `superadmin@example.com`
- Password: `Admin@123`

**Other Test Users:**
- Admin: `jane@example.com` / `Admin@123`
- User: `john@example.com` / `User@123`
- Viewer: `bob@example.com` / `Viewer@123`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login

### Users (Requires Super Admin)
- `GET /api/users` - List users (with pagination & search)
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Roles (Requires Super Admin)
- `GET /api/roles` - List all roles
- `POST /api/roles` - Create role
- `POST /api/roles/assign` - Assign role to user

### Audit Logs (Requires Super Admin)
- `GET /api/audit-logs` - List audit logs (with filters)
- `GET /api/audit-logs/:id` - Get log by ID

### Analytics (Requires Super Admin)
- `GET /api/analytics` - Get analytics data

## Testing

Run backend tests:

```bash
cd backend
npm test
```

## Supported Languages

The application supports the following languages:

1. **English (en)** - 🇬🇧
2. **Hindi (hi)** - 🇮🇳
3. **Marathi (mr)** - 🇮🇳
4. **German (de)** - 🇩🇪
5. **French (fr)** - 🇫🇷
6. **Chinese (zh)** - 🇨🇳

### Adding New Languages

1. Create a new JSON file in `frontend/src/i18n/locales/` (e.g., `es.json`)
2. Copy the structure from `en.json` and translate all values
3. Import the translation in `frontend/src/i18n/i18n.js`:
   ```javascript
   import es from './locales/es.json';
   ```
4. Add it to the resources:
   ```javascript
   resources: {
     // ... existing languages
     es: { translation: es }
   }
   ```
5. Add the language to the switcher in `frontend/src/components/LanguageSwitcher.jsx`

## Project Structure

```
superadmin-system/
├── backend/
│   ├── src/
│   │   ├── config/          # Database and JWT configuration
│   │   ├── middleware/      # Authentication and authorization
│   │   ├── models/          # Mongoose models
│   │   ├── routes/          # API routes
│   │   ├── controllers/     # Business logic
│   │   ├── utils/           # Helper functions
│   │   └── server.js        # Express app entry point
│   ├── tests/               # Test files
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/             # Axios configuration
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── i18n/            # Internationalization
│   │   │   ├── i18n.js      # i18next configuration
│   │   │   └── locales/     # Translation files
│   │   ├── context/         # React context
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # React entry point
│   └── package.json
└── README.md
```

## Security Features

- **Password Hashing**: All passwords hashed with bcrypt (10 rounds)
- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Super admin-only endpoints
- **Input Validation**: Server-side validation for all inputs
- **Error Handling**: Comprehensive error handling throughout
- **Audit Logging**: All critical actions logged with user info

## Features in Detail

### User Management
- Create, read, update, and delete users
- Search users by name or email
- Pagination support
- Role assignment
- Active/inactive status

### Audit Logs
- Automatic logging of user actions
- Filter by action type, date range, and user
- Detailed information including IP address and user agent
- Immutable log records

### Analytics Dashboard
- Total users count
- Active/inactive users
- Login statistics (last 7 days)
- Role distribution
- Recent activities feed

### Multilingual Support
- Automatic browser language detection
- Manual language switcher
- Instant language switching without reload
- Easily extensible to new languages
- Clean separation of translations

## Development

### Backend Development

```bash
cd backend
npm run dev  # Uses nodemon for auto-reload
```

### Frontend Development

```bash
cd frontend
npm run dev  # Vite dev server with hot reload
```

### Building for Production

Backend:
```bash
cd backend
npm start
```

Frontend:
```bash
cd frontend
npm run build
npm run preview
```

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`
- Verify MongoDB port (default: 27017)

### JWT Token Issues
- Clear browser localStorage
- Re-login to get new token
- Check JWT_SECRET in `.env`

### Language Not Loading
- Clear browser cache
- Check console for errors
- Verify translation files exist in `locales/`

## License

ISC

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Support

For issues and questions, please create an issue in the repository.