/**
 * Shared handoff contract between the offer-family "En parler à Botler"
 * buttons (Q2's two-state CTA rule) and the embedded hero agent: scroll the
 * visitor to the agent and hand it a topic to open with, instead of leaving
 * them facing an empty input.
 */
export const HERO_AGENT_ANCHOR_ID = "botler-live";

export function talkToBotlerAbout(topic: string) {
  document
    .getElementById(HERO_AGENT_ANCHOR_ID)
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
  window.dispatchEvent(new CustomEvent("botler:prequalify", { detail: { topic } }));
}

export type BotlerPrequalifyEvent = CustomEvent<{ topic: string }>;
