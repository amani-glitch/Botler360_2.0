import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const faqs = {
  fr: [
    { q: "Combien de temps pour avoir mon site ou mon agent ?", a: "Un site ou un agent chat part en quelques jours une fois le contenu validé. Une app ou une plateforme sur-mesure prend plus de temps — on vous donne un délai précis dès le premier échange." },
    { q: "Combien ça coûte ?", a: "Les tarifs dépendent du produit : chatbot à partir de 9€/mois, site web à partir de 249€, application sur devis. Chaque page produit détaille son prix." },
    { q: "Et si je change d'avis ?", a: "Aucun engagement de durée sur nos offres standards. Vous pouvez arrêter à tout moment, on vous explique les conditions avant de signer." },
    { q: "Qui maintient l'outil une fois livré ?", a: "Notre équipe assure la maintenance et les mises à jour. Vous gardez la propriété de vos contenus et de vos données." },
    { q: "Est-ce que l'agent peut se tromper ?", a: "Il ne répond que sur ce qu'on lui a appris de vrai, et transfère à un humain dès qu'il sort de son périmètre — voir la section « Ce que nos agents ne font jamais »." },
    { q: "Puis-je voir un exemple avant de signer ?", a: "Oui — demandez à Botler de vous montrer un exemple dans la conversation, ou parcourez la section Réalisations plus haut." },
  ],
  en: [
    { q: "How long until my site or agent is live?", a: "A site or chat agent ships within days once the content is approved. A custom app or platform takes longer — we give you a precise timeline from the first conversation." },
    { q: "How much does it cost?", a: "Pricing depends on the product: chatbot from €9/month, website from €249, apps on quote. Each product page lists its price." },
    { q: "What if I change my mind?", a: "No long-term commitment on our standard offers. You can stop anytime — we explain the terms before you sign." },
    { q: "Who maintains the tool after delivery?", a: "Our team handles maintenance and updates. You keep ownership of your content and your data." },
    { q: "Can the agent get things wrong?", a: "It only answers from what it's actually been taught, and hands off to a human the moment it's out of scope — see \"What our agents never do\" above." },
    { q: "Can I see an example before signing?", a: "Yes — ask Botler to show you an example in the conversation, or browse the Showcase section above." },
  ],
};

export default function FAQSection() {
  const { t, language } = useLanguage();
  const items = faqs[language];
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="relative py-20 sm:py-24 bg-slate-50">
      <div className="container mx-auto px-4 lg:px-8 xl:px-12 2xl:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 max-w-2xl mx-auto"
        >
          <span className="inline-block text-amber-600 text-xs font-semibold uppercase tracking-wide mb-3">
            {t("home.faq.eyebrow")}
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-semibold text-slate-900">
            {t("home.faq.title")}
          </h2>
        </motion.div>

        <div className="max-w-2xl mx-auto space-y-3">
          {items.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={item.q} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-medium text-slate-900">{item.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-4 text-sm text-slate-600">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
