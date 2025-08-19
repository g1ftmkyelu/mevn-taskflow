#!/bin/bash

echo "Starting MEVN TaskFlow installation..."

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "Backend npm install failed. Exiting."
    exit 1
fi
cd ..

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd frontend
npm install
if [ $? -ne 0 ]; then
    echo "Frontend npm install failed. Exiting."
    exit 1
fi
cd ..

echo "Installation complete. You can now run 'npm start' in both backend and frontend directories, or use 'docker-compose up --build'."
echo "Remember to set up your .env files in both backend/ and frontend/ directories."