import React, { createContext, useContext, useState, ReactNode } from 'react';
import { X, ChevronLeft, ChevronRight, CheckCircle, Calendar as CalendarIcon, Clock, Globe } from 'lucide-react';
import { Button } from '../components/ui';
import { useAuth } from './AuthContext';
import { useLanguage } from './LanguageContext';

interface BookingContextType {
  isBookingOpen: boolean;
  openBooking: () => void;
  closeBooking: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

const TIME_SLOTS = [
  '10:00 - 11:00',
  '11:00 - 12:00',
  '14:00 - 15:00',
  '15:00 - 16:00',
  '16:00 - 17:00',
  '17:00 - 18:00'
];

// Chinese Holidays for 2025 and 2026
const CN_HOLIDAYS = [
  // 2025
  '2025-01-01', // New Year
  '2025-01-28', '2025-01-29', '2025-01-30', '2025-01-31', '2025-02-01', '2025-02-02', '2025-02-03', '2025-02-04', // CNY
  '2025-04-04', '2025-04-05', '2025-04-06', // Qingming
  '2025-05-01', '2025-05-02', '2025-05-03', '2025-05-04', '2025-05-05', // Labor Day
  '2025-05-31', '2025-06-01', '2025-06-02', // Dragon Boat
  '2025-10-01', '2025-10-02', '2025-10-03', '2025-10-04', '2025-10-05', '2025-10-06', '2025-10-07', '2025-10-08', // National Day
  // 2026 (Estimated)
  '2026-01-01',
  '2026-02-16', '2026-02-17', '2026-02-18', '2026-02-19', '2026-02-20', '2026-02-21', '2026-02-22', // CNY
  '2026-04-05', // Qingming
  '2026-05-01', '2026-05-02', '2026-05-03', // Labor Day
  '2026-06-19', // Dragon Boat
  '2026-09-25', // Mid-Autumn
  '2026-10-01', '2026-10-02', '2026-10-03', '2026-10-04', '2026-10-05', '2026-10-06', '2026-10-07' // National Day
];

export const BookingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { addBooking } = useAuth();
  const { lang, t } = useLanguage();
  
  // Booking State
  const [step, setStep] = useState<'date' | 'success'>('date');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const openBooking = () => {
    setIsOpen(true);
    setStep('date');
    setSelectedDate(null);
    setSelectedSlot(null);
  };

  const closeBooking = () => setIsOpen(false);

  // Helper: Get Today in China Standard Time (UTC+8)
  const getChinaToday = () => {
    const now = new Date();
    // Convert current local time to UTC, then add 8 hours
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const chinaTime = new Date(utc + (3600000 * 8));
    chinaTime.setHours(0, 0, 0, 0); // Normalized to midnight
    return chinaTime;
  };

  const isDateDisabled = (date: Date) => {
    const chinaToday = getChinaToday();
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);

    // 1. Past dates (relative to China)
    if (d.getTime() < chinaToday.getTime()) return true;

    // 2. Weekends (0 = Sunday, 6 = Saturday)
    const day = d.getDay();
    if (day === 0 || day === 6) return true;

