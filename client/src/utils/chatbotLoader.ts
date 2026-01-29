/**
 * Utility function to load the DigitalHawk Chatbot dynamically
 * with different bot IDs based on the page/section
 */

// Bot IDs for different pages and sections
export const CHATBOT_IDS = {
  // Main pages
  home: 'VxpsLAS4xEo0hjdaXdKm',
  demo: 'ZclZMRkuvrTqxkGfnC69',

  // Sector demos
  tourisme: 'JEpBBaGAJt2LUW17AO58',
  viticulture: 'UnxoBeMG3BqdLJ2S7MQ4',
  restaurants: 'r9bTh9rS6hQ78Yg32u6o',
  boulangerie: 'lNaP0CDlFJ2n4ImElZrC',
  immobilier: 'EerkxL0lpTVUQ2iXW2yz',
  hebergements: 'TK3JqWuwO8Xo77tYPezN',

  // Product demos (use default demo bot until specific IDs are provided)
  websites: 'ZclZMRkuvrTqxkGfnC69',
  ecommerce: 'ZclZMRkuvrTqxkGfnC69',
} as const;

export type ChatbotId = keyof typeof CHATBOT_IDS;

declare global {
  interface Window {
    DigitalHawkChatbot_id?: string;
    DigitalHawkChatbot_baseUrl?: string;
    DigitalHawkChatbot?: (selector: string) => void;
  }
}

const CHATBOT_BASE_URL = 'https://chatbot-bestoftours.fly.dev/';
const CHATBOT_CSS_URL = `${CHATBOT_BASE_URL}chatbot.css`;
const CHATBOT_JS_URL = `${CHATBOT_BASE_URL}chatbot.js`;

let scriptsLoaded = false;
let currentBotId: string | null = null;

/**
 * Load chatbot scripts (CSS and JS) once
 */
function loadChatbotScripts(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (scriptsLoaded) {
      resolve();
      return;
    }

    // Check if scripts are already loaded
    const existingLink = document.querySelector(`link[href="${CHATBOT_CSS_URL}"]`);
    const existingScript = document.querySelector(`script[src="${CHATBOT_JS_URL}"]`);

    if (existingLink && existingScript) {
      scriptsLoaded = true;
      resolve();
      return;
    }

    // Load CSS
    if (!existingLink) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = CHATBOT_CSS_URL;
      document.head.appendChild(link);
    }

    // Load JS
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = CHATBOT_JS_URL;
      script.async = true;
      script.onload = () => {
        scriptsLoaded = true;
        resolve();
      };
      script.onerror = () => {
        reject(new Error('Failed to load chatbot script'));
      };
      document.head.appendChild(script);
    } else {
      scriptsLoaded = true;
      resolve();
    }
  });
}

/**
 * Remove existing chatbot container
 */
function removeChatbot(): void {
  const existingContainer = document.getElementById('digitalhawk-chatbot-container');
  if (existingContainer) {
    existingContainer.remove();
  }
  currentBotId = null;
}

/**
 * Load chatbot with the specified bot ID
 * @param botId - The ID of the bot to load
 */
export async function loadChatbot(botId: string): Promise<void> {
  if (!botId) {
    console.warn('No bot ID provided');
    return;
  }

  // If same bot is already loaded, don't reload
  if (currentBotId === botId) {
    return;
  }

  try {
    // Load scripts first
    await loadChatbotScripts();

    // Remove existing chatbot if any
    removeChatbot();

    // Wait a bit for cleanup
    await new Promise(resolve => setTimeout(resolve, 100));

    // Initialize new chatbot
    if (typeof window.DigitalHawkChatbot === 'function') {
      window.DigitalHawkChatbot_id = botId;
      window.DigitalHawkChatbot_baseUrl = CHATBOT_BASE_URL;

      const container = document.createElement('div');
      container.id = 'digitalhawk-chatbot-container';
      document.body.appendChild(container);

      window.DigitalHawkChatbot('#digitalhawk-chatbot-container');
      currentBotId = botId;
    } else {
      console.warn('DigitalHawkChatbot function not available');
    }
  } catch (error) {
    console.error('Error loading chatbot:', error);
  }
}

/**
 * Load chatbot by page/section key
 * @param key - The key corresponding to the page/section
 */
export function loadChatbotByKey(key: ChatbotId): Promise<void> {
  const botId = CHATBOT_IDS[key];
  if (!botId) {
    console.warn(`No bot ID found for key: ${key}`);
    return Promise.resolve();
  }
  return loadChatbot(botId);
}

/**
 * Unload the current chatbot
 */
export function unloadChatbot(): void {
  removeChatbot();
}

/**
 * Get the current loaded bot ID
 */
export function getCurrentBotId(): string | null {
  return currentBotId;
}
