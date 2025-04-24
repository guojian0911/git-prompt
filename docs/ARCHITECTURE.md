
# Technical Architecture Document
# Prompt Hub: AI Prompt Sharing Platform

## System Overview

Prompt Hub is built as a modern web application using React, TypeScript, and Supabase. The architecture follows a client-server model with the frontend handling UI rendering and state management, while Supabase provides backend services including authentication, database, and storage.

## Architecture Diagram

```
┌─────────────────────────────────────┐
│            Client (Browser)         │
│                                     │
│  ┌─────────────┐    ┌────────────┐  │
│  │   React UI  │    │  TanStack  │  │
│  │ Components  │◄───┤   Query    │  │
│  └─────────────┘    └────────────┘  │
│          │                 ▲        │
│          ▼                 │        │
│  ┌─────────────────────────────┐    │
│  │      React Router           │    │
│  └─────────────────────────────┘    │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│         Supabase Services           │
│                                     │
│  ┌─────────────┐  ┌───────────────┐ │
│  │     Auth    │  │   Database    │ │
│  └─────────────┘  └───────────────┘ │
│  ┌─────────────┐  ┌───────────────┐ │
│  │   Storage   │  │ Edge Functions│ │
│  └─────────────┘  └───────────────┘ │
└─────────────────────────────────────┘
```

## Component Structure

### Frontend Architecture

The frontend follows a component-based architecture with the following key elements:

1. **Pages**: Top-level components that represent entire screens
   - Home/Index
   - PromptDetail
   - SubmitPrompt
   - Profile
   - Categories
   - Authentication pages

2. **Components**: Reusable UI elements
   - Layout components (Navbar, Footer)
   - Prompt-related components (PromptCard, PromptForm, PromptStats)
   - UI components (buttons, inputs, modals)
   
3. **Hooks**: Custom React hooks for shared logic
   - `useAuth`: Authentication state and functions
   - `usePromptForm`: Form handling for prompt creation/editing
   - `usePublicPrompts`: Data fetching for public prompts
   - `usePromptActions`: Actions like starring, forking, etc.

4. **Contexts**: Shared state across components
   - `AuthContext`: User authentication state

5. **Utils**: Utility functions and helpers

### Database Schema

The core database tables and their relationships:

```
┌────────────┐     ┌──────────────┐     ┌──────────────┐
│  profiles  │     │    prompts   │     │ prompt_stars │
├────────────┤     ├──────────────┤     ├──────────────┤
│ id         │◄────┤ user_id      │     │ id           │
│ username   │     │ id           │◄────┤ prompt_id    │
│ avatar_url │     │ title        │     │ user_id      │
└────────────┘     │ description  │     └──────────────┘
                   │ content      │
                   │ category     │     ┌──────────────┐
                   │ tags         │     │shared_prompts│
                   │ is_public    │     ├──────────────┤
                   │ fork_from    │     │ id           │
                   │ stars_count  │     │ prompt_id    │
                   │ fork_count   │     │ shared_by    │
                   │ view_count   │     │ shared_with  │
                   └──────────────┘     └──────────────┘
```

## Data Flow

1. **User Authentication Flow**:
   - User registers/logs in via Supabase Auth
   - Authentication state stored in AuthContext
   - Protected routes check auth status before rendering

2. **Prompt Creation Flow**:
   - User fills PromptForm component
   - Form data validated with React Hook Form
   - On submit, data sent to Supabase database
   - UI updated via TanStack Query cache

3. **Prompt Discovery Flow**:
   - FeaturedPrompts component fetches data via usePublicPrompts hook
   - Data displayed in PromptCard components
   - Pagination/filtering handled by query parameters

4. **Social Interactions Flow**:
   - Star/fork/share actions trigger database updates
   - Counter increments optimistically updated in UI
   - Background refetch ensures data consistency

## Security Considerations

1. **Authentication**: Handled by Supabase Auth with JWT tokens
2. **Authorization**: Row-level security (RLS) policies in Supabase
3. **Data Validation**: Client and server-side validation
4. **API Security**: Supabase handles SQL injection protection

## Performance Optimizations

1. **Data Fetching**: TanStack Query for caching and background refetching
2. **Code Splitting**: React Router for route-based code splitting
3. **Asset Optimization**: Image compression and lazy loading
4. **State Management**: Minimizing unnecessary re-renders

## Development Workflow

1. **Environment**: Vite for fast development and building
2. **Type Safety**: TypeScript for enhanced developer experience
3. **Styling**: Tailwind CSS for utility-first styling
4. **Components**: shadcn/ui for consistent design system

## Deployment Strategy

1. **Hosting**: Deployed via Lovable's publishing feature
2. **CI/CD**: Automatic deployments from code changes
3. **Custom Domain**: Support for connecting custom domains

## Monitoring and Analytics

1. **Error Tracking**: Console logging for development
2. **Performance Monitoring**: Planned for future phases
3. **Usage Analytics**: Planned for future phases

## Future Technical Considerations

1. **Scaling**: Plan for database sharding as content grows
2. **Real-time Features**: Consider Supabase Realtime for collaborative features
3. **API Development**: External API for integrations with AI tools
4. **Mobile App**: Consider React Native for native mobile experience
