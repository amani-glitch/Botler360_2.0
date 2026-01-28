# DEVELOPMENT TASK SPECIFICATION
## Botler360 Website v2.0 - Content Realignment

**Document Version:** 1.0
**Date:** 2026-01-28
**Source Document:** Analyse_Comparative_Botler360_Site_Actuel_vs_Version_2.0.docx
**Project Path:** `C:\Users\AmaniChouk\Desktop\BOF\botler360_2.0\botler360-website-main`

---

## 1. DEVELOPER-READY TASK BACKLOG

### CRITICAL PRIORITY TASKS

---

#### T1: Restore Value Proposition on Homepage Hero

| Field | Value |
|-------|-------|
| **Task ID** | T1 |
| **Title** | Restore multi-product value proposition in Hero section |
| **Objective** | Replace chatbot-focused messaging with original multi-product positioning |
| **Impacted Files** | `client/src/contexts/LanguageContext.tsx` (translations) |
| **Route** | `/` (Home) |
| **Action** | MODIFY translation keys for hero section |

**Exact Changes Required:**

Replace these translation keys in BOTH `fr` and `en` sections:

```
CURRENT (FR):
"home.hero.title1": "Botler™ : le chatbot"
"home.hero.title2": "pour tous,"
"home.hero.title3": "simple et rapide."
"home.hero.description": "Améliorez votre relation client en déployant un chatbot sur votre site web, facilement et rapidement."

NEW (FR):
"home.hero.title1": "Des outils digitaux de pro."
"home.hero.title2": "À des prix"
"home.hero.title3": "imbattables."
"home.hero.description": "Sites web, chatbots, applications mobiles, vidéos 360°, podcasts et musiques personnalisées - créés avec l'IA, livrés en quelques jours, accessibles à tous."

CURRENT (EN):
"home.hero.title1": "Botler™: the chatbot"
"home.hero.title2": "for everyone,"
"home.hero.title3": "simple and fast."
"home.hero.description": "Improve your customer relationships by deploying a chatbot on your website, easily and quickly."

NEW (EN):
"home.hero.title1": "Professional digital tools."
"home.hero.title2": "At unbeatable"
"home.hero.title3": "prices."
"home.hero.description": "Websites, chatbots, mobile apps, 360° videos, podcasts and custom music - created with AI, delivered in days, accessible to everyone."
```

**Content Source:** Document Section "Annexe : Contenu Exact à Restaurer > Proposition de Valeur"

**Acceptance Criteria:**
- [ ] Hero H1 displays "Des outils digitaux de pro. À des prix imbattables." (FR)
- [ ] Hero description mentions all 6 products
- [ ] English translations updated accordingly
- [ ] No layout/CSS changes

---

#### T2: Add "Nos Expertises" Section with 6 Products on Homepage

| Field | Value |
|-------|-------|
| **Task ID** | T2 |
| **Title** | Create "Nos Expertises" section with 6 balanced product cards |
| **Objective** | Display all 6 products equally on homepage (not just chatbot) |
| **Impacted Files** | `client/src/pages/Home.tsx`, `client/src/contexts/LanguageContext.tsx` |
| **Route** | `/` (Home) |
| **Action** | ADD new section after Hero or Features section |

**Exact Content Required (6 Product Cards):**

| Product | Icon | Description (FR) | Price |
|---------|------|------------------|-------|
| Chatbots intelligents | MessageSquare | Des assistants virtuels pour répondre 24h/24, automatiser et booster vos conversions. | À partir de 9€/mois |
| Sites web professionnels | Globe | Sites vitrines, e-commerce, landing pages... créés avec l'IA, optimisés SEO & mobile. | 249€ tout inclus |
| Applications mobiles | Smartphone | Apps iOS & Android pour gérer votre business et fidéliser vos clients. | 249€ |
| Vidéos 360° immersives | Video | Visites virtuelles pour hôtels, restaurants, musées - une expérience immersive. | À partir de 125€ |
| Musiques & podcasts | Headphones | Identité sonore sur-mesure : musiques d'ambiance, annonces, podcasts brandés. | À partir de 5€ |
| Projets sur-mesure | Wrench | Dashboards, automatisations, outils métier : on concrétise votre idée avec l'IA. | Sur devis |

