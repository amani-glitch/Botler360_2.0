/* ============================================================
   botler-chat.js — vanilla JS, no dependencies
   Public API:
     window.BotlerChat.init({
       theme: 'tourisme',
       avatar: '/mascots/tourisme.png'  // optional URL, else glyph
       greeting: { title: 'Bonjour 👋', body: '...' },
       quickReplies: [{ label: '...', intent: '...' }, ...],
       teaser: 'Parlons de votre projet…',
       mode: 'floating' | 'inline',
       container: '#chat-root',           // required if inline
       onSend: (text, intent) => Promise<string>   // async bot reply
     });
   ============================================================ */
(function () {
  'use strict';

  // Default presets per theme — can be overridden by init() options.
  const PRESETS = {
    signature: {
      sector: 'Signature', glyph: 'B',
      greeting: { title: 'Bienvenue.', body: 'Quel outil digital souhaitez-vous créer ?' },
      quickReplies: [
        { label: 'Créer un chatbot', intent: 'chatbot' },
        { label: 'Site web pro',     intent: 'site' },
        { label: 'App mobile',       intent: 'app' },
        { label: 'Vidéo 360°',       intent: 'video' },
      ],
    },
    pricing: {
      sector: 'Tarifs', glyph: 'B',
      greeting: { title: 'Trouvons votre pack.', body: 'Je vous aide à choisir le pack idéal pour votre projet.' },
      quickReplies: [
        { label: 'Pack Junior',       intent: 'junior' },
        { label: 'Pack Expert',       intent: 'expert' },
        { label: 'Besoin spécifique', intent: 'custom' },
      ],
    },
    showcase: {
      sector: 'Showcase', glyph: 'B',
      greeting: { title: 'Explorez Botler.', body: 'Quel secteur vous intéresse ?' },
      quickReplies: [
        { label: 'Tourisme',     intent: 'tourisme' },
        { label: 'Restaurants',  intent: 'restaurants' },
        { label: 'Immobilier',   intent: 'immobilier' },
        { label: 'Viticulture',  intent: 'viticulture' },
      ],
    },
    tourisme: {
      sector: 'Tourisme', glyph: '✈',
      teaser: 'Parlons de votre projet de voyage ✈️',
      greeting: { title: 'Bonjour 👋', body: 'Je suis votre concierge virtuel. Quelle destination vous fait rêver ?' },
      quickReplies: [
        { label: 'Séjour sur-mesure', intent: 'sejour' },
        { label: 'Réserver un hôtel', intent: 'hotel' },
        { label: 'Activités locales', intent: 'activites' },
        { label: 'Multilingue',       intent: 'lang' },
      ],
    },
    viticulture: {
      sector: 'Vignoble', glyph: '🍇',
      teaser: "Besoin d’un conseil pour choisir votre liqueur ? 🍷",
      greeting: { title: 'Bonsoir.', body: 'Votre sommelier virtuel est à votre service.' },
      quickReplies: [
        { label: 'Accords mets-vins',   intent: 'accords' },
        { label: 'Nos cuvées',          intent: 'cuvees' },
        { label: 'Réserver une visite', intent: 'visite' },
      ],
    },
    restaurants: {
      sector: 'Restaurant', glyph: '🍽',
      teaser: 'Envie de découvrir notre spécialité du moment ? 🍽️',
      greeting: { title: 'Bienvenue.', body: 'Je vous présente notre carte et prends vos réservations.' },
      quickReplies: [
        { label: 'Voir la carte',      intent: 'carte' },
        { label: 'Réserver une table', intent: 'reserver' },
        { label: 'Options végé',       intent: 'vege' },
        { label: 'Allergènes',         intent: 'allergenes' },
      ],
    },
    boulangerie: {
      sector: 'Boulangerie', glyph: '🥖',
      teaser: 'Commandez votre pain du matin 🥖',
      greeting: { title: 'Bonjour !', body: 'Que puis-je vous cuire aujourd’hui ?' },
      quickReplies: [
        { label: 'Viennoiseries',      intent: 'vienno' },
        { label: 'Pâtisseries',        intent: 'patiss' },
        { label: 'Commande événement', intent: 'event' },
      ],
    },
    immobilier: {
      sector: 'Immobilier', glyph: '🔑',
      teaser: 'Trouvons votre prochain chez-vous 🏡',
      greeting: { title: 'Bonjour.', body: 'Achat, location, estimation — dites-moi tout.' },
      quickReplies: [
        { label: 'Acheter',          intent: 'acheter' },
        { label: 'Louer',            intent: 'louer' },
        { label: 'Estimer mon bien', intent: 'estimer' },
        { label: 'Visiter',          intent: 'visiter' },
      ],
    },
    hebergements: {
      sector: 'Hôtellerie', glyph: '🌿',
      teaser: 'Trouvons votre havre de paix 🌿',
      greeting: { title: 'Bienvenue.', body: 'Je m’occupe de votre séjour de A à Z.' },
      quickReplies: [
        { label: 'Disponibilités',   intent: 'dispo' },
        { label: 'Petit-déjeuner',   intent: 'pdj' },
        { label: 'Parking & accès',  intent: 'parking' },
      ],
    },
    'sites-web-pro': {
      sector: 'Web', glyph: 'B',
      teaser: 'Un site pro livré en 7 jours ? C’est par ici.',
      greeting: { title: 'Votre site, en 7 jours.', body: 'Quel type de site vous faut-il ?' },
      quickReplies: [
        { label: 'Vitrine',      intent: 'vitrine' },
        { label: 'E-commerce',   intent: 'ecom' },
        { label: 'Landing page', intent: 'landing' },
        { label: 'Blog',         intent: 'blog' },
      ],
    },
    contact: {
      sector: 'Devis', glyph: 'B',
      greeting: { title: 'Bonjour.', body: 'Je prends votre demande en 3 étapes courtes.' },
      quickReplies: [
        { label: 'C’est parti',  intent: 'start' },
        { label: 'Plus tard',    intent: 'later' },
      ],
      footerNote: 'Réponse garantie sous 24h',
    },
    hub: {
      sector: 'Botler', glyph: 'B',
      greeting: { title: 'Bonjour, je suis Botler.', body: 'Dites-moi ce qui vous amène, je vous oriente en quelques secondes.' },
      quickReplies: [
        { label: 'Je tiens un commerce, qu’est-ce que vous faites pour moi ?', intent: 'commerce' },
        { label: 'Montre-moi un site que vous avez fait', intent: 'showcase' },
        { label: 'Combien ça coûte et en combien de temps ?', intent: 'pricing' },
      ],
    },
  };

  const DEFAULT_REPLY = "Merci. Un conseiller vous recontacte sous peu.";

  function h(tag, attrs = {}, children = []) {
    const el = document.createElement(tag);
    for (const k in attrs) {
      if (k === 'class') el.className = attrs[k];
      else if (k === 'html') el.innerHTML = attrs[k];
      else if (k.startsWith('on') && typeof attrs[k] === 'function') {
        el.addEventListener(k.slice(2).toLowerCase(), attrs[k]);
      } else if (attrs[k] != null) el.setAttribute(k, attrs[k]);
    }
    (Array.isArray(children) ? children : [children]).forEach(c => {
      if (c == null) return;
      el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return el;
  }

  function nowHHMM() {
    const d = new Date();
    return String(d.getHours()).padStart(2,'0') + ':' + String(d.getMinutes()).padStart(2,'0');
  }

  function renderAvatar(opts) {
    if (opts.avatar) {
      const img = h('img', { src: opts.avatar, alt: '', style: 'width:100%;height:100%;object-fit:cover;' });
      return h('div', { class: 'bc-avatar', 'aria-hidden': 'true' }, img);
    }
    return h('div', { class: 'bc-avatar', 'aria-hidden': 'true' },
      h('span', { style: 'font-size:18px;line-height:1;' }, opts.glyph || 'B'));
  }

  function buildChat(opts) {
    const preset = PRESETS[opts.theme] || PRESETS.signature;
    const cfg = Object.assign({}, preset, opts, {
      greeting: Object.assign({}, preset.greeting, opts.greeting || {}),
      quickReplies: opts.quickReplies || preset.quickReplies,
    });

    const root = h('div', {
      class: 'bc', 'data-theme': opts.theme || 'signature',
      role: 'dialog', 'aria-label': `Botler ${cfg.sector || ''}`
    });

    // Header
    const header = h('header', { class: 'bc-header' }, [
      renderAvatar(cfg),
      h('div', { class: 'bc-info' }, [
        h('div', { class: 'bc-name', html: `Botler<sup>™</sup> <span class="bc-sector">${cfg.sector||''}</span>` }),
        h('div', { class: 'bc-status', html: `<span class="bc-dot"></span> En ligne · répond en < 1 min` }),
      ]),
      h('button', { class: 'bc-close', 'aria-label': 'Fermer', onclick: () => root.remove() }, '✕'),
    ]);

    // Intro
    const intro = h('div', { class: 'bc-intro' }, [
      h('h2', {}, cfg.greeting.title),
      h('p', {}, cfg.greeting.body),
    ]);

    // Messages
    const messages = h('div', { class: 'bc-messages', 'aria-live': 'polite' });

    // Quick replies
    const quick = h('div', { class: 'bc-quick' });
    function renderQuick(chips) {
      quick.innerHTML = '';
      chips.forEach(c => {
        const b = h('button', { class: 'bc-chip', onclick: () => send(c.label, c.intent) }, [
          h('span', { class: 'bc-chip-dot' }),
          document.createTextNode(c.label),
        ]);
        quick.appendChild(b);
      });
    }
    renderQuick(cfg.quickReplies);

    // Input
    const field = h('input', { class: 'bc-field', placeholder: 'Posez votre question…', 'aria-label': 'Message' });
    const sendBtn = h('button', {
      class: 'bc-send', type: 'submit',
      html: 'Envoyer <svg class="bc-send-arrow" width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h9.5M8 3.5L11.5 7 8 10.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    });
    const form = h('form', { class: 'bc-input', onsubmit: (e) => { e.preventDefault(); if (field.value.trim()) send(field.value, 'default'); } }, [field, sendBtn]);

    const footer = h('div', { class: 'bc-footer', html: cfg.footerNote || 'Propulsé par <b>Botler360</b>' });

    root.append(header, intro, messages, quick, form, footer);

    // --- messaging logic ---
    function pushBubble(role, text) {
      messages.appendChild(h('div', { class: `bc-msg bc-msg--${role}` }, text));
      messages.appendChild(h('div', { class: `bc-msg-meta${role==='user'?' bc-msg-meta--user':''}` }, nowHHMM()));
      messages.scrollTop = messages.scrollHeight;
    }
    function showTyping() {
      const t = h('div', { class: 'bc-msg bc-msg--bot bc-typing', 'aria-label': 'Botler écrit' },
        [h('span'), h('span'), h('span')]);
      messages.appendChild(t);
      messages.scrollTop = messages.scrollHeight;
      return t;
    }
    async function send(text, intent) {
      if (!text || !text.trim()) return;
      intro.style.display = 'none';
      pushBubble('user', text);
      field.value = '';
      quick.innerHTML = '';
      const typing = showTyping();
      let reply = DEFAULT_REPLY;
      try {
        if (typeof cfg.onSend === 'function') reply = await cfg.onSend(text, intent);
      } catch (_) { /* keep default */ }
      setTimeout(() => {
        typing.remove();
        pushBubble('bot', reply);
      }, 500);
    }

    return { root, send };
  }

  function mountFloating(root, teaser) {
    const wrap = h('div', {
      style: 'position:fixed;bottom:24px;right:24px;z-index:9999;'
    });
    // closed launcher
    const launcher = h('button', {
      class: 'bc-launcher', 'aria-label': 'Ouvrir le chat',
      style: 'width:60px;height:60px;border-radius:50%;border:none;cursor:pointer;background:#F5B800;color:#161a2b;font:500 22px/1 Fraunces,Georgia,serif;box-shadow:0 14px 30px -8px rgba(22,26,43,.35);'
    }, 'B');

    let teaserEl = null;
    if (teaser) {
      teaserEl = h('div', {
        style: 'position:absolute;right:72px;bottom:10px;background:#fff;border:1px solid rgba(0,0,0,.08);border-radius:14px;padding:10px 14px;font:400 12.5px/1.35 Fraunces,Georgia,serif;color:#161a2b;box-shadow:0 10px 24px -10px rgba(22,26,43,.25);max-width:260px;white-space:normal;'
      }, teaser);
      wrap.appendChild(teaserEl);
    }
    wrap.appendChild(launcher);

    let open = false;
    launcher.addEventListener('click', () => {
      open = !open;
      if (open) {
        wrap.appendChild(root);
        root.style.marginTop = '12px';
        if (teaserEl) teaserEl.style.display = 'none';
        launcher.style.display = 'none';
      }
    });
    // Custom close handling (overrides buildChat's root.remove)
    root.querySelector('.bc-close').onclick = () => {
      root.remove();
      launcher.style.display = 'grid';
      if (teaserEl) teaserEl.style.display = '';
      open = false;
    };

    document.body.appendChild(wrap);
    return wrap;
  }

  const BotlerChat = {
    init(opts = {}) {
      const { root, send } = buildChat(opts);
      if (opts.mode === 'inline') {
        const container = document.querySelector(opts.container);
        if (!container) throw new Error('BotlerChat: container not found');
        container.appendChild(root);
        return { root, send, destroy: () => root.remove() };
      }
      // floating (default)
      const wrap = mountFloating(root, opts.teaser || (PRESETS[opts.theme]||{}).teaser);
      return { root, wrap, send, destroy: () => wrap.remove() };
    },
    PRESETS,
  };

  // Auto-init from <div id="botler-chat" data-theme="…" …>
  function autoInit() {
    const el = document.getElementById('botler-chat');
    if (!el) return;
    const opts = {
      theme: el.dataset.theme,
      avatar: el.dataset.avatar,
      teaser: el.dataset.teaser,
      mode: el.dataset.mode || 'floating',
    };
    if (el.dataset.greetingTitle || el.dataset.greetingBody) {
      opts.greeting = { title: el.dataset.greetingTitle, body: el.dataset.greetingBody };
    }
    if (el.dataset.quickReplies) {
      opts.quickReplies = el.dataset.quickReplies.split('|').map(l => ({ label: l.trim(), intent: 'default' }));
    }
    BotlerChat.init(opts);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', autoInit);
  else autoInit();

  window.BotlerChat = BotlerChat;
})();
