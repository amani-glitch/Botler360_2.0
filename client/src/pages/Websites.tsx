/*
 * Websites Product Page
 * Dedicated landing page for the professional website product (249€)
 */

import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  Check,
  X,
  ArrowRight,
  Globe,
  Zap,
  Eye,
  TrendingUp,
  Shield,
  Clock,
  Smartphone,
  Star,
  Gift,
  MessageSquare,
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

export default function Websites() {
  const { t } = useLanguage();

  const sellingPoints = [
    {
      icon: Eye,
      title: t("websites.point1.title"),
      description: t("websites.point1.desc"),
    },
    {
      icon: Globe,
      title: t("websites.point2.title"),
      description: t("websites.point2.desc"),
    },
    {
      icon: TrendingUp,
      title: t("websites.point3.title"),
      description: t("websites.point3.desc"),
    },
    {
      icon: Zap,
      title: t("websites.point4.title"),
      description: t("websites.point4.desc"),
    },
  ];

  const features = [
    t("websites.feature1"),
    t("websites.feature2"),
    t("websites.feature3"),
    t("websites.feature4"),
    t("websites.feature5"),
    t("websites.feature6"),
    t("websites.feature7"),
    t("websites.feature8"),
    t("websites.feature9"),
    t("websites.feature10"),
  ];

  const comparison = [
    {
      feature: t("websites.compare.price"),
      botler: "249€",
      wix: "150-400€/an",
      freelance: "800-2000€",
      agency: "3000-10000€",
    },
    {
      feature: t("websites.compare.delivery"),
      botler: "24-48h",
      wix: t("websites.compare.diy"),
      freelance: "2-4 sem.",
      agency: "1-3 mois",
    },
    {
      feature: t("websites.compare.hosting"),
      botler: true,
      wix: true,
      freelance: false,
      agency: "Option",
    },
    {
      feature: t("websites.compare.seo"),
      botler: true,
      wix: "Basique",
      freelance: "Variable",
      agency: true,
    },
    {
      feature: t("websites.compare.support"),
      botler: "30 jours",
      wix: "Forum",
      freelance: "Variable",
      agency: true,
    },
    {
      feature: t("websites.compare.chatbot"),
      botler: t("websites.compare.free1month"),
      wix: false,
      freelance: false,
      agency: "Option",
    },
  ];

  const highlights = [
    { icon: Clock, text: t("websites.highlight1") },
    { icon: Globe, text: t("websites.highlight2") },
    { icon: Shield, text: t("websites.highlight3") },
    { icon: Smartphone, text: t("websites.highlight4") },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent dark:from-blue-500/10" />
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
              <Globe className="w-4 h-4" />
              {t("websites.badge")}
            </motion.span>
            <motion.h1
              variants={fadeInUp}
              className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6"
            >
              {t("websites.title1")}{" "}
              <span className="text-gradient-gold">{t("websites.highlight")}</span>
              <br />
              {t("websites.title2")}
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-muted-foreground mb-8"
            >
              {t("websites.description")}
            </motion.p>

            {/* Price */}
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-baseline gap-2 mb-8"
            >
              <span className="text-5xl sm:text-6xl font-bold text-gradient-gold">249€</span>
              <span className="text-xl text-muted-foreground">{t("websites.priceLabel")}</span>
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
                  {t("websites.cta")}
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Bonus Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="glass-card rounded-2xl p-4 sm:p-6 md:p-8 max-w-3xl mx-auto text-center border-2 border-amber-500/30"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Gift className="w-8 h-8 text-amber-500" />
              <MessageSquare className="w-8 h-8 text-teal-500" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">
              {t("websites.bonus.title")}
            </h3>
            <p className="text-muted-foreground">
              {t("websites.bonus.description")}
            </p>
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
              {t("websites.points.title1")}{" "}
              <span className="text-gradient-gold">{t("websites.points.highlight")}</span>
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
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center mx-auto mb-4">
                  <point.icon className="w-7 h-7 text-blue-500" />
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

      {/* Features List */}
      <section className="py-24 bg-gradient-to-b from-slate-200/50 to-background dark:from-slate-900/50">
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
              {t("websites.features.title")}
            </motion.h2>

            <motion.div
              variants={fadeInUp}
              className="grid md:grid-cols-2 gap-4"
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

      {/* Comparison Table */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-12"
          >
            <motion.h2
              variants={fadeInUp}
              className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4"
            >
              {t("websites.compare.title1")}{" "}
              <span className="text-gradient-gold">{t("websites.compare.highlight")}</span>
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="overflow-x-auto -mx-4 px-4"
          >
            <table className="w-full max-w-5xl mx-auto text-xs sm:text-sm md:text-base">
              <thead>
                <tr className="border-b border-border">
                  <th className="p-2 sm:p-4 text-left text-foreground font-semibold"></th>
                  <th className="p-2 sm:p-4 text-center">
                    <div className="glass-card rounded-xl p-2 sm:p-3 bg-amber-500/10 border border-amber-500/30">
                      <span className="text-amber-500 font-bold text-xs sm:text-base">Botler360</span>
                    </div>
                  </th>
                  <th className="p-2 sm:p-4 text-center text-muted-foreground">Wix</th>
                  <th className="p-2 sm:p-4 text-center text-muted-foreground hidden sm:table-cell">Freelance</th>
                  <th className="p-2 sm:p-4 text-center text-muted-foreground hidden md:table-cell">Agence</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row, index) => (
                  <tr key={index} className="border-b border-border/50">
                    <td className="p-2 sm:p-4 text-foreground font-medium">{row.feature}</td>
                    <td className="p-2 sm:p-4 text-center">
                      {typeof row.botler === "boolean" ? (
                        row.botler ? (
                          <Check className="w-4 h-4 sm:w-5 sm:h-5 text-teal-500 mx-auto" />
                        ) : (
                          <X className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 mx-auto" />
                        )
                      ) : (
                        <span className="text-amber-500 font-semibold">{row.botler}</span>
                      )}
                    </td>
                    <td className="p-2 sm:p-4 text-center text-muted-foreground">
                      {typeof row.wix === "boolean" ? (
                        row.wix ? (
                          <Check className="w-4 h-4 sm:w-5 sm:h-5 text-teal-500 mx-auto" />
                        ) : (
                          <X className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 mx-auto" />
                        )
                      ) : (
                        row.wix
                      )}
                    </td>
                    <td className="p-2 sm:p-4 text-center text-muted-foreground hidden sm:table-cell">
                      {typeof row.freelance === "boolean" ? (
                        row.freelance ? (
                          <Check className="w-4 h-4 sm:w-5 sm:h-5 text-teal-500 mx-auto" />
                        ) : (
                          <X className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 mx-auto" />
                        )
                      ) : (
                        row.freelance
                      )}
                    </td>
                    <td className="p-2 sm:p-4 text-center text-muted-foreground hidden md:table-cell">
                      {typeof row.agency === "boolean" ? (
                        row.agency ? (
                          <Check className="w-4 h-4 sm:w-5 sm:h-5 text-teal-500 mx-auto" />
                        ) : (
                          <X className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 mx-auto" />
                        )
                      ) : (
                        row.agency
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10" />
            <div className="relative">
              <motion.h2
                variants={fadeInUp}
                className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6"
              >
                {t("websites.cta.title1")}{" "}
                <span className="text-gradient-gold">{t("websites.cta.highlight")}</span>
              </motion.h2>
              <motion.p
                variants={fadeInUp}
                className="text-muted-foreground mb-8 max-w-2xl mx-auto"
              >
                {t("websites.cta.description")}
              </motion.p>
              <motion.div variants={fadeInUp}>
                <Link href="/contact">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-gold text-lg px-8 py-4"
                  >
                    {t("websites.cta.button")}
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
