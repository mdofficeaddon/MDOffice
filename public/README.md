# MDOffice - Markdown Office Editor - Static Website

This directory contains the static HTML landing page for the MDOffice - Markdown Office Editor VS Code extension.

## Deployment

This site is designed to be deployed on **Cloudflare Pages**.

### Quick Deploy to Cloudflare Pages

1. **Connect your repository to Cloudflare Pages:**
   - Go to [Cloudflare Pages Dashboard](https://dash.cloudflare.com/)
   - Click "Create a project"
   - Connect your GitHub repository

2. **Configure build settings:**
   - **Build command:** (leave empty - static HTML)
   - **Build output directory:** `public`
   - **Root directory:** `/` (or leave as default)

3. **Deploy:**
   - Click "Save and Deploy"
   - Your site will be live in minutes!

### Manual Deployment

Alternatively, you can deploy manually:

```bash
# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy the site
wrangler pages publish public --project-name=md-office-editor
```

## Local Development

To preview the site locally:

1. Open `index.html` directly in a browser
2. Or use a simple HTTP server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve public

# Using PHP
php -S localhost:8000
```

Then visit `http://localhost:8000`

## Customization

### Update Publisher Name
Before deploying, update the publisher name in the links:
- Search for `your-publisher-name` in `index.html`
- Replace with your actual VS Code Marketplace publisher name

### Add Screenshots
You can add screenshots to make the page more engaging:
1. Place screenshots in `public/images/`
2. Update the HTML to include image sections

### Custom Domain
To use a custom domain with Cloudflare Pages:
1. Go to your project settings in Cloudflare Pages
2. Navigate to "Custom domains"
3. Add your domain and follow DNS configuration steps

## Features of the Landing Page

- ✨ Modern, responsive design
- 🎨 Beautiful gradient hero section
- 📱 Mobile-friendly layout
- ⚡ Fast loading with minimal dependencies
- 🔍 SEO optimized with meta tags
- 🎯 Smooth scrolling navigation
- 🌊 Scroll-triggered animations
- 💯 Pure HTML/CSS/JavaScript (no build step required)

## File Structure

```
public/
├── index.html          # Main landing page
└── README.md          # This file
```

## License

This landing page is part of the MDOffice - Markdown Office Editor project and is licensed under the MIT License.

