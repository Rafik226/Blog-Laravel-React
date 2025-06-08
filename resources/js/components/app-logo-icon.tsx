import { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120" fill="none">
            <defs>
                {/* Gradient definitions for modern look */}
                <linearGradient id="primaryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
                <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>
                <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#000000" floodOpacity="0.1"/>
                </filter>
            </defs>
            
            {/* Background circle with gradient */}
            <circle 
                cx="60" 
                cy="60" 
                r="56" 
                fill="url(#primaryGradient)" 
                filter="url(#shadow)"
            />
            
            {/* Inner white circle for contrast */}
            <circle 
                cx="60" 
                cy="60" 
                r="45" 
                fill="white" 
                opacity="0.95"
            />
            
            {/* Book/Blog icon design */}
            <g transform="translate(30, 25)">
                {/* Main book pages */}
                <rect 
                    x="8" 
                    y="10" 
                    width="44" 
                    height="60" 
                    rx="4" 
                    fill="url(#primaryGradient)" 
                    opacity="0.9"
                />
                
                {/* Book spine highlight */}
                <rect 
                    x="8" 
                    y="10" 
                    width="6" 
                    height="60" 
                    rx="3" 
                    fill="url(#accentGradient)"
                />
                
                {/* Text lines representing blog content */}
                <rect x="18" y="20" width="28" height="3" rx="1.5" fill="white" opacity="0.8" />
                <rect x="18" y="28" width="24" height="2" rx="1" fill="white" opacity="0.6" />
                <rect x="18" y="34" width="30" height="2" rx="1" fill="white" opacity="0.6" />
                <rect x="18" y="40" width="20" height="2" rx="1" fill="white" opacity="0.6" />
                
                {/* Second section */}
                <rect x="18" y="50" width="26" height="3" rx="1.5" fill="white" opacity="0.8" />
                <rect x="18" y="58" width="22" height="2" rx="1" fill="white" opacity="0.6" />
                
                {/* Decorative pen/pencil icon */}
                <g transform="translate(40, 45)">
                    <rect 
                        x="0" 
                        y="0" 
                        width="12" 
                        height="3" 
                        rx="1.5" 
                        fill="url(#accentGradient)" 
                        transform="rotate(45 6 1.5)"
                    />
                    <circle 
                        cx="9" 
                        cy="3" 
                        r="1.5" 
                        fill="url(#accentGradient)" 
                        transform="rotate(45 6 1.5)"
                    />
                </g>
            </g>
            
            {/* Subtle decorative dots around the logo */}
            <circle cx="20" cy="25" r="2" fill="url(#accentGradient)" opacity="0.3" />
            <circle cx="100" cy="35" r="1.5" fill="url(#primaryGradient)" opacity="0.4" />
            <circle cx="15" cy="95" r="1.5" fill="url(#accentGradient)" opacity="0.3" />
            <circle cx="105" cy="85" r="2" fill="url(#primaryGradient)" opacity="0.3" />
        </svg>
    );
}