**Implementation Notes:**
- Use existing glass-card styling pattern from the codebase
- Each card should link to `/solutions` or relevant section
- Add translation keys for all content in both FR and EN

**Content Source:** Document Section "Annexe : Les 6 Produits (Section Nos expertises)"

**Acceptance Criteria:**
- [ ] New section visible on homepage
- [ ] All 6 products displayed with equal visual weight
- [ ] Each card shows: icon, title, description, price
- [ ] Responsive grid (3 columns desktop, 2 tablet, 1 mobile)
- [ ] Uses existing component styling - NO new CSS

---

#### T3: Create 6 Sector Pages (Currently 404)

| Field | Value |
|-------|-------|
| **Task ID** | T3 |
| **Title** | Create dedicated sector pages to fix 404 errors |
| **Objective** | Create 6 sector-specific landing pages |
| **Impacted Files** | `client/src/App.tsx` (routes), NEW files in `client/src/pages/sectors/` |
| **Routes** | `/tourisme`, `/viticulture`, `/restaurants`, `/boulangerie`, `/immobilier`, `/hebergements` |
| **Action** | CREATE 6 new page components + ADD routes |

**Pages to Create:**

1. `client/src/pages/sectors/Tourisme.tsx` - Route: `/tourisme`
2. `client/src/pages/sectors/Viticulture.tsx` - Route: `/viticulture`
3. `client/src/pages/sectors/Restaurants.tsx` - Route: `/restaurants`
4. `client/src/pages/sectors/Boulangerie.tsx` - Route: `/boulangerie`
5. `client/src/pages/sectors/Immobilier.tsx` - Route: `/immobilier`
6. `client/src/pages/sectors/Hebergements.tsx` - Route: `/hebergements`

**Each Page Must Include:**
- Hero section with sector name and tagline
- "Défis du secteur" section (sector challenges)
- "Nos solutions" section (how Botler360 helps)
- Statistics/results section
- Testimonial from sector
- Video embed (if available, use existing videos from `/public/videos/`)
- CTA to contact page

**Content Source:** Document Section "Pages Sectorielles manquantes" + reference existing Demo page content for sector descriptions

**Acceptance Criteria:**
- [ ] All 6 routes resolve (no more 404)
- [ ] Each page uses Navbar + Footer components
- [ ] Each page follows existing design patterns
- [ ] Routes added to App.tsx Router
- [ ] Translation keys added for all content

---

#### T4: Add "Type de projet" Field to Contact Form

| Field | Value |
|-------|-------|
| **Task ID** | T4 |
| **Title** | Add project type dropdown to contact form |
| **Objective** | Enable lead qualification by project type |
| **Impacted Files** | `client/src/pages/Contact.tsx`, `client/src/contexts/LanguageContext.tsx` |
| **Route** | `/contact` |
| **Action** | ADD new select field to form |

**Exact Field Specification:**

```tsx
// Add to formData state
projectType: ""

// New field (add between "sector" and "message" fields)
<div>
  <label className="block text-sm font-medium text-foreground mb-2">
    {t("contact.form.projectType")}
  </label>
  <select
    name="projectType"
    value={formData.projectType}
    onChange={handleChange}
    className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-foreground transition-colors"
  >
    <option value="">{t("contact.form.projectTypePlaceholder")}</option>
    <option value="chatbot">{t("contact.form.projectType.chatbot")}</option>
    <option value="website">{t("contact.form.projectType.website")}</option>
    <option value="website-chatbot">{t("contact.form.projectType.websiteChatbot")}</option>
    <option value="mobile-app">{t("contact.form.projectType.mobileApp")}</option>
    <option value="video360">{t("contact.form.projectType.video360")}</option>
    <option value="music-podcast">{t("contact.form.projectType.musicPodcast")}</option>
    <option value="custom">{t("contact.form.projectType.custom")}</option>
  </select>
</div>
```

