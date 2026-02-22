/*
 * Design: Botler360 - Mentions Legales Page
 * - Supports both light and dark modes
 * - Glass morphism styling
 * - Framer Motion scroll animations
 * - French legal text (not translated)
 */

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
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

export default function MentionsLegales() {
  const { t } = useLanguage();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Mentions Légales" description="Mentions légales de Botler 360 — éditeur, hébergeur, propriété intellectuelle et responsabilité." canonical="/mentions-legales" noindex />
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
              {t("legal.mentions.title")}
            </motion.h1>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl space-y-8">

          {/* Editeur du site */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="glass-card rounded-2xl p-8"
          >
            <h2 className="text-2xl font-bold text-foreground mb-4">
              {t("legal.mentions.editor.title")}
            </h2>
            <div className="text-muted-foreground space-y-2">
              <p>
                Le site <strong className="text-foreground">botler360.com</strong> est
                edite par <strong className="text-foreground">Botler 360</strong>, marque
                commerciale de <strong className="text-foreground">Best of Tours Ltd</strong>.
              </p>
              <p>Siege social : 44 chemin de Provence, 84320 Entraigues-sur-la-Sorgue, France.</p>
              <p>Email : <a href="mailto:contact@botler360.com" className="text-amber-500 hover:underline">contact@botler360.com</a></p>
              <p>Telephone : <a href="tel:+33186260390" className="text-amber-500 hover:underline">01 86 26 03 90</a></p>
              <p>Directeur de la publication : <strong className="text-foreground">Yacine Bakouche</strong></p>
            </div>
          </motion.div>

          {/* Hebergeur */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="glass-card rounded-2xl p-8"
          >
            <h2 className="text-2xl font-bold text-foreground mb-4">
              {t("legal.mentions.host.title")}
            </h2>
            <div className="text-muted-foreground space-y-2">
              <p>
                Le site est heberge par Google Cloud Platform (Google LLC), 1600 Amphitheatre
                Parkway, Mountain View, CA 94043, Etats-Unis.
              </p>
            </div>
          </motion.div>

          {/* Propriete intellectuelle */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="glass-card rounded-2xl p-8"
          >
            <h2 className="text-2xl font-bold text-foreground mb-4">
              {t("legal.mentions.ip.title")}
            </h2>
            <div className="text-muted-foreground space-y-2">
              <p>
                L'ensemble du contenu de ce site (textes, images, logos, icones, logiciels,
                base de donnees, design, architecture) est la propriete exclusive de Botler 360 /
                Best of Tours Ltd ou de ses partenaires et est protege par les lois francaises
                et internationales relatives a la propriete intellectuelle.
              </p>
              <p>
                Toute reproduction, representation, modification, publication, transmission,
                denaturation, totale ou partielle du site ou de son contenu, par quelque
                procede que ce soit, et sur quelque support que ce soit est interdite sans
                l'autorisation ecrite prealable de Botler 360.
              </p>
              <p>
                Toute exploitation non autorisee du site ou de son contenu, des informations
                qui y sont divulguees, engagerait la responsabilite de l'utilisateur et
                constituerait une contrefacon sanctionnee par les articles L.335-2 et suivants
                du Code de la Propriete Intellectuelle.
              </p>
            </div>
          </motion.div>

          {/* Responsabilite */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="glass-card rounded-2xl p-8"
          >
            <h2 className="text-2xl font-bold text-foreground mb-4">
              {t("legal.mentions.liability.title")}
            </h2>
            <div className="text-muted-foreground space-y-2">
              <p>
                Botler 360 s'efforce d'assurer au mieux l'exactitude et la mise a jour des
                informations diffusees sur ce site, dont elle se reserve le droit de modifier
                le contenu a tout moment et sans preavis. Botler 360 ne peut cependant garantir
                l'exactitude, la precision ou l'exhaustivite des informations mises a
                disposition sur ce site.
              </p>
              <p>
                En consequence, Botler 360 decline toute responsabilite pour toute imprecision,
                inexactitude ou omission portant sur des informations disponibles sur ce site,
                ainsi que pour tous dommages resultant d'une intrusion frauduleuse d'un tiers
                ayant entraine une modification des informations mises a disposition sur le site.
              </p>
              <p>
                Botler 360 ne saurait etre tenue responsable de tout dommage direct ou indirect
                resultant de l'utilisation de ce site ou des sites qui lui sont lies.
              </p>
            </div>
          </motion.div>

          {/* Donnees personnelles */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="glass-card rounded-2xl p-8"
          >
            <h2 className="text-2xl font-bold text-foreground mb-4">
              {t("legal.mentions.data.title")}
            </h2>
            <div className="text-muted-foreground space-y-2">
              <p>
                Conformement au Reglement General sur la Protection des Donnees (RGPD) et a la
                loi Informatique et Libertes, vous disposez de droits sur vos donnees
                personnelles. Pour en savoir plus sur la collecte et le traitement de vos
                donnees, veuillez consulter notre{" "}
                <Link
                  href="/politique-confidentialite"
                  className="text-amber-500 hover:underline font-medium"
                >
                  Politique de Confidentialite
                </Link>.
              </p>
            </div>
          </motion.div>

          {/* Droit applicable */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="glass-card rounded-2xl p-8"
          >
            <h2 className="text-2xl font-bold text-foreground mb-4">
              {t("legal.mentions.law.title")}
            </h2>
            <div className="text-muted-foreground space-y-2">
              <p>
                Les presentes mentions legales sont regies par le droit francais. En cas de
                litige, et apres tentative de recherche d'une solution amiable, competence
                expresse est attribuee au Tribunal de Commerce d'Avignon, nonobstant pluralite
                de defendeurs ou appel en garantie.
              </p>
            </div>
          </motion.div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
