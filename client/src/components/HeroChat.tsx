import { useEffect, useRef, useState, type ReactNode } from "react";
import { Mail, Phone, MessageSquare } from "lucide-react";
import ChatWidget, { type ChatWidgetHandle } from "@/components/ChatWidget";
import { useLanguage } from "@/contexts/LanguageContext";
import type { BotlerPrequalifyEvent } from "@/lib/botlerHandoff";

function DefaultFallback() {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col items-center justify-center gap-4 text-center p-10 rounded-3xl border border-dashed border-border bg-card min-h-[320px]">
      <MessageSquare className="w-8 h-8 text-muted-foreground/60" />
      <p className="text-foreground font-medium">
        {t("home.botlerLive.fallback.title")}
      </p>
      <p className="text-sm text-muted-foreground max-w-sm">
        {t("home.botlerLive.fallback.body")}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
        <a href="mailto:contact@botler360.com" className="btn-outline-gold inline-flex items-center gap-2 text-sm">
          <Mail className="w-4 h-4" /> contact@botler360.com
        </a>
        <a href="tel:+33186260390" className="btn-outline-gold inline-flex items-center gap-2 text-sm">
          <Phone className="w-4 h-4" /> 01 86 26 03 90
        </a>
        <a href="/contact" className="btn-gold inline-flex items-center gap-2 text-sm">
          {t("home.botlerLive.fallback.writeToUs")}
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
  const { language, t } = useLanguage();

  useEffect(() => {
    const handler = (e: Event) => {
      const { topic } = (e as BotlerPrequalifyEvent).detail;
      chatRef.current?.send(t("home.botlerLive.prequalifyMessage").replace("{topic}", topic), "prequalify");
    };
    window.addEventListener("botler:prequalify", handler);
    return () => window.removeEventListener("botler:prequalify", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  if (failed) {
    return <>{fallback ?? <DefaultFallback />}</>;
  }

  const greeting = {
    title: t("home.botlerLive.greeting.title"),
    body: t("home.botlerLive.greeting.body"),
  };
  const quickReplies = [
    { label: t("home.botlerLive.quickReply1"), intent: "commerce" },
    { label: t("home.botlerLive.quickReply2"), intent: "showcase" },
    { label: t("home.botlerLive.quickReply3"), intent: "pricing" },
  ];

  return (
    <ChatWidget
      ref={chatRef}
      mode="inline"
      containerId="botler-live-chat"
      theme="hub"
      avatar={avatar}
      greeting={greeting}
      quickReplies={quickReplies}
      onError={() => setFailed(true)}
      key={language}
    />
  );
}
