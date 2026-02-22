# Skills : Optimisation AIO, SEO & LLM — Guide Réutilisable

> Document réutilisable pour optimiser n'importe quel site web pour les moteurs de recherche traditionnels ET les systèmes d'IA (Google AI Overviews, ChatGPT, Perplexity, Claude, Gemini).

---

## 1. Le nouveau paysage : AIO, GEO, AEO

| Discipline | Cible | Définition |
|------------|-------|------------|
| **AIO** (AI Overview Optimization) | Google AI Overviews | Être cité dans les résumés IA de Google |
| **GEO** (Generative Engine Optimization) | ChatGPT, Perplexity, Claude, Gemini | Être cité par les moteurs de réponse IA |
| **AEO** (Answer Engine Optimization) | Tous les systèmes de réponse IA | Discipline englobante |

### Statistiques clés
- AI Overviews apparaissent dans 60-85%+ des recherches Google
- 76% des citations AI Overview viennent de pages déjà dans le top 10
- 47% des citations viennent de pages classées SOUS la position 5 (qualité > autorité)
- Contenu avec schema markup = **2.5x** plus de chances d'apparaître dans les réponses IA
- FAQ schema présent = **+60%** de chances d'être featured
- Multi-modal (texte + images + vidéo + schema) = **+317%** de taux de citation

---

## 2. Checklist technique — Implémentation rapide

### 2.1 Fichier `llms.txt` (robots.txt pour les LLMs)

**Emplacement :** `https://monsite.com/llms.txt`
**Format :** Markdown UTF-8, MIME `text/plain`, < 10KB

```markdown
# Nom du Projet

> Description courte (1-2 phrases). Information clé pour comprendre le reste.

Paragraphes optionnels de contexte.

## Section Principale
- [Titre de page](https://url): Description de cette page
- [Autre page](https://url): Description

## Section Secondaire
- [Ressource](https://url): Description

## Optional
- [Ressource moins critique](https://url): Peut être ignorée
```

**Variantes :**

| Fichier | Rôle |
|---------|------|
| `/llms.txt` | Index de navigation — liens vers les pages clés |
| `/llms-full.txt` | Contenu complet du site en un seul fichier Markdown |
| `url.md` | Version Markdown propre de chaque page |

**Statut d'adoption :** Anthropic (Claude) l'endosse officiellement. Mintlify l'a déployé sur des milliers de sites. Pas encore consommé nativement par OpenAI/Google mais adoption rapide.

---

### 2.2 `robots.txt` optimisé pour l'IA

```text
# Moteurs de recherche classiques
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /404

# ── Bots IA de RECHERCHE — AUTORISER (ils vous citent) ──
User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Perplexity-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

# ── Bots IA d'ENTRAÎNEMENT — BLOQUER (scraping sans citation) ──
User-agent: GPTBot
Disallow: /

User-agent: anthropic-ai
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: Bytespider
Disallow: /

User-agent: Diffbot
Disallow: /

Sitemap: https://monsite.com/sitemap.xml
```

**Règle d'or :** Autoriser les bots de *retrieval* (qui vous citent), bloquer les bots d'*entraînement* (qui scrappent sans citer).

### Référence des user-agents IA

| Bot | Propriétaire | But | Action |
|-----|-------------|-----|--------|
| `OAI-SearchBot` | OpenAI | Résultats de recherche (cite) | AUTORISER |
| `ChatGPT-User` | OpenAI | Navigation utilisateur | AUTORISER |
| `GPTBot` | OpenAI | Entraînement modèle | BLOQUER |
| `ClaudeBot` | Anthropic | Récupération pour citation | AUTORISER |
| `anthropic-ai` | Anthropic | Entraînement bulk | BLOQUER |
| `PerplexityBot` | Perplexity | Construction d'index | AUTORISER |
| `Perplexity-User` | Perplexity | Visites déclenchées par l'humain | AUTORISER |
| `Google-Extended` | Google | Gemini/IA | AUTORISER |
| `Applebot-Extended` | Apple | Apple Intelligence | AUTORISER |
| `Bytespider` | ByteDance | Scraping entraînement | BLOQUER |
| `CCBot` | Common Crawl | Dataset entraînement | BLOQUER |
| `Diffbot` | Diffbot | Scraping entraînement | BLOQUER |

---

### 2.3 Schema.org / JSON-LD structuré

**Format :** Toujours JSON-LD (séparé du HTML, préféré par tous les moteurs IA).

#### Schémas prioritaires

| Priorité | Type Schema | Où l'utiliser | Impact |
|----------|-------------|---------------|--------|
| P0 | `Organization` | Homepage | Fondation du knowledge graph |
| P0 | `WebSite` | Homepage | Action de recherche, nom du site |
| P0 | `FAQPage` | Pages avec FAQ | +60% AI Overview |
| P1 | `SoftwareApplication` | Pages produit (SaaS) | Détails produit, prix |
| P1 | `Article` / `BlogPosting` | Blog | Auteur, dates, éditeur |
| P1 | `BreadcrumbList` | Toutes les pages | Signaux de structure |
| P2 | `HowTo` | Tutoriels | Guides étape par étape |
| P2 | `Service` | Pages de services | Détails des offres |
| P2 | `Review` / `AggregateRating` | Témoignages | Preuve sociale |
| P2 | `VideoObject` | Pages avec vidéo | +137% multimodal |
| P3 | `Person` | Pages équipe/à propos | E-E-A-T |
| P3 | `OfferCatalog` | Page tarifs | Détails des prix |

