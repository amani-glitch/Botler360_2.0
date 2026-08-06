import { motion } from "framer-motion";
import {
  Globe,
  ShoppingCart,
  CalendarClock,
  MessageSquare,
  Phone,
  UserRound,
  Smartphone,
  LayoutDashboard,
  Building2,
  Music,
  Mic,
  Podcast,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import OfferFamilyCard from "./OfferFamilyCard";
import AIOBanner from "./AIOBanner";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

export default function OfferFamiliesSection() {
  const { t } = useLanguage();

  const families = [
    {
      icon: Globe,
      title: t("home.offer.familyA.title"),
      benefit: t("home.offer.familyA.benefit"),
      captures: [
        { label: "Noco Events 49", icon: ShoppingCart },
        { label: "Boutique en ligne", icon: ShoppingCart },
        { label: "Site événementiel", icon: CalendarClock },
      ],
      capabilities: [
        { label: "Site avec agent IA intégré", cta: { state: "linked" as const, href: "/websites" } },
        { label: "Boutique en ligne", cta: { state: "unlinked" as const, topic: "ecommerce" } },
        { label: "Site événementiel éphémère", cta: { state: "unlinked" as const, topic: "site-evenementiel" } },
      ],
    },
    {
      icon: MessageSquare,
      title: t("home.offer.familyB.title"),
      benefit: t("home.offer.familyB.benefit"),
      captures: [
        { label: "Laura, ligne téléphonique", icon: Phone },
        { label: "Chat sur site", icon: MessageSquare },
        { label: "Agent ambassadeur", icon: UserRound },
      ],
      capabilities: [
        { label: "Chat sur le site", cta: { state: "linked" as const, href: "/solutions" } },
        { label: "Voix / standard téléphonique", cta: { state: "unlinked" as const, topic: "voix-telephonie" } },
        { label: "Agent ambassadeur produit (VRP)", cta: { state: "unlinked" as const, topic: "agent-vrp" } },
        { label: "Agent sur visite virtuelle", cta: { state: "unlinked" as const, topic: "visite-virtuelle" } },
      ],
    },
    {
      icon: Smartphone,
      title: t("home.offer.familyC.title"),
      benefit: t("home.offer.familyC.benefit"),
      captures: [
        { label: "Travel & Vous", icon: Smartphone },
        { label: "Carpentras Notre Ville", icon: Building2 },
        { label: "Dashboard admin", icon: LayoutDashboard },
      ],
      capabilities: [
        { label: "Applications mobiles", cta: { state: "linked" as const, href: "/applications-mobiles" } },
        { label: "Plateformes, espaces client & dashboards", cta: { state: "unlinked" as const, topic: "plateformes-apps" } },
      ],
    },
    {
      icon: Music,
      title: t("home.offer.familyD.title"),
      benefit: t("home.offer.familyD.benefit"),
      captures: [
        { label: "Yousic", icon: Music },
        { label: "Botler Studio", icon: Mic },
        { label: "Podcasts IA", icon: Podcast },
      ],
      capabilities: [
        { label: "Yousic — chansons personnalisées", cta: { state: "linked" as const, href: "https://yousic.ai" } },
        { label: "BFF", cta: { state: "unlinked" as const, topic: "bff" } },
        { label: "Botler Studio", cta: { state: "unlinked" as const, topic: "botler-studio" } },
        { label: "Podcasts & interviews IA", cta: { state: "unlinked" as const, topic: "podcasts-ia" } },
      ],
    },
  ];

  return (
    <section id="offre" className="relative py-20 sm:py-28 bg-white">
      <div className="container mx-auto px-4 lg:px-8 xl:px-12 2xl:px-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center mb-14 max-w-2xl mx-auto"
        >
          <motion.span
            variants={fadeInUp}
            className="inline-block text-amber-600 text-xs font-semibold uppercase tracking-wide mb-3"
          >
            {t("home.offer.eyebrow")}
          </motion.span>
          <motion.h2 variants={fadeInUp} className="font-heading text-3xl md:text-4xl font-semibold text-slate-900">
            {t("home.offer.title")}
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid md:grid-cols-2 gap-6"
        >
          {families.map((family) => (
            <OfferFamilyCard key={family.title} {...family} />
          ))}
        </motion.div>

        <AIOBanner />
      </div>
    </section>
  );
}
