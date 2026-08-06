import { motion } from "framer-motion";
import { ShieldCheck, BadgeCheck, UserCheck } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

export default function AgentBoundariesSection() {
  const { t } = useLanguage();

  const items = [
    { icon: ShieldCheck, title: t("home.boundaries.item1.title"), desc: t("home.boundaries.item1.desc") },
    { icon: BadgeCheck, title: t("home.boundaries.item2.title"), desc: t("home.boundaries.item2.desc") },
    { icon: UserCheck, title: t("home.boundaries.item3.title"), desc: t("home.boundaries.item3.desc") },
  ];

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
            {t("home.boundaries.eyebrow")}
          </motion.span>
          <motion.h2 variants={fadeInUp} className="font-heading text-3xl md:text-4xl font-semibold text-foreground">
            {t("home.boundaries.title")}
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
          {items.map((item) => (
            <motion.div key={item.title} variants={fadeInUp} className="glass-card rounded-2xl p-6 text-center">
              <item.icon className="w-8 h-8 text-amber-600 mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
