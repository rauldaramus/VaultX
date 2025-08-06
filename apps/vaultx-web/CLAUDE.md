# CLAUDE.md

This file provides comprehensive guidance to Claude Code (claude.ai/code) when working with the VaultX codebase.

## Project Overview

VaultX is a modern, secure secrets management platform built with cutting-edge web technologies. The application enables users to create, manage, and securely share secrets with advanced security features including expiration, view limits, and access tracking.

### Technology Stack
- **Frontend Framework**: Next.js 15 with App Router
- **React Version**: React 19 with modern hooks and concurrent features
- **Language**: TypeScript with strict mode enabled
- **Styling**: Tailwind CSS with custom dark theme (default)
- **UI Components**: Radix UI primitives with shadcn/ui architecture
- **State Management**: Zustand with localStorage persistence
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **Animation**: Tailwind CSS animations with custom keyframes

## Development Commands

```bash
npm run dev        # Start development server with Turbopack
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint linting
```

## Architecture

### File Structure
The project follows a **Feature-Sliced Design** architecture pattern:

```
├── src/
│   ├── entities/           # Business entities
│   │   └── user/          # User entity with types
│   ├── features/          # Feature modules (business logic)
│   │   ├── auth/          # Authentication & sessions
│   │   ├── secrets/       # Secrets management
│   │   ├── dashboard/     # Analytics & overview
│   │   ├── api-management/# API tokens & usage
│   │   └── user-settings/ # Account & settings
│   ├── shared/           # Shared utilities & components
│   │   ├── components/   # Reusable UI components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utility functions
│   │   └── types/        # Shared TypeScript types
│   └── widgets/          # Page-level components
│       ├── dashboard-sidebar/
│       └── dashboard-footer/
├── app/                  # Next.js App Router
│   ├── (dashboard)/      # Dashboard layout group
│   │   ├── home/         # Dashboard overview
│   │   ├── secrets/      # Secrets management
│   │   ├── security/     # Security settings
│   │   ├── api/          # API management
│   │   └── settings/     # User settings
│   ├── (public)/         # Public pages (no auth)
│   │   └── login/        # Authentication page
│   ├── create/           # Create secret (standalone)
│   └── layout.tsx        # Root layout with providers
```

### Data Flow Architecture
The application follows a strict data flow pattern for maximum maintainability and backend integration readiness:

```
Components → Hooks → API Mocks → TypeScript Types
```

- **Components**: Pure UI components that consume data from hooks
- **Hooks**: Custom hooks that abstract API calls and state management
- **API Mocks**: Simulated backend services with realistic data (`*/api/mock.ts`)
- **Types**: Comprehensive TypeScript interfaces defining all data structures

## Key Features

### 🔐 Authentication System
- **Login/Register**: Full authentication flow with form validation
- **Session Management**: Active sessions tracking with device info
- **Auth Store**: Zustand-based state with localStorage persistence
- **Route Protection**: Automatic redirection based on auth state

### 🔒 Secrets Management
- **CRUD Operations**: Create, read, update, delete secrets
- **Security Features**: Password protection, view limits, IP restrictions
- **Expiration System**: Time-based automatic secret expiration
- **Status Tracking**: Active, Viewed, Expired states with visual indicators
- **Search & Filter**: Real-time search with status and date filters

### 📊 Dashboard & Analytics
- **Overview Cards**: Key metrics with trend indicators
- **Interactive Charts**: 
  - Bar chart for secret activity (7-day trend)
  - Animated pie chart for status distribution (Active/Viewed/Expired)
- **Recent Activity**: Timeline of user actions
- **Security Recommendations**: AI-powered security suggestions

### 🛡️ Security Settings
- **Two-Factor Authentication**: 2FA setup and management
- **Active Sessions**: View and manage device sessions
- **Security Configuration**: Password policies and security rules

### 🔌 API Management
- **Token Management**: Create, regenerate, and manage API tokens
- **Usage Analytics**: Track API consumption and limits
- **Documentation Access**: External API documentation integration

### ⚙️ User Settings
- **Account Management**: Profile information and password changes
- **Consolidated Layout**: Two-column layout (Account Info + Password)
- **Danger Zone**: Account deletion with confirmation

