import React, { createContext, useContext, useState, ReactNode } from 'react';
import { X, ChevronLeft, ChevronRight, CheckCircle, Calendar as CalendarIcon, Clock } from 'lucide-react';
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

  const handleSubmit = () => {
    if (selectedDate && selectedSlot) {
      // Persist the booking to the user profile
      addBooking({
        id: Date.now().toString(),
        date: selectedDate.toISOString(),
        slot: selectedSlot,
        status: 'confirmed',
        createdAt: new Date().toISOString()
      });

      // Show success step
      setTimeout(() => {
        setStep('success');
      }, 300);
    }
  };

  // --- Calendar Render Helpers ---
  const locale = lang === 'cn' ? 'zh-CN' : 'en-US';
  const CALENDAR_DAYS = t('calendarDaysShort') as string[];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    return { daysInMonth, firstDay };
  };

  const { daysInMonth, firstDay } = getDaysInMonth(currentMonth);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const changeMonth = (delta: number) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + delta);
    setCurrentMonth(newDate);
  };

  const isDateDisabled = (day: number) => {
    const dateToCheck = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return dateToCheck < today;
  };

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentMonth.getMonth() &&
      selectedDate.getFullYear() === currentMonth.getFullYear()
    );
  };

  return (
    <BookingContext.Provider value={{ isBookingOpen: isOpen, openBooking, closeBooking }}>
      {children}
      
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={closeBooking} />
          
          {/* Modal Container */}
          <div className="relative w-full max-w-2xl bg-navy-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/5">
              <h2 className="text-xl font-medium text-white tracking-tight">
                {step === 'success' ? t('bookingConfirmed') : t('scheduleConsultation')}
              </h2>
              <button 
                onClick={closeBooking}
                className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto custom-scrollbar">
              {step === 'date' ? (
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Left: Calendar */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-white">
                        {currentMonth.toLocaleString(locale, { month: 'long', year: 'numeric' })}
                      </h3>
                      <div className="flex gap-1">
                        <button onClick={() => changeMonth(-1)} className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-white disabled:opacity-30" disabled={currentMonth.getMonth() === today.getMonth() && currentMonth.getFullYear() === today.getFullYear()}>
                          <ChevronLeft size={16} />
                        </button>
                        <button onClick={() => changeMonth(1)} className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-white">
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {CALENDAR_DAYS.map(d => (
                        <div key={d} className="text-center text-[10px] uppercase font-bold text-slate-500 py-1">
                          {d}
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                      {Array.from({ length: firstDay }).map((_, i) => (
                        <div key={`empty-${i}`} />
                      ))}
                      {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const disabled = isDateDisabled(day);
                        const selected = isSelected(day);
                        
                        return (
                          <button
                            key={day}
                            disabled={disabled}
                            onClick={() => {
                              const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                              setSelectedDate(d);
                              setSelectedSlot(null); // Reset slot on date change
                            }}
                            className={`
                              h-10 w-full rounded-lg text-sm font-medium transition-all duration-200 relative
                              ${disabled ? 'text-slate-700 cursor-not-allowed' : 'hover:bg-white/10 text-slate-300'}
                              ${selected ? 'bg-gemini-ultra text-white shadow-[0_0_15px_rgba(66,133,244,0.4)] z-10' : ''}
                            `}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right: Time Slots */}
                  <div className="flex-1 border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-8">
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-white mb-1">{t('selectTime')}</h3>
                      <p className="text-xs text-slate-500">
                        {selectedDate 
                          ? selectedDate.toLocaleDateString(locale, { weekday: 'long', month: 'long', day: 'numeric' })
                          : t('pleaseSelectDate')}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                       {TIME_SLOTS.map(slot => (
                         <button
                           key={slot}
                           disabled={!selectedDate}
                           onClick={() => setSelectedSlot(slot)}
                           className={`
                             py-2 px-3 rounded-lg text-xs font-medium border transition-all
                             ${!selectedDate 
                                ? 'border-white/5 text-slate-600 cursor-not-allowed' 
                                : selectedSlot === slot
                                  ? 'bg-white text-black border-white shadow-[0_0_10px_rgba(255,255,255,0.3)]'
                                  : 'border-white/10 text-slate-300 hover:border-white/30 hover:bg-white/5'}
                           `}
                         >
                           {slot}
                         </button>
                       ))}
                    </div>
                    
                    <div className="mt-8">
                      <Button 
                        variant="gemini" 
                        size="md"
                        className="w-full text-sm h-10 group" 
                        disabled={!selectedDate || !selectedSlot}
                        onClick={handleSubmit}
                      >
                        {t('confirmBooking')}
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center animate-fade-in">
                   <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-6 text-green-500 border border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                     <CheckCircle size={32} />
                   </div>
                   <h3 className="text-2xl font-semibold text-white mb-2">{t('bookingConfirmed')}!</h3>
                   <p className="text-slate-400 max-w-sm mb-8">
                     {t('bookingSuccessMsg1')}
                     <span className="text-white font-medium">{selectedDate?.toLocaleDateString(locale)}</span>
                     {t('bookingSuccessMsg2')}
                     <span className="text-white font-medium">{selectedSlot}</span>
                     {t('bookingSuccessMsg3')}
                   </p>
                   <Button variant="outline" onClick={closeBooking} className="border-white/10">
                     {t('backToBrowsing')}
                   </Button>
                </div>
              )}
            </div>

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