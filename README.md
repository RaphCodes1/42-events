# 42 Calendar

A modern event management platform built for the 42 community, allowing users to discover, manage, and participate in various events.

## Features

### User Features
- **Event Discovery**
  - Browse upcoming events with a modern, responsive interface
  - Filter events by categories (Conference, Workshop, Meetup, Exhibition, Other)
  - Search events by title, description, or location
  - Sort events by date or title
  - Dark/Light mode support

- **Event Management**
  - Subscribe to events to track your participation
  - View event details including date, location, and description
  - Filter to view only your subscribed events
  - Responsive design for both desktop and mobile devices

### Admin Features
- **Event Administration**
  - Create, edit, and delete events
  - Manage event details (title, description, date, location, category)
  - Real-time updates to the event list
  - Secure admin access control

- **User Management**
  - Secure authentication system
  - Role-based access control (Admin/User roles)
  - User session management

## Tech Stack

### Frontend
- **Framework**: Next.js 14 (React)
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Icons**: Lucide Icons
- **UI Components**: Custom components with Tailwind CSS

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Real-time Updates**: Supabase Realtime
- **Storage**: Supabase Storage

### Development Tools
- **Language**: TypeScript
- **Package Manager**: npm
- **Version Control**: Git
- **Deployment**: Vercel

## Dependencies

### Core Dependencies
```json
{
  "next": "^14.x",
  "react": "^18.x",
  "react-dom": "^18.x",
  "typescript": "^5.x",
  "zustand": "^4.x",
  "framer-motion": "^10.x",
  "lucide-react": "^0.x",
  "@supabase/supabase-js": "^2.x",
  "tailwindcss": "^3.x",
  "postcss": "^8.x",
  "autoprefixer": "^10.x"
}
```

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/42-events.git
cd 42-events
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory with the following variables:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
42-events/
├── src/
│   ├── app/                 # Next.js app directory
│   ├── components/         # React components
│   │   ├── events/        # Event-related components
│   │   └── ui/            # Reusable UI components
│   ├── store/             # Zustand stores
│   ├── types/             # TypeScript type definitions
│   ├── lib/               # Utility functions and configurations
│   └── data/              # Mock data and data fetching functions
├── public/                # Static assets
└── ...config files
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- 42 School for inspiration
- Next.js team for the amazing framework
- Supabase for the backend infrastructure
- All contributors who have helped shape this project
