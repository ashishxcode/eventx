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

## 📁 Detailed Project Structure

```
src/
├── app/                               # Next.js 15 App Router (Pages & Layouts)
│   ├── api/                           # RESTful API endpoints
│   │   └── auth/                      # Authentication endpoints
│   │       ├── login/
│   │       │   └── route.ts           # POST /api/auth/login - User authentication
│   │       ├── logout/
│   │       │   └── route.ts           # POST /api/auth/logout - Session termination
│   │       └── session/
│   │           └── route.ts           # GET /api/auth/session - Session validation
│   ├── check-email/
│   │   └── page.tsx                   # Email verification confirmation page
│   ├── dashboard/                     # Protected dashboard routes (requires auth)
│   │   ├── events/
│   │   │   └── [uuid]/
│   │   │       └── page.tsx           # Dynamic event detail view (/dashboard/events/{uuid})
│   │   ├── layout.tsx                 # Dashboard layout with navigation & auth context
│   │   └── page.tsx                   # Dashboard home with event overview
│   ├── login/
│   │   └── page.tsx                   # User login page with form validation
│   ├── signup/
│   │   └── page.tsx                   # User registration page
│   ├── favicon.ico                    # Site favicon
│   ├── globals.css                    # Global CSS with Tailwind directives
│   ├── layout.tsx                     # Root layout with theme provider & fonts
│   └── page.tsx                       # Landing page with hero section
│
├── components/                        # Reusable React components
│   ├── auth/                          # Authentication-related components
│   │   ├── login-form.tsx             # Login form with React Hook Form & Zod validation
│   │   └── signup-form.tsx            # Registration form with validation
│   ├── events/                        # Event management components
│   │   ├── event-card.tsx             # Event card for grid view (with status badges)
│   │   ├── event-details.tsx          # Detailed event view with edit/delete actions
│   │   ├── event-filters.tsx          # Advanced filtering UI (search, type, category, date)
│   │   ├── event-form.tsx             # Event creation/editing form with validation
│   │   └── events-listing.tsx         # Main events container with grid/list toggle
│   ├── ui/                            # shadcn/ui component library
│   │   ├── alert-dialog.tsx           # Confirmation dialogs (delete events)
│   │   ├── alert.tsx                  # Toast notifications & alerts
│   │   ├── avatar.tsx                 # User avatar with fallback initials
│   │   ├── badge.tsx                  # Status badges (Live, Upcoming, Completed)
│   │   ├── button.tsx                 # Primary/secondary/outline button variants
│   │   ├── calendar.tsx               # Date picker for event dates
│   │   ├── card.tsx                   # Card container for events & forms
│   │   ├── dialog.tsx                 # Modal dialogs for forms
│   │   ├── dropdown-menu.tsx          # Dropdown menus (user account, filters)
│   │   ├── form.tsx                   # Form field wrappers with error handling
│   │   ├── input.tsx                  # Text input with validation states
│   │   ├── label.tsx                  # Form labels with accessibility
│   │   ├── navigation-menu.tsx        # Main navigation component
│   │   ├── popover.tsx                # Popover containers for filters
│   │   ├── select.tsx                 # Dropdown select inputs
│   │   ├── sheet.tsx                  # Mobile sidebar navigation
│   │   └── textarea.tsx               # Multiline text input for descriptions
│   ├── account-dropdown.tsx           # User account menu with logout
│   ├── dashboard-navbar.tsx           # Dashboard-specific navigation
│   ├── navbar.tsx                     # Main site navigation with auth state
│   ├── theme-provider.tsx             # Dark/light theme context provider
│   └── theme-toggle.tsx               # Theme switcher button
│
├── hooks/                             # Custom React hooks
│   ├── useEventFilters.tsx            # Advanced filtering with URL state sync
│   └── useLocalStorage.ts             # Persistent localStorage state management
│
├── lib/                               # Core business logic & utilities
│   ├── auth/                          # Authentication system
│   │   ├── auth-context.tsx           # Global auth state with React Context
│   │   ├── auth-utils.ts              # Password hashing, session management
│   │   └── types.ts                   # TypeScript interfaces for User, Session
│   ├── events/                        # Event management system
│   │   ├── event-constants.ts         # Event types, categories, status enums
│   │   ├── event-context.tsx          # Global event state with CRUD operations
│   │   ├── event-utils.ts             # Event filtering, sorting, conflict detection
│   │   └── types.ts                   # TypeScript interfaces for Event, Filter
│   └── utils.ts                       # General utilities (cn, date formatting)
│
├── schemas/                           # Zod validation schemas
│   ├── auth.ts                        # Login/signup form validation rules
│   └── event.ts                       # Event form validation with business rules
│
├── utils/                             # Additional utility functions
└── middleware.ts                      # Next.js middleware for route protection
```

