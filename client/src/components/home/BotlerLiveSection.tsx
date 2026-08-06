import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import HeroChat from "@/components/HeroChat";
import { HERO_AGENT_ANCHOR_ID } from "@/lib/botlerHandoff";

export default function BotlerLiveSection() {
  const { t } = useLanguage();

  return (
    <section id={HERO_AGENT_ANCHOR_ID} className="relative py-20 sm:py-28 bg-slate-950 text-slate-50 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(245,158,11,0.08)_0%,_transparent_60%)]" />

      <div className="relative container mx-auto px-4 lg:px-8 xl:px-12 2xl:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-10"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-amber-400 text-xs font-semibold uppercase tracking-wide mb-4">
            {t("home.botlerLive.eyebrow")}
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-semibold text-slate-50 mb-4">
            {t("home.botlerLive.title")}
          </h2>
          <p className="text-slate-300">{t("home.botlerLive.description")}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex justify-center"
        >
          <HeroChat />
        </motion.div>
      </div>
    </section>
  );
}
