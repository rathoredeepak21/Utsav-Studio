export const siteConfig = {
  name: "Utsav Studio",
  tagline: "Har Khushi Ka Digital Nimantaran",
  taglineHindi: "हर खुशी का डिजिटल निमंत्रण",
  description:
    "India's completely free digital invitation maker for weddings, birthdays, engagements, anniversaries, and all celebrations. 100% free forever, no signup required, no watermark, and full privacy.",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://utsavstudio.in",
  navLinks: [
    { name: "Home", href: "/", hindi: "होम" },
    { name: "Wedding", href: "/wedding", hindi: "विवाह" },
    { name: "Birthday", href: "/birthday", hindi: "जन्मदिन" },
    { name: "Engagement", href: "/engagement", hindi: "सगाई" },
    { name: "Anniversary", href: "/anniversary", hindi: "सालगिरह" },
    { name: "Other Events", href: "/other-events", hindi: "अन्य उत्सव" },
    { name: "Templates", href: "/templates", hindi: "टेम्पलेट्स" },
    { name: "My Projects", href: "/my-projects", hindi: "मेरे प्रोजेक्ट्स" },
  ],
  footerLinks: {
    invitations: [
      { name: "Wedding Invitations", href: "/wedding" },
      { name: "Birthday Cards & Videos", href: "/birthday" },
      { name: "Engagement Ceremony", href: "/engagement" },
      { name: "Anniversary Invites", href: "/anniversary" },
      { name: "Baby Shower & Naamkaran", href: "/other-events" },
      { name: "Griha Pravesh (Housewarming)", href: "/other-events" },
      { name: "Puja & Religious Gatherings", href: "/other-events" },
    ],
    tools: [
      { name: "Card Editor", href: "/card-editor" },
      { name: "Video Invitation Maker", href: "/video-editor" },
      { name: "Template Gallery", href: "/templates" },
      { name: "My Saved Projects", href: "/my-projects" },
    ],
    company: [
      { name: "About Utsav Studio", href: "/about" },
      { name: "Help & Tutorials", href: "/help" },
      { name: "Contact Us", href: "/contact" },
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Admin Portal", href: "/admin/login" },
    ],
  },
  freeFeatures: [
    {
      title: "Zero Signup Friction",
      titleHindi: "बिना किसी लॉगिन के",
      description: "Jump straight into creating. No phone number, email, or password required.",
      icon: "UserCheck",
    },
    {
      title: "No Watermark Ever",
      titleHindi: "कोई वॉटरमार्क नहीं",
      description: "Download crystal-clear HD cards and videos without any forced logo or watermark.",
      icon: "ShieldCheck",
    },
    {
      title: "100% Free - No Paywalls",
      titleHindi: "हमेशा के लिए 100% मुफ़्त",
      description: "All premium-looking Indian traditional and modern designs are completely unlocked.",
      icon: "Gift",
    },
    {
      title: "Browser-Only Privacy",
      titleHindi: "पूर्ण गोपनीयता",
      description: "Your family photos and videos stay in your browser. We never harvest your media.",
      icon: "Lock",
    },
    {
      title: "Rich Hindi & Unicode Fonts",
      titleHindi: "हिंदी और अंग्रेज़ी फ़ॉन्ट्स",
      description: "Full support for Hindi calligraphy, Sanskrit shlokas, and elegant English typography.",
      icon: "Languages",
    },
  ],
};
