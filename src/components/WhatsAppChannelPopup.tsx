import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function WhatsAppChannelPopup() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const hasSeenPopup = sessionStorage.getItem('whatsapp_popup_seen');
      if (!hasSeenPopup) {
        setIsVisible(true);
      }
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem('whatsapp_popup_seen', 'true');
  };

  const handleJoin = () => {
    window.open('https://whatsapp.com/channel/0029Vb6qjHpCHDyiWBPyKO2y', '_blank');
    handleClose();
  };

  if (!isVisible) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-70 z-50 animate-fade-in"
        onClick={handleClose}
      ></div>

      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4 animate-fade-in">
        <div className="bg-gradient-to-br from-black via-gray-900 to-red-900 rounded-2xl shadow-2xl overflow-hidden">
          <div className="relative p-8">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            <div className="text-center space-y-6">
              <div className="w-20 h-20 mx-auto bg-green-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  Exclusive Deals Await!
                </h2>
                <p className="text-red-400 text-xl font-semibold mb-3">
                  50% OFF Special Offer
                </p>
                <p className="text-gray-300">
                  Join our WhatsApp channel for exclusive discounts, early access to new
                  collections, and special member-only offers.
                </p>
              </div>

              <button
                onClick={handleJoin}
                className="w-full py-4 bg-green-500 text-white font-bold text-lg rounded-full hover:bg-green-600 transition-colors shadow-lg"
              >
                Join WhatsApp Channel Now
              </button>

              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
