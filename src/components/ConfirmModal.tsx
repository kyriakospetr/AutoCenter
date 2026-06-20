import { Trash2 } from "lucide-react";

interface Props {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl p-6 md:p-8 w-full max-w-md transform transition-all flex flex-col gap-5 text-center">
        {/* Icon */}
        <div className="w-14 h-14 xl:w-16 xl:h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto border border-red-100">
          <Trash2 className="text-red-500 xl:w-7 xl:h-7" size={24} />
        </div>

        {/* Text */}
        <div>
          <h2 className="text-lg xl:text-xl font-bold text-slate-900 tracking-tight">{title}</h2>
          <p className="text-sm xl:text-base text-slate-500 mt-2 leading-relaxed">{message}</p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col-reverse sm:flex-row gap-3 mt-2">
          <button
            onClick={onCancel}
            className="flex-1 py-3 px-5 rounded-xl border border-slate-300 text-slate-600 text-xs xl:text-sm font-bold tracking-wider hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Ακύρωση
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 px-5 rounded-xl bg-red-600 text-white text-xs xl:text-sm font-bold tracking-wider hover:bg-red-700 transition-colors shadow-sm cursor-pointer"
          >
            Διαγραφή
          </button>
        </div>
      </div>
    </div>
  );
}