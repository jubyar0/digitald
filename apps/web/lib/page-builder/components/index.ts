// lib/page-builder/components/index.ts
// Component Registration - registers all built-in and Magic UI components

import { registry } from '../registry';

// Base Components
import { Section } from './Section';
import { Container } from './Container';
import { Grid } from './Grid';
import { Flex } from './Flex';
import { Heading } from './Heading';
import { Paragraph } from './Paragraph';
import { ImageComponent } from './Image';
import { ButtonComponent } from './Button';
import { Spacer } from './Spacer';
import { Divider } from './Divider';

// Magic UI Components
import { ShimmerButton } from '@/components/ui/shimmer-button';
import { BentoGrid, BentoCard } from '@/components/ui/bento-grid';
import { AnimatedBeam } from '@/components/ui/animated-beam';
import { MagicCard } from '@/components/ui/magic-card';
import { BorderBeam } from '@/components/ui/border-beam';
import { Marquee } from '@/components/ui/marquee';
import { NumberTicker } from '@/components/ui/number-ticker';
import { AnimatedGridPattern } from '@/components/ui/animated-grid-pattern';
import { AnimatedGradientText } from '@/components/ui/animated-gradient-text';
import { BlurFade } from '@/components/ui/blur-fade';
import { Meteors } from '@/components/ui/meteors';
import { Particles } from '@/components/ui/particles';
import { OrbitingCircles } from '@/components/ui/orbiting-circles';

// Aceternity UI Components
import { CardSpotlight } from '@/components/ui/card-spotlight';
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient';
import { MovingBorder, GlowingButton } from '@/components/ui/moving-border';

// ============================================
// LAYOUT COMPONENTS
// ============================================

registry.register('Section', {
    component: Section,
    defaultProps: {},
    defaultStyles: {
        padding: { desktop: { top: 48, right: 24, bottom: 48, left: 24 } },
    },
    category: 'layout',
    icon: 'LayoutTemplate',
    label: 'Section',
    description: 'A full-width section container',
    allowChildren: true,
    editableProps: [
        { key: 'styles.backgroundColor', label: 'Background Color', type: 'color' },
        { key: 'styles.padding', label: 'Padding', type: 'spacing', responsive: true },
        { key: 'styles.minHeight', label: 'Min Height', type: 'text' },
    ],
});

registry.register('Container', {
    component: Container,
    defaultProps: { maxWidth: 'xl' },
    defaultStyles: {},
    category: 'layout',
    icon: 'Square',
    label: 'Container',
    description: 'Centered container with max-width',
    allowChildren: true,
    editableProps: [
        {
            key: 'props.maxWidth',
            label: 'Max Width',
            type: 'select',
            options: [
                { label: 'Small', value: 'sm' },
                { label: 'Medium', value: 'md' },
                { label: 'Large', value: 'lg' },
                { label: 'Extra Large', value: 'xl' },
                { label: '2XL', value: '2xl' },
                { label: 'Full', value: 'full' },
            ]
        },
    ],
});

registry.register('Grid', {
    component: Grid,
    defaultProps: { columns: 3, gap: 16 },
    defaultStyles: {},
    category: 'layout',
    icon: 'Grid3X3',
    label: 'Grid',
    description: 'CSS Grid layout',
    allowChildren: true,
    editableProps: [
        { key: 'props.columns', label: 'Columns', type: 'number', min: 1, max: 12 },
        { key: 'props.gap', label: 'Gap (px)', type: 'number', min: 0, max: 100 },
    ],
});

registry.register('Flex', {
    component: Flex,
    defaultProps: { direction: 'row', justify: 'start', align: 'stretch', gap: 16 },
    defaultStyles: {},
    category: 'layout',
    icon: 'AlignHorizontalJustifyCenter',
    label: 'Flex',
    description: 'Flexbox layout',
    allowChildren: true,
    editableProps: [
        {
            key: 'props.direction',
            label: 'Direction',
            type: 'select',
            options: [
                { label: 'Row', value: 'row' },
                { label: 'Column', value: 'column' },
                { label: 'Row Reverse', value: 'row-reverse' },
                { label: 'Column Reverse', value: 'column-reverse' },
            ]
        },
        {
            key: 'props.justify',
            label: 'Justify',
            type: 'select',
            options: [
                { label: 'Start', value: 'start' },
                { label: 'Center', value: 'center' },
                { label: 'End', value: 'end' },
                { label: 'Between', value: 'between' },
                { label: 'Around', value: 'around' },
            ]
        },
        {
            key: 'props.align',
            label: 'Align',
            type: 'select',
            options: [
                { label: 'Start', value: 'start' },
                { label: 'Center', value: 'center' },
                { label: 'End', value: 'end' },
                { label: 'Stretch', value: 'stretch' },
            ]
        },
        { key: 'props.gap', label: 'Gap (px)', type: 'number', min: 0, max: 100 },
    ],
});

