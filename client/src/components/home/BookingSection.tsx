import { motion } from "framer-motion";
import { CalendarDays, Mail } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

// Set VITE_CAL_LINK (e.g. "https://cal.com/botler360/decouverte") once a real
// booking account exists — until then this section falls back to a direct
// contact link rather than embedding a broken/placeholder iframe.
const CAL_LINK: string =
  (import.meta as unknown as { env: { VITE_CAL_LINK?: string } }).env.VITE_CAL_LINK || "";

export default function BookingSection() {
  const { t } = useLanguage();

  return (
    <section id="rendez-vous" className="relative py-20 sm:py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8 xl:px-12 2xl:px-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center max-w-xl mx-auto mb-10"
        >
          <span className="inline-block text-amber-600 text-xs font-semibold uppercase tracking-wide mb-3">
            {t("home.booking.eyebrow")}
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-semibold text-foreground mb-3">
            {t("home.booking.title")}
          </h2>
          <p className="text-muted-foreground">{t("home.booking.description")}</p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="max-w-2xl mx-auto"
        >
          {CAL_LINK ? (
            <div className="glass-card rounded-2xl overflow-hidden" style={{ height: 640 }}>
              <iframe
                src={CAL_LINK}
                title={t("home.booking.iframeTitle")}
                className="w-full h-full border-0"
                loading="lazy"
              />
            </div>
          ) : (
            <div className="glass-card rounded-2xl p-8 text-center flex flex-col items-center gap-4">
              <CalendarDays className="w-8 h-8 text-amber-600" />
              <p className="text-foreground/80">{t("home.booking.fallback")}</p>
              <a href="mailto:contact@botler360.com" className="btn-gold inline-flex items-center gap-2">
                <Mail className="w-4 h-4" />
                contact@botler360.com
              </a>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