### 🏗️ Technical Architecture

#### **Layer Architecture**
```
┌─────────────────────────────────────┐
│           Presentation Layer        │  ← React Components + UI
├─────────────────────────────────────┤
│           Business Logic Layer      │  ← Contexts + Hooks + Utils
├─────────────────────────────────────┤
│           Data Access Layer         │  ← localStorage + API Routes
├─────────────────────────────────────┤
│           Infrastructure Layer      │  ← Next.js + Middleware
└─────────────────────────────────────┘
```

#### **Component Hierarchy**
```
App Router (layout.tsx)
├── ThemeProvider
├── AuthProvider
│   ├── EventProvider
│   │   ├── Pages (Dashboard, Login, etc.)
│   │   ├── Navigation Components
│   │   └── Event Components
│   │       ├── EventsListing
│   │       ├── EventFilters
│   │       ├── EventCard/Details
│   │       └── EventForm
│   └── UI Components (shadcn/ui)
└── Middleware (Route Protection)
```

## 🔧 Key Technologies

### Frontend

- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Modern component library
- **next-themes**: Dark mode support

### State Management & Patterns

- **React Context**: Global state with provider pattern for auth & events
- **Custom Hooks**: Encapsulated business logic (`useEventFilters`, `useLocalStorage`)
- **Local Storage**: Client-side persistence with automatic serialization
- **React Hook Form**: Declarative form state with Zod integration
- **URL State Sync**: Filter persistence in URL parameters for sharing/bookmarking

#### **State Architecture Patterns**

```typescript
// Context Pattern with TypeScript
interface EventContextType {
  events: Event[];
  addEvent: (event: EventInput) => boolean;
  updateEvent: (uuid: string, event: EventInput) => boolean;
  deleteEvent: (uuid: string) => void;
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
}

// Custom Hook Pattern with Business Logic
export function useEventFilters(): UseEventFiltersReturn {
  const { events, filters, setFilters } = useEvents();
  const router = useRouter();
  
  // URL synchronization + immediate filter application
  const applyFiltersImmediate = useCallback(...);
  
  return {
    filteredAndSortedEvents,
    hasActiveFilters,
    eventCount,
    actions: { setSearchTerm, setSelectedType, ... }
  };
}

// Validation Schema Pattern
export const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  eventType: z.enum(["Online", "In-Person", "Hybrid"]),
  // Multi-step validation with business rules
}).refine(data => data.endDate > data.startDate, {
  message: "End date must be after start date"
});
```

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

## 🔄 Comprehensive Data Flow

### **1. Authentication Flow**
```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐    ┌──────────────┐
│ User Input  │───▶│ Form Submit  │───▶│ Validation  │───▶│ API Route    │
│ (Creds)     │    │ (Zod Schema) │    │ & Hashing   │    │ /auth/login  │
└─────────────┘    └──────────────┘    └─────────────┘    └──────────────┘
                                                                    │
┌─────────────┐    ┌──────────────┐    ┌─────────────┐             │
│ Dashboard   │◀───│ Redirect     │◀───│ Session     │◀────────────┘
│ Access      │    │ Middleware   │    │ Cookie Set  │
└─────────────┘    └──────────────┘    └─────────────┘
```

### **2. Event Management Flow**
```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐    ┌──────────────┐
│ Event Form  │───▶│ Zod Schema   │───▶│ Business    │───▶│ Event        │
│ Input       │    │ Validation   │    │ Logic Check │    │ Context      │
└─────────────┘    └──────────────┘    └─────────────┘    └──────────────┘
                                              │                     │
                                              ▼                     ▼
                                    ┌─────────────┐    ┌──────────────┐
                                    │ Conflict    │    │ localStorage │
                                    │ Detection   │    │ Persistence  │
                                    └─────────────┘    └──────────────┘
                                                                    │
┌─────────────┐    ┌──────────────┐    ┌─────────────┐             │
│ UI Update   │◀───│ Re-render    │◀───│ State       │◀────────────┘
│ Components  │    │ Components   │    │ Change      │
└─────────────┘    └──────────────┘    └─────────────┘
```

### **3. Advanced Filtering Flow**
```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐    ┌──────────────┐
│ Filter      │───▶│ URL State    │───▶│ Event       │───▶│ Filter       │
│ Input       │    │ Sync         │    │ Context     │    │ Utils        │
└─────────────┘    └──────────────┘    └─────────────┘    └──────────────┘
                                                                    │
┌─────────────┐    ┌──────────────┐    ┌─────────────┐             │
│ Filtered    │◀───│ Sort Apply   │◀───│ Filter      │◀────────────┘
│ Results     │    │ (date/title) │    │ Apply       │
└─────────────┘    └──────────────┘    └─────────────┘
```

