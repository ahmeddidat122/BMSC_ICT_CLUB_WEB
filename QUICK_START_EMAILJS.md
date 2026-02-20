# Quick Start: EmailJS Setup

## 🚀 Quick Steps

### 1. Sign up at EmailJS
👉 Go to: **https://www.emailjs.com/** and create a free account

### 2. Get Your Credentials

After signing up, you'll need 3 things:

1. **Service ID** - From "Email Services" section
2. **Template ID** - From "Email Templates" section  
3. **Public Key** - From "Account" → "General"

### 3. Update Your .env File

Open the `.env` file in your project root and replace the placeholder values:

```env
PUBLIC_EMAILJS_SERVICE_ID=service_xxxxxxx
PUBLIC_EMAILJS_TEMPLATE_ID=template_xxxxxxx
PUBLIC_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxx
```

### 4. Restart Your Dev Server

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npx vite dev
```

### 5. Test It!

1. Go to `http://localhost:3000/contact`
2. Fill out the form
3. Submit
4. Check your email! 📧

---

## 📧 Email Template Example

When creating your template in EmailJS, use these variables:

**Subject:**
```
New Contact Form - {{subject}}
```

**Body:**
```
You have a new message from the BMSC ICT Club website!

From: {{from_name}}
Email: {{from_email}}
Phone: {{phone}}

Subject: {{subject}}

Message:
{{message}}

---
Sent from BMSC ICT Club Contact Form
```

**To Email:** Set this to your club's email (e.g., info@bmscictclub.com)

---

## ✅ That's It!

Your contact form will now send real emails! 

For detailed instructions, see **EMAILJS_SETUP.md**

## 🆓 Free Tier
- 200 emails/month
- Perfect for getting started!

