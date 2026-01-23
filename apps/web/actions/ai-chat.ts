import { generateText } from 'ai'
import { google } from '@ai-sdk/google'
import { getLivechatSettings } from './chatbot-settings'
import { RAGService } from '@/lib/chatbot/rag-service'
import { ContextService } from '@/lib/chatbot/context-service'
import { EscalationService } from '@/lib/chatbot/escalation-service'
import { BASE_KNOWLEDGE } from '@/lib/chatbot/base-knowledge'
import { SMART_COMMERCE_SYSTEM_PROMPT } from '@/lib/chatbot/smart-commerce-prompt'

export async function generateAIResponse(
    history: { role: 'user' | 'assistant'; content: string }[],
    message: string,
    context?: { userId?: string; productId?: string; currentUrl?: string }
) {
    let systemPrompt = ''
    try {
        // 1. Check for Escalation
        const escalationCheck = EscalationService.shouldEscalate(message)
        if (escalationCheck.shouldEscalate) {
            return {
                success: true,
                escalated: true,
                text: "I understand you'd like to speak with a human agent. I'm connecting you now...",
                reason: escalationCheck.reason,
            }
        }

        // 2. Fetch Settings & Context
        const [settingsRes, userContext, productContext, relevantArticles] = await Promise.all([
            getLivechatSettings(),
            ContextService.getUserContext(context?.userId),
            ContextService.getProductContext(context?.productId),
            RAGService.findRelevantArticles(message),
        ])

        const settings = settingsRes.success ? settingsRes.data : null

        // 3. Construct System Prompt
        systemPrompt = SMART_COMMERCE_SYSTEM_PROMPT

        // Append Base Knowledge
        systemPrompt += `\n\n## Knowledge Base\n${BASE_KNOWLEDGE}`

        // Append Knowledge Base Context
        const kbContext = await RAGService.formatContext(relevantArticles)
        if (kbContext) {
            systemPrompt += `\n\n## Relevant Articles\n${kbContext}`
        }

        // Append User/Product Context
        systemPrompt += `\n\n## Current Context`
        if (userContext) {
            systemPrompt += `\nUser: ${userContext.name} (${userContext.email})`
            systemPrompt += `\nRole: ${(userContext as any).role}`
            systemPrompt += `\nRecent Orders: ${JSON.stringify(userContext.recentOrders)}`
        } else {
            systemPrompt += `\nUser: Guest (Not logged in)`
        }

        if (productContext) {
            systemPrompt += `\nViewing Product: ${productContext.name} (Price: ${productContext.price})`
        }

        if (context?.currentUrl) {
            systemPrompt += `\nCurrent URL: ${context.currentUrl}`
        }

        // 4. Generate Response
        const { text } = await generateText({
            model: google('models/gemini-flash-latest'),
            system: systemPrompt,
            messages: [
                ...history,
                { role: 'user', content: message }
            ] as any,
        })

        return { success: true, text, escalated: false }
    } catch (error) {
        console.error('AI Generation Error:', error)
        return { success: false, error: error instanceof Error ? error.message : String(error) }
    }
}
