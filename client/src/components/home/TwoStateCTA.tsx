import { Link } from "wouter";
import { ArrowRight, MessageSquare } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { talkToBotlerAbout } from "@/lib/botlerHandoff";

type TwoStateCTAProps =
  | { state: "linked"; href: string; label?: string }
  | { state: "unlinked"; topic: string; label?: string };

/**
 * The Q2 two-state rule: every offer capability either links straight to a
 * landing that's actually for sale ("Voir la page"), or hands the visitor
 * to the embedded agent pre-qualified on that topic ("En parler à Botler")
 * — never a dead link to something not ready to show a prospect.
 */
export default function TwoStateCTA(props: TwoStateCTAProps) {
  const { t } = useLanguage();

  if (props.state === "linked") {
    const label = props.label ?? t("home.cta.viewPage");
    const isExternal = /^https?:\/\//.test(props.href);
    const className =
      "inline-flex items-center gap-1.5 text-sm font-semibold text-amber-600 hover:text-amber-700 hover:gap-2.5 transition-all";

    if (isExternal) {
      return (
        <a href={props.href} target="_blank" rel="noopener noreferrer" className={className}>
          {label}
          <ArrowRight className="w-4 h-4" />
        </a>
      );
    }
    return (
      <Link href={props.href} className={className}>
        {label}
        <ArrowRight className="w-4 h-4" />
      </Link>
    );
  }

  const label = props.label ?? t("home.cta.talkToBotler");
  return (
    <button
      type="button"
      onClick={() => talkToBotlerAbout(props.topic)}
      className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-600 hover:text-amber-700 hover:gap-2.5 transition-all"
    >
      <MessageSquare className="w-4 h-4" />
      {label}
    </button>
  );
}