**Translation Keys to Add:**

```
FR:
"contact.form.projectType": "Type de projet"
"contact.form.projectTypePlaceholder": "Sélectionnez un type de projet"
"contact.form.projectType.chatbot": "Chatbot"
"contact.form.projectType.website": "Site web"
"contact.form.projectType.websiteChatbot": "Site web + Chatbot"
"contact.form.projectType.mobileApp": "Application Mobile"
"contact.form.projectType.video360": "Vidéo 360°"
"contact.form.projectType.musicPodcast": "Musique / Podcast"
"contact.form.projectType.custom": "Projet sur-mesure"

EN:
"contact.form.projectType": "Project Type"
"contact.form.projectTypePlaceholder": "Select a project type"
"contact.form.projectType.chatbot": "Chatbot"
"contact.form.projectType.website": "Website"
"contact.form.projectType.websiteChatbot": "Website + Chatbot"
"contact.form.projectType.mobileApp": "Mobile Application"
"contact.form.projectType.video360": "360° Video"
"contact.form.projectType.musicPodcast": "Music / Podcast"
"contact.form.projectType.custom": "Custom Project"
```

**Content Source:** Document Section "T4 - Ajouter le champ Type de projet"

**Acceptance Criteria:**
- [ ] New dropdown visible in contact form
- [ ] All 7 project type options present
- [ ] Field included in form state
- [ ] Translations work in FR and EN
- [ ] Field uses same styling as existing selects

---

### IMPORTANT PRIORITY TASKS

---

#### T5: Create Dedicated "Sites Web" Page

| Field | Value |
|-------|-------|
| **Task ID** | T5 |
| **Title** | Create /websites page with full product information |
| **Objective** | Dedicated landing page for website product |
| **Impacted Files** | NEW `client/src/pages/Websites.tsx`, `client/src/App.tsx` |
| **Route** | `/websites` |
| **Action** | CREATE new page component |

**Required Content:**

- **Title:** "Votre site web professionnel. Clé en main. 249€ tout compris... à vie"
- **4 Arguments de vente:**
  1. Ne vous cachez plus
  2. Soyez visible
  3. Créez des opportunités
  4. Zéro effort
- **Comparison Table:** vs Wix, vs Freelance, vs Agence
- **Bonus:** "Chatbot intégré offert le premier mois"
- **CTA:** Link to /contact

**Content Source:** Document Section "Produit 2 : Sites Web Professionnels > Contenu à restaurer"

**Acceptance Criteria:**
- [ ] Page accessible at /websites
- [ ] All 4 selling arguments displayed
- [ ] Comparison table implemented
- [ ] Chatbot bonus mentioned
- [ ] Route added to App.tsx

---

#### T6: Create Dedicated "Applications Mobiles" Page

| Field | Value |
|-------|-------|
| **Task ID** | T6 |
| **Title** | Create /applications-mobiles page with full product information |
| **Objective** | Dedicated landing page for mobile app product |
| **Impacted Files** | NEW `client/src/pages/MobileApps.tsx`, `client/src/App.tsx` |
| **Route** | `/applications-mobiles` |
| **Action** | CREATE new page component |

**Required Content:**

- **Title:** "Votre application mobile, prête en 7 jours. Pour seulement 249€."
- **4 Arguments clés:**
  1. L'app la moins chère
  2. Livraison express
  3. Transparence totale
  4. Zéro risque
- **13 Fonctionnalités incluses** (list)
- **Secteurs ciblés avec témoignages**
- **FAQ:** 8 questions detailed
- **Process:** 3-step process visualization

