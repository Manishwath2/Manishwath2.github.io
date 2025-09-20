# GitHub Pages Personal Website

This is a minimal GitHub Pages repository hosting a personal website at `cv-matrix.me` (with GitHub fallback at `manishwath2.github.io`). The site uses GitHub's automatic deployment for static content.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

### Repository Structure
- `README.md` - Basic repository description
- `CNAME` - Custom domain configuration (cv-matrix.me)
- `index.html` - Main website content (create if needed)
- Any additional `.html`, `.css`, `.js` files for static content

### No Build Process Required
- This is a static GitHub Pages site with NO build process
- GitHub automatically deploys any HTML/CSS/JS files pushed to the `main` branch
- Deployment typically takes 2-5 minutes after push. NEVER CANCEL deployment.
- No package.json, no npm install, no build commands needed

### Working with the Repository
- Clone: `git clone https://github.com/Manishwath2/Manishwath2.github.io.git`
- Make changes to HTML/CSS/JS files directly
- Test locally using any web server: `python3 -m http.server 8000` or `npx serve .`
- Commit and push changes to current branch: 
  ```bash
  git add .
  git commit -m "Your change description"
  git push origin $(git branch --show-current)
  ```
- Note: GitHub Pages deploys from the `main` branch by default

### GitHub Pages Deployment
- Automatic deployment via GitHub Pages workflow from `main` branch
- Deployment takes 2-5 minutes. NEVER CANCEL the deployment workflow.
- Check deployment status at: https://github.com/Manishwath2/Manishwath2.github.io/actions
- Site accessible at: https://cv-matrix.me (custom domain) or https://manishwath2.github.io (GitHub fallback)
- Changes only deploy when merged to `main` branch

## Validation

### Manual Testing Requirements
- ALWAYS test changes locally before pushing:
  - Run local web server: `python3 -m http.server 8000`
  - Open http://localhost:8000 in browser
  - Verify all links work and content displays correctly
  - Test responsive design on different screen sizes
- After pushing changes:
  - Wait 2-5 minutes for GitHub Pages deployment
  - Verify site is accessible at both https://cv-matrix.me and https://manishwath2.github.io
  - Test all navigation and functionality end-to-end

### Required Validation Steps
- Always validate HTML syntax using: `npx html-validate *.html` (install if needed)
- Test site functionality by navigating through all pages/sections
- Verify custom domain (cv-matrix.me) resolves correctly after changes
- Check browser console for any JavaScript errors

## Common Tasks

### Adding New Content
- Create new `.html` files in repository root
- Link to new pages from existing navigation
- Images and assets go in subdirectories (e.g., `images/`, `css/`, `js/`)
- Always test locally before pushing

### Updating Custom Domain
- Edit `CNAME` file to change custom domain
- Domain changes may take 24-48 hours to propagate globally
- Always verify both old and new domains work during transition

### Repository File Listing
```
.
├── README.md           # Repository description
├── CNAME              # Custom domain configuration
├── index.html         # Main website content
├── .github/           # GitHub configuration
│   └── copilot-instructions.md
└── .git/              # Git repository data
```

### Key URLs and Resources
- Live site: https://cv-matrix.me
- GitHub fallback: https://manishwath2.github.io  
- Repository: https://github.com/Manishwath2/Manishwath2.github.io
- Deployment status: https://github.com/Manishwath2/Manishwath2.github.io/actions

## Troubleshooting

### Common Issues
- **Site not updating**: Wait 5-10 minutes for GitHub Pages deployment, check Actions tab for deployment status
- **Custom domain not working**: Verify CNAME file contains correct domain, check DNS settings at domain provider
- **404 errors**: Ensure file names are exactly correct (case-sensitive), verify all links use correct paths
- **CSS/JS not loading**: Check file paths are relative and correct, verify files are committed to repository

### Emergency Procedures
- If custom domain fails: Site automatically falls back to https://manishwath2.github.io
- To disable custom domain: Delete or rename CNAME file
- To revert changes: Use `git revert <commit-hash>` and push to main branch

## Important Notes
- This repository has NO build process - it's purely static content
- All changes are immediately visible after GitHub Pages deployment (2-5 minutes)
- Always test locally first using a simple web server
- Keep HTML/CSS/JS files clean and well-organized
- GitHub Pages has file size limits (1GB repository, 100MB individual files)