registry.register('Spacer', {
    component: Spacer,
    defaultProps: { height: 32 },
    defaultStyles: {},
    category: 'layout',
    icon: 'SeparatorVertical',
    label: 'Spacer',
    description: 'Vertical spacing',
    allowChildren: false,
    editableProps: [
        { key: 'props.height', label: 'Height (px)', type: 'number', min: 0, max: 500 },
    ],
});

registry.register('Divider', {
    component: Divider,
    defaultProps: { orientation: 'horizontal' },
    defaultStyles: {},
    category: 'layout',
    icon: 'Minus',
    label: 'Divider',
    description: 'Horizontal or vertical line',
    allowChildren: false,
    editableProps: [
        {
            key: 'props.orientation',
            label: 'Orientation',
            type: 'select',
            options: [
                { label: 'Horizontal', value: 'horizontal' },
                { label: 'Vertical', value: 'vertical' },
            ]
        },
    ],
});

// ============================================
// CONTENT COMPONENTS
// ============================================

registry.register('Heading', {
    component: Heading,
    defaultProps: { text: 'Heading', level: 2 },
    defaultStyles: {},
    category: 'content',
    icon: 'Heading',
    label: 'Heading',
    description: 'Heading text (H1-H6)',
    allowChildren: false,
    editableProps: [
        { key: 'props.text', label: 'Text', type: 'text' },
        {
            key: 'props.level',
            label: 'Level',
            type: 'select',
            options: [
                { label: 'H1', value: '1' },
                { label: 'H2', value: '2' },
                { label: 'H3', value: '3' },
                { label: 'H4', value: '4' },
                { label: 'H5', value: '5' },
                { label: 'H6', value: '6' },
            ]
        },
        { key: 'styles.color', label: 'Color', type: 'color' },
    ],
});

registry.register('Paragraph', {
    component: Paragraph,
    defaultProps: { text: 'Lorem ipsum dolor sit amet...', size: 'base' },
    defaultStyles: {},
    category: 'content',
    icon: 'AlignLeft',
    label: 'Paragraph',
    description: 'Text paragraph',
    allowChildren: false,
    editableProps: [
        { key: 'props.text', label: 'Text', type: 'textarea' },
        {
            key: 'props.size',
            label: 'Size',
            type: 'select',
            options: [
                { label: 'Small', value: 'sm' },
                { label: 'Base', value: 'base' },
                { label: 'Large', value: 'lg' },
                { label: 'Extra Large', value: 'xl' },
            ]
        },
        { key: 'styles.color', label: 'Color', type: 'color' },
    ],
});

registry.register('Image', {
    component: ImageComponent,
    defaultProps: {
        src: '/placeholder.jpg',
        alt: 'Image',
        width: 400,
        height: 300,
        objectFit: 'cover'
    },
    defaultStyles: {},
    category: 'media',
    icon: 'Image',
    label: 'Image',
    description: 'Image element',
    allowChildren: false,
    editableProps: [
        { key: 'props.src', label: 'Image URL', type: 'image' },
        { key: 'props.alt', label: 'Alt Text', type: 'text' },
        { key: 'props.width', label: 'Width (px)', type: 'number', min: 0 },
        { key: 'props.height', label: 'Height (px)', type: 'number', min: 0 },
        {
            key: 'props.objectFit',
            label: 'Object Fit',
            type: 'select',
            options: [
                { label: 'Cover', value: 'cover' },
                { label: 'Contain', value: 'contain' },
                { label: 'Fill', value: 'fill' },
                { label: 'None', value: 'none' },
            ]
        },
    ],
});

registry.register('Button', {
    component: ButtonComponent,
    defaultProps: { text: 'Click Me', variant: 'default', size: 'md' },
    defaultStyles: {},
    category: 'interactive',
    icon: 'MousePointerClick',
    label: 'Button',
    description: 'Clickable button',
    allowChildren: false,
    editableProps: [
        { key: 'props.text', label: 'Text', type: 'text' },
        { key: 'props.href', label: 'Link URL', type: 'link' },
        {
            key: 'props.variant',
            label: 'Variant',
            type: 'select',
            options: [
                { label: 'Default', value: 'default' },
                { label: 'Outline', value: 'outline' },
                { label: 'Ghost', value: 'ghost' },
            ]
        },
        {
            key: 'props.size',
            label: 'Size',
            type: 'select',
            options: [
                { label: 'Small', value: 'sm' },
                { label: 'Medium', value: 'md' },
                { label: 'Large', value: 'lg' },
            ]
        },
    ],
});

