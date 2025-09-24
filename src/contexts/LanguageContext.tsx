import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'kn';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation
    home: "Home",
    aboutUs: "About Us",
    services: "Services",
    login: "Login",
    logout: "Logout",
    portal: "Portal",
    buyerPortal: "Buyer Portal",
    sellerPortal: "Seller Portal",
    
    // Hero Section
    appName: "KAMTA",
    tagline: "Pre-owned Agricultural Equipment Marketplace",
    karnatakService: "Serving farmers across Karnataka",
    
    // Statistics
    farmersServed: "11,000+ Farmers Served",
    trustedPlatform: "Trusted Platform Across Karnataka",
    connectingBuyersSellers: "Connecting buyers and sellers with transparency",
    documentVerification: "100% Document Verification",
    documentTypes: "RC, Insurance, Forms 29/30, NOC",
    documentsVerified: "All documents verified and stored digitally",
    minDealValue: "Minimum ₹2.5L Deal Value",
    qualityAssured: "Quality Assured Equipment",
    premiumEquipment: "Premium pre-owned agricultural machinery",
    stockManagement: "Complete Stock Management",
    digitalPlatform: "Digital Platform for Dealers",
    trackInventory: "Track inventory, generate agreements, analytics",
    
    // Services
    buyPreowned: "Buy Pre-owned Equipment",
    buyDescription: "Browse verified pre-owned tractors and agricultural equipment with complete documentation",
    startBuying: "Start Buying",
    sellPreowned: "Sell Your Pre-owned",
    sellDescription: "List your pre-owned tractors and equipment with complete documentation and reach verified buyers",
    listEquipment: "List Your Equipment",
    
    // Available Equipment
    availableEquipment: "Available Equipment for Sale",
    browseCollection: "Browse our collection of verified pre-owned agricultural equipment and commercial vehicles",
    loadingVehicles: "Loading vehicles...",
    noVehicles: "No vehicles available at the moment",
    checkBackSoon: "Check back soon for new listings!",
    buyNow: "Buy Now",
    
    // Vehicle Details
    year: "Year",
    type: "Type",
    ownership: "Ownership",
    property: "Property",
    registration: "Reg",
    originalRC: "Original RC",
    insurance: "Insurance",
    noc: "NOC",
    
    // Features
    vehicleStockManagement: "Vehicle Stock Management",
    vehicleStockDesc: "Complete digital platform for managing tractors and commercial vehicles",
    documentVerificationFeature: "Document Verification",
    documentVerificationDesc: "RC, Insurance, Forms 29/30, NOC - all documents verified and stored",
    farmersServedFeature: "11,000+ Farmers Served",
    farmersServedDesc: "Trusted platform connecting buyers and sellers across Karnataka",
    agreementGeneration: "Agreement Generation",
    agreementGenerationDesc: "Automated PDF agreements with complete documentation",
    analyticsReports: "Analytics & Reports",
    analyticsReportsDesc: "Track stock movement, buyer interests, and market trends",
    minValueFeature: "Minimum ₹2.5L Value",
    minValueDesc: "Quality assured with minimum deal value enforcement",
    
    // Stats
    verifiedDocuments: "Verified Documents",
    systemAccess: "System Access",
    
    // Contact
    contactForService: "Contact for Service",
    clickToCall: "Click to call",
    
    // Leadership
    leadershipTeam: "Our Leadership Team",
    founderCEO: "Founder & CEO",
    managingDirector: "Managing Director",
    chairmanAdvisor: "Chairman & Advisor",
    
    // Footer
    quickLinks: "Quick Links",
    contact: "Contact",
    email: "Email",
    phone: "Phone",
    address: "Address",
    allRightsReserved: "All rights reserved",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service"
  },
  kn: {
    // Navigation
    home: "ಮುಖಪುಟ",
    aboutUs: "ನಮ್ಮ ಬಗ್ಗೆ",
    services: "ಸೇವೆಗಳು",
    login: "ಲಾಗಿನ್",
    logout: "ಲಾಗೌಟ್",
    portal: "ಪೋರ್ಟಲ್",
    buyerPortal: "ಖರೀದಿದಾರ ಪೋರ್ಟಲ್",
    sellerPortal: "ಮಾರಾಟಗಾರ ಪೋರ್ಟಲ್",
    
    // Hero Section
    appName: "ಕಂಠ",
    tagline: "ಬಳಸಿದ ಕೃಷಿ ಉಪಕರಣಗಳ ಮಾರುಕಟ್ಟೆ",
    karnatakService: "ಕರ್ನಾಟಕದಾದ್ಯಂತ ರೈತರಿಗೆ ಸೇವೆ",
    
    // Statistics
    farmersServed: "11,000+ ರೈತರಿಗೆ ಸೇವೆ",
    trustedPlatform: "ಕರ್ನಾಟಕದಾದ್ಯಂತ ವಿಶ್ವಾಸಾರ್ಹ ವೇದಿಕೆ",
    connectingBuyersSellers: "ಪಾರದರ್ಶಕತೆಯೊಂದಿಗೆ ಖರೀದಿದಾರರು ಮತ್ತು ಮಾರಾಟಗಾರರನ್ನು ಸಂಪರ್ಕಿಸುವುದು",
    documentVerification: "100% ದಾಖಲೆ ಪರಿಶೀಲನೆ",
    documentTypes: "RC, ವಿಮೆ, ಫಾರ್ಮ್ 29/30, NOC",
    documentsVerified: "ಎಲ್ಲಾ ದಾಖಲೆಗಳನ್ನು ಪರಿಶೀಲಿಸಲಾಗಿದೆ ಮತ್ತು ಡಿಜಿಟಲ್ ಆಗಿ ಸಂಗ್ರಹಿಸಲಾಗಿದೆ",
    minDealValue: "ಕನಿಷ್ಠ ₹2.5L ವ್ಯವಹಾರ ಮೌಲ್ಯ",
    qualityAssured: "ಗುಣಮಟ್ಟದ ಖಾತರಿ ಉಪಕರಣಗಳು",
    premiumEquipment: "ಪ್ರೀಮಿಯಂ ಬಳಸಿದ ಕೃಷಿ ಯಂತ್ರೋಪಕರಣಗಳು",
    stockManagement: "ಸಂಪೂರ್ಣ ಸ್ಟಾಕ್ ನಿರ್ವಹಣೆ",
    digitalPlatform: "ವಿತರಕರಿಗೆ ಡಿಜಿಟಲ್ ವೇದಿಕೆ",
    trackInventory: "ದಾಸ್ತಾನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ, ಒಪ್ಪಂದಗಳನ್ನು ರಚಿಸಿ, ವಿಶ್ಲೇಷಣೆ",
    
    // Services
    buyPreowned: "ಬಳಸಿದ ಉಪಕರಣಗಳನ್ನು ಖರೀದಿಸಿ",
    buyDescription: "ಸಂಪೂರ್ಣ ದಾಖಲೆಗಳೊಂದಿಗೆ ಪರಿಶೀಲಿಸಿದ ಬಳಸಿದ ಟ್ರಾಕ್ಟರ್‌ಗಳು ಮತ್ತು ಕೃಷಿ ಉಪಕರಣಗಳನ್ನು ಬ್ರೌಸ್ ಮಾಡಿ",
    startBuying: "ಖರೀದಿ ಪ್ರಾರಂಭಿಸಿ",
    sellPreowned: "ನಿಮ್ಮ ಬಳಸಿದ ವಾಹನ ಮಾರಾಟ",
    sellDescription: "ಸಂಪೂರ್ಣ ದಾಖಲೆಗಳೊಂದಿಗೆ ನಿಮ್ಮ ಬಳಸಿದ ಟ್ರಾಕ್ಟರ್‌ಗಳು ಮತ್ತು ಉಪಕರಣಗಳನ್ನು ಪಟ್ಟಿ ಮಾಡಿ",
    listEquipment: "ನಿಮ್ಮ ಉಪಕರಣ ಪಟ್ಟಿ",
    
    // Available Equipment
    availableEquipment: "ಮಾರಾಟಕ್ಕೆ ಲಭ್ಯವಿರುವ ಉಪಕರಣಗಳು",
    browseCollection: "ಪರಿಶೀಲಿಸಿದ ಬಳಸಿದ ಕೃಷಿ ಉಪಕರಣಗಳು ಮತ್ತು ವಾಣಿಜ್ಯ ವಾಹನಗಳ ನಮ್ಮ ಸಂಗ್ರಹವನ್ನು ಬ್ರೌಸ್ ಮಾಡಿ",
    loadingVehicles: "ವಾಹನಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...",
    noVehicles: "ಈ ಸಮಯದಲ್ಲಿ ಯಾವುದೇ ವಾಹನಗಳು ಲಭ್ಯವಿಲ್ಲ",
    checkBackSoon: "ಹೊಸ ಪಟ್ಟಿಗಳಿಗಾಗಿ ಶೀಘ್ರದಲ್ಲಿ ಮರಳಿ ಪರಿಶೀಲಿಸಿ!",
    buyNow: "ಈಗ ಖರೀದಿಸಿ",
    
    // Vehicle Details
    year: "ವರ್ಷ",
    type: "ಪ್ರಕಾರ",
    ownership: "ಮಾಲೀಕತ್ವ",
    property: "ಆಸ್ತಿ",
    registration: "ನೋಂದಣಿ",
    originalRC: "ಮೂಲ RC",
    insurance: "ವಿಮೆ",
    noc: "NOC",
    
    // Features
    vehicleStockManagement: "ವಾಹನ ಸ್ಟಾಕ್ ನಿರ್ವಹಣೆ",
    vehicleStockDesc: "ಟ್ರಾಕ್ಟರ್‌ಗಳು ಮತ್ತು ವಾಣಿಜ್ಯ ವಾಹನಗಳನ್ನು ನಿರ್ವಹಿಸಲು ಸಂಪೂರ್ಣ ಡಿಜಿಟಲ್ ವೇದಿಕೆ",
    documentVerificationFeature: "ದಾಖಲೆ ಪರಿಶೀಲನೆ",
    documentVerificationDesc: "RC, ವಿಮೆ, ಫಾರ್ಮ್ 29/30, NOC - ಎಲ್ಲಾ ದಾಖಲೆಗಳನ್ನು ಪರಿಶೀಲಿಸಲಾಗಿದೆ ಮತ್ತು ಸಂಗ್ರಹಿಸಲಾಗಿದೆ",
    farmersServedFeature: "11,000+ ರೈತರಿಗೆ ಸೇವೆ",
    farmersServedDesc: "ಕರ್ನಾಟಕದಾದ್ಯಂತ ಖರೀದಿದಾರರು ಮತ್ತು ಮಾರಾಟಗಾರರನ್ನು ಸಂಪರ್ಕಿಸುವ ವಿಶ್ವಾಸಾರ್ಹ ವೇದಿಕೆ",
    agreementGeneration: "ಒಪ್ಪಂದ ಉತ್ಪಾದನೆ",
    agreementGenerationDesc: "ಸಂಪೂರ್ಣ ದಾಖಲೆಗಳೊಂದಿಗೆ ಸ್ವಯಂಚಾಲಿತ PDF ಒಪ್ಪಂದಗಳು",
    analyticsReports: "ವಿಶ್ಲೇಷಣೆ ಮತ್ತು ವರದಿಗಳು",
    analyticsReportsDesc: "ಸ್ಟಾಕ್ ಚಲನೆ, ಖರೀದಿದಾರ ಆಸಕ್ತಿಗಳು ಮತ್ತು ಮಾರುಕಟ್ಟೆ ಪ್ರವೃತ್ತಿಗಳನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ",
    minValueFeature: "ಕನಿಷ್ಠ ₹2.5L ಮೌಲ್ಯ",
    minValueDesc: "ಕನಿಷ್ಠ ವ್ಯವಹಾರ ಮೌಲ್ಯ ಜಾರಿಯೊಂದಿಗೆ ಗುಣಮಟ್ಟದ ಖಾತರಿ",
    
    // Stats
    verifiedDocuments: "ಪರಿಶೀಲಿಸಿದ ದಾಖಲೆಗಳು",
    systemAccess: "ಸಿಸ್ಟಮ್ ಪ್ರವೇಶ",
    
    // Contact
    contactForService: "ಸೇವೆಗಾಗಿ ಸಂಪರ್ಕಿಸಿ",
    clickToCall: "ಕರೆ ಮಾಡಲು ಕ್ಲಿಕ್ ಮಾಡಿ",
    
    // Leadership
    leadershipTeam: "ನಮ್ಮ ನಾಯಕತ್ವ ತಂಡ",
    founderCEO: "ಸಂಸ್ಥಾಪಕ ಮತ್ತು CEO",
    managingDirector: "ವ್ಯವಸ್ಥಾಪಕ ನಿರ್ದೇಶಕ",
    chairmanAdvisor: "ಅಧ್ಯಕ್ಷ ಮತ್ತು ಸಲಹೆಗಾರ",
    
    // Footer
    quickLinks: "ತ್ವರಿತ ಲಿಂಕ್‌ಗಳು",
    contact: "ಸಂಪರ್ಕ",
    email: "ಇಮೇಲ್",
    phone: "ಫೋನ್",
    address: "ವಿಳಾಸ",
    allRightsReserved: "ಎಲ್ಲಾ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ",
    privacyPolicy: "ಗೌಪ್ಯತಾ ನೀತಿ",
    termsOfService: "ಸೇವಾ ನಿಯಮಗಳು"
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};