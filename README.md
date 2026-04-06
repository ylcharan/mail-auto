# 📧 Mail Auto

An intelligent email automation platform that combines Gmail integration with AI-powered summarization and reply generation. Built with Next.js, TypeScript, and modern web technologies.

![Next.js](https://img.shields.io/badge/Next.js-16.2.2-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-green)
![Clerk](https://img.shields.io/badge/Clerk-Auth-orange)

## ✨ Features

### 🔐 Authentication

- Secure authentication with Clerk
- User management and session handling
- Protected routes and API endpoints

### 📬 Gmail Integration

- OAuth2 integration with Gmail API
- View inbox and email threads
- Real-time email synchronization
- Thread-based conversation view

### 🤖 AI-Powered Features

- **Email Summarization**: Automatically summarize long email threads
- **Smart Reply Generation**: Generate professional email replies using OpenAI GPT-4o-mini
- **Context-Aware**: Understands email context and generates relevant responses

### 🎨 Modern UI/UX

- Beautiful, responsive design with Tailwind CSS
- Dark mode support
- Smooth animations with GSAP
- Accessible components with Radix UI
- Status indicators with color coding (🟢 Ready, 🟡 Loading, 🔴 Error)

### 🛠️ Developer Experience

- TypeScript for type safety
- ESLint for code quality
- Hot reload development
- Component library with shadcn/ui

## 🚀 Tech Stack

### Frontend

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **Animations**: GSAP
- **Icons**: Phosphor Icons

### Backend

- **Runtime**: Node.js
- **API**: Next.js API Routes
- **Authentication**: Clerk
- **Email API**: Google Gmail API
- **AI**: OpenAI GPT-4o-mini

### Database & Storage

- **Database**: Supabase (optional)
- **State Management**: React Hooks
- **Caching**: Next.js built-in caching

## 📋 Prerequisites

- Node.js 18+
- npm or yarn or pnpm
- Google Cloud Console account (for Gmail API)
- OpenAI API key
- Clerk account (for authentication)

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/ylcharan/mail-auto.git
   cd mail-auto
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:

   ```env
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

   # Google Gmail API
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   NEXT_PUBLIC_GOOGLE_REDIRECT_URI=http://localhost:3000/api/google/callback

   # OpenAI API
   OPENAI_API_KEY=your_openai_api_key

   # Optional: Supabase (if using database features)
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Google API Setup**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Gmail API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs: `http://localhost:3000/api/google/callback`

5. **Clerk Setup**
   - Go to [Clerk Dashboard](https://dashboard.clerk.com/)
   - Create a new application
   - Copy the publishable key and secret key
   - Configure sign-in/sign-up URLs

## 🚀 Running the Application

### Development

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## � Deployment

### Environment Variables for Production

Update your environment variables for production deployment:

```env
# Production URLs
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
NEXT_PUBLIC_CLERK_SIGN_IN_URL=https://yourdomain.com/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=https://yourdomain.com/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=https://yourdomain.com/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=https://yourdomain.com/dashboard

# Production Google OAuth
GOOGLE_REDIRECT_URI=https://yourdomain.com/api/google/callback

# Production Clerk Keys (switch from test to production)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...

# Keep other variables the same
OPENAI_API_KEY=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

### Google OAuth Setup for Production

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Update your OAuth 2.0 credentials:
   - Add your production domain to authorized origins
   - Add production redirect URI: `https://yourdomain.com/api/google/callback`

### Clerk Production Setup

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Switch to production environment
3. Update the following URLs:
   - Home URL: `https://yourdomain.com`
   - Sign-in URL: `https://yourdomain.com/sign-in`
   - Sign-up URL: `https://yourdomain.com/sign-up`
   - After sign-in URL: `https://yourdomain.com/dashboard`
   - After sign-up URL: `https://yourdomain.com/dashboard`

### Recommended Deployment Platforms

#### Vercel (Recommended)

```bash
npm i -g vercel
vercel --prod
```

#### Netlify

```bash
npm run build
# Deploy the .next folder
```

#### Railway/DigitalOcean

- Connect your repository
- Set environment variables
- Deploy automatically

### Post-Deployment Checklist

- [ ] Update Google OAuth redirect URIs
- [ ] Switch Clerk to production keys and URLs
- [ ] Set `NEXT_PUBLIC_BASE_URL` to your production domain
- [ ] Test authentication flow
- [ ] Test Gmail integration
- [ ] Test AI features (summarization and reply generation)
- [ ] Verify all environment variables are set correctly

## �📖 Usage

### 1. Authentication

- Visit the homepage and click "Get Started"
- Sign up or sign in with your preferred method
- You'll be redirected to the dashboard

### 2. Connect Gmail

- In the dashboard, click on Google authentication
- Grant permissions to access your Gmail
- Your inbox will be loaded automatically

### 3. View Emails

- Browse your email threads in the inbox view
- Click on any thread to view the full conversation
- Use the search and filter options to find specific emails

### 4. AI Features

- **Summarize**: Click the "Summarize" button on any email thread
- **Generate Reply**: Click "Generate Reply" to get AI-suggested responses
- **Copy**: Use the copy button to copy generated content to clipboard
- **Edit**: Modify AI-generated content before sending

## 🔌 API Endpoints

### Authentication

- `GET /api/auth/*` - Clerk authentication routes

### Gmail Integration

- `GET /api/google/connect` - Initiate Google OAuth
- `GET /api/google/callback` - OAuth callback handler
- `GET /api/emails` - Fetch user emails
- `GET /api/thread/[threadId]` - Fetch specific email thread

### AI Features

- `POST /api/summarize` - Generate email thread summary
- `POST /api/generate-reply` - Generate email reply

### Draft Management

- `POST /api/draft` - Save email draft

## 🎨 Components

### Core Components

- `InboxView` - Main email inbox interface
- `SummarizeThreadButton` - AI summarization with dropdown
- `ReplyBox` - AI reply generation with dropdown
- `EmailThread` - Individual email thread view

### UI Components

- Button, Input, Textarea, Badge, etc. (shadcn/ui)
- Loading states and error handling
- Responsive design with mobile support

## 🔧 Configuration

### Environment Variables

See the `.env.local` example above for all required environment variables.

### Gmail API Scopes

The application requests the following Gmail scopes:

- `https://www.googleapis.com/auth/gmail.readonly` - Read emails
- `https://www.googleapis.com/auth/gmail.send` - Send emails (future feature)

### OpenAI Configuration

- Model: GPT-4o-mini (optimized for speed and cost)
- Temperature: Default (balanced creativity)
- Max tokens: Configured per use case

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

### Development Guidelines

- Use TypeScript for all new code
- Follow ESLint configuration
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Clerk](https://clerk.com/) - Authentication platform
- [OpenAI](https://openai.com/) - AI models and API
- [Google Gmail API](https://developers.google.com/gmail/api) - Email integration
- [shadcn/ui](https://ui.shadcn.com/) - UI component library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

## 📞 Support

If you have any questions or need help:

1. Check the [Issues](https://github.com/ylcharan/mail-auto/issues) page
2. Create a new issue with detailed information
3. Contact the maintainers

---

**Made with ❤️ using Next.js, TypeScript, and AI**