**Content Source:** Document Section "Produit 3 : Applications Mobiles > Contenu à restaurer"

**Acceptance Criteria:**
- [ ] Page accessible at /applications-mobiles
- [ ] All 4 key arguments displayed
- [ ] 13 features listed
- [ ] FAQ section with 8 Q&As
- [ ] 3-step process shown
- [ ] Route added to App.tsx

---

#### T7: Rebalance Solutions Page

| Field | Value |
|-------|-------|
| **Task ID** | T7 |
| **Title** | Rebalance /solutions to show all products equally |
| **Objective** | Reduce chatbot dominance, present all 6 products |
| **Impacted Files** | `client/src/pages/Solutions.tsx`, `client/src/contexts/LanguageContext.tsx` |
| **Route** | `/solutions` |
| **Action** | MODIFY existing page structure |

**Changes Required:**

1. **Keep existing chatbot pricing section** (no changes to prices)
2. **Elevate "Autres Solutions" section** - move it higher, make cards larger
3. **Add "Projets sur-mesure"** to the additional services with:
   - Icon: Wrench or Settings
   - Title: "Projets sur-mesure"
   - Description: "Dashboards, automatisations, outils métier : on concrétise votre idée avec l'IA."
   - Price: "Sur devis"
4. **Add links** to dedicated pages (/websites, /applications-mobiles) when created

**Content Source:** Document Section "T7 - Rééquilibrer la Page Nos Solutions"

**Acceptance Criteria:**
- [ ] All 6 products visible on Solutions page
- [ ] "Projets sur-mesure" added to additional services
- [ ] No pricing changes
- [ ] No layout restructuring beyond content addition

---

#### T8: Add Trust Messages to Footer

| Field | Value |
|-------|-------|
| **Task ID** | T8 |
| **Title** | Add trust/confidence messages to Footer |
| **Objective** | Restore brand trust messaging |
| **Impacted Files** | `client/src/components/Footer.tsx`, `client/src/contexts/LanguageContext.tsx` |
| **Route** | All pages (Footer is global) |
| **Action** | ADD new content section to Footer |

**Messages to Add:**

```
FR:
- "Derrière nos outils IA, il y a une équipe humaine."
- "On vous accompagne à chaque étape, avec écoute, transparence et bienveillance."
- "Équipe basée en France & Royaume-Uni"
- "IA éthique et transparente"
- "Vous gardez 100% la propriété de vos outils."
- "Botler360, c'est la technologie avec le sourire."

EN:
- "Behind our AI tools, there's a human team."
- "We support you at every step, with listening, transparency and kindness."
- "Team based in France & United Kingdom"
- "Ethical and transparent AI"
- "You keep 100% ownership of your tools."
- "Botler360, it's technology with a smile."
```

**Implementation:** Add as a horizontal strip of badges/pills above the copyright line

**Content Source:** Document Section "Annexe : Messages de Confiance"

**Acceptance Criteria:**
- [ ] All 6 trust messages visible in footer
- [ ] Translations in FR and EN
- [ ] Subtle styling that fits existing footer design
- [ ] No major layout changes

---

#### T9: Add "Projets sur-mesure" to Homepage and Solutions

| Field | Value |
|-------|-------|
| **Task ID** | T9 |
| **Title** | Add custom projects product everywhere |
| **Objective** | Restore the 6th product that is completely missing |
| **Impacted Files** | `client/src/pages/Solutions.tsx`, Homepage (via T2) |
| **Route** | `/`, `/solutions` |
| **Action** | ADD product card |

**Product Details:**
- **Name:** Projets sur-mesure
- **Price:** Sur devis
- **Description:** "Dashboards, automatisations, outils métier : on concrétise votre idée avec l'IA."
- **Icon:** Wrench or Cog

**Content Source:** Document Section "Produit 6 : Projets Sur-Mesure"

**Acceptance Criteria:**
- [ ] Product visible in "Nos Expertises" section (T2)
- [ ] Product visible in Solutions page additional services
- [ ] Consistent naming and pricing across pages

