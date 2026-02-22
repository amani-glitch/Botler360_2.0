/*
 * Design: Botler360 - Conditions Generales de Vente (CGV) Page
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

export default function CGV() {
  const { t } = useLanguage();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Conditions Générales de Vente" description="Conditions générales de vente de Botler 360 — services, tarifs, paiement, résiliation et responsabilité." canonical="/cgv" noindex />
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
              {t("legal.cgv.title")}
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-muted-foreground"
            >
              Date de derniere mise a jour : 20 fevrier 2026
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl space-y-8">

          {/* Article 1 - Objet */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="glass-card rounded-2xl p-8"
          >
            <h2 className="text-2xl font-bold text-foreground mb-4">
              {t("legal.cgv.article1.title")}
            </h2>
            <div className="text-muted-foreground space-y-2">
              <p>
                Les presentes Conditions Generales de Vente (ci-apres "CGV") regissent les
                relations contractuelles entre <strong className="text-foreground">Botler 360</strong>,
                marque commerciale de <strong className="text-foreground">Best of Tours Ltd</strong>,
                dont le siege social est situe au 44 chemin de Provence, 84320
                Entraigues-sur-la-Sorgue, France (ci-apres "le Prestataire"), et toute personne
                physique ou morale souhaitant beneficier de ses services (ci-apres "le Client").
              </p>
              <p>
                Toute commande de services implique l'acceptation sans reserve par le Client des
                presentes CGV.
              </p>
            </div>
          </motion.div>

          {/* Article 2 - Acceptation des conditions */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="glass-card rounded-2xl p-8"
          >
            <h2 className="text-2xl font-bold text-foreground mb-4">
              {t("legal.cgv.article2.title")}
            </h2>
            <div className="text-muted-foreground space-y-2">
              <p>
                Le Client reconnait avoir pris connaissance des presentes CGV avant toute
                commande et les accepte sans reserve. Le Prestataire se reserve le droit de
                modifier les presentes CGV a tout moment. Les CGV applicables sont celles en
                vigueur a la date de la commande.
              </p>
              <p>
                L'acceptation des CGV se materialise par la validation de la commande en ligne,
                la signature d'un devis ou le paiement d'une facture.
              </p>
            </div>
          </motion.div>

          {/* Article 3 - Description des services */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="glass-card rounded-2xl p-8"
          >
            <h2 className="text-2xl font-bold text-foreground mb-4">
              {t("legal.cgv.article3.title")}
            </h2>
            <div className="text-muted-foreground space-y-2">
              <p>
                Botler 360 propose les services suivants :
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  <strong className="text-foreground">Chatbots IA</strong> : conception,
                  developpement et deploiement de chatbots intelligents personnalises, integres
                  aux sites web du Client, avec gestion conversationnelle avancee et
                  qualification de prospects.
                </li>
                <li>
                  <strong className="text-foreground">Conception de sites web</strong> :
                  creation de sites web professionnels (vitrines, landing pages), incluant le
                  design, le developpement, l'hebergement et l'optimisation SEO de base.
                </li>
                <li>
                  <strong className="text-foreground">Applications mobiles</strong> :
                  developpement d'applications mobiles sur mesure (iOS et Android) adaptees aux
                  besoins du Client.
                </li>
                <li>
                  <strong className="text-foreground">Optimisation IA</strong> : conseil et
                  integration de solutions d'intelligence artificielle pour l'amelioration des
                  processus metier du Client.
                </li>
              </ul>
              <p>
                Les caracteristiques detaillees de chaque service sont decrites dans les fiches
                produits disponibles sur le site botler360.com et/ou dans le devis adresse au
                Client.
              </p>
            </div>
          </motion.div>

          {/* Article 4 - Tarifs et paiement */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="glass-card rounded-2xl p-8"
          >
            <h2 className="text-2xl font-bold text-foreground mb-4">
              {t("legal.cgv.article4.title")}
            </h2>
            <div className="text-muted-foreground space-y-2">
              <p>
                Les tarifs des services sont indiques en euros et hors taxes (HT), sauf mention
                contraire. La TVA applicable sera ajoutee au montant HT.
              </p>
              <p>
                <strong className="text-foreground">Abonnements chatbots :</strong> les
                abonnements sont factures mensuellement. Le paiement est du au debut de chaque
                periode mensuelle. Des frais de mise en service (setup fees) peuvent s'appliquer
                selon le pack choisi.
              </p>
              <p>
                <strong className="text-foreground">Sites web et applications :</strong> le
                paiement s'effectue selon les modalites definies dans le devis (acompte a la
                commande, solde a la livraison).
              </p>
              <p>
                Les factures sont payables sous 30 jours a compter de la date d'emission, sauf
                conditions particulieres convenues par ecrit. En cas de retard de paiement, des
                penalites de retard seront appliquees au taux annuel de 3 fois le taux d'interet
                legal en vigueur, ainsi qu'une indemnite forfaitaire de 40 euros pour frais de
                recouvrement (article L.441-10 du Code de Commerce).
              </p>
            </div>
          </motion.div>

          {/* Article 5 - Duree et resiliation */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="glass-card rounded-2xl p-8"
          >
            <h2 className="text-2xl font-bold text-foreground mb-4">
              {t("legal.cgv.article5.title")}
            </h2>
            <div className="text-muted-foreground space-y-2">
              <p>
                <strong className="text-foreground">Abonnements :</strong> les abonnements aux
                services de chatbots sont souscrits pour une duree minimale de 3 mois. Au-dela
                de cette periode initiale, l'abonnement se renouvelle tacitement chaque mois.
              </p>
              <p>
                <strong className="text-foreground">Resiliation :</strong> le Client peut
                resilier son abonnement a tout moment apres la periode d'engagement minimale,
                moyennant un preavis de 30 jours. La resiliation doit etre notifiee par email
                a contact@botler360.com ou depuis l'espace client.
              </p>
              <p>
                Le Prestataire se reserve le droit de resilier le contrat de plein droit, sans
                preavis ni indemnite, en cas de manquement grave du Client a ses obligations,
                et notamment en cas de non-paiement.
              </p>
              <p>
                En cas de resiliation, les sommes deja versees ne sont pas remboursables, sauf
                dispositions contraires prevues dans les presentes CGV.
              </p>
            </div>
          </motion.div>

          {/* Article 6 - Propriete intellectuelle */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="glass-card rounded-2xl p-8"
          >
            <h2 className="text-2xl font-bold text-foreground mb-4">
              {t("legal.cgv.article6.title")}
            </h2>
            <div className="text-muted-foreground space-y-2">
              <p>
                L'ensemble des elements developpes par Botler 360 (code source, design, contenus,
                algorithmes, modeles IA) reste la propriete intellectuelle exclusive du
                Prestataire, sauf accord ecrit contraire.
              </p>
              <p>
                Le Client beneficie d'un droit d'utilisation non exclusif et non cessible des
                livrables dans le cadre de son activite professionnelle, pour la duree du
                contrat. Ce droit d'utilisation ne confere aucun droit de propriete
                intellectuelle au Client.
              </p>
              <p>
                Les contenus fournis par le Client (textes, images, logos) restent sa propriete.
                Le Client garantit disposer des droits necessaires sur les contenus fournis et
                degage le Prestataire de toute responsabilite a cet egard.
              </p>
            </div>
          </motion.div>

          {/* Article 7 - Responsabilite et garanties */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="glass-card rounded-2xl p-8"
          >
            <h2 className="text-2xl font-bold text-foreground mb-4">
              {t("legal.cgv.article7.title")}
            </h2>
            <div className="text-muted-foreground space-y-2">
              <p>
                Le Prestataire s'engage a apporter tout le soin et la diligence necessaires a la
                fourniture de ses services. Il s'agit d'une obligation de moyens et non de
                resultat.
              </p>
              <p>
                Botler 360 ne saurait etre tenue responsable des dommages indirects (perte de
                chiffre d'affaires, perte de clientele, perte de donnees, atteinte a l'image de
                marque) subis par le Client a l'occasion de l'execution du contrat.
              </p>
              <p>
                En tout etat de cause, la responsabilite du Prestataire est limitee au montant
                des sommes effectivement versees par le Client au titre du contrat au cours des
                12 derniers mois.
              </p>
              <p>
                Le Prestataire ne saurait etre tenu responsable en cas de force majeure, telle
                que definie par la jurisprudence des tribunaux francais.
              </p>
            </div>
          </motion.div>

          {/* Article 8 - Donnees personnelles */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="glass-card rounded-2xl p-8"
          >
            <h2 className="text-2xl font-bold text-foreground mb-4">
              {t("legal.cgv.article8.title")}
            </h2>
            <div className="text-muted-foreground space-y-2">
              <p>
                Dans le cadre de l'execution de ses services, le Prestataire est amene a traiter
                des donnees personnelles pour le compte du Client. Le traitement de ces donnees
                est effectue conformement au Reglement General sur la Protection des Donnees
                (RGPD) et a la legislation francaise en vigueur.
              </p>
              <p>
                Pour plus d'informations sur la collecte, le traitement et la protection de
                vos donnees personnelles, veuillez consulter notre{" "}
                <Link
                  href="/politique-confidentialite"
                  className="text-amber-500 hover:underline font-medium"
                >
                  Politique de Confidentialite
                </Link>.
              </p>
            </div>
          </motion.div>

          {/* Article 9 - Droit de retractation */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="glass-card rounded-2xl p-8"
          >
            <h2 className="text-2xl font-bold text-foreground mb-4">
              {t("legal.cgv.article9.title")}
            </h2>
            <div className="text-muted-foreground space-y-2">
              <p>
                Conformement aux articles L.221-18 et suivants du Code de la Consommation, le
                Client consommateur dispose d'un delai de 14 jours a compter de la conclusion du
                contrat pour exercer son droit de retractation, sans avoir a motiver sa decision.
              </p>
              <p>
                <strong className="text-foreground">Exception :</strong> conformement a l'article
                L.221-28 du Code de la Consommation, le droit de retractation ne peut etre
                exerce pour les contrats de fourniture de services pleinement executes avant la
                fin du delai de retractation et dont l'execution a commence apres accord
                prealable et expres du consommateur et renoncement expres a son droit de
                retractation.
              </p>
              <p>
                Pour exercer votre droit de retractation, veuillez nous contacter par email a{" "}
                <a href="mailto:contact@botler360.com" className="text-amber-500 hover:underline">
                  contact@botler360.com
                </a>{" "}
                en indiquant clairement votre volonte de vous retracter.
              </p>
            </div>
          </motion.div>

          {/* Article 10 - Litiges */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="glass-card rounded-2xl p-8"
          >
            <h2 className="text-2xl font-bold text-foreground mb-4">
              {t("legal.cgv.article10.title")}
            </h2>
            <div className="text-muted-foreground space-y-2">
              <p>
                Les presentes CGV sont soumises au droit francais. En cas de litige relatif a
                l'interpretation ou l'execution des presentes CGV, les parties s'efforceront de
                trouver une solution amiable.
              </p>
              <p>
                A defaut de resolution amiable dans un delai de 30 jours, le litige sera soumis
                a la competence exclusive du Tribunal de Commerce d'Avignon, y compris en cas de
                pluralite de defendeurs ou d'appel en garantie.
              </p>
              <p>
                Conformement aux dispositions du Code de la Consommation, le Client consommateur
                est informe qu'il peut recourir a une mediation conventionnelle ou a tout mode
                alternatif de reglement des litiges.
              </p>
            </div>
          </motion.div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
