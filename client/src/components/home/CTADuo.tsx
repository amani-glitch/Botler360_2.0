import { motion } from "framer-motion";
import { MessageSquare, CalendarDays } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { HERO_AGENT_ANCHOR_ID } from "@/lib/botlerHandoff";

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

interface CTADuoProps {
  className?: string;
}

export default function CTADuo({ className = "" }: CTADuoProps) {
  const { t } = useLanguage();

  return (
    <div className={`flex flex-wrap items-center gap-3 sm:gap-4 ${className}`}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => scrollToId(HERO_AGENT_ANCHOR_ID)}
        className="btn-gold flex items-center gap-2"
      >
        <MessageSquare className="w-4 h-4" />
        {t("home.cta.talkToBotler")}
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => scrollToId("rendez-vous")}
        className="btn-outline-gold flex items-center gap-2"
      >
        <CalendarDays className="w-4 h-4" />
        {t("home.cta.bookMeeting")}
      </motion.button>
    </div>
  );
}
