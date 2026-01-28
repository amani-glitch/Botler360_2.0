/*
 * Design: Botler360 - Elegant Professional Theme
 * - Supports both light and dark modes
 * - Contact form with glass morphism styling
 * - Contact information cards
 * - Elegant form validation
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, CheckCircle, Clock, Users } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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

export default function Contact() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    sector: "",
    projectType: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contactInfo = [
    {
      icon: Phone,
      title: t("contact.info.phone"),
      value: "01 86 26 03 90",
      href: "tel:+33186260390",
    },
    {
      icon: Mail,
      title: t("contact.info.email"),
      value: "contact@botler360.com",
      href: "mailto:contact@botler360.com",
    },
    {
      icon: MapPin,
      title: t("contact.info.location"),
      value: t("footer.location"),
      href: null,
    },
  ];

  const benefits = [
    {
      icon: Clock,
      title: t("contact.benefits.fast.title"),
      description: t("contact.benefits.fast.desc"),
    },
    {
      icon: Users,
      title: t("contact.benefits.personal.title"),
      description: t("contact.benefits.personal.desc"),
    },
    {
      icon: CheckCircle,
      title: t("contact.benefits.free.title"),
      description: t("contact.benefits.free.desc"),
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success(t("contact.form.success"));
    setFormData({
      name: "",
      email: "",
      company: "",
      sector: "",
      projectType: "",
      phone: "",
      message: "",
    });
    setIsSubmitting(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-background">
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
              {t("contact.title1")} <span className="text-gradient-gold">{t("contact.highlight")}</span>
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-muted-foreground"
            >
              {t("contact.description")}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.div
                variants={fadeInUp}
                className="glass-card rounded-2xl p-8"
              >
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  {t("contact.form.title")}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        {t("contact.form.name")} *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-foreground placeholder-muted-foreground transition-colors"
                        placeholder={t("contact.form.namePlaceholder")}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        {t("contact.form.email")} *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-foreground placeholder-muted-foreground transition-colors"
                        placeholder={t("contact.form.emailPlaceholder")}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        {t("contact.form.company")}
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-foreground placeholder-muted-foreground transition-colors"
                        placeholder={t("contact.form.companyPlaceholder")}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        {t("contact.form.sector")}
                      </label>
                      <select
                        name="sector"
                        value={formData.sector}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-foreground transition-colors"
                      >
                        <option value="">{t("contact.form.sectorPlaceholder")}</option>
                        <option value="tourisme">{t("sector.tourism")}</option>
                        <option value="viticulture">{t("sector.viticulture")}</option>
                        <option value="restaurants">{t("sector.restaurants")}</option>
                        <option value="boulangerie">{t("sector.bakery")}</option>
                        <option value="immobilier">{t("sector.realEstate")}</option>
                        <option value="hebergements">{t("sector.accommodation")}</option>
                        <option value="autre">{t("contact.form.other")}</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        {t("contact.form.projectType")}
                      </label>
                      <select
                        name="projectType"
                        value={formData.projectType}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-foreground transition-colors"
                      >
                        <option value="">{t("contact.form.projectTypePlaceholder")}</option>
                        <option value="chatbot">{t("contact.form.projectType.chatbot")}</option>
                        <option value="website">{t("contact.form.projectType.website")}</option>
                        <option value="website-chatbot">{t("contact.form.projectType.websiteChatbot")}</option>
                        <option value="mobile-app">{t("contact.form.projectType.mobileApp")}</option>
                        <option value="video360">{t("contact.form.projectType.video360")}</option>
                        <option value="music-podcast">{t("contact.form.projectType.musicPodcast")}</option>
                        <option value="custom">{t("contact.form.projectType.custom")}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        {t("contact.form.phone")} <span className="text-muted-foreground text-xs">(optionnel)</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-foreground placeholder-muted-foreground transition-colors"
                        placeholder={t("contact.form.phonePlaceholder")}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {t("contact.form.message")} *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-foreground placeholder-muted-foreground transition-colors resize-none"
                      placeholder={t("contact.form.messagePlaceholder")}
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-gold flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                        {t("contact.form.sending")}
                      </>
                    ) : (
                      <>
                        {t("contact.form.submit")}
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>
                </form>
              </motion.div>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="space-y-8"
            >
              {/* Contact Cards */}
              <motion.div variants={fadeInUp} className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  {t("contact.info.title")}
                </h2>
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={index}
                    variants={fadeInUp}
                    className="glass-card glass-card-hover rounded-xl p-6"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-teal-500/20 flex items-center justify-center">
                        <info.icon className="w-6 h-6 text-amber-500" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {info.title}
                        </p>
                        {info.href ? (
                          <a
                            href={info.href}
                            className="text-lg font-semibold text-foreground hover:text-amber-500 transition-colors"
                          >
                            {info.value}
                          </a>
                        ) : (
                          <p className="text-lg font-semibold text-foreground">
                            {info.value}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Benefits */}
              <motion.div variants={fadeInUp} className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  {t("contact.benefits.title")}
                </h2>
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    variants={fadeInUp}
                    className="flex items-start gap-4"
                  >
                    <div className="w-10 h-10 rounded-lg bg-teal-500/20 flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="w-5 h-5 text-teal-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {benefit.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {benefit.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Mascot */}
              <motion.div
                variants={fadeInUp}
                className="glass-card rounded-2xl p-8 text-center"
              >
                <img
                  src="/images/ChatGPT_Image_Apr_11__2025__03_41_02_PM.png"
                  alt="Botler™"
                  className="w-32 h-32 object-contain mx-auto mb-4"
                />
                <p className="text-foreground/80">
                  {t("contact.mascot")}
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
