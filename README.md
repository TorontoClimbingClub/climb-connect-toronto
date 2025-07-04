# Climb Connect Toronto

A social platform for the Toronto climbing community. Connect with local climbers, join events, chat in real-time, and build the climbing community together.

## Features

### 🧗‍♀️ **Community Chat**
- Real-time messaging with the climbing community
- Message search and history
- User profiles with avatars
- Typing indicators and message reactions
- @username mentions and emoji reactions
- Message editing with revision history

### 📅 **Events System**
- Create and manage climbing events
- Event-specific chat rooms for participants
- Participant tracking and limits
- Location and date management

### 👥 **User Profiles**
- Customizable profiles with display names and avatars
- Authentication and secure access
- User presence and activity status

### 🎨 **Modern UI**
- Responsive design with mobile-first approach
- Dark/light theme support
- Clean, intuitive interface built with shadcn/ui
- Professional chat experience similar to Discord/Slack

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Components**: shadcn/ui + Radix UI + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Real-time + Auth + Storage)
- **State Management**: React Query + React Context
- **Routing**: React Router DOM
- **Forms**: React Hook Form + Zod validation

## Database Architecture

### Core Tables
- `profiles` - User profiles extending auth.users
- `messages` - Main community chat messages
- `events` - Climbing events with location and participation
- `event_participants` - Junction table for event attendance
- `event_messages` - Event-specific chat messages

### Advanced Chat Features
- `message_reactions` - Emoji reactions with user attribution
- `typing_indicators` - Real-time typing status tracking
- Enhanced messages with editing, mentions, and reactions

### Security
- Row Level Security (RLS) policies on all tables
- Authenticated access with proper permissions
- Secure file storage for avatars

## Development

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account and project

### Local Development

1. **Clone the repository**
   ```bash
   git clone git@github.com:TorontoClimbingClub/climb-connect-toronto.git
   cd climb-connect-toronto
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create `.env.local` with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Access the app**
   Open [http://localhost:8080](http://localhost:8080)

### Database Setup

1. **Run migrations**
   Apply the SQL migrations in `supabase/migrations/` to set up:
   - Basic schema (profiles, messages, events)
   - Enhanced chat features (reactions, typing indicators, editing)
   - RLS policies and security

2. **Configure Authentication**
   Set up Supabase Auth with email/password or social providers

### Build for Production

```bash
npm run build
```

## Architecture

### Component Structure
- `src/components/` - Reusable UI components
- `src/pages/` - Main application pages (Home, Chat, Events, Profile)
- `src/hooks/` - Custom React hooks for Supabase integration
- `src/utils/` - Utility functions and helpers
- `src/integrations/` - External service integrations (Supabase)

### Key Components
- `Layout` - Main app layout with navigation
- `enhanced-realtime-chat` - Advanced chat with all features
- `NavBar` - Responsive navigation
- `Auth` - Authentication forms and logic

### Real-time Features
- Supabase postgres_changes subscriptions
- Real-time message updates
- Typing indicators and presence
- Live reactions and editing

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Community

Join the Toronto climbing community and help build this platform together!

- **GitHub**: [TorontoClimbingClub/climb-connect-toronto](https://github.com/TorontoClimbingClub/climb-connect-toronto)
- **Issues**: Report bugs and request features
- **Discussions**: Share ideas and get help

---

Built with ❤️ by the Toronto Climbing Club