    // 3. Holidays
    // Format date as YYYY-MM-DD using local time methods since 'date' is constructed from year/month/day
    // Note: We need to ensure YYYY-MM-DD matches the strings in CN_HOLIDAYS
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const dayStr = String(d.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${dayStr}`;

    if (CN_HOLIDAYS.includes(dateString)) return true;

    return false;
  };

  const handleSubmit = () => {
    if (selectedDate && selectedSlot) {
      addBooking({
        id: Date.now().toString(),
        date: selectedDate.toISOString(),
        slot: selectedSlot,
        status: 'confirmed',
        createdAt: new Date().toISOString()
      });
      setStep('success');
    }
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay(); // 0-6

    const days = [];
    // Empty slots for previous month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 w-10" />);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const disabled = isDateDisabled(date);
      const isSelected = selectedDate?.toDateString() === date.toDateString();

      days.push(
        <button
          key={i}
          disabled={disabled}
          onClick={() => { setSelectedDate(date); setSelectedSlot(null); }}
          className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium transition-all
            ${isSelected 
              ? 'bg-gemini-ultra text-white shadow-lg shadow-gemini-ultra/30' 
              : disabled 
                ? 'text-slate-700 cursor-not-allowed' 
                : 'text-slate-300 hover:bg-white/10 hover:text-white'
            }
          `}
        >
          {i}
        </button>
      );
    }

    return days;
  };

  return (
    <BookingContext.Provider value={{ isBookingOpen: isOpen, openBooking, closeBooking }}>
      {children}
      
      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={closeBooking} />
          
          <div className="relative w-full max-w-4xl bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-[fadeIn_0.3s_ease-out] flex flex-col md:flex-row min-h-[500px]">
            <button onClick={closeBooking} className="absolute top-4 right-4 text-slate-500 hover:text-white z-10">
              <X size={24} />
            </button>

            {step === 'date' ? (
              <>
                {/* Left: Calendar */}
                <div className="flex-1 p-8 border-b md:border-b-0 md:border-r border-white/10">
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-white mb-1">{t('scheduleConsultation')}</h2>
                    <p className="text-slate-400 text-sm">{t('calendarDaysShort') ? "Timezone: China Standard Time (UTC+8)" : "Select a date for your session"}</p>
                  </div>

                  <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                    <div className="flex items-center justify-between mb-6">
                      <button onClick={handlePrevMonth} className="p-1 hover:bg-white/10 rounded-full text-slate-400 hover:text-white">
                        <ChevronLeft size={20} />
                      </button>
                      <span className="text-white font-medium">
                        {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                      </span>
                      <button onClick={handleNextMonth} className="p-1 hover:bg-white/10 rounded-full text-slate-400 hover:text-white">
                        <ChevronRight size={20} />
                      </button>
                    </div>

                    <div className="grid grid-cols-7 gap-1 mb-2">
                       {/* Weekday headers */}
                       {(t('calendarDaysShort') as string[]).map((d: string) => (
                         <div key={d} className="h-10 w-10 flex items-center justify-center text-xs font-bold text-slate-500 uppercase">
                           {d}
                         </div>
                       ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {renderCalendar()}
                    </div>
                  </div>
                </div>

                {/* Right: Slots */}
                <div className="w-full md:w-80 bg-navy-900/50 p-8 flex flex-col">
                  <h3 className="text-lg font-medium text-white mb-6 flex items-center gap-2">
                    <Clock size={18} /> {t('selectTime')}
                  </h3>

                  <div className="flex-grow space-y-3">
                    {!selectedDate ? (
                      <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center">
                        <CalendarIcon size={32} className="mb-3 opacity-50" />
                        <p className="text-sm">{t('pleaseSelectDate')}</p>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm text-gemini-ultra mb-4 font-medium flex items-center gap-2">
                          <CheckCircle size={14} /> {selectedDate.toLocaleDateString()}
                        </p>
                        {TIME_SLOTS.map(slot => (
                          <button
                            key={slot}
                            onClick={() => setSelectedSlot(slot)}
                            className={`w-full py-3 px-4 rounded-xl text-sm font-medium border transition-all text-left flex justify-between items-center group
                              ${selectedSlot === slot 
                                ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)]' 
                                : 'bg-white/5 text-slate-300 border-white/5 hover:bg-white/10 hover:border-white/20'
                              }
                            `}
                          >
                            {slot}
                            {selectedSlot === slot && <CheckCircle size={16} className="text-black" />}
                          </button>
                        ))}
                      </>
                    )}
                  </div>
                  
                  {/* Timezone Indicator */}
                  <div className="mt-6 pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2 text-xs text-slate-500 justify-center">
                        <Globe size={12} />
                        <span>All times are displayed in CST (UTC+8)</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Button 
                      onClick={handleSubmit} 
                      disabled={!selectedDate || !selectedSlot}
                      variant="gemini"
                      className="w-full font-bold"
                    >
                      {t('confirmBooking')}
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center animate-fade-in">
                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6 border border-green-500/20">
                  <CheckCircle size={40} className="text-green-500" />
                </div>
                <h2 className="text-3xl font-semibold text-white mb-4">{t('bookingConfirmed')}</h2>
                <p className="text-slate-400 max-w-md leading-relaxed mb-8">
                  {t('bookingSuccessMsg1')}
                  <span className="text-white font-medium">{selectedDate?.toLocaleDateString()}</span>
                  {t('bookingSuccessMsg2')}
                  <span className="text-white font-medium">{selectedSlot}</span> (CST)
                  {t('bookingSuccessMsg3')}
                </p>
                <Button onClick={closeBooking} variant="outline" className="border-white/10">
                  {t('backToBrowsing')}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};