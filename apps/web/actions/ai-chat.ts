'use server'

import { generateText } from 'ai'
import { openai } from '@ai-sdk/openai'
import { getLivechatSettings } from './livechat-settings'

export async function generateAIResponse(history: { role: 'user' | 'assistant', content: string }[], message: string) {
    try {
        const settingsRes = await getLivechatSettings()
        const settings = settingsRes.success ? settingsRes.data : null

        const systemPrompt = settings?.aiSystemPrompt || `You are a helpful AI assistant for this website. 
        You strictly answer questions related to the website, its products, and services.
        If a user asks about something unrelated (e.g., general knowledge, math, other websites), politely decline and offer to help with website-related queries.
        Keep your answers concise and professional.`

        const { text } = await generateText({
            model: openai('gpt-4o'),
            system: systemPrompt,
            messages: [
                ...history,
                { role: 'user', content: message }
            ] as any,
        })

        return { success: true, text }
    } catch (error) {
        console.error('AI Generation Error:', error)
        return { success: false, error: 'Failed to generate response' }
    }
}
