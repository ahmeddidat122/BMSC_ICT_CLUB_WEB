# EmailJS Setup Guide for BMSC ICT Club Website

## Step 1: Create an EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Click **"Sign Up"** and create a free account
3. Verify your email address

## Step 2: Add an Email Service

1. After logging in, go to **"Email Services"** in the dashboard
2. Click **"Add New Service"**
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the instructions to connect your email account
5. **Copy the Service ID** - you'll need this later

## Step 3: Create an Email Template

1. Go to **"Email Templates"** in the dashboard
2. Click **"Create New Template"**
3. Use this template structure:

```
Subject: New Contact Form Submission - {{subject}}

From: {{from_name}}
Email: {{from_email}}
Phone: {{phone}}

Subject: {{subject}}

Message:
{{message}}

---
This message was sent from the BMSC ICT Club contact form.
```

4. **Template Variables to use:**
   - `{{from_name}}` - Sender's name
   - `{{from_email}}` - Sender's email
   - `{{phone}}` - Sender's phone number
   - `{{subject}}` - Message subject
   - `{{message}}` - Message content
   - `{{to_name}}` - Recipient name (BMSC ICT Club)

5. Set the **"To Email"** to your club's email address (e.g., info@bmscictclub.com)
6. **Copy the Template ID** - you'll need this later

## Step 4: Get Your Public Key

1. Go to **"Account"** → **"General"** in the dashboard
2. Find your **Public Key** (also called API Key)
3. **Copy the Public Key**

## Step 5: Configure Your Website

1. Create a `.env` file in your project root (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and add your credentials:
   ```
   PUBLIC_EMAILJS_SERVICE_ID=your_service_id_here
   PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id_here
   PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key_here
   ```

3. Replace the placeholder values in `src/routes/contact/+page.svelte`:
   - Replace `YOUR_SERVICE_ID` with your Service ID
   - Replace `YOUR_TEMPLATE_ID` with your Template ID
   - Replace `YOUR_PUBLIC_KEY` with your Public Key

## Step 6: Test the Contact Form

1. Start your dev server:
   ```bash
   npx vite dev
   ```

2. Go to `http://localhost:3000/contact`
3. Fill out and submit the form
4. Check your email inbox for the message!

## Free Tier Limits

- **200 emails per month** (free)
- Upgrade to paid plans for more emails

## Troubleshooting

### Emails not sending?
- Check your EmailJS dashboard for error logs
- Verify all IDs are correct
- Make sure your email service is properly connected
- Check browser console for errors

### Getting CORS errors?
- Make sure you're using the Public Key, not the Private Key
- EmailJS should work from localhost without issues

## Security Note

⚠️ **Important:** Never commit your `.env` file to Git! It's already in `.gitignore`.

The credentials in the code are public-facing (that's why they're called "Public Key"), but it's still good practice to use environment variables for easy configuration.

## Support

For more help, visit: [https://www.emailjs.com/docs/](https://www.emailjs.com/docs/)

