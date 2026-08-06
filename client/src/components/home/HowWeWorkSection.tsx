import { motion } from "framer-motion";
import { MessagesSquare, Hammer, Rocket } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

export default function HowWeWorkSection() {
  const { t } = useLanguage();

  const steps = [
    { icon: MessagesSquare, title: t("home.howWeWork.step1.title"), desc: t("home.howWeWork.step1.desc") },
    { icon: Hammer, title: t("home.howWeWork.step2.title"), desc: t("home.howWeWork.step2.desc") },
    { icon: Rocket, title: t("home.howWeWork.step3.title"), desc: t("home.howWeWork.step3.desc") },
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
            {t("home.howWeWork.eyebrow")}
          </motion.span>
          <motion.h2 variants={fadeInUp} className="font-heading text-3xl md:text-4xl font-semibold text-foreground">
            {t("home.howWeWork.title")}
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto"
        >
          {steps.map((step, index) => (
            <motion.div key={step.title} variants={fadeInUp} className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/15 flex items-center justify-center mx-auto mb-4 relative">
                <step.icon className="w-7 h-7 text-amber-600" />
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-amber-500 text-slate-950 text-xs font-bold flex items-center justify-center">
                  {index + 1}
                </span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
