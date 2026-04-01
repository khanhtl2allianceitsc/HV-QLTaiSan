# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Context

**HV-QLTaiSan** — Web app for asset management & incident operations for a pharmacy chain (chuỗi nhà thuốc Hồng Vân). Currently in pre-development phase; the repo holds only the PRD/UX brief.

Primary specification: `docs/mockup_brief_asset_management_pharmacy_chain.md`

---

## Product Overview

- Each asset has a unique ID/QR code and its own record
- Assets can be looked up by QR scan or manual search
- Core workflows: asset tracking → periodic inventory → incident reporting → operations task management → SLA monitoring
- Platform: **web app**, mobile-first (field staff use phones), also desktop

## User Roles

| Role | Key Capabilities |
|------|-----------------|
| Nhân viên quầy (Counter Staff) | Report incidents, track repairs, confirm completion |
| Nhân viên kiểm kê (Auditor) | Run inventory cycles, scan assets, update status |
| Bộ phận vận hành (Operations) | Accept tasks, update costs/photos, mark done |
| Quản lý vận hành (Ops Manager) | Monitor SLA, escalate overdue, view dashboards |
| Admin | Users, roles, catalogs, SLA config |

## SLA Levels

- **Level 1 (Critical)**: Revenue/safety impact — 1hr response / 8hr resolution
- **Level 2 (Normal)**: Operational impact — 4hr response / 48hr resolution
- **Level 3 (Enhancement)**: Aesthetic/minor — 4hr response / 48hr resolution

## Key Modules (Planned)

1. Auth (login, password reset, profile)
2. Asset management (list, detail, QR link, create/edit)
3. Inventory (audit cycles, per-pharmacy checklists, reports)
4. Incident reporting (defect/repair requests, photo evidence)
5. Task management (table + Kanban, status flow, cost tracking)
6. Notifications (center, filters, deep links)
7. Pharmacy management (locations, asset assignments)
8. Dashboards & reporting (SLA, cost, incident trends)
9. Admin console (users, roles, catalogs, SLA rules)

## UX Guidelines

- Mobile-first; large tap targets; minimal input steps
- One-handed operation for field use (FABs, sticky bottom actions)
- QR scan → direct asset detail page
- Status colors: green = good, yellow = pending, red = urgent, gray = archived
- 45 screens total per the brief (auth, dashboards, pharmacy mgmt, assets, inventory, incidents, tasks, notifications, reports, admin)
