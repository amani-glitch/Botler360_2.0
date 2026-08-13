import { useEffect, useRef, useState, type ReactNode } from "react";
import { Mail, Phone, MessageSquare } from "lucide-react";
import ChatWidget, { type ChatWidgetHandle } from "@/components/ChatWidget";
import { useLanguage } from "@/contexts/LanguageContext";
import type { BotlerPrequalifyEvent } from "@/lib/botlerHandoff";

const QUICK_REPLIES = [
  { label: "Je tiens un commerce, qu'est-ce que vous faites pour moi ?", intent: "commerce" },
  { label: "Montre-moi un site que vous avez fait", intent: "showcase" },
  { label: "Combien ça coûte et en combien de temps ?", intent: "pricing" },
];

const GREETING = {
  title: "Bonjour, je suis Botler.",
  body: "Dites-moi ce qui vous amène, je vous oriente en quelques secondes.",
};

function DefaultFallback() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 text-center p-10 rounded-3xl border border-dashed border-border bg-card min-h-[320px]">
      <MessageSquare className="w-8 h-8 text-muted-foreground/60" />
      <p className="text-foreground font-medium">
        Botler ne répond pas pour le moment.
      </p>
      <p className="text-sm text-muted-foreground max-w-sm">
        Notre équipe reste joignable directement — écrivez-nous ou réservez un
        créneau, nous revenons vers vous rapidement.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
        <a href="mailto:contact@botler360.com" className="btn-outline-gold inline-flex items-center gap-2 text-sm">
          <Mail className="w-4 h-4" /> contact@botler360.com
        </a>
        <a href="tel:+33186260390" className="btn-outline-gold inline-flex items-center gap-2 text-sm">
          <Phone className="w-4 h-4" /> 01 86 26 03 90
        </a>
        <a href="/contact" className="btn-gold inline-flex items-center gap-2 text-sm">
          Nous écrire
        </a>
      </div>
    </div>
  );
}

interface HeroChatProps {
  avatar?: string;
  fallback?: ReactNode;
}

export default function HeroChat({ avatar = "/images/botler-logo.png", fallback }: HeroChatProps) {
  const chatRef = useRef<ChatWidgetHandle>(null);
  const [failed, setFailed] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    const handler = (e: Event) => {
      const { topic } = (e as BotlerPrequalifyEvent).detail;
      chatRef.current?.send(`Je m'intéresse à : ${topic}`, "prequalify");
    };
    window.addEventListener("botler:prequalify", handler);
    return () => window.removeEventListener("botler:prequalify", handler);
  }, []);

  if (failed) {
    return <>{fallback ?? <DefaultFallback />}</>;
  }

  return (
    <ChatWidget
      ref={chatRef}
      mode="inline"
      containerId="botler-live-chat"
      theme="hub"
      avatar={avatar}
      greeting={GREETING}
      quickReplies={QUICK_REPLIES}
      onError={() => setFailed(true)}
      key={language}
    />
  );
}
