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
        { label: t("home.offer.familyA.capture1"), icon: ShoppingCart },
        { label: t("home.offer.familyA.capture2"), icon: ShoppingCart },
        { label: t("home.offer.familyA.capture3"), icon: CalendarClock },
      ],
      capabilities: [
        { label: t("home.offer.familyA.capability1"), cta: { state: "linked" as const, href: "/websites" } },
        { label: t("home.offer.familyA.capability2"), cta: { state: "unlinked" as const, topic: "ecommerce" } },
        { label: t("home.offer.familyA.capability3"), cta: { state: "unlinked" as const, topic: "site-evenementiel" } },
      ],
    },
    {
      icon: MessageSquare,
      title: t("home.offer.familyB.title"),
      benefit: t("home.offer.familyB.benefit"),
      captures: [
        { label: t("home.offer.familyB.capture1"), icon: Phone },
        { label: t("home.offer.familyB.capture2"), icon: MessageSquare },
        { label: t("home.offer.familyB.capture3"), icon: UserRound },
      ],
      capabilities: [
        { label: t("home.offer.familyB.capability1"), cta: { state: "linked" as const, href: "/solutions" } },
        { label: t("home.offer.familyB.capability2"), cta: { state: "unlinked" as const, topic: "voix-telephonie" } },
        { label: t("home.offer.familyB.capability3"), cta: { state: "unlinked" as const, topic: "agent-vrp" } },
        { label: t("home.offer.familyB.capability4"), cta: { state: "unlinked" as const, topic: "visite-virtuelle" } },
      ],
    },
    {
      icon: Smartphone,
      title: t("home.offer.familyC.title"),
      benefit: t("home.offer.familyC.benefit"),
      captures: [
        { label: t("home.offer.familyC.capture1"), icon: Smartphone },
        { label: t("home.offer.familyC.capture2"), icon: Building2 },
        { label: t("home.offer.familyC.capture3"), icon: LayoutDashboard },
      ],
      capabilities: [
        { label: t("home.offer.familyC.capability1"), cta: { state: "linked" as const, href: "/applications-mobiles" } },
        { label: t("home.offer.familyC.capability2"), cta: { state: "unlinked" as const, topic: "plateformes-apps" } },
      ],
    },
    {
      icon: Music,
      title: t("home.offer.familyD.title"),
      benefit: t("home.offer.familyD.benefit"),
      captures: [
        { label: t("home.offer.familyD.capture1"), icon: Music },
        { label: t("home.offer.familyD.capture2"), icon: Mic },
        { label: t("home.offer.familyD.capture3"), icon: Podcast },
      ],
      capabilities: [
        { label: t("home.offer.familyD.capability1"), cta: { state: "linked" as const, href: "https://yousic.ai" } },
        { label: t("home.offer.familyD.capability2"), cta: { state: "unlinked" as const, topic: "bff" } },
        { label: t("home.offer.familyD.capability3"), cta: { state: "unlinked" as const, topic: "botler-studio" } },
        { label: t("home.offer.familyD.capability4"), cta: { state: "unlinked" as const, topic: "podcasts-ia" } },
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
