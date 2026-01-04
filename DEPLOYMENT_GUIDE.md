# Deployment Guide - Railway + Vercel

## Overview
This guide will help you deploy:
- **Backend** → Railway (FastAPI/Python)
- **Frontend** → Vercel (Next.js)

---

## Prerequisites
- GitHub account
- Railway account (https://railway.app)
- Vercel account (https://vercel.com)
- Git installed locally

---

## Part 1: Deploy Backend to Railway

### Step 1: Push to GitHub

```bash
# Initialize git (if not already done)
cd Todo-Web-Application
git init
git add .
git commit -m "Initial commit - ready for deployment"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/todo-app.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Railway

1. **Go to Railway**: https://railway.app
2. **Click "New Project"**
3. **Select "Deploy from GitHub repo"**
4. **Choose your repository**: `todo-app`
5. **Select the backend folder**: Configure to deploy from `/backend`

### Step 3: Configure Environment Variables

In Railway dashboard, go to **Variables** and add:

```
DATABASE_URL=postgresql://neondb_owner:npg_tajEZIPKvl07@ep-rough-dream-ahgydxk8-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars

JWT_ALGORITHM=HS256

JWT_EXPIRATION_HOURS=24

API_V1_PREFIX=/api/v1

CORS_ORIGINS=https://your-frontend-domain.vercel.app

HOST=0.0.0.0

PORT=$PORT
```

⚠️ **Important**: Update `CORS_ORIGINS` after deploying frontend!

### Step 4: Configure Build Settings

Railway should auto-detect the settings from `railway.json`, but verify:
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn src.main:app --host 0.0.0.0 --port $PORT`
- **Root Directory**: `/backend`

### Step 5: Deploy

Click **Deploy** and wait for deployment to complete.

### Step 6: Get Backend URL

Once deployed, Railway will provide a URL like:
```
https://your-app-name.up.railway.app
```

Test it:
```
https://your-app-name.up.railway.app/health
https://your-app-name.up.railway.app/docs
```

---

## Part 2: Deploy Frontend to Vercel

### Step 1: Go to Vercel

1. **Visit**: https://vercel.com
2. **Click "New Project"**
3. **Import your GitHub repository**: `todo-app`

### Step 2: Configure Project

- **Framework Preset**: Next.js
- **Root Directory**: `frontend`
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `.next` (auto-detected)
- **Install Command**: `npm install` (auto-detected)

### Step 3: Configure Environment Variables

Add the following environment variable:

```
NEXT_PUBLIC_API_URL=https://your-app-name.up.railway.app
```

Replace with your actual Railway backend URL.

### Step 4: Deploy

Click **Deploy** and wait for deployment to complete.

### Step 5: Get Frontend URL

Vercel will provide a URL like:
```
https://your-app-name.vercel.app
```

---

## Part 3: Update CORS Configuration

### Important: Update Backend CORS

1. Go back to **Railway dashboard**
2. Update the `CORS_ORIGINS` variable:
   ```
   CORS_ORIGINS=https://your-app-name.vercel.app
   ```
3. Railway will automatically redeploy

---

## Part 4: Initialize Database (One-time)

After backend is deployed, you need to create the database tables:

### Option A: Using Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Link to your project
railway link

# Run the table creation script
railway run python create_tables.py
```

### Option B: Using Local Script

```bash
# Update backend/.env with production DATABASE_URL
# Then run locally:
cd backend
python create_tables.py
```

---

## Part 5: Test Production Deployment

1. **Visit your frontend**: `https://your-app-name.vercel.app`
2. **Register a new account**
3. **Login**
4. **Create, edit, and delete tasks**
5. **Verify everything works!**

---

## Verification Checklist

- [ ] Backend health check returns 200: `/health`
- [ ] API docs are accessible: `/docs`
- [ ] Database tables created (users, tasks)
- [ ] Frontend loads without errors
- [ ] User registration works
- [ ] User login works
- [ ] Task creation works
- [ ] Task editing works
- [ ] Task completion toggle works
- [ ] Task deletion works
- [ ] Toast notifications appear
- [ ] Responsive design works on mobile

---

## Environment Variables Summary

### Railway (Backend)

```env
DATABASE_URL=<your-neon-postgres-url>
JWT_SECRET=<your-secret-key-min-32-chars>
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24
API_V1_PREFIX=/api/v1
CORS_ORIGINS=<your-vercel-frontend-url>
HOST=0.0.0.0
PORT=$PORT
```

### Vercel (Frontend)

```env
NEXT_PUBLIC_API_URL=<your-railway-backend-url>
```

---

## Troubleshooting

### Backend Issues

**500 Internal Server Error**
- Check Railway logs
- Verify DATABASE_URL is correct
- Ensure tables are created

**CORS Errors**
- Update CORS_ORIGINS in Railway
- Must include full URL with https://
- No trailing slash

**Database Connection Failed**
- Check Neon database is active
- Verify connection string includes SSL settings

### Frontend Issues

**API calls failing**
- Verify NEXT_PUBLIC_API_URL is set correctly
- Check backend is deployed and running
- Test backend health endpoint

**Build Failed**
- Check for TypeScript errors
- Verify all dependencies are in package.json
- Check build logs in Vercel dashboard

**Environment variables not working**
- Redeploy after adding variables
- Environment variables must start with NEXT_PUBLIC_ to be available in browser

---

## Continuous Deployment

Both Railway and Vercel support automatic deployments:

- **Push to main branch** → Automatic deployment
- **Pull requests** → Preview deployments (Vercel)
- **Rollback** → Available in both platforms

---

## Monitoring

### Railway
- View logs in Railway dashboard
- Monitor resource usage
- Set up alerts

### Vercel
- View deployment logs
- Monitor performance
- View analytics

---

## Custom Domains (Optional)

### Railway
1. Go to Settings → Domains
2. Add your custom domain
3. Update DNS records

### Vercel
1. Go to Project Settings → Domains
2. Add your custom domain
3. Vercel will provide DNS configuration

---

## Security Recommendations

1. **Change JWT_SECRET** to a strong random string (min 32 characters)
2. **Use HTTPS** everywhere (automatic with Railway and Vercel)
3. **Rotate secrets** periodically
4. **Monitor logs** for suspicious activity
5. **Keep dependencies updated**: `npm audit` and `pip check`

---

## Cost Estimation

### Free Tier Limits

**Railway** (Hobby Plan):
- $5 credit/month
- Enough for small apps
- Upgrade for more resources

**Vercel** (Hobby Plan):
- Unlimited deployments
- 100 GB bandwidth
- Perfect for this project

**Neon** (Free Tier):
- 0.5 GB storage
- Good for development/small apps

---

## Support

If you encounter issues:
1. Check Railway logs: `railway logs`
2. Check Vercel logs in dashboard
3. Test backend API directly
4. Verify environment variables
5. Check database connection

---

**🎉 Deployment Complete!**

Your Todo application is now live and accessible worldwide!

- **Backend**: https://your-app.up.railway.app
- **Frontend**: https://your-app.vercel.app
- **API Docs**: https://your-app.up.railway.app/docs

**Share your app and start managing tasks! 🚀**
