/*
 * Design: Botler360 - Elegant Professional Theme
 * - Supports both light and dark modes
 * - Gold accents for links and highlights
 * - Clean, professional layout
 */

import { Link, useLocation } from "wouter";
import { Mail, Phone, MapPin, Linkedin, Facebook, Instagram, Youtube, Heart, Users, Shield, Award, Globe, Smile } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();
  const [location, setLocation] = useLocation();

  const footerLinks = {
    company: [
      { label: t("nav.home"), href: "/" },
      { label: t("nav.solutions"), href: "/solutions" },
      { label: t("nav.demo"), href: "/demo" },
      { label: t("nav.contact"), href: "/contact" },
    ],
    sectors: [
      { label: t("sector.tourism"), href: "/demo/tourisme" },
      { label: t("sector.viticulture"), href: "/demo/viticulture" },
      { label: t("sector.restaurants"), href: "/demo/restaurants" },
      { label: t("sector.bakery"), href: "/demo/boulangerie" },
      { label: t("sector.realEstate"), href: "/demo/immobilier" },
      { label: t("sector.accommodation"), href: "/demo/hebergements" },
    ],
    legal: [
      { label: t("footer.legal"), href: "#" },
      { label: t("footer.privacy"), href: "#" },
      { label: t("footer.cookies"), href: "#" },
    ],
  };

  const handleSectorClick = (href: string) => {
    // Navigate to the demo page
    setLocation(href);
    // Scroll to top after navigation
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  };

  return (
    <footer className="relative bg-gradient-to-b from-background to-slate-200/50 dark:to-slate-900/50 border-t border-border/30">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />

      <div className="relative container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link href="/">
              <div className="flex items-center cursor-pointer">
                <img
                  src="/images/botler-logo-full.png"
                  alt="Botler Logo"
                  className="h-16 w-auto object-contain"
                />
              </div>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {t("footer.description")}
            </p>
            <div className="flex gap-4">
              {[
                { Icon: Facebook, href: "https://www.facebook.com/people/Botler/61578054225762" },
                { Icon: Instagram, href: "https://www.instagram.com/botler360?igsh=MWV4eGxqdjVnMjZkeQ%3D%3D" },
                { Icon: Linkedin, href: "https://www.linkedin.com/company/botler360" },
                { Icon: Youtube, href: "https://www.youtube.com/channel/UCXGBmM4ea5JYCFvbUJMk6Fw" },
              ].map(({ Icon, href }, index) => (
                <motion.a
                  key={index}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-10 h-10 rounded-lg glass-card flex items-center justify-center text-muted-foreground hover:text-amber-500 transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-6">{t("footer.company")}</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link href={link.href}>
                    <span className="text-muted-foreground hover:text-amber-500 transition-colors text-sm cursor-pointer">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sectors Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-6">{t("nav.sectors")}</h4>
            <ul className="space-y-3">
              {footerLinks.sectors.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => handleSectorClick(link.href)}
                    className="text-muted-foreground hover:text-amber-500 transition-colors text-sm cursor-pointer text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-foreground mb-6">{t("nav.contact")}</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-amber-500" />
                </div>
                <a href="tel:+33186260390" className="hover:text-amber-500 transition-colors">
                  01 86 26 03 90
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-amber-500" />
                </div>
                <a href="mailto:contact@botler360.com" className="hover:text-amber-500 transition-colors">
                  contact@botler360.com
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-amber-500" />
                </div>
                <span>{t("footer.location")}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Trust Messages */}
        <div className="mt-12 pt-8 border-t border-border/30">
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {[
              { icon: Users, text: t("footer.trust.humanTeam") },
              { icon: Heart, text: t("footer.trust.support") },
              { icon: Globe, text: t("footer.trust.location") },
              { icon: Shield, text: t("footer.trust.ethical") },
              { icon: Award, text: t("footer.trust.ownership") },
              { icon: Smile, text: t("footer.trust.smile") },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background/50 border border-border/30"
              >
                <item.icon className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span className="text-xs text-muted-foreground">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border/30">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Botler™. {t("footer.rights")}
            </p>
            <div className="flex gap-6">
              {footerLinks.legal.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-amber-500 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
          <p className="text-center text-xs text-muted-foreground/60 mt-6">
            {t("footer.tagline")}
          </p>
        </div>
      </div>
    </footer>
  );
}
