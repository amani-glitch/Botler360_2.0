import { motion } from "framer-motion";
import { ShieldCheck, Server, Lock, FileCheck } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const bullets = {
  fr: [
    { icon: Server, title: "Hébergement en Europe", desc: "Infrastructure Google Cloud, région Dublin (Irlande)." },
    { icon: ShieldCheck, title: "Conforme RGPD & UK GDPR", desc: "Vos données sont traitées selon la réglementation européenne et britannique." },
    { icon: Lock, title: "Vous restez propriétaire", desc: "Vos contenus, vos conversations, vos données — ils vous appartiennent." },
    { icon: FileCheck, title: "Politique détaillée", desc: "Le détail complet est dans notre politique de confidentialité." },
  ],
  en: [
    { icon: Server, title: "Hosted in Europe", desc: "Google Cloud infrastructure, Dublin (Ireland) region." },
    { icon: ShieldCheck, title: "GDPR & UK GDPR compliant", desc: "Your data is processed under European and UK regulation." },
    { icon: Lock, title: "You stay the owner", desc: "Your content, your conversations, your data — they belong to you." },
    { icon: FileCheck, title: "Full policy available", desc: "The complete detail lives in our privacy policy." },
  ],
};

export default function DataSecuritySection() {
  const { t, language } = useLanguage();
  const items = bullets[language];

  return (
    <section className="relative py-20 sm:py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8 xl:px-12 2xl:px-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center mb-14 max-w-2xl mx-auto"
        >
          <motion.span variants={fadeInUp} className="inline-block text-amber-600 text-xs font-semibold uppercase tracking-wide mb-3">
            {t("home.dataSecurity.eyebrow")}
          </motion.span>
          <motion.h2 variants={fadeInUp} className="font-heading text-3xl md:text-4xl font-semibold text-foreground">
            {t("home.dataSecurity.title")}
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto"
        >
          {items.map((item) => (
            <motion.div key={item.title} variants={fadeInUp} className="text-center">
              <item.icon className="w-7 h-7 text-amber-600 mx-auto mb-3" />
              <h3 className="font-semibold text-foreground text-sm mb-1">{item.title}</h3>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
