/*
 * Reusable Sector Page Component
 * Used by all 6 sector pages: Tourisme, Viticulture, Restaurants, Boulangerie, Immobilier, Hebergements
 */

import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  CheckCircle,
  Play,
  Star,
  MessageSquare,
  TrendingUp,
  Clock,
  Users,
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

interface SectorPageProps {
  sectorId: string;
  heroImage: string;
  videoSrc?: string;
}

export default function SectorPage({ sectorId, heroImage, videoSrc }: SectorPageProps) {
  const { t } = useLanguage();
  const { openChat } = useChat();

  const challenges = [
    t(`sector.${sectorId}.challenge1`),
    t(`sector.${sectorId}.challenge2`),
    t(`sector.${sectorId}.challenge3`),
  ];

  const solutions = [
    {
      icon: MessageSquare,
      title: t(`sector.${sectorId}.solution1.title`),
      description: t(`sector.${sectorId}.solution1.desc`),
    },
    {
      icon: Clock,
      title: t(`sector.${sectorId}.solution2.title`),
      description: t(`sector.${sectorId}.solution2.desc`),
    },
    {
      icon: TrendingUp,
      title: t(`sector.${sectorId}.solution3.title`),
      description: t(`sector.${sectorId}.solution3.desc`),
    },
  ];

  const stats = [
    { value: t(`sector.${sectorId}.stat1.value`), label: t(`sector.${sectorId}.stat1.label`) },
    { value: t(`sector.${sectorId}.stat2.value`), label: t(`sector.${sectorId}.stat2.label`) },
    { value: t(`sector.${sectorId}.stat3.value`), label: t(`sector.${sectorId}.stat3.label`) },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title={t(`seo.sector.${sectorId}.title`)} description={t(`seo.sector.${sectorId}.description`)} canonical={`/demo/${sectorId}`} />
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent dark:from-amber-500/10" />
        <div className="absolute inset-0 bg-grid-pattern opacity-30 dark:opacity-20" />

        <div className="relative container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.span
                variants={fadeInUp}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-amber-500 text-sm font-medium mb-6"
              >
                <Star className="w-4 h-4" />
                {t(`sector.${sectorId}.badge`)}
              </motion.span>
              <motion.h1
                variants={fadeInUp}
                className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6"
              >
                {t(`sector.${sectorId}.title1`)}{" "}
                <span className="text-gradient-gold">{t(`sector.${sectorId}.highlight`)}</span>
              </motion.h1>
              <motion.p
                variants={fadeInUp}
                className="text-xl text-muted-foreground mb-8"
              >
                {t(`sector.${sectorId}.description`)}
              </motion.p>
              <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
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
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              <img
                src={heroImage}
                alt={t(`sector.${sectorId}.title1`)}
                className="w-full max-w-lg mx-auto rounded-2xl shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Challenges Section */}
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
              {t(`sector.${sectorId}.challenges.title1`)}{" "}
              <span className="text-gradient-gold">{t(`sector.${sectorId}.challenges.highlight`)}</span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-muted-foreground max-w-3xl mx-auto"
            >
              {t(`sector.${sectorId}.challenges.description`)}
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            {challenges.map((challenge, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="glass-card rounded-2xl p-6"
              >
                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
                  <span className="text-red-500 font-bold">{index + 1}</span>
                </div>
                <p className="text-foreground">{challenge}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Solutions Section */}
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
              {t(`sector.${sectorId}.solutions.title1`)}{" "}
              <span className="text-gradient-gold">{t(`sector.${sectorId}.solutions.highlight`)}</span>
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8"
          >
            {solutions.map((solution, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="glass-card glass-card-hover rounded-2xl p-8 text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-teal-500/20 flex items-center justify-center mx-auto mb-6">
                  <solution.icon className="w-8 h-8 text-amber-500" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">
                  {solution.title}
                </h3>
                <p className="text-muted-foreground">{solution.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="text-center"
              >
                <span className="text-5xl font-bold text-gradient-gold">
                  {stat.value}
                </span>
                <p className="text-muted-foreground mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Video Section (if available) */}
      {videoSrc && (
        <section className="py-24 bg-gradient-to-b from-background to-slate-200/50 dark:to-slate-900/50">
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
                {t(`sector.${sectorId}.video.title`)}
              </motion.h2>
            </motion.div>
            <motion.div
              variants={fadeInUp}
              className="max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl"
            >
              <video
                controls
                className="w-full"
                poster={heroImage}
              >
                <source src={videoSrc} type="video/mp4" />
              </video>
            </motion.div>
          </div>
        </section>
      )}

      {/* Testimonial Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="glass-card rounded-3xl p-12 max-w-4xl mx-auto text-center"
          >
            <div className="flex justify-center gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-6 h-6 fill-amber-500 text-amber-500"
                />
              ))}
            </div>
            <p className="text-xl text-foreground/90 mb-6 italic">
              "{t(`sector.${sectorId}.testimonial.text`)}"
            </p>
            <div>
              <p className="font-semibold text-foreground">
                {t(`sector.${sectorId}.testimonial.author`)}
              </p>
              <p className="text-sm text-muted-foreground">
                {t(`sector.${sectorId}.testimonial.role`)}
              </p>
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
            className="relative glass-card rounded-3xl p-12 text-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-teal-500/10" />
            <div className="relative">
              <motion.h2
                variants={fadeInUp}
                className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6"
              >
                {t("cta.title1")}{" "}
                <span className="text-gradient-gold">{t("cta.highlight")}</span> {t("cta.title2")}
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
