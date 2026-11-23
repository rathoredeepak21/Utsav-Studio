import { TemplateDefinition, EventCategory } from '@/types/template';
import {
  VideoProject,
  VideoScene,
  VideoElement,
  TextVideoElement,
  StickerVideoElement,
  ShapeVideoElement,
  AudioTrackConfig,
} from '@/types/videoEditor';
import { getMotifDataUri } from '../editor/motifSvgHelper';

export function convertTemplateToVideoProject(template: TemplateDefinition): VideoProject {
  const width = template.dimensions?.width || 1080;
  const height = template.dimensions?.height || 1920;
  const isHi = template.defaultLanguage === 'hi';

  const baseBg = template.background || {
    type: 'gradient',
    color: '#3B0736',
    gradient: {
      type: 'linear',
      from: '#4A0E4E',
      via: '#290627',
      to: '#120112',
      angle: 180,
    },
    pattern: 'mandala',
    patternOpacity: 0.1,
  };

  // Extract texts and map roles
  const textByRole: Record<string, string> = {};
  template.texts.forEach((t) => {
    const val = isHi ? t.contentHindi || t.content : t.content || t.contentHindi || '';
    textByRole[t.role] = val;
  });

  const primaryNames = textByRole['primary_names'] || (isHi ? 'देव एवं मीरा' : 'Dev & Meera');
  const title = textByRole['title'] || (isHi ? 'शुभ विवाह' : 'Wedding Invitation');
  const subtitle = textByRole['subtitle'] || (isHi ? 'के पावन परिणय उत्सव में सादर आमंत्रित हैं' : 'Cordially invite you to celebrate their wedding');
  const shloka = textByRole['shloka'] || (isHi ? '॥ वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ ॥' : '|| Mangalam Bhagwan Vishnuh ||');
  const dateTime = textByRole['date_time'] || (isHi ? 'गुरुवार, 18 दिसंबर 2026 | सायं 7:00 बजे' : 'Thursday, 18th December 2026 | 7:00 PM');
  const venue = textByRole['venue'] || (isHi ? 'उम्मेद भवन पैलेस, जोधपुर, राजस्थान' : 'Umaid Bhawan Palace, Jodhpur, Rajasthan');
  const rsvp = textByRole['rsvp'] || (isHi ? 'आर.एस.वी.पी.: समस्त परिवार | मो. 9876543210' : 'RSVP: Sharma & Verma Family | +91 98765 43210');

  // Choose default ceremonial audio track based on category
  let defaultSynth: AudioTrackConfig['synthPreset'] = 'shehnai_sitar';
  let defaultAudioTitle = 'Mangal Shehnai & Sitar Harmony';
  if (template.category === 'birthday') {
    defaultSynth = 'celebration';
    defaultAudioTitle = 'Celebration Beats & Strings';
  } else if (template.category === 'mundan' || template.category === 'housewarming') {
    defaultSynth = 'sacred_flute';
    defaultAudioTitle = 'Devotional Flute & Santoor';
  } else if (template.category === 'engagement') {
    defaultSynth = 'acoustic_strings';
    defaultAudioTitle = 'Soulful Acoustic Mandolin';
  }

  const audioTrack: AudioTrackConfig = {
    id: `audio-${Date.now()}`,
    title: defaultAudioTitle,
    src: 'synth',
    isSynth: true,
    synthPreset: defaultSynth,
    volume: 0.85,
    startTime: 0,
    trimStart: 0,
    fadeInDuration: 1.0,
    fadeOutDuration: 1.5,
    isMuted: false,
  };

  const scenes: VideoScene[] = [];

  // ================= SCENE 1: SACRED BLESSING & INVOCATION =================
  const scene1Elements: VideoElement[] = [
    // Top motif: Ganesha / Swastik / Sacred Motif
    {
      id: `s1-motif-1`,
      name: 'Sacred Motif',
      type: 'sticker',
      stickerType: template.category === 'birthday' ? 'balloons' : 'ganesha',
      x: 440,
      y: 280,
      width: 200,
      height: 200,
      color: '#D4AF37',
      secondaryColor: '#BE185D',
      svgDataUri: getMotifDataUri(template.category === 'birthday' ? 'balloons' : 'ganesha', '#D4AF37', '#BE185D'),
      zIndex: 10,
      animation: {
        type: 'zoom-in',
        startTime: 0.2,
        duration: 0.8,
        easing: 'ease-out',
      },
    },
    // Shloka / Invocation Header
    {
      id: `s1-txt-1`,
      name: 'Sacred Invocation',
      type: 'text',
      text: shloka,
      fontSize: 34,
      fontFamily: isHi ? 'Noto Sans Devanagari' : 'Cinzel',
      fill: '#FDE68A',
      align: 'center',
      x: 100,
      y: 560,
      width: 880,
      height: 100,
      letterSpacing: 2,
      zIndex: 15,
      animation: {
        type: 'fade-in',
        startTime: 0.6,
        duration: 0.9,
        easing: 'ease-out',
      },
    },
    // Event Title
    {
      id: `s1-txt-2`,
      name: 'Event Title',
      type: 'text',
      text: title,
      fontSize: 54,
      fontFamily: 'Rozha One',
      fill: '#F59E0B',
      align: 'center',
      fontStyle: 'bold',
      x: 90,
      y: 720,
      width: 900,
      height: 120,
      zIndex: 15,
      animation: {
        type: 'slide-up',
        startTime: 1.2,
        duration: 0.8,
        easing: 'ease-out',
      },
    },
    // Subtitle
    {
      id: `s1-txt-3`,
      name: 'Warm Invitation',
      type: 'text',
      text: subtitle,
      fontSize: 32,
      fontFamily: 'Noto Sans Devanagari',
      fill: '#E2E8F0',
      align: 'center',
      x: 120,
      y: 890,
      width: 840,
      height: 120,
      zIndex: 15,
      animation: {
        type: 'fade-in',
        startTime: 1.8,
        duration: 0.8,
        easing: 'ease-out',
      },
    },
  ];

  scenes.push({
    id: `scene-1-${Date.now()}`,
    name: isHi ? 'दृश्य 1: पावन मंगलाचरण' : 'Scene 1: Sacred Invocation',
    duration: 3.5,
    background: {
      type: 'gradient',
      color: '#3B0736',
      gradient: {
        type: 'radial',
        from: '#4A0E4E',
        via: '#260424',
        to: '#100110',
      },
      pattern: 'mandala',
      patternOpacity: 0.12,
    },
    transition: {
      type: 'crossfade',
      duration: 0.6,
    },
    elements: scene1Elements,
  });

  // ================= SCENE 2: PRIMARY NAMES & COUPLE CELEBRATION =================
  const scene2Elements: VideoElement[] = [
    // Center ornate arch or frame
    {
      id: `s2-arch`,
      name: 'Jharokha Arch',
      type: 'sticker',
      stickerType: 'jharokha_arch',
      x: 340,
      y: 260,
      width: 400,
      height: 400,
      color: '#D4AF37',
      secondaryColor: '#E11D48',
      svgDataUri: getMotifDataUri('jharokha_arch', '#D4AF37', '#E11D48'),
      zIndex: 5,
      animation: {
        type: 'zoom-in',
        startTime: 0.1,
        duration: 0.9,
        easing: 'ease-out',
      },
    },
    // "With the blessings of Almighty"
    {
      id: `s2-txt-1`,
      name: 'Blessings Tag',
      type: 'text',
      text: isHi ? '॥ सस्नेह निमंत्रण ॥' : 'TOGETHER WITH THEIR FAMILIES',
      fontSize: 28,
      fontFamily: 'Cinzel',
      fill: '#FDE68A',
      align: 'center',
      x: 140,
      y: 720,
      width: 800,
      height: 60,
      letterSpacing: 3,
      zIndex: 15,
      animation: {
        type: 'fade-in',
        startTime: 0.5,
        duration: 0.7,
        easing: 'ease-out',
      },
    },
    // Primary Names
    {
      id: `s2-txt-2`,
      name: 'Celebrants Names',
      type: 'text',
      text: primaryNames,
      fontSize: 84,
      fontFamily: 'Rozha One',
      fill: '#FCD34D',
      align: 'center',
      fontStyle: 'bold',
      textShadow: '0 4px 24px rgba(0,0,0,0.85)',
      x: 60,
      y: 810,
      width: 960,
      height: 180,
      zIndex: 20,
      animation: {
        type: 'typewriter',
        startTime: 1.0,
        duration: 1.2,
        easing: 'linear',
      },
    },
    // Decorative divider below names
    {
      id: `s2-divider`,
      name: 'Golden Divider',
      type: 'sticker',
      stickerType: 'divider',
      x: 240,
      y: 1040,
      width: 600,
      height: 40,
      color: '#D4AF37',
      svgDataUri: getMotifDataUri('divider', '#D4AF37'),
      zIndex: 15,
      animation: {
        type: 'zoom-in',
        startTime: 1.8,
        duration: 0.6,
        easing: 'ease-out',
      },
    },
  ];

  scenes.push({
    id: `scene-2-${Date.now() + 1}`,
    name: isHi ? 'दृश्य 2: मुख्य नाम एवं परिणय' : 'Scene 2: Couple Announcement',
    duration: 4.2,
    background: {
      type: 'gradient',
      color: '#240322',
      gradient: {
        type: 'linear',
        from: '#3B0736',
        via: '#1C021A',
        to: '#0D010C',
        angle: 180,
      },
      pattern: 'mandala',
      patternOpacity: 0.1,
    },
    transition: {
      type: 'slide-left',
      duration: 0.7,
    },
    elements: scene2Elements,
  });

  // ================= SCENE 3: MUHURAT, DATE, TIME & VENUE =================
  const scene3Elements: VideoElement[] = [
    // Top Diya / Kalash
    {
      id: `s3-diya`,
      name: 'Ceremonial Diya',
      type: 'sticker',
      stickerType: 'diya',
      x: 460,
      y: 280,
      width: 160,
      height: 140,
      color: '#F59E0B',
      secondaryColor: '#D4AF37',
      svgDataUri: getMotifDataUri('diya', '#F59E0B', '#D4AF37'),
      zIndex: 10,
      animation: {
        type: 'zoom-in',
        startTime: 0.2,
        duration: 0.7,
        easing: 'ease-out',
      },
    },
    // Muhurat Label
    {
      id: `s3-txt-1`,
      name: 'Date & Time Label',
      type: 'text',
      text: isHi ? '॥ शुभ मुहूर्त ॥' : 'DATE & TIME',
      fontSize: 32,
      fontFamily: 'Cinzel',
      fill: '#F59E0B',
      align: 'center',
      x: 140,
      y: 480,
      width: 800,
      height: 60,
      letterSpacing: 2,
      zIndex: 15,
      animation: {
        type: 'fade-in',
        startTime: 0.6,
        duration: 0.6,
        easing: 'ease-out',
      },
    },
    // Date & Time
    {
      id: `s3-txt-2`,
      name: 'Date Time Value',
      type: 'text',
      text: dateTime,
      fontSize: 44,
      fontFamily: 'Noto Sans Devanagari',
      fill: '#FDE68A',
      align: 'center',
      fontStyle: 'bold',
      x: 90,
      y: 560,
      width: 900,
      height: 100,
      zIndex: 20,
      animation: {
        type: 'slide-up',
        startTime: 0.9,
        duration: 0.7,
        easing: 'ease-out',
      },
    },
    // Venue Label
    {
      id: `s3-txt-3`,
      name: 'Venue Label',
      type: 'text',
      text: isHi ? '॥ कार्यक्रम स्थल ॥' : 'VENUE',
      fontSize: 30,
      fontFamily: 'Cinzel',
      fill: '#F59E0B',
      align: 'center',
      x: 140,
      y: 740,
      width: 800,
      height: 60,
      letterSpacing: 2,
      zIndex: 15,
      animation: {
        type: 'fade-in',
        startTime: 1.4,
        duration: 0.6,
        easing: 'ease-out',
      },
    },
    // Venue Address
    {
      id: `s3-txt-4`,
      name: 'Venue Address',
      type: 'text',
      text: venue,
      fontSize: 36,
      fontFamily: 'Noto Sans Devanagari',
      fill: '#E2E8F0',
      align: 'center',
      x: 90,
      y: 820,
      width: 900,
      height: 140,
      zIndex: 20,
      animation: {
        type: 'slide-up',
        startTime: 1.7,
        duration: 0.7,
        easing: 'ease-out',
      },
    },
  ];

  scenes.push({
    id: `scene-3-${Date.now() + 2}`,
    name: isHi ? 'दृश्य 3: मुहूर्त एवं कार्यक्रम स्थल' : 'Scene 3: Muhurat & Venue',
    duration: 4.0,
    background: {
      type: 'gradient',
      color: '#1C021A',
      gradient: {
        type: 'radial',
        from: '#3B0736',
        via: '#1F031E',
        to: '#0D010C',
      },
      pattern: 'mandala',
      patternOpacity: 0.08,
    },
    transition: {
      type: 'crossfade',
      duration: 0.6,
    },
    elements: scene3Elements,
  });

  // ================= SCENE 4: RSVP & WARM REGARDS =================
  const scene4Elements: VideoElement[] = [
    // Top Lotus / Swastik
    {
      id: `s4-lotus`,
      name: 'Sacred Lotus',
      type: 'sticker',
      stickerType: 'lotus',
      x: 460,
      y: 340,
      width: 160,
      height: 140,
      color: '#E11D48',
      secondaryColor: '#D4AF37',
      svgDataUri: getMotifDataUri('lotus', '#E11D48', '#D4AF37'),
      zIndex: 10,
      animation: {
        type: 'zoom-in',
        startTime: 0.2,
        duration: 0.7,
        easing: 'ease-out',
      },
    },
    // "We eagerly look forward to welcoming you"
    {
      id: `s4-txt-1`,
      name: 'Warm Regards Header',
      type: 'text',
      text: isHi ? '॥ दर्शनाभिलाषी एवं स्वागतकर्ता ॥' : 'WITH WARM REGARDS & BLESSINGS',
      fontSize: 34,
      fontFamily: isHi ? 'Noto Sans Devanagari' : 'Cinzel',
      fill: '#FDE68A',
      align: 'center',
      fontStyle: 'bold',
      x: 100,
      y: 560,
      width: 880,
      height: 70,
      zIndex: 15,
      animation: {
        type: 'fade-in',
        startTime: 0.6,
        duration: 0.7,
        easing: 'ease-out',
      },
    },
    // RSVP Details
    {
      id: `s4-txt-2`,
      name: 'RSVP Info',
      type: 'text',
      text: rsvp,
      fontSize: 32,
      fontFamily: 'Noto Sans Devanagari',
      fill: '#E2E8F0',
      align: 'center',
      x: 120,
      y: 680,
      width: 840,
      height: 120,
      zIndex: 20,
      animation: {
        type: 'slide-up',
        startTime: 1.1,
        duration: 0.7,
        easing: 'ease-out',
      },
    },
    // Closing blessings footer
    {
      id: `s4-txt-3`,
      name: 'Closing Blessing',
      type: 'text',
      text: isHi ? '॥ आपकी उपस्थिति ही हमारा सबसे बड़ा उपहार है ॥' : 'Your presence is our most cherished blessing',
      fontSize: 26,
      fontFamily: 'Noto Sans Devanagari',
      fill: '#F59E0B',
      align: 'center',
      fontStyle: 'italic',
      x: 140,
      y: 840,
      width: 800,
      height: 60,
      zIndex: 15,
      animation: {
        type: 'fade-in',
        startTime: 1.7,
        duration: 0.8,
        easing: 'ease-out',
      },
    },
  ];

  scenes.push({
    id: `scene-4-${Date.now() + 3}`,
    name: isHi ? 'दृश्य 4: दर्शनाभिलाषी एवं आमंत्रण' : 'Scene 4: RSVP & Warm Regards',
    duration: 3.5,
    background: {
      type: 'gradient',
      color: '#120112',
      gradient: {
        type: 'linear',
        from: '#2D052B',
        via: '#1A0218',
        to: '#0B010B',
        angle: 180,
      },
      pattern: 'mandala',
      patternOpacity: 0.1,
    },
    transition: {
      type: 'fade-to-black',
      duration: 0.7,
    },
    elements: scene4Elements,
  });

  return {
    id: `vproj-${Date.now()}`,
    title: `${template.name} - Video Reel`,
    templateId: template.id,
    category: template.category,
    aspectRatio: '9:16',
    dimensions: { width, height },
    fps: 30,
    scenes,
    audio: audioTrack,
    lastModified: Date.now(),
    createdAt: Date.now(),
  };
}
