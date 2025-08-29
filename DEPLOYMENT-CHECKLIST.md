# 🚀 Quick Deployment Fix Checklist

## ✅ **IMMEDIATE ACTIONS REQUIRED:**

### 1. **Commit and Push Your Changes**
```bash
git add .
git commit -m "Fix Vercel deployment configuration"
git push
```

### 2. **Set Environment Variables in Vercel Dashboard**
- Go to: https://vercel.com/dashboard
- Select your project: `backend-demo-gilt`
- Go to **Settings** → **Environment Variables**
- Add these variables:

```
MONGO_URI = your_mongodb_connection_string
JWT_SECRET = your_jwt_secret_key
```

### 3. **Redeploy from Vercel Dashboard**
- Go to **Deployments** tab
- Click **"Redeploy"** on your latest deployment

## 🔍 **Test These Endpoints First:**

1. **Root endpoint**: `https://backend-demo-gilt.vercel.app/`
   - Should show: "Perfume API is running!"

2. **Health check**: `https://backend-demo-gilt.vercel.app/api/health`
   - Should show: `{"ok": true, "time": "..."}`

3. **Test endpoint**: `https://backend-demo-gilt.vercel.app/api/test`
   - Should show environment variable status

## 🚨 **If Still Getting 500 Errors:**

### Check Vercel Logs:
1. Go to your deployment in Vercel
2. Click **"Functions"** tab
3. Click on your function to see error logs
4. Look for specific error messages

### Common Issues:
- **Missing MONGO_URI**: Add MongoDB connection string
- **Missing JWT_SECRET**: Add JWT secret key
- **Database connection timeout**: Check MongoDB Atlas network access

## 📱 **Expected Behavior:**

- **Without env vars**: API should start but return 503 for database operations
- **With env vars**: API should work normally
- **Health endpoints**: Should always work regardless of database status

## 🆘 **Still Having Issues?**

1. Check Vercel function logs for specific error messages
2. Verify your MongoDB connection string is correct
3. Ensure MongoDB Atlas allows connections from Vercel IPs
4. Try the test endpoints first to isolate the issue

## 🔧 **Quick Test Commands:**

```bash
# Test root endpoint
curl https://backend-demo-gilt.vercel.app/

# Test health endpoint  
curl https://backend-demo-gilt.vercel.app/api/health

# Test environment status
curl https://backend-demo-gilt.vercel.app/api/test
```
