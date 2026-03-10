# Third-Party Services & Integration

This document lists external services required to build the platform. Using managed services reduces maintenance overhead.

## 1. Payment Gateway
- **Provider:** Stripe (Global) or Razorpay (India/Asia).
- **Purpose:** Process credit cards, UPI, and Net Banking.
- **Integration:** 
  - Frontend: Use provided SDK for secure input fields.
  - Backend: Use webhook to listen for payment success events asynchronously.
- **Cost:** Transaction fee per successful payment (e.g., 2.9% + 30¢).

## 2. Image Storage (CDN)
- **Provider:** Cloudinary or AWS S3 + CloudFront.
- **Purpose:** Store product images and user avatars.
- **Why:** Storing images in MongoDB slows down the database. CDNs serve images faster globally.
- **Features:** Auto-resizing, format optimization (WebP), lazy loading support.

## 3. Email Service
- **Provider:** SendGrid or AWS SES.
- **Purpose:** 
  - Order Confirmation emails.
  - Password Reset links.
  - Shipping Updates.
- **Integration:** Nodemailer library in backend.

## 4. Deployment & Hosting
- **Frontend:** Vercel or Netlify (Automatic CI/CD from GitHub).
- **Backend:** Render, Heroku, or AWS EC2.
- **Database:** MongoDB Atlas (Managed Cloud DB).
  - **Benefits:** Automated backups, scaling, and security monitoring.

## 5. Analytics (Optional)
- **Provider:** Google Analytics 4.
- **Purpose:** Track user behavior, conversion rates, and drop-off points in the checkout flow.
- **Privacy:** Ensure compliance with GDPR/CCPA (cookie consent banner).

## 6. Environment Variables (.env)
**Critical:** Never commit these files to GitHub.
```bash
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_super_secret_key
PAYPAL_CLIENT_ID=...
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...