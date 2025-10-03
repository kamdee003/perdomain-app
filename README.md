# Perdomain - AI Domain Appraisal Platform

Full-stack domain valuation tool with AI-powered insights, historical sales data, and real-time market analysis.

## 🚀 Features

- AI-powered domain valuation using DeepSeek API
- Historical sales comparison from real market data
- Real-time market analysis from Atom listings
- Domain availability checking
- Usage limiting system
- Responsive design with Tailwind CSS

## 🏗 Architecture

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: FastAPI, Python, Scikit-learn, XGBoost
- **AI**: DeepSeek API for classification and insights
- **Database**: SQLite for usage tracking
- **Deployment**: Docker containers

## 🛠 Development

### Prerequisites
- Docker and Docker Compose
- Python 3.9+
- Node.js 18+

### Local Development

1. **Clone the repository**
2. **Set up environment variables** (copy .env.example to .env)
3. **Run with Docker**:
   ```bash
   docker-compose up --build


Access the application:

Frontend: http://localhost:3000

Backend API: http://localhost:8000

🌐 Production Deployment
This project is configured for deployment on Starlight Hyperlift. Connect your GitHub repository and Hyperlift will automatically build and deploy both frontend and backend.

📝 Environment Variables
See .env.example for all required environment variables.

🔒 Security
API rate limiting (3 requests per day per user)

Secure environment variable handling

No sensitive data in version control