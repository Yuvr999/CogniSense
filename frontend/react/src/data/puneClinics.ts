export interface PuneClinic {
  id: string;
  name: {
    en: string;
    hi: string;
    mr: string;
    kn?: string;
  };
  area: {
    en: string;
    hi: string;
    mr: string;
    kn?: string;
  };
  address: string;
  zone: 'central' | 'east' | 'west' | 'south' | 'pcmc';
  coordinates: {
    lat: number;
    lng: number;
  };
  phone: string;
  specialties: {
    en: string[];
    hi: string[];
    mr: string[];
    kn?: string[];
  };
  timing: string;
  type: 'memory_clinic' | 'tertiary_hospital' | 'geriatric_opd' | 'neuro_centre';
  rating: number;
  reviewsCount: number;
  emergency24x7: boolean;
  googleMapsUrl: string;
}

export const PUNE_REFERENCE_LOCATION = {
  name: 'Pune City Center (Shivajinagar / FC Road)',
  lat: 18.5204,
  lng: 73.8567
};

export const PUNE_CLINICS: PuneClinic[] = [
  {
    id: 'dmh-erandwane',
    name: {
      en: 'Deenanath Mangeshkar Hospital & Research Center',
      hi: 'दीनानाथ मंगेशकर अस्पताल एवं अनुसंधान केंद्र',
      mr: 'दीनानाथ मंगेशकर रुग्णालय आणि संशोधन केंद्र',
      kn: 'ದೀನನಾಥ ಮಂಗೇಶ್ಕರ್ ಆಸ್ಪತ್ರೆ'
    },
    area: {
      en: 'Erandwane, Near Mhatre Bridge',
      hi: 'एरंडवणे, म्हात्रे ब्रिज के पास',
      mr: 'एरंडवणे, म्हात्रे पुलाजवळ',
      kn: 'ಎರಂಡವಣೆ'
    },
    address: 'Near Mhatre Bridge, Erandwane, Pune, Maharashtra 411004',
    zone: 'central',
    coordinates: {
      lat: 18.5028,
      lng: 73.8340
    },
    phone: '+91 20 4015 1000',
    specialties: {
      en: ['Specialized Memory Clinic', 'Comprehensive Neurology', 'Geriatric Care Unit', 'Neuropsychological Assessment'],
      hi: ['विशेष स्मृति क्लिनिक', 'न्यूरोलॉजी विभाग', 'वृद्धावस्था देखभाल', 'न्यूरोसाइकोलॉजिकल जांच'],
      mr: ['स्मरणशक्ती विशेष क्लिनिक', 'मेंदू व मज्जारज्जू विकार विभाग', 'ज्येष्ठ नागरिक आरोग्य केंद्र', 'न्यूरोसायकॉलॉजिकल मूल्यांकन'],
      kn: ['ನೆನಪಿನ ಕ್ಲಿನಿಕ್', 'ನರವಿಜ್ಞಾನ']
    },
    timing: 'Mon - Sat: 8:00 AM - 8:00 PM (OPD)',
    type: 'memory_clinic',
    rating: 4.8,
    reviewsCount: 3420,
    emergency24x7: true,
    googleMapsUrl: 'https://maps.google.com/?q=Deenanath+Mangeshkar+Hospital+Pune'
  },
  {
    id: 'ruby-hall-sassoon',
    name: {
      en: 'Ruby Hall Clinic - Neurosciences Centre',
      hi: 'रूबी हॉल क्लिनिक - न्यूरोसाइंस केंद्र',
      mr: 'रुबी हॉल क्लिनिक - न्यूरोसायन्स सेंटर',
      kn: 'ರೂಬಿ ಹಾಲ್ ಕ್ಲಿನಿಕ್'
    },
    area: {
      en: 'Sassoon Road, Central Pune',
      hi: 'ससून रोड, सेंट्रल पुणे',
      mr: 'ससून रोड, मध्यवर्ती पुणे',
      kn: 'ಸಸೂನ್ ರಸ್ತೆ'
    },
    address: '40, Sassoon Road, Sangamvadi, Pune, Maharashtra 411001',
    zone: 'central',
    coordinates: {
      lat: 18.5326,
      lng: 73.8765
    },
    phone: '+91 20 6645 5100',
    specialties: {
      en: ['Advanced Cognitive Disorders OPD', 'Neurology & Stroke Care', 'Brain Health Assessment', 'EEG & Neuro-imaging'],
      hi: ['संज्ञानात्मक विकार केंद्र', 'न्यूरोलॉजी देखभाल', 'मस्तिष्क स्वास्थ्य जांच', 'न्यूरो-इमेजिंग'],
      mr: ['स्मरण व आकलन विकार विभाग', 'न्यूरोलॉजी आणि स्ट्रोक केअर', 'मेंदू आरोग्य तपासणी', 'न्यूरो-इमेजिंग'],
      kn: ['ನರವಿಜ್ಞಾನ ಕೇಂದ್ರ']
    },
    timing: 'Mon - Sun: 24 Hours Open',
    type: 'tertiary_hospital',
    rating: 4.7,
    reviewsCount: 2890,
    emergency24x7: true,
    googleMapsUrl: 'https://maps.google.com/?q=Ruby+Hall+Clinic+Sassoon+Road+Pune'
  },
  {
    id: 'jehangir-hospital',
    name: {
      en: 'Jehangir Hospital',
      hi: 'जहाँगीर अस्पताल',
      mr: 'जहांगीर रुग्णालय',
      kn: 'ಜಹಾಂಗೀರ್ ಆಸ್ಪತ್ರೆ'
    },
    area: {
      en: 'Near Pune Railway Station, Sassoon Road',
      hi: 'पुणे रेलवे स्टेशन के पास, ससून रोड',
      mr: 'पुणे रेल्वे स्टेशनजवळ, ससून रोड',
      kn: 'ಪುಣೆ ರೈಲ್ವೆ ನಿಲ್ದಾಣದ ಬಳಿ'
    },
    address: '32, Sassoon Road, Opposite Pune Railway Station, Pune, Maharashtra 411001',
    zone: 'central',
    coordinates: {
      lat: 18.5303,
      lng: 73.8781
    },
    phone: '+91 20 6681 1000',
    specialties: {
      en: ['Geriatric Medicine & Memory Care', 'Clinical Neurophysiology', 'Dementia Support Programs'],
      hi: ['वृद्धावस्था चिकित्सा एवं स्मृति देखभाल', 'क्लीनिकल न्यूरोफिजियोलॉजी', 'डिमेंशिया सपोर्ट प्रोग्राम'],
      mr: ['ज्येष्ठ नागरिक वैद्यकीय व स्मृती तपासणी', 'क्लिनिकल न्यूरोफिजियोलॉजी', 'डिमेंशिया सहाय्य कार्यक्रम'],
      kn: ['ಹಿರಿಯ ನಾಗರಿಕರ ಆರೈಕೆ']
    },
    timing: 'Mon - Sat: 9:00 AM - 6:00 PM',
    type: 'tertiary_hospital',
    rating: 4.6,
    reviewsCount: 1980,
    emergency24x7: true,
    googleMapsUrl: 'https://maps.google.com/?q=Jehangir+Hospital+Pune'
  },
  {
    id: 'sahyadri-deccan',
    name: {
      en: 'Sahyadri Super Speciality Hospital',
      hi: 'सह्याद्री सुपर स्पेशलिटी अस्पताल',
      mr: 'सह्याद्री सुपर स्पेशालिटी रुग्णालय',
      kn: 'ಸಹ್ಯಾದ್ರಿ ಆಸ್ಪತ್ರೆ'
    },
    area: {
      en: 'Deccan Gymkhana, Karve Road',
      hi: 'डेक्कन जिमखाना, कर्वे रोड',
      mr: 'डेक्कन जिमखाना, कर्वे रस्ता',
      kn: 'ಡೆಕ್ಕನ್ ಜಿಮ್ಖಾನಾ'
    },
    address: 'Plot No. 30 C, Erandwane, Karve Road, Deccan Gymkhana, Pune, Maharashtra 411004',
    zone: 'central',
    coordinates: {
      lat: 18.5144,
      lng: 73.8378
    },
    phone: '+91 20 6721 3000',
    specialties: {
      en: ['Centre for Neurosciences', 'Memory Loss Screening & Care', 'Cognitive Rehabilitation'],
      hi: ['न्यूरोसाइंस केंद्र', 'स्मृति हानि स्क्रीनिंग एवं देखभाल', 'संज्ञानात्मक पुनर्वास'],
      mr: ['न्यूरोसायन्स केंद्र', 'स्मरणशक्ती तपासणी व उपचार', 'कॉग्निटिव्ह पुनर्वसन'],
      kn: ['ನರವಿಜ್ಞಾನ ಕೇಂದ್ರ']
    },
    timing: 'Mon - Sat: 8:30 AM - 7:30 PM',
    type: 'neuro_centre',
    rating: 4.7,
    reviewsCount: 2210,
    emergency24x7: true,
    googleMapsUrl: 'https://maps.google.com/?q=Sahyadri+Hospital+Deccan+Pune'
  },
  {
    id: 'kem-hospital-rasta-peth',
    name: {
      en: 'KEM Hospital & Research Centre',
      hi: 'केईएम अस्पताल एवं अनुसंधान केंद्र',
      mr: 'के.ई.एम. रुग्णालय आणि संशोधन केंद्र',
      kn: 'ಕೆಇಎಂ ಆಸ್ಪತ್ರೆ'
    },
    area: {
      en: 'Rasta Peth / Somwar Peth',
      hi: 'रास्ता पेठ / सोमवार पेठ',
      mr: 'रास्ता पेठ / सोमवार पेठ',
      kn: 'ರಸ್ತಾ ಪೇಟೆ'
    },
    address: '489, Sardar Moodliar Road, Rasta Peth, Pune, Maharashtra 411011',
    zone: 'central',
    coordinates: {
      lat: 18.5218,
      lng: 73.8705
    },
    phone: '+91 20 6603 7300',
    specialties: {
      en: ['Affordable Geriatric Assessment OPD', 'Neurology Department', 'Community Cognitive Health'],
      hi: ['सुलभ वृद्धावस्था मूल्यांकन ओपीडी', 'न्यूरोलॉजी विभाग', 'सामुदायिक मानसिक स्वास्थ्य'],
      mr: ['परवडणारी ज्येष्ठ नागरिक तपासणी ओपीडी', 'न्यूरोलॉजी विभाग', 'सामुदायिक मेंदू आरोग्य'],
      kn: ['ಹಿರಿಯ ನಾಗರಿಕರ ಓಪಿಡಿ']
    },
    timing: 'Mon - Sat: 8:00 AM - 4:00 PM',
    type: 'geriatric_opd',
    rating: 4.5,
    reviewsCount: 1670,
    emergency24x7: true,
    googleMapsUrl: 'https://maps.google.com/?q=KEM+Hospital+Rasta+Peth+Pune'
  },
  {
    id: 'manipal-baner',
    name: {
      en: 'Manipal Hospital Baner',
      hi: 'मणिपाल अस्पताल बानेर',
      mr: 'मनिपाल रुग्णालय बाणेर',
      kn: 'ಮಣಿಪಾಲ್ ಆಸ್ಪತ್ರೆ ಬಾನೇರ್'
    },
    area: {
      en: 'Baner / Balewadi, West Pune',
      hi: 'बानेर / बालेवाड़ी, पश्चिम पुणे',
      mr: 'बाणेर / बालेवाडी, पश्चिम पुणे',
      kn: 'ಬಾನೇರ್'
    },
    address: 'Survey No. 22/2A, Mahalunge Road, Baner, Pune, Maharashtra 411045',
    zone: 'west',
    coordinates: {
      lat: 18.5601,
      lng: 73.7801
    },
    phone: '+91 20 6813 8888',
    specialties: {
      en: ['Neurology & Cognitive Health', 'Elderly Memory Care OPD', 'Advanced Neuro-diagnostics'],
      hi: ['न्यूरोलॉजी एवं संज्ञानात्मक स्वास्थ्य', 'वृद्ध स्मृति देखभाल', 'उन्नत न्यूरो-डायग्नोस्टिक्स'],
      mr: ['मेंदू व स्मरणशक्ती विकार ओपीडी', 'ज्येष्ठ नागरिक स्मृती तपासणी', 'प्रगत न्यूरो-निदान'],
      kn: ['ನರವಿಜ್ಞಾನ ಮತ್ತು ನೆನಪಿನ ಆರೈಕೆ']
    },
    timing: 'Mon - Sat: 9:00 AM - 7:00 PM',
    type: 'tertiary_hospital',
    rating: 4.8,
    reviewsCount: 1450,
    emergency24x7: true,
    googleMapsUrl: 'https://maps.google.com/?q=Manipal+Hospital+Baner+Pune'
  },
  {
    id: 'manipal-kharadi',
    name: {
      en: 'Manipal Hospital Kharadi',
      hi: 'मणिपाल अस्पताल खराड़ी',
      mr: 'मनिपाल रुग्णालय खराडी',
      kn: 'ಮಣಿಪಾಲ್ ಆಸ್ಪತ್ರೆ ಖರಾಡಿ'
    },
    area: {
      en: 'Kharadi / Nagar Road, East Pune',
      hi: 'खराड़ी / नगर रोड, पूर्व पुणे',
      mr: 'खराडी / नगर रस्ता, पूर्व पुणे',
      kn: 'ಖರಾಡಿ'
    },
    address: 'Survey No. 23, Mundhwa Bypass, Near EON IT Park, Kharadi, Pune, Maharashtra 411014',
    zone: 'east',
    coordinates: {
      lat: 18.5528,
      lng: 73.9348
    },
    phone: '+91 20 6813 0000',
    specialties: {
      en: ['Institute of Neurosciences', 'Comprehensive Memory Assessment', 'Geriatric Support'],
      hi: ['न्यूरोसाइंसेज संस्थान', 'व्यापक स्मृति मूल्यांकन', 'वृद्धावस्था सहायता'],
      mr: ['न्यूरोसायन्सेस इन्स्टिट्यूट', 'सर्वसमावेशक स्मरणशक्ती तपासणी', 'ज्येष्ठ नागरिक सहाय्य'],
      kn: ['ನ್ಯೂರೋಸೈನ್ಸ್ ಇನ್‌ಸ್ಟಿಟ್ಯೂಟ್']
    },
    timing: 'Mon - Sat: 9:00 AM - 8:00 PM',
    type: 'tertiary_hospital',
    rating: 4.7,
    reviewsCount: 1820,
    emergency24x7: true,
    googleMapsUrl: 'https://maps.google.com/?q=Manipal+Hospital+Kharadi+Pune'
  },
  {
    id: 'bharati-hospital-dhankawadi',
    name: {
      en: 'Bharati Hospital & Research Centre',
      hi: 'भारती अस्पताल एवं अनुसंधान केंद्र',
      mr: 'भारती रुग्णालय आणि संशोधन केंद्र',
      kn: 'ಭಾರತಿ ಆಸ್ಪತ್ರೆ ಧನಕವಡಿ'
    },
    area: {
      en: 'Katraj - Dhankawadi, South Pune',
      hi: 'कात्रज - धनकवड़ी, दक्षिण पुणे',
      mr: 'कात्रज - धनकवडी, दक्षिण पुणे',
      kn: 'ಕಾತ್ರಜ್ ಧನಕವಡಿ'
    },
    address: 'Pune-Satara Road, Dhankawadi, Katraj, Pune, Maharashtra 411043',
    zone: 'south',
    coordinates: {
      lat: 18.4575,
      lng: 73.8508
    },
    phone: '+91 20 2437 3226',
    specialties: {
      en: ['Geriatric & Memory Assessment OPD', 'Department of Neurology', 'Subsidized Healthcare'],
      hi: ['वृद्धावस्था एवं स्मृति मूल्यांकन ओपीडी', 'न्यूरोलॉजी विभाग', 'रियायती स्वास्थ्य सेवा'],
      mr: ['ज्येष्ठ नागरिक व स्मृती मूल्यांकन ओपीडी', 'न्यूरोलॉजी विभाग', 'सवलतीच्या दरातील आरोग्यसेवा'],
      kn: ['ನೆನಪಿನ ಮೌಲ್ಯಮಾಪನ']
    },
    timing: 'Mon - Sat: 8:30 AM - 5:00 PM',
    type: 'geriatric_opd',
    rating: 4.4,
    reviewsCount: 1240,
    emergency24x7: true,
    googleMapsUrl: 'https://maps.google.com/?q=Bharati+Hospital+Pune-Satara+Road+Pune'
  },
  {
    id: 'poona-hospital-sadashiv-peth',
    name: {
      en: 'Poona Hospital and Research Centre',
      hi: 'पूना अस्पताल एवं अनुसंधान केंद्र',
      mr: 'पुना रुग्णालय आणि संशोधन केंद्र',
      kn: 'ಪೂನಾ ಆಸ್ಪತ್ರೆ'
    },
    area: {
      en: 'Sadashiv Peth, Near Alka Talkies',
      hi: 'सदाशिव पेठ, अलका टॉकीज के पास',
      mr: 'सदाशिव पेठ, अलका टॉकीजजवळ',
      kn: 'ಸದಾಶಿವ ಪೇಟೆ'
    },
    address: '27, Sadashiv Peth, Near Alka Talkies, Pune, Maharashtra 411030',
    zone: 'central',
    coordinates: {
      lat: 18.5132,
      lng: 73.8471
    },
    phone: '+91 20 6609 6000',
    specialties: {
      en: ['Neuro-physician Consultation', 'Memory Complaints Evaluation', 'General Medicine'],
      hi: ['न्यूरो-चिकित्सक परामर्श', 'स्मृति समस्याओं की जांच', 'सामान्य चिकित्सा'],
      mr: ['मेंदूविकार तज्ज्ञ सल्ला', 'स्मरणशक्ती तक्रार तपासणी', 'जनरल मेडिसिन'],
      kn: ['ನರ ತಜ್ಞರ ಸಮಾಲೋಚನೆ']
    },
    timing: 'Mon - Sat: 9:00 AM - 6:00 PM',
    type: 'tertiary_hospital',
    rating: 4.5,
    reviewsCount: 1390,
    emergency24x7: true,
    googleMapsUrl: 'https://maps.google.com/?q=Poona+Hospital+Sadashiv+Peth+Pune'
  },
  {
    id: 'dpu-pcmc',
    name: {
      en: 'Dr. D. Y. Patil Hospital & Research Centre',
      hi: 'डॉ. डी. वाय. पाटिल अस्पताल, पिंपरी',
      mr: 'डॉ. डी. वाय. पाटील रुग्णालय, पिंपरी',
      kn: 'ಡಾ. ಡಿ. ವೈ. ಪಾಟೀಲ್ ಆಸ್ಪತ್ರೆ'
    },
    area: {
      en: 'Pimpri-Chinchwad (PCMC), Pune',
      hi: 'पिंपरी-चिंचवड़ (पीसीएमसी), पुणे',
      mr: 'पिंपरी-चिंचवड (PCMC), पुणे',
      kn: 'ಪಿಂಪ್ರಿ-ಚಿಂಚವಾಡ'
    },
    address: 'Sant Tukaram Nagar, Pimpri, Pune, Maharashtra 411018',
    zone: 'pcmc',
    coordinates: {
      lat: 18.6256,
      lng: 73.8202
    },
    phone: '+91 20 2780 5100',
    specialties: {
      en: ['Neurology Super Speciality', 'Geriatric Medicine', 'Memory Diagnostic Testing'],
      hi: ['न्यूरोलॉजी सुपर स्पेशलिटी', 'वृद्धावस्था चिकित्सा', 'स्मृति नैदानिक परीक्षण'],
      mr: ['न्यूरोलॉजी सुपर स्पेशालिटी', 'ज्येष्ठ नागरिक उपचार', 'स्मृती निदान चाचण्या'],
      kn: ['ನರವಿಜ್ಞಾನ']
    },
    timing: 'Mon - Sat: 8:00 AM - 5:00 PM',
    type: 'tertiary_hospital',
    rating: 4.6,
    reviewsCount: 2150,
    emergency24x7: true,
    googleMapsUrl: 'https://maps.google.com/?q=Dr+DY+Patil+Hospital+Pimpri+Pune'
  }
];

/**
 * Calculates straight-line distance in kilometers using the Haversine formula
 */
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10; // 1 decimal place
}

/**
 * Estimates driving travel time in Pune traffic based on distance (approx 20 km/h city average)
 */
export function estimateTravelTimeMinutes(distanceKm: number): number {
  const avgSpeedKmH = 22; // Pune urban average
  const hours = distanceKm / avgSpeedKmH;
  const mins = Math.round(hours * 60) + 3; // +3 min buffer
  return Math.max(5, mins);
}
