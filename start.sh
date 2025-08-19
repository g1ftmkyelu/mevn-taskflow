#!/bin/bash

echo "Starting MEVN TaskFlow applications..."

# Start backend
echo "Starting backend server..."
cd backend
npm start &
BACKEND_PID=$!
cd ..


# Start frontend
echo "Starting frontend development server..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo "Backend (PID: $BACKEND_PID) and Frontend (PID: $FRONTEND_PID) are starting up."
echo "Press Ctrl+C to stop both processes."

# Wait for processes to finish
wait $BACKEND_PID
wait $FRONTEND_PID