## UI/UX Design System

### Theme & Colors
- **Default Theme**: Dark mode with pure black background (`0 0% 0%`)
- **Card Backgrounds**: Very dark gray (`0 0% 3%`) for subtle contrast
- **Color Palette**:
  - Primary: White (`210 40% 98%`)
  - Success/Active: Green variants (`green-300`, `green-500`)
  - Warning/Expired: Yellow variants (`yellow-300`, `yellow-500`)
  - Danger/Viewed: Red variants (`red-300`, `red-500`)

### Visual Indicators
- **Secret States**:
  - 🔒 **Active**: Green pulsing lock icon + green badge
  - 👁️ **Viewed**: Gray eye icon + red badge
  - ⏰ **Expired**: Gray clock icon + yellow badge

### Animations & Effects
- **Page Transitions**: Fade-in-up with staggered delays (0.1s, 0.2s, 0.3s)
- **Interactive Elements**: Hover scaling, color transitions, glow effects
- **Chart Animations**: Progressive circle completion, smooth transitions
- **Consistent Timing**: 200-300ms transitions throughout

### Button System
- **Primary Actions**: White buttons with gray borders and hover effects
- **Consistent Styling**: All major buttons use same white theme
- **Interactive Feedback**: Hover scaling (105%) and glow effects

## State Management

### Zustand Auth Store
```typescript
interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
  // ... other auth methods
}
```

### Persistence
- **localStorage Integration**: Auth state persists across sessions
- **Automatic Hydration**: State restored on app initialization
- **Sync External Store**: React 18 compatible state synchronization

## Component Patterns

### Hook-Based Data Fetching
```typescript
// Example: Dashboard data consumption
const { stats, activity, recommendations, loading, error } = useDashboardData()

// Example: Secrets management
const { secrets, createSecret, updateSecret, loading } = useSecretsData()
```

### Form Handling
```typescript
// React Hook Form + Zod validation pattern
const form = useForm<CreateSecretRequest>({
  resolver: zodResolver(createSecretSchema),
  defaultValues: { /* ... */ }
})
```

### API Mock Structure
```typescript
// Standardized API response format
export const createSuccessResponse = <T>(
  data: T, 
  message: string = "Success"
): ApiResponse<T> => ({
  success: true,
  data,
  message,
  timestamp: new Date().toISOString()
})
```

## Route Structure

### Dashboard Routes (Authenticated)
- `/` → Redirects to `/home` or `/login`
- `/home` → Dashboard overview with analytics
- `/secrets` → Secrets management interface
- `/security` → Security settings (2FA, sessions)
- `/api` → API management (tokens, usage)
- `/settings` → User account settings
- `/create` → Create new secret (standalone page)

### Public Routes
- `/login` → Authentication interface

### Layout Groups
- **Dashboard Layout**: Sidebar navigation, breadcrumbs, footer
- **Public Layout**: Minimal layout for authentication

## Backend Integration Readiness

### API Mock Layer
All business logic uses a mock API layer that simulates real backend responses:

```typescript
// Example mock structure
export const getDashboardStats = async (): Promise<ApiResponse<DashboardStats>> => {
  await simulateDelay(800) // Realistic loading time
  return createSuccessResponse(mockDashboardData)
}
```

### TypeScript Contracts
Comprehensive interfaces define all data structures:
```typescript
interface Secret {
  id: string
  title: string
  content: string
  isPasswordProtected: boolean
  expiresAt: string
  status: "Active" | "Viewed" | "Expired"
  viewCount: number
  maxViews?: number
  // ... additional security fields
}
```

### Migration Strategy
Backend integration requires only changing import statements:
```typescript
// Current: Mock import
import { getSecrets } from '../api/mock'

// Future: Real API import  
import { getSecrets } from '../api/service'
```

## Development Guidelines

### Code Conventions
- **TypeScript Strict Mode**: Full type safety enforced
- **ESLint Configuration**: Next.js recommended rules
- **Path Aliases**: Use `@/*` for clean imports
- **Component Structure**: One component per file with co-located types