#### Template Organisation + WebSite

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://monsite.com/#organization",
      "name": "Nom Entreprise",
      "url": "https://monsite.com",
      "logo": "https://monsite.com/logo.png",
      "description": "Description de l'entreprise en 1-2 phrases",
      "sameAs": ["https://linkedin.com/company/xxx", "https://twitter.com/xxx"],
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "sales",
        "email": "contact@monsite.com",
        "availableLanguage": ["French", "English"]
      }
    },
    {
      "@type": "WebSite",
      "@id": "https://monsite.com/#website",
      "name": "Nom Entreprise",
      "url": "https://monsite.com",
      "publisher": { "@id": "https://monsite.com/#organization" },
      "inLanguage": "fr-FR"
    }
  ]
}
```

#### Template FAQPage

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Question ici ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Réponse ici."
      }
    }
  ]
}
```

#### Template SoftwareApplication (SaaS)

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Nom du Produit",
  "applicationCategory": "BusinessApplication",
  "applicationSubCategory": "Catégorie",
  "operatingSystem": "Web",
  "offers": {
    "@type": "AggregateOffer",
    "priceCurrency": "EUR",
    "lowPrice": "0",
    "offerCount": "3"
  }
}
```

#### Stratégie Entity Depth (2026)

Imbriquer les entités en profondeur plutôt qu'à plat :

```
Organization
  → founder → Person (avec credentials)
  → makesOffer → Offer
    → itemOffered → SoftwareApplication
  → review → Review
    → author → Person/Organization
```

---

### 2.4 Optimisation du contenu pour l'IA

#### Format Pyramide Inversée

```
[Réponse directe : 50-70 mots]          ← Extrait pour les snippets IA
[Réponse étendue : 134-167 mots]        ← Utilisé pour les passages AI Overview
[Contenu détaillé complet]              ← Profondeur pour l'autorité topique
[Section FAQ en bas]                     ← Ciblage de questions additionnelles
```

#### Checklist contenu par page

- [ ] Réponse directe dans le premier paragraphe (50-70 mots)
- [ ] Explication étendue (134-167 mots) avec données/stats spécifiques
- [ ] Structure H2/H3 formulés en questions quand possible
- [ ] Listes à puces et listes numérotées pour le scan
- [ ] Données originales, citations, ou statistiques avec attribution
- [ ] Images, diagrammes, ou vidéos avec alt text et schema
- [ ] Section FAQ en bas avec FAQPage schema
- [ ] Byline auteur avec credentials et photo
- [ ] Date de publication + date de mise à jour affichées
- [ ] Liens internes vers le contenu pilier/cluster lié

#### Signaux E-E-A-T qui comptent

| Signal | Priorité | Implémentation |
|--------|----------|----------------|
| Bylines auteur avec credentials | Immédiat | Tous les articles et guides |
| Recherche/données originales | 1-3 mois | Données propriétaires, benchmarks |
| Citations d'experts avec attribution | Immédiat | Dans le contenu |
| Dates de publication/mise à jour | Immédiat | Affichées sur chaque page |
| Mentions cross-platform | 3-6 mois | PR, guest posts, publications |
| Avis clients/témoignages | Continu | Collecter et afficher avec schema |

---

### 2.5 HTML sémantique

Les crawlers IA parsent la structure HTML. Utiliser les bonnes balises :

```html
<main>
  <article>
    <header>
      <h1>Titre principal</h1>
      <time datetime="2025-01-15">15 janvier 2025</time>
    </header>
    <section>
      <h2>Sous-titre en question ?</h2>
      <p>Contenu...</p>
    </section>
    <section>
      <h2>Autre sous-titre ?</h2>
      <p>Contenu...</p>
    </section>
  </article>
  <aside>
    <!-- Contenu connexe -->
  </aside>
