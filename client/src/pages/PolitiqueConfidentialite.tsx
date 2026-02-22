/*
 * Design: Botler360 - Politique de Confidentialite Page
 * - Supports both light and dark modes
 * - Glass morphism styling
 * - Framer Motion scroll animations
 * - RGPD-compliant privacy policy
 * - French legal text (not translated)
 */

import { useEffect } from "react";
import { motion } from "framer-motion";
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

export default function PolitiqueConfidentialite() {
  const { t } = useLanguage();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Politique de Confidentialité" description="Politique de confidentialité RGPD de Botler 360 — données collectées, finalités, droits des utilisateurs et cookies." canonical="/politique-confidentialite" noindex />
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
              {t("legal.privacy.title")}
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

          {/* 1. Responsable du traitement */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="glass-card rounded-2xl p-8"
          >
            <h2 className="text-2xl font-bold text-foreground mb-4">
              {t("legal.privacy.controller.title")}
            </h2>
            <div className="text-muted-foreground space-y-2">
              <p>
                Le responsable du traitement des donnees personnelles collectees sur le site
                botler360.com est :
              </p>
              <p>
                <strong className="text-foreground">Botler 360</strong>, marque commerciale de{" "}
                <strong className="text-foreground">Best of Tours Ltd</strong>
              </p>
              <p>Siege social : 44 chemin de Provence, 84320 Entraigues-sur-la-Sorgue, France</p>
              <p>
                Email :{" "}
                <a href="mailto:contact@botler360.com" className="text-amber-500 hover:underline">
                  contact@botler360.com
                </a>
              </p>
              <p>
                Telephone :{" "}
                <a href="tel:+33186260390" className="text-amber-500 hover:underline">
                  01 86 26 03 90
                </a>
              </p>
            </div>
          </motion.div>

          {/* 2. Donnees collectees */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="glass-card rounded-2xl p-8"
          >
            <h2 className="text-2xl font-bold text-foreground mb-4">
              {t("legal.privacy.collected.title")}
            </h2>
            <div className="text-muted-foreground space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Via le chatbot Botler
                </h3>
                <p>
                  Lorsque vous interagissez avec notre chatbot, les donnees suivantes peuvent
                  etre collectees :
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                  <li>Nom et prenom</li>
                  <li>Adresse email</li>
                  <li>Numero de telephone</li>
                  <li>Nom de l'entreprise</li>
                  <li>Secteur d'activite</li>
                  <li>Site web</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Via le formulaire de contact
                </h3>
                <p>
                  Les donnees collectees via notre formulaire de contact incluent :
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                  <li>Nom et prenom</li>
                  <li>Adresse email</li>
                  <li>Numero de telephone</li>
                  <li>Nom de l'entreprise</li>
                  <li>Secteur d'activite</li>
                  <li>Message</li>
                  <li>Piece jointe (le cas echeant)</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* 3. Finalites */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="glass-card rounded-2xl p-8"
          >
            <h2 className="text-2xl font-bold text-foreground mb-4">
              {t("legal.privacy.purposes.title")}
            </h2>
            <div className="text-muted-foreground space-y-2">
              <p>Vos donnees personnelles sont collectees pour les finalites suivantes :</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  <strong className="text-foreground">Qualification commerciale :</strong>{" "}
                  identifier et comprendre vos besoins afin de vous proposer les solutions les
                  plus adaptees.
                </li>
                <li>
                  <strong className="text-foreground">Prise de contact :</strong> vous
                  recontacter suite a votre demande d'information ou de devis.
                </li>
                <li>
                  <strong className="text-foreground">Amelioration du service :</strong>{" "}
                  analyser les interactions pour ameliorer la qualite de nos services et de notre
                  chatbot.
                </li>
              </ul>
            </div>
          </motion.div>

          {/* 4. Base legale */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="glass-card rounded-2xl p-8"
          >
            <h2 className="text-2xl font-bold text-foreground mb-4">
              {t("legal.privacy.legal-basis.title")}
            </h2>
            <div className="text-muted-foreground space-y-2">
              <p>Le traitement de vos donnees personnelles repose sur :</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  <strong className="text-foreground">Le consentement (article 6.1.a du RGPD) :</strong>{" "}
                  pour les donnees collectees via le chatbot. Vous consentez au traitement de vos
                  donnees en fournissant volontairement vos informations lors de la conversation.
                </li>
                <li>
                  <strong className="text-foreground">L'interet legitime (article 6.1.f du RGPD) :</strong>{" "}
                  pour les donnees collectees via le formulaire de contact. Notre interet
                  legitime reside dans le traitement de vos demandes commerciales et la gestion
                  de la relation client.
                </li>
              </ul>
            </div>
          </motion.div>

          {/* 5. Destinataires */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="glass-card rounded-2xl p-8"
          >
            <h2 className="text-2xl font-bold text-foreground mb-4">
              {t("legal.privacy.recipients.title")}
            </h2>
            <div className="text-muted-foreground space-y-2">
              <p>Les donnees collectees sont accessibles par :</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  L'equipe commerciale de Botler 360, dans le cadre du suivi des prospects et de
                  la relation client.
                </li>
                <li>
                  Google Sheets (utilise comme CRM interne) pour la gestion et le suivi des
                  contacts.
                </li>
              </ul>
              <p className="mt-2">
                <strong className="text-foreground">
                  Vos donnees ne sont en aucun cas vendues, louees ou cedees a des tiers a des
                  fins commerciales.
                </strong>
              </p>
            </div>
          </motion.div>

          {/* 6. Duree de conservation */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="glass-card rounded-2xl p-8"
          >
            <h2 className="text-2xl font-bold text-foreground mb-4">
              {t("legal.privacy.retention.title")}
            </h2>
            <div className="text-muted-foreground space-y-2">
              <p>
                Vos donnees personnelles sont conservees pendant une duree maximale de{" "}
                <strong className="text-foreground">3 ans</strong> a compter de votre dernier
                contact avec Botler 360 (dernier echange, derniere connexion, derniere
                interaction avec le chatbot).
              </p>
              <p>
                A l'expiration de ce delai, vos donnees sont supprimees ou anonymisees de maniere
                irreversible.
              </p>
            </div>
          </motion.div>

          {/* 7. Droits */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="glass-card rounded-2xl p-8"
          >
            <h2 className="text-2xl font-bold text-foreground mb-4">
              {t("legal.privacy.rights.title")}
            </h2>
            <div className="text-muted-foreground space-y-2">
              <p>
                Conformement au RGPD et a la loi Informatique et Libertes, vous disposez des
                droits suivants sur vos donnees personnelles :
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  <strong className="text-foreground">Droit d'acces :</strong> obtenir la
                  confirmation que vos donnees sont traitees et en obtenir une copie.
                </li>
                <li>
                  <strong className="text-foreground">Droit de rectification :</strong> demander
                  la correction de donnees inexactes ou incompletes.
                </li>
                <li>
                  <strong className="text-foreground">Droit de suppression :</strong> demander
                  l'effacement de vos donnees dans les conditions prevues par la reglementation.
                </li>
                <li>
                  <strong className="text-foreground">Droit a la portabilite :</strong> recevoir
                  vos donnees dans un format structure, couramment utilise et lisible par
                  machine.
                </li>
                <li>
                  <strong className="text-foreground">Droit d'opposition :</strong> vous opposer
                  au traitement de vos donnees pour des motifs legitimes.
                </li>
              </ul>
              <p className="mt-2">
                Pour exercer ces droits, contactez-nous par email a :{" "}
                <a href="mailto:contact@botler360.com" className="text-amber-500 hover:underline">
                  contact@botler360.com
                </a>
              </p>
              <p>
                Nous nous engageons a repondre a votre demande dans un delai de 30 jours. Vous
                disposez egalement du droit d'introduire une reclamation aupres de la CNIL
                (Commission Nationale de l'Informatique et des Libertes).
              </p>
            </div>
          </motion.div>

          {/* 8. Cookies */}
          <motion.div
            id="cookies"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="glass-card rounded-2xl p-8"
          >
            <h2 className="text-2xl font-bold text-foreground mb-4">
              {t("legal.privacy.cookies.title")}
            </h2>
            <div className="text-muted-foreground space-y-2">
              <p>
                Le site botler360.com utilise des cookies strictement necessaires au
                fonctionnement du site et des cookies d'analyse.
              </p>
              <p>
                <strong className="text-foreground">Cookies d'analyse :</strong> nous utilisons{" "}
                <strong className="text-foreground">Umami</strong>, une solution d'analyse web
                respectueuse de la vie privee, qui ne collecte aucune donnee personnelle et ne
                depose aucun cookie de suivi. Umami est conforme au RGPD par conception.
              </p>
              <p>
                <strong className="text-foreground">Cookies publicitaires :</strong> nous
                n'utilisons aucun cookie publicitaire ou de retargeting sur notre site.
              </p>
              <p>
                Vous pouvez a tout moment gerer vos preferences de cookies via les parametres de
                votre navigateur.
              </p>
            </div>
          </motion.div>

          {/* 9. Transferts hors UE */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="glass-card rounded-2xl p-8"
          >
            <h2 className="text-2xl font-bold text-foreground mb-4">
              {t("legal.privacy.transfers.title")}
            </h2>
            <div className="text-muted-foreground space-y-2">
              <p>
                Certaines de vos donnees peuvent etre transferees en dehors de l'Union
                Europeenne, notamment vers les Etats-Unis, dans le cadre de l'utilisation des
                services Google (Google Sheets, Google Cloud Platform).
              </p>
              <p>
                Ces transferts sont encadres par des{" "}
                <strong className="text-foreground">clauses contractuelles types</strong>{" "}
                approuvees par la Commission Europeenne, garantissant un niveau de protection
                adequat de vos donnees conformement aux exigences du RGPD.
              </p>
            </div>
          </motion.div>

          {/* 10. Contact DPO */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="glass-card rounded-2xl p-8"
          >
            <h2 className="text-2xl font-bold text-foreground mb-4">
              {t("legal.privacy.dpo.title")}
            </h2>
            <div className="text-muted-foreground space-y-2">
              <p>
                Pour toute question relative a la protection de vos donnees personnelles ou pour
                exercer vos droits, vous pouvez contacter notre delegue a la protection des
                donnees (DPO) :
              </p>
              <p>
                Email :{" "}
                <a href="mailto:contact@botler360.com" className="text-amber-500 hover:underline">
                  contact@botler360.com
                </a>
              </p>
              <p>
                Adresse postale : Botler 360 - DPO, 44 chemin de Provence, 84320
                Entraigues-sur-la-Sorgue, France
              </p>
            </div>
          </motion.div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