// ============================================
// MAGIC UI COMPONENTS
// ============================================

registry.register('ShimmerButton', {
    component: ShimmerButton,
    defaultProps: { children: 'Shimmer Button' },
    defaultStyles: {},
    category: 'magic-ui',
    icon: 'Sparkles',
    label: 'Shimmer Button',
    description: 'Animated shimmer button',
    allowChildren: false,
    editableProps: [
        { key: 'props.children', label: 'Button Text', type: 'text' },
    ],
});

registry.register('MagicCard', {
    component: MagicCard,
    defaultProps: {},
    defaultStyles: {
        padding: { desktop: { top: 24, right: 24, bottom: 24, left: 24 } },
    },
    category: 'magic-ui',
    icon: 'Layers',
    label: 'Magic Card',
    description: 'Card with spotlight effect',
    allowChildren: true,
    editableProps: [
        { key: 'styles.padding', label: 'Padding', type: 'spacing', responsive: true },
    ],
});

registry.register('BorderBeam', {
    component: BorderBeam,
    defaultProps: {},
    defaultStyles: {},
    category: 'magic-ui',
    icon: 'SquareDashed',
    label: 'Border Beam',
    description: 'Animated border effect',
    allowChildren: false,
    editableProps: [],
});

registry.register('Marquee', {
    component: Marquee,
    defaultProps: { pauseOnHover: true },
    defaultStyles: {},
    category: 'magic-ui',
    icon: 'MoveHorizontal',
    label: 'Marquee',
    description: 'Infinite scrolling content',
    allowChildren: true,
    editableProps: [
        { key: 'props.pauseOnHover', label: 'Pause on Hover', type: 'boolean' },
    ],
});

registry.register('NumberTicker', {
    component: NumberTicker,
    defaultProps: { value: 100 },
    defaultStyles: {},
    category: 'magic-ui',
    icon: 'Hash',
    label: 'Number Ticker',
    description: 'Animated counting number',
    allowChildren: false,
    editableProps: [
        { key: 'props.value', label: 'Target Value', type: 'number' },
    ],
});

registry.register('AnimatedGridPattern', {
    component: AnimatedGridPattern,
    defaultProps: {},
    defaultStyles: {},
    category: 'magic-ui',
    icon: 'Grid2X2',
    label: 'Grid Pattern',
    description: 'Animated background grid',
    allowChildren: false,
    editableProps: [],
});

registry.register('AnimatedGradientText', {
    component: AnimatedGradientText,
    defaultProps: { children: 'Gradient Text', speed: 1, colorFrom: '#ffaa40', colorTo: '#9c40ff' },
    defaultStyles: {},
    category: 'magic-ui',
    icon: 'Type',
    label: 'Gradient Text',
    description: 'Animated gradient text effect',
    allowChildren: false,
    editableProps: [
        { key: 'props.children', label: 'Text', type: 'text' },
        { key: 'props.speed', label: 'Animation Speed', type: 'number', min: 0.1, max: 5, step: 0.1 },
        { key: 'props.colorFrom', label: 'Color From', type: 'color' },
        { key: 'props.colorTo', label: 'Color To', type: 'color' },
    ],
});

registry.register('BlurFade', {
    component: BlurFade,
    defaultProps: { duration: 0.4, delay: 0, direction: 'down', blur: '6px' },
    defaultStyles: {},
    category: 'magic-ui',
    icon: 'Wand2',
    label: 'Blur Fade',
    description: 'Content with blur fade animation',
    allowChildren: true,
    editableProps: [
        { key: 'props.duration', label: 'Duration (s)', type: 'number', min: 0.1, max: 3, step: 0.1 },
        { key: 'props.delay', label: 'Delay (s)', type: 'number', min: 0, max: 5, step: 0.1 },
        {
            key: 'props.direction',
            label: 'Direction',
            type: 'select',
            options: [
                { label: 'Up', value: 'up' },
                { label: 'Down', value: 'down' },
                { label: 'Left', value: 'left' },
                { label: 'Right', value: 'right' },
            ]
        },
    ],
});

