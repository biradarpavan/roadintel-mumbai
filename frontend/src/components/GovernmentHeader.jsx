import React from 'react';
import { Globe, Phone } from 'lucide-react';

export default function GovernmentHeader({ 
  activeTab, 
  setActiveTab, 
  language = 'en', 
  setLanguage 
}) {
  const isMarathi = language === 'mr';

  const navItems = [
    { id: 'home', label: isMarathi ? 'मुख्यपृष्ठ' : 'Home' },
    { id: 'map', label: isMarathi ? 'अपघात नकाशा' : 'Accident Map' },
    { id: 'statistics', label: isMarathi ? 'सांख्यिकी' : 'Statistics' },
    { id: 'hotspots', label: isMarathi ? 'अपघातप्रवण क्षेत्रे (हॉटस्पॉट्स)' : 'Hotspots' },
    { id: 'methodology', label: isMarathi ? 'माहिती व कार्यपद्धती' : 'Data & Methodology' },
    { id: 'reports', label: isMarathi ? 'अहवाल' : 'Reports' },
    { id: 'about', label: isMarathi ? 'आमच्याबद्दल' : 'About' },
  ];

  return (
    <header className="w-full bg-white border-b border-[#D9E0E7] shadow-xs sticky top-0 z-50">
      
      {/* Top Government Bar */}
      <div className="bg-[#0B5CAD] text-white text-[11px] sm:text-xs py-1.5 px-4 sm:px-6 lg:px-8 border-b border-[#084887]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3 font-medium tracking-wide">
            <span className="font-semibold">
              {isMarathi ? 'महाराष्ट्र शासन' : 'Government of Maharashtra'}
            </span>
            <span className="text-blue-200">|</span>
            <span className="text-blue-100 hidden xs:inline">
              {isMarathi ? 'परिवहन विभाग' : 'Department of Transport'}
            </span>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-4">
            <button 
              onClick={() => setActiveTab('about')}
              className="text-blue-100 hover:text-white transition-colors cursor-pointer"
            >
              {isMarathi ? 'मदत' : 'Help'}
            </button>
            <span className="text-blue-300">|</span>
            <button 
              onClick={() => setActiveTab('about')}
              className="text-blue-100 hover:text-white transition-colors cursor-pointer"
            >
              {isMarathi ? 'संपर्क' : 'Contact'}
            </button>
            <span className="text-blue-300">|</span>
            
            {/* Language Selector */}
            <div className="flex items-center space-x-1 font-medium bg-[#084887] px-2 py-0.5 rounded text-[11px]">
              <Globe className="h-3 w-3 text-blue-200 mr-0.5" />
              <button 
                onClick={() => setLanguage('en')}
                className={`transition-colors cursor-pointer ${language === 'en' ? 'text-white font-bold underline' : 'text-blue-200 hover:text-white'}`}
                aria-label="Select English"
              >
                English
              </button>
              <span className="text-blue-300">|</span>
              <button 
                onClick={() => setLanguage('mr')}
                className={`transition-colors cursor-pointer ${language === 'mr' ? 'text-white font-bold underline' : 'text-blue-200 hover:text-white'}`}
                aria-label="मराठी भाषा निवडा"
              >
                मराठी
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Branding Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          
          {/* Logo & Brand Identity */}
          <div 
            className="flex items-center space-x-3.5 cursor-pointer select-none"
            onClick={() => setActiveTab('home')}
          >
            {/* Government Emblem with RI (RoadIntel) */}
            <div className="h-11 w-11 rounded-full bg-[#0B5CAD] text-white flex flex-col items-center justify-center border-2 border-[#1E73BE] shadow-xs shrink-0">
              <span className="text-[13px] font-extrabold tracking-wider leading-none">MH</span>
              <span className="text-[8px] font-semibold text-blue-200 tracking-tighter uppercase mt-0.5">Intel</span>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#0B5CAD]">
                  RoadIntel
                </span>
                <span className="text-xs px-2 py-0.5 rounded font-bold bg-[#E8F1FA] text-[#0B5CAD] border border-[#B8D5F2]">
                  MUMBAI
                </span>
              </div>
              <p className="text-xs sm:text-[13px] text-[#5B6573] font-medium leading-tight">
                {isMarathi 
                  ? 'एकत्रित रस्ता अपघात बुद्धिमत्ता प्रणाली'
                  : 'Unified Road Accident Intelligence Platform'}
              </p>
            </div>
          </div>

          {/* Official Helplines Info Box */}
          <div className="hidden md:flex items-center space-x-4 bg-[#F5F7FA] border border-[#D9E0E7] px-3.5 py-1.5 rounded-md text-xs">
            <div className="flex items-center space-x-1.5 text-[#5B6573]">
              <Phone className="h-3.5 w-3.5 text-[#0B5CAD]" />
              <span className="font-medium">{isMarathi ? 'तातडीच्या मदतीसाठी:' : 'Emergency:'}</span>
            </div>
            <div className="flex items-center space-x-2 font-mono text-[11px]">
              <span className="bg-white border border-[#D9E0E7] px-2 py-0.5 rounded font-bold text-[#1F2937]">
                112
              </span>
              <span className="text-[#5B6573] font-sans text-[11px]">{isMarathi ? 'राष्ट्रीय आपत्कालीन' : 'National'}</span>
              <span className="text-[#D9E0E7]">|</span>
              <span className="bg-white border border-[#D9E0E7] px-2 py-0.5 rounded font-bold text-[#0B5CAD]">
                103
              </span>
              <span className="text-[#5B6573] font-sans text-[11px]">{isMarathi ? 'वाहतूक पोलीस' : 'Traffic Police'}</span>
            </div>
          </div>

        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="bg-[#0B5CAD] border-t border-[#084887]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-1 overflow-x-auto no-scrollbar py-0.5">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`whitespace-nowrap px-3.5 py-2.5 text-xs sm:text-sm font-semibold transition-colors border-b-2 cursor-pointer ${
                    isActive
                      ? 'bg-[#084887] text-white border-white'
                      : 'text-blue-100 hover:text-white hover:bg-[#1268BE] border-transparent'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

    </header>
  );
}
