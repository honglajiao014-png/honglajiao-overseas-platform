# Honglajiao Overseas Platform — Project Notes

## Project Identity

- **Project**: honglajiao-overseas-platform (全新海外独立站)
- **Path**: `/Users/mj/honglajiao-overseas-platform`
- **Tentative domain**: `honglajiao.com`
- **Reference site**: https://liangboss.com/ (public structure only)
- **Target market**: All African left-hand-drive countries
- **Business positioning**: China used cars, commercial vehicles, EVs, and construction machinery export procurement service for African buyers

## Relationship to Domestic Platform

- **Domestic platform path**: `/Users/mj/honglingjing-auto-platform`
- **Rule**: The domestic platform is a SEPARATE project. This overseas platform MUST NOT read, modify, or connect to the domestic platform's database, code, or configuration.
- **Data pipeline**: The domestic platform exports approved vehicle listings to `~/Desktop/已审核车源/<vehicleId>/`. This overseas platform consumes those exported JSON/image files via `scripts/import_exported_vehicles.ts`. No direct database connection between the two systems.

## Current Phase: V1 Static Overseas Site — COMPLETED

- Static Next.js site with imported vehicle data from `~/Desktop/已审核车源/`
- No database connection
- No login, registration, or admin panel
- No real email sending
- No payment integration
- No real domain deployment
- All forms are frontend-only with static success messages

## Tech Stack

- Next.js 16 (App Router, Turbopack)
- TypeScript
- Tailwind CSS v4
- Most pages statically prerendered (SSG); `/inquiry` is dynamic (uses searchParams)

## Completed Page Structure (13 routes)

| Route | Type | Description |
|---|---|---|
| `/` | Static | Home: Hero, Services overview, Vehicle teaser, Process, Quick inquiry form, Disclaimer |
| `/cars` | Static | Vehicle Listings: imported vehicles with filter UI, vehicle cards with real images, risk disclaimer |
| `/cars/[id]` | SSG | Vehicle Detail: image gallery, 9 spec fields, eligible countries, pricing card, CTA to inquiry |
| `/inquiry` | Dynamic | Full Inquiry Form: 12 fields, 46-country dropdown (LHD Africa prioritized), vehicleId prefill, risk disclaimer |
| `/services` | Static | Services Detail: 6 services each with scope and risk boundary |
| `/about` | Static | About: who we are, who we serve (4 client types), what we do (5 services), important notes |
| `/contact` | Static | Contact: inquiry CTA, contact channels (placeholder), 4 FAQs, disclaimer |
| `/en/china-used-cars-to-africa` | Static | SEO: Africa Overview — sourcing, popular vehicles, shipping, compliance |
| `/en/china-used-cars-to-nigeria` | Static | SEO: Nigeria import guide — Lagos ports, SON regulations, age limits |
| `/en/china-used-cars-to-ghana` | Static | SEO: Ghana import guide — Tema port, GSA standards, duty structure |
| `/en/china-used-cars-to-egypt` | Static | SEO: Egypt import guide — Alexandria/Port Said, EOS standards, EV incentives |
| `/en/africa-lhd-markets` | Static | LHD Markets: 33 African LHD countries by 7 regions, Why LHD Matters, RHD country list |

## Key Features (v1)

### Vehicle Data Import
- Script: `scripts/import_exported_vehicles.ts`
- Source: `~/Desktop/已审核车源/<vehicleId>/` (vehicle.json + manifest.json + images/)
- Output: `src/data/vehicles.ts` + `public/vehicles/<vehicleId>/`
- Run: `npx tsx scripts/import_exported_vehicles.ts`
- Handles missing files gracefully (warns, skips, does not crash)
- Auto-generates filterOptions (brands, years, fuelTypes) from imported data
- Forces `publicPriceLabel` to "Contact for price" — domestic costs NEVER exposed

### Vehicle Detail Pages
- Route: `/cars/<vehicleId>`
- Static generation via `generateStaticParams()`
- Invalid IDs return 404 via `notFound()`
- Content: image gallery (main + thumbnails), 9 spec fields, condition notes, eligible countries, pricing card, risk disclaimer
- CTA links to `/inquiry?vehicleId=<vehicleId>`

