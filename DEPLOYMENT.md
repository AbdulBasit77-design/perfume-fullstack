# Vercel Deployment Guide

## Prerequisites
- MongoDB Atlas account with a cluster
- Vercel account
- Git repository with your code

## Environment Variables Setup in Vercel

You MUST configure these environment variables in your Vercel project:

### 1. Go to Vercel Dashboard
- Navigate to your project
- Click on "Settings" tab
- Go to "Environment Variables" section

### 2. Add Required Variables

#### MongoDB Connection String
```
Name: MONGO_URI
Value: mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
Environment: Production, Preview, Development
```

#### JWT Secret
```
Name: JWT_SECRET
Value: your-super-secret-jwt-key-here (use a strong random string)
Environment: Production, Preview, Development
```

#### Optional: Cloudinary (if using image uploads)
```
Name: CLOUDINARY_CLOUD_NAME
Value: your_cloud_name
Environment: Production, Preview, Development

Name: CLOUDINARY_API_KEY
Value: your_api_key
Environment: Production, Preview, Development

Name: CLOUDINARY_API_SECRET
Value: your_api_secret
Environment: Production, Preview, Development
```

### 3. Redeploy
After adding environment variables, redeploy your project:
- Go to "Deployments" tab
- Click "Redeploy" on your latest deployment

## Common Issues & Solutions

### 1. Server Crashes (500 Error)
- **Cause**: Missing environment variables
- **Solution**: Ensure all required env vars are set in Vercel

### 2. Database Connection Timeout
- **Cause**: MongoDB connection issues
- **Solution**: Check your MongoDB Atlas network access and connection string

### 3. Function Timeout
- **Cause**: Long-running operations
- **Solution**: The function timeout is set to 30 seconds in vercel.json

## Testing Your Deployment

1. **Health Check**: Visit `/api/health` endpoint
2. **Test Registration**: Try `/api/auth/register` with POST
3. **Test Login**: Try `/api/auth/login` with POST

## Local Development vs Production

- **Local**: Uses `app.listen()` and persistent DB connection
- **Production**: Uses serverless functions with connection pooling

## Troubleshooting

### Check Vercel Logs
1. Go to your deployment in Vercel
2. Click on "Functions" tab
3. Click on your function to see logs

### Common Error Messages
- `MONGO_URI is missing`: Add MONGO_URI to Vercel env vars
- `JWT_SECRET environment variable is not configured`: Add JWT_SECRET to Vercel env vars
- `MongoDB connection error`: Check your MongoDB connection string and network access

## Security Notes

- Never commit `.env` files to Git
- Use strong, unique JWT secrets
- Restrict MongoDB network access to Vercel IPs if possible
- Regularly rotate your secrets