### Security Best Practices
- **No Hardcoded Data**: All business data flows through API layer
- **Type Safety**: Comprehensive TypeScript coverage
- **Input Validation**: Zod schemas for all forms
- **Auth Protection**: Route-level authentication guards

### Performance Optimizations
- **Turbopack**: Fast development builds
- **Component Optimization**: React.memo where appropriate
- **Bundle Splitting**: Automatic code splitting via Next.js
- **Image Optimization**: Next.js Image component

## Testing Strategy

### Mock Data Quality
- **Realistic Data**: All mocks simulate production scenarios
- **Edge Cases**: Error states and loading conditions covered
- **Consistency**: Standardized response formats across features

### Component Testing
- **Hook Testing**: Custom hooks isolated and testable
- **UI Testing**: Components pure and predictable
- **Integration Testing**: Full user flows supported by mocks

## Deployment Considerations

### Build Configuration
- **Production Ready**: Optimized builds with Next.js 15
- **Environment Variables**: Configurable API endpoints
- **Static Generation**: Optimal performance with SSG where applicable
- **Progressive Enhancement**: Graceful degradation support

### Performance Metrics
- **Core Web Vitals**: Optimized for Google's performance standards
- **Bundle Size**: Minimized with tree shaking and code splitting
- **Loading States**: Smooth user experience during data fetching

## Future Roadmap

### Backend Integration
1. **API Endpoints**: Implement REST/GraphQL services matching mock interfaces
2. **Database Models**: Create schemas matching TypeScript interfaces  
3. **Authentication**: JWT or session-based auth system
4. **Real-time Updates**: WebSocket integration for live updates
5. **File Upload**: Secure file handling for secret attachments

### Enhanced Features
1. **Team Collaboration**: Multi-user secret sharing
2. **Audit Logging**: Comprehensive activity tracking
3. **Advanced Security**: Biometric authentication, encrypted storage
4. **Mobile App**: React Native companion app
5. **Enterprise Features**: SSO, RBAC, compliance reporting

---

## 📋 COMPREHENSIVE CODE ANALYSIS & IMPROVEMENT PLAN

### **🚨 CRITICAL ISSUES IDENTIFIED (August 2025)**

#### **🔴 BLOCKER - Immediate Action Required:**

1. **TypeScript Compilation Error**
   - **File**: `src/features/dashboard/components/recent-activity.tsx:65`
   - **Issue**: Unclosed JSX tags causing build failure
   - **Impact**: Application won't compile in production
   - **Status**: ⚠️ CRITICAL

2. **Dangerous Build Configuration**
   - **File**: `next.config.mjs:3-8`
   - **Issue**: `ignoreBuildErrors: true` and `ignoreDuringBuilds: true`
   - **Impact**: Masks critical errors and security vulnerabilities
   - **Status**: ⚠️ CRITICAL

3. **Security Vulnerabilities**
   - **File**: `src/features/auth/model/auth.store.ts:20-25`
   - **Issue**: Tokens stored in localStorage (XSS vulnerable)
   - **Impact**: Authentication bypass potential
   - **Status**: ⚠️ CRITICAL

#### **🟡 HIGH PRIORITY - Quality Blockers:**

4. **Type Safety Violations**
   - **File**: `src/shared/types/api.ts:3`
   - **Issue**: Generic `ApiResponse<T = any>` uses any type
   - **Count**: 8+ files with `any`/`unknown` types
   - **Impact**: Eliminates TypeScript benefits
   - **Status**: 🟡 HIGH

5. **Production Debug Code**
   - **Files**: 9 instances across codebase
   - **Issue**: `console.log` statements in production code
   - **Example**: `src/features/auth/components/SSOButtons.tsx:48`
   - **Status**: 🟡 HIGH

6. **Authentication Security Gaps**
   - **Issue**: No systematic route protection
   - **Impact**: Potential unauthorized access
   - **Files**: All dashboard routes lack auth guards
   - **Status**: 🟡 HIGH

#### **🟠 MEDIUM PRIORITY - Architecture Issues:**

7. **Inconsistent Error Handling** 
   - **Issue**: Different error patterns across features
   - **Impact**: Poor UX and debugging difficulty
   - **Status**: 🟠 MEDIUM