registry.register('Meteors', {
    component: Meteors,
    defaultProps: { number: 20, angle: 215 },
    defaultStyles: {},
    category: 'magic-ui',
    icon: 'Sparkle',
    label: 'Meteors',
    description: 'Meteor shower effect',
    allowChildren: false,
    editableProps: [
        { key: 'props.number', label: 'Number of Meteors', type: 'number', min: 5, max: 50 },
        { key: 'props.angle', label: 'Angle', type: 'number', min: 0, max: 360 },
    ],
});

registry.register('Particles', {
    component: Particles,
    defaultProps: { quantity: 100, color: '#ffffff', size: 0.4 },
    defaultStyles: { height: { desktop: '400px' } },
    category: 'magic-ui',
    icon: 'Stars',
    label: 'Particles',
    description: 'Interactive particle background',
    allowChildren: false,
    editableProps: [
        { key: 'props.quantity', label: 'Quantity', type: 'number', min: 10, max: 300 },
        { key: 'props.color', label: 'Color', type: 'color' },
        { key: 'props.size', label: 'Size', type: 'number', min: 0.1, max: 2, step: 0.1 },
    ],
});

registry.register('OrbitingCircles', {
    component: OrbitingCircles,
    defaultProps: { radius: 160, duration: 20, reverse: false },
    defaultStyles: {},
    category: 'magic-ui',
    icon: 'Circle',
    label: 'Orbiting Circles',
    description: 'Orbital animation effect',
    allowChildren: true,
    editableProps: [
        { key: 'props.radius', label: 'Radius', type: 'number', min: 50, max: 400 },
        { key: 'props.duration', label: 'Duration (s)', type: 'number', min: 5, max: 60 },
        { key: 'props.reverse', label: 'Reverse', type: 'boolean' },
    ],
});

// ============================================
// ACETERNITY UI COMPONENTS
// ============================================

registry.register('CardSpotlight', {
    component: CardSpotlight,
    defaultProps: { radius: 350, color: '#262626' },
    defaultStyles: {
        padding: { desktop: { top: 24, right: 24, bottom: 24, left: 24 } },
    },
    category: 'aceternity',
    icon: 'Lightbulb',
    label: 'Card Spotlight',
    description: 'Card with spotlight reveal effect',
    allowChildren: true,
    editableProps: [
        { key: 'props.radius', label: 'Spotlight Radius', type: 'number', min: 100, max: 600 },
        { key: 'props.color', label: 'Spotlight Color', type: 'color' },
        { key: 'styles.padding', label: 'Padding', type: 'spacing', responsive: true },
    ],
});

registry.register('HoverBorderGradient', {
    component: HoverBorderGradient,
    defaultProps: { children: 'Hover Me', duration: 1, clockwise: true },
    defaultStyles: {},
    category: 'aceternity',
    icon: 'RectangleHorizontal',
    label: 'Gradient Border',
    description: 'Button with animated gradient border',
    allowChildren: false,
    editableProps: [
        { key: 'props.children', label: 'Text', type: 'text' },
        { key: 'props.duration', label: 'Animation Duration (s)', type: 'number', min: 0.5, max: 5, step: 0.5 },
        { key: 'props.clockwise', label: 'Clockwise', type: 'boolean' },
    ],
});

registry.register('MovingBorder', {
    component: MovingBorder,
    defaultProps: { children: 'Moving Border', duration: 2000 },
    defaultStyles: {},
    category: 'aceternity',
    icon: 'Scan',
    label: 'Moving Border',
    description: 'Element with animated moving border',
    allowChildren: false,
    editableProps: [
        { key: 'props.children', label: 'Text', type: 'text' },
        { key: 'props.duration', label: 'Animation Duration (ms)', type: 'number', min: 500, max: 10000, step: 500 },
    ],
});

registry.register('GlowingButton', {
    component: GlowingButton,
    defaultProps: { children: 'Glowing Button' },
    defaultStyles: {},
    category: 'aceternity',
    icon: 'Zap',
    label: 'Glowing Button',
    description: 'Button with animated glow effect',
    allowChildren: false,
    editableProps: [
        { key: 'props.children', label: 'Text', type: 'text' },
    ],
});

// ============================================
// FORM COMPONENTS
// ============================================

// Import form components
import { FormInput } from './FormInput';
import { FormTextarea } from './FormTextarea';

