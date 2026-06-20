import React, { useState } from "react";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { useCreateVehicle } from "../hooks";
import { CreateVehicleDto } from "../types";

interface AddVehiclePageProps {
  onClose?: () => void;
}

export function AddVehiclePage({ onClose }: AddVehiclePageProps) {
  const [formData, setFormData] = useState({
    owner: "",
    phone: "",
    make: "",
    model: "",
    plate: "",
    year: "",
    engine_number: "",
    vin: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const { mutate: createVehicle, isPending } = useCreateVehicle();

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
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.owner.trim())
      newErrors.owner = "Το όνομα ιδιοκτήτη είναι υποχρεωτικό.";
    if (!formData.make.trim()) newErrors.make = "Η μάρκα είναι υποχρεωτική.";
    if (!formData.model.trim())
      newErrors.model = "Το μοντέλο είναι υποχρεωτικό.";
    if (formData.phone.trim()) {
      const phoneDigits = formData.phone.replace(/\s+/g, "");
      if (!/^\d+$/.test(phoneDigits)) {
        newErrors.phone = "Το τηλέφωνο πρέπει να περιέχει μόνο αριθμούς.";
      } else if (phoneDigits.length !== 10) {
        newErrors.phone = "Το τηλέφωνο πρέπει να είναι ακριβώς 10 ψηφία.";
      }
    }

    if (formData.year.trim()) {
      const yearNum = Number(formData.year);
      const currentYear = new Date().getFullYear();
      if (isNaN(yearNum) || yearNum < 1900 || yearNum > currentYear) {
        newErrors.year = `Εισάγετε ένα έγκυρο έτος (1900 - ${currentYear}).`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const dto: CreateVehicleDto = {
      owner: formData.owner.trim(),
      make: formData.make.trim(),
      model: formData.model.trim(),
      phone: formData.phone.trim() || null,
      plate: formData.plate.trim() ? formData.plate.trim().toUpperCase() : null,
      engine_number: formData.engine_number.trim()
        ? formData.engine_number.trim().toUpperCase()
        : null,
      vin: formData.vin.trim() ? formData.vin.trim().toUpperCase() : null,
      year: formData.year.trim() ? Number(formData.year) : null,
    };

    createVehicle(dto, {
      onSuccess: () => onClose?.(),
      onError: (error: any) => {
        const msg =
          error?.ValidationError ??
          error?.DatabaseError ??
          error?.NotFound ??
          "Άγνωστο σφάλμα";
        setServerError(msg);
      },
    });
  };

  return (
    <div className="w-full min-h-screen bg-slate-50/50 p-6 md:p-12 flex flex-col justify-center μβ items-center overflow-y-auto">
      {/* Central Content Wrapper */}
      <div className="w-full max-w-5xl flex flex-col gap-6">
        {/* Top Actions & Header */}
        <div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-500 hover:text-blue-600 font-semibold flex items-center gap-2 transition-colors text-sm cursor-pointer mb-6 w-fit"
          >
            <ArrowLeft size={18} />
            Επιστροφή στη λίστα
          </button>

          <div>
            <h1 className="text-3xl xl:text-4xl font-bold tracking-tight text-slate-900">
              Νέο Όχημα
            </h1>
            <p className="mt-2 text-base text-slate-500">
              Καταχώρηση νέου πελάτη και οχήματος.
            </p>
          </div>
        </div>

        {/* Main Form Container */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-8 xl:p-12 w-full">
          <form onSubmit={handleSubmit} className="space-y-8" noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 xl:gap-8">
              {/* --- Section: Owner Info --- */}
              <div className="col-span-1 md:col-span-2 lg:col-span-12">
                <span className="text-sm font-bold text-blue-600 uppercase tracking-wider block border-b border-slate-100 pb-2">
                  Στοιχεια Πελατη
                </span>
              </div>

              {/* Owner */}
              <div className="col-span-1 md:col-span-2 lg:col-span-6 flex flex-col gap-2">
                <label
                  className="text-xs font-bold text-slate-500 uppercase tracking-wide"
                  htmlFor="owner"
                >
                  Όνομα Ιδιοκτητη <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="owner"
                  name="owner"
                  value={formData.owner}
                  onChange={handleChange}
                  placeholder="π.χ. Γιώργος Παπαδόπουλος"
                  className={`w-full border rounded-xl px-4 py-3 text-base text-slate-800 bg-slate-50/50 placeholder-slate-400 focus:outline-none focus:ring-4 focus:bg-white transition-all ${
                    errors.owner
                      ? "border-red-400 focus:ring-red-100/60"
                      : "border-slate-200 focus:ring-blue-500/10 focus:border-blue-500"
                  }`}
                />
                {errors.owner && (
                  <p className="text-red-500 text-sm mt-1 font-medium">
                    {errors.owner}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className="col-span-1 md:col-span-2 lg:col-span-6 flex flex-col gap-2">
                <label
                  className="text-xs font-bold text-slate-500 uppercase tracking-wide"
                  htmlFor="phone"
                >
                  Τηλεφωνο{" "}
                  <span className="text-slate-400 font-normal lowercase">
                    (προαιρετικό)
                  </span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="π.χ. 6900000000"
                  className={`w-full border rounded-xl px-4 py-3 text-base text-slate-800 bg-slate-50/50 placeholder-slate-400 focus:outline-none focus:ring-4 focus:bg-white transition-all font-mono ${
                    errors.phone
                      ? "border-red-400 focus:ring-red-100/60"
                      : "border-slate-200 focus:ring-blue-500/10 focus:border-blue-500"
                  }`}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1 font-medium">
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* --- Section: Vehicle Info --- */}
              <div className="col-span-1 md:col-span-2 lg:col-span-12 pt-4">
                <span className="text-sm font-bold text-blue-600 uppercase tracking-wider block border-b border-slate-100 pb-2">
                  Στοιχεια Οχηματος
                </span>
              </div>

              {/* Make */}
              <div className="col-span-1 md:col-span-1 lg:col-span-4 flex flex-col gap-2">
                <label
                  className="text-xs font-bold text-slate-500 uppercase tracking-wide"
                  htmlFor="make"
                >
                  Μαρκα <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="make"
                  name="make"
                  value={formData.make}
                  onChange={handleChange}
                  placeholder="π.χ. Toyota"
                  className={`w-full border rounded-xl px-4 py-3 text-base text-slate-800 bg-slate-50/50 placeholder-slate-400 focus:outline-none focus:ring-4 focus:bg-white transition-all ${
                    errors.make
                      ? "border-red-400 focus:ring-red-100/60"
                      : "border-slate-200 focus:ring-blue-500/10 focus:border-blue-500"
                  }`}
                />
                {errors.make && (
                  <p className="text-red-500 text-sm mt-1 font-medium">
                    {errors.make}
                  </p>
                )}
              </div>

              {/* Model */}
              <div className="col-span-1 md:col-span-1 lg:col-span-4 flex flex-col gap-2">
                <label
                  className="text-xs font-bold text-slate-500 uppercase tracking-wide"
                  htmlFor="model"
                >
                  Μοντελο <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="model"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  placeholder="π.χ. Yaris"
                  className={`w-full border rounded-xl px-4 py-3 text-base text-slate-800 bg-slate-50/50 placeholder-slate-400 focus:outline-none focus:ring-4 focus:bg-white transition-all ${
                    errors.model
                      ? "border-red-400 focus:ring-red-100/60"
                      : "border-slate-200 focus:ring-blue-500/10 focus:border-blue-500"
                  }`}
                />
                {errors.model && (
                  <p className="text-red-500 text-sm mt-1 font-medium">
                    {errors.model}
                  </p>
                )}
              </div>

              {/* License Plate */}
              <div className="col-span-1 md:col-span-1 lg:col-span-4 flex flex-col gap-2">
                <label
                  className="text-xs font-bold text-slate-500 uppercase tracking-wide"
                  htmlFor="plate"
                >
                  Πινακιδα{" "}
                  <span className="text-slate-400 font-normal lowercase">
                    (προαιρετικό)
                  </span>
                </label>
                <input
                  type="text"
                  id="plate"
                  name="plate"
                  value={formData.plate}
                  onChange={handleChange}
                  placeholder="π.χ. IZA1234"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-base text-slate-800 bg-slate-50/50 placeholder-slate-400 focus:outline-none focus:ring-4 focus:bg-white focus:ring-blue-500/10 focus:border-blue-500 transition-all uppercase font-mono tracking-wide"
                />
              </div>

              {/* Year */}
              <div className="col-span-1 md:col-span-1 lg:col-span-4 flex flex-col gap-2">
                <label
                  className="text-xs font-bold text-slate-500 uppercase tracking-wide"
                  htmlFor="year"
                >
                  Χρονολογια{" "}
                  <span className="text-slate-400 font-normal lowercase">
                    (προαιρετικό)
                  </span>
                </label>
                <input
                  type="text"
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  placeholder="π.χ. 2018"
                  className={`w-full border rounded-xl px-4 py-3 text-base text-slate-800 bg-slate-50/50 placeholder-slate-400 focus:outline-none focus:ring-4 focus:bg-white transition-all font-mono ${
                    errors.year
                      ? "border-red-400 focus:ring-red-100/60"
                      : "border-slate-200 focus:ring-blue-500/10 focus:border-blue-500"
                  }`}
                />
                {errors.year && (
                  <p className="text-red-500 text-sm mt-1 font-medium">
                    {errors.year}
                  </p>
                )}
              </div>

              {/* Engine Number */}
              <div className="col-span-1 md:col-span-1 lg:col-span-4 flex flex-col gap-2">
                <label
                  className="text-xs font-bold text-slate-500 uppercase tracking-wide"
                  htmlFor="engine_number"
                >
                  Αριθμος Κινητηρα{" "}
                  <span className="text-slate-400 font-normal lowercase">
                    (προαιρετικό)
                  </span>
                </label>
                <input
                  type="text"
                  id="engine_number"
                  name="engine_number"
                  value={formData.engine_number}
                  onChange={handleChange}
                  placeholder="π.χ. 1KR-FE"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-base text-slate-800 bg-slate-50/50 placeholder-slate-400 focus:outline-none focus:ring-4 focus:bg-white focus:ring-blue-500/10 focus:border-blue-500 transition-all uppercase font-mono"
                />
              </div>

              {/* VIN */}
              <div className="col-span-1 md:col-span-1 lg:col-span-4 flex flex-col gap-2">
                <label
                  className="text-xs font-bold text-slate-500 uppercase tracking-wide"
                  htmlFor="vin"
                >
                  Αριθμος Πλαισιου{" "}
                  <span className="text-slate-400 font-normal lowercase">
                    (προαιρετικό)
                  </span>
                </label>
                <input
                  type="text"
                  id="vin"
                  name="vin"
                  value={formData.vin}
                  onChange={handleChange}
                  placeholder="π.χ. VNK..."
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-base text-slate-800 bg-slate-50/50 placeholder-slate-400 focus:outline-none focus:ring-4 focus:bg-white focus:ring-blue-500/10 focus:border-blue-500 transition-all uppercase font-mono break-all"
                />
              </div>
            </div>

            {/* Divider */}
            <div className="h-px w-full bg-slate-200/80 my-8" />

            {/* Server Error Alert */}
            {serverError && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-base font-medium mb-6">
                <AlertCircle size={20} className="shrink-0 text-red-500" />
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
                {isPending ? "Αποθήκευση..." : "Αποθήκευση"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
