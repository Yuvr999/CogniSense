import React from 'react';

export interface SceneOption {
  id: string;
  title: string;
  description: string;
}

export const SCENE_OPTIONS: SceneOption[] = [
  {
    id: 'kitchen',
    title: 'Kitchen & Cookie Theft Scene',
    description: 'A classic picture description scene with children and kitchen activities.'
  },
  {
    id: 'picnic',
    title: 'Sunny Park Picnic',
    description: 'A family having a picnic with activities, animals, and pond in a park.'
  },
  {
    id: 'living-room',
    title: 'Cozy Living Room',
    description: 'A family relaxing with books, crafts, pets, and children playing.'
  }
];

export function SceneIllustration({ sceneId }: { sceneId: string }) {
  if (sceneId === 'picnic') {
    return (
      <svg
        viewBox="0 0 800 600"
        className="w-full h-full object-contain select-none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Park Picnic Scene"
      >
        <defs>
          <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#BAE6FD" />
            <stop offset="60%" stopColor="#E0F2FE" />
            <stop offset="100%" stopColor="#FEF08A" />
          </linearGradient>
          <linearGradient id="grassGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#86EFAC" />
            <stop offset="100%" stopColor="#22C55E" />
          </linearGradient>
          <linearGradient id="pondGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>
        </defs>

        {/* Sky Background */}
        <rect width="800" height="380" fill="url(#skyGrad)" />
        
        {/* Sun */}
        <circle cx="680" cy="90" r="45" fill="#FBBF24" />
        <circle cx="680" cy="90" r="55" fill="#FDE047" opacity="0.4" />

        {/* Distant Hills */}
        <path d="M 0 320 Q 200 240, 420 310 T 800 280 L 800 600 L 0 600 Z" fill="#BBF7D0" />
        
        {/* Clouds */}
        <g fill="#FFFFFF" opacity="0.9">
          <ellipse cx="160" cy="110" rx="60" ry="25" />
          <ellipse cx="210" cy="95" rx="45" ry="30" />
          <ellipse cx="120" cy="120" rx="40" ry="20" />

          <ellipse cx="480" cy="80" rx="70" ry="25" />
          <ellipse cx="530" cy="65" rx="50" ry="28" />
        </g>

        {/* Big Tree Left */}
        <rect x="90" y="240" width="45" height="180" rx="8" fill="#78350F" />
        <ellipse cx="112" cy="200" rx="110" ry="90" fill="#15803D" />
        <ellipse cx="140" cy="170" rx="80" ry="70" fill="#16A34A" />
        <ellipse cx="80" cy="180" rx="75" ry="65" fill="#22C55E" />

        {/* Ground / Grass */}
        <path d="M 0 350 Q 260 320, 520 350 T 800 340 L 800 600 L 0 600 Z" fill="url(#grassGrad)" />

        {/* Pond on Right */}
        <ellipse cx="640" cy="460" rx="130" ry="60" fill="url(#pondGrad)" stroke="#0369A1" strokeWidth="4" />
        {/* Duck / Toy Boat in Pond */}
        <path d="M 610 450 Q 625 435, 640 450 Q 635 460, 615 460 Z" fill="#F59E0B" />
        <circle cx="642" cy="442" r="7" fill="#F59E0B" />
        <polygon points="648,443 656,445 648,448" fill="#EA580C" />
        {/* Sailboat */}
        <polygon points="680,430 705,445 680,445" fill="#EF4444" />
        <rect x="670" y="445" width="40" height="8" rx="3" fill="#FFFFFF" />

        {/* Picnic Blanket */}
        <polygon points="220,440 420,430 460,540 180,550" fill="#FEE2E2" stroke="#EF4444" strokeWidth="3" />
        {/* Plaid Pattern on Blanket */}
        <line x1="260" y1="437" x2="235" y2="547" stroke="#EF4444" strokeWidth="2" strokeDasharray="6,6" />
        <line x1="320" y1="434" x2="310" y2="544" stroke="#EF4444" strokeWidth="2" strokeDasharray="6,6" />
        <line x1="380" y1="432" x2="385" y2="542" stroke="#EF4444" strokeWidth="2" strokeDasharray="6,6" />

        {/* Picnic Basket */}
        <rect x="230" y="470" width="55" height="40" rx="6" fill="#B45309" stroke="#78350F" strokeWidth="2" />
        <path d="M 230 480 Q 257 450, 285 480" fill="none" stroke="#78350F" strokeWidth="3" />
        {/* Fruits / Bread / Drinks on Blanket */}
        <circle cx="330" cy="485" r="14" fill="#EF4444" /> {/* Apple */}
        <circle cx="350" cy="488" r="12" fill="#F97316" /> {/* Orange */}
        <rect x="375" y="475" width="28" height="18" rx="4" fill="#FCD34D" stroke="#D97706" /> {/* Sandwich */}
        <rect x="300" y="465" width="12" height="32" rx="3" fill="#0284C7" /> {/* Bottle */}

        {/* Person 1 sitting on blanket (Reading) */}
        <circle cx="270" cy="420" r="16" fill="#FDBA74" />
        <path d="M 258 412 Q 270 400, 282 412" fill="#451A03" />
        <path d="M 252 436 C 252 436, 270 432, 286 436 L 290 480 L 250 480 Z" fill="#3B82F6" />
        {/* Book */}
        <polygon points="280,445 305,440 305,460 280,465" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2" />

        {/* Person 2 (Child flying a kite) */}
        <circle cx="480" cy="380" r="13" fill="#FDBA74" />
        <rect x="472" y="393" width="16" height="32" rx="4" fill="#EC4899" />
        <line x1="476" y1="425" x2="472" y2="465" stroke="#1E293B" strokeWidth="4" />
        <line x1="484" y1="425" x2="488" y2="465" stroke="#1E293B" strokeWidth="4" />
        <line x1="488" y1="400" x2="520" y2="370" stroke="#1E293B" strokeWidth="3" />
        
        {/* Kite String & Kite in Sky */}
        <path d="M 520 370 Q 560 300, 600 170" fill="none" stroke="#94A3B8" strokeWidth="2" strokeDasharray="3,3" />
        <polygon points="600,170 630,140 650,175 620,205" fill="#F43F5E" stroke="#9F1239" strokeWidth="2" />
        <line x1="600" y1="170" x2="650" y2="175" stroke="#9F1239" strokeWidth="2" />
        <line x1="630" y1="140" x2="620" y2="205" stroke="#9F1239" strokeWidth="2" />
        {/* Kite Tail Ribbon */}
        <path d="M 620 205 Q 635 230, 615 250 T 630 280" fill="none" stroke="#FBBF24" strokeWidth="3" />

        {/* Dog running */}
        <ellipse cx="140" cy="490" rx="26" ry="16" fill="#D97706" />
        <circle cx="165" cy="482" r="12" fill="#D97706" />
        <ellipse cx="172" cy="480" rx="4" ry="8" fill="#78350F" /> {/* Ear */}
        <line x1="125" y1="496" x2="115" y2="518" stroke="#D97706" strokeWidth="5" strokeLinecap="round" />
        <line x1="135" y1="498" x2="130" y2="520" stroke="#D97706" strokeWidth="5" strokeLinecap="round" />
        <line x1="150" y1="498" x2="155" y2="518" stroke="#D97706" strokeWidth="5" strokeLinecap="round" />
        <line x1="160" y1="496" x2="170" y2="515" stroke="#D97706" strokeWidth="5" strokeLinecap="round" />
        <path d="M 115 488 Q 105 475, 110 468" fill="none" stroke="#D97706" strokeWidth="4" strokeLinecap="round" /> {/* Tail */}

        {/* Bench in Background */}
        <rect x="520" y="335" width="80" height="8" rx="2" fill="#78350F" />
        <rect x="520" y="348" width="80" height="6" rx="2" fill="#78350F" />
        <line x1="530" y1="340" x2="530" y2="370" stroke="#334155" strokeWidth="4" />
        <line x1="590" y1="340" x2="590" y2="370" stroke="#334155" strokeWidth="4" />

        {/* Flowers */}
        <g>
          <circle cx="70" cy="470" r="6" fill="#F43F5E" />
          <circle cx="70" cy="470" r="2" fill="#FEF08A" />
          <circle cx="95" cy="520" r="5" fill="#A855F7" />
          <circle cx="490" cy="520" r="6" fill="#FBBF24" />
          <circle cx="530" cy="480" r="5" fill="#EC4899" />
          <circle cx="750" cy="540" r="6" fill="#F97316" />
        </g>
      </svg>
    );
  }

  if (sceneId === 'living-room') {
    return (
      <svg
        viewBox="0 0 800 600"
        className="w-full h-full object-contain select-none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Cozy Living Room Scene"
      >
        <defs>
          <linearGradient id="wallGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FEF3C7" />
            <stop offset="100%" stopColor="#FDE68A" />
          </linearGradient>
          <linearGradient id="floorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#B45309" />
            <stop offset="100%" stopColor="#78350F" />
          </linearGradient>
        </defs>

        {/* Wall */}
        <rect width="800" height="400" fill="url(#wallGrad)" />
        {/* Floor */}
        <rect y="400" width="800" height="200" fill="url(#floorGrad)" />
        {/* Baseboard */}
        <rect y="390" width="800" height="14" fill="#92400E" />

        {/* Window with curtains */}
        <rect x="480" y="50" width="220" height="220" fill="#BAE6FD" stroke="#78350F" strokeWidth="8" rx="4" />
        <line x1="590" y1="50" x2="590" y2="270" stroke="#78350F" strokeWidth="5" />
        <line x1="480" y1="160" x2="700" y2="160" stroke="#78350F" strokeWidth="5" />
        {/* Outside tree in window */}
        <circle cx="540" cy="180" r="45" fill="#22C55E" opacity="0.8" />
        <circle cx="640" cy="130" r="35" fill="#16A34A" opacity="0.8" />
        {/* Curtains */}
        <path d="M 470 40 Q 510 160, 480 270 L 460 270 L 460 40 Z" fill="#EF4444" />
        <path d="M 730 40 Q 690 160, 720 270 L 740 270 L 740 40 Z" fill="#EF4444" />
        <line x1="450" y1="40" x2="750" y2="40" stroke="#B91C1C" strokeWidth="6" />

        {/* Wall Clock */}
        <circle cx="200" cy="100" r="42" fill="#FFFFFF" stroke="#451A03" strokeWidth="6" />
        <line x1="200" y1="100" x2="200" y2="75" stroke="#111827" strokeWidth="4" strokeLinecap="round" />
        <line x1="200" y1="100" x2="222" y2="100" stroke="#111827" strokeWidth="4" strokeLinecap="round" />
        <circle cx="200" cy="100" r="4" fill="#DC2626" />

        {/* Bookshelf on Left */}
        <rect x="40" y="110" width="100" height="280" fill="#92400E" stroke="#78350F" strokeWidth="4" rx="4" />
        <line x1="40" y1="180" x2="140" y2="180" stroke="#78350F" strokeWidth="4" />
        <line x1="40" y1="250" x2="140" y2="250" stroke="#78350F" strokeWidth="4" />
        <line x1="40" y1="320" x2="140" y2="320" stroke="#78350F" strokeWidth="4" />
        {/* Books on shelf */}
        <rect x="50" y="130" width="14" height="48" fill="#3B82F6" />
        <rect x="66" y="138" width="12" height="40" fill="#EF4444" />
        <rect x="80" y="125" width="16" height="53" fill="#10B981" />
        <rect x="100" y="142" width="22" height="36" fill="#F59E0B" />
        <rect x="52" y="200" width="18" height="48" fill="#8B5CF6" />
        <rect x="73" y="208" width="15" height="40" fill="#EC4899" />
        <rect x="91" y="195" width="20" height="53" fill="#06B6D4" />

        {/* Cozy Rug */}
        <ellipse cx="400" cy="490" rx="220" ry="70" fill="#FDE047" stroke="#CA8A04" strokeWidth="6" />
        <ellipse cx="400" cy="490" rx="180" ry="50" fill="#FEF08A" stroke="#EAB308" strokeWidth="2" strokeDasharray="6,6" />

        {/* Big Armchair with Grandma/Person knitting */}
        <path d="M 180 340 Q 240 330, 300 340 L 300 470 L 180 470 Z" fill="#2563EB" stroke="#1D4ED8" strokeWidth="4" rx="12" />
        <rect x="160" y="380" width="30" height="80" rx="12" fill="#1D4ED8" />
        <rect x="290" y="380" width="30" height="80" rx="12" fill="#1D4ED8" />
        {/* Person Sitting */}
        <circle cx="240" cy="310" r="20" fill="#FED7AA" />
        <path d="M 224 300 Q 240 280, 256 300" fill="#9CA3AF" /> {/* Gray Hair */}
        <rect x="215" y="332" width="50" height="60" rx="8" fill="#F472B6" />
        {/* Knitting needles and yarn */}
        <line x1="225" y1="360" x2="265" y2="340" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
        <line x1="225" y1="340" x2="265" y2="360" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
        <circle cx="245" cy="385" r="14" fill="#A855F7" /> {/* Yarn ball */}

        {/* Coffee Table */}
        <rect x="340" y="440" width="150" height="50" rx="8" fill="#D97706" stroke="#B45309" strokeWidth="4" />
        <line x1="360" y1="490" x2="350" y2="530" stroke="#78350F" strokeWidth="6" strokeLinecap="round" />
        <line x1="470" y1="490" x2="480" y2="530" stroke="#78350F" strokeWidth="6" strokeLinecap="round" />
        {/* Teacup & Saucer */}
        <ellipse cx="400" cy="445" rx="14" ry="6" fill="#E2E8F0" />
        <rect x="392" y="432" width="16" height="12" rx="3" fill="#FFFFFF" stroke="#CBD5E1" />
        {/* Steam */}
        <path d="M 400 426 Q 395 418, 400 410" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />

        {/* Cat sleeping on the rug */}
        <ellipse cx="440" cy="515" rx="24" ry="16" fill="#EA580C" />
        <circle cx="458" cy="508" r="12" fill="#EA580C" />
        <polygon points="458,498 466,494 464,504" fill="#C2410C" />
        <polygon points="450,500 456,496 454,506" fill="#C2410C" />
        <path d="M 416 515 Q 408 505, 412 495" fill="none" stroke="#EA580C" strokeWidth="4" strokeLinecap="round" />

        {/* Child playing with colorful building blocks on the right */}
        <circle cx="600" cy="430" r="18" fill="#FDBA74" />
        <path d="M 588 420 Q 600 405, 612 420" fill="#451A03" />
        <rect x="585" y="450" width="30" height="40" rx="6" fill="#10B981" />
        {/* Blocks */}
        <rect x="630" y="480" width="25" height="25" fill="#EF4444" stroke="#B91C1C" strokeWidth="2" rx="2" />
        <rect x="630" y="455" width="25" height="25" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2" rx="2" />
        <polygon points="630,455 642,435 655,455" fill="#FBBF24" stroke="#D97706" strokeWidth="2" />
        <rect x="660" y="480" width="25" height="25" fill="#8B5CF6" stroke="#6D28D9" strokeWidth="2" rx="2" />

        {/* Potted Plant */}
        <polygon points="710,340 760,340 750,390 720,390" fill="#B45309" />
        <path d="M 735 340 Q 710 280, 690 310" fill="none" stroke="#16A34A" strokeWidth="8" strokeLinecap="round" />
        <path d="M 735 340 Q 740 260, 770 290" fill="none" stroke="#15803D" strokeWidth="8" strokeLinecap="round" />
        <path d="M 735 340 Q 755 270, 735 250" fill="none" stroke="#22C55E" strokeWidth="8" strokeLinecap="round" />
      </svg>
    );
  }

  // Default: Classic Kitchen Scene (Cookie Theft inspired)
  return (
    <svg
      viewBox="0 0 800 600"
      className="w-full h-full object-contain select-none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Kitchen & Cookie Theft Scene"
    >
      <defs>
        <linearGradient id="kitchenWall" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#EFF6FF" />
          <stop offset="100%" stopColor="#DBEAFE" />
        </linearGradient>
        <linearGradient id="kitchenFloor" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#E2E8F0" />
          <stop offset="100%" stopColor="#CBD5E1" />
        </linearGradient>
      </defs>

      {/* Wall */}
      <rect width="800" height="400" fill="url(#kitchenWall)" />
      {/* Floor with tiles */}
      <rect y="400" width="800" height="200" fill="url(#kitchenFloor)" />
      <g stroke="#94A3B8" strokeWidth="1.5" opacity="0.6">
        <line x1="0" y1="460" x2="800" y2="460" />
        <line x1="0" y1="530" x2="800" y2="530" />
        <line x1="150" y1="400" x2="150" y2="600" />
        <line x1="350" y1="400" x2="350" y2="600" />
        <line x1="550" y1="400" x2="550" y2="600" />
        <line x1="750" y1="400" x2="750" y2="600" />
      </g>

      {/* Open Kitchen Window Above Sink on Right */}
      <rect x="520" y="60" width="220" height="180" fill="#93C5FD" stroke="#475569" strokeWidth="6" rx="4" />
      <line x1="630" y1="60" x2="630" y2="240" stroke="#475569" strokeWidth="4" />
      <line x1="520" y1="150" x2="740" y2="150" stroke="#475569" strokeWidth="4" />
      {/* Garden view outside window */}
      <circle cx="580" cy="180" r="35" fill="#22C55E" />
      <circle cx="670" cy="170" r="45" fill="#16A34A" />
      {/* Curtains blowing */}
      <path d="M 520 60 Q 490 140, 520 220" fill="#F87171" opacity="0.85" />
      <path d="M 740 60 Q 770 140, 740 220" fill="#F87171" opacity="0.85" />

      {/* Kitchen Counter & Cupboards Left (Cookie Cupboard) */}
      <rect x="60" y="80" width="220" height="120" fill="#CBD5E1" stroke="#475569" strokeWidth="4" rx="4" />
      <rect x="65" y="85" width="100" height="110" fill="#E2E8F0" stroke="#64748B" strokeWidth="2" />
      <rect x="175" y="85" width="100" height="110" fill="#F8FAFC" stroke="#64748B" strokeWidth="2" /> {/* Open Door */}
      {/* Cookie Jar on open shelf */}
      <rect x="195" y="115" width="55" height="60" rx="8" fill="#FDE047" stroke="#CA8A04" strokeWidth="3" />
      <ellipse cx="222" cy="115" rx="20" ry="7" fill="#CA8A04" />
      <text x="222" y="152" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#713F12">COOKIES</text>

      {/* Counter Base on Left */}
      <rect x="60" y="320" width="220" height="150" fill="#94A3B8" stroke="#475569" strokeWidth="4" />

      {/* Stool tipping over under boy */}
      <g transform="rotate(15 180 430)">
        <ellipse cx="180" cy="380" rx="35" ry="10" fill="#D97706" stroke="#78350F" strokeWidth="3" />
        <line x1="160" y1="385" x2="145" y2="450" stroke="#78350F" strokeWidth="6" strokeLinecap="round" />
        <line x1="200" y1="385" x2="215" y2="450" stroke="#78350F" strokeWidth="6" strokeLinecap="round" />
        <line x1="180" y1="385" x2="180" y2="450" stroke="#78350F" strokeWidth="6" strokeLinecap="round" />
      </g>

      {/* Boy climbing into Cookie Jar */}
      <circle cx="210" cy="190" r="18" fill="#FDBA74" />
      <path d="M 198 180 Q 210 165, 222 180" fill="#78350F" /> {/* Brown Hair */}
      <rect x="195" y="210" width="30" height="75" rx="6" fill="#3B82F6" />
      {/* Boy's hand reaching into cookie jar */}
      <line x1="215" y1="215" x2="225" y2="155" stroke="#FDBA74" strokeWidth="7" strokeLinecap="round" />
      {/* Boy passing cookie down */}
      <line x1="200" y1="230" x2="160" y2="280" stroke="#FDBA74" strokeWidth="7" strokeLinecap="round" />
      <circle cx="155" cy="285" r="7" fill="#B45309" /> {/* Cookie in hand */}

      {/* Girl on floor reaching up for cookie */}
      <circle cx="120" cy="270" r="18" fill="#FDBA74" />
      <path d="M 106 260 Q 120 245, 134 260" fill="#EAB308" /> {/* Blonde Hair */}
      <polygon points="120,290 85,380 155,380" fill="#EC4899" /> {/* Dress */}
      <line x1="125" y1="300" x2="150" y2="285" stroke="#FDBA74" strokeWidth="6" strokeLinecap="round" /> {/* Arm reaching up */}
      <line x1="110" y1="300" x2="120" y2="340" stroke="#FDBA74" strokeWidth="6" strokeLinecap="round" />

      {/* Kitchen Counter & Overflowing Sink Right */}
      <rect x="480" y="300" width="300" height="170" fill="#94A3B8" stroke="#475569" strokeWidth="4" />
      <rect x="520" y="290" width="180" height="20" rx="4" fill="#E2E8F0" stroke="#475569" strokeWidth="3" />
      {/* Faucet on running water */}
      <path d="M 610 290 L 610 250 Q 610 230, 595 235" fill="none" stroke="#475569" strokeWidth="8" strokeLinecap="round" />
      <line x1="595" y1="235" x2="595" y2="295" stroke="#38BDF8" strokeWidth="6" /> {/* Running Water Stream */}

      {/* Sink Basin with overflowing water */}
      <rect x="550" y="295" width="90" height="40" rx="4" fill="#0284C7" opacity="0.8" />
      {/* Water Spilling Over Edge to Floor */}
      <path d="M 540 305 Q 520 340, 525 460 Q 520 530, 600 550 Q 670 560, 650 510 Q 640 460, 630 305 Z" fill="#38BDF8" opacity="0.5" />
      <ellipse cx="585" cy="520" rx="75" ry="25" fill="#38BDF8" opacity="0.6" /> {/* Water puddle on floor */}

      {/* Mother Drying Dish & Looking Out Window */}
      <circle cx="670" cy="220" r="20" fill="#FDBA74" />
      <path d="M 654 210 Q 670 190, 686 210" fill="#92400E" /> {/* Hair Bun */}
      <circle cx="688" cy="205" r="9" fill="#92400E" />
      <rect x="645" y="245" width="45" height="120" rx="10" fill="#10B981" /> {/* Apron / Dress */}
      <polygon points="640,365 640,490 700,490 700,365" fill="#047857" />
      {/* Plate and Dish Towel in Mother's Hands */}
      <ellipse cx="640" cy="300" rx="18" ry="18" fill="#FFFFFF" stroke="#64748B" strokeWidth="3" />
      <rect x="635" y="300" width="20" height="25" rx="3" fill="#FDE047" opacity="0.9" /> {/* Towel */}
      <line x1="660" y1="260" x2="640" y2="300" stroke="#FDBA74" strokeWidth="7" strokeLinecap="round" />
    </svg>
  );
}
