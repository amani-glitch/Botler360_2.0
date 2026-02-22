/*
 * Design: Botler360 - Elegant Professional Theme
 * - Supports both light and dark modes
 * - Pricing cards with glass morphism
 * - Digital solutions showcase
 * - Feature comparison
 */

import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  Check,
  ArrowRight,
  Globe,
  Smartphone,
  Video,
  Headphones,
  Zap,
  Shield,
  Clock,
  HeadphonesIcon,
  Star,
  Users,
  MessageSquare,
  BarChart3,
  Languages,
  Target,
  Mail,
  Calendar,
  Wrench,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { useLanguage } from "@/contexts/LanguageContext";
import { useChat } from "@/contexts/ChatContext";

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

export default function Solutions() {
  const { t } = useLanguage();
  const { openChat } = useChat();

  const pricingPlans = [
    {
      name: "Pack Junior",
      price: "9€",
      period: t("solutions.pricing.perMonth"),
      description: t("solutions.pricing.junior.desc"),
      features: [
        t("solutions.pricing.junior.f1"),
        t("solutions.pricing.junior.f2"),
        t("solutions.pricing.junior.f3"),
        t("solutions.pricing.junior.f4"),
      ],
      highlighted: false,
      cta: t("solutions.pricing.junior.cta"),
      icon: MessageSquare,
    },
    {
      name: "Pack Expert",
      price: "19€",
      period: t("solutions.pricing.perMonth"),
      description: t("solutions.pricing.expert.desc"),
      features: [
        t("solutions.pricing.expert.f1"),
        t("solutions.pricing.expert.f2"),
        t("solutions.pricing.expert.f3"),
        t("solutions.pricing.expert.f4"),
        t("solutions.pricing.expert.f5"),
        t("solutions.pricing.expert.f6"),
      ],
      highlighted: false,
      cta: t("solutions.pricing.expert.cta"),
      icon: Target,
    },
    {
      name: "Pack Expert PME",
      price: "49€",
      period: t("solutions.pricing.perMonth"),
      description: t("solutions.pricing.expertPME.desc"),
      features: [
        t("solutions.pricing.expertPME.f1"),
        t("solutions.pricing.expertPME.f2"),
        t("solutions.pricing.expertPME.f3"),
        t("solutions.pricing.expertPME.f4"),
        t("solutions.pricing.expertPME.f5"),
        t("solutions.pricing.expertPME.f6"),
      ],
      highlighted: true,
      cta: t("solutions.pricing.expertPME.cta"),
      badge: t("solutions.pricing.recommended"),
      icon: BarChart3,
    },
    {
      name: t("solutions.pricing.custom.name"),
      price: t("solutions.pricing.custom.price"),
      period: "",
      description: t("solutions.pricing.custom.desc"),
      features: [
        t("solutions.pricing.custom.f1"),
        t("solutions.pricing.custom.f2"),
      ],
      highlighted: false,
      cta: t("solutions.pricing.custom.cta"),
      icon: Users,
    },
  ];

  const guarantees = [
    {
      icon: Shield,
      title: t("solutions.guarantees.satisfaction.title"),
      description: t("solutions.guarantees.satisfaction.desc"),
    },
    {
      icon: Zap,
      title: t("solutions.guarantees.deploy.title"),
      description: t("solutions.guarantees.deploy.desc"),
    },
    {
      icon: HeadphonesIcon,
      title: t("solutions.guarantees.support.title"),
      description: t("solutions.guarantees.support.desc"),
    },
  ];

  const websiteOffer = {
    price: "249€",
    priceUnit: "TTC",
    title: t("solutions.website.title"),
    description: t("solutions.website.description"),
    highlights: [
      { icon: Clock, text: t("solutions.website.h1") },
      { icon: Globe, text: t("solutions.website.h2") },
      { icon: Shield, text: t("solutions.website.h3") },
      { icon: Smartphone, text: t("solutions.website.h4") },
    ],
    features: [
      t("solutions.website.f1"),
      t("solutions.website.f2"),
      t("solutions.website.f3"),
      t("solutions.website.f4"),
      t("solutions.website.f5"),
      t("solutions.website.f6"),
      t("solutions.website.f7"),
      t("solutions.website.f8"),
      t("solutions.website.f9"),
      t("solutions.website.f10"),
    ],
  };

  const additionalServices = [
    {
      icon: Smartphone,
      title: t("solutions.additional.mobile.title"),
      description: t("solutions.additional.mobile.desc"),
      price: "249€",
      link: "/applications-mobiles",
    },
    {
      icon: Video,
      title: t("solutions.additional.video360.title"),
      description: t("solutions.additional.video360.desc"),
      price: t("solutions.additional.video360.price"),
      link: "chat",
    },
    {
      icon: Headphones,
      title: t("solutions.additional.audio.title"),
      description: t("solutions.additional.audio.desc"),
      price: t("solutions.additional.audio.price"),
      link: "chat",
    },
    {
      icon: Wrench,
      title: t("solutions.additional.custom.title"),
      description: t("solutions.additional.custom.desc"),
      price: t("solutions.additional.custom.price"),
      link: "chat",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title={t("seo.solutions.title")} description={t("seo.solutions.description")} canonical="/solutions" />
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent dark:from-amber-500/10" />
        <div className="absolute inset-0 bg-grid-pattern opacity-30 dark:opacity-20" />

        <div className="relative container mx-auto px-4">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.h1
              variants={fadeInUp}
              className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6"
            >
              {t("solutions.title1")} <span className="text-gradient-gold">{t("solutions.highlight")}</span>
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-muted-foreground"
            >
              {t("solutions.description")}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Chatbot Pricing Section */}
      <section className="py-16">
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
              className="font-heading text-3xl font-bold text-foreground mb-4"
            >
              {t("solutions.pricing.title1")} <span className="text-gradient-gold">{t("solutions.pricing.highlight")}</span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-muted-foreground"
            >
              {t("solutions.pricing.subtitle")}
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
          >
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className={`relative glass-card rounded-2xl p-6 ${
                  plan.highlighted
                    ? "border-2 border-amber-500/50 shadow-lg shadow-amber-500/10"
                    : ""
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 text-xs font-semibold whitespace-nowrap">
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-teal-500/20 flex items-center justify-center mx-auto mb-4">
                    <plan.icon className="w-6 h-6 text-amber-500" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-3xl font-bold text-gradient-gold">
                      {plan.price}
                    </span>
                    <span className="text-muted-foreground text-sm">{plan.period}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {plan.description}
                  </p>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground/80">{feature}</span>
                    </li>
                  ))}
                </ul>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={openChat}
                  className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all ${
                    plan.highlighted
                      ? "btn-gold"
                      : "btn-outline-gold"
                  }`}
                >
                  {plan.cta}
                </motion.button>
              </motion.div>
            ))}
          </motion.div>

          {/* Commission Note */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mt-8"
          >
            <p className="text-sm text-muted-foreground">
              {t("solutions.pricing.commission")}
            </p>
          </motion.div>

          {/* Guarantees */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto"
          >
            {guarantees.map((guarantee, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="flex items-center gap-4 p-4 glass-card rounded-xl"
              >
                <div className="w-12 h-12 rounded-xl bg-teal-500/20 flex items-center justify-center flex-shrink-0">
                  <guarantee.icon className="w-6 h-6 text-teal-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">
                    {guarantee.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {guarantee.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Website Offer Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="glass-card rounded-3xl p-8 md:p-12 max-w-5xl mx-auto"
          >
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Left - Offer Details */}
              <motion.div variants={fadeInUp}>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 text-amber-500 text-sm font-medium mb-6">
                  <Star className="w-4 h-4" />
                  {t("solutions.website.badge")}
                </span>
                <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
                  {websiteOffer.title}
                </h2>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-5xl font-bold text-gradient-gold">
                    {websiteOffer.price}
                  </span>
                  <span className="text-muted-foreground">
                    {websiteOffer.priceUnit}
                  </span>
                </div>
                <p className="text-muted-foreground mb-8">
                  {websiteOffer.description}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  {websiteOffer.highlights.map((highlight, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-xl bg-background/50"
                    >
                      <highlight.icon className="w-5 h-5 text-amber-500" />
                      <span className="text-sm text-foreground">
                        {highlight.text}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={openChat}
                    className="btn-gold flex items-center gap-2"
                  >
                    {t("solutions.website.cta")}
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>

              {/* Right - Features List */}
              <motion.div variants={fadeInUp}>
                <h3 className="text-xl font-bold text-foreground mb-6">
                  {t("solutions.website.included")}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {websiteOffer.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-teal-500 flex-shrink-0" />
                      <span className="text-sm text-foreground/80">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Additional Services Section */}
      <section className="py-16">
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
              className="font-heading text-3xl font-bold text-foreground mb-4"
            >
              {t("solutions.additional.title1")} <span className="text-gradient-gold">{t("solutions.additional.highlight")}</span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-muted-foreground"
            >
              {t("solutions.additional.description")}
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
          >
            {additionalServices.map((service, index) => {
              const cardContent = (
                <motion.div
                  variants={fadeInUp}
                  className="glass-card glass-card-hover rounded-2xl p-6 text-center cursor-pointer h-full"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-teal-500/20 flex items-center justify-center mx-auto mb-4">
                    <service.icon className="w-7 h-7 text-amber-500" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 text-sm">
                    {service.description}
                  </p>
                  <span className="text-amber-500 font-semibold text-sm">
                    {service.price}
                  </span>
                </motion.div>
              );
              return service.link === "chat" ? (
                <div key={index} onClick={openChat}>{cardContent}</div>
              ) : (
                <Link key={index} href={service.link}>{cardContent}</Link>
              );
            })}
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
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-teal-500/10" />
            <div className="relative">
              <motion.h2
                variants={fadeInUp}
                className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6"
              >
                {t("cta.title1")} <span className="text-gradient-gold">{t("cta.highlight")}</span> {t("cta.title2")}
              </motion.h2>
              <motion.p
                variants={fadeInUp}
                className="text-muted-foreground mb-8 max-w-2xl mx-auto"
              >
                {t("cta.description")}
              </motion.p>
              <motion.div variants={fadeInUp}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={openChat}
                  className="btn-gold text-lg px-8 py-4"
                >
                  {t("cta.button")}
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
