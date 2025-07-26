# EventX

EventX is a modern, full-featured event management platform built with Next.js 15, TypeScript, and Tailwind CSS. It provides a comprehensive solution for creating, managing, and organizing events with a beautiful, responsive interface that supports both light and dark themes.

## ✨ Features

### 🎯 Core Functionality

- **Event Management**: Create, read, update, and delete events with comprehensive details
- **Event Types**: Support for Online, In-Person, and Hybrid events
- **Categories**: Organize events by Conference, Workshop, Seminar, Webinar, and custom categories
- **Real-time Status**: Automatic event status tracking (Upcoming, Live Now, Completed)

### 🔐 Authentication

- **User Registration**: Signup email and password
- **Login System**: Email/password authentication with session management
- **Protected Routes**: Middleware-based route protection for dashboard access
- **Local Storage**: Client-side user data persistence

### 🎨 User Interface

- **Modern Design**: Clean, professional interface using shadcn/ui components
- **Dark Mode**: Full dark/light theme support with next-themes
- **Responsive**: Mobile-first design that works on all screen sizes
- **Accessibility**: WCAG compliant with proper ARIA labels and keyboard navigation

### 📱 Event Views

- **Grid/List Toggle**: Switch between card grid and detailed list views
- **Advanced Filtering**: Search by title, filter by type, category, and date range
- **Sorting Options**: Sort by date or title in ascending/descending order
- **Detailed Pages**: Dedicated pages for individual event details

### 🛠 Developer Experience

