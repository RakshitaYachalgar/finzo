# Finzo - Financial Dashboard

This is a multi-service financial dashboard application with:
- **Frontend**: React.js with Tailwind CSS
- **Backend**: Node.js/Express API
- **ML Service**: Python-based machine learning service

## Project Structure
- `frontend/` - React application (deployed to Vercel)
- `backend/` - Node.js API server
- `ml-service/` - Python ML service

## Development Guidelines

### Frontend Development
- Built with Create React App and Tailwind CSS
- Uses Recharts for data visualization
- Axios for API communication
- All frontend work should be done in the `frontend/` directory

### Backend Development  
- Node.js/Express API
- Serves data to the frontend
- Located in `backend/` directory

### ML Service
- Python-based machine learning service
- Located in `ml-service/` directory

## Deployment Configuration
- **Vercel**: Configured to deploy the frontend React app
- The root `vercel.json` specifies frontend as the build target
- Build command: `cd frontend && npm ci && npm run build`
- Output directory: `frontend/build`

## Common Commands
- `npm run build` - Build the frontend for production
- `npm run dev:frontend` - Start frontend development server  
- `npm run dev:backend` - Start backend development server
- `npm run install:all` - Install dependencies for all services

## Key Files
- `vercel.json` - Vercel deployment configuration
- `frontend/package.json` - Frontend dependencies and scripts
- `backend/package.json` - Backend dependencies and scripts