8. **Missing Error Boundaries**
   - **Issue**: No React error boundaries for crash recovery
   - **Impact**: App crashes propagate to users
   - **Status**: 🟠 MEDIUM

9. **Performance Issues**
   - **File**: `src/features/secrets/hooks/use-secrets-data.ts:76-78`
   - **Issue**: Unstable useEffect dependencies causing excessive re-renders
   - **Status**: 🟠 MEDIUM

10. **Form Validation Gaps**
    - **File**: `src/features/auth/components/LoginForm.tsx`
    - **Issue**: Missing input sanitization, rate limiting, CSRF protection
    - **Status**: 🟠 MEDIUM

### **📋 IMPROVEMENT ROADMAP**

#### **Phase 1: Critical Fixes (2-3 days)**
- [ ] Fix TypeScript compilation error in recent-activity.tsx
- [ ] Remove dangerous build configuration settings
- [ ] Implement secure token storage mechanism
- [ ] Add authentication route guards

#### **Phase 2: Quality Enhancement (1 week)**
- [ ] Eliminate all `any` types with proper TypeScript definitions
- [ ] Remove console statements and implement proper logging service
- [ ] Create consistent error handling patterns across features
- [ ] Implement React Error Boundaries

#### **Phase 3: Architecture Improvements (1 week)**
- [ ] Add comprehensive input validation and sanitization
- [ ] Implement performance optimizations (memoization, code splitting)
- [ ] Create unit and integration test suite
- [ ] Add comprehensive API documentation

#### **Phase 4: Portfolio Polish (3-5 days)**
- [ ] Implement advanced security features (CSRF, rate limiting)
- [ ] Add accessibility improvements (ARIA labels, keyboard navigation)
- [ ] Create comprehensive README with demo instructions
- [ ] Add monitoring and analytics setup

### **🛠️ TECHNICAL DEBT TRACKING**

#### **Security Debt:**
- Token storage vulnerability (localStorage → secure httpOnly cookies)
- Missing CSRF protection on forms
- Hardcoded credentials in mock data
- No input sanitization on user inputs

#### **Performance Debt:**
- Bundle size optimization needed (unused Radix components)
- Missing code splitting for feature modules
- Excessive re-renders in secrets management
- No image optimization strategy

#### **Maintainability Debt:**
- Inconsistent error handling patterns
- Missing component prop documentation
- No Architecture Decision Records (ADRs)
- Insufficient test coverage

### **🏆 PORTFOLIO-READY STANDARDS**

#### **Code Quality Checklist:**
- [ ] 100% TypeScript type coverage (no `any` types)
- [ ] Comprehensive error handling with user-friendly messages
- [ ] Security-first authentication and authorization
- [ ] Performance optimized (Core Web Vitals compliance)
- [ ] Accessible UI (WCAG 2.1 AA compliance)
- [ ] Well-documented API and components
- [ ] Comprehensive test suite (unit + integration + e2e)
- [ ] Clean git history with meaningful commits

#### **Professional Standards:**
- [ ] Industry-standard security practices
- [ ] Scalable architecture patterns
- [ ] Comprehensive documentation
- [ ] Production-ready deployment configuration
- [ ] Monitoring and observability setup

### **🎯 SUCCESS METRICS**

#### **Current Status (August 2025):**
- **Code Quality**: ❌ 3/10 (critical issues blocking)
- **Security**: ❌ 2/10 (major vulnerabilities)
- **Performance**: 🟡 6/10 (good foundation, needs optimization)
- **Architecture**: ✅ 7/10 (solid FSD pattern)
- **UI/UX**: ✅ 8/10 (excellent design system)

#### **Target Portfolio Status:**
- **Code Quality**: ✅ 9/10
- **Security**: ✅ 9/10  
- **Performance**: ✅ 8/10
- **Architecture**: ✅ 9/10
- **UI/UX**: ✅ 9/10

---

**Last Updated**: August 4, 2025  
**Architecture Status**: 🟡 Needs Critical Fixes  
**Security Status**: ❌ Major Vulnerabilities Present  
**Portfolio Ready**: ❌ Estimated 2-3 weeks with focused effort  
**Next Action**: Fix TypeScript compilation error and remove build ignoring configuration