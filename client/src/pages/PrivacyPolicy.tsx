import { useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

type Section = {
  id?: string;
  title: string;
  intro?: string;
  bullets?: Array<string | { label: string; text: string }>;
  paragraphs?: string[];
  outro?: string;
};

type Content = {
  title: string;
  lastUpdated: string;
  sections: Section[];
};

const content: Record<"fr" | "en", Content> = {
  fr: {
    title: "Politique de confidentialité — Botler360",
    lastUpdated: "Dernière mise à jour : 03 novembre 2025",
    sections: [
      {
        title: "1. Introduction",
        paragraphs: [
          "La présente politique de confidentialité décrit la manière dont Botler 360 Ltd, société éditrice du site Botler360, collecte, utilise et protège les données personnelles des utilisateurs conformément au Règlement Général sur la Protection des Données (RGPD - UE) et au UK GDPR.",
          "En utilisant notre site, vous acceptez les pratiques décrites dans cette politique.",
        ],
      },
      {
        title: "2. Identité du responsable du traitement",
        paragraphs: [
          "Responsable du traitement :",
          "Botler 360 Ltd",
          "Company number : 10644529",
          "10 Cousins Close, Yiewsley, West Drayton, England, UB7 8QG",
          "E-mail : contact@botler360.com",
        ],
      },
      {
        title: "3. Données personnelles collectées",
        intro:
          "Nous collectons uniquement les données strictement nécessaires à nos finalités. Les informations concernées peuvent inclure :",
        bullets: [
          { label: "Données d'identification", text: "nom, prénom, adresse e-mail, téléphone" },
          { label: "Données de navigation", text: "adresse IP, type d'appareil, navigateur, pages consultées, durée de la visite" },
          { label: "Données issues des formulaires", text: "messages, préférences, demandes de contact ou de devis" },
          { label: "Cookies et traceurs", text: "gérés via le module de consentement Tarteaucitron" },
        ],
      },
      {
        title: "4. Finalités du traitement",
        intro: "Vos données sont utilisées pour :",
        bullets: [
          "Répondre à vos demandes de contact ou d'information",
          "Gérer les relations clients et prospects",
          "Assurer le fonctionnement et la sécurité du site",
          "Analyser l'audience et améliorer nos contenus",
          "Diffuser des communications marketing (uniquement sur consentement explicite)",
        ],
      },
      {
        title: "5. Base légale du traitement",
        intro: "Les traitements reposent sur :",
        bullets: [
          { label: "L'exécution d'un contrat ou de mesures précontractuelles", text: "formulaire de contact, demande de service" },
          { label: "Le consentement de l'utilisateur", text: "cookies, newsletters, marketing" },
          { label: "L'intérêt légitime de la société", text: "amélioration continue du site, sécurité" },
          { label: "Le respect d'obligations légales", text: "comptabilité, gestion des litiges" },
        ],
      },
      {
        title: "6. Destinataires des données",
        intro:
          "Les données sont traitées par les équipes internes de Botler 360 Ltd et, le cas échéant, par des prestataires techniques soumis à des obligations de confidentialité :",
        bullets: [
          { label: "Hébergement", text: "Google Cloud EMEA Limited, Dublin, Ireland" },
          { label: "Outils d'analyse et de mesure (si activés)", text: "ex. Google Analytics, uniquement avec consentement" },
        ],
        outro: "Aucune donnée n'est vendue ni transférée à des tiers à des fins commerciales.",
      },
      {
        title: "7. Transferts hors Royaume-Uni / Union européenne",
        paragraphs: [
          "Certains prestataires (notamment Google) peuvent transférer des données hors de l'Espace économique européen.",
          "Ces transferts sont encadrés par des clauses contractuelles types (SCC) et des garanties de conformité validées par la Commission européenne et le régulateur britannique (ICO).",
        ],
      },
      {
        title: "8. Durée de conservation des données",
        bullets: [
          { label: "Données de contact", text: "3 ans après le dernier échange avec vous" },
          { label: "Données clients", text: "durée du contrat + obligations légales (jusqu'à 10 ans pour la comptabilité)" },
          { label: "Cookies", text: "jusqu'à 13 mois à compter du dépôt" },
          { label: "Consentement", text: "conservé 6 mois (renouvelé via Tarteaucitron)" },
        ],
      },
      {
        title: "9. Vos droits",
        intro: "Conformément au RGPD et au UK GDPR, vous disposez des droits suivants :",
        bullets: [
          { label: "Accès", text: "à vos données" },
          { label: "Rectification", text: "des informations inexactes" },
          { label: "Effacement", text: "« droit à l'oubli »" },
          { label: "Limitation", text: "du traitement" },
          { label: "Opposition", text: "au traitement de vos données" },
          { label: "Portabilité", text: "de vos données dans un format lisible" },
        ],
        paragraphs: [
          "Pour exercer vos droits : Contactez-nous à contact@botler360.com en précisant votre identité et l'objet de votre demande.",
          "Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire une réclamation :",
        ],
      },
      {
        title: "",
        bullets: [
          { label: "Auprès de l'ICO (Information Commissioner's Office)", text: "www.ico.org.uk (utilisateurs UK)" },
          { label: "Ou de la CNIL", text: "www.cnil.fr (utilisateurs UE)" },
        ],
      },
      {
        title: "10. Sécurité des données",
        paragraphs: [
          "Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour garantir la sécurité et la confidentialité de vos données : chiffrement, pare-feu, sauvegardes, contrôle d'accès, etc.",
          "En cas de violation de données personnelles, nous nous engageons à notifier les autorités compétentes et les personnes concernées conformément à la réglementation.",
        ],
      },
      {
        title: "11. Liens externes",
        paragraphs: [
          "Le site peut contenir des liens vers d'autres sites.",
          "Nous ne sommes pas responsables du contenu ni des pratiques de confidentialité de ces sites tiers. Nous vous recommandons de consulter leur politique de confidentialité.",
        ],
      },
      {
        title: "12. Modification de la politique",
        paragraphs: [
          "La présente politique peut être mise à jour pour refléter les évolutions légales ou techniques.",
          "La version en vigueur est celle publiée sur le site à la date de votre consultation.",
        ],
      },
      {
        id: "cookies",
        title: "13. Politique de cookies",
        intro: "Le site utilise plusieurs catégories de cookies et traceurs :",
        bullets: [
          { label: "Cookies strictement nécessaires", text: "indispensables au fonctionnement du site (navigation, sécurité) — ne nécessitent pas de consentement" },
          { label: "Cookies de mesure d'audience", text: "statistiques de fréquentation anonymisées, déposés uniquement avec votre consentement" },
          { label: "Cookies marketing", text: "déposés uniquement avec votre consentement, pour mesurer l'efficacité de nos campagnes" },
        ],
        paragraphs: [
          "Le recueil de votre consentement est géré via le module Tarteaucitron, accessible à tout moment depuis le bandeau de gestion des cookies pour modifier vos préférences ou les retirer.",
          "Vous pouvez également configurer votre navigateur pour refuser les cookies ; certaines fonctionnalités du site pourraient alors être limitées.",
        ],
      },
    ],
  },
  en: {
    title: "Privacy Policy — Botler360",
    lastUpdated: "Last updated: 03 November 2025",
    sections: [
      {
        title: "1. Introduction",
        paragraphs: [
          "This privacy policy describes how Botler 360 Ltd, the company that publishes the Botler360 website, collects, uses, and protects users' personal data in accordance with the General Data Protection Regulation (GDPR - EU) and the UK GDPR.",
          "By using our site, you accept the practices described in this policy.",
        ],
      },
      {
        title: "2. Identity of the Data Controller",
        paragraphs: [
          "Data Controller:",
          "Botler 360 Ltd",
          "Company number: 10644529",
          "10 Cousins Close, Yiewsley, West Drayton, England, UB7 8QG",
          "E-mail: contact@botler360.com",
        ],
      },
      {
        title: "3. Personal Data Collected",
        intro:
          "We collect only the data strictly necessary for our purposes. The information concerned may include:",
        bullets: [
          { label: "Identification data", text: "first name, last name, e-mail address, phone number" },
          { label: "Browsing data", text: "IP address, device type, browser, pages visited, duration of the visit" },
          { label: "Data from forms", text: "messages, preferences, contact or quote requests" },
          { label: "Cookies and trackers", text: "managed via the Tarteaucitron consent module" },
        ],
      },
      {
        title: "4. Purposes of Processing",
        intro: "Your data is used to:",
        bullets: [
          "Respond to your contact or information requests",
          "Manage customer and prospect relationships",
          "Ensure the operation and security of the site",
          "Analyze audience and improve our content",
          "Send marketing communications (only with explicit consent)",
        ],
      },
      {
        title: "5. Legal Basis for Processing",
        intro: "Processing is based on:",
        bullets: [
          { label: "Performance of a contract or pre-contractual measures", text: "contact form, service request" },
          { label: "User consent", text: "cookies, newsletters, marketing" },
          { label: "Legitimate interest of the company", text: "continuous site improvement, security" },
          { label: "Compliance with legal obligations", text: "accounting, dispute management" },
        ],
      },
      {
        title: "6. Data Recipients",
        intro:
          "Data is processed by the internal teams of Botler 360 Ltd and, where applicable, by technical service providers subject to confidentiality obligations:",
        bullets: [
          { label: "Hosting", text: "Google Cloud EMEA Limited, Dublin, Ireland" },
          { label: "Analytics and measurement tools (if enabled)", text: "e.g. Google Analytics, only with consent" },
        ],
        outro: "No data is sold or transferred to third parties for commercial purposes.",
      },
      {
        title: "7. Transfers Outside the UK / European Union",
        paragraphs: [
          "Some providers (in particular Google) may transfer data outside the European Economic Area.",
          "These transfers are governed by Standard Contractual Clauses (SCC) and compliance safeguards approved by the European Commission and the UK regulator (ICO).",
        ],
      },
      {
        title: "8. Data Retention Periods",
        bullets: [
          { label: "Contact data", text: "3 years after the last exchange with you" },
          { label: "Customer data", text: "duration of the contract + legal obligations (up to 10 years for accounting)" },
          { label: "Cookies", text: "up to 13 months from the date of deposit" },
          { label: "Consent", text: "kept for 6 months (renewed via Tarteaucitron)" },
        ],
      },
      {
        title: "9. Your Rights",
        intro: "In accordance with the GDPR and the UK GDPR, you have the following rights:",
        bullets: [
          { label: "Access", text: "to your data" },
          { label: "Rectification", text: "of inaccurate information" },
          { label: "Erasure", text: "\"right to be forgotten\"" },
          { label: "Restriction", text: "of processing" },
          { label: "Objection", text: "to the processing of your data" },
          { label: "Portability", text: "of your data in a readable format" },
        ],
        paragraphs: [
          "To exercise your rights: Contact us at contact@botler360.com specifying your identity and the subject of your request.",
          "If you believe that your rights are not being respected, you may lodge a complaint:",
        ],
      },
      {
        title: "",
        bullets: [
          { label: "With the ICO (Information Commissioner's Office)", text: "www.ico.org.uk (UK users)" },
          { label: "Or with the CNIL", text: "www.cnil.fr (EU users)" },
        ],
      },
      {
        title: "10. Data Security",
        paragraphs: [
          "We implement appropriate technical and organizational measures to ensure the security and confidentiality of your data: encryption, firewalls, backups, access control, etc.",
          "In the event of a personal data breach, we undertake to notify the competent authorities and the persons concerned in accordance with the regulations.",
        ],
      },
      {
        title: "11. External Links",
        paragraphs: [
          "The site may contain links to other websites.",
          "We are not responsible for the content or privacy practices of these third-party sites. We recommend that you consult their privacy policy.",
        ],
      },
      {
        title: "12. Policy Updates",
        paragraphs: [
          "This policy may be updated to reflect legal or technical developments.",
          "The version in force is the one published on the site on the date of your consultation.",
        ],
      },
      {
        id: "cookies",
        title: "13. Cookie Policy",
        intro: "The site uses several categories of cookies and trackers:",
        bullets: [
          { label: "Strictly necessary cookies", text: "essential for the site to function (navigation, security) — do not require consent" },
          { label: "Audience measurement cookies", text: "anonymized visitor statistics, deposited only with your consent" },
          { label: "Marketing cookies", text: "deposited only with your consent, to measure the effectiveness of our campaigns" },
        ],
        paragraphs: [
          "Your consent is collected via the Tarteaucitron module, accessible at any time from the cookie management banner to change your preferences or withdraw them.",
          "You can also configure your browser to refuse cookies; some site features may then be limited.",
        ],
      },
    ],
  },
};

export default function PrivacyPolicy() {
  const { language } = useLanguage();
  const data = content[language];

  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.slice(1);
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    } else {
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient-gold">
              {data.title}
            </h1>
            <p className="text-sm text-muted-foreground">{data.lastUpdated}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="glass-card p-8 md:p-12 rounded-2xl space-y-8"
          >
            {data.sections.map((section, idx) => (
              <section key={idx} id={section.id} className="space-y-3 scroll-mt-28">
                {section.title && (
                  <h2 className="text-xl md:text-2xl font-semibold text-foreground">
                    {section.title}
                  </h2>
                )}

                {section.intro && (
                  <p className="text-muted-foreground leading-relaxed">{section.intro}</p>
                )}

                {section.paragraphs?.map((p, pIdx) => (
                  <p key={pIdx} className="text-muted-foreground leading-relaxed">
                    {p}
                  </p>
                ))}

                {section.bullets && (
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    {section.bullets.map((b, bIdx) => (
                      <li key={bIdx} className="leading-relaxed">
                        {typeof b === "string" ? (
                          b
                        ) : (
                          <>
                            <span className="font-semibold text-foreground">{b.label}</span>
                            {" : "}
                            {b.text}
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                )}

                {section.outro && (
                  <p className="text-muted-foreground leading-relaxed">{section.outro}</p>
                )}
              </section>
            ))}
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