</main>
<nav><!-- Navigation --></nav>
<footer><!-- Pied de page --></footer>
```

---

### 2.6 Optimisation par plateforme

#### Google AI Overviews
- SEO traditionnel reste la fondation (76% des citations du top 10)
- FAQ schema = levier principal (+60%)
- Multi-modal (texte + images + vidéo + schema) = +317%
- Cibler les requêtes en question en français

#### Perplexity
- Fraîcheur primordiale — toujours afficher "dernière mise à jour"
- Profondeur > largeur — contenu complet et original
- Signaux d'autorité externes (backlinks, mentions PR)
- Soumettre le sitemap à Bing (Perplexity utilise Bing)
- Pages rapides (< 3 secondes)

#### ChatGPT
- Soumettre le sitemap à Bing (ChatGPT utilise l'index Bing)
- Autorité multi-source : présence cohérente sur plusieurs plateformes
- Format "réponse d'abord"
- Schema markup (FAQ, HowTo, ItemList)
- Autoriser `OAI-SearchBot` et `ChatGPT-User`

#### Claude
- Support `llms.txt` (Anthropic l'endosse)
- Autoriser `ClaudeBot`
- Contenu propre avec titres clairs
- Contenu autoritaire et factuel avec citations

---

## 3. Problème critique : SPA et crawlabilité IA

**La plupart des crawlers IA N'EXÉCUTENT PAS JavaScript.** Un SPA React avec `<div id="root"></div>` = page vide pour les bots.

### Solutions (par ordre de préférence)

1. **SSR/SSG** (Next.js, Astro, Vite SSR) — rendu serveur complet
2. **Service de pre-rendering** (prerender.io, Rendertron) — HTML statique pour les bots
3. **Rendu dynamique** — détecter les user-agents bots et servir du HTML pré-rendu
4. **Snapshots HTML statiques** pour les pages d'atterrissage clés

### Quick fix avec Express (sans migration SSR)

```typescript
// Middleware de pre-rendering pour bots
const BOT_AGENTS = /googlebot|bingbot|oai-searchbot|chatgpt-user|perplexitybot|claudebot/i;

app.use((req, res, next) => {
  if (BOT_AGENTS.test(req.headers['user-agent'] || '')) {
    // Servir une version pré-rendue
    return res.sendFile(`/prerendered${req.path}.html`);
  }
  next();
});
```

---

## 4. Roadmap d'implémentation

### Phase 1 — Quick Wins (Semaine 1-2)
- [ ] Créer et déployer `/llms.txt`
- [ ] Mettre à jour `robots.txt` avec les règles crawlers IA
- [ ] Ajouter Organization + WebSite JSON-LD schema à la homepage
- [ ] Ajouter FAQPage schema à toutes les pages avec FAQ
- [ ] Soumettre le sitemap à Bing Webmaster Tools
- [ ] Ajouter les dates de publication/mise à jour

### Phase 2 — Fondation (Semaine 3-4)
- [ ] Implémenter SoftwareApplication schema sur les pages produit
- [ ] Ajouter Article/BlogPosting schema sur le blog
- [ ] Ajouter BreadcrumbList schema sur tout le site
- [ ] HTML sémantique (`<article>`, `<section>`, `<main>`)
- [ ] SSR ou pre-rendering pour les pages clés
- [ ] Créer des sections FAQ sur toutes les landing pages

### Phase 3 — Optimisation contenu (Mois 2)
- [ ] Restructurer le contenu existant en pyramide inversée
- [ ] Créer l'architecture pilier + cluster
- [ ] Ajouter des H2 en question sur tout le contenu
- [ ] Inclure des résumés 50-70 mots en haut de chaque page
- [ ] Ajouter des bios auteur avec credentials
- [ ] HowTo schema sur les tutoriels

### Phase 4 — Avancé (Mois 3+)
- [ ] Créer `/llms-full.txt` avec le contenu complet
- [ ] Implémenter Entity Depth dans le schema
- [ ] VideoObject schema pour le contenu vidéo
- [ ] Autorité cross-platform (PR, guest posts, annuaires)
- [ ] Monitoring des citations IA (mentions de marque dans les réponses IA)
- [ ] Versions `.md` des pages clés

---

## 5. Métriques de suivi

| Métrique | Outil | Fréquence |
|----------|-------|-----------|
| Apparitions dans AI Overviews | Google Search Console | Hebdomadaire |
| Citations dans ChatGPT/Perplexity | Monitoring manuel ou outil tiers | Mensuel |
| Position moyenne sur les requêtes question | Google Search Console | Hebdomadaire |
| Trafic organique depuis les AI Overviews | GA4 + GSC | Hebdomadaire |
| Rich snippets actifs | Google Search Console | Mensuel |
| Validation schema | schema.org/validator | À chaque changement |

---

## Sources

- [ResultFirst — AIO Optimization Best Practices 2026](https://www.resultfirst.com/blog/ai-seo/aio-optimization-best-practices/)
- [llmstxt.org — Spécification officielle](https://llmstxt.org/)
- [Semrush — What Is LLMs.txt?](https://www.semrush.com/blog/llms-txt/)
- [Stackmatix — Structured Data for AI Search 2026](https://www.stackmatix.com/blog/structured-data-ai-search)
- [ClickRank — Technical SEO for AI Crawlers 2026](https://www.clickrank.ai/technical-seo-for-ai-crawlers/)
- [Wellows — Google AI Overviews Ranking Factors 2026](https://wellows.com/blog/google-ai-overviews-ranking-factors/)
- [Digital Authority — GEO Best Practices 2026](https://www.digitalauthority.me/resources/generative-engine-optimization-best-practices/)
- [Search Engine Journal — AI Crawler User Agents List](https://www.searchenginejournal.com/ai-crawler-user-agents-list/558130/)
