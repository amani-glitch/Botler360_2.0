/*
 * Design: Botler360 - Elegant Professional Theme
 * - Supports both light and dark modes
 * - Demo videos for each sector
 * - Glass morphism video cards
 * - URL-based sector selection
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useParams } from "wouter";
import { Play, ArrowRight, Users, Clock, Star } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import ChatWidget from "@/components/ChatWidget";

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

const getDemos = (t: (key: string) => string) => [
  {
    id: "tourisme",
    name: t("demo.tourism.name"),
    description: t("demo.tourism.description"),
    video: "/videos/botler-tourisme-video.mp4",
    image: "/images/Botler_pour_vos_voyageurs.__4_.png",
    features: [
      t("demo.tourism.feature1"),
      t("demo.tourism.feature2"),
      t("demo.tourism.feature3"),
    ],
  },
  {
    id: "viticulture",
    name: t("demo.viticulture.name"),
    description: t("demo.viticulture.description"),
    video: "/videos/botler-viticulture-video.mp4",
    image: "/images/Botler_pour_vos_voyageurs.__7_.png",
    features: [
      t("demo.viticulture.feature1"),
      t("demo.viticulture.feature2"),
      t("demo.viticulture.feature3"),
    ],
  },
  {
    id: "restaurants",
    name: t("demo.restaurants.name"),
    description: t("demo.restaurants.description"),
    video: "/videos/botler-demo-video.mp4",
    image: "/images/accueil_resto.png",
    features: [
      t("demo.restaurants.feature1"),
      t("demo.restaurants.feature2"),
      t("demo.restaurants.feature3"),
    ],
  },
  {
    id: "boulangerie",
    name: t("demo.bakery.name"),
    description: t("demo.bakery.description"),
    video: "/videos/botler-demo-video.mp4",
    image: "/images/accueil_Boulangerie.png",
    features: [
      t("demo.bakery.feature1"),
      t("demo.bakery.feature2"),
      t("demo.bakery.feature3"),
    ],
  },
  {
    id: "immobilier",
    name: t("demo.realEstate.name"),
    description: t("demo.realEstate.description"),
    video: "/videos/botler-demo-video.mp4",
    image: "/images/Botler_pour_vos_voyageurs.__17_.png",
    features: [
      t("demo.realEstate.feature1"),
      t("demo.realEstate.feature2"),
      t("demo.realEstate.feature3"),
    ],
  },
  {
    id: "hebergements",
    name: t("demo.accommodation.name"),
    description: t("demo.accommodation.description"),
    video: "/videos/botler-demo-video.mp4",
    image: "/images/merci_heberg.png",
    features: [
      t("demo.accommodation.feature1"),
      t("demo.accommodation.feature2"),
      t("demo.accommodation.feature3"),
    ],
  },
  {
    id: "boutiques",
    name: t("demo.boutiques.name"),
    description: t("demo.boutiques.description"),
    video: "/videos/botler-demo-video.mp4",
    image: "/images/botler_demo.png",
    features: [
      t("demo.boutiques.feature1"),
      t("demo.boutiques.feature2"),
      t("demo.boutiques.feature3"),
    ],
  },
  {
    id: "websites",
    name: t("demo.websites.name"),
    description: t("demo.websites.description"),
    video: "/videos/botler-demo-video.mp4",
    image: "/images/botler-logo-full.png",
    features: [
      t("demo.websites.feature1"),
      t("demo.websites.feature2"),
      t("demo.websites.feature3"),
    ],
  },
];

export default function Demo() {
  const { t } = useLanguage();
  const params = useParams<{ sector?: string }>();
  const demos = getDemos(t);
  
  // Initialize with the correct demo based on URL params
  const getInitialDemo = () => {
    if (params.sector) {
      const found = demos.find((d) => d.id === params.sector);
      return found || demos[0];
    }
    return demos[0];
  };
  
  const [activeDemo, setActiveDemo] = useState(getInitialDemo);
  const [isPlaying, setIsPlaying] = useState(false);

  // Update active demo when URL sector changes
  useEffect(() => {
    const currentDemos = getDemos(t);
    if (params.sector) {
      const foundDemo = currentDemos.find((d) => d.id === params.sector);
      if (foundDemo) {
        setActiveDemo(foundDemo);
        setIsPlaying(false);
      }
    } else {
      setActiveDemo(currentDemos[0]);
    }
  }, [params.sector, t]);

  // Update demos when language changes
  useEffect(() => {
    const updatedDemos = getDemos(t);
    const currentDemo = updatedDemos.find((d) => d.id === activeDemo.id);
    if (currentDemo) {
      setActiveDemo(currentDemo);
    }
  }, [t]);

  return (
    <div className="min-h-screen bg-background">
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
              {t("demo.title1")} <span className="text-gradient-gold">{t("demo.highlight")}</span>
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-muted-foreground"
            >
              {t("demo.description")}
            </motion.p>
          </motion.div>

          {/* Statistics */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 mt-12 sm:mt-16 max-w-3xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Users className="w-6 h-6 text-amber-500" />
                <span className="text-3xl font-bold text-gradient-gold">+500</span>
              </div>
              <p className="text-sm text-muted-foreground">{t("demo.stats.clients")}</p>
            </motion.div>
            <motion.div variants={fadeInUp} className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="w-6 h-6 text-teal-500" />
                <span className="text-3xl font-bold text-gradient-teal">+10,000h</span>
              </div>
              <p className="text-sm text-muted-foreground">{t("demo.stats.hours")}</p>
            </motion.div>
            <motion.div variants={fadeInUp} className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Star className="w-6 h-6 text-amber-500" />
                <span className="text-3xl font-bold text-gradient-gold">92%</span>
              </div>
              <p className="text-sm text-muted-foreground">{t("demo.stats.satisfaction")}</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Demo Selector */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-wrap justify-center gap-3"
          >
            {demos.map((demo) => (
              <Link key={demo.id} href={`/demo/${demo.id}`}>
                <motion.button
                  variants={fadeInUp}
                  className={`min-h-[44px] inline-flex items-center px-5 sm:px-6 py-3 rounded-xl font-medium text-sm sm:text-base transition-all ${
                    activeDemo.id === demo.id
                      ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900"
                      : "glass-card text-foreground/80 hover:text-amber-500"
                  }`}
                >
                  {demo.name}
                </motion.button>
              </Link>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Active Demo Display */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            key={activeDemo.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-center"
          >
            {/* Video Player */}
            <div className="relative">
              <div className="glass-card rounded-2xl overflow-hidden">
                <div className="relative aspect-video bg-slate-900">
                  {isPlaying ? (
                    <video
                      src={activeDemo.video}
                      autoPlay
                      controls
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <>
                      <img
                        src={activeDemo.image}
                        alt={activeDemo.name}
                        className="w-full h-full object-contain p-8"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setIsPlaying(true)}
                          className="w-20 h-20 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30"
                        >
                          <Play className="w-8 h-8 text-slate-900 ml-1" />
                        </motion.button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Demo Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <img
                  src={activeDemo.image}
                  alt={activeDemo.name}
                  className="w-12 sm:w-16 h-12 sm:h-16 object-contain"
                  loading="lazy"
                  decoding="async"
                  width="64"
                  height="64"
                />
                <div>
                  <h2 className="font-heading text-3xl font-bold text-foreground">
                    Botler™ <span className="text-gradient-gold">{activeDemo.name}</span>
                  </h2>
                  <p className="text-muted-foreground">Expert</p>
                </div>
              </div>

              <p className="text-lg text-foreground/80">
                {activeDemo.description}
              </p>

              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">{t("demo.features")} :</h3>
                <ul className="space-y-2">
                  {activeDemo.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-amber-500" />
                      <span className="text-foreground/80">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <Link href="/contact">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-gold flex items-center gap-2"
                  >
                    {t("nav.contact")}
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* All Demos Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2
              variants={fadeInUp}
              className="font-heading text-2xl font-bold text-foreground text-center mb-12"
            >
              {t("demo.title1")} <span className="text-gradient-gold">{t("demo.highlight")}</span>
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {demos.map((demo) => (
                <Link key={demo.id} href={`/demo/${demo.id}`}>
                  <motion.div
                    variants={fadeInUp}
                    className="glass-card glass-card-hover rounded-2xl overflow-hidden cursor-pointer"
                  >
                    <div className="relative aspect-video bg-slate-900/50">
                      <img
                        src={demo.image}
                        alt={demo.name}
                        className="w-full h-full object-contain p-4"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <div className="w-12 h-12 rounded-full bg-amber-500/90 flex items-center justify-center">
                          <Play className="w-5 h-5 text-slate-900 ml-0.5" />
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-foreground mb-2">
                        {demo.name}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {demo.description}
                      </p>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Live inline chatbots — V3 Glass Daylight */}
      <section className="py-16 bg-botler-demo-inline">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2
              variants={fadeInUp}
              className="font-heading text-2xl md:text-3xl font-bold text-foreground text-center mb-4"
            >
              Essayez nos <span className="text-gradient-gold">chatbots</span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto"
            >
              Discutez en direct avec nos assistants sectoriels — Tourisme, Viticulture, Restaurants.
            </motion.p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 justify-items-center">
              <ChatWidget
                mode="inline"
                containerId="bc-inline-tourisme"
                theme="tourisme"
                avatar="/mascots/tourisme.png"
                greeting={{ title: "Bonjour 👋", body: "Je suis votre concierge virtuel. Quelle destination vous fait rêver ?" }}
                quickReplies={["✈️ Séjour sur-mesure", "🏨 Réserver un hôtel", "🗺️ Activités locales", "🌍 Multilingue"]}
              />
              <ChatWidget
                mode="inline"
                containerId="bc-inline-viticulture"
                theme="viticulture"
                avatar="/mascots/viticulture.png"
                greeting={{ title: "Bonsoir.", body: "Votre sommelier virtuel est à votre service." }}
                quickReplies={["🍇 Accords mets-vins", "🍾 Nos cuvées", "📅 Réserver une visite"]}
              />
              <ChatWidget
                mode="inline"
                containerId="bc-inline-restaurants"
                theme="restaurants"
                avatar="/mascots/restaurants.png"
                greeting={{ title: "Bienvenue.", body: "Je vous présente notre carte et prends vos réservations." }}
                quickReplies={["📖 Voir la carte", "🕐 Réserver une table", "🌱 Options végé", "⚠️ Allergènes"]}
              />
            </div>
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
            className="glass-card rounded-3xl p-12 text-center"
          >
            <motion.h2
              variants={fadeInUp}
              className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6"
            >
              {t("cta.title1")} <span className="text-gradient-gold">{t("cta.highlight")}</span> {t("cta.title2")}
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
            >
              {t("cta.description")}
            </motion.p>
            <motion.div variants={fadeInUp}>
              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-gold text-lg px-8 py-4"
                >
                  {t("cta.button")}
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
