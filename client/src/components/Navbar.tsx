/*
 * Design: Botler360 - Elegant Professional Theme
 * - Supports both light and dark modes
 * - Glass morphism navigation
 * - Smooth animations
 * - Language toggle (FR/EN)
 */

import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { scrollToHomeSection } from "@/lib/homeAnchors";

const sectors = [
  { id: "tourisme", key: "sector.tourism", path: "/demo/tourisme" },
  { id: "viticulture", key: "sector.viticulture", path: "/demo/viticulture" },
  { id: "restaurants", key: "sector.restaurants", path: "/demo/restaurants" },
  { id: "boulangerie", key: "sector.bakery", path: "/demo/boulangerie" },
  { id: "immobilier", key: "sector.realEstate", path: "/demo/immobilier" },
  { id: "hebergements", key: "sector.accommodation", path: "/demo/hebergements" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSectorsOpen, setIsSectorsOpen] = useState(false);
  const [location, setLocation] = useLocation();
  const { theme, toggleTheme, switchable } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  // The hub's sticky header shows in-page anchors instead of page links
  // (brief §6bis section 1) — every other route keeps full site wayfinding.
  const isHome = location === "/" || location === "/en";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: t("nav.home") },
    { href: "/solutions", label: t("nav.solutions") },
    { href: "/demo", label: t("nav.demo") },
    { href: "/contact", label: t("nav.contact") },
  ];

  const homeAnchors = [
    { id: "offre", label: t("nav.hub.offer") },
    { id: "realisations", label: t("nav.hub.showcase") },
    { id: "botler-live", label: t("nav.hub.talk") },
    { id: "rendez-vous", label: t("nav.hub.book") },
  ];

  const goToHomeSection = (id: string) => scrollToHomeSection(id, setLocation, location);

  const toggleLanguage = () => {
    setLanguage(language === "fr" ? "en" : "fr");
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-lg shadow-black/10 dark:shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-3 cursor-pointer"
            >
              <img
                src="/images/botler-logo-full.png"
                alt="Botler"
                className="h-10 sm:h-14 w-auto object-contain"
                decoding="async"
                width="180"
                height="56"
              />
              <span className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">
                Botler<sup className="text-xs">™</sup>
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {isHome ? (
              homeAnchors.map((anchor) => (
                <button
                  key={anchor.id}
                  onClick={() => goToHomeSection(anchor.id)}
                  className="text-sm font-medium text-foreground/80 hover:text-amber-500 transition-colors"
                >
                  {anchor.label}
                </button>
              ))
            ) : (
              <>
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href}>
                    <motion.span
                      whileHover={{ y: -2 }}
                      className={`relative text-sm font-medium transition-colors cursor-pointer ${
                        location === link.href
                          ? "text-amber-500"
                          : "text-foreground/80 hover:text-amber-500"
                      }`}
                    >
                      {link.label}
                      {location === link.href && (
                        <motion.div
                          layoutId="activeNav"
                          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-amber-500"
                        />
                      )}
                    </motion.span>
                  </Link>
                ))}

                {/* Sectors Dropdown */}
                <div
                  className="relative"
                  onMouseEnter={() => setIsSectorsOpen(true)}
                  onMouseLeave={() => setIsSectorsOpen(false)}
                >
                  <button className="flex items-center gap-1 text-sm font-medium text-foreground/80 hover:text-amber-500 transition-colors">
                    {t("nav.sectors")}
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        isSectorsOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {isSectorsOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-2 w-48 glass-card rounded-xl p-2"
                      >
                        {sectors.map((sector) => (
                          <Link key={sector.id} href={sector.path}>
                            <span className="block px-4 py-2 text-sm text-foreground/80 hover:text-amber-500 hover:bg-white/5 dark:hover:bg-white/5 rounded-lg transition-colors cursor-pointer">
                              {t(sector.key)}
                            </span>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}

            {/* Language Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleLanguage}
              className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center px-3 text-sm font-bold rounded-lg border border-border/50 bg-secondary/50 hover:bg-secondary text-foreground transition-colors"
              aria-label="Toggle language"
            >
              {language === "fr" ? "EN" : "FR"}
            </motion.button>

            {/* Theme Toggle */}
            {switchable && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleTheme}
                className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5 text-amber-500" />
                ) : (
                  <Moon className="w-5 h-5 text-slate-700" />
                )}
              </motion.button>
            )}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:block">
            {isHome ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => goToHomeSection("botler-live")}
                className="btn-gold"
              >
                {t("nav.hub.talk")}
              </motion.button>
            ) : (
              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-gold"
                >
                  {t("nav.getStarted")}
                </motion.button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            {/* Language Toggle Mobile */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={toggleLanguage}
              className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center px-2 text-sm font-bold rounded-lg border border-border/50 bg-secondary/50 text-foreground"
              aria-label="Toggle language"
            >
              {language === "fr" ? "EN" : "FR"}
            </motion.button>

            {/* Mobile Theme Toggle */}
            {switchable && (
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={toggleTheme}
                className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5 text-amber-500" />
                ) : (
                  <Moon className="w-5 h-5 text-slate-700" />
                )}
              </motion.button>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center text-foreground hover:text-amber-500 transition-colors"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-background/95 backdrop-blur-xl border-b border-border/50 overflow-hidden"
          >
            <div className="container mx-auto px-4 py-6 space-y-4">
              {isHome ? (
                <>
                  {homeAnchors.map((anchor) => (
                    <button
                      key={anchor.id}
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        goToHomeSection(anchor.id);
                      }}
                      className="block w-full text-left py-2 text-lg font-medium text-foreground/80 hover:text-amber-500 transition-colors"
                    >
                      {anchor.label}
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      goToHomeSection("botler-live");
                    }}
                    className="w-full btn-gold mt-4"
                  >
                    {t("nav.hub.talk")}
                  </button>
                </>
              ) : (
                <>
                  {navLinks.map((link) => (
                    <Link key={link.href} href={link.href}>
                      <span
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`block py-2 text-lg font-medium transition-colors cursor-pointer ${
                          location === link.href
                            ? "text-amber-500"
                            : "text-foreground/80 hover:text-amber-500"
                        }`}
                      >
                        {link.label}
                      </span>
                    </Link>
                  ))}
                  <div className="pt-4 border-t border-border/50">
                    <p className="text-sm text-muted-foreground mb-3">{t("nav.sectors")}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {sectors.map((sector) => (
                        <Link key={sector.id} href={sector.path}>
                          <span
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-sm text-foreground/80 hover:text-amber-500 transition-colors cursor-pointer"
                          >
                            {t(sector.key)}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                  <Link href="/contact">
                    <button
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full btn-gold mt-4"
                    >
                      {t("nav.getStarted")}
                    </button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
