# StartupForge — Startup Team Builder Platform

A platform where startup founders can publish startup ideas, build teams, and recruit collaborators. Developers, designers, marketers, and other professionals can explore startup opportunities and apply to join teams.

## Features

### Authentication (Better Auth)
- Login/Register with email & password
- Google Login support
- JWT stored in HTTPOnly cookies
- Role-based access: Founder, Collaborator, Admin

### Founder Dashboard
- Create and manage startup profile
- Post opportunities (limited to 3 free, premium required for more)
- Review and manage applications
- Accept/reject applicants
- Buy premium via Stripe ($19.99)

### Collaborator Dashboard
- Browse and search opportunities
- Apply to opportunities
- Track application status
- Update personal profile

### Admin Dashboard
- Overview stats (users, startups, opportunities, revenue)
- Manage users (block/unblock)
- Manage startups (approve/remove)
- View transactions

### Public Pages
- Home with featured startups & opportunities
- Browse startups with industry filter
- Browse opportunities with search & filters
- Startup details page
- Custom 404 page

### Technical Features
- Framer Motion animations
- Responsive design (mobile, tablet, desktop)
- Server-side pagination
- MongoDB $regex search & $in filtering
- Stripe Checkout integration
- imgBB image upload
- Recharts for dashboard charts

## Tech Stack

**Frontend:** React 18, Vite, Tailwind CSS, React Router, Framer Motion, Recharts, React Hot Toast

**Backend:** Node.js, Express, MongoDB (Mongoose), JWT, Stripe, bcryptjs

## Setup

### Prerequisites
- Node.js 18+
- MongoDB connection string
- Stripe account (for payments)
- imgBB API key (for image uploads)

### Server Setup

```bash
cd server
npm install
```

Create `server/.env`:
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
BETTER_AUTH_SECRET=your_better_auth_secret
BETTER_AUTH_URL=http://localhost:5173
STRIPE_SECRET_KEY=your_stripe_secret_key
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Run server:
```bash
npm run dev
```

### Client Setup

```bash
cd client
npm install
```

Create `client/.env`:
```
VITE_IMGBB_KEY=your_imgbb_api_key
```

Run client:
```bash
npm run dev
```

### Create Admin Account
Run the seed script:
```bash
cd server
npm run seed
```
This creates: **admin@startupforge.com** / **Admin123!**

Or manually in MongoDB:
```javascript
db.users.updateOne({ email: "admin@example.com" }, { $set: { role: "admin" } })
```

## Deployment

### Server
- Deploy to Render, Railway, or Vercel
- Set environment variables
- Ensure CORS is configured with your client URL

### Client
- Build: `npm run build`
- Deploy to Vercel, Netlify, or similar
- Configure client-side routing (no 404 on refresh)

## Submission Info

- **Admin Email:** admin@startupforge.com
- **Admin Password:** Admin123!
- **Server GitHub Repo:** https://github.com/YOUR_USERNAME/startup-forge-server
- **Client GitHub Repo:** https://github.com/YOUR_USERNAME/startup-forge-client
- **Live Site:** https://your-app.vercel.app

## API Endpoints

### Auth
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Startups
- `GET /api/startups/featured` - Featured startups
- `GET /api/startups/all` - All startups (paginated, filterable)
- `GET /api/startups/:id` - Startup by ID
- `POST /api/startups` - Create startup (founder)
- `PUT /api/startups/:id` - Update startup (founder)
- `DELETE /api/startups/:id` - Delete startup (founder)

### Opportunities
- `GET /api/opportunities/featured` - Featured opportunities
- `GET /api/opportunities/all` - All opportunities (paginated, searchable, filterable)
- `GET /api/opportunities/:id` - Opportunity by ID
- `POST /api/opportunities` - Create opportunity (founder)
- `PUT /api/opportunities/:id` - Update opportunity (founder)
- `DELETE /api/opportunities/:id` - Delete opportunity (founder)

### Applications
- `POST /api/applications` - Apply (collaborator)
- `GET /api/applications/my` - My applications (collaborator)
- `GET /api/applications/founder` - Applications for founder's opportunities
- `PUT /api/applications/:id` - Update status (founder)

### Payments
- `POST /api/payments/create-checkout` - Stripe checkout session
- `GET /api/payments/success` - Payment success handler

### Admin
- `GET /api/admin/stats` - Dashboard stats
- `GET /api/admin/users` - All users
- `PUT /api/admin/users/:id/toggle-block` - Block/unblock user

### Users
- `PUT /api/users/profile` - Update profile
- `GET /api/users/founder-stats` - Founder stats
- `GET /api/users/collaborator-stats` - Collaborator stats

## Project Structure

```
startup-forge/
├── client/               # React frontend
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   │   ├── public/    # Public pages
│   │   │   └── dashboard/ # Dashboard pages
│   │   ├── context/      # Auth context
│   │   ├── lib/          # API client
│   │   ├── App.jsx       # Routes
│   │   └── main.jsx      # Entry point
│   ├── index.html
│   ├── vite.config.js
│   └── tailwind.config.js
├── server/               # Express backend
│   ├── models/           # Mongoose models
│   ├── controllers/      # Route controllers
│   ├── routes/           # Express routes
│   ├── middleware/        # Auth middleware
│   ├── config/           # DB & Stripe config
│   └── index.js          # Server entry
└── README.md
```
