# Markdown Office Editor - Cloudflare Pages Deployment

This folder contains everything you need to deploy the Markdown Office Editor landing page to Cloudflare Pages.

## 🚀 Quick Deploy

### Method 1: Drag & Drop (Easiest)
1. Go to [Cloudflare Pages](https://dash.cloudflare.com/pages)
2. Click "Create a project"
3. Choose "Direct Upload"
4. **Drag and drop this entire `cloudflare-site` folder** (or select it)
5. Click "Deploy site"
6. Done! Your site will be live in seconds! 🎉

### Method 2: Wrangler CLI
```bash
# Install Wrangler CLI (if not already installed)
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy from this directory
cd cloudflare-site
wrangler pages publish . --project-name=md-office-editor
```

## 📁 What's Inside

- **index.html** - Complete, self-contained landing page
- **README.md** - This file

That's it! Everything is in one single HTML file (no external dependencies except Google Fonts).

## 🎨 Features

- ✨ Modern, responsive design
- 📱 Mobile-friendly
- ⚡ Lightning fast (single HTML file)
- 🎯 SEO optimized
- 🌊 Smooth animations
- 💯 No build process needed

## 🔧 Customization

If you want to make changes:
1. Edit `index.html` in any text editor
2. Re-upload to Cloudflare Pages
3. Changes will be live instantly!

## 🌐 Custom Domain

To add a custom domain:
1. Go to your Cloudflare Pages project
2. Click "Custom domains"
3. Add your domain and follow the DNS setup instructions

## 📝 Notes

- No build step required - just pure HTML/CSS/JS
- All styles are inline for maximum portability
- Uses Google Fonts (only external dependency)
- Fully self-contained and ready to deploy

## 🆘 Need Help?

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [GitHub Repository](https://github.com/mdofficeaddon/MDOffice)
- [Report Issues](https://github.com/mdofficeaddon/MDOffice/issues)

---

**Ready to deploy?** Just drag and drop this folder to Cloudflare Pages! 🎉

