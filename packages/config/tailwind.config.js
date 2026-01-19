/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ["class"],
	content: [
		"../../apps/*/components/**/*.{ts,tsx}",
		"../../apps/*/app/**/*.{ts,tsx}",
		"../../packages/ui/components/**/*.{ts,tsx}",
		"../../packages/ui/src/**/*.{ts,tsx}"
	],
	theme: {
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// UntitledUI Palette
				slate: {
					25: '#FCFCFD',
					50: '#F8FAFC',
					100: '#F1F5F9',
					200: '#E2E8F0',
					300: '#CBD5E1',
					400: '#94A3B8',
					500: '#64748B',
					600: '#475569',
					700: '#334155',
					800: '#1E293B',
					900: '#0F172A',
					950: '#020617',
				},
				brand: {
					25: '#F5FAFF',
					50: '#EFF8FF',
					100: '#D1E9FF',
					200: '#B2DDFF',
					300: '#84CAFF',
					400: '#53B1FD',
					500: '#2E90FA',
					600: '#1570EF',
					700: '#175CD3',
					800: '#1849A9',
					900: '#0C111D',
					950: '#000000', // Placeholder for darkest brand
				},
				error: {
					25: '#FFFBFA',
					50: '#FEF3F2',
					100: '#FEE4E2',
					200: '#FECDCA',
					300: '#FDA29B',
					400: '#F97066',
					500: '#F04438',
					600: '#D92D20',
					700: '#B42318',
					800: '#912018',
					900: '#7A271A',
				},
				warning: {
					25: '#FFFCF5',
					50: '#FFFAEB',
					100: '#FEF0C7',
					200: '#FEDF89',
					300: '#FEC84B',
					400: '#FDB022',
					500: '#F79009',
					600: '#DC6803',
					700: '#B54708',
					800: '#93370D',
					900: '#7A2E0E',
				},
				success: {
					25: '#F6FEF9',
					50: '#ECFDF3',
					100: '#D1FADF',
					200: '#A6F4C5',
					300: '#6CE9A6',
					400: '#32D583',
					500: '#12B76A',
					600: '#039855',
					700: '#027A48',
					800: '#05603A',
					900: '#054F31',
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				'xl': '12px',
				'2xl': '16px',
				'3xl': '20px',
				'4xl': '24px',
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: 0
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: 0
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [],
}