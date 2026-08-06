import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import TwoStateCTA from "./TwoStateCTA";
import PlaceholderCapture from "./PlaceholderCapture";

type CapabilityCTA =
  | { state: "linked"; href: string }
  | { state: "unlinked"; topic: string };

interface Capability {
  label: string;
  cta: CapabilityCTA;
}

interface Capture {
  label: string;
  icon?: LucideIcon;
}

interface OfferFamilyCardProps {
  icon: LucideIcon;
  title: string;
  benefit: string;
  capabilities: Capability[];
  captures: Capture[];
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function OfferFamilyCard({
  icon: Icon,
  title,
  benefit,
  capabilities,
  captures,
}: OfferFamilyCardProps) {
  return (
    <motion.div
      variants={fadeInUp}
      className="rounded-2xl p-6 h-full flex flex-col gap-5 bg-white border border-slate-200 shadow-sm"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-amber-500/15 flex items-center justify-center flex-shrink-0">
          <Icon className="w-6 h-6 text-amber-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          <p className="text-sm text-slate-500 mt-1">{benefit}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {captures.map((capture) => (
          <PlaceholderCapture key={capture.label} icon={capture.icon} label={capture.label} variant="tile" tone="light" />
        ))}
      </div>

      <ul className="space-y-2 mt-auto pt-2 border-t border-slate-200">
        {capabilities.map((cap) => (
          <li key={cap.label} className="flex items-center justify-between gap-3 text-sm">
            <span className="text-slate-600">{cap.label}</span>
            <TwoStateCTA {...cap.cta} />
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
