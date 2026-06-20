import React, { useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  Gauge,
  ClipboardList,
  FileText,
} from "lucide-react";
import { useUpdateServiceEntry } from "../hooks";
import { Vehicle } from "../../vehicles/types";
import { ServiceEntry, UpdateServiceEntryDto } from "../types";
import { DatePicker } from "../../../components/DatePicker";

interface UpdateServiceEntryPageProps {
  vehicle: Vehicle;
  entry: ServiceEntry;
  onClose: () => void;
}

export function UpdateServiceEntryPage({
  vehicle,
  entry,
  onClose,
}: UpdateServiceEntryPageProps) {
  const [formData, setFormData] = useState({
    service_date: entry.service_date || new Date().toISOString().split("T")[0],
    mileage: entry.mileage !== null ? entry.mileage.toString() : "",
    work_description: entry.work_description || "",
    future_work: entry.future_work || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const { mutate: updateService, isPending } = useUpdateServiceEntry(
    vehicle.id,
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
    if (serverError) setServerError(null);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.service_date)
      newErrors.service_date = "Η ημερομηνία είναι υποχρεωτική.";
    if (!formData.work_description.trim())
      newErrors.work_description = "Η περιγραφή εργασιών είναι υποχρεωτική.";
    if (formData.mileage.trim()) {
      const mileageNum = Number(formData.mileage);
      if (isNaN(mileageNum) || mileageNum < 0)
        newErrors.mileage = "Εισάγετε έναν έγκυρο αριθμό χιλιομέτρων.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const dto: UpdateServiceEntryDto = {
      service_date: formData.service_date,
      mileage: formData.mileage.trim() ? Number(formData.mileage) : null,
      work_description: formData.work_description.trim(),
      future_work: formData.future_work.trim() || null,
    };

    updateService(
      { id: entry.id, dto },
      {
        onSuccess: () => onClose(),
        onError: (error: any) => {
          const msg =
            error?.ValidationError ??
            error?.DatabaseError ??
            error?.NotFound ??
            "Άγνωστο σφάλμα";
          setServerError(msg);
        },
      },
    );
  };

  return (
    <div className="w-full min-h-screen bg-slate-50/30 p-4 sm:p-6 md:p-8 xl:p-12 flex flex-col justify-center items-center overflow-y-auto">
      {/* Central Content Wrapper */}
      <div className="w-full max-w-4xl flex flex-col gap-6">
        {/* Back Button */}
        <div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-500 hover:text-blue-600 font-medium flex items-center gap-2 transition-colors text-xs sm:text-sm cursor-pointer w-fit"
          >
            <ArrowLeft size={16} />
            Ακύρωση και επιστροφή
          </button>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 md:p-8 xl:p-10 w-full">
          <div className="mb-8 flex items-center gap-3">
            <ClipboardList className="text-blue-600 shrink-0" size={26} />
            <div>
              <h2 className="text-lg xl:text-xl font-bold text-slate-800 tracking-tight">
                Επεξεργασία Καταγραφής Service &mdash; {vehicle.make}{" "}
                {vehicle.model}{" "}
                {vehicle.plate ? `(${vehicle.plate.toUpperCase()})` : ""}
              </h2>
              <p className="text-slate-500 text-xs xl:text-sm mt-0.5">
                Διορθώστε τα στοιχεία της εργασίας, τα χιλιόμετρα ή τις
                σημειώσεις για το όχημα.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 xl:space-y-8"
            noValidate
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 xl:gap-6">
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-[11px] xl:text-xs font-bold text-slate-500 uppercase tracking-wider"
                  htmlFor="service_date"
                >
                  Ημερομηνια Service <span className="text-red-500">*</span>
                </label>

                <DatePicker
                  id="service_date"
                  name="service_date"
                  value={formData.service_date}
                  onChange={(val) =>
                    setFormData((prev) => ({ ...prev, service_date: val }))
                  }
                  hasError={!!errors.service_date}
                />

                {errors.service_date && (
                  <p className="text-red-500 text-xs xl:text-sm mt-0.5">
                    {errors.service_date}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  className="text-[11px] xl:text-xs font-bold text-slate-500 uppercase tracking-wider"
                  htmlFor="mileage"
                >
                  Χιλιομετρα (km){" "}
                  <span className="text-slate-400 font-normal lowercase">
                    (προαιρετικό)
                  </span>
                </label>
                <div className="relative">
                  <Gauge className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 xl:w-5 xl:h-5" />
                  <input
                    type="number"
                    id="mileage"
                    name="mileage"
                    value={formData.mileage}
                    onChange={handleChange}
                    placeholder="π.χ. 124500"
                    className={`w-full pl-11 pr-4 py-3 border rounded-xl text-sm xl:text-base text-slate-800 bg-slate-50/50 focus:outline-none focus:ring-2 transition-all font-mono ${
                      errors.mileage
                        ? "border-red-400 focus:ring-red-200"
                        : "border-slate-300 focus:ring-blue-500 focus:border-blue-500"
                    }`}
                  />
                </div>
                {errors.mileage && (
                  <p className="text-red-500 text-xs xl:text-sm mt-0.5">
                    {errors.mileage}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                className="text-[11px] xl:text-xs font-bold text-slate-500 uppercase tracking-wider"
                htmlFor="work_description"
              >
                Περιγραφη Εργασιων & Ανταλλακτικων{" "}
                <span className="text-red-500">*</span>
              </label>
              <textarea
                id="work_description"
                name="work_description"
                value={formData.work_description}
                onChange={handleChange}
                placeholder="Περιγράψτε τις εργασίες που έγιναν..."
                rows={5}
                className={`w-full border rounded-xl px-4 py-3 text-sm xl:text-base text-slate-800 bg-slate-50/50 focus:outline-none focus:ring-2 transition-all resize-none leading-relaxed ${
                  errors.work_description
                    ? "border-red-400 focus:ring-red-200"
                    : "border-slate-300 focus:ring-blue-500 focus:border-blue-500"
                }`}
              />
              {errors.work_description && (
                <p className="text-red-500 text-xs xl:text-sm mt-0.5">
                  {errors.work_description}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                className="text-[11px] xl:text-xs font-bold text-slate-500 uppercase tracking-wider"
                htmlFor="future_work"
              >
                Μελλοντικες Εργασιες / Σημειωσεις{" "}
                <span className="text-slate-400 font-normal lowercase">
                  (προαιρετικό)
                </span>
              </label>
              <div className="relative">
                <FileText className="absolute left-3.5 top-3.5 text-slate-400 w-4 h-4 xl:w-5 xl:h-5" />
                <textarea
                  id="future_work"
                  name="future_work"
                  value={formData.future_work}
                  onChange={handleChange}
                  placeholder="Σημειώστε εκκρεμότητες για το επόμενο service..."
                  rows={4}
                  className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-xl text-sm xl:text-base text-slate-800 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none leading-relaxed"
                />
              </div>
            </div>

            <div className="h-px w-full bg-slate-200" />

            {serverError && (
              <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm xl:text-base">
                <AlertCircle size={18} className="shrink-0" />
                {serverError}
              </div>
            )}

            {/* Form Actions */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isPending}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer disabled:opacity-50 text-center tracking-wider"
              >
                Ακύρωση
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="w-full sm:w-auto px-10 py-3.5 rounded-xl text-sm font-bold bg-slate-900 text-white hover:bg-black transition-all active:scale-[0.98] cursor-pointer disabled:bg-slate-400 disabled:text-slate-100 text-center tracking-wider"
              >
                {isPending ? "Αποθήκευση..." : "Αποθήκευση Αλλαγών"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
