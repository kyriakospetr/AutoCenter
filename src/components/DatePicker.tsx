import { useState, useRef, useEffect } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";

interface DatePickerProps {
  id?: string;
  name?: string;
  value: string; 
  onChange: (value: string) => void;
  placeholder?: string;
  hasError?: boolean;
}

const MONTHS = [
  "Ιανουάριος", "Φεβρουάριος", "Μάρτιος", "Απρίλιος", "Μάιος", "Ιούνιος",
  "Ιούλιος", "Αύγουστος", "Σεπτέμβριος", "Οκτώβριος", "Νοέμβριος", "Δεκέμβριος"
];

const DAYS = ["Δευ", "Τρι", "Τετ", "Πεμ", "Παρ", "Σαβ", "Κυρ"];

export function DatePicker({
  id,
  name,
  value,
  onChange,
  placeholder = "Επιλέξτε ημερομηνία",
  hasError = false,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse initial date or fallback to today
  const initialDate = value ? new Date(value) : new Date();
  const [currentMonth, setCurrentMonth] = useState(initialDate.getMonth());
  const [currentYear, setCurrentYear] = useState(initialDate.getFullYear());

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    const day = new Date(year, month, 1).getDay();
    // Convert Sunday (0) to 6, and Monday-Saturday (1-6) to 0-5
    return day === 0 ? 6 : day - 1;
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  const handleDateSelect = (day: number) => {
    // Format to YYYY-MM-DD
    const formattedMonth = String(currentMonth + 1).padStart(2, "0");
    const formattedDay = String(day).padStart(2, "0");
    onChange(`${currentYear}-${formattedMonth}-${formattedDay}`);
    setIsOpen(false);
  };

  // Format display text for the input
  const displayValue = value
    ? `${value.split("-")[2]}/${value.split("-")[1]}/${value.split("-")[0]}`
    : "";

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const startingDay = getFirstDayOfMonth(currentYear, currentMonth);
  
  // Calculate selected values for highlighting
  const selectedYear = value ? parseInt(value.split("-")[0]) : null;
  const selectedMonth = value ? parseInt(value.split("-")[1]) - 1 : null;
  const selectedDay = value ? parseInt(value.split("-")[2]) : null;

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Input Trigger */}
      <div 
        className="relative cursor-pointer" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <CalendarIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 xl:w-5 xl:h-5" />
        <input
          id={id}
          name={name}
          type="text"
          readOnly
          value={displayValue}
          placeholder={placeholder}
          className={`w-full pl-11 pr-4 py-3 border rounded-xl text-sm xl:text-base text-slate-800 cursor-pointer transition-all ${
            isOpen 
              ? "bg-white border-slate-300 ring-2 ring-slate-100" 
              : "bg-slate-50/50"
          } ${
            hasError
              ? "border-red-400 bg-red-50/30"
              : "border-slate-200 hover:border-slate-300"
          }`}
        />
      </div>

      {/* Popover Calendar */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-slate-200/80 rounded-2xl shadow-xl z-50 p-5 animate-in fade-in zoom-in-95 duration-200">
          
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-5">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            
            <div className="text-sm font-bold text-slate-800 tracking-wide">
              {MONTHS[currentMonth]} {currentYear}
            </div>
            
            <button
              type="button"
              onClick={handleNextMonth}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Days Header */}
          <div className="grid grid-cols-7 mb-2 gap-1">
            {DAYS.map((day) => (
              <div key={day} className="text-center text-[11px] font-bold uppercase tracking-wider text-slate-400 py-1">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells before start of month */}
            {Array.from({ length: startingDay }).map((_, i) => (
              <div key={`empty-${i}`} className="h-9" />
            ))}
            
            {/* Days of the month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNumber = i + 1;
              const isSelected = 
                selectedDay === dayNumber && 
                selectedMonth === currentMonth && 
                selectedYear === currentYear;
                
              const isToday = 
                dayNumber === new Date().getDate() && 
                currentMonth === new Date().getMonth() && 
                currentYear === new Date().getFullYear();

              return (
                <button
                  key={dayNumber}
                  type="button"
                  onClick={() => handleDateSelect(dayNumber)}
                  className={`
                    h-9 w-full rounded-xl text-sm font-medium transition-all flex items-center justify-center
                    ${isSelected 
                      ? "bg-slate-900 text-white shadow-md shadow-slate-900/20" 
                      : "text-slate-700 hover:bg-slate-100"
                    }
                    ${!isSelected && isToday ? "text-blue-600 font-bold bg-blue-50/50" : ""}
                  `}
                >
                  {dayNumber}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}