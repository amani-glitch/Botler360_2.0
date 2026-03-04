/*
 * Design: Botler360 - Elegant Professional Theme
 * - Supports both light and dark modes
 * - Gold and teal accents throughout
 * - Glass morphism cards with backdrop blur
 * - Modern typography with Space Grotesk headlines
 * - Smooth animations with Framer Motion
 */

import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  CheckCircle,
  Clock,
  Zap,
  Users,
  Shield,
  Globe,
  Building2,
  ArrowRight,
  Star,
  Play,
  Sparkles,
  MessageSquare,
  Smartphone,
  Video,
  Headphones,
  Wrench,
  Heart,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { useLanguage } from "@/contexts/LanguageContext";
import { useChat } from "@/contexts/ChatContext";

// Animation variants
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

export default function Home() {
  const { t } = useLanguage();
  const { openChat } = useChat();

  // Sector data with translations
  const sectors = [
    {
      id: "tourisme",
      name: t("sector.tourism"),
      description: t("home.sectors.tourism.desc"),
      stats: t("home.sectors.tourism.stat"),
      image: "/images/Botler_pour_vos_voyageurs.__4_.png",
      color: "from-amber-500/20 to-orange-500/20",
    },
    {
      id: "viticulture",
      name: t("sector.viticulture"),
      description: t("home.sectors.viticulture.desc"),
      stats: t("home.sectors.viticulture.stat"),
      image: "/images/Botler_pour_vos_voyageurs.__7_.png",
      color: "from-purple-500/20 to-pink-500/20",
    },
    {
      id: "restaurants",
      name: t("sector.restaurants"),
      description: t("home.sectors.restaurants.desc"),
      stats: t("home.sectors.restaurants.stat"),
      image: "/images/accueil_resto.png",
      color: "from-red-500/20 to-orange-500/20",
    },
    {
      id: "boulangerie",
      name: t("sector.bakery"),
      description: t("home.sectors.bakery.desc"),
      stats: t("home.sectors.bakery.stat"),
      image: "/images/accueil_Boulangerie.png",
      color: "from-yellow-500/20 to-amber-500/20",
    },
    {
      id: "immobilier",
      name: t("sector.realEstate"),
      description: t("home.sectors.realEstate.desc"),
      stats: t("home.sectors.realEstate.stat"),
      image: "/images/Botler_pour_vos_voyageurs.__17_.png",
      color: "from-blue-500/20 to-cyan-500/20",
    },
    {
      id: "hebergements",
      name: t("sector.accommodation"),
      description: t("home.sectors.accommodation.desc"),
      stats: t("home.sectors.accommodation.stat"),
      image: "/images/merci_heberg.png",
      color: "from-teal-500/20 to-emerald-500/20",
    },
  ];

  // Features data with translations
  const features = [
    {
      icon: Zap,
      title: t("home.features.install.title"),
      description: t("home.features.install.desc"),
    },
    {
      icon: Clock,
      title: t("home.features.available.title"),
      description: t("home.features.available.desc"),
    },
    {
      icon: Users,
      title: t("home.features.qualify.title"),
      description: t("home.features.qualify.desc"),
    },
  ];

  // Trust badges with translations
  const trustBadges = [
    { icon: Shield, text: t("home.trust.compatible") },
    { icon: Globe, text: t("home.trust.secure") },
    { icon: Building2, text: t("home.trust.pme") },
  ];

  // Testimonials with translations
  const testimonials = [
    {
      text: t("home.testimonials.1.text"),
      author: t("home.testimonials.1.author"),
      sector: t("home.testimonials.1.sector"),
      stat: t("home.testimonials.1.stat"),
    },
    {
      text: t("home.testimonials.2.text"),
      author: t("home.testimonials.2.author"),
      sector: t("home.testimonials.2.sector"),
      stat: t("home.testimonials.2.stat"),
    },
    {
      text: t("home.testimonials.3.text"),
      author: t("home.testimonials.3.author"),
      sector: t("home.testimonials.3.sector"),
      stat: t("home.testimonials.3.stat"),
    },
  ];

  // Hero badges with translations
  const heroBadges = [
    t("home.hero.badge1"),
    t("home.hero.badge2"),
    t("home.hero.badge3"),
    t("home.hero.badge4"),
  ];

  // 6 Products / Expertises
  const expertises = [
    {
      icon: MessageSquare,
      title: t("home.expertises.chatbot.title"),
      description: t("home.expertises.chatbot.desc"),
      price: t("home.expertises.chatbot.price"),
      link: "/solutions",
      color: "from-amber-500/20 to-orange-500/20",
    },
    {
      icon: Globe,
      title: t("home.expertises.website.title"),
      description: t("home.expertises.website.desc"),
      price: t("home.expertises.website.price"),
      link: "/websites",
      color: "from-blue-500/20 to-cyan-500/20",
    },
    {
      icon: Smartphone,
      title: t("home.expertises.mobile.title"),
      description: t("home.expertises.mobile.desc"),
      price: t("home.expertises.mobile.price"),
      link: "/applications-mobiles",
      color: "from-purple-500/20 to-pink-500/20",
    },
    {
      icon: Video,
      title: t("home.expertises.video360.title"),
      description: t("home.expertises.video360.desc"),
      price: t("home.expertises.video360.price"),
      link: "/solutions",
      color: "from-teal-500/20 to-emerald-500/20",
    },
    {
      icon: Headphones,
      title: t("home.expertises.audio.title"),
      description: t("home.expertises.audio.desc"),
      price: t("home.expertises.audio.price"),
      link: "/solutions",
      color: "from-red-500/20 to-orange-500/20",
    },
    {
      icon: Wrench,
      title: t("home.expertises.custom.title"),
      description: t("home.expertises.custom.desc"),
      price: t("home.expertises.custom.price"),
      link: "chat",
      color: "from-slate-500/20 to-gray-500/20",
    },
  ];

  // 3 Value Pillars
  const pillars = [
    {
      icon: Zap,
      title: t("home.pillars.speed.title"),
      description: t("home.pillars.speed.desc"),
    },
    {
      icon: Sparkles,
      title: t("home.pillars.simplicity.title"),
      description: t("home.pillars.simplicity.desc"),
    },
    {
      icon: Heart,
      title: t("home.pillars.accessibility.title"),
      description: t("home.pillars.accessibility.desc"),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={t("seo.home.title")}
        description={t("seo.home.description")}
        canonical="/"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Botler 360",
          "applicationCategory": "BusinessApplication",
          "applicationSubCategory": "Chatbot IA conversationnel",
          "operatingSystem": "Web",
          "description": "Plateforme SaaS de chatbots IA pour entreprises. Assistant virtuel intelligent qui automatise votre relation client 24h/24.",
          "offers": {
            "@type": "AggregateOffer",
            "priceCurrency": "EUR",
            "lowPrice": "9",
            "highPrice": "49",
            "offerCount": "4",
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "ratingCount": "50",
            "bestRating": "5",
          },
          "featureList": "Chatbot IA multilingue, Installation 5 minutes, Qualification de prospects, Réservations automatiques, Intégration CRM, Support 24/7",
          "provider": {
            "@type": "Organization",
            "name": "Botler 360",
            "url": "https://botler360.com",
          },
        }}
      />
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        {/* Background - Dark mode */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(245,158,11,0.1)_0%,_transparent_50%)] dark:bg-[radial-gradient(ellipse_at_top_right,_rgba(245,158,11,0.15)_0%,_transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(20,184,166,0.08)_0%,_transparent_50%)] dark:bg-[radial-gradient(ellipse_at_bottom_left,_rgba(20,184,166,0.1)_0%,_transparent_50%)]" />
          <div className="absolute inset-0 bg-grid-pattern opacity-30 dark:opacity-20" />
        </div>

        <div className="relative container mx-auto px-4 py-20 lg:px-8 xl:px-12 2xl:px-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="space-y-8"
            >
              <motion.div variants={fadeInUp} className="space-y-4">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-amber-500 text-sm font-medium">
                  <Sparkles className="w-4 h-4" />
                  {t("home.hero.tagline")}
                </span>
                <h1 className="font-heading text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="text-foreground">{t("home.hero.title1")}</span>
                  <br />
                  <span className="text-gradient-gold">{t("home.hero.title2")}</span>
                  <br />
                  <span className="text-foreground">{t("home.hero.title3")}</span>
                </h1>
                <p className="text-base sm:text-xl text-muted-foreground max-w-xl">
                  {t("home.hero.description")}
                </p>
              </motion.div>

              {/* Feature Badges */}
              <motion.div
                variants={fadeInUp}
                className="grid grid-cols-2 gap-4"
              >
                {heroBadges.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-teal-500" />
                    <span className="text-sm text-foreground/80">{feature}</span>
                  </div>
                ))}
              </motion.div>

              {/* Trust Badges */}
              <motion.div
                variants={fadeInUp}
                className="flex flex-wrap gap-4"
              >
                {trustBadges.map((badge, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-4 py-2 glass-card rounded-lg"
                  >
                    <badge.icon className="w-4 h-4 text-amber-500" />
                    <span className="text-xs text-foreground/80">
                      {badge.text}
                    </span>
                  </div>
                ))}
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                variants={fadeInUp}
                className="flex flex-wrap gap-4"
              >
                <Link href="/demo">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-gold flex items-center gap-2"
                  >
                    {t("home.hero.cta1")}
                    <Play className="w-4 h-4" />
                  </motion.button>
                </Link>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={openChat}
                  className="btn-outline-gold flex items-center gap-2"
                >
                  {t("chat.button")}
                  <MessageSquare className="w-4 h-4" />
                </motion.button>
              </motion.div>

              {/* Stats Highlight */}
              <motion.div variants={fadeInUp} className="stat-card inline-block">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-gradient-gold">
                    {t("home.hero.stat")}
                  </span>
                  <span className="text-foreground/80">{t("home.hero.statLabel")}</span>
                </div>
                <span className="text-sm text-muted-foreground">{t("home.hero.statSub")}</span>
              </motion.div>
            </motion.div>

            {/* Right Content - Mascot */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative hidden lg:block"
            >
              <div className="relative">
                {/* Glow Effect - using protected class to prevent chatbot CSS override */}
                {/* Mascot Image */}
                <motion.img
                  animate={{ y: [0, -20, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  src="/images/ChatGPT_Image_Apr_11__2025__03_41_02_PM.png"
                  alt="Botler™ - Assistant virtuel"
                  className="relative w-full max-w-lg mx-auto drop-shadow-2xl"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Expertises Section - 6 Products */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-200/50 via-background to-slate-200/50 dark:from-slate-900/50 dark:via-background dark:to-slate-900/50">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(245,158,11,0.05)_0%,_transparent_60%)] dark:bg-[radial-gradient(ellipse_at_center,_rgba(245,158,11,0.08)_0%,_transparent_60%)]" />
        </div>

        <div className="relative container mx-auto px-4 lg:px-8 xl:px-12 2xl:px-16">
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
              {t("home.expertises.title1")}{" "}
              <span className="text-gradient-gold">{t("home.expertises.highlight")}</span> {t("home.expertises.title2")}
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-muted-foreground max-w-3xl mx-auto"
            >
              {t("home.expertises.description")}
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {expertises.map((expertise, index) => {
              const cardContent = (
                <motion.div
                  variants={fadeInUp}
                  className="group relative glass-card glass-card-hover rounded-2xl p-6 cursor-pointer h-full"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${expertise.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`}
                  />
                  <div className="relative">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-teal-500/20 flex items-center justify-center mb-4">
                      <expertise.icon className="w-7 h-7 text-amber-500" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      {expertise.title}
                    </h3>
                    <p className="text-muted-foreground mb-4 text-sm">
                      {expertise.description}
                    </p>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-amber-500">
                      {expertise.price}
                    </span>
                  </div>
                </motion.div>
              );
              return expertise.link === "chat" ? (
                <div key={index} onClick={openChat}>{cardContent}</div>
              ) : (
                <Link key={index} href={expertise.link}>{cardContent}</Link>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Value Pillars Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-slate-200/30 to-background dark:via-slate-900/30">
          <div className="absolute inset-0 bg-grid-pattern opacity-20 dark:opacity-10" />
        </div>

        <div className="relative container mx-auto px-4 lg:px-8 xl:px-12 2xl:px-16">
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
              {t("home.pillars.title1")}{" "}
              <span className="text-gradient-gold">{t("home.pillars.highlight")}</span> {t("home.pillars.title2")}
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            {pillars.map((pillar, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="glass-card rounded-2xl p-8 text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-teal-500/20 flex items-center justify-center mx-auto mb-6">
                  <pillar.icon className="w-8 h-8 text-amber-500" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">
                  {pillar.title}
                </h3>
                <p className="text-muted-foreground">{pillar.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-slate-900/50 to-background" />
        <div className="absolute inset-0 bg-radial-gradient" />

        <div className="relative container mx-auto px-4 lg:px-8 xl:px-12 2xl:px-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.h2
              variants={fadeInUp}
              className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6"
            >
              {t("home.stats.title1")} <span className="text-gradient-gold">80%</span> {t("home.stats.title2")}
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-muted-foreground mb-12"
            >
              {t("home.stats.description")}
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="glass-card rounded-2xl p-8 md:p-12"
            >
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                {t("home.stats.card.title1")} <span className="text-gradient-teal">60%</span> {t("home.stats.card.title2")}
              </h3>
              <p className="text-lg text-muted-foreground mb-6">
                {t("home.stats.card.description")}
              </p>
              <p className="text-amber-500 font-semibold text-lg">
                {t("home.stats.card.highlight")}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-200/50 via-background to-slate-200/50 dark:from-slate-900/50 dark:via-background dark:to-slate-900/50">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(245,158,11,0.05)_0%,_transparent_60%)] dark:bg-[radial-gradient(ellipse_at_center,_rgba(245,158,11,0.08)_0%,_transparent_60%)]" />
        </div>

        <div className="relative container mx-auto px-4 lg:px-8 xl:px-12 2xl:px-16">
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
              {t("home.features.title1")}{" "}
              <span className="text-gradient-gold">{t("home.features.highlight")}</span> {t("home.features.title2")}
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-muted-foreground max-w-3xl mx-auto"
            >
              {t("home.features.description")}
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="glass-card glass-card-hover rounded-2xl p-8 text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-teal-500/20 flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="w-8 h-8 text-amber-500" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Sectors Section */}
      <section id="sectors" className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-slate-200/30 to-background dark:via-slate-900/30">
          <div className="absolute inset-0 bg-grid-pattern opacity-20 dark:opacity-10" />
        </div>

        <div className="relative container mx-auto px-4 lg:px-8 xl:px-12 2xl:px-16">
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
              {t("home.sectors.title1")}{" "}
              <span className="text-gradient-gold">{t("home.sectors.highlight")}</span> {t("home.sectors.title2")}
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-muted-foreground max-w-3xl mx-auto"
            >
              {t("home.sectors.description")}
            </motion.p>
          </motion.div>

          {/* Demo Intro */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="flex flex-col md:flex-row items-center justify-center gap-8 mb-16"
          >
            <img
              src="/images/ChatGPT_Image_Apr_11__2025__03_41_02_PM.png"
              alt="Botler™"
              className="w-32 h-32 object-contain"
            />
            <div className="text-center md:text-left">
              <p className="text-xl text-foreground mb-4">
                {t("home.sectors.botlerSays")}
              </p>
              <Link href="/demo">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-gold"
                >
                  {t("home.hero.cta1")}
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* Sectors Grid */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {sectors.map((sector) => (
              <Link key={sector.id} href={`/demo/${sector.id}`}>
                <motion.div
                  id={sector.id}
                  variants={fadeInUp}
                  className="group relative glass-card glass-card-hover rounded-2xl overflow-hidden cursor-pointer"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${sector.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  />
                  <div className="relative p-6">
                    <div className="flex items-start gap-4">
                      <img
                        src={sector.image}
                        alt={sector.name}
                        className="w-20 h-20 object-contain rounded-xl"
                      />
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-foreground mb-2">
                          {sector.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {sector.description}
                        </p>
                        <span className="inline-flex items-center gap-1 text-sm font-semibold text-amber-500">
                          {sector.stats}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-slate-200/30 to-background dark:via-slate-900/30" />

        <div className="relative container mx-auto px-4 lg:px-8 xl:px-12 2xl:px-16">
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
              {t("home.testimonials.title1")} <span className="text-gradient-gold">{t("home.testimonials.highlight")}</span>{" "}
              {t("home.testimonials.title2")}
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-muted-foreground"
            >
              {t("home.testimonials.description")}
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="glass-card rounded-2xl p-8"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-amber-500 text-amber-500"
                    />
                  ))}
                </div>
                <p className="text-foreground/90 mb-6 italic">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-foreground">
                      {testimonial.author}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.sector}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-teal-500">
                    {testimonial.stat}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-background to-teal-500/5 dark:from-amber-500/10 dark:to-teal-500/10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(245,158,11,0.1)_0%,_transparent_50%)] dark:bg-[radial-gradient(ellipse_at_center,_rgba(245,158,11,0.15)_0%,_transparent_50%)]" />
        </div>

        <div className="relative container mx-auto px-4 lg:px-8 xl:px-12 2xl:px-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.h2
              variants={fadeInUp}
              className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6"
            >
              {t("cta.title1")}{" "}
              <span className="text-gradient-gold">{t("cta.highlight")}</span> {t("cta.title2")}
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-muted-foreground mb-8"
            >
              {t("cta.description")}
            </motion.p>
            <motion.div variants={fadeInUp}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={openChat}
                className="btn-gold text-lg px-8 py-4 animate-pulse-glow"
              >
                {t("chat.button")}
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