### Inquiry with Vehicle Prefill
- Route: `/inquiry?vehicleId=<vehicleId>`
- When vehicleId is valid: shows "Selected Vehicle" card with full vehicle summary
- Auto-prefills: Preferred Brand, Preferred Model, Message ("I am interested in...")
- When vehicleId is missing or invalid: shows normal inquiry form, no error
- Country dropdown: 46 options, African LHD countries listed first

### Africa LHD Markets Reference
- Route: `/en/africa-lhd-markets`
- 33 African LHD countries grouped by 7 regions
- Each country: name, region, port/import notes
- Why LHD Matters section explaining China-Africa vehicle compatibility
- RHD country list for reference

### Price Protection
- All vehicles display `publicPriceLabel: "Contact for price"` — domestic cost prices are NEVER exposed
- Import script forces `publicPriceLabel` to "Contact for price" regardless of source data
- Detail page pricing card shows "Contact for price" with disclaimer

## Navigation Structure

### Header
- Home (`/`)
- Vehicles (`/cars`)
- Services (`/services`)
- About (`/about`)
- Contact (`/contact`)
- Submit Inquiry CTA button (`/inquiry`)

### Footer
- Brand: Honglajiao Auto Export
- Quick Links: Home, Vehicles, Inquiry, Services, About, Contact
- Market Guides: Africa Overview, Africa LHD Markets, Nigeria Guide, Ghana Guide, Egypt Guide
- Contact: Inquiry Form, Contact Page, honglajiao.com

## Compliance & Risk Rules (ALL pages must follow)

1. **No fabricated company registration info** — no fake registration numbers, addresses, or incorporation dates
2. **No real office address** — do not publish any physical address
3. **No customs clearance guarantee** — always state that clearance depends on destination country authorities
4. **No final price commitment** — all prices are indicative, subject to supplier confirmation; public display is always "Contact for price"
5. **No shipping timeline guarantee** — transit times are estimates only
6. **Destination country regulations** — compliance is the buyer's responsibility
7. **All transactions subject to final contract terms**
8. **No real contact details** — email/phone/WhatsApp are placeholder or "shared after inquiry" only
9. **Domestic platform isolation** — never read/write `/Users/mj/honglingjing-auto-platform` from this project

## Brand Rules

- Site name: **Honglajiao Auto Export**
- Domain: **honglajiao.com** (tentative)
- Primary color: Red (`#dc2626`)
- All content in English
- Target audience: African car dealers, importers, fleet buyers, construction companies

## Data Pipeline (Current Implementation)

```
~/Desktop/已审核车源/<vehicleId>/
  ├── vehicle.json          (full vehicle data from domestic platform)
  ├── manifest.json         (export metadata, eligibleCountries)
  └── images/               (vehicle photos)

        ↓  scripts/import_exported_vehicles.ts

src/data/vehicles.ts        (generated static data, publicPriceLabel forced)
public/vehicles/<vehicleId>/ (copied images)
```

- Import is manual: run `npx tsx scripts/import_exported_vehicles.ts` then `npm run build`
- Future: could be automated as a pre-build step in package.json

## Future Work (Post-v1)

### Before Launch
- [ ] Company registration info and business license
- [ ] Logo and brand assets
- [ ] Real contact: email, phone, WhatsApp business account
- [ ] Domain registration and DNS setup (honglajiao.com)
- [ ] Hosting/deployment (Vercel or similar)
- [ ] SSL certificate
- [ ] Overseas pricing rules (public price vs internal cost mapping)

### Feature Enhancements
- [ ] Inquiry form backend (email notification or CRM integration)
- [ ] Vehicle filter logic (currently static UI only)
- [ ] Image lightbox on detail page
- [ ] More SEO country pages (Kenya, Tanzania, Ethiopia, etc.)
- [ ] French language version for Francophone Africa
- [ ] Auto-import on build (prebuild hook)
- [ ] Vehicle comparison feature
- [ ] WhatsApp share button on vehicle cards

## Local Development

```bash
cd /Users/mj/honglajiao-overseas-platform

# Import vehicle data from domestic platform exports
npx tsx scripts/import_exported_vehicles.ts

# Development
npm run dev -- -p 3001

# Production build
npm run build
```

Default dev port: **3001** (3002 fallback if occupied)