---

### IMPROVEMENT PRIORITY TASKS

---

#### T10: Restore Demo Page Categories

| Field | Value |
|-------|-------|
| **Task ID** | T10 |
| **Title** | Add additional demo categories |
| **Objective** | Expand demo page beyond sector chatbots |
| **Impacted Files** | `client/src/pages/Demo.tsx`, `client/src/contexts/LanguageContext.tsx` |
| **Route** | `/demo` |
| **Action** | ADD new demo categories |

**Categories to Add:**
1. "Boutiques & Commerces" (demo category)
2. "Sites Web Professionnels" (demo category)

**Content Source:** Document Section "T10 - Restaurer les Catégories de la Page Démo"

**Acceptance Criteria:**
- [ ] Two new demo categories visible
- [ ] Each category has appropriate demo content
- [ ] Translations in FR and EN

---

#### T11: Add Optional Fields to Contact Form

| Field | Value |
|-------|-------|
| **Task ID** | T11 |
| **Title** | Add phone and file upload fields to contact form |
| **Objective** | Restore optional contact form fields |
| **Impacted Files** | `client/src/pages/Contact.tsx`, `client/src/contexts/LanguageContext.tsx` |
| **Route** | `/contact` |
| **Action** | ADD two optional fields |

**Fields to Add:**

1. **Téléphone (optional)**
   - Type: tel
   - Placeholder: "+33 6 00 00 00 00"

2. **Joindre un dossier (optional)**
   - Type: file
   - Accept: .pdf,.doc,.docx,.png,.jpg

**Content Source:** Document Section "T11 - Ajouter les champs optionnels au Formulaire"

**Acceptance Criteria:**
- [ ] Phone field added (optional)
- [ ] File upload field added (optional)
- [ ] Both clearly marked as optional
- [ ] Translations in FR and EN

---

#### T12: Add 3 Value Pillars Section to Homepage

| Field | Value |
|-------|-------|
| **Task ID** | T12 |
| **Title** | Add "3 Piliers de Valeur" section to homepage |
| **Objective** | Restore brand value pillars |
| **Impacted Files** | `client/src/pages/Home.tsx`, `client/src/contexts/LanguageContext.tsx` |
| **Route** | `/` |
| **Action** | ADD new section |

**3 Pillars Content:**

| Pillar | Icon | Description (FR) |
|--------|------|------------------|
| Rapidité | Zap | "Nos outils sont prêts en quelques jours, pas en plusieurs semaines." |
| Simplicité | Sparkles | "On rend la tech simple, même pour ceux qui n'y connaissent rien." |
| Accessibilité | Heart | "Parce que tout le monde devrait accéder aux outils digitaux, peu importe le budget." |

**Content Source:** Document Section "Annexe : Les 3 Piliers de Valeur"

**Acceptance Criteria:**
- [ ] Section visible on homepage
- [ ] 3 cards/pillars displayed
- [ ] Icons match specification
- [ ] Translations in FR and EN

---

#### T13: Add Missing Sectors to Contact Form Dropdown

| Field | Value |
|-------|-------|
| **Task ID** | T13 |
| **Title** | Ensure all sectors in contact form dropdown |
| **Objective** | Verify Immobilier and Hébergements are in dropdown |
| **Impacted Files** | `client/src/pages/Contact.tsx` |
| **Route** | `/contact` |
| **Action** | VERIFY/ADD options |

**Required Options:**
- Tourisme ✓ (exists)
- Viticulture ✓ (exists)
- Restaurants ✓ (exists)
- Boulangerie ✓ (exists)
- Immobilier ✓ (exists)
- Hébergements ✓ (exists)
- Autre ✓ (exists)

**Status:** VERIFY - these appear to already exist in the current code. Confirm and close if correct.

**Content Source:** Document Section "T13"

