# Deployment Guide - Render + Vercel

## Overview
This guide will help you deploy:
- **Backend** → Render (FastAPI/Python)
- **Frontend** → Vercel (Next.js)
- **Database** → Neon PostgreSQL (already configured)

---

## Prerequisites
- GitHub account
- Render account (https://render.com)
- Vercel account (https://vercel.com)
- Git installed locally

---

## Part 1: Deploy Backend to Render

### Step 1: Push to GitHub

```bash
# Make sure your code is pushed to GitHub
cd Todo-Web-Application
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### Step 2: Create Render Account

1. **Go to**: https://render.com
2. **Sign up** with GitHub
3. Authorize Render to access your repositories

### Step 3: Create New Web Service

1. Click **"New +"** → **"Web Service"**
2. **Connect your GitHub repository**: `Todo-Web-Application`
3. If not showing up, click **"Configure account"** and grant access

### Step 4: Configure Service Settings

Fill in the following settings:

```
Name: todo-api-backend
Region: Oregon (US West) or closest to your users
Branch: main (or 001-multi-user-todo)

Root Directory: backend        ← IMPORTANT!
Runtime: Python 3

Build Command: pip install -r requirements.txt
Start Command: uvicorn src.main:app --host 0.0.0.0 --port $PORT

Instance Type: Free
```

### Step 5: Configure Environment Variables

Click **"Advanced"** and add these environment variables:

```env
DATABASE_URL
postgresql://neondb_owner:npg_tajEZIPKvl07@ep-rough-dream-ahgydxk8-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require

JWT_SECRET
<your-generated-secret-32-chars>

JWT_ALGORITHM
HS256

JWT_EXPIRATION_HOURS
24

API_V1_PREFIX
/api/v1

CORS_ORIGINS
http://localhost:3000

HOST
0.0.0.0
```

⚠️ **Important**: Generate a strong `JWT_SECRET` for production:
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### Step 6: Deploy

1. Click **"Create Web Service"**
2. Wait for deployment to complete (2-5 minutes)
3. Render will provide a URL like: `https://todo-api-backend.onrender.com`

### Step 7: Verify Backend Deployment

Test your backend endpoints:

```bash
# Health check
curl https://your-backend-url.onrender.com/health

# Should return:
{"status":"healthy","service":"todo-api"}

# API info
curl https://your-backend-url.onrender.com/

# Should return:
{"message":"Todo API","version":"1.0.0","docs":"/docs","health":"/health"}
```

---

## Part 2: Deploy Frontend to Vercel

### Step 1: Go to Vercel

1. **Visit**: https://vercel.com
2. **Sign in** with GitHub

### Step 2: Import Project

1. Click **"Add New..."** → **"Project"**
2. **Import your GitHub repository**: `Todo-Web-Application`

### Step 3: Configure Project Settings

```
Framework Preset: Next.js
Root Directory: frontend
Build Command: npm run build (auto-detected)
Output Directory: .next (auto-detected)
Install Command: npm install (auto-detected)
```

### Step 4: Configure Environment Variables

Add the following environment variables:

```env
NEXT_PUBLIC_API_URL
https://your-backend-url.onrender.com

BETTER_AUTH_SECRET
<same-secret-as-backend-jwt-secret>

BETTER_AUTH_URL
https://your-app-name.vercel.app
```

⚠️ **Important**:
- `BETTER_AUTH_SECRET` MUST match the `JWT_SECRET` from backend
- `BETTER_AUTH_URL` will be your Vercel URL (you can update this after first deployment)

### Step 5: Deploy

1. Click **"Deploy"**
2. Wait for deployment to complete (2-3 minutes)
3. Vercel will provide a URL like: `https://your-app-name.vercel.app`

### Step 6: Update BETTER_AUTH_URL

1. After first deployment, copy your Vercel URL
2. Go to Vercel dashboard → **Settings** → **Environment Variables**
3. Update `BETTER_AUTH_URL` with your actual Vercel URL
4. **Redeploy** the frontend

---

## Part 3: Update Backend CORS Configuration

### Important: Update Backend CORS

Now that you have your frontend URL, update the backend CORS settings:

1. Go back to **Render dashboard**
2. Select your **backend service**
3. Go to **Environment** tab
4. Update the `CORS_ORIGINS` variable:
   ```
   CORS_ORIGINS=https://your-app-name.vercel.app
   ```
5. Render will automatically redeploy

---

## Part 4: Test Production Deployment

### Complete Testing Checklist

1. ✅ **Visit your frontend**: `https://your-app-name.vercel.app`
2. ✅ **Register a new account**
3. ✅ **Login with your account**
4. ✅ **Create a new task**
5. ✅ **Edit a task**
6. ✅ **Mark task as complete**
7. ✅ **Delete a task**
8. ✅ **Test on mobile device** (responsive design)
9. ✅ **Check browser console** (no CORS errors)

---

## Environment Variables Summary

### Render (Backend)

```env
DATABASE_URL=<your-neon-postgres-connection-string>
JWT_SECRET=<your-secret-key-min-32-chars>
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24
API_V1_PREFIX=/api/v1
CORS_ORIGINS=<your-vercel-frontend-url>
HOST=0.0.0.0
```

### Vercel (Frontend)

```env
NEXT_PUBLIC_API_URL=<your-render-backend-url>
BETTER_AUTH_SECRET=<same-as-backend-jwt-secret>
BETTER_AUTH_URL=<your-vercel-frontend-url>
```

---

## Troubleshooting

### Backend Issues

**500 Internal Server Error**
- Check Render logs: Dashboard → Logs tab
- Verify `DATABASE_URL` is correct
- Ensure database tables are created (should auto-create on first user registration)

**CORS Errors in Browser**
- Update `CORS_ORIGINS` in Render dashboard
- Must include full URL with `https://`
- No trailing slash
- Redeploy backend after updating

**Database Connection Failed**
- Check Neon database is active (free tier doesn't auto-sleep)
- Verify connection string includes `?sslmode=require`
- Test connection from Render shell (if available)

**Build Failed on Render**
- Check `Root Directory` is set to `backend`
- Verify `requirements.txt` exists in backend folder
- Check build logs for missing dependencies

### Frontend Issues

**API calls failing**
- Verify `NEXT_PUBLIC_API_URL` is set correctly in Vercel
- Check backend is deployed and running
- Test backend health endpoint directly
- Check browser console for exact error

**Build Failed on Vercel**
- Check for TypeScript errors locally: `npm run build`
- Verify all dependencies are in `package.json`
- Check build logs in Vercel dashboard
- Ensure `Root Directory` is set to `frontend`

**Environment variables not working**
- Redeploy after adding variables
- Environment variables starting with `NEXT_PUBLIC_` are exposed to browser
- Other env vars are only available at build time

**CORS errors after deployment**
- Verify backend `CORS_ORIGINS` matches your Vercel URL exactly
- Check for `http://` vs `https://` mismatch
- No trailing slashes in URLs

---

## Render Free Tier Information

### What You Get (Free Tier)

- **750 hours per month** of runtime
- **Automatic HTTPS** with SSL certificates
- **Auto-deploy** on git push
- **Environment variables** support
- **Log streaming**

### Important Limitations

⚠️ **Free tier services spin down after 15 minutes of inactivity**

What this means:
- First request after inactivity takes ~30 seconds (cold start)
- Subsequent requests are fast
- Perfect for demos and personal projects
- Consider upgrading to **Starter ($7/month)** for always-on service

### To Keep Backend Always Running

Upgrade to Render Starter plan:
1. Go to Render dashboard
2. Select your service
3. Click **"Upgrade"**
4. Choose **Starter** plan ($7/month)

---

## Continuous Deployment

Both Render and Vercel support automatic deployments:

### Render
- **Push to main branch** → Automatic deployment
- **Manual deploy** → Click "Manual Deploy" in dashboard
- **Rollback** → Deploy previous commit from dashboard

### Vercel
- **Push to main branch** → Automatic production deployment
- **Pull requests** → Automatic preview deployments
- **Rollback** → Click "Rollback" on any previous deployment

---

## Monitoring & Logs

### Render Dashboard

- **Logs**: Real-time log streaming
- **Metrics**: CPU, memory usage
- **Events**: Deployment history
- **Shell**: Access to container shell (paid plans)

### Vercel Dashboard

- **Deployments**: View all deployments
- **Runtime Logs**: Function execution logs
- **Analytics**: Page views, performance (paid feature)
- **Speed Insights**: Core Web Vitals

---

## Custom Domains (Optional)

### Add Custom Domain to Render

1. Go to Render dashboard → **Settings** → **Custom Domain**
2. Add your domain (e.g., `api.yourdomain.com`)
3. Update DNS records with your domain provider:
   ```
   CNAME api.yourdomain.com → your-app.onrender.com
   ```
4. Render automatically provisions SSL certificate

### Add Custom Domain to Vercel

1. Go to Vercel dashboard → **Settings** → **Domains**
2. Add your domain (e.g., `yourdomain.com`)
3. Vercel provides DNS configuration:
   ```
   A     @    76.76.21.21
   CNAME www  cname.vercel-dns.com
   ```
4. Update DNS with your domain provider
5. SSL is automatically configured

---

## Security Recommendations

### Essential Security Steps

1. ✅ **Change JWT_SECRET** to a strong random string (min 32 characters)
2. ✅ **Use HTTPS** everywhere (automatic with Render and Vercel)
3. ✅ **Rotate secrets** periodically (every 90 days recommended)
4. ✅ **Monitor logs** for suspicious activity
5. ✅ **Keep dependencies updated**:
   ```bash
   # Backend
   pip list --outdated
   pip install --upgrade <package>

   # Frontend
   npm audit
   npm update
   ```

### Production Checklist

- [ ] Strong, unique JWT_SECRET generated
- [ ] CORS configured with exact frontend URL
- [ ] Database connection string uses SSL (`?sslmode=require`)
- [ ] No secrets committed to Git
- [ ] Environment variables set in deployment platforms (not in code)
- [ ] HTTPS enabled (automatic)
- [ ] Error logging configured
- [ ] Database backups enabled (Neon automatic backups)

---

## Cost Estimation

### Free Tier Limits

**Render (Free Tier)**:
- ✅ 750 hours per month (enough for one always-on app)
- ✅ Automatic SSL
- ✅ Deploy from GitHub
- ⚠️ Services sleep after 15 min inactivity
- **Upgrade**: $7/month for always-on

**Vercel (Hobby Plan - Free)**:
- ✅ Unlimited deployments
- ✅ 100 GB bandwidth per month
- ✅ Automatic SSL
- ✅ Perfect for this project
- **Upgrade**: $20/month for Pro features

**Neon (Free Tier)**:
- ✅ 0.5 GB storage
- ✅ 1 project
- ✅ Automatic backups
- ✅ Good for development and small apps
- **Upgrade**: $19/month for more storage

**Total Monthly Cost: $0** (with free tiers)

---

## Scaling Considerations

### When to Upgrade

**Backend (Render)**:
- Upgrade when you need always-on service (no cold starts)
- Or when you exceed 750 hours/month
- **Starter**: $7/month - always-on, 512MB RAM
- **Standard**: $25/month - 2GB RAM, more CPU

**Frontend (Vercel)**:
- Free tier is usually sufficient
- Upgrade for team features, analytics, or high traffic
- **Pro**: $20/month per user

**Database (Neon)**:
- Upgrade when you exceed 0.5 GB storage
- Or need more than 1 project
- **Launch**: $19/month - 10 GB storage

---

## Support Resources

### Documentation
- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **FastAPI Deployment**: https://fastapi.tiangolo.com/deployment/
- **Next.js Deployment**: https://nextjs.org/docs/deployment

### Getting Help
- **Render Community**: https://community.render.com
- **Vercel Discord**: https://vercel.com/discord
- **FastAPI Discord**: https://discord.gg/fastapi
- **Next.js Discussions**: https://github.com/vercel/next.js/discussions

---

## Migration from Local to Production

### Database Migration

Your Neon database is already configured for production. No migration needed since you're using the same database for both development and production.

**Best Practice** (for future):
1. Create separate database for production
2. Use Neon branching feature for staging/dev databases
3. Never use production database for local development

### Environment-Specific Configs

Current setup uses single database. For better separation:

**Local Development**:
```env
DATABASE_URL=<neon-dev-branch>
JWT_SECRET=dev-secret-not-secure
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

**Production (Render)**:
```env
DATABASE_URL=<neon-main-branch>
JWT_SECRET=<strong-generated-secret>
CORS_ORIGINS=https://your-app.vercel.app
```

---

## Post-Deployment Maintenance

### Regular Tasks

**Weekly**:
- Check Render logs for errors
- Monitor Vercel analytics (if enabled)
- Review Neon database size

**Monthly**:
- Update dependencies
- Review security advisories
- Check for new features in Render/Vercel
- Rotate secrets (recommended every 90 days)

**As Needed**:
- Scale up if hitting free tier limits
- Add custom domain
- Configure monitoring/alerts
- Set up error tracking (Sentry, etc.)

---

## Backup & Recovery

### Database Backups

**Neon PostgreSQL**:
- ✅ Automatic backups on free tier
- ✅ Point-in-time recovery
- ✅ 7-day retention

To restore:
1. Go to Neon dashboard
2. Select your database
3. Go to **Backups** tab
4. Click **Restore** on desired backup point

### Application Recovery

**Render**:
- Redeploy previous commit from dashboard
- Or deploy from specific Git commit

**Vercel**:
- Click **Rollback** on any previous deployment
- Instant rollback to last working version

---

## Conclusion

**🎉 Your Todo application is now deployed to production!**

**Live URLs**:
- **Backend API**: https://your-backend.onrender.com
- **Frontend App**: https://your-app.vercel.app
- **API Docs**: https://your-backend.onrender.com/docs

**Next Steps**:
1. Share your app with users
2. Monitor logs and performance
3. Consider adding features:
   - Email notifications
   - Task reminders
   - Categories/tags
   - Collaboration features
4. Set up analytics
5. Configure custom domain

**Questions or Issues?**
- Check the troubleshooting section above
- Review platform documentation
- Check GitHub repository issues

**Happy deploying! 🚀**
