import { useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

const content = {
  fr: {
    title: "Conditions générales de vente — Botler360",
    notice:
      "Le contenu juridique de cette page (modalités de paiement, délais de livraison, garanties, droit de rétractation) est en attente de validation par notre service juridique et sera publié avant la mise en ligne définitive de cette page.",
    contact:
      "Pour toute question sur nos conditions de vente en attendant, contactez-nous à contact@botler360.com.",
  },
  en: {
    title: "Terms and Conditions of Sale — Botler360",
    notice:
      "The legal content of this page (payment terms, delivery times, warranties, right of withdrawal) is pending review by our legal team and will be published before this page goes live for real.",
    contact:
      "For any question about our terms of sale in the meantime, contact us at contact@botler360.com.",
  },
};

export default function CGV() {
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
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="glass-card p-8 md:p-12 rounded-2xl space-y-4 border border-dashed border-border"
          >
            <p className="text-muted-foreground leading-relaxed">{data.notice}</p>
            <p className="text-muted-foreground leading-relaxed">{data.contact}</p>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
