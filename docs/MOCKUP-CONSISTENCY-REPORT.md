# ALE Mockup Consistency Verification Report

**Date:** February 18, 2025  
**Mockup source:** `/Users/I5285/Downloads/ale-mockup` (16 screens)  
**Purpose:** Verify color, structure, and pattern consistency across all ALE mockup screens and provide a plan to fix gaps.

---

## 1. Executive Summary

| Aspect | Status | Notes |
|--------|--------|------|
| **Header (global)** | ✅ Mostly consistent | Dark teal, white text, NT logo + ALE; minor hex variation |
| **Sidebar / nav** | ⚠️ **Inconsistent** | Mix of light grey vs dark teal sidebar; active state varies |
| **Primary buttons** | ✅ Consistent | SEARCH = teal + white text; RESET = light grey/white + dark text |
| **Main content** | ✅ Consistent | White or very light grey background |
| **Typography** | ✅ Consistent | Sans-serif, clear hierarchy |
| **Detail/modals** | ⚠️ **Varied** | Some screens lack global chrome; modal vs full-page patterns differ |
| **Section headers** | ⚠️ **Minor variance** | Teal banners vs plain headings; label color (teal vs grey) |
| **Metric/summary cards** | ⚠️ **Inconsistent** | Capital Call screens: two card styles on same page |

**Verdict:** Screens are **not fully similar**. Main gaps are **sidebar treatment**, **alternate layouts (no sidebar)**, **metric card styling**, and **teal hex standardization**. Below is a concise plan to align everything.

---

## 2. What’s Consistent Across Screens

- **Global header (when present):** Dark teal bar, “NORTHERN TRUST” + “Alternatives Lifecycle Engine” on the left, “ALE - Data View | SYSTEM” + user icon on the right, white text.
- **Primary actions:** “SEARCH” = solid teal, white text; “RESET” = white/light grey, grey border, dark text.
- **Content area:** White or very light grey; clear separation from header/sidebar.
- **Tables:** Alternating row shades, light grey headers, pagination and Excel export in similar positions.
- **Forms:** Labels above or beside inputs; light grey borders on inputs; calendar icons for dates.
- **Error/alert:** Red for alerts and critical states (e.g. ALERTS(9), SLA: No, ProcessFailed).

---

## 3. Inconsistencies Identified

### 3.1 Sidebar / Navigation (High impact)

