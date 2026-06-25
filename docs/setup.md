# Setup Guide

Updated: 2026-06-25

## Prerequisites
- Node.js 18+
- MongoDB 6+
- npm or yarn

## Installation
```bash
npm install
cp .env.example .env
# Edit .env with your values
npm run dev
```  

## Database Setup
```bash
# Start MongoDB locally
mongod --dbpath /data/db
```  

## Production Deploy
```bash
npm run build
npm start
```
