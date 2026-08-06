import { useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

type Section = {
  title: string;
  paragraphs?: string[];
  bullets?: Array<string | { label: string; text: string }>;
};

type Content = {
  title: string;
  lastUpdated: string;
  sections: Section[];
};

const content: Record<"fr" | "en", Content> = {
  fr: {
    title: "Mentions légales — Botler360",
    lastUpdated: "Dernière mise à jour : 05 août 2026",
    sections: [
      {
        title: "1. Éditeur du site",
        paragraphs: [
          "Le site botler360.com est édité par Botler 360 Ltd.",
          "Company number : 10644529",
          "Siège social : 10 Cousins Close, Yiewsley, West Drayton, England, UB7 8QG",
          "E-mail : contact@botler360.com",
        ],
      },
      {
        title: "2. Directeur de la publication",
        paragraphs: [
          "La direction de la publication est assurée par les représentants légaux de Botler 360 Ltd, joignables à l'adresse contact@botler360.com.",
        ],
      },
      {
        title: "3. Hébergement",
        bullets: [
          { label: "Hébergeur (API et services)", text: "Google Cloud EMEA Limited, Dublin, Ireland" },
        ],
      },
      {
        title: "4. Propriété intellectuelle",
        paragraphs: [
          "L'ensemble des contenus présents sur le site botler360.com (textes, visuels, logos, marque Botler™) est la propriété de Botler 360 Ltd, sauf mention contraire, et est protégé par le droit de la propriété intellectuelle.",
          "Toute reproduction, représentation ou diffusion, totale ou partielle, sans autorisation préalable est interdite.",
        ],
      },
      {
        title: "5. Données personnelles",
        paragraphs: [
          "Le traitement des données personnelles collectées via le site est détaillé dans notre politique de confidentialité, accessible depuis le pied de page du site.",
        ],
      },
    ],
  },
  en: {
    title: "Legal Notice — Botler360",
    lastUpdated: "Last updated: 05 August 2026",
    sections: [
      {
        title: "1. Site Publisher",
        paragraphs: [
          "The site botler360.com is published by Botler 360 Ltd.",
          "Company number: 10644529",
          "Registered office: 10 Cousins Close, Yiewsley, West Drayton, England, UB7 8QG",
          "E-mail: contact@botler360.com",
        ],
      },
      {
        title: "2. Publication Director",
        paragraphs: [
          "Publication is directed by the legal representatives of Botler 360 Ltd, reachable at contact@botler360.com.",
        ],
      },
      {
        title: "3. Hosting",
        bullets: [
          { label: "Host (API and services)", text: "Google Cloud EMEA Limited, Dublin, Ireland" },
        ],
      },
      {
        title: "4. Intellectual Property",
        paragraphs: [
          "All content on the botler360.com site (text, visuals, logos, the Botler™ mark) is the property of Botler 360 Ltd, unless otherwise stated, and is protected by intellectual property law.",
          "Any reproduction, representation, or distribution, in whole or in part, without prior authorization is prohibited.",
        ],
      },
      {
        title: "5. Personal Data",
        paragraphs: [
          "The processing of personal data collected via the site is detailed in our privacy policy, accessible from the site footer.",
        ],
      },
    ],
  },
};

export default function MentionsLegales() {
  const { language } = useLanguage();
  const data = content[language];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
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
              <section key={idx} className="space-y-3">
                <h2 className="text-xl md:text-2xl font-semibold text-foreground">
                  {section.title}
                </h2>

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
              </section>
            ))}
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