**Acceptance Criteria:**
- [ ] All 7 options present in sector dropdown
- [ ] No action needed if already complete

---

#### T14: Add Statistics to Demo Page

| Field | Value |
|-------|-------|
| **Task ID** | T14 |
| **Title** | Add statistics section to Demo page |
| **Objective** | Display key metrics on demo page |
| **Impacted Files** | `client/src/pages/Demo.tsx`, `client/src/contexts/LanguageContext.tsx` |
| **Route** | `/demo` |
| **Action** | ADD statistics section |

**Statistics to Display:**
- "+500 Clients satisfaits"
- "+10,000h Service client économisé"
- "92% Satisfaction client"

**Content Source:** Document Section "T14 - Restaurer les statistiques de la page Démo"

**Acceptance Criteria:**
- [ ] Stats section visible on Demo page
- [ ] All 3 statistics displayed
- [ ] Translations in FR and EN

---

## 2. PAGE-BY-PAGE IMPLEMENTATION CHECKLIST

### HOME PAGE (`/`)
**File:** `client/src/pages/Home.tsx`

| Action | Content | Status |
|--------|---------|--------|
| REPLACE | Hero H1 title (chatbot → multi-product) | T1 |
| REPLACE | Hero description (chatbot → 6 products) | T1 |
| ADD | "Nos Expertises" section with 6 product cards | T2 |
| ADD | "3 Piliers de Valeur" section | T12 |
| KEEP | Sectors section (no changes) | - |
| KEEP | Testimonials section (no changes) | - |
| KEEP | CTA section (no changes) | - |

**Design/layout remains unchanged.**

---

### SOLUTIONS PAGE (`/solutions`)
**File:** `client/src/pages/Solutions.tsx`

| Action | Content | Status |
|--------|---------|--------|
| KEEP | Chatbot pricing cards (9€, 19€, 49€) | - |
| KEEP | Website offer section (249€) | - |
| ADD | "Projets sur-mesure" to additional services | T9 |
| MODIFY | Elevate "Autres Solutions" section visibility | T7 |
| ADD | Links to /websites and /applications-mobiles | T7 |

**Design/layout remains unchanged.**

---

### CONTACT PAGE (`/contact`)
**File:** `client/src/pages/Contact.tsx`

| Action | Content | Status |
|--------|---------|--------|
| ADD | "Type de projet" dropdown field | T4 |
| ADD | "Téléphone" optional field | T11 |
| ADD | "Joindre un dossier" optional field | T11 |
| VERIFY | All sectors in dropdown | T13 |
| KEEP | Existing form structure | - |

**Design/layout remains unchanged.**

---

### DEMO PAGE (`/demo`)
**File:** `client/src/pages/Demo.tsx`

| Action | Content | Status |
|--------|---------|--------|
| ADD | "Boutiques & Commerces" demo category | T10 |
| ADD | "Sites Web Professionnels" demo category | T10 |
| ADD | Statistics section (+500 clients, etc.) | T14 |
| KEEP | Existing sector demos | - |

**Design/layout remains unchanged.**

---

### FOOTER (Global)
**File:** `client/src/components/Footer.tsx`

| Action | Content | Status |
|--------|---------|--------|
| ADD | Trust messages strip (6 messages) | T8 |
| KEEP | Existing footer content | - |

**Design/layout remains unchanged.**

---

### NEW PAGES TO CREATE

| Route | File to Create | Task |
|-------|----------------|------|
| `/tourisme` | `client/src/pages/sectors/Tourisme.tsx` | T3 |
| `/viticulture` | `client/src/pages/sectors/Viticulture.tsx` | T3 |
| `/restaurants` | `client/src/pages/sectors/Restaurants.tsx` | T3 |
| `/boulangerie` | `client/src/pages/sectors/Boulangerie.tsx` | T3 |
| `/immobilier` | `client/src/pages/sectors/Immobilier.tsx` | T3 |
| `/hebergements` | `client/src/pages/sectors/Hebergements.tsx` | T3 |
| `/websites` | `client/src/pages/Websites.tsx` | T5 |
| `/applications-mobiles` | `client/src/pages/MobileApps.tsx` | T6 |

