
# Prompt Hub - AI Prompt Sharing Platform

## Project Overview

Prompt Hub is a collaborative platform for creating, sharing, and discovering high-quality AI prompts. The application allows users to build a personal collection of effective prompts, share them with the community, and discover prompts created by others.

**URL**: https://lovable.dev/projects/fc5b528f-b2c0-45b2-bf2d-45148494d746

## Core Features

- **Prompt Creation & Management**: Create, edit, and organize your AI prompts
- **Community Sharing**: Share prompts with the community and discover prompts from other users
- **Categories & Tags**: Browse prompts by categories and tags to find exactly what you need
- **Interactive Features**: Star, fork, and comment on prompts
- **User Profiles**: Personalized user profiles with activity tracking

## Tech Stack

This project is built with:

- **Frontend**: React, TypeScript, Tailwind CSS, shadcn/ui
- **Build Tool**: Vite
- **Backend**: Supabase (Authentication, Database, Storage)
- **State Management**: TanStack Query
- **Routing**: React Router

## Getting Started

### Using Lovable

Simply visit the [Lovable Project](https://lovable.dev/projects/fc5b528f-b2c0-45b2-bf2d-45148494d746) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

### Local Development

If you want to work locally using your own IDE, you can clone this repo and push changes:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

### Editing in GitHub

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

### Using GitHub Codespaces

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## Deployment

Simply open [Lovable](https://lovable.dev/projects/fc5b528f-b2c0-45b2-bf2d-45148494d746) and click on Share -> Publish.

## Custom Domain Setup

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## Database Schema

The project uses a Supabase database with the following key tables:

- `prompts`: Stores all user-created prompts
- `profiles`: Contains user profile information
- `prompt_stars`: Tracks which users have starred which prompts
- `shared_prompts`: Records of which prompts have been shared with specific users
- `tutorials`: Educational content related to prompt engineering

For a detailed overview of the database structure, see [Database Structure](./src/docs/database-structure.md)

## Contributing

We welcome contributions from the community! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
