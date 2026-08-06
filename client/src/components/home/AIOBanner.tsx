import { Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import TwoStateCTA from "./TwoStateCTA";

/**
 * AIO is cross-cutting, not a 5th family (brief §6) — rendered as a plain
 * text strip, not a card with logo badges, since we have no verified
 * permission to imply endorsement from any AI platform.
 */
export default function AIOBanner() {
  const { t } = useLanguage();

  return (
    <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-amber-500/25 bg-amber-500/5 px-6 py-4">
      <div className="flex items-center gap-3 text-center sm:text-left">
        <Sparkles className="w-5 h-5 text-amber-600 flex-shrink-0" />
        <p className="text-sm text-slate-700">{t("home.offer.aio.text")}</p>
      </div>
      <TwoStateCTA state="unlinked" topic="aio" />
    </div>
  );
}
