'use client'

import { useEffect } from 'react'
import { getThemeSettings } from '@/actions/admin'

export function ThemeLoader() {
    useEffect(() => {
        const loadTheme = async () => {
            try {
                const result = await getThemeSettings()
                const theme = result.data

                if (!theme) return

                // Create style element
                const style = document.createElement('style')
                style.id = 'theme-styles'

                // Remove existing theme styles if any
                const existingStyle = document.getElementById('theme-styles')
                if (existingStyle) {
                    existingStyle.remove()
                }

                style.textContent = `
                    :root {
                        --primary: ${theme.primaryColor};
                        --secondary: ${theme.secondaryColor};
                        --accent: ${theme.accentColor};
                        --background: ${theme.backgroundColor};
                        --foreground: ${theme.foregroundColor};
                        --card: ${theme.cardColor};
                        --card-foreground: ${theme.cardForegroundColor};
                        --border: ${theme.borderColor};
                        --input: ${theme.inputColor};
                        --muted: ${theme.mutedColor};
                        --muted-foreground: ${theme.mutedForegroundColor};
                        --destructive: ${theme.destructiveColor};
                        --radius: ${theme.borderRadius || '0.5rem'};
                        --sidebar-width: ${theme.sidebarWidth || '250px'};
                        --header-height: ${theme.headerHeight || '60px'};
                        ${theme.fontFamily ? `--font-sans: ${theme.fontFamily};` : ''}
                    }

                    .dark {
                        --primary: ${theme.darkPrimaryColor};
                        --secondary: ${theme.darkSecondaryColor};
                        --accent: ${theme.darkAccentColor};
                        --background: ${theme.darkBackgroundColor};
                        --foreground: ${theme.darkForegroundColor};
                        --card: ${theme.darkCardColor};
                        --card-foreground: ${theme.darkCardForegroundColor};
                        --border: ${theme.darkBorderColor};
                        --input: ${theme.darkInputColor};
                        --muted: ${theme.darkMutedColor};
                        --muted-foreground: ${theme.darkMutedForegroundColor};
                        --destructive: ${theme.darkDestructiveColor};
                    }
                `

                document.head.appendChild(style)

                // Apply font size separately as it's not a CSS variable usually
                if (theme.fontSize) {
                    document.documentElement.style.fontSize = theme.fontSize
                }

            } catch (error) {
                console.error('Failed to load theme:', error)
            }
        }

        loadTheme()
    }, [])

    return null
}
