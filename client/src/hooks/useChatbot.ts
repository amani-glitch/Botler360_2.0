import { useEffect } from 'react';
import { loadChatbot, loadChatbotByKey, unloadChatbot, ChatbotId, CHATBOT_IDS } from '@/utils/chatbotLoader';

/**
 * React hook to load a chatbot by its ID
 * @param botId - The chatbot ID to load
 */
export function useChatbot(botId: string | null): void {
  useEffect(() => {
    if (botId) {
      loadChatbot(botId);
    }

    return () => {
      // Don't unload on unmount to keep the chatbot visible during navigation
      // Unload will happen when a new bot is loaded
    };
  }, [botId]);
}

/**
 * React hook to load a chatbot by page/section key
 * @param key - The key corresponding to the page/section (e.g., 'home', 'demo', 'tourisme')
 */
export function useChatbotByKey(key: ChatbotId | null): void {
  useEffect(() => {
    if (key) {
      loadChatbotByKey(key);
    }

    return () => {
      // Don't unload on unmount
    };
  }, [key]);
}

/**
 * React hook to unload chatbot when component unmounts
 * Useful for pages that shouldn't have a chatbot
 */
export function useNoChatbot(): void {
  useEffect(() => {
    unloadChatbot();
  }, []);
}

export { CHATBOT_IDS, ChatbotId };
