/*
 * Design: Botler360 - Elegant Professional Theme
 * - Supports both light and dark modes
 * - Demo videos for each sector and product
 * - Glass morphism video cards
 * - URL-based sector/product selection
 * - Dual category navigation (Sectors & Products)
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useParams } from "wouter";
import { Play, ArrowRight, Users, Clock, Star, Briefcase, ShoppingBag } from "lucide-react";
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

type DemoCategory = "sectors" | "products";

interface Demo {
  id: string;
  name: string;
  description: string;
  video: string;
  image: string;
  features: string[];
  category: DemoCategory;
}

const getSectorDemos = (t: (key: string) => string): Demo[] => [
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
    category: "sectors",
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
    category: "sectors",
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
    category: "sectors",
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
    category: "sectors",
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
    category: "sectors",
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
    category: "sectors",
  },
];

const getProductDemos = (t: (key: string) => string): Demo[] => [
  {
    id: "websites",
    name: t("demo.websites.name"),
    description: t("demo.websites.fullDescription"),
    video: "/videos/botler-demo-video.mp4",
    image: "/images/botler-logo-full.png",
    features: [
      t("demo.websites.feature1"),
      t("demo.websites.feature2"),
      t("demo.websites.feature3"),
      t("demo.websites.feature4"),
    ],
    category: "products",
  },
  {
    id: "ecommerce",
    name: t("demo.ecommerce.name"),
    description: t("demo.ecommerce.description"),
    video: "/videos/botler-demo-video.mp4",
    image: "/images/botler_demo.png",
    features: [
      t("demo.ecommerce.feature1"),
      t("demo.ecommerce.feature2"),
      t("demo.ecommerce.feature3"),
      t("demo.ecommerce.feature4"),
    ],
    category: "products",
  },
];

export default function Demo() {
  const { t } = useLanguage();
  const { openChat } = useChat();
  const params = useParams<{ sector?: string }>();

  const sectorDemos = getSectorDemos(t);
  const productDemos = getProductDemos(t);
  const allDemos = [...sectorDemos, ...productDemos];

  // Determine active category and demo based on URL params
  const getInitialState = () => {
    if (params.sector) {
      const foundDemo = allDemos.find((d) => d.id === params.sector);
      if (foundDemo) {
        return {
          category: foundDemo.category,
          demo: foundDemo,
        };
      }
    }
    return {
      category: "sectors" as DemoCategory,
      demo: sectorDemos[0],
    };
  };

  const [activeCategory, setActiveCategory] = useState<DemoCategory>(getInitialState().category);
  const [activeDemo, setActiveDemo] = useState<Demo>(getInitialState().demo);
  const [isPlaying, setIsPlaying] = useState(false);

  // Update active demo when URL sector changes
  useEffect(() => {
    const currentSectorDemos = getSectorDemos(t);
    const currentProductDemos = getProductDemos(t);
    const currentAllDemos = [...currentSectorDemos, ...currentProductDemos];

    if (params.sector) {
      const foundDemo = currentAllDemos.find((d) => d.id === params.sector);
      if (foundDemo) {
        setActiveDemo(foundDemo);
        setActiveCategory(foundDemo.category);
        setIsPlaying(false);
      }
    } else {
      setActiveDemo(currentSectorDemos[0]);
      setActiveCategory("sectors");
    }
  }, [params.sector, t]);

  // Update demos when language changes
  useEffect(() => {
    const updatedSectorDemos = getSectorDemos(t);
    const updatedProductDemos = getProductDemos(t);
    const updatedAllDemos = [...updatedSectorDemos, ...updatedProductDemos];
    const currentDemo = updatedAllDemos.find((d) => d.id === activeDemo.id);
    if (currentDemo) {
      setActiveDemo(currentDemo);
    }
  }, [t]);

  const currentDemos = activeCategory === "sectors" ? sectorDemos : productDemos;

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title={t("seo.demo.title")} description={t("seo.demo.description")} canonical="/demo" />
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
            className="grid grid-cols-3 gap-8 mt-16 max-w-3xl mx-auto"
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

      {/* Category Selector */}
      <section className="py-4">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex justify-center gap-4 mb-8"
          >
            <motion.button
              variants={fadeInUp}
              onClick={() => {
                setActiveCategory("sectors");
                setActiveDemo(sectorDemos[0]);
              }}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                activeCategory === "sectors"
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900"
                  : "glass-card text-foreground/80 hover:text-amber-500"
              }`}
            >
              <Briefcase className="w-5 h-5" />
              {t("demo.categorySectors")}
            </motion.button>
            <motion.button
              variants={fadeInUp}
              onClick={() => {
                setActiveCategory("products");
                setActiveDemo(productDemos[0]);
              }}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                activeCategory === "products"
                  ? "bg-gradient-to-r from-teal-500 to-teal-600 text-slate-900"
                  : "glass-card text-foreground/80 hover:text-teal-500"
              }`}
            >
              <ShoppingBag className="w-5 h-5" />
              {t("demo.categoryProducts")}
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Demo Selector */}
      <section className="py-4">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-wrap justify-center gap-3"
          >
            {currentDemos.map((demo) => (
              <Link key={demo.id} href={`/demo/${demo.id}`}>
                <motion.button
                  variants={fadeInUp}
                  className={`px-6 py-3 rounded-xl font-medium transition-all ${
                    activeDemo.id === demo.id
                      ? activeCategory === "sectors"
                        ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900"
                        : "bg-gradient-to-r from-teal-500 to-teal-600 text-slate-900"
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
            className="grid lg:grid-cols-2 gap-12 items-center"
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
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setIsPlaying(true)}
                          className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg ${
                            activeCategory === "sectors"
                              ? "bg-gradient-to-r from-amber-500 to-amber-600 shadow-amber-500/30"
                              : "bg-gradient-to-r from-teal-500 to-teal-600 shadow-teal-500/30"
                          }`}
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
                  className="w-16 h-16 object-contain"
                />
                <div>
                  <h2 className="font-heading text-3xl font-bold text-foreground">
                    {activeCategory === "sectors" ? (
                      <>Botler™ <span className="text-gradient-gold">{activeDemo.name}</span></>
                    ) : (
                      <span className={activeCategory === "products" ? "text-gradient-teal" : "text-gradient-gold"}>
                        {activeDemo.name}
                      </span>
                    )}
                  </h2>
                  <p className="text-muted-foreground">
                    {activeCategory === "sectors" ? "Expert" : t("demo.productLabel")}
                  </p>
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
                      <div className={`w-2 h-2 rounded-full ${
                        activeCategory === "sectors" ? "bg-amber-500" : "bg-teal-500"
                      }`} />
                      <span className="text-foreground/80">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={openChat}
                  className={activeCategory === "sectors" ? "btn-gold flex items-center gap-2" : "btn-teal flex items-center gap-2"}
                >
                  {t("nav.contact")}
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
                {activeCategory === "products" && activeDemo.id === "websites" && (
                  <Link href="/websites">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn-outline-teal flex items-center gap-2"
                    >
                      {t("demo.learnMore")}
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </Link>
                )}
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
              {activeCategory === "sectors"
                ? <>{t("demo.allSectorDemos")} <span className="text-gradient-gold">{t("demo.highlight")}</span></>
                : <>{t("demo.allProductDemos")} <span className="text-gradient-teal">{t("demo.highlight")}</span></>
              }
            </motion.h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentDemos.map((demo) => (
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
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          activeCategory === "sectors" ? "bg-amber-500/90" : "bg-teal-500/90"
                        }`}>
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
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={openChat}
                className="btn-gold text-lg px-8 py-4"
              >
                {t("cta.button")}
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
