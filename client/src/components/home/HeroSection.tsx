import { motion } from "framer-motion";
import { ShoppingCart, Smartphone, Phone, MessageSquare, LayoutDashboard } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import CTADuo from "./CTADuo";
import BotlerAvatar from "./BotlerAvatar";
import PlaceholderCapture from "./PlaceholderCapture";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const ECOSYSTEM_TILES = [
  { icon: ShoppingCart, label: "Boutique en ligne" },
  { icon: Smartphone, label: "App mobile" },
  { icon: Phone, label: "Appel téléphonique" },
  { icon: MessageSquare, label: "Conversation" },
  { icon: LayoutDashboard, label: "Tableau de bord" },
];

export default function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="relative flex items-center pt-28 sm:pt-32 pb-16 lg:min-h-[90vh] overflow-hidden bg-slate-950 text-slate-50">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(245,158,11,0.14)_0%,_transparent_55%)]" />
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />

      <div className="relative container mx-auto px-4 lg:px-8 xl:px-12 2xl:px-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="space-y-6 sm:space-y-8 text-center lg:text-left"
          >
            <motion.h1
              variants={fadeInUp}
              className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight text-slate-50"
            >
              {t("home.hero.h1Pre")}{" "}
              <span className="text-gradient-gold">{t("home.hero.h1Highlight")}</span>{" "}
              {t("home.hero.h1Post")}
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-base sm:text-lg md:text-xl text-slate-300 max-w-xl mx-auto lg:mx-0"
            >
              {t("home.hero.subtitle")}
            </motion.p>

            <motion.div variants={fadeInUp} className="flex justify-center lg:justify-start">
              <CTADuo />
            </motion.div>

            <motion.p
              variants={fadeInUp}
              className="text-sm text-slate-400 italic max-w-lg mx-auto lg:mx-0"
            >
              {t("home.hero.manifesto")}
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="flex flex-col items-center gap-6">
              <BotlerAvatar size={88} />
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 w-full max-w-md">
                {ECOSYSTEM_TILES.map((tile) => (
                  <PlaceholderCapture
                    key={tile.label}
                    icon={tile.icon}
                    label={tile.label}
                    variant="tile"
                    tone="dark"
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