| Screen(s) | Sidebar treatment | Active state |
|-----------|-------------------|--------------|
| **Home**, **Accounting-and-cash**, **accounting-cash-private-equity** | Light grey background | Teal text + light grey highlight |
| **Document-tracker1** | **Dark grey** background, white icons/text | **Light teal** background (#E6F0F0), dark text — inverted |
| **Document-tracker2** | **Dark teal** (collapsed), white icons | N/A (icons only) |
| **Asset-details** | **Dark teal** (same as header), white icons | N/A |

So we have three patterns:

- **A:** Light grey sidebar, teal text for active (Home, Accounting & Cash).
- **B:** Dark grey sidebar, light teal block for active (Document Tracker 1).
- **C:** Dark teal sidebar, white icons (Asset Details, Document Tracker 2 collapsed).

**Recommendation:** Pick one canonical pattern (suggest **A**: light grey sidebar, teal active) and apply it to Document Tracker and Asset Details; define collapsed state explicitly (e.g. dark teal strip with icons only).

---

### 3.2 Screens Without Full Global Chrome (Medium impact)

These do not show the full ALE header + left sidebar:

- **Alternatives Data Management (1 & 2):** Header shows “Alternatives Data Management” only (no NT logo / ALE branding in same style; no visible sidebar). Unclear if intentional sub-app or missing chrome.
- **Asset-details2 (Expected Details):** Only a teal “Expected Details” bar; no global header/sidebar — likely a sub-view or modal.
- **History Audit Trail:** Modal-style form only; no header/sidebar.
- **Track Document Location:** Modal/detail view with process flow and table; “CLOSE PAGE”; no global chrome.

**Recommendation:** Decide per screen: (1) full app chrome (header + sidebar) always, or (2) defined “embedded” pattern (e.g. modal, detail panel) with consistent inner styling. Then add or remove chrome accordingly and document the pattern.

---

### 3.3 Metric / Summary Cards (Medium impact)

**capital-call-for-review.png** and **capital-call-for-review-filters.png**:

- First two cards: dark teal background, white label text.
- Remaining three: light green background, dark text.

**Recommendation:** Use one style for all five (either all dark teal + white, or all light green + dark text), or define a clear rule (e.g. “first two = primary metrics, rest = secondary”) and document in the design system.

---

### 3.4 Section Headers and Label Color (Low–medium impact)

- **Client-details:** Section headers = dark teal banners; **field labels = lighter teal** (#008080).
- Most other screens: Section headers = teal or dark grey; **labels = dark grey/black**.

**Recommendation:** Standardize: either all data labels in dark grey/black, or all in one teal shade, and use the same section-header pattern (e.g. full-width teal bar + white title) on all detail screens.

---

### 3.5 Primary Teal Shade (Low impact)

Referenced hexes across mockups: `#006C6A`, `#006F6F`, `#006F74`, `#1E6F7D`, `#004C4C`, `#006d77`, `#00796B`, `#006464`, `#1a434c`.

**Recommendation:** Choose one **primary** and one **hover/active** teal and document in design tokens; update all mockups to use those values.

---

### 3.6 Button Placement and Secondary Actions (Low impact)

- **Document Tracker (1 & 2):** SEARCH and RESET are **vertically stacked** on the right; other screens use horizontal placement. Document Tracker also has a floating person icon on the right.
- **Alternatives Data Management:** “EDIT COLUMN PREFERENCES” uses same style as “SEARCH” (teal); elsewhere primary is only SEARCH.

**Recommendation:** Standardize filter bar: primary and secondary buttons in one row (e.g. SEARCH, then RESET, then icons). Use one rule for “primary” (e.g. only SEARCH is solid teal in filter area) and apply to Alternatives Data Management.

---

## 4. Modification Plan

### Phase 1: Define design system (no pixel changes yet)

1. **Design tokens**
   - Primary teal: one hex (e.g. `#006C6A` or `#006F74`).
   - Optional secondary teal for hover/active.
   - Sidebar: background (e.g. light grey `#F0F0F0`), active background, active text (teal).
   - Buttons: primary (teal + white), secondary (white + grey border), danger (red for alerts).
   - Metric cards: one style (e.g. all teal + white or all light green + dark).

2. **Layout patterns**
   - **Full page:** Global header + sidebar (expand/collapse) + main content.
   - **Modal/dialog:** Overlay, white card, same primary/secondary button styles.
   - **Detail/sub-view:** If without full chrome, define when it’s used (e.g. “Expected Details”, “Track Document Location”) and keep inner layout consistent.

3. **Sidebar**
   - Canonical: light grey background; active = teal text + light grey (or light teal) background; collapsed = narrow strip, same teal as header, icons only. Document this and treat dark grey / dark teal sidebars as legacy.

### Phase 2: Align high-impact screens

4. **Sidebar**
   - **Document-tracker1:** Change to light grey sidebar; active “Document Tracker” = teal text + light grey/light teal highlight (match Home/Accounting).
   - **Asset-details:** Change sidebar to light grey with teal active state (or keep dark teal only if product explicitly wants “dark sidebar” variant and document it).
   - **Document-tracker2:** If collapsed state, use same teal as header and same icon set; ensure expanded state matches document-tracker1.

5. **Metric cards (Capital Call For Review)**
   - Redraw all five cards in one style (recommend: same background and text treatment; optionally different shade for “primary” vs “secondary” metrics).
   - Update **capital-call-for-review.png** and **capital-call-for-review-filters.png** (and any other Capital Call screens) to match.

### Phase 3: Chrome and layout clarity

6. **Alternatives Data Management**
   - Either add full ALE chrome (NT header + sidebar) and keep “Alternatives Data Management” as page title, or document that this flow is “standalone” and keep header but standardize teal and button styles to tokens.

7. **Asset-details2, History Audit Trail, Track Document Location**
   - Confirm in UX: modal vs full page. Then either add global header/sidebar for full-page versions or keep as modals and ensure all modals use same overlay, padding, title bar, and button styles.

### Phase 4: Polish and tokens

8. **Replace all teal instances** in mockups with the chosen primary (and optional secondary) hex.

9. **Client-details**
   - Align section headers with other detail screens; set field labels to standard (e.g. dark grey) unless design system explicitly uses teal for labels.

10. **Button layout**
    - Document Tracker: move SEARCH and RESET to horizontal layout to match other filter screens; move or remove floating person icon per product decision.

---

## 5. Checklist for “All Screens Similar”

Use this when applying the plan:

- [ ] One sidebar style (light grey + teal active) or one documented exception (e.g. dark teal collapsed).
- [ ] One primary teal in design tokens and in all mockups.
- [ ] All full-page screens show the same global header (or documented “no chrome” list).
- [ ] SEARCH/RESET and other primary/secondary buttons consistent in style and placement.
- [ ] Metric/summary cards use one style (or one clear rule for variants).
- [ ] Section headers and label colors follow one rule across detail screens.
- [ ] Modals/dialogs share same overlay, card style, and button styles.

---

## 6. File Reference (ale-mockup folder)

| File | Sidebar | Notes |
|------|--------|--------|
| home.png | Light grey | Reference for sidebar + header |
| Accounting-and-cash.png | Light grey | Reference |
| accounting-cash-private-equity.png | Light grey | Reference |
| Client-details.png | (not described) | Teal section headers + teal labels |
| document-tracker1.png | **Dark grey** | Inverted active state |
| document-tracker2.png | **Dark teal** collapsed | Icons only |
| document-tracker3.png | — | (review if needed) |
| alternative-data-management1.png | No sidebar | Different header |
| alternative-data-management2.png | No sidebar | Same |
| asset-details.png | **Dark teal** | White icons |
| asset-details2.png | No global chrome | Expected Details bar only |
| capital-call-for-review.png | — | Metric cards mixed style |
| capital-call-for-review-filters.png | — | Metric cards mixed style |
| capital-call-for-review-workitem-lock.png | — | Modal + same cards |
| history-autit-trails.png | Modal only | No chrome |
| track-document-location.png | Modal/detail | No chrome |

---

**Next step:** Implement the chosen design tokens and sidebar standard in the live app (e.g. in `ale-enterprise-poc`), then update the mockups to match so design and code stay in sync.
