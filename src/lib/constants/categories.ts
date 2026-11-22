import { EventCategory } from "@/types/template";

export interface CategoryInfo {
  id: EventCategory;
  name: string;
  nameHindi: string;
  slug: string;
  description: string;
  descriptionHindi: string;
  href: string;
  color: string;
  accentBg: string;
  image: string;
  popularSubcategories: string[];
}

export const EVENT_CATEGORIES: CategoryInfo[] = [
  {
    id: "wedding",
    name: "Wedding Invitations",
    nameHindi: "विवाह निमंत्रण",
    slug: "wedding",
    description: "Royal Indian wedding cards, video invitations, save-the-dates, and multi-day ceremonies (Haldi, Mehendi, Sangeet).",
    descriptionHindi: "शाही शादी कार्ड, वीडियो निमंत्रण, हल्दी, मेहंदी और संगीत के खास डिजाइन।",
    href: "/wedding",
    color: "#BE185D",
    accentBg: "from-pink-900/10 to-rose-500/10",
    image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80",
    popularSubcategories: ["Royal Rajasthani", "Modern Floral", "South Indian Kalyanam", "Haldi & Mehendi", "Sangeet Night"],
  },
  {
    id: "birthday",
    name: "Birthday Celebrations",
    nameHindi: "जन्मदिन उत्सव",
    slug: "birthday",
    description: "Fun, vibrant and classy birthday invitation cards and animated reels for all ages, from 1st birthdays to milestone 50th celebrations.",
    descriptionHindi: "बच्चों के पहले जन्मदिन से लेकर बड़ों के खास जन्मदिन तक हर उम्र के आकर्षक कार्ड।",
    href: "/birthday",
    color: "#7E22CE",
    accentBg: "from-purple-900/10 to-indigo-500/10",
    image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80",
    popularSubcategories: ["1st Birthday Special", "Kids Cartoon Theme", "Sweet 16 / 18th Milestone", "Golden 50th & 60th"],
  },
  {
    id: "engagement",
    name: "Engagement & Roka",
    nameHindi: "सगाई एवं रोका समारोह",
    slug: "engagement",
    description: "Elegant invitations celebrating the beautiful beginning of two families uniting — Roka ceremony, Ring ceremony, and Sagai.",
    descriptionHindi: "रोका, सगाई और अंगूठी पहनाने की रस्म के लिए खूबसूरत व शालीन निमंत्रण।",
    href: "/engagement",
    color: "#D4AF37",
    accentBg: "from-amber-900/10 to-yellow-500/10",
    image: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80",
    popularSubcategories: ["Roka Ceremony", "Traditional Sagai", "Ring Ceremony", "Cocktail Party"],
  },
  {
    id: "anniversary",
    name: "Anniversary Celebrations",
    nameHindi: "वैवाहिक वर्षगांठ",
    slug: "anniversary",
    description: "Commemorate love and togetherness with Silver 25th, Golden 50th Jubilee and romantic anniversary invitations.",
    descriptionHindi: "सिल्वर 25वीं और गोल्डन 50वीं सालगिरह के लिए यादगार निमंत्रण कार्ड।",
    href: "/anniversary",
    color: "#BE185D",
    accentBg: "from-rose-900/10 to-pink-500/10",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
    popularSubcategories: ["25th Silver Jubilee", "50th Golden Jubilee", "Intimate Dinner Party", "Vow Renewal"],
  },
  {
    id: "other",
    name: "Other Celebrations",
    nameHindi: "अन्य शुभ उत्सव",
    slug: "other-events",
    description: "Griha Pravesh (Housewarming), Baby Shower (Godh Bharai), Naamkaran, Mundan, Mata Ki Chowki, and Ganesh Chaturthi.",
    descriptionHindi: "गृह प्रवेश, गोद भराई, नामकरण, मुंडन, माता की चौकी और सत्यनारायण कथा के निमंत्रण।",
    href: "/other-events",
    color: "#0D9488",
    accentBg: "from-teal-900/10 to-emerald-500/10",
    image: "https://images.unsplash.com/photo-1609137144822-47310df62704?auto=format&fit=crop&w=800&q=80",
    popularSubcategories: ["Griha Pravesh (गृह प्रवेश)", "Godh Bharai (गोद भराई)", "Naamkaran (नामकरण)", "Puja & Bhajan Sandhya"],
  },
];