---

## 3. CONTENT SAFETY RULES FOR CLAUDE CODE

```
╔══════════════════════════════════════════════════════════════════╗
║                    CONTENT SAFETY RULES                          ║
║                 DO NOT VIOLATE THESE RULES                       ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  ✗ DO NOT remove existing sections unless explicitly specified   ║
║  ✗ DO NOT rename products (Botler™, Pack Junior, etc.)          ║
║  ✗ DO NOT merge products together                                ║
║  ✗ DO NOT change pricing (9€, 19€, 49€, 249€, 125€, 5€)         ║
║  ✗ DO NOT modify CSS, spacing, colors, or component styling     ║
║  ✗ DO NOT change animations or transitions                       ║
║  ✗ DO NOT alter the design system or theme                       ║
║  ✗ DO NOT modify existing images or replace assets               ║
║  ✗ DO NOT change the navigation structure                        ║
║  ✗ DO NOT alter form submission logic                            ║
║                                                                  ║
║  ✓ ONLY work at content / text / translation level              ║
║  ✓ ONLY add new routes for new pages                            ║
║  ✓ ONLY add new translation keys                                 ║
║  ✓ ONLY add new sections using EXISTING component patterns      ║
║  ✓ ONLY create new page files following EXISTING patterns       ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

---

## 4. FINAL SANITY SUMMARY

### What IS Being Fixed

1. **Value Proposition** - Restoring multi-product messaging (not chatbot-only)
2. **Product Balance** - All 6 products visible and equal on homepage
3. **404 Errors** - Creating 6 missing sector pages
4. **Lead Qualification** - Adding "Type de projet" field to contact form
5. **Missing Products** - Adding "Projets sur-mesure" and dedicated product pages
6. **Trust Messaging** - Restoring human team and ethical AI messages
7. **Demo Categories** - Expanding beyond sector chatbots

### What is NOT Being Touched

1. **Design/UI** - No CSS, colors, spacing, animations
2. **Pricing** - All prices remain exactly as they are
3. **Chatbot Functionality** - Chatbot product stays, just balanced with others
4. **Existing Translations** - Only adding new keys, not modifying working ones
5. **Component Library** - Using existing UI components only
6. **Form Logic** - Only adding fields, not changing submission behavior
7. **Theme System** - Dark/light mode unchanged

### What Success Looks Like

- [ ] Homepage shows "Des outils digitaux de pro" (not "le chatbot pour tous")
- [ ] Homepage displays all 6 products equally in "Nos Expertises"
- [ ] All 6 sector routes work (no 404)
- [ ] Contact form has "Type de projet" dropdown
- [ ] Footer shows trust messages
- [ ] Solutions page shows all products, not just chatbot pricing
- [ ] New /websites and /applications-mobiles pages exist
- [ ] Site looks visually IDENTICAL but content is complete

---

## TASK EXECUTION ORDER (RECOMMENDED)

1. **T1** - Hero content (quick win, high impact)
2. **T4** - Contact form field (quick win, business critical)
3. **T8** - Footer trust messages (quick win)
4. **T2** - Nos Expertises section (medium effort, high impact)
5. **T9** - Projets sur-mesure (depends on T2)
6. **T7** - Solutions rebalancing (medium effort)
7. **T3** - Sector pages (high effort, fixes 404s)
8. **T5** - Websites page (medium effort)
9. **T6** - Mobile apps page (medium effort)
10. **T12** - Value pillars (low effort)
11. **T10** - Demo categories (low effort)
12. **T11** - Contact optional fields (low effort)
13. **T13** - Verify sectors (verification only)
14. **T14** - Demo statistics (low effort)

---

*End of Development Task Specification*
