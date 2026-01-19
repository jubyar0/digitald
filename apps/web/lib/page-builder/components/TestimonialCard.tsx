// lib/page-builder/components/TestimonialCard.tsx
// Testimonial Card component for Page Builder

import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';

interface TestimonialCardProps {
    quote?: string;
    author?: string;
    role?: string;
    avatarUrl?: string;
    rating?: number;
    className?: string;
}

export function TestimonialCard({
    quote = '"This product has completely transformed how we work. Highly recommended!"',
    author = 'John Doe',
    role = 'CEO, Company',
    avatarUrl = '/placeholder-avatar.jpg',
    rating = 5,
    className,
}: TestimonialCardProps) {
    return (
        <div
            className={cn(
                'relative p-6 rounded-xl bg-card border shadow-sm',
                className
            )}
        >
            {/* Rating stars */}
            <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                        key={i}
                        className={cn(
                            'h-4 w-4',
                            i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted'
                        )}
                    />
                ))}
            </div>

            {/* Quote */}
            <blockquote className="text-lg mb-6">{quote}</blockquote>

            {/* Author */}
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-muted overflow-hidden">
                    {avatarUrl && (
                        <img
                            src={avatarUrl}
                            alt={author}
                            className="h-full w-full object-cover"
                        />
                    )}
                </div>
                <div>
                    <p className="font-medium">{author}</p>
                    <p className="text-sm text-muted-foreground">{role}</p>
                </div>
            </div>
        </div>
    );
}
