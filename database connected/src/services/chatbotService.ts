export interface ChatResponse {
  message: string;
  suggestions?: string[];
  links?: { title: string; url: string; }[];
}

class ChatbotService {
  private async processMessage(message: string): Promise<ChatResponse> {
    // Simple response logic - in a real app, this would connect to a backend
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('threat') || lowerMessage.includes('detection')) {
      return {
        message: "Our threat detection system uses advanced AI algorithms to identify potential security threats in real-time. We analyze patterns, behaviors, and anomalies to protect your systems.",
        suggestions: [
          "How accurate is it?",
          "What types of threats?",
          "View detection stats"
        ],
        links: [
          { title: "Learn more about our threat detection", url: "#threat-detection" },
          { title: "Security documentation", url: "#docs" }
        ]
      };
    }

    if (lowerMessage.includes('ai') || lowerMessage.includes('how')) {
      return {
        message: "SentinelAI uses machine learning models trained on vast security datasets. We employ neural networks and anomaly detection algorithms to identify potential threats.",
        suggestions: [
          "AI accuracy rates",
          "Training data",
          "False positive handling"
        ]
      };
    }

    if (lowerMessage.includes('security') || lowerMessage.includes('practice')) {
      return {
        message: "We recommend implementing multi-factor authentication, regular security audits, and keeping all systems updated. Our AI continuously monitors for potential vulnerabilities.",
        suggestions: [
          "Security checklist",
          "Best practices guide",
          "Schedule audit"
        ],
        links: [
          { title: "Security best practices guide", url: "#security-guide" }
        ]
      };
    }

    if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
      return {
        message: "We offer flexible pricing plans starting at $99/month for small businesses. Enterprise plans are available with custom pricing based on your needs.",
        suggestions: [
          "View pricing plans",
          "Enterprise options",
          "Schedule demo"
        ],
        links: [
          { title: "Pricing plans", url: "#pricing" },
          { title: "Contact sales", url: "#contact" }
        ]
      };
    }

    return {
      message: "I can help you with threat detection, AI capabilities, security best practices, or pricing information. What would you like to know more about?",
      suggestions: [
        "Tell me about threat detection",
        "How does the AI work?",
        "Security best practices",
        "Pricing information"
      ]
    };
  }

  async sendMessage(message: string): Promise<ChatResponse> {
    return await this.processMessage(message);
  }
}

export const chatbotService = new ChatbotService();