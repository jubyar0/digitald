'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options'

export async function getSystemSetting(key: string) {
    try {
        const setting = await prisma.setting.findUnique({
            where: { key },
        })
        return { success: true, value: setting?.value }
    } catch (error) {
        console.error('Error fetching system setting:', error)
        return { success: false, error: 'Failed to fetch setting' }
    }
}

export async function updateSystemSetting(key: string, value: string) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user || session.user.role !== 'ADMIN') {
            return { success: false, error: 'Unauthorized' }
        }

        await prisma.setting.upsert({
            where: { key },
            update: { value },
            create: { key, value, type: 'string' },
        })

        revalidatePath('/admin/settings/ai')
        return { success: true }
    } catch (error) {
        console.error('Error updating system setting:', error)
        return { success: false, error: 'Failed to update setting' }
    }
}

export async function generateProductDescription(prompt: string) {
    try {
        // 1. Check if AI is enabled
        const enabledSetting = await prisma.setting.findUnique({
            where: { key: 'ai_description_enabled' },
        })

        if (enabledSetting?.value !== 'true') {
            return { success: false, error: 'AI description generation is disabled' }
        }

        // 2. Get API Key
        const apiKeySetting = await prisma.setting.findUnique({
            where: { key: 'ai_api_key' },
        })

        if (!apiKeySetting?.value) {
            return { success: false, error: 'AI API key is not configured' }
        }

        const apiKey = apiKeySetting.value;

        // 3. Call OpenAI API (or compatible)
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo', // Or configurable model
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful assistant that writes professional e-commerce product descriptions. Output HTML formatted text.'
                    },
                    {
                        role: 'user',
                        content: `Write a compelling product description for: ${prompt}`
                    }
                ],
                temperature: 0.7,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('AI API Error:', errorData);
            return { success: false, error: 'Failed to generate description from AI provider' }
        }

        const data = await response.json();
        const generatedText = data.choices[0]?.message?.content || '';

        return { success: true, content: generatedText }

    } catch (error) {
        console.error('Error generating product description:', error)
        return { success: false, error: 'Internal server error during AI generation' }
    }
}
