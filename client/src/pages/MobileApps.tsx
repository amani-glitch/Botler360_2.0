/*
 * Mobile Apps Product Page
 * Dedicated landing page for the mobile application product (249€)
 */

import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  Check,
  ArrowRight,
  Smartphone,
  Zap,
  DollarSign,
  Shield,
  Clock,
  Star,
  FileText,
  Code,
  Rocket,
  HelpCircle,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

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

export default function MobileApps() {
  const { t } = useLanguage();

  const sellingPoints = [
    {
      icon: DollarSign,
      title: t("mobileapps.point1.title"),
      description: t("mobileapps.point1.desc"),
    },
    {
      icon: Zap,
      title: t("mobileapps.point2.title"),
      description: t("mobileapps.point2.desc"),
    },
    {
      icon: Shield,
      title: t("mobileapps.point3.title"),
      description: t("mobileapps.point3.desc"),
    },
    {
      icon: Check,
      title: t("mobileapps.point4.title"),
      description: t("mobileapps.point4.desc"),
    },
  ];

  const features = [
    t("mobileapps.feature1"),
    t("mobileapps.feature2"),
    t("mobileapps.feature3"),
    t("mobileapps.feature4"),
    t("mobileapps.feature5"),
    t("mobileapps.feature6"),
    t("mobileapps.feature7"),
    t("mobileapps.feature8"),
    t("mobileapps.feature9"),
    t("mobileapps.feature10"),
    t("mobileapps.feature11"),
    t("mobileapps.feature12"),
    t("mobileapps.feature13"),
  ];

  const process = [
    {
      icon: FileText,
      title: t("mobileapps.process.step1.title"),
      description: t("mobileapps.process.step1.desc"),
    },
    {
      icon: Code,
      title: t("mobileapps.process.step2.title"),
      description: t("mobileapps.process.step2.desc"),
    },
    {
      icon: Rocket,
      title: t("mobileapps.process.step3.title"),
      description: t("mobileapps.process.step3.desc"),
    },
  ];

  const faq = [
    { q: t("mobileapps.faq.q1"), a: t("mobileapps.faq.a1") },
    { q: t("mobileapps.faq.q2"), a: t("mobileapps.faq.a2") },
    { q: t("mobileapps.faq.q3"), a: t("mobileapps.faq.a3") },
    { q: t("mobileapps.faq.q4"), a: t("mobileapps.faq.a4") },
  ];

  const highlights = [
    { icon: Smartphone, text: t("mobileapps.highlight1") },
    { icon: Clock, text: t("mobileapps.highlight2") },
    { icon: Star, text: t("mobileapps.highlight3") },
    { icon: Zap, text: t("mobileapps.highlight4") },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent dark:from-purple-500/10" />
        <div className="absolute inset-0 bg-grid-pattern opacity-30 dark:opacity-20" />

        <div className="relative container mx-auto px-4">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.span
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-amber-500 text-sm font-medium mb-6"
            >
              <Smartphone className="w-4 h-4" />
              {t("mobileapps.badge")}
            </motion.span>
            <motion.h1
              variants={fadeInUp}
              className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6"
            >
              {t("mobileapps.title1")}{" "}
              <span className="text-gradient-gold">{t("mobileapps.highlight")}</span>
              <br />
              {t("mobileapps.title2")}
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-muted-foreground mb-8"
            >
              {t("mobileapps.description")}
            </motion.p>

            {/* Price */}
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-baseline gap-2 mb-8"
            >
              <span className="text-5xl sm:text-6xl font-bold text-gradient-gold">249€</span>
              <span className="text-xl text-muted-foreground">{t("mobileapps.priceLabel")}</span>
            </motion.div>

            {/* Highlights */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap justify-center gap-4 mb-8"
            >
              {highlights.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-4 py-2 glass-card rounded-lg"
                >
                  <item.icon className="w-4 h-4 text-amber-500" />
                  <span className="text-sm text-foreground/80">{item.text}</span>
                </div>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-4">
              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-gold flex items-center gap-2"
                >
                  {t("mobileapps.cta")}
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 4 Selling Points */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4"
            >
              {t("mobileapps.points.title1")}{" "}
              <span className="text-gradient-gold">{t("mobileapps.points.highlight")}</span>
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
          >
            {sellingPoints.map((point, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="glass-card glass-card-hover rounded-2xl p-6 text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mx-auto mb-4">
                  <point.icon className="w-7 h-7 text-purple-500" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  {point.title}
                </h3>
                <p className="text-sm text-muted-foreground">{point.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 3-Step Process */}
      <section className="py-24 bg-gradient-to-b from-slate-200/50 to-background dark:from-slate-900/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4"
            >
              {t("mobileapps.process.title1")}{" "}
              <span className="text-gradient-gold">{t("mobileapps.process.highlight")}</span>
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 max-w-4xl mx-auto"
          >
            {process.map((step, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="glass-card rounded-2xl p-8 text-center relative"
              >
                {index < process.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-amber-500 to-transparent" />
                )}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-teal-500/20 flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-8 h-8 text-amber-500" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features List */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="max-w-4xl mx-auto"
          >
            <motion.h2
              variants={fadeInUp}
              className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-12 text-center"
            >
              {t("mobileapps.features.title")}
            </motion.h2>

            <motion.div
              variants={fadeInUp}
              className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4"
            >
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-teal-500 flex-shrink-0" />
                  <span className="text-foreground">{feature}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-gradient-to-b from-slate-200/50 to-background dark:from-slate-900/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="max-w-3xl mx-auto"
          >
            <motion.h2
              variants={fadeInUp}
              className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-12 text-center"
            >
              {t("mobileapps.faq.title")}
            </motion.h2>

            <motion.div variants={fadeInUp} className="space-y-4">
              {faq.map((item, index) => (
                <div key={index} className="glass-card rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <HelpCircle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">{item.q}</h4>
                      <p className="text-muted-foreground">{item.a}</p>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
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
            className="relative glass-card rounded-3xl p-12 text-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10" />
            <div className="relative">
              <motion.h2
                variants={fadeInUp}
                className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6"
              >
                {t("mobileapps.cta.title1")}{" "}
                <span className="text-gradient-gold">{t("mobileapps.cta.highlight")}</span>
              </motion.h2>
              <motion.p
                variants={fadeInUp}
                className="text-muted-foreground mb-8 max-w-2xl mx-auto"
              >
                {t("mobileapps.cta.description")}
              </motion.p>
              <motion.div variants={fadeInUp}>
                <Link href="/contact">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-gold text-lg px-8 py-4"
                  >
                    {t("mobileapps.cta.button")}
                  </motion.button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
