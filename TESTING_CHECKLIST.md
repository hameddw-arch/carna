# CARNA Testing Checklist - Priority 2

## 📋 Pages to Test

### Public Pages (No Auth Required)
- [ ] `/` - Home page
- [ ] `/browse` - Browse Cars listing
- [ ] `/car/:id` - Car detail page (with images, tags, view count)
- [ ] `/workshops` - Workshops directory
- [ ] `/compare` - Car comparison
- [ ] `/about` - About CARNA (newly added)
- [ ] `/contact` - Contact page
- [ ] `/privacy` - Privacy policy
- [ ] `/terms` - Terms & conditions
- [ ] `/plans` - Subscription plans
- [ ] `/login` - Login page

### Protected Pages (Auth Required)
- [ ] `/dashboard` - User dashboard
- [ ] `/post-ad` - Create new ad
- [ ] `/wallet` - Wallet & top-ups
- [ ] `/messages` - Messages/chat
- [ ] `/favorites` - Favorites list
- [ ] `/account-settings` - Account settings

### Admin Pages
- [ ] `/admin` - Admin dashboard with 8 tabs:
  - [ ] Dashboard (KPIs, listings, transactions)
  - [ ] Settings (system settings, governorates)
  - [ ] Logs (activity logs)
  - [ ] Reviews (review management)
  - [ ] Workshops (workshop management)
  - [ ] Workshop Approvals (pending approvals)
  - [ ] Users (user management)
  - [ ] Services (services list)

### Workshop Pages
- [ ] `/workshop/:id` - Workshop detail
- [ ] `/workshop-registration` - Register workshop
- [ ] `/workshop-admin` - Workshop dashboard

---

## 🔍 Functional Tests

### Navigation & Links
- [ ] Header logo links to home
- [ ] Navigation menu items work correctly
- [ ] RTL (right-to-left) layout is correct
- [ ] Footer links work
- [ ] Breadcrumbs display and navigate correctly

### Responsive Design
- [ ] Desktop view (1920px) renders correctly
- [ ] Tablet view (768px) renders correctly
- [ ] Mobile view (375px) renders correctly
- [ ] Touch targets are adequate (min 44px)
- [ ] No horizontal scrolling on mobile
- [ ] Images scale properly

### Form Handling
- [ ] Input validation works
- [ ] Error messages display clearly
- [ ] Success messages appear
- [ ] Form buttons are clickable
- [ ] Search/filter functionality works

### Images & Media
- [ ] Car images load properly
- [ ] Workshop images display
- [ ] Images are lazy-loaded
- [ ] No broken image links (404s)
- [ ] Image alt text is present

### Performance
- [ ] Pages load within 3 seconds
- [ ] No console errors
- [ ] No memory leaks on navigation
- [ ] Smooth scrolling

### SEO Elements
- [ ] Meta titles are present and unique
- [ ] Meta descriptions are present
- [ ] H1 tags exist on each page
- [ ] Open Graph tags for sharing
- [ ] Sitemap.xml is valid

### Accessibility
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Color contrast adequate
- [ ] Form labels associated with inputs
- [ ] ARIA attributes present where needed

---

## 🐛 Known Issues to Check

### Browser Compatibility
- [ ] Chrome/Edge latest
- [ ] Firefox latest
- [ ] Safari (if accessible)
- [ ] Mobile browsers

### Edge Cases
- [ ] Empty states (no data)
- [ ] Loading states
- [ ] Error states
- [ ] Network failures
- [ ] Very long text content
- [ ] Special characters (Arabic)

---

## 📊 Testing Environment

- URL: http://localhost:5173
- Node version: (check output)
- Browser: (manual testing)
- Network: (Normal + Slow 3G)

---

## Notes

Start with public pages, then protected pages, then admin. Focus on:
1. Functionality (does it work?)
2. Design (does it look right?)
3. Performance (is it fast?)
4. Accessibility (is it usable?)

