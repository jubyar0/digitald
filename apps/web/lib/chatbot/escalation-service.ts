export class EscalationService {
    private static ESCALATION_KEYWORDS = [
        'human',
        'agent',
        'support',
        'person',
        'representative',
        'talk to someone',
        'real person',
        'live chat',
    ]

    private static NEGATIVE_SENTIMENT_THRESHOLD = -0.5

    static shouldEscalate(message: string, sentimentScore: number = 0): { shouldEscalate: boolean; reason?: string } {
        const lowerMessage = message.toLowerCase()

        // 1. Check keywords
        const matchedKeyword = this.ESCALATION_KEYWORDS.find((k) => lowerMessage.includes(k))
        if (matchedKeyword) {
            return { shouldEscalate: true, reason: `User requested human agent (keyword: "${matchedKeyword}")` }
        }

        // 2. Check sentiment (placeholder for now, assuming score is passed from an analyzer)
        if (sentimentScore <= this.NEGATIVE_SENTIMENT_THRESHOLD) {
            return { shouldEscalate: true, reason: 'Negative sentiment detected' }
        }

        return { shouldEscalate: false }
    }
}
