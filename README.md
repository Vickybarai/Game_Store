# 🎮 Game Store - Ultimate Gaming Platform

A modern, production-ready gaming e-commerce platform. Discover the latest games, gaming consoles, and join exciting tournaments. Built with cutting-edge technologies.

![Next.js](https://img.shields.io/badge/Next.js-16.1.3-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8)
![Prisma](https://img.shields.io/badge/Prisma-5.0-0c344b)

## ✨ Features

### 🎯 Core Features
- **Browse Games** - Discover and purchase your favorite games across multiple platforms
- **Gaming Equipment** - Browse and buy gaming consoles, VR headsets, simulation equipment, and accessories
- **Tournaments** - View and participate in exciting gaming tournaments
- **User Accounts** - Create accounts, manage profiles, and track order history
- **Shopping Cart** - Add games and equipment to cart with quantity management
- **Wishlist** - Save your favorite games and equipment for later

### 🔒 User Roles
- **Guest** - Browse games, equipment, and tournaments (login required for cart/wishlist)
- **Authenticated User** - Full access to all features including cart, wishlist, and profile management
- **Admin** - User management and platform administration

### 🎨 User Experience
- **Responsive Design** - Mobile-first design with smooth transitions
- **Dark/Light Mode** - Theme switching with next-themes
- **Real-time Updates** - Live cart count and authentication status
- **Beautiful Animations** - Framer Motion powered micro-interactions
- **Loading States** - Skeleton loaders and smooth page transitions

## 🛠️ Technology Stack

### Core Framework
- **⚡ Next.js 16** - React framework with App Router
- **📘 TypeScript 5** - Type-safe development
- **🎨 Tailwind CSS 4** - Utility-first styling
- **🧩 shadcn/ui** - High-quality component library

### State & Data Management
- **🐻 Zustand** - Client state management
- **📊 TanStack Query** - Server state synchronization
- **🗄️ Prisma ORM** - Database abstraction with SQLite
- **🔐 NextAuth.js** - Authentication solution

### UI Components
- **🎯 Lucide React** - Beautiful & consistent icon library
- **🎨 Framer Motion** - Production-ready animations
- **📅 Date-fns** - Date manipulation utilities
- **✅ Zod** - Schema validation

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ or Bun
- npm, yarn, pnpm, or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/Vickybarai/Game_Store.git
cd Game_Store

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Set up the database
bun run db:push

# Run seed data (optional)
bun run db:seed

# Start development server
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your application running.

## 📁 Project Structure

```
src/
├── app/                      # Next.js App Router pages
│   ├── api/                  # API routes
│   │   ├── auth/            # Authentication endpoints
│   │   ├── games/           # Game CRUD operations
│   │   ├── consoles/        # Console CRUD operations
│   │   ├── tournaments/     # Tournament endpoints
│   │   ├── cart/            # Shopping cart operations
│   │   ├── wishlist/        # Wishlist management
│   │   └── orders/          # Order management
│   ├── games/               # Games pages
│   ├── consoles/             # Consoles pages
│   ├── tournaments/          # Tournaments pages
│   ├── cart/                # Shopping cart page
│   ├── profile/             # User profile page
│   ├── login/               # Login page
│   └── register/            # Registration page
├── components/              # Reusable React components
│   ├── ui/                 # shadcn/ui components
│   ├── navbar.tsx          # Navigation bar
│   ├── footer.tsx          # Footer component
│   ├── login-modal.tsx     # Login dialog
│   └── login-prompt.tsx    # Guest login modal (NEW)
├── hooks/                  # Custom React hooks
│   ├── use-toast.ts        # Toast notifications
│   └── use-mobile.ts       # Mobile detection
└── lib/                    # Utility functions
    ├── db.ts               # Prisma client
    ├── auth.ts             # Authentication utilities
    └── utils.ts            # Helper functions
```

## 🎮 Available Pages

### Public Pages
- **Home** (`/`) - Landing page with featured games and equipment
- **Games** (`/games`) - Browse all games with filtering
- **Consoles** (`/consoles`) - Browse gaming equipment with category filters
- **Tournaments** (`/tournaments`) - View active and upcoming tournaments
- **Login** (`/login`) - User authentication
- **Register** (`/register`) - New user registration

### Protected Pages (Requires Authentication)
- **Cart** (`/cart`) - Shopping cart management
- **Profile** (`/profile`) - User profile and order history
- **Game Details** (`/games/[id]`) - Individual game information
- **Console Details** (`/consoles/[id]`) - Individual equipment information
- **Tournament Details** (`/tournaments/[id]`) - Tournament information

### Admin Pages
- **User Management** (`/api/admin/users`) - Manage user accounts

## 🔐 Authentication

The application uses JWT-based authentication with NextAuth.js:

### Features
- Email and password authentication
- Secure password hashing with bcrypt
- JWT token management
- Protected API routes
- Session persistence

### User Roles
- **Guest** - Limited access, no authentication required
- **User** - Full access to all features
- **Admin** - Administrative privileges

## 🗄️ Database Schema

### Key Models
- **User** - User accounts with authentication
- **Game** - Video game catalog
- **Console** - Gaming equipment catalog (now with VR, simulation, accessories)
- **Tournament** - Gaming tournaments
- **Cart** - Shopping cart management
- **CartItem** - Cart items
- **Wishlist** - User wishlist
- **Order** - Order management

See `prisma/schema.prisma` for complete schema definition.

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/change-password` - Change password

### Games
- `GET /api/games` - List all games
- `GET /api/games/[id]` - Get game by ID
- `POST /api/games` - Create game (admin)
- `PUT /api/games/[id]` - Update game (admin)
- `DELETE /api/games/[id]` - Delete game (admin)

### Consoles & Equipment
- `GET /api/consoles` - List all equipment
- `GET /api/consoles/[id]` - Get equipment by ID
- `POST /api/consoles` - Create equipment (admin)
- `PUT /api/consoles/[id]` - Update equipment (admin)
- `DELETE /api/consoles/[id]` - Delete equipment (admin)

### Cart
- `GET /api/cart` - Get user's cart
- `GET /api/cart/count` - Get cart item count
- `POST /api/cart/item` - Add item to cart
- `DELETE /api/cart/item/[id]` - Remove item from cart

### Wishlist
- `GET /api/wishlist` - Get user's wishlist
- `POST /api/wishlist/item` - Add item to wishlist
- `DELETE /api/wishlist/item` - Remove item from wishlist

### Orders
- `GET /api/orders` - Get user's orders
- `POST /api/orders/checkout` - Create order from cart

### Admin
- `GET /api/admin/users` - List all users
- `PUT /api/admin/users/[id]` - Update user
- `DELETE /api/admin/users/[id]` - Delete user

## 🎮 Gaming Equipment Categories

### 🎮 Consoles
- PlayStation 5 & PS5 Slim
- Xbox Series X
- Nintendo Switch OLED & Lite
- PlayStation VR2 (VR headset)

### 🥽 VR Headsets
- Meta Quest 3 (4K+ Mixed Reality)
- Meta Quest 2 (128GB)
- HTC Vive Pro 2 (5K Resolution)
- Pico 4 Enterprise
- Valve Index VR Kit

### 🏎️ Driving Simulation Equipment
- Logitech G29 Driving Force Racing Wheel
- Thrustmaster T248 Racing Wheel
- Fanatec CSL DD Direct Drive
- PlaySeat Evolution Gaming Seat
- Logitech G Pro Pedals
- Thrustmaster T-GT II
- Simucube 2 Sport Direct Drive

### 🎮 Gaming Accessories
- **Headsets:** SteelSeries Arctis Nova Pro, HyperX Cloud III Wireless
- **Keyboards:** Razer BlackWidow V4 Pro, Keychron Q1 Pro
- **Mice:** Logitech G Pro X Superlight 2, Razer DeathAdder V3 Pro
- **Monitors:** ASUS ROG Swift PG27AQN, Alienware 34 QD-OLED
- **Streaming:** Elgato Stream Deck MK.2

### 🎯 Featured Equipment
- All equipment items have proper images from Unsplash
- Realistic specifications and descriptions
- Stock availability tracking
- Discount pricing where applicable
- Category filters on consoles page

## 🎨 UI Components

The application uses shadcn/ui components built on Radix UI:

### Layout Components
- Card, CardContent, CardFooter
- Navigation Menu, Breadcrumb, Pagination
- Separator, Skeleton (loading states)
- Sidebar, Collapsible, Accordion, Tabs

### Form Components
- Input, Textarea, Select, Checkbox, Radio Group
- Switch, Slider, Form with validation
- Calendar, Date Picker

### Feedback Components
- Alert, Badge, Toast (Sonner)
- Progress, Skeleton
- Dialog, Sheet, Popover, Tooltip, Hover Card

### Data Display
- Table with sorting and filtering
- Pagination, Avatar
- Calendar

## 🔧 Deployment

### Quick Deploy Options

**Docker Compose (Local)**
```bash
docker-compose up -d
```

**Kubernetes (Production)**
```bash
# Deploy using Kustomize
export NEXTAUTH_SECRET=$(openssl rand -base64 32)
export NEXTAUTH_URL=https://your-domain.com
bash scripts/k8s-deploy-kustomize.sh
```

### Environment Variables

```env
# Database
DATABASE_URL="file:./db/custom.db"

# NextAuth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

### Deployment Platforms

**Docker**
```bash
# Build image
docker build -t gamezone:latest .

# Run container
docker run -d -p 3000:3000 gamezone:latest
```

**Kubernetes**
```bash
# Deploy all resources
kubectl apply -f k8s/

# Using Kustomize
kubectl apply -k k8s/
```

**Vercel** (Recommended for serverless)
```bash
npm i -g vercel
vercel
```

## 🧪 Development

### Available Scripts

```bash
# Development
bun run dev          # Start development server
bun run build        # Build for production
bun run start        # Start production server

# Database
bun run db:push      # Push schema to database
bun run db:seed      # Seed database with sample data

# Code Quality
bun run lint         # Run ESLint
bun run type-check   # Run TypeScript type checking
```

### Testing
```bash
# Coming soon
bun run test
bun run test:e2e
```

## 📝 Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow ESLint rules
- Use functional components with hooks
- Keep components small and focused

### Best Practices
- Use server components where possible
- Implement proper error handling
- Add loading states for async operations
- Use Prisma for database operations
- Validate user input with Zod

### Commit Convention
```
feat: add new feature
fix: fix bug
docs: update documentation
style: formatting changes
refactor: code refactoring
test: add tests
chore: maintenance tasks
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨 Author

**Vicky Barai** - GitHub: [@Vickybarai](https://github.com/Vickybarai)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Prisma](https://www.prisma.io/) - Next-generation ORM

## 🗺️ Roadmap

- [ ] Payment integration (Stripe/Razorpay)
- [ ] User reviews and ratings
- [ ] Advanced search and filtering
- [ ] Real-time tournament participation
- [ ] Email notifications
- [ ] Order tracking
- [ ] Multi-language support
- [ ] Dark mode optimization
- [ ] Mobile app version

---

Built with ❤️ for gamers. Powered by [Next.js](https://nextjs.org/) and [shadcn/ui](https://ui.shadcn.com/).
