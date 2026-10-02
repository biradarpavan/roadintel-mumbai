import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function GovernmentFooter({ setActiveTab, language = 'en' }) {
  const isMarathi = language === 'mr';

  return (
    <footer className="bg-white border-t border-[#D9E0E7] text-[#5B6573] text-xs mt-12">
      {/* Upper Footer: Links & Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Column 1: Identity & Purpose */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center space-x-2.5">
              <div className="h-8 w-8 rounded-full bg-[#0B5CAD] text-white flex items-center justify-center font-bold text-xs">
                MH
              </div>
              <span className="font-bold text-sm text-[#1F2937]">RoadIntel Mumbai</span>
            </div>
            <p className="text-[12px] leading-relaxed text-[#5B6573]">
              {isMarathi 
                ? 'मुंबई महानगर प्रदेशासाठी रस्ता अपघात विश्लेषण आणि सुरक्षा माहिती प्रणाली.'
                : 'Road Accident Information System: Unified accident data and safety analytics for Mumbai Metropolitan Region.'}
            </p>
            <div className="pt-2 text-[11px] text-[#5B6573]">
              <span className="font-semibold block text-[#1F2937]">Civic Analytics Prototype</span>
              <span>Inspired by Government of India open data initiatives.</span>
            </div>
          </div>

          {/* Column 2: Portal Navigation */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-[#1F2937] text-xs uppercase tracking-wider">
              {isMarathi ? 'पोर्टल दुवे' : 'Portal Navigation'}
            </h4>
            <ul className="space-y-1.5 text-[12px]">
              <li>
                <button onClick={() => setActiveTab('home')} className="hover:text-[#0B5CAD] transition-colors cursor-pointer">
                  {isMarathi ? 'मुख्यपृष्ठ' : 'Home'}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('map')} className="hover:text-[#0B5CAD] transition-colors cursor-pointer">
                  {isMarathi ? 'अपघात नकाशा' : 'Accident Map'}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('statistics')} className="hover:text-[#0B5CAD] transition-colors cursor-pointer">
                  {isMarathi ? 'सांख्यिकी' : 'Statistics'}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('hotspots')} className="hover:text-[#0B5CAD] transition-colors cursor-pointer">
                  {isMarathi ? 'अपघातप्रवण क्षेत्रे (हॉटस्पॉट्स)' : 'Accident Hotspots'}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('methodology')} className="hover:text-[#0B5CAD] transition-colors cursor-pointer">
                  {isMarathi ? 'माहिती व कार्यपद्धती' : 'Data & Methodology'}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('reports')} className="hover:text-[#0B5CAD] transition-colors cursor-pointer">
                  {isMarathi ? 'अहवाल व डाऊनलोड' : 'Reports & Downloads'}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Data & Transparency */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-[#1F2937] text-xs uppercase tracking-wider">
              {isMarathi ? 'माहिती स्रोत आणि पारदर्शकता' : 'Data & Governance'}
            </h4>
            <ul className="space-y-1.5 text-[12px]">
              <li>
                <button onClick={() => setActiveTab('methodology')} className="hover:text-[#0B5CAD] transition-colors cursor-pointer">
                  {isMarathi ? 'माहिती स्रोत' : 'Data Sources'}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('methodology')} className="hover:text-[#0B5CAD] transition-colors cursor-pointer">
                  {isMarathi ? 'माहिती गुणवत्ता व प्रमाणीकरण' : 'Data Quality & Provenance'}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('methodology')} className="hover:text-[#0B5CAD] transition-colors cursor-pointer">
                  {isMarathi ? 'रेकॉर्ड लिंकेज पद्धती' : 'Record Linkage Methodology'}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('about')} className="hover:text-[#0B5CAD] transition-colors cursor-pointer">
                  {isMarathi ? 'सुलभता धोरण' : 'Accessibility Statement'}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('about')} className="hover:text-[#0B5CAD] transition-colors cursor-pointer">
                  {isMarathi ? 'गोपनीयता धोरण' : 'Privacy Policy & Terms'}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Emergency Contacts & Helplines */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-[#1F2937] text-xs uppercase tracking-wider">
              {isMarathi ? 'आपत्कालीन संपर्क' : 'Emergency Helplines'}
            </h4>
            <div className="space-y-2 text-[12px]">
              <div className="p-2.5 bg-[#F5F7FA] rounded border border-[#D9E0E7]">
                <div className="font-semibold text-[#1F2937]">National Emergency Helpline</div>
                <div className="text-[#0B5CAD] font-bold text-sm font-mono">112</div>
                <div className="text-[11px] text-[#5B6573]">All-in-one Emergency (Police, Fire, Ambulance)</div>
              </div>
              <div className="p-2.5 bg-[#F5F7FA] rounded border border-[#D9E0E7]">
                <div className="font-semibold text-[#1F2937]">Mumbai Traffic Police Helpline</div>
                <div className="text-[#0B5CAD] font-bold text-sm font-mono">103 / 8454999999</div>
                <div className="text-[11px] text-[#5B6573]">Traffic congestion, accidents & assistance</div>
              </div>
            </div>
          </div>

        </div>

        {/* Official Statutory Disclaimer */}
        <div className="mt-8 pt-6 border-t border-[#D9E0E7] text-[11px] leading-relaxed text-[#5B6573]">
          <p className="font-medium text-[#1F2937] mb-1">
            {isMarathi ? 'अस्वीकृती (Disclaimer):' : 'Disclaimer:'}
          </p>
          <p>
            {isMarathi
              ? 'रोडसेफ मुंबई हे रस्ता सुरक्षा संशोधन आणि सार्वजनिक माहितीसाठी विकसित केलेले विश्लेषणात्मक प्रोटोटाइप आहे. या प्रणालीद्वारे दर्शविलेली अपघातप्रवण क्षेत्रे (हॉटस्पॉट्स) ही डेटा विश्लेषणावर आधारित निष्कर्ष आहेत आणि जोपर्यंत स्पष्टपणे नमूद केलेले नाही तोपर्यंत ती अधिकृत सरकारी ब्लॅक-स्पॉट पदनामे नाहीत.'
              : 'RoadSafe Mumbai is a data analytics prototype for road safety research and public information. Accident hotspot classifications shown by this system are analytical outputs and are not official government designations unless explicitly stated.'}
          </p>
        </div>
      </div>

      {/* Bottom Sub-footer */}
      <div className="bg-[#EDF2F7] border-t border-[#D9E0E7] py-3 text-[11px] text-center text-[#5B6573]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            &copy; 2026 RoadSafe Mumbai. Developed for civic road safety transparency and research.
          </div>
          <div className="flex items-center space-x-4">
            <span className="inline-flex items-center text-[#18864B]">
              <ShieldCheck className="h-3 w-3 mr-1" />
              Verified Public Data Service
            </span>
            <span>Version 2.0 (Light Civic Edition)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