- **TypeScript**: Full type safety throughout the application
- **Form Validation**: Zod schema validation with react-hook-form
- **Component Library**: Reusable UI components with shadcn/ui
- **Code Organization**: Clean architecture with separation of concerns

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd eventx
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   └── auth/                 # Authentication endpoints
│   │       ├── login/
│   │       │   └── route.ts      # Login API endpoint
│   │       ├── logout/
│   │       │   └── route.ts      # Logout API endpoint
│   │       └── session/
│   │           └── route.ts      # Session management
│   ├── check-email/
│   │   └── page.tsx              # Email verification page
│   ├── dashboard/                # Protected dashboard
│   │   ├── events/
│   │   │   └── [uuid]/
│   │   │       └── page.tsx      # Dynamic event detail pages
│   │   ├── layout.tsx            # Dashboard layout
│   │   └── page.tsx              # Dashboard home
│   ├── login/
│   │   └── page.tsx              # Login page
│   ├── signup/
│   │   └── page.tsx              # Registration page
│   ├── favicon.ico               # Site favicon
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── components/                   # Reusable components
│   ├── auth/                     # Authentication components
│   │   ├── login-form.tsx        # Login form component
│   │   └── signup-form.tsx       # Registration form component
│   ├── events/                   # Event management components
│   │   ├── event-card.tsx        # Event card display
│   │   ├── event-details.tsx     # Event detail view
│   │   ├── event-filters.tsx     # Event filtering controls
│   │   ├── event-form.tsx        # Event creation/edit form
│   │   ├── event-list-item.tsx   # List view item
│   │   └── events-listing.tsx    # Events listing container
│   ├── ui/                       # shadcn/ui components
│   │   ├── alert-dialog.tsx      # Alert dialog component
│   │   ├── alert.tsx             # Alert component
│   │   ├── avatar.tsx            # User avatar component
│   │   ├── badge.tsx             # Badge component
│   │   ├── button.tsx            # Button component
│   │   ├── calendar.tsx          # Calendar component
│   │   ├── card.tsx              # Card component
│   │   ├── dialog.tsx            # Dialog component
│   │   ├── dropdown-menu.tsx     # Dropdown menu component
│   │   ├── form.tsx              # Form components
│   │   ├── input.tsx             # Input component
│   │   ├── label.tsx             # Label component
│   │   ├── navigation-menu.tsx   # Navigation menu
│   │   ├── popover.tsx           # Popover component
│   │   ├── select.tsx            # Select component
│   │   └── textarea.tsx          # Textarea component
│   ├── account-dropdown.tsx      # User account menu
│   ├── dashboard-navbar.tsx      # Dashboard navigation
│   ├── navbar.tsx                # Main navigation
│   ├── theme-provider.tsx        # Theme context provider
│   └── theme-toggle.tsx          # Dark mode toggle
├── hooks/                        # Custom React hooks
│   └── useLocalStorage.ts        # Local storage hook
├── lib/                          # Utility libraries
│   ├── auth/                     # Authentication logic
│   │   ├── auth-context.tsx      # Auth context provider
│   │   ├── auth-utils.ts         # Auth utility functions
│   │   └── types.ts              # Auth type definitions
│   ├── events/                   # Event management logic
│   │   ├── event-constants.ts    # Event-related constants
│   │   ├── event-context.tsx     # Event context provider
│   │   ├── event-utils.ts        # Event utility functions
│   │   └── types.ts              # Event type definitions
│   └── utils.ts                  # General utilities
├── schemas/                      # Zod validation schemas
│   ├── auth.ts                   # Authentication schemas
│   └── event.ts                  # Event validation schemas
├── utils/                        # Additional utilities
└── middleware.ts                 # Next.js middleware
```

## 🔧 Key Technologies

### Frontend

- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Modern component library
- **next-themes**: Dark mode support

### State Management

- **React Context**: Global state management
- **Local Storage**: Client-side data persistence
- **React Hook Form**: Form state management

### Validation & Forms

- **Zod**: Schema validation
- **React Hook Form**: Form handling
- **@hookform/resolvers**: Form validation integration

### Utilities

- **date-fns**: Date manipulation
- **clsx & tailwind-merge**: Conditional styling
- **Lucide React**: Icon library

## 🎨 UI Components

The application uses a comprehensive set of UI components from shadcn/ui:

- **Layout**: Card, Dialog, Popover
- **Forms**: Input, Textarea, Select, Button, Label
- **Data Display**: Badge, Avatar, Calendar
- **Navigation**: Dropdown Menu, Navigation Menu
- **Feedback**: Alert Dialog, Alert notifications

## 🔐 Authentication Flow

1. **Registration**: Users create accounts with email/password
2. **Validation**: Client-side validation with Zod schemas
3. **Storage**: User data stored in localStorage
4. **Session**: HTTP-only cookies for session management
5. **Protection**: Middleware protects dashboard routes

### API Endpoints

- `POST /api/auth/login` - User authentication
- `POST /api/auth/logout` - Session termination
- `GET /api/auth/session` - Session validation

## 📊 Event Management

### Event Types

- **Online**: Virtual events with meeting links
- **In-Person**: Physical events with location details
- **Hybrid**: Combined online and physical attendance

### Event Lifecycle

1. **Creation**: Form-based event creation with validation
2. **Storage**: Events stored in localStorage with UUID
3. **Display**: Grid/list views with filtering and sorting
4. **Details**: Dedicated pages for comprehensive event information
5. **Management**: Edit, delete, and share functionality

## 🎯 Features in Detail

### Dashboard

- Event overview with statistics
- Quick access to create new events
- Recent events display
- User account management

### Event Listing

- **View Modes**: Toggle between grid and list layouts
- **Search**: Real-time search across event titles and descriptions
- **Filters**: Filter by event type, category, and date range
- **Sorting**: Sort by date or alphabetically
- **Status Indicators**: Visual status badges for event states

### Event Details

- **Comprehensive Information**: Full event details with organized layout
- **Actions**: Edit, delete, and share functionality
- **Responsive Design**: Optimized for all screen sizes
- **Organizer Information**: Contact details and event metadata

## 🔄 Data Flow

1. **User Authentication**: Login/signup → Session creation → Dashboard access
2. **Event Creation**: Form submission → Validation → Storage → UI update
3. **Event Management**: CRUD operations → Context updates → UI refresh
4. **Filtering/Search**: User input → Filter application → Results display

## 🚀 Deployment

The application is ready for deployment on Vercel or any Next.js-compatible platform:

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel**
   ```bash
   npx vercel
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [shadcn/ui](https://ui.shadcn.com/) - Component library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Lucide](https://lucide.dev/) - Icon library
- [Vercel](https://vercel.com/) - Deployment platform

---

**EventX** - Making event management simple and beautiful. ✨