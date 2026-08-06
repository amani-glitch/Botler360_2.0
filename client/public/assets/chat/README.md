# Botler360 · Chatwindow System — Handoff pour Claude Code

Système de 11 chatwindows contextuels pour le site Botler360, inspiration Claude (Anthropic).
Une même structure HTML, une même typo serif, des cercles colorés et un fond parchment — seuls
la couleur d'accent et la mascotte changent selon la page.

## 📦 Fichiers

```
handoff/
├── botler-chat.css         # Base + 11 thèmes via [data-theme]
├── botler-chat.js          # API vanilla (aucune dépendance)
├── botler-chat.html        # Template de référence
├── snippets/               # Copier-coller par page
│   ├── a-signature.html
│   ├── b-pricing.html
│   ├── c-showcase.html
│   ├── d-tourisme.html
│   ├── e-viticulture.html
│   ├── f-restaurants.html
│   ├── g-boulangerie.html
│   ├── h-immobilier.html
│   ├── i-hebergements.html
│   ├── j-sites-web-pro.html
│   └── k-contact.html
└── README.md
```

## 🧩 Intégration globale (à faire une fois dans le layout/base)

Dans le `<head>` :

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/chat/botler-chat.css">
```

Juste avant `</body>` :

```html
<script src="/assets/chat/botler-chat.js" defer></script>
```

## 📌 Intégration par page

Deux options — utiliser **l'une OU l'autre**.

### Option A — Auto-init via `<div>` + data-attributes (la plus simple)

Un seul `<div id="botler-chat">` par page, le script l'initialise automatiquement au chargement.

```html
<div id="botler-chat"
     data-theme="tourisme"
     data-avatar="/mascots/tourisme.png"
     data-teaser="Parlons de votre projet de voyage ✈️"
     data-greeting-title="Bonjour 👋"
     data-greeting-body="Quelle destination vous fait rêver ?"
     data-quick-replies="✈️ Séjour sur-mesure|🏨 Réserver un hôtel|🗺️ Activités|🌍 Multilingue"
     data-mode="floating"></div>
```

### Option B — API programmatique

```html
<script>
  document.addEventListener('DOMContentLoaded', () => {
    window.BotlerChat.init({
      theme: 'tourisme',
      avatar: '/mascots/tourisme.png',
      teaser: 'Parlons de votre projet de voyage ✈️',
      greeting: { title: 'Bonjour 👋', body: 'Quelle destination vous fait rêver ?' },
      quickReplies: [
        { label: 'Séjour sur-mesure', intent: 'sejour' },
        { label: 'Réserver un hôtel', intent: 'hotel' },
        { label: 'Activités locales', intent: 'activites' },
      ],
      mode: 'floating',
      onSend: async (text, intent) => {
        // Votre backend / IA
        const r = await fetch('/api/chat', { method:'POST', body: JSON.stringify({ text, intent }) });
        return (await r.json()).reply;
      }
    });
  });
</script>
```

## 🎨 Thèmes disponibles

| Clé              | Page                      | Accent             | Ambiance                          |
|------------------|---------------------------|--------------------|-----------------------------------|
| `signature`      | `/`                       | `#F5B800` doré     | Accueil universel, premium        |
| `pricing`        | `/solutions`              | `#F5B800` doré     | Pricing concierge + carte tarif   |
| `showcase`       | `/demo`                   | Gradient or        | Glassmorphism, navigation demos   |
| `tourisme`       | `/demo/tourisme`          | `#2D6B9F` bleu     | Sable + ciel, voyageur            |
| `viticulture`    | `/demo/viticulture`       | `#8B1F3D` bordeaux | **Nocturne** — fond presque noir  |
| `restaurants`    | `/demo/restaurants`       | `#C15F3C` terracotta | Gourmand, clin d'œil Claude     |
| `boulangerie`    | `/demo/boulangerie`       | `#B8722C` croûte   | Matinal, pâte levée               |
| `immobilier`     | `/demo/immobilier`        | `#34557A` bleu acier | Professionnel, confiance        |
| `hebergements`   | `/demo/hebergements`      | `#3F6B4D` forêt    | Cocooning, lin naturel            |
| `sites-web-pro`  | `/demo/sites-web-pro`     | `#3D3B6E` indigo   | Tech sobre (≠ violet vif)         |
| `contact`        | `/contact`                | `#F5B800` doré     | Form-chat hybride en 3 étapes     |

## ⚙️ API complète

```ts
BotlerChat.init({
  theme: string,              // clé de la variante (voir tableau)
  avatar?: string,            // URL mascotte (sinon glyph du preset)
  greeting?: { title, body },
  quickReplies?: [{ label, intent }],
  teaser?: string,            // bulle affichée avant ouverture (mode floating)
  mode?: 'floating' | 'inline',
  container?: string,         // requis si mode: 'inline'
  onSend?: async (text, intent) => string,  // réponse du bot
});
```

## ♿ Accessibilité

- `role="dialog"` + `aria-label` contextuel
- `aria-live="polite"` sur la zone des messages
- Tous les contrastes AA validés (incl. Viticulture sombre avec texte `#f0e6d2`)
- Pastilles colorées des quick replies TOUJOURS accompagnées du label texte
- Focus trap et Échap à ajouter si le chat est utilisé en modal bloquant

## 📱 Responsive

- **Desktop ≥ 768px** : 400 × 620 px, ancré bas-droite avec 24px de marge
- **Tablette** : à étendre via media-query (voir `botler-chat.css` — ajouter si besoin)
- **Mobile < 640px** : recommandé full-screen slide-up (à ajouter si besoin)

## 🔧 Personnalisation d'un thème

Chaque thème est un bloc `.bc[data-theme="…"]` dans `botler-chat.css`. Pour en créer un nouveau,
copier un bloc existant et modifier les tokens :

```css
.bc[data-theme="mon-theme"] {
  --accent:      #XXXXXX;   /* couleur d'accent principale */
  --accent-deep: #XXXXXX;   /* hover + prix en gras */
  --accent-ink:  #ffffff;   /* texte sur bulle user (contraste AA requis) */
  --bg:          #faf8f3;   /* fond coque */
  --bg-messages: #f3efe3;   /* fond zone messages */
}
```
