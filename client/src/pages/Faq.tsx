/*
 * Design: Botler360 - FAQ Page
 * - Supports both light and dark modes
 * - Accordion-style FAQ sections
 * - Two categories: Chatbots and Websites
 * - Glass morphism styling
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, MessageSquare, Globe, HelpCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { useLanguage } from "@/contexts/LanguageContext";
import { useChat } from "@/contexts/ChatContext";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

type FaqCategory = "chatbots" | "websites";

interface FaqItem {
  question: string;
  answer: string;
}

// FAQ data for Chatbots (French)
const faqChatbotsFr: FaqItem[] = [
  {
    question: "Qu'est-ce qu'un chatbot Botler™ ?",
    answer: "Un chatbot Botler™ est un assistant virtuel intelligent qui répond automatiquement aux questions de vos visiteurs 24h/24 et 7j/7. Il est personnalisé selon votre activité et peut gérer les réservations, présenter vos produits, qualifier vos prospects et bien plus encore."
  },
  {
    question: "Comment fonctionne l'installation du chatbot ?",
    answer: "L'installation est très simple et ne prend que 5 minutes. Vous recevez un petit code (snippet) à copier-coller sur votre site web. Notre équipe peut également s'en charger pour vous gratuitement si vous le souhaitez."
  },
  {
    question: "Le chatbot peut-il répondre en plusieurs langues ?",
    answer: "Oui ! Nos chatbots sont multilingues et peuvent répondre automatiquement dans la langue de votre visiteur. C'est particulièrement utile pour les secteurs comme le tourisme ou l'hôtellerie."
  },
  {
    question: "Puis-je personnaliser les réponses du chatbot ?",
    answer: "Absolument. Lors de la configuration, nous adaptons toutes les réponses à votre activité, vos produits, vos tarifs et votre ton de communication. Vous pouvez également modifier les réponses à tout moment."
  },
  {
    question: "Le chatbot peut-il prendre des réservations ?",
    answer: "Oui, selon votre pack, le chatbot peut gérer les demandes de réservation, les transmettre par email ou les intégrer directement à votre système de réservation existant."
  },
  {
    question: "Quelle est la différence entre les packs Junior, Expert et Expert PME ?",
    answer: "Le pack Junior (9€/mois) offre les fonctionnalités de base. Le pack Expert (29€/mois) ajoute le matching intelligent, l'assistant commercial et la qualification de prospects. Le pack Expert PME (59€/mois) est optimisé pour les volumes importants et offre des fonctionnalités avancées."
  },
  {
    question: "Y a-t-il une période d'essai gratuite ?",
    answer: "Oui, nous offrons 30 jours d'essai gratuit pour tous nos packs. Vous pouvez tester le chatbot sans engagement et sans carte bancaire requise."
  },
  {
    question: "Le chatbot fonctionne-t-il sur mobile ?",
    answer: "Oui, nos chatbots sont 100% responsive et fonctionnent parfaitement sur tous les appareils : ordinateurs, tablettes et smartphones."
  },
  {
    question: "Puis-je voir les conversations de mes visiteurs ?",
    answer: "Oui, vous avez accès à un tableau de bord où vous pouvez consulter toutes les conversations, analyser les questions fréquentes et suivre les performances de votre chatbot."
  },
  {
    question: "Le chatbot peut-il m'envoyer des alertes ?",
    answer: "Oui, avec les packs Expert et Expert PME, vous recevez des alertes par email pour les demandes importantes, les nouveaux prospects qualifiés ou les demandes de rappel."
  },
  {
    question: "Mon site est sur WordPress/Shopify/Wix, est-ce compatible ?",
    answer: "Oui ! Nos chatbots sont compatibles avec toutes les plateformes : WordPress, Shopify, Wix, Squarespace, PrestaShop, et tout site web en général."
  },
  {
    question: "Le chatbot ralentit-il mon site ?",
    answer: "Non, notre chatbot est optimisé pour ne pas impacter les performances de votre site. Le chargement est asynchrone et n'affecte pas le temps de chargement de vos pages."
  },
  {
    question: "Puis-je changer de pack en cours de route ?",
    answer: "Oui, vous pouvez upgrader ou downgrader votre pack à tout moment. Le changement est effectif immédiatement et le tarif est ajusté au prorata."
  },
  {
    question: "Comment le chatbot est-il personnalisé à mon secteur ?",
    answer: "Nous avons développé des modèles spécialisés pour chaque secteur (tourisme, viticulture, restaurants, boulangerie, immobilier, hébergements). Le chatbot comprend le vocabulaire et les problématiques spécifiques à votre métier."
  },
  {
    question: "Que se passe-t-il si le chatbot ne sait pas répondre ?",
    answer: "Si le chatbot ne peut pas répondre à une question, il propose à l'utilisateur de laisser ses coordonnées pour être recontacté, ou le redirige vers vos coordonnées de contact."
  },
  {
    question: "Les données de mes clients sont-elles sécurisées ?",
    answer: "Oui, toutes les données sont hébergées en Europe et nous respectons strictement le RGPD. Vos données et celles de vos clients sont chiffrées et sécurisées."
  },
  {
    question: "Puis-je intégrer le chatbot à mon CRM ?",
    answer: "Oui, pour les packs Expert et Expert PME, nous proposons des intégrations avec les principaux CRM. Contactez-nous pour discuter de vos besoins spécifiques."
  },
  {
    question: "Le chatbot peut-il vendre mes produits ?",
    answer: "Oui, le chatbot peut présenter vos produits, répondre aux questions des clients et les guider vers l'achat. Avec le pack Expert, une commission de 1% s'applique sur les ventes réalisées entièrement via le chatbot."
  },
  {
    question: "Comment puis-je annuler mon abonnement ?",
    answer: "Vous pouvez annuler votre abonnement à tout moment depuis votre espace client ou en contactant notre équipe. L'annulation prend effet à la fin de votre période de facturation en cours."
  },
  {
    question: "Proposez-vous un support technique ?",
    answer: "Oui, notre équipe support est disponible du lundi au vendredi de 9h à 18h. Nous répondons généralement sous 24h par email et sommes également joignables par téléphone."
  },
  {
    question: "Le chatbot peut-il gérer les avis clients ?",
    answer: "Le chatbot peut encourager les clients satisfaits à laisser un avis et rediriger les clients mécontents vers votre service client pour résoudre leurs problèmes en privé."
  },
  {
    question: "Puis-je avoir plusieurs chatbots pour différents sites ?",
    answer: "Oui, vous pouvez créer autant de chatbots que nécessaire. Chaque chatbot est facturé séparément selon le pack choisi."
  },
  {
    question: "Le chatbot comprend-il les fautes d'orthographe ?",
    answer: "Oui, notre technologie d'intelligence artificielle comprend les variations d'orthographe, les abréviations et le langage naturel de vos visiteurs."
  },
  {
    question: "Puis-je personnaliser l'apparence du chatbot ?",
    answer: "Absolument ! Vous pouvez personnaliser les couleurs, le logo, l'avatar et le style du chatbot pour qu'il s'intègre parfaitement à votre charte graphique."
  },
  {
    question: "Le chatbot peut-il envoyer des documents ?",
    answer: "Oui, le chatbot peut partager des documents PDF, des liens, des images ou des vidéos avec vos visiteurs pour enrichir leurs réponses."
  },
  {
    question: "Quelle est la disponibilité du chatbot ?",
    answer: "Nos chatbots sont disponibles 24h/24 et 7j/7 avec une disponibilité garantie de 99,9%. Vos visiteurs obtiennent toujours une réponse instantanée."
  },
  {
    question: "Puis-je tester le chatbot avant de m'engager ?",
    answer: "Oui ! Vous pouvez tester nos chatbots en direct sur notre page de démonstrations, et bénéficier de 30 jours d'essai gratuit une fois inscrit."
  },
  {
    question: "Comment contacter l'équipe Botler360 ?",
    answer: "Vous pouvez nous contacter par téléphone au 01 86 26 03 90, par email à contact@botler360.com, ou via le formulaire de contact sur notre site."
  },
  {
    question: "Le chatbot fonctionne-t-il sur les réseaux sociaux ?",
    answer: "Actuellement, nos chatbots sont conçus pour les sites web. L'intégration avec les réseaux sociaux (Facebook Messenger, Instagram, WhatsApp) est en cours de développement."
  },
  {
    question: "Quelle est la politique de remboursement ?",
    answer: "Si vous n'êtes pas satisfait pendant les 30 premiers jours, nous vous remboursons intégralement. Aucune question posée, c'est notre garantie satisfaction."
  },
];

// FAQ data for Websites (French)
const faqWebsitesFr: FaqItem[] = [
  {
    question: "Combien coûte un site web Botler360 ?",
    answer: "Nos sites web professionnels sont proposés à 249€, paiement unique. Ce prix inclut la création, l'hébergement, le certificat SSL, l'optimisation SEO de base et un chatbot gratuit pendant 1 mois."
  },
  {
    question: "En combien de temps mon site sera-t-il livré ?",
    answer: "Nous livrons votre site web en 24 à 48 heures après validation de votre brief. C'est l'un des délais les plus courts du marché !"
  },
  {
    question: "Dois-je avoir des connaissances techniques ?",
    answer: "Absolument pas ! Nous nous occupons de tout : design, développement, mise en ligne, hébergement. Vous n'avez qu'à nous fournir vos textes et images."
  },
  {
    question: "Le site est-il optimisé pour le référencement (SEO) ?",
    answer: "Oui, tous nos sites incluent une optimisation SEO de base : balises meta, structure HTML optimisée, vitesse de chargement, responsive design, et certificat SSL."
  },
  {
    question: "Mon site sera-t-il compatible mobile ?",
    answer: "Oui, tous nos sites sont 100% responsive et s'adaptent parfaitement à tous les écrans : ordinateurs, tablettes et smartphones."
  },
  {
    question: "L'hébergement est-il inclus ?",
    answer: "Oui, l'hébergement web sécurisé est inclus dans le prix. Nous hébergeons votre site sur des serveurs performants et sécurisés en Europe."
  },
  {
    question: "Y a-t-il des frais mensuels ou annuels ?",
    answer: "Le prix de 249€ est un paiement unique pour la création. L'hébergement est inclus la première année. Ensuite, un forfait optionnel de maintenance peut être proposé."
  },
  {
    question: "Puis-je modifier mon site après la livraison ?",
    answer: "Oui, vous pouvez demander des modifications. Les modifications mineures sont incluses pendant 30 jours. Pour des changements plus importants, nous proposons des forfaits adaptés."
  },
  {
    question: "Suis-je propriétaire de mon site ?",
    answer: "Oui, vous êtes 100% propriétaire de votre site web. Vous pouvez à tout moment demander le transfert vers un autre hébergeur si vous le souhaitez."
  },
  {
    question: "Quels types de sites proposez-vous ?",
    answer: "Nous créons principalement des sites vitrines professionnels, des landing pages et des sites de présentation. Pour les boutiques e-commerce, nous avons des offres spécifiques."
  },
  {
    question: "Comment se déroule la création de mon site ?",
    answer: "1) Vous remplissez un brief en ligne. 2) Notre équipe crée votre site avec l'IA. 3) Vous validez ou demandez des ajustements. 4) Votre site est mis en ligne !"
  },
  {
    question: "Puis-je avoir un nom de domaine personnalisé ?",
    answer: "Oui, vous pouvez utiliser votre propre nom de domaine. Si vous n'en avez pas, nous pouvons vous aider à en choisir et enregistrer un."
  },
  {
    question: "Le certificat SSL (HTTPS) est-il inclus ?",
    answer: "Oui, le certificat SSL est inclus et installé automatiquement. Votre site sera sécurisé en HTTPS, ce qui est essentiel pour le SEO et la confiance des visiteurs."
  },
  {
    question: "Proposez-vous un support après la livraison ?",
    answer: "Oui, vous bénéficiez de 30 jours de support technique inclus. Nous restons disponibles pour répondre à vos questions et vous accompagner."
  },
  {
    question: "Mon site aura-t-il un formulaire de contact ?",
    answer: "Oui, tous nos sites incluent un formulaire de contact fonctionnel qui vous envoie les messages directement par email."
  },
  {
    question: "Puis-je avoir des statistiques de visites ?",
    answer: "Oui, nous pouvons intégrer Google Analytics ou un outil similaire pour que vous puissiez suivre le nombre de visiteurs et leur comportement sur votre site."
  },
  {
    question: "Comment les paiements sont-ils sécurisés ?",
    answer: "Les paiements sont traités via des plateformes sécurisées (Stripe, PayPal). Vos informations bancaires ne sont jamais stockées chez nous."
  },
  {
    question: "Puis-je voir des exemples de sites créés ?",
    answer: "Oui, contactez-nous et nous vous montrerons des exemples de sites réalisés pour des clients dans votre secteur d'activité."
  },
  {
    question: "Le chatbot est-il vraiment offert ?",
    answer: "Oui ! Chaque site web inclut un chatbot Botler™ gratuit pendant 30 jours. Après cette période, vous pouvez choisir de continuer avec un abonnement ou non."
  },
  {
    question: "Que se passe-t-il si je ne suis pas satisfait ?",
    answer: "Nous offrons des révisions illimitées pendant la phase de création pour garantir votre satisfaction. Si malgré tout vous n'êtes pas satisfait, nous vous remboursons."
  },
];

// FAQ data for Chatbots (English)
const faqChatbotsEn: FaqItem[] = [
  {
    question: "What is a Botler™ chatbot?",
    answer: "A Botler™ chatbot is an intelligent virtual assistant that automatically answers your visitors' questions 24/7. It's customized to your business and can manage bookings, present your products, qualify leads, and much more."
  },
  {
    question: "How does chatbot installation work?",
    answer: "Installation is very simple and takes only 5 minutes. You receive a small code snippet to copy-paste on your website. Our team can also do it for you for free if you prefer."
  },
  {
    question: "Can the chatbot respond in multiple languages?",
    answer: "Yes! Our chatbots are multilingual and can automatically respond in your visitor's language. This is particularly useful for sectors like tourism or hospitality."
  },
  {
    question: "Can I customize the chatbot's responses?",
    answer: "Absolutely. During setup, we adapt all responses to your business, products, pricing, and communication style. You can also modify responses at any time."
  },
  {
    question: "Can the chatbot take bookings?",
    answer: "Yes, depending on your plan, the chatbot can handle booking requests, forward them by email, or integrate directly with your existing booking system."
  },
  {
    question: "What's the difference between Junior, Expert, and Expert SME plans?",
    answer: "The Junior plan (€9/month) offers basic features. The Expert plan (€29/month) adds smart matching, sales assistant, and lead qualification. The Expert SME plan (€59/month) is optimized for high volumes with advanced features."
  },
  {
    question: "Is there a free trial period?",
    answer: "Yes, we offer a 30-day free trial for all our plans. You can test the chatbot without commitment and without a credit card required."
  },
  {
    question: "Does the chatbot work on mobile?",
    answer: "Yes, our chatbots are 100% responsive and work perfectly on all devices: computers, tablets, and smartphones."
  },
  {
    question: "Can I see my visitors' conversations?",
    answer: "Yes, you have access to a dashboard where you can view all conversations, analyze frequently asked questions, and track your chatbot's performance."
  },
  {
    question: "Can the chatbot send me alerts?",
    answer: "Yes, with Expert and Expert SME plans, you receive email alerts for important requests, new qualified leads, or callback requests."
  },
  {
    question: "My site is on WordPress/Shopify/Wix, is it compatible?",
    answer: "Yes! Our chatbots are compatible with all platforms: WordPress, Shopify, Wix, Squarespace, PrestaShop, and any website in general."
  },
  {
    question: "Does the chatbot slow down my site?",
    answer: "No, our chatbot is optimized not to impact your site's performance. Loading is asynchronous and doesn't affect your page load times."
  },
  {
    question: "Can I change plans along the way?",
    answer: "Yes, you can upgrade or downgrade your plan at any time. The change is effective immediately and the rate is adjusted pro-rata."
  },
  {
    question: "How is the chatbot customized for my sector?",
    answer: "We've developed specialized models for each sector (tourism, viticulture, restaurants, bakery, real estate, accommodation). The chatbot understands the vocabulary and specific issues of your profession."
  },
  {
    question: "What happens if the chatbot can't answer?",
    answer: "If the chatbot can't answer a question, it offers the user to leave their contact details to be called back, or redirects them to your contact information."
  },
  {
    question: "Is my customers' data secure?",
    answer: "Yes, all data is hosted in Europe and we strictly comply with GDPR. Your data and your customers' data are encrypted and secure."
  },
  {
    question: "Can I integrate the chatbot with my CRM?",
    answer: "Yes, for Expert and Expert SME plans, we offer integrations with major CRMs. Contact us to discuss your specific needs."
  },
  {
    question: "Can the chatbot sell my products?",
    answer: "Yes, the chatbot can present your products, answer customer questions, and guide them to purchase. With the Expert plan, a 1% commission applies on sales made entirely through the chatbot."
  },
  {
    question: "How can I cancel my subscription?",
    answer: "You can cancel your subscription at any time from your account or by contacting our team. Cancellation takes effect at the end of your current billing period."
  },
  {
    question: "Do you offer technical support?",
    answer: "Yes, our support team is available Monday to Friday from 9am to 6pm. We typically respond within 24 hours by email and are also reachable by phone."
  },
];

// FAQ data for Websites (English)
const faqWebsitesEn: FaqItem[] = [
  {
    question: "How much does a Botler360 website cost?",
    answer: "Our professional websites are priced at €249, one-time payment. This price includes creation, hosting, SSL certificate, basic SEO optimization, and a free chatbot for 1 month."
  },
  {
    question: "How quickly will my site be delivered?",
    answer: "We deliver your website in 24 to 48 hours after your brief is validated. It's one of the shortest delivery times on the market!"
  },
  {
    question: "Do I need technical knowledge?",
    answer: "Absolutely not! We take care of everything: design, development, publishing, hosting. You just need to provide your texts and images."
  },
  {
    question: "Is the site optimized for SEO?",
    answer: "Yes, all our sites include basic SEO optimization: meta tags, optimized HTML structure, loading speed, responsive design, and SSL certificate."
  },
  {
    question: "Will my site be mobile-compatible?",
    answer: "Yes, all our sites are 100% responsive and adapt perfectly to all screens: computers, tablets, and smartphones."
  },
  {
    question: "Is hosting included?",
    answer: "Yes, secure web hosting is included in the price. We host your site on high-performance, secure servers in Europe."
  },
  {
    question: "Are there monthly or annual fees?",
    answer: "The €249 price is a one-time payment for creation. Hosting is included for the first year. After that, an optional maintenance package may be offered."
  },
  {
    question: "Can I modify my site after delivery?",
    answer: "Yes, you can request modifications. Minor modifications are included for 30 days. For more significant changes, we offer adapted packages."
  },
  {
    question: "Do I own my website?",
    answer: "Yes, you are 100% owner of your website. You can request a transfer to another host at any time if you wish."
  },
  {
    question: "What types of sites do you offer?",
    answer: "We primarily create professional showcase websites, landing pages, and presentation sites. For e-commerce stores, we have specific offers."
  },
  {
    question: "How does the website creation process work?",
    answer: "1) You fill out an online brief. 2) Our team creates your site with AI. 3) You validate or request adjustments. 4) Your site goes live!"
  },
  {
    question: "Can I have a custom domain name?",
    answer: "Yes, you can use your own domain name. If you don't have one, we can help you choose and register one."
  },
  {
    question: "Is the SSL certificate (HTTPS) included?",
    answer: "Yes, the SSL certificate is included and installed automatically. Your site will be secured with HTTPS, which is essential for SEO and visitor trust."
  },
  {
    question: "Do you offer support after delivery?",
    answer: "Yes, you benefit from 30 days of included technical support. We remain available to answer your questions and assist you."
  },
  {
    question: "Will my site have a contact form?",
    answer: "Yes, all our sites include a functional contact form that sends messages directly to your email."
  },
  {
    question: "Can I have visitor statistics?",
    answer: "Yes, we can integrate Google Analytics or a similar tool so you can track the number of visitors and their behavior on your site."
  },
  {
    question: "How are payments secured?",
    answer: "Payments are processed through secure platforms (Stripe, PayPal). Your banking information is never stored with us."
  },
  {
    question: "Can I see examples of created sites?",
    answer: "Yes, contact us and we'll show you examples of sites created for clients in your industry."
  },
  {
    question: "Is the chatbot really free?",
    answer: "Yes! Each website includes a free Botler™ chatbot for 30 days. After that period, you can choose to continue with a subscription or not."
  },
  {
    question: "What happens if I'm not satisfied?",
    answer: "We offer unlimited revisions during the creation phase to guarantee your satisfaction. If you're still not satisfied, we'll refund you."
  },
];

interface AccordionItemProps {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
  accentColor: string;
}

function AccordionItem({ item, isOpen, onToggle, accentColor }: AccordionItemProps) {
  return (
    <motion.div
      variants={fadeInUp}
      className="glass-card rounded-xl overflow-hidden"
    >
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
      >
        <span className="font-medium text-foreground pr-4">{item.question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className={`flex-shrink-0 ${accentColor}`}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-6 pb-4 text-muted-foreground">
              {item.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Faq() {
  const { t, language } = useLanguage();
  const { openChat } = useChat();
  const [activeCategory, setActiveCategory] = useState<FaqCategory>("chatbots");
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  // Get FAQ data based on language
  const faqChatbots = language === "fr" ? faqChatbotsFr : faqChatbotsEn;
  const faqWebsites = language === "fr" ? faqWebsitesFr : faqWebsitesEn;
  const currentFaq = activeCategory === "chatbots" ? faqChatbots : faqWebsites;

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  // Reset open items when category changes
  const handleCategoryChange = (category: FaqCategory) => {
    setActiveCategory(category);
    setOpenItems(new Set());
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={t("seo.faq.title")}
        description={t("seo.faq.description")}
        canonical="/faq"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [...faqChatbotsFr, ...faqWebsitesFr].map((item) => ({
            "@type": "Question",
            "name": item.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": item.answer,
            },
          })),
        }}
      />
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent dark:from-amber-500/10" />
        <div className="absolute inset-0 bg-grid-pattern opacity-30 dark:opacity-20" />

        <div className="relative container mx-auto px-4">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="mb-6">
              <HelpCircle className="w-16 h-16 text-amber-500 mx-auto" />
            </motion.div>
            <motion.h1
              variants={fadeInUp}
              className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6"
            >
              {t("faq.title1")} <span className="text-gradient-gold">{t("faq.highlight")}</span>
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-muted-foreground"
            >
              {t("faq.description")}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Category Selector */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex justify-center gap-4"
          >
            <motion.button
              variants={fadeInUp}
              onClick={() => handleCategoryChange("chatbots")}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                activeCategory === "chatbots"
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900"
                  : "glass-card text-foreground/80 hover:text-amber-500"
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              {t("faq.categoryChatbots")}
            </motion.button>
            <motion.button
              variants={fadeInUp}
              onClick={() => handleCategoryChange("websites")}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                activeCategory === "websites"
                  ? "bg-gradient-to-r from-teal-500 to-teal-600 text-slate-900"
                  : "glass-card text-foreground/80 hover:text-teal-500"
              }`}
            >
              <Globe className="w-5 h-5" />
              {t("faq.categoryWebsites")}
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* FAQ List */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            key={activeCategory}
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="space-y-4"
          >
            {currentFaq.map((item, index) => (
              <AccordionItem
                key={index}
                item={item}
                isOpen={openItems.has(index)}
                onToggle={() => toggleItem(index)}
                accentColor={activeCategory === "chatbots" ? "text-amber-500" : "text-teal-500"}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="glass-card rounded-3xl p-12 text-center max-w-3xl mx-auto"
          >
            <motion.h2
              variants={fadeInUp}
              className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-6"
            >
              {t("faq.cta.title")}
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-lg text-muted-foreground mb-8"
            >
              {t("faq.cta.description")}
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={openChat}
                className="btn-gold"
              >
                {t("faq.cta.button")}
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