registry.register('FormInput', {
    component: FormInput,
    defaultProps: { label: 'Email', placeholder: 'Enter your email...', type: 'email', required: false },
    defaultStyles: {},
    category: 'interactive',
    icon: 'TextCursor',
    label: 'Form Input',
    description: 'Input field with label',
    allowChildren: false,
    editableProps: [
        { key: 'props.label', label: 'Label', type: 'text' },
        { key: 'props.placeholder', label: 'Placeholder', type: 'text' },
        {
            key: 'props.type',
            label: 'Input Type',
            type: 'select',
            options: [
                { label: 'Text', value: 'text' },
                { label: 'Email', value: 'email' },
                { label: 'Password', value: 'password' },
                { label: 'Number', value: 'number' },
                { label: 'Phone', value: 'tel' },
            ]
        },
        { key: 'props.required', label: 'Required', type: 'boolean' },
    ],
});

registry.register('FormTextarea', {
    component: FormTextarea,
    defaultProps: { label: 'Message', placeholder: 'Enter your message...', rows: 4, required: false },
    defaultStyles: {},
    category: 'interactive',
    icon: 'AlignJustify',
    label: 'Form Textarea',
    description: 'Multi-line text input',
    allowChildren: false,
    editableProps: [
        { key: 'props.label', label: 'Label', type: 'text' },
        { key: 'props.placeholder', label: 'Placeholder', type: 'text' },
        { key: 'props.rows', label: 'Rows', type: 'number', min: 2, max: 20 },
        { key: 'props.required', label: 'Required', type: 'boolean' },
    ],
});

// ============================================
// TEMPLATE COMPONENTS
// ============================================

// Import template components
import { HeroSection } from './HeroSection';
import { TestimonialCard } from './TestimonialCard';
import { FeatureCard } from './FeatureCard';

registry.register('HeroSection', {
    component: HeroSection,
    defaultProps: {
        title: 'Welcome to Our Platform',
        subtitle: 'Build beautiful pages with our drag-and-drop page builder',
        ctaText: 'Get Started',
        ctaLink: '#',
        backgroundStyle: 'gradient'
    },
    defaultStyles: {},
    category: 'layout',
    icon: 'PanelTop',
    label: 'Hero Section',
    description: 'Pre-built hero section template',
    allowChildren: false,
    editableProps: [
        { key: 'props.title', label: 'Title', type: 'text' },
        { key: 'props.subtitle', label: 'Subtitle', type: 'textarea' },
        { key: 'props.ctaText', label: 'Button Text', type: 'text' },
        { key: 'props.ctaLink', label: 'Button Link', type: 'link' },
        {
            key: 'props.backgroundStyle',
            label: 'Background',
            type: 'select',
            options: [
                { label: 'Gradient', value: 'gradient' },
                { label: 'Solid', value: 'solid' },
                { label: 'Image', value: 'image' },
            ]
        },
    ],
});

registry.register('TestimonialCard', {
    component: TestimonialCard,
    defaultProps: {
        quote: '"This product has completely transformed how we work. Highly recommended!"',
        author: 'John Doe',
        role: 'CEO, Company',
        rating: 5
    },
    defaultStyles: {},
    category: 'content',
    icon: 'Quote',
    label: 'Testimonial Card',
    description: 'Customer testimonial with rating',
    allowChildren: false,
    editableProps: [
        { key: 'props.quote', label: 'Quote', type: 'textarea' },
        { key: 'props.author', label: 'Author Name', type: 'text' },
        { key: 'props.role', label: 'Author Role', type: 'text' },
        { key: 'props.rating', label: 'Rating', type: 'number', min: 1, max: 5 },
    ],
});

registry.register('FeatureCard', {
    component: FeatureCard,
    defaultProps: {
        icon: 'Zap',
        title: 'Feature Title',
        description: 'A brief description of this amazing feature that your product offers.'
    },
    defaultStyles: {},
    category: 'content',
    icon: 'LayoutGrid',
    label: 'Feature Card',
    description: 'Feature showcase card with icon',
    allowChildren: false,
    editableProps: [
        { key: 'props.icon', label: 'Icon Name', type: 'text', placeholder: 'Lucide icon name (e.g., Zap, Star, Check)' },
        { key: 'props.title', label: 'Title', type: 'text' },
        { key: 'props.description', label: 'Description', type: 'textarea' },
    ],
});

// Export registry for use
export { registry };

// Helper to get component categories with labels
export const componentCategories = [
    { id: 'layout', label: 'Layout', icon: 'LayoutTemplate' },
    { id: 'content', label: 'Content', icon: 'Type' },
    { id: 'media', label: 'Media', icon: 'Image' },
    { id: 'interactive', label: 'Interactive', icon: 'MousePointerClick' },
    { id: 'magic-ui', label: 'Magic UI', icon: 'Sparkles' },
    { id: 'aceternity', label: 'Aceternity', icon: 'Wand2' },
] as const;
