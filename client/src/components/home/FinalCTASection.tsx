import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import CTADuo from "./CTADuo";

export default function FinalCTASection() {
  const { t } = useLanguage();

  return (
    <section className="relative py-20 sm:py-24 bg-slate-950 text-slate-50 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(245,158,11,0.12)_0%,_transparent_55%)]" />
      <div className="relative container mx-auto px-4 lg:px-8 xl:px-12 2xl:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto"
        >
          <h2 className="font-heading text-3xl md:text-4xl font-semibold mb-3">
            {t("home.finalCta.title")}
          </h2>
          <p className="text-slate-300 mb-8">{t("home.finalCta.subtitle")}</p>
          <div className="flex justify-center">
            <CTADuo />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
