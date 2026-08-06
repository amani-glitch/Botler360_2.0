import { useLocation } from "wouter";
import ChatWidget, { type ChatTheme } from "./ChatWidget";

type RouteConfig = {
  theme: ChatTheme;
  avatar: string;
  teaser?: string;
  greeting?: { title: string; body: string };
  quickReplies?: string[];
};

function configForPath(path: string): RouteConfig {
  // order: most specific first
  if (/^\/(demo\/)?tourisme\/?$/.test(path)) {
    return {
      theme: "tourisme",
      avatar: "/mascots/tourisme.png",
      teaser: "Parlons de votre projet de voyage ✈️",
      greeting: { title: "Bonjour 👋", body: "Je suis votre concierge virtuel. Quelle destination vous fait rêver ?" },
      quickReplies: ["✈️ Séjour sur-mesure", "🏨 Réserver un hôtel", "🗺️ Activités locales", "🌍 Multilingue"],
    };
  }
  if (/^\/(demo\/)?viticulture\/?$/.test(path)) {
    return {
      theme: "viticulture",
      avatar: "/mascots/viticulture.png",
      teaser: "Besoin d'un conseil pour choisir votre liqueur ? 🍷",
      greeting: { title: "Bonsoir.", body: "Votre sommelier virtuel est à votre service." },
      quickReplies: ["🍇 Accords mets-vins", "🍾 Nos cuvées", "📅 Réserver une visite"],
    };
  }
  if (/^\/(demo\/)?restaurants\/?$/.test(path)) {
    return {
      theme: "restaurants",
      avatar: "/mascots/restaurants.png",
      teaser: "Envie de découvrir notre spécialité du moment ? 🍽️",
      greeting: { title: "Bienvenue.", body: "Je vous présente notre carte et prends vos réservations." },
      quickReplies: ["📖 Voir la carte", "🕐 Réserver une table", "🌱 Options végé", "⚠️ Allergènes"],
    };
  }
  if (/^\/(demo\/)?boulangerie\/?$/.test(path)) {
    return {
      theme: "boulangerie",
      avatar: "/mascots/boulangerie.png",
      teaser: "Commandez votre pain du matin 🥖",
      greeting: { title: "Bonjour !", body: "Que puis-je vous cuire aujourd'hui ?" },
      quickReplies: ["🥐 Commander viennoiseries", "🎂 Pâtisseries", "🎉 Commande événement"],
    };
  }
  if (/^\/(demo\/)?immobilier\/?$/.test(path)) {
    return {
      theme: "immobilier",
      avatar: "/mascots/immobilier.png",
      teaser: "Trouvons votre prochain chez-vous 🏡",
      greeting: { title: "Bonjour.", body: "Achat, location, estimation — dites-moi tout." },
      quickReplies: ["🔑 Acheter", "🏘️ Louer", "📊 Estimer mon bien", "📅 Visiter"],
    };
  }
  if (/^\/(demo\/)?hebergements\/?$/.test(path)) {
    return {
      theme: "hebergements",
      avatar: "/mascots/hebergements.png",
      teaser: "Trouvons votre havre de paix 🌿",
      greeting: { title: "Bienvenue.", body: "Je m'occupe de votre séjour de A à Z." },
      quickReplies: ["🛏️ Disponibilités", "🌅 Petit-déjeuner", "🚗 Parking & accès"],
    };
  }
  if (/^\/(websites|applications-mobiles|demo\/(websites|sites-web-pro))\/?$/.test(path)) {
    return {
      theme: "sites-web-pro",
      avatar: "/mascots/signature.png",
      teaser: "Un site pro livré en 7 jours ? C'est par ici.",
      greeting: { title: "Votre site, en 7 jours.", body: "Quel type de site vous faut-il ?" },
      quickReplies: ["🏪 Vitrine", "🛒 E-commerce", "📄 Landing page", "📰 Blog"],
    };
  }
  if (/^\/demo\/?$/.test(path)) {
    return {
      theme: "showcase",
      avatar: "/mascots/signature.png",
      teaser: "Explorez Botler par secteur.",
      greeting: { title: "Explorez Botler en action.", body: "Quel secteur vous intéresse ?" },
      quickReplies: ["Tourisme", "Restaurants", "Immobilier", "Viticulture", "Hébergements", "Boulangerie", "Sites Web"],
    };
  }
  if (/^\/solutions\/?$/.test(path)) {
    return {
      theme: "pricing",
      avatar: "/mascots/signature.png",
      teaser: "Besoin d'aide pour choisir votre pack ?",
      greeting: { title: "Trouvons votre pack.", body: "Je vous aide à choisir le pack idéal pour votre projet." },
      quickReplies: ["Pack Junior", "Pack Expert ⭐", "Besoin spécifique"],
    };
  }
  if (/^\/contact\/?$/.test(path)) {
    return {
      theme: "contact",
      avatar: "/mascots/signature.png",
      greeting: { title: "Bonjour.", body: "Je prends votre demande en 3 étapes courtes." },
      quickReplies: ["C'est parti", "Plus tard"],
    };
  }
  // signature — homepage + fallback
  return {
    theme: "signature",
    avatar: "/mascots/signature.png",
    greeting: { title: "Bienvenue.", body: "Quel outil digital souhaitez-vous créer ?" },
    quickReplies: ["Créer un chatbot", "Site web pro", "App mobile", "Vidéo 360°"],
  };
}

export default function FloatingChat() {
  const [path] = useLocation();
  // Strip a leading /en so sector/product persona detection keeps working
  // for the i18n route scaffolding (see App.tsx) without duplicating every rule.
  const normalizedPath = path.replace(/^\/en(?=\/|$)/, "") || "/";

  // The homepage embeds its own always-open "Botler live" agent (see
  // HeroChat.tsx) — a second floating bubble on top of it would be redundant.
  if (normalizedPath === "/") return null;

  const cfg = configForPath(normalizedPath);
  // `key` forces a remount on theme change → clean destroy + reinit via ChatWidget's useEffect cleanup.
  return (
    <ChatWidget
      key={cfg.theme}
      theme={cfg.theme}
      avatar={cfg.avatar}
      teaser={cfg.teaser}
      greeting={cfg.greeting}
      quickReplies={cfg.quickReplies}
      mode="floating"
    />
  );
}
