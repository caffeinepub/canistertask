# Specification

## Summary
**Goal:** Build CanisterTask, a decentralized gig economy PWA platform on ICP that connects AI agents with human workers for real-world tasks, featuring Internet Identity authentication, dual-profile system (workers/agents), escrow-based payments with EU-regulated fiat ramps, GPS-verified task proofs stored on IPFS, AR capture capabilities, and full GDPR compliance for the Portuguese and EU markets.

**Planned changes:**
- Implement Internet Identity authentication gateway requiring login before any platform access
- Create dual profile system: human workers (name, photo, skills dropdown including AR captures, GPS location, action radius, pricing, availability, ratings, IPFS portfolio) and AI agents (name, description, task history)
- Build human worker dashboard with nearby task discovery, skill/location/price filters, task acceptance workflow, and proof upload (photo/video/GPS/AR) to IPFS
- Create public API for AI agents: POST /search (filter workers by skills/location/price), POST /hire (create on-chain contract), GET /status/{task_id} (track progress)
- Implement escrow smart contract with ICP/token deposits locked until validation (automatic GPS+AI image analysis OR 3-validator voting system), plus NNS-style dispute resolution
- Build dual payment system: native crypto (ICP/ckBTC/cycles) for instant on-chain payments, plus EU-regulated fiat (€) via MoonPay/Stripe on-ramp for clients and off-ramp for workers (IBAN PT/MBWay), with transparent fees and on-chain audit logs
- Integrate OpenStreetMap via HTTPS outcalls for worker location display, real-time GPS tracking, interactive task map, and heat map visualization for Évora/Lisboa
- Add WebXR integration for AR-based task proof capture and IPFS storage
- Create NFT badge system for high-performing workers and aggregate rating system visible in profiles
- Implement real-time messaging using canister signals for client-worker communication during active tasks
- Build analytics dashboard showing worker earnings, completion stats, and geographic heat maps for Évora/Lisboa, plus public on-chain platform metrics
- Add GDPR compliance features: self-service data deletion, explicit consent collection, data export, and privacy controls
- Generate Privacy Policy and Terms of Service in Portuguese/English with EU legal coverage and gig economy disclaimer
- Implement 18+ age verification gate via Internet Identity
- Create automatic Portuguese tax reporting (IVA) for workers earning >€10k/year with AT portal link
- Build mobile-first responsive UI with TailwindCSS, dark/light theme toggle, and Portuguese/English language switcher
- Add footer with creator attribution "CanisterTask © 2026 Hermínio Coragem (HCoragem)" and legal text about sovereign ICP platform and non-custodial payments
- Create About page with full creator attribution and platform architecture explanation
- Configure complete PWA: manifest.json, service worker for offline-first caching, and push notifications for task/payment updates
- Add social sharing (X/Telegram) with #CanisterTask #ICPSoberano hashtags, SEO meta tags, and custom ICP domain support
- Design visual theme with warm earth tones inspired by Évora architecture, professional typography, and intuitive gig economy icon system
- Display generated platform icon in manifest.json, favicon, and header logo

**User-visible outcome:** Users authenticate with Internet Identity, create profiles as either human workers (offering skills like photography, deliveries, AR captures with GPS location and pricing) or AI agents (managing tasks), discover and accept nearby gigs on an interactive OpenStreetMap interface, upload GPS/photo/video/AR proofs to IPFS, receive automatic payments via ICP escrow or convert to euros through regulated ramps to Portuguese bank accounts, earn NFT badges for performance, communicate in real-time with clients, view earnings analytics, and access all features as an installable PWA in Portuguese or English while remaining fully GDPR-compliant.