### **4. State Management Pattern**
```
┌─────────────────────────────────────────────────────────────────┐
│                        React Context Providers                  │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │ AuthContext │  │EventContext │  │ThemeContext │             │
│  │             │  │             │  │             │             │
│  │ • User      │  │ • Events[]  │  │ • Theme     │             │
│  │ • Login     │  │ • Filters   │  │ • Toggle    │             │
│  │ • Logout    │  │ • CRUD Ops  │  │             │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
├─────────────────────────────────────────────────────────────────┤
│                      Custom Hooks Layer                         │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │useAuth()    │  │useEvents()  │  │useFilters() │             │
│  │             │  │             │  │             │             │
│  │ • Access    │  │ • CRUD      │  │ • URL Sync  │             │
│  │ • Guards    │  │ • State     │  │ • Debounce  │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
├─────────────────────────────────────────────────────────────────┤
│                      Persistence Layer                          │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │localStorage │  │ HTTP Cookies│  │ URL Params  │             │
│  │ • Events    │  │ • Session   │  │ • Filters   │             │
│  │ • User Data │  │ • Auth      │  │ • Sort      │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
└─────────────────────────────────────────────────────────────────┘
```

### **5. Component Communication**
```
┌─────────────────────────────────────────────────────────────────┐
│                         Data Flow Direction                      │
└─────────────────────────────────────────────────────────────────┘

Parent Components                 Child Components
┌─────────────┐                 ┌─────────────┐
│   Layout    │────── props ────▶│  Navbar     │
│             │◀───── events ───│             │
└─────────────┘                 └─────────────┘
        │                               │
        ▼                               ▼
┌─────────────┐                 ┌─────────────┐
│ Dashboard   │────── context ──▶│ EventsList  │
│             │◀───── actions ───│             │
└─────────────┘                 └─────────────┘
        │                               │
        ▼                               ▼
┌─────────────┐                 ┌─────────────┐
│EventProvider│────── state ────▶│ EventCard   │
│             │◀───── callbacks ─│             │
└─────────────┘                 └─────────────┘
```

### **6. Real-time Data Synchronization**
```
User Action → Form Validation → Context Update → localStorage → UI Re-render
     │              │                  │              │             │
     │              │                  │              │             ▼
     │              │                  │              │     ┌─────────────┐
     │              │                  │              │     │ All Related │
     │              │                  │              │     │ Components  │
     │              │                  │              │     │ Update      │
     │              │                  │              │     └─────────────┘
     │              │                  │              │
     │              │                  │              ▼
     │              │                  │     ┌─────────────┐
     │              │                  │     │ Persistent  │
     │              │                  │     │ Storage     │
     │              │                  │     └─────────────┘
     │              │                  │
     │              │                  ▼
     │              │         ┌─────────────┐
     │              │         │ Global State│
     │              │         │ Update      │
     │              │         └─────────────┘
     │              │
     │              ▼
     │     ┌─────────────┐
     │     │ Zod Schema  │
     │     │ Validation  │
     │     └─────────────┘
     │
     ▼
┌─────────────┐
│ Type Safety │
│ & Error     │
│ Handling    │
└─────────────┘
```

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

## 🎯 Interview Highlights

### **Technical Decisions & Architecture**

1. **Next.js 15 App Router**: Leveraged latest features for better performance and developer experience
2. **TypeScript Throughout**: Complete type safety from API to UI components
3. **Context + Custom Hooks**: Clean separation of concerns with reusable business logic
4. **Zod Validation**: Runtime type safety with comprehensive business rules
5. **URL State Management**: Advanced filter persistence for better UX
6. **Component Composition**: Reusable UI components following React best practices

### **Key Engineering Challenges Solved**

- **Real-time Filtering**: Advanced filtering with immediate application and URL synchronization
- **Form Validation**: Multi-step validation with custom business rules (time conflicts, duration checks)
- **State Synchronization**: Multiple state layers (Context, localStorage, URL params) working in harmony
- **Type Safety**: End-to-end TypeScript with strict validation schemas
- **Performance**: Optimized re-renders with proper memoization and callback patterns

### **Production-Ready Features**

- Comprehensive error handling and user feedback
- Responsive design with mobile-first approach
- Accessibility compliance with proper ARIA labels
- Theme system with persistent user preferences
- Route protection with middleware-based authentication
- Clean code architecture with separation of concerns

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