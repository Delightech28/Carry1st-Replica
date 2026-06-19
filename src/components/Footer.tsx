import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, MessageSquare, Mail, Phone, Zap } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#07070b] border-t border-white/5 py-12 text-gray-500 text-sm mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
                <span className="font-extrabold text-xs font-mono">C1</span>
              </div>
              <span className="text-lg font-bold text-white">
                Carry<span className="text-indigo-400">1st</span>
              </span>
            </div>
            <p className="text-gray-400 leading-relaxed mb-4">
              Africa's premier digital goods and game top-up store. Purchase instant pins, vouchers, and airtime with local secure payments.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-indigo-400 transition-colors">
                <MessageSquare className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-indigo-400 transition-colors">
                <Mail className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-indigo-400 transition-colors">
                <Phone className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-medium mb-4 uppercase tracking-wider text-xs">Support & Help</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">Frequently Asked Questions</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Payment Methods Info</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 text-center text-xs font-mono w-full text-gray-500">
          <p>© 2026 Carry1st Tech Ltd. All mock rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
