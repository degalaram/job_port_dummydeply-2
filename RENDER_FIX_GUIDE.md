# 🔧 Render Deployment Fix Guide

## Issues Identified

1. **Frontend not connecting to Backend API**
2. **Admin password verification failing**
3. **CORS configuration needs updating**

## 🚀 Quick Fix Steps

### Step 1: Update Backend Environment Variables

In your **backend service** on Render:

1. Go to your backend service dashboard
2. Click **"Environment"** tab
3. Update/Add these variables:

```
FRONTEND_URL=https://job-render-deploy-dummy-2.onrender.com
NODE_ENV=production
DATABASE_URL=your_database_connection_string
```

### Step 2: Update Frontend Environment Variables

In your **frontend service** on Render:

1. Go to your frontend service dashboard  
2. Click **"Environment"** tab
3. Add this variable:

```
VITE_API_URL=https://your-backend-service-name.onrender.com
```

**Important**: Replace `your-backend-service-name` with your actual backend service name.

### Step 3: Admin Password

The admin password for "Add Jobs" is: **161417**

### Step 4: Redeploy Both Services

1. **Backend**: Click "Manual Deploy" → "Deploy Latest Commit"
2. **Frontend**: Click "Manual Deploy" → "Deploy Latest Commit"

## 🔍 How to Find Your Backend URL

1. Go to your Render dashboard
2. Click on your **backend service**
3. Copy the URL from the top (should end with `.onrender.com`)
4. Use this URL as `VITE_API_URL` in frontend environment variables

## ✅ Testing After Fix

1. **Test Backend**: Visit `https://your-backend-url.onrender.com/api/health`
   - Should return: `{"status":"ok","timestamp":"...","service":"JobPortal Backend API"}`

2. **Test Frontend**: 
   - Login/Signup should work
   - Add Jobs with password **161417** should work
   - Add Company should work

## 🚨 Common Issues

### Issue: Still getting CORS errors
**Solution**: Make sure both services are redeployed after environment variable changes

### Issue: 404 errors on API calls
**Solution**: Verify the `VITE_API_URL` points to your actual backend service URL

### Issue: Admin password still not working
**Solution**: Try clearing browser cache and localStorage, then login again

## 📞 Need Help?

If issues persist:
1. Check browser console for error messages
2. Check Render service logs for both frontend and backend
3. Verify environment variables are set correctly
4. Ensure both services are running (not sleeping)

## 🎉 Success Indicators

When everything works:
- ✅ Login/Signup works without errors
- ✅ Jobs page loads with sample jobs
- ✅ Admin password **161417** grants access to Add Jobs
- ✅ Add Company form submits successfully
- ✅ No CORS errors in browser console