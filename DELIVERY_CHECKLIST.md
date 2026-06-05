# Honglajiao Overseas Platform — Delivery Checklist (v1)

## Project Summary

| Item | Value |
|---|---|
| Project | honglajiao-overseas-platform |
| Path | `/Users/mj/honglajiao-overseas-platform` |
| Domain | honglajiao.com (tentative) |
| Version | v1 — Static Overseas Site |
| Status | COMPLETED |
| Date | 2026-05-28 |

---

## Page Inventory (13 routes)

| # | Route | Type | Status |
|---|---|---|---|
| 1 | `/` | Static | Done |
| 2 | `/cars` | Static | Done |
| 3 | `/cars/[id]` | SSG (2 pages) | Done |
| 4 | `/inquiry` | Dynamic | Done |
| 5 | `/services` | Static | Done |
| 6 | `/about` | Static | Done |
| 7 | `/contact` | Static | Done |
| 8 | `/en/china-used-cars-to-africa` | Static | Done |
| 9 | `/en/china-used-cars-to-nigeria` | Static | Done |
| 10 | `/en/china-used-cars-to-ghana` | Static | Done |
| 11 | `/en/china-used-cars-to-egypt` | Static | Done |
| 12 | `/en/africa-lhd-markets` | Static | Done |
| 13 | `/_not-found` | Static | Done (built-in) |

---

## Component Inventory (11 components)

| Component | Purpose |
|---|---|
| `Header.tsx` | Sticky nav: Home, Vehicles, Services, About, Contact, Submit Inquiry |
| `Hero.tsx` | Homepage hero with 3 CTAs |
| `Services.tsx` | 6 service cards on homepage |
| `VehicleListings.tsx` | Vehicle teaser section on homepage |
| `Process.tsx` | 5-step procurement process |
| `InquiryForm.tsx` | Quick inquiry form on homepage |
| `InquiryPageForm.tsx` | Full inquiry form (12 fields, 46 countries, vehicleId prefill) |
| `VehicleCard.tsx` | Vehicle card with image, specs, LHD badge, CTAs |
| `VehicleFilters.tsx` | Static filter UI (4 dropdowns) |
| `SeoPageContent.tsx` | Shared layout for 4 SEO country pages |
| `Disclaimer.tsx` | Risk disclaimer component |
| `Footer.tsx` | Footer with Quick Links, Market Guides, Contact |

---

## Script Inventory

| Script | Purpose | Command |
|---|---|---|
| `scripts/import_exported_vehicles.ts` | Import vehicles from domestic exports | `npx tsx scripts/import_exported_vehicles.ts` |

---

## Data Files

| File | Source | Auto-generated |
|---|---|---|
| `src/data/vehicles.ts` | `~/Desktop/已审核车源/` | Yes (by import script) |
| `src/data/seo-pages.ts` | Manual | No (static config) |
| `public/vehicles/<id>/` | `~/Desktop/已审核车源/<id>/images/` | Yes (copied by import script) |

---

## Data Flow

```
Domestic Platform (/Users/mj/honglingjing-auto-platform)
  ↓ exports approved vehicles
~/Desktop/已审核车源/<vehicleId>/
  ├── vehicle.json
  ├── manifest.json
  └── images/
  ↓ import script
Overseas Platform (/Users/mj/honglajiao-overseas-platform)
  ├── src/data/vehicles.ts (generated)
  └── public/vehicles/<vehicleId>/ (copied images)
  ↓ npm run build
Static HTML (all pages prerendered)
```

**No direct database connection between platforms.**

---

## Risk Boundaries (Enforced)

| Rule | Implementation |
|---|---|
| No domestic cost prices exposed | `publicPriceLabel` forced to "Contact for price" |
| No customs clearance guarantee | Disclaimer on every page |
| No final price commitment | "Subject to supplier confirmation" language |
| No real company registration | No registration numbers or addresses anywhere |
| No real contact details | Placeholder only ("shared after inquiry") |
| No domestic platform modification | Code never touches `/Users/mj/honglingjing-auto-platform` |
| No database connection | Static site, no DB imports or connections |
| No login/registration | No auth system implemented |
| No payment integration | No payment code anywhere |

---

## Test Commands

```bash
cd /Users/mj/honglajiao-overseas-platform

# Full verification pipeline
npm run build
npx tsx scripts/import_exported_vehicles.ts
npm run build
npm run dev -- -p 3001

# Curl all routes
for p in / /cars /cars/vMPO9D7P472XI /cars/v002 /inquiry /inquiry?vehicleId=vMPO9D7P472XI /services /about /contact /en/china-used-cars-to-africa /en/china-used-cars-to-nigeria /en/china-used-cars-to-ghana /en/china-used-cars-to-egypt /en/africa-lhd-markets; do
  curl -s -o /dev/null -w "$p %{http_code}\n" "http://localhost:3001$p"
done

# Banned terms check
grep -R "liangboss\|ChinaCarExport\|FOB\|EXW" src/app src/components || echo "Clean"

# Keyword check
grep -R "Honglajiao Auto Export\|Contact for price" src/app src/components | wc -l
```

---

## Pre-Launch Checklist (Before Going Live)

- [ ] Register domain: honglajiao.com
- [ ] Set up DNS and hosting (Vercel recommended)
- [ ] Add company registration info (when available)
- [ ] Add real contact: email, phone, WhatsApp
- [ ] Design and add logo
- [ ] Configure inquiry form backend (email/CRM)
- [ ] Set up SSL certificate
- [ ] Define overseas pricing rules (public price vs cost)
- [ ] Review all content for accuracy
- [ ] Add analytics (Google Analytics or similar)
- [ ] Test on mobile devices
- [ ] Submit sitemap to search engines

---

## Deliverables

| Item | File |
|---|---|
| Project documentation | `PROJECT_NOTES.md` |
| Quick start guide | `README.md` |
| Delivery checklist | `DELIVERY_CHECKLIST.md` (this file) |
| Source code | `src/` |
| Import script | `scripts/import_exported_vehicles.ts` |
| Vehicle data | `src/data/vehicles.ts` (auto-generated) |
