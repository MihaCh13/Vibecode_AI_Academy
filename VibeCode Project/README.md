# 🤖 AI Tools Platform

<div align="center">

**A comprehensive internal platform for development teams to share AI tools, libraries, frameworks, and resources with intelligent role-based access control.**

[![Laravel](https://img.shields.io/badge/Laravel-10.x-FF2D20?style=flat-square&logo=laravel)](https://laravel.com)
[![Next.js](https://img.shields.io/badge/Next.js-14.x-000000?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker)](https://www.docker.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

</div>

---

## 🖼️ Project Look

💡 **To preview how the platform looks without installing anything, open the [Project Look](Project%20Look) folder — it contains visual snapshots of the entire application including both dark and light themes.**

The folder includes screenshots of:
- 📱 **Login & Registration** forms
- 🏠 **Role-based Dashboards** (Owner, Backend, Frontend, PM, QA, Designer)
- 🛠️ **AI Tool Management** interface
- 👤 **User Profile** and settings
- ⚙️ **Admin Panel** for tool approval
- 🎨 **Responsive Design** in both themes

---

## 🚀 Overview

The **AI Tools Platform** is an intelligent, role-based web application designed to streamline how development teams discover, share, and manage AI tools and resources. Built with modern technologies and featuring comprehensive security measures, it provides a centralized hub for teams to collaborate on AI tool discovery and implementation.

### 🎯 Key Purpose
- **Centralized AI Tool Repository**: Organize and categorize AI tools, libraries, and frameworks
- **Role-Based Access Control**: Tailored experiences for different team roles
- **Approval Workflow**: Admin-controlled tool validation and publishing
- **Multi-Factor Authentication**: Enhanced security with email, Telegram, and Google Authenticator
- **Intelligent Agent System**: AI-powered development automation and assistance

---

## 🧠 Features

### 🔐 **Advanced Security**
- **Multi-Factor Authentication** (Email, Telegram, Google Authenticator)
- **Role-Based Access Control** with 6 distinct user roles
- **JWT Token Security** with Laravel Sanctum
- **Audit Logging** for complete activity tracking
- **Input Validation** and SQL injection prevention

### 👥 **User Roles & Capabilities**

| Role | Icon | Access Level | Key Features |
|------|------|--------------|--------------|
| **Owner** | 👑 | Full System Access | User management, analytics, system administration |
| **Backend** | ⚙️ | Development Tools | API management, database tools, server monitoring |
| **Frontend** | 🎨 | UI/UX Tools | Component libraries, prototyping, asset management |
| **PM** | 📋 | Project Management | Planning, team coordination, progress tracking |
| **QA** | 🔍 | Testing Tools | Test management, bug tracking, quality assurance |
| **Designer** | 🎭 | Design Tools | Creative software, brand guidelines, asset creation |

### 🛠️ **Core Functionality**
- **AI Tool Catalog**: Comprehensive library with search and filtering
- **Category Organization**: Tools organized by type and purpose
- **Approval Workflow**: Admin-controlled tool validation system
- **Responsive Design**: Mobile-first with dark/light theme support
- **Real-time Updates**: Live notifications and status updates
- **File Upload**: Support for tool images and documentation

### 🤖 **AI Agent System**
- **Code Analysis Agent**: Static code analysis and security detection
- **Testing Agent**: Automated test generation and execution
- **Documentation Agent**: Automatic documentation generation
- **Project Management Agent**: Task planning and progress tracking

---

## ⚙️ Installation & Setup

### 📋 Prerequisites
- **Docker Desktop** (latest version)
- **Git**
- **8GB RAM** minimum (recommended for development)

### 🚀 Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd project

# Run setup script (Windows)
.\setup.ps1

# Or run setup script (Linux/macOS)
chmod +x setup.sh
./setup.sh

# Start the application
docker-compose up
```

### 🌐 Access Points
- **Frontend Application**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Login Page**: http://localhost:3000/login

### 🔐 Test Accounts

| Role | Email | Password | Description |
|------|-------|----------|-------------|
| Owner | `ivan@admin.local` | `password` | Full system access |
| Backend | `petar@backend.local` | `password` | Development tools |
| Frontend | `elena@frontend.local` | `password` | UI/UX tools |
| PM | `maria@pm.local` | `password` | Project management |
| QA | `nikolay@qa.local` | `password` | Testing tools |
| Designer | `sofia@designer.local` | `password` | Design tools |

---

## 🧩 Project Structure

```
project/
├── 📁 backend/                     # Laravel 10 Backend API
│   ├── 📁 app/
│   │   ├── 📁 Http/Controllers/    # API controllers & middleware
│   │   ├── 📁 Models/              # Eloquent models (User, Tool, Category, etc.)
│   │   ├── 📁 Services/            # Business logic services
│   │   └── 📁 Providers/           # Service providers
│   ├── 📁 config/                  # Configuration files
│   ├── 📁 database/
│   │   ├── 📁 migrations/          # Database schema migrations
│   │   └── 📁 seeders/             # Test data seeders
│   ├── 📁 routes/                  # API route definitions
│   └── 📁 storage/                 # File storage & logs
│
├── 📁 frontend/                    # Next.js 14 Frontend Application
│   ├── 📁 app/                     # Next.js App Router pages
│   │   ├── 📁 login/               # Authentication pages
│   │   ├── 📁 dashboard/           # Role-based dashboards
│   │   ├── 📁 tools/               # AI tool management
│   │   └── 📁 admin/               # Admin panel
│   ├── 📁 components/              # React components
│   │   ├── 📁 UI/                  # Reusable UI components
│   │   ├── 📁 Navigation/          # Navigation components
│   │   └── 📁 TwoFactor/           # 2FA components
│   ├── 📁 lib/                     # Utility libraries & API client
│   └── 📁 types/                   # TypeScript definitions
│
├── 📁 docker/                      # Docker Configuration
│   ├── 📁 nginx/                   # Nginx web server config
│   ├── 📁 php/                     # PHP-FPM settings
│   └── 📁 mysql/                   # MySQL database config
│
├── 📁 Docs/                        # Comprehensive Documentation
│   ├── 📄 installation.md          # Detailed setup guide
│   ├── 📄 architecture.md          # System architecture
│   ├── 📄 features.md              # Feature documentation
│   ├── 📄 roles-and-permissions.md # User role system
│   └── 📄 ai-agents.md             # AI agent system guide
│
├── 📁 Project Look/                # 📸 Application Screenshots
│   ├── 📁 Dark theme/              # Dark mode interface screenshots
│   ├── 📁 Light theme/             # Light mode interface screenshots
│   └── 📄 *.png                    # Individual feature screenshots
│
├── 📄 docker-compose.yml           # Docker services orchestration
├── 📄 setup.sh / setup.ps1         # Platform setup scripts
└── 📄 README.md                    # This documentation file
```

### 🏗️ Technology Stack

| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| **Backend** | Laravel | 10.x | PHP API framework |
| **Frontend** | Next.js | 14.x | React framework with App Router |
| **Language** | TypeScript | 5.x | Type-safe development |
| **Styling** | Tailwind CSS | 3.x | Utility-first CSS framework |
| **Database** | MySQL | 8.0 | Primary database |
| **Cache** | Redis | Latest | Session storage & caching |
| **Auth** | Laravel Sanctum | 4.x | API authentication |
| **Container** | Docker | Latest | Development environment |
| **2FA** | Google2FA | 8.x | Two-factor authentication |

---

## 🔐 Roles & Permissions

### 👑 **Owner (Admin)**
- **Full System Access**: Complete platform administration
- **User Management**: Create, edit, and manage user accounts
- **Tool Approval**: Approve or reject submitted AI tools
- **Analytics**: Access system-wide usage statistics
- **Security**: Manage 2FA settings and audit logs

### ⚙️ **Backend Developer**
- **API Tools**: Access to API development and testing tools
- **Database Management**: Database administration and migration tools
- **Server Monitoring**: Performance monitoring and log analysis
- **Code Repositories**: Version control and deployment tools

### 🎨 **Frontend Developer**
- **UI Libraries**: Access to component libraries and design systems
- **Prototyping Tools**: Wireframing and prototyping software
- **Asset Management**: Image optimization and asset management tools
- **Browser Testing**: Cross-browser testing and accessibility tools

### 📋 **Product Manager**
- **Project Planning**: Timeline management and resource allocation
- **Team Coordination**: Communication and collaboration tools
- **Progress Tracking**: Milestone tracking and reporting
- **Client Management**: Feedback collection and communication tools

### 🔍 **QA Engineer**
- **Testing Tools**: Test case creation and execution platforms
- **Bug Tracking**: Issue management and prioritization systems
- **Automated Testing**: CI/CD integration and test automation
- **Quality Metrics**: Performance and compliance testing tools

### 🎭 **Designer**
- **Design Software**: Professional design and creative tools
- **Brand Guidelines**: Style guides and brand asset management
- **Asset Creation**: Template management and design resources
- **Collaboration**: Design review and version control tools

---

## 🧰 How to Add New AI Tools

### 1️⃣ **Tool Submission Process**
1. **Login** to the platform with your role-based account
2. **Navigate** to the "Add AI Tool" section
3. **Fill out** the comprehensive tool form:
   - Tool name and description
   - Official documentation links
   - Video demonstrations
   - Usage examples and difficulty level
   - Upload relevant images
   - Select appropriate categories
   - Assign role-based access permissions

### 2️⃣ **Admin Approval Workflow**
1. **Pending Review**: All new tools start with "pending" status
2. **Admin Review**: Owners can review submitted tools
3. **Approval/Rejection**: Tools are either approved or rejected
4. **Public Visibility**: Approved tools become available to assigned roles

### 3️⃣ **Tool Management**
- **Edit Tools**: Modify existing tool information
- **Category Management**: Organize tools by categories
- **Tag System**: Add searchable tags for better discovery
- **Role Assignment**: Control which roles can access each tool

---

## 🧾 Documentation

The project includes comprehensive documentation in the `Docs/` folder:

| Document | Description | Contents |
|----------|-------------|----------|
| 📋 **[Installation Guide](Docs/installation.md)** | Complete setup instructions | Docker setup, environment configuration, troubleshooting |
| 🏗️ **[Architecture](Docs/architecture.md)** | System architecture overview | Component relationships, database schema, network architecture |
| ✨ **[Features](Docs/features.md)** | Detailed feature documentation | Authentication, roles, tool management, analytics |
| 👥 **[Roles & Permissions](Docs/roles-and-permissions.md)** | User role system | Detailed role capabilities and access levels |
| 🤖 **[AI Agents](Docs/ai-agents.md)** | AI agent system guide | Code analysis, testing, documentation, and project management agents |

---

## 🛠️ Development Commands

### Backend Development
```bash
# Access Laravel container
docker-compose exec app bash

# Run database migrations
php artisan migrate

# Seed database with test data
php artisan db:seed

# Generate application key
php artisan key:generate

# Clear application cache
php artisan cache:clear
```

### Frontend Development
```bash
# Access Next.js container
docker-compose exec frontend sh

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

### Database Management
```bash
# Access MySQL database
docker-compose exec db mysql -u laravel_user -p laravel_ai_tools

# View database logs
docker-compose logs db

# Reset database
docker-compose exec app php artisan migrate:fresh --seed
```

---

## 🔧 API Endpoints

### Authentication
- `POST /api/login` - User authentication with optional 2FA
- `POST /api/register` - User registration
- `POST /api/logout` - User logout
- `GET /api/me` - Get current user information
- `GET /api/roles` - Get available user roles

### Two-Factor Authentication
- `GET /api/2fa/status` - Get user's 2FA configuration
- `POST /api/2fa/enable/email` - Enable email-based 2FA
- `POST /api/2fa/enable/telegram` - Enable Telegram 2FA
- `POST /api/2fa/enable/totp` - Enable Google Authenticator 2FA
- `POST /api/2fa/verify` - Verify 2FA setup

### AI Tool Management
- `GET /api/tools` - Get tools (filtered by user role)
- `POST /api/tools` - Create new AI tool
- `PUT /api/tools/{id}` - Update existing tool
- `DELETE /api/tools/{id}` - Delete tool
- `POST /api/admin/tools/{id}/approve` - Approve tool (Owner only)
- `POST /api/admin/tools/{id}/reject` - Reject tool (Owner only)

### Example API Usage
```bash
# Login with credentials
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ivan@admin.local","password":"password"}'

# Get current user (with token)
curl -X GET http://localhost:8000/api/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🚀 Deployment

### Production Setup
1. **Environment Configuration**: Set production environment variables
2. **SSL Certificates**: Configure HTTPS with valid certificates
3. **Database Backups**: Set up automated backup procedures
4. **Monitoring**: Implement logging and performance monitoring
5. **Load Balancing**: Configure for horizontal scaling

### Environment Variables
```env
# Production Configuration
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-domain.com

# Database
DB_CONNECTION=mysql
DB_HOST=your-db-host
DB_DATABASE=ai_tools_production
DB_USERNAME=your-db-user
DB_PASSWORD=your-secure-password

# Security
APP_KEY=your-application-key
SANCTUM_STATEFUL_DOMAINS=your-domain.com
```

---

## 🔄 Common Operations

### Service Management
```bash
# Restart all services
docker-compose restart

# Stop all services
docker-compose down

# View service logs
docker-compose logs -f

# Rebuild containers
docker-compose up --build
```

### Cache Management
```bash
# Clear Laravel caches
docker-compose exec app php artisan cache:clear
docker-compose exec app php artisan config:clear
docker-compose exec app php artisan route:clear

# Clear Next.js cache
docker-compose exec frontend rm -rf .next
```

### Database Operations
```bash
# Run migrations
docker-compose exec app php artisan migrate

# Reset database with fresh data
docker-compose exec app php artisan migrate:fresh --seed

# Create database backup
docker-compose exec db mysqldump -u laravel_user -p laravel_ai_tools > backup.sql
```

---

## 🛠️ Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| **Port Conflicts** | Ensure ports 3000, 8000, and 3306 are available |
| **Database Connection** | Check MySQL container status: `docker-compose logs db` |
| **Permission Issues** | Run setup scripts with appropriate permissions |
| **2FA Not Working** | Verify email/SMTP and Telegram bot configuration |
| **Frontend Not Loading** | Check Next.js container: `docker-compose logs frontend` |

### Complete Reset
```bash
# Stop and remove all containers and volumes
docker-compose down -v

# Remove unused Docker resources
docker system prune -f

# Rebuild everything
./setup.sh
docker-compose up
```

### Debug Mode
```bash
# Enable Laravel debug mode
docker-compose exec app php artisan config:clear
# Edit .env file to set APP_DEBUG=true

# View detailed logs
docker-compose logs -f app
docker-compose logs -f frontend
```

---

## 🤝 Contributing

We welcome contributions to the AI Tools Platform! Here's how to get started:

1. **Fork the Repository**: Create your own fork of the project
2. **Create Feature Branch**: `git checkout -b feature/amazing-feature`
3. **Make Changes**: Implement your feature or bug fix
4. **Test Thoroughly**: Ensure all tests pass and new functionality works
5. **Submit Pull Request**: Create a detailed PR with description

### Development Guidelines
- Follow PSR-12 coding standards for PHP
- Use TypeScript for all frontend code
- Write comprehensive tests for new features
- Update documentation for any API changes
- Ensure responsive design for all UI changes

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🌟 Future Plans

### Upcoming Features
- 🔍 **Advanced Search**: AI-powered tool recommendations
- 📊 **Analytics Dashboard**: Detailed usage statistics and insights
- 🔗 **API Integrations**: Third-party service integrations
- 📱 **Mobile App**: Native mobile application
- 🌍 **Multi-language Support**: Internationalization
- 🧠 **Machine Learning**: Intelligent tool categorization and suggestions

### Community
- Join our community discussions
- Report bugs and request features
- Contribute to the documentation
- Share your AI tool discoveries

---

<div align="center">

**Built with ❤️ for development teams who want to share AI tools and collaborate effectively.**

[🚀 Get Started](#-installation--setup) • [📖 Documentation](Docs/) • [🖼️ Preview](Project%20Look/) • [🤝 Contributing](#-contributing)

</div>