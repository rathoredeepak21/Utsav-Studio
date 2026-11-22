import React from 'react';
import { DecorativeType } from '@/types/template';

interface DecorativeSVGProps {
  type: DecorativeType;
  color?: string;
  secondaryColor?: string;
  className?: string;
}

export function DecorativeSVG({
  type,
  color = '#D4AF37',
  secondaryColor = '#BE185D',
  className = 'w-full h-full',
}: DecorativeSVGProps) {
  switch (type) {
    case 'ganesha':
      return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          {/* Head & Crown */}
          <path d="M50 12 L55 24 L68 24 L57 32 L61 44 L50 36 L39 44 L43 32 L32 24 L45 24 Z" fill={color} />
          {/* Forehead tilak / Trishul */}
          <path d="M50 26 L50 42 M46 30 Q50 36 50 42 Q50 36 54 30" stroke={secondaryColor} strokeWidth="2" strokeLinecap="round" />
          <circle cx="50" cy="46" r="2.5" fill={secondaryColor} />
          {/* Ears */}
          <path d="M42 40 C30 38 24 46 24 56 C24 68 34 74 44 72" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M58 40 C70 38 76 46 76 56 C76 68 66 74 56 72" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
          {/* Trunk */}
          <path d="M50 48 Q54 62 48 72 Q44 78 50 82 Q56 82 56 76 Q56 70 52 64" stroke={color} strokeWidth="3.5" fill="none" strokeLinecap="round" />
          {/* Modak (sweet) in hand */}
          <circle cx="34" cy="74" r="4" fill={color} />
        </svg>
      );

    case 'om':
      return (
        <svg viewBox="0 0 100 100" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className} style={{ color }}>
          <text x="50" y="68" fontSize="64" fontFamily="serif" textAnchor="middle" fontWeight="bold">ॐ</text>
        </svg>
      );

    case 'swastik':
      return (
        <svg viewBox="0 0 100 100" stroke={color} strokeWidth="5" fill="none" strokeLinecap="square" xmlns="http://www.w3.org/2000/svg" className={className}>
          <line x1="50" y1="20" x2="50" y2="80" />
          <line x1="20" y1="50" x2="80" y2="50" />
          <polyline points="50,20 75,20" />
          <polyline points="80,50 80,75" />
          <polyline points="50,80 25,80" />
          <polyline points="20,50 20,25" />
          <circle cx="35" cy="35" r="2.5" fill={color} stroke="none" />
          <circle cx="65" cy="35" r="2.5" fill={color} stroke="none" />
          <circle cx="35" cy="65" r="2.5" fill={color} stroke="none" />
          <circle cx="65" cy="65" r="2.5" fill={color} stroke="none" />
        </svg>
      );

    case 'kalash':
      return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          {/* Coconut */}
          <ellipse cx="50" cy="32" rx="14" ry="16" fill={color} />
          {/* Mango Leaves */}
          <path d="M50 36 C38 26 30 18 28 14 C36 18 44 26 50 36 Z" fill={secondaryColor} />
          <path d="M50 36 C62 26 70 18 72 14 C64 18 56 26 50 36 Z" fill={secondaryColor} />
          <path d="M50 36 C44 20 42 12 50 8 C58 12 56 20 50 36 Z" fill={secondaryColor} />
          {/* Kalash Pot */}
          <path d="M38 42 L62 42 L66 52 C74 60 72 74 62 82 L38 82 C28 74 26 60 34 52 Z" fill={color} stroke={color} strokeWidth="2" />
          <path d="M36 82 L64 82 L60 88 L40 88 Z" fill={color} />
          {/* Sacred thread (Nadachadi) */}
          <line x1="38" y1="46" x2="62" y2="46" stroke={secondaryColor} strokeWidth="3" />
        </svg>
      );

    case 'lotus':
      return (
        <svg viewBox="0 0 100 65" fill={color} xmlns="http://www.w3.org/2000/svg" className={className}>
          {/* Center Petal */}
          <path d="M50 6 C42 22 38 38 50 54 C62 38 58 22 50 6 Z" />
          {/* Left Petals */}
          <path d="M50 6 C45 25 20 28 12 46 C26 46 38 40 48 48 C49 32 46 16 50 6 Z" opacity="0.85" />
          <path d="M48 48 C32 48 18 52 6 60 C20 62 34 58 46 54 Z" opacity="0.65" />
          {/* Right Petals */}
          <path d="M50 6 C55 25 80 28 88 46 C74 46 62 40 52 48 C51 32 54 16 50 6 Z" opacity="0.85" />
          <path d="M52 48 C68 48 82 52 94 60 C80 62 66 58 54 54 Z" opacity="0.65" />
          <circle cx="50" cy="56" r="3" fill={secondaryColor} />
        </svg>
      );

    case 'diya':
      return (
        <svg viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          {/* Flame */}
          <path d="M50 6 C46 18 42 28 50 40 C58 28 54 18 50 6 Z" fill="#F59E0B" />
          <path d="M50 16 C48 24 46 30 50 38 C54 30 52 24 50 16 Z" fill="#FEF08A" />
          {/* Diya Base */}
          <path d="M20 46 C28 42 72 42 80 46 C84 58 72 70 50 70 C28 70 16 58 20 46 Z" fill={color} stroke={color} strokeWidth="2" />
          <path d="M35 70 L65 70 L60 76 L40 76 Z" fill={color} />
        </svg>
      );

    case 'peacock':
      return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          {/* Body */}
          <path d="M48 30 C48 24 54 20 58 24 C62 28 60 36 54 40 C50 44 48 50 48 58 C48 66 54 74 60 78" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
          {/* Beak & Eye */}
          <path d="M58 24 L64 25" stroke={color} strokeWidth="2" />
          <circle cx="56" cy="24" r="1.5" fill={secondaryColor} />
          {/* Crown Feathers */}
          <path d="M56 20 L54 14 M58 20 L58 12 M60 20 L62 14" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          {/* Feather Plumes */}
          <path d="M48 50 Q30 40 22 52 Q18 64 36 68 Q44 70 48 66" stroke={color} strokeWidth="2.5" fill="none" />
          <circle cx="28" cy="56" r="3.5" fill={secondaryColor} />
          <circle cx="28" cy="56" r="1.5" fill={color} />
        </svg>
      );

    case 'jharokha_arch':
      return (
        <svg viewBox="0 0 200 120" fill="none" stroke={color} strokeWidth="3" xmlns="http://www.w3.org/2000/svg" className={className}>
          {/* Outer Multi-foil Arch */}
          <path d="M10 120 L10 60 Q10 40 30 40 Q40 40 50 30 Q60 20 80 20 Q90 10 100 2 Q110 10 120 20 Q140 20 150 30 Q160 40 170 40 Q190 40 190 60 L190 120" />
          {/* Inner Parallel Arch */}
          <path d="M22 120 L22 65 Q22 48 38 48 Q46 48 56 38 Q64 30 82 30 Q91 22 100 14 Q109 22 118 30 Q136 30 144 38 Q154 48 162 48 Q178 48 178 65 L178 120" strokeWidth="1.5" strokeDasharray="3 3" />
        </svg>
      );

    case 'garland':
      return (
        <svg viewBox="0 0 200 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <path d="M0 8 Q50 32 100 8 Q150 32 200 8" stroke={color} strokeWidth="1.5" fill="none" strokeDasharray="2 2" />
          {/* Hanging flowers */}
          {[15, 35, 55, 75, 95, 115, 135, 155, 175].map((x, i) => (
            <g key={x} transform={`translate(${x}, ${i % 2 === 0 ? 16 : 20})`}>
              <circle cx="0" cy="0" r="4" fill={i % 2 === 0 ? '#F59E0B' : '#E11D48'} />
              <circle cx="0" cy="0" r="1.5" fill="#FFFBEB" />
            </g>
          ))}
        </svg>
      );

    case 'mandala':
      return (
        <svg viewBox="0 0 100 100" fill="none" stroke={color} strokeWidth="1.5" xmlns="http://www.w3.org/2000/svg" className={className}>
          <circle cx="50" cy="50" r="45" strokeDasharray="3 3" opacity="0.6" />
          <circle cx="50" cy="50" r="35" />
          <circle cx="50" cy="50" r="24" strokeWidth="1" />
          <circle cx="50" cy="50" r="12" strokeDasharray="2 2" />
          <path d="M50 5 L50 95 M5 50 L95 50 M18 18 L82 82 M18 82 L82 18" strokeWidth="0.8" opacity="0.5" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <circle
              key={angle}
              cx={50 + 35 * Math.cos((angle * Math.PI) / 180)}
              cy={50 + 35 * Math.sin((angle * Math.PI) / 180)}
              r="2.5"
              fill={color}
              stroke="none"
            />
          ))}
        </svg>
      );

    case 'floral_corner':
      return (
        <svg viewBox="0 0 60 60" fill="none" stroke={color} strokeWidth="2" xmlns="http://www.w3.org/2000/svg" className={className}>
          <path d="M4 56 L4 12 Q4 4 12 4 L56 4" strokeLinecap="round" />
          <path d="M10 48 L10 16 Q10 10 16 10 L48 10" strokeWidth="1" strokeDasharray="2 2" />
          <circle cx="16" cy="16" r="3" fill={color} />
          <path d="M16 16 Q28 8 36 16 Q28 28 16 16" fill={secondaryColor} opacity="0.8" />
        </svg>
      );

    case 'ornate_border':
      return (
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" fill="none" stroke={color} strokeWidth="2" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect x="4" y="4" width="92" height="92" rx="8" />
          <rect x="8" y="8" width="84" height="84" rx="6" strokeWidth="1" strokeDasharray="4 3" opacity="0.7" />
        </svg>
      );

    case 'divider':
      return (
        <div className="flex items-center justify-center space-x-2 text-gold-500 w-full h-full">
          <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-gold-400 to-gold-500" />
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current shrink-0" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" fill={color} />
          </svg>
          <span className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-gold-400 to-gold-500" />
        </div>
      );

    case 'balloons':
      return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          {/* Strings */}
          <path d="M40 50 Q45 75 50 90 M50 46 Q50 72 50 90 M60 50 Q55 75 50 90" stroke="#94A3B8" strokeWidth="1" />
          {/* Left Balloon */}
          <ellipse cx="38" cy="34" rx="14" ry="18" fill="#F43F5E" transform="rotate(-12 38 34)" />
          {/* Right Balloon */}
          <ellipse cx="62" cy="34" rx="14" ry="18" fill="#0EA5E9" transform="rotate(12 62 34)" />
          {/* Center Balloon */}
          <ellipse cx="50" cy="26" rx="15" ry="20" fill={color} />
          {/* Knots */}
          <polygon points="50,46 47,50 53,50" fill={color} />
        </svg>
      );

    case 'rings':
      return (
        <svg viewBox="0 0 100 80" fill="none" stroke={color} strokeWidth="3" xmlns="http://www.w3.org/2000/svg" className={className}>
          <ellipse cx="40" cy="46" rx="18" ry="22" transform="rotate(-15 40 46)" />
          <ellipse cx="60" cy="46" rx="18" ry="22" transform="rotate(15 60 46)" />
          {/* Diamond on right ring */}
          <polygon points="68,22 74,28 68,34 62,28" fill="#E0F2FE" stroke="#38BDF8" strokeWidth="1.5" />
          <circle cx="68" cy="28" r="1.5" fill="#FFFFFF" />
        </svg>
      );

    case 'cradle':
      return (
        <svg viewBox="0 0 100 100" fill="none" stroke={color} strokeWidth="2.5" xmlns="http://www.w3.org/2000/svg" className={className}>
          {/* Hanging ropes */}
          <line x1="20" y1="10" x2="30" y2="45" />
          <line x1="80" y1="10" x2="70" y2="45" />
          {/* Cradle Basket */}
          <path d="M26 48 C26 68 74 68 74 48 Z" fill={secondaryColor} opacity="0.3" stroke={color} strokeWidth="2.5" />
          {/* Cushion */}
          <path d="M32 50 C38 58 62 58 68 50" stroke={color} strokeWidth="2" strokeDasharray="3 2" />
        </svg>
      );

    case 'flute':
      return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          {/* Flute */}
          <path d="M15 75 L85 25" stroke={color} strokeWidth="4" strokeLinecap="round" />
          {/* Holes */}
          {[35, 45, 55, 65, 75].map((p, i) => (
            <circle
              key={p}
              cx={15 + (70 * p) / 100}
              cy={75 - (50 * p) / 100}
              r="1.5"
              fill={secondaryColor}
            />
          ))}
          {/* Peacock Feather on top */}
          <path d="M78 20 C84 10 94 14 90 26 C86 36 78 28 78 20 Z" fill="#0D9488" stroke={color} strokeWidth="1" />
          <circle cx="84" cy="22" r="3" fill="#0284C7" />
          <circle cx="84" cy="22" r="1.5" fill="#F59E0B" />
        </svg>
      );

    default:
      return null;
  }
}
