#!/bin/bash
echo "Installing dependencies (if not exists)..."
npm install

echo "Starting StoreMS SaaS Backend Database & Server..."
node server.js
