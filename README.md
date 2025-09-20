# Inspire Website - Frontend

A modern React web application for managing Advanced Level (A/L) examinations in Physics, Chemistry, and Combined Mathematics. Built with Vite and React for optimal performance and developer experience.

## 🎯 Overview

- **Students**: Search and view exam results without authentication
- **Markers**: Authenticated access to enter marks and manage attendance
- **Admins**: Full system control including exam management and reporting

## 🚀 Features

### For Students (Public Access)
- ✅ Search exam results by NIC (National Identity Card)
- ✅ View results only when officially released
- ✅ Access top rankings and leaderboards
- ✅ Download public study resources
- ✅ Optional public registration (when enabled)

### For Markers (Authenticated)
- 🔐 Secure login with role-based access
- 📝 Enter marks for assigned subjects
- 📊 Bulk CSV upload for marks entry
- ✅ Mark student attendance
- 🔍 Search students by NIC within assigned sessions

### For Admins (Authenticated)
- 🏗️ Create and manage exams and sessions
- 👥 Manage markers and student registrations
- 📈 Generate comprehensive reports (school-wise, top ranks)
- 📁 Upload and manage study resources
- ⏰ Control result release schedules
- 📊 View detailed analytics and statistics

## 🛠️ Tech Stack

- **Build Tool**: Vite
- **Framework**: React 18+
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **File Storage**: Supabase Storage
- **State Management**: React Context / Zustand
- **Form Handling**: React Hook Form + Zod validation
- **HTTP Client**: Axios / Fetch API
- **Routing**: React Router

## 📋 Prerequisites

- Node.js 18.x or later (install with [nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- npm/yarn/pnpm package manager
- Supabase project setup
- Backend API service running

## ⚡ Quick Start
1. **Clone the repository**
   ```bash
   git clone https://github.com/KalharaJayathissa/inspire-frontend.git
   cd inspire-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env.local
   ```

4. **Configure environment variables**
   ```env
   # Supabase Configuration
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # API Configuration
   VITE_API_BASE_URL=http://localhost:3001/api
   
   # App Configuration
   VITE_APP_NAME="Exam Series Portal"
   VITE_RESULTS_SEARCH_RATE_LIMIT=10
   ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:5173](http://localhost:5173) (Vite default port)

### Alternative: GitHub Codespaces
1. Navigate to the main page of this repository
2. Click on the "Code" button (green button)
3. Select the "Codespaces" tab
4. Click "New codespace" to launch the development environment
5. Edit files directly and commit changes

## 📁 Project Structure

```
src/
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   ├── forms/            # Form components
│   ├── tables/           # Data table components
│   ├── layout/           # Layout components
│   └── charts/           # Chart/visualization components
├── pages/                # Route components
│   ├── auth/             # Authentication pages
│   ├── admin/            # Admin dashboard pages
│   ├── marker/           # Marker dashboard pages
│   ├── results/          # Public result search
│   └── resources/        # Study resources
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
│   ├── supabase/         # Supabase client configuration
│   ├── api/              # API client functions
│   ├── validations/      # Zod schemas
│   └── utils.ts          # General utilities
├── types/                # TypeScript type definitions
├── contexts/             # React contexts
├── constants/            # App constants
├── styles/               # Global styles
└── assets/               # Static assets
```

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start Vite development server
npm run build        # Build for production
npm run preview      # Preview production build locally
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues

# Testing
npm run test         # Run tests with Vitest
npm run test:ui      # Run tests with UI
npm run test:coverage # Generate coverage report

# Utilities
npm run type-check   # TypeScript type checking
```

## 🔐 Authentication & Authorization

The app implements role-based access control (RBAC):

- **Public routes**: `/`, `/results/*`, `/resources` (public only)
- **Marker routes**: `/marker/*` - requires `marker` role
- **Admin routes**: `/admin/*` - requires `admin` role

Authentication is handled via Supabase Auth with JWT tokens.

## 🌐 API Integration

The frontend communicates with the backend through RESTful APIs:

### Public Endpoints
- `GET /api/results/:nic` - Search results by NIC
- `GET /api/results/top-ranks` - Get top rankings
- `GET /api/resources` - List public resources
- `GET /api/schools` - List schools

### Protected Endpoints
- Marker APIs: `/api/marks/*`, `/api/attendance/*`
- Admin APIs: `/api/admin/*`, `/api/reports/*`

Rate limiting is implemented on public endpoints to prevent abuse.

## 🎨 UI/UX Features

- **Modern Design**: Built with shadcn/ui and Tailwind CSS
- **Responsive Design**: Mobile-first approach
- **Dark/Light Mode**: System preference detection
- **Loading States**: Skeleton loaders and spinners
- **Error Handling**: User-friendly error messages with boundaries
- **Form Validation**: Real-time validation with Zod and React Hook Form
- **Accessibility**: WCAG 2.1 compliant components
- **Type Safety**: Full TypeScript coverage

## ⚡ Performance Optimizations

- **Vite**: Lightning-fast development with HMR
- **Code Splitting**: Route-based lazy loading
- **Tree Shaking**: Dead code elimination
- **Image Optimization**: Optimized asset handling
- **Bundle Analysis**: Rollup bundle analyzer
- **Caching**: API response caching strategies

## 🔒 Security Measures

- **Environment Variables**: Sensitive data protection with Vite env vars
- **Content Security Policy**: XSS prevention
- **Input Sanitization**: Form data validation and sanitization
- **Rate Limiting**: Client-side request throttling
- **HTTPS Only**: Secure data transmission in production

## 🚀 Deployment

### Vercel Deployment (Recommended)
1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Netlify Deployment
```bash
npm run build
# Upload dist/ folder to Netlify or connect via Git
```

### Manual Deployment
```bash
npm run build
npm run preview  # Test production build locally
# Serve the dist/ folder with any static file server
```

## 🧪 Testing

- **Unit Tests**: Vitest + React Testing Library
- **Component Tests**: Testing isolated components
- **Integration Tests**: API integration testing
- **E2E Tests**: Playwright for critical user flows

Run tests:
```bash
npm run test              # Run all tests
npm run test:ui           # Run tests with UI
npm run test:coverage     # Generate coverage report
```

## 🔧 Configuration

### Supabase Setup
1. Create a new Supabase project
2. Run database migrations from the backend repository
3. Configure Row Level Security (RLS) policies
4. Set up storage buckets for file uploads
5. Update environment variables with your project credentials

### Vite Configuration
The project uses Vite with the following key configurations:
- TypeScript support
- React plugin with SWC for fast refresh
- Path aliases for clean imports
- Environment variable handling
- Production optimizations

### Environment Variables
Create a `.env.local` file with the following variables:
```env
# Required
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_BASE_URL=your_backend_api_url

# Optional
VITE_APP_NAME="Exam Series Portal"
VITE_RESULTS_SEARCH_RATE_LIMIT=10
VITE_ENABLE_PUBLIC_REGISTRATION=false
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Development Workflow
- Use your preferred IDE for development
- Ensure TypeScript compilation passes
- Run tests before submitting PRs
- Follow the existing code style

## 📝 Code Style

- **ESLint**: Extended with React and TypeScript rules
- **Prettier**: Code formatting with consistent style
- **TypeScript**: Strict mode enabled for type safety
- **Import Organization**: Absolute imports with path aliases
- **Component Structure**: Functional components with hooks

## 🐛 Troubleshooting

### Common Issues

1. **Supabase Connection Issues**
   - Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correctly set
   - Check Supabase project status and quotas

2. **Authentication Problems**
   - Ensure RLS policies are properly configured in Supabase
   - Check user roles in the users table
   - Verify JWT token is being passed correctly

3. **Build Errors**
   - Clear `node_modules` and `dist` folders
   - Run `npm install` to reinstall dependencies
   - Check TypeScript errors with `npm run type-check`

4. **Vite Development Issues**
   - Port 5173 might be in use, Vite will suggest an alternative
   - Clear browser cache if hot reload isn't working
   - Check for conflicting extensions or proxy settings

### Performance Issues
- Use React Developer Tools Profiler
- Check Network tab for slow API calls
- Analyze bundle size with `npm run build` output
- Monitor memory usage in development

## 📚 Documentation & Resources

- [Vite Documentation](https://vitejs.dev/guide/)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Supabase Documentation](https://supabase.com/docs)

## 💡 Development Tips

- Leverage TypeScript's strict mode for better code quality
- Utilize shadcn/ui components for consistent design
- Take advantage of Vite's fast HMR for efficient development
- Use React Developer Tools for debugging components

## 📞 Support

For technical support or questions:
- Create an issue in this repository
- Check the API documentation for backend integration
- Contact the development team

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Vite team for the excellent build tool
- React team for the powerful framework
- Supabase for the backend-as-a-service platform
- shadcn for the beautiful UI components
- The open-source community for various tools and libraries

---



### Quick Links
- 📚 [Backend Repository](link-to-backend-repo)
- 📖 [API Documentation](link-to-api-docs)