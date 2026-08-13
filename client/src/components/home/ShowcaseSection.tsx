import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import TwoStateCTA from "./TwoStateCTA";
import PlaceholderCapture from "./PlaceholderCapture";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const SECTOR_DEMOS = [
  { id: "tourisme", nameKey: "sector.tourism", descKey: "home.sectors.tourism.desc", statKey: "home.sectors.tourism.stat", image: "/mascots/tourisme.png" },
  { id: "viticulture", nameKey: "sector.viticulture", descKey: "home.sectors.viticulture.desc", statKey: "home.sectors.viticulture.stat", image: "/mascots/viticulture.png" },
  { id: "restaurants", nameKey: "sector.restaurants", descKey: "home.sectors.restaurants.desc", statKey: "home.sectors.restaurants.stat", image: "/mascots/restaurants.png" },
  { id: "boulangerie", nameKey: "sector.bakery", descKey: "home.sectors.bakery.desc", statKey: "home.sectors.bakery.stat", image: "/mascots/boulangerie.png" },
  { id: "immobilier", nameKey: "sector.realEstate", descKey: "home.sectors.realEstate.desc", statKey: "home.sectors.realEstate.stat", image: "/mascots/immobilier.png" },
  { id: "hebergements", nameKey: "sector.accommodation", descKey: "home.sectors.accommodation.desc", statKey: "home.sectors.accommodation.stat", image: "/mascots/hebergements.png" },
];

export default function ShowcaseSection() {
  const { t } = useLanguage();

  // Families C & D have no visual asset in this repo yet (brief §12 — Maeva's
  // most concrete dependency) — named, honest placeholders rather than a gap.
  const PENDING_CAPTURES = [
    t("home.showcase.pending1"),
    t("home.showcase.pending2"),
    t("home.showcase.pending3"),
    t("home.showcase.pending4"),
  ];

  return (
    <section id="realisations" className="relative py-20 sm:py-28 bg-slate-50">
      <div className="container mx-auto px-4 lg:px-8 xl:px-12 2xl:px-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center mb-14 max-w-2xl mx-auto"
        >
          <motion.span variants={fadeInUp} className="inline-block text-amber-600 text-xs font-semibold uppercase tracking-wide mb-3">
            {t("home.showcase.eyebrow")}
          </motion.span>
          <motion.h2 variants={fadeInUp} className="font-heading text-3xl md:text-4xl font-semibold text-slate-900">
            {t("home.showcase.title")}
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-slate-600 mt-3">
            {t("home.showcase.description")}
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10"
        >
          {SECTOR_DEMOS.map((sector) => (
            <motion.div
              key={sector.id}
              variants={fadeInUp}
              className="bg-white rounded-2xl border border-slate-200 p-5 flex items-start gap-4"
            >
              <img
                src={sector.image}
                alt={t(sector.nameKey)}
                className="w-16 h-16 object-contain rounded-xl flex-shrink-0"
                loading="lazy"
                decoding="async"
                width="64"
                height="64"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-900">{t(sector.nameKey)}</h3>
                <p className="text-sm text-slate-500 mb-2">{t(sector.descKey)}</p>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold text-amber-600">{t(sector.statKey)}</span>
                  <TwoStateCTA state="linked" href={`/demo/${sector.id}`} />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {PENDING_CAPTURES.map((label) => (
            <motion.div key={label} variants={fadeInUp}>
              <PlaceholderCapture label={label} variant="wall" tone="light" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
