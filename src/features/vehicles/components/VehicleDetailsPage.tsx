import { Vehicle } from "../types";
import { useDeleteVehicle } from "../hooks";
import {
  useDeleteServiceEntry,
  useVehicleHistory,
} from "../../service-entries/hooks";
import { ConfirmModal } from "../../../components/ConfirmModal";
import { useState } from "react";
import {
  History,
  Trash2,
  Pencil,
  FileText,
  Plus,
  FileDown,
} from "lucide-react";
import { generateServiceHistoryPDF } from "../../service-entries/utils/generate.pdf";

interface Props {
  vehicle: Vehicle;
  onEdit?: () => void;
  onDeleteSuccess?: () => void;
  onAddService?: () => void;
  onEditService?: (entry: any) => void;
}

export function VehicleDetailsPage({
  vehicle,
  onEdit,
  onDeleteSuccess,
  onAddService,
  onEditService,
}: Props) {
  const { data: serviceHistory = [], isLoading } = useVehicleHistory(
    vehicle.id,
  );
  const { mutate: deleteVehicle } = useDeleteVehicle();
  const { mutate: deleteService } = useDeleteServiceEntry(vehicle.id);

  const [vehicleDeleteModal, setVehicleDeleteModal] = useState(false);
  const [serviceDeleteModal, setServiceDeleteModal] = useState<{
    isOpen: boolean;
    serviceId: number | null;
  }>({ isOpen: false, serviceId: null });

  const handleConfirmDeleteVehicle = () => {
    deleteVehicle(vehicle.id, {
      onSuccess: () => onDeleteSuccess?.(),
      onError: (err) => console.error("Delete vehicle failed:", err),
    });
    setVehicleDeleteModal(false);
  };

  const handleConfirmDeleteService = () => {
    if (serviceDeleteModal.serviceId !== null) {
      deleteService(serviceDeleteModal.serviceId);
    }
    setServiceDeleteModal({ isOpen: false, serviceId: null });
  };

  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleExportPdf = () => {
    if (serviceHistory.length === 0) return;
    setIsGeneratingPdf(true);
    try {
      generateServiceHistoryPDF(vehicle, serviceHistory);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50/50 p-6 md:p-12 flex flex-col items-center overflow-y-auto">
      {/* Central Content Wrapper */}
      <div className="w-full max-w-5xl flex flex-col gap-8">
        {/* --- Top Section --- */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden p-8 xl:p-12">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">
            {/* Vehicle Hero */}
            <div className="flex flex-col sm:flex-row gap-6 items-start flex-1 min-w-0">
              <div className="w-16 h-16 rounded-3xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                <FileText size={28} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-bold tracking-wider uppercase mb-4">
                  {vehicle.plate || "Χωρίς πινακίδα"}
                </div>

                <h1 className="text-3xl xl:text-4xl font-bold text-slate-900 tracking-tight wrap-break-word">
                  {vehicle.make} {vehicle.model}
                </h1>
                <p className="mt-2 text-base text-slate-500">Όχημα πελάτη</p>

                <div className="flex flex-wrap gap-8 mt-6">
                  <div className="flex flex-col gap-1.5">
                    <p className="text-xs uppercase tracking-wider text-slate-500 font-bold">
                      Πελατης
                    </p>
                    <p className="font-semibold text-slate-800 text-base">
                      {vehicle.owner}
                    </p>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <p className="text-xs uppercase tracking-wider text-slate-500 font-bold">
                      Τηλεφωνο
                    </p>
                    <p className="font-mono text-slate-700 text-base">
                      {vehicle.phone || "-"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap lg:flex-col xl:flex-row gap-3 w-full lg:w-auto shrink-0 mt-6 lg:mt-0">
              <button
                onClick={() => setVehicleDeleteModal(true)}
                className="
          h-11
          px-5
          flex
          items-center
          justify-center
          gap-2.5
          rounded-2xl
          bg-red-50
          text-red-600
          font-medium
          hover:bg-red-100
          transition-all
          cursor-pointer
        "
              >
                <Trash2 size={18} />
                <span>Διαγραφή</span>
              </button>

              <button
                onClick={onEdit}
                className="
          h-11
          px-5
          flex
          items-center
          justify-center
          gap-2.5
          rounded-2xl
          bg-slate-100
          text-slate-700
          font-medium
          hover:bg-slate-200
          transition-all
          cursor-pointer
        "
              >
                <Pencil size={18} />
                <span>Επεξεργασία</span>
              </button>
              <button
                onClick={onAddService}
                className="
          h-11
          px-5
          flex
          items-center
          justify-center
          gap-2.5
          rounded-2xl
          bg-slate-900
          text-white
          font-medium
          hover:bg-black
          transition-all
          cursor-pointer
        "
              >
                <Plus size={20} />
                <span>Νέα Εργασία</span>
              </button>
            </div>
          </div>

          {/* Specs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-6 mt-10 pt-8 border-t border-slate-100">
            <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-5 flex flex-col items-center text-center justify-center">
              <p className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-2">
                Πινακιδα
              </p>
              <p className="font-mono font-bold text-slate-900 text-base xl:text-lg">
                {vehicle.plate || "-"}
              </p>
            </div>

            <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-5 flex flex-col items-center text-center justify-center">
              <p className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-2">
                Έτος
              </p>
              <p className="font-bold text-slate-900 text-base xl:text-lg">
                {vehicle.year || "-"}
              </p>
            </div>

            <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-5 flex flex-col items-center text-center justify-center">
              <p className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-2">
                Κινητηρας
              </p>
              <p className="font-mono text-slate-800 text-base xl:text-lg break-all">
                {vehicle.engine_number || "-"}
              </p>
            </div>

            <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-5 flex flex-col items-center text-center justify-center">
              <p className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-2">
                Αριθμος Πλαισιου
              </p>
              <p className="font-mono text-slate-800 text-base break-all">
                {vehicle.vin || "-"}
              </p>
            </div>
          </div>
        </div>

        {/* --- Service History --- */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col flex-1">
          <div className="px-8 xl:px-12 py-8 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-blue-50 rounded-xl">
                <History className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl xl:text-2xl font-bold text-slate-900 tracking-tight">
                  Ιστορικό Εργασιών
                </h2>
                <p className="text-sm xl:text-base text-slate-500 mt-1">
                  Όλες οι εργασίες που έχουν πραγματοποιηθεί στο όχημα.
                </p>
              </div>
            </div>
            <button
              onClick={handleExportPdf}
              disabled={isGeneratingPdf || serviceHistory.length === 0}
              className="
    h-11
    px-5
    flex
    items-center
    justify-center
    gap-2.5
    rounded-2xl
    bg-white
    border
    border-slate-200
    text-slate-700
    font-medium
    hover:bg-slate-50
    transition-all
    cursor-pointer
    disabled:opacity-50
    disabled:cursor-not-allowed
  "
            >
              <FileDown size={18} />
              <span>
                {isGeneratingPdf ? "Δημιουργία..." : "Αποθήκευση PDF"}
              </span>
            </button>
            <div className="px-4 py-1.5 rounded-full bg-slate-100 text-slate-700 text-sm font-bold tracking-wide">
              {serviceHistory.length} ΕΡΓΑΣΙΕΣ
            </div>
          </div>

          <div className="p-8 xl:p-12 flex-1">
            {isLoading ? (
              <div className="space-y-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-40 rounded-3xl bg-slate-50/80 border border-slate-100 animate-pulse"
                  />
                ))}
              </div>
            ) : serviceHistory.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-24 h-24 rounded-full bg-slate-50 flex items-center justify-center mb-6">
                  <History size={40} className="text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  Δεν υπάρχουν εργασίες
                </h3>
                <p className="text-base text-slate-500 max-w-md mb-8">
                  Δεν έχει καταχωρηθεί ακόμη ιστορικό service για το
                  συγκεκριμένο όχημα.
                </p>
                <button
                  onClick={onAddService}
                  className="px-8 py-3.5 rounded-xl text-sm font-bold uppercase tracking-wider bg-slate-900 text-white hover:bg-black transition-all cursor-pointer shadow-md"
                >
                  Νεα Εργασια
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {serviceHistory.map((service) => (
                  <div
                    key={service.id}
                    className="bg-slate-50/50 border border-slate-200/80 rounded-3xl p-6 xl:p-8 hover:border-slate-300 transition-all hover:bg-slate-50 group"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 border-b border-slate-200/60 pb-5 mb-5">
                      <div className="flex flex-wrap items-center gap-4">
                        <span className="px-4 py-1.5 rounded-xl bg-blue-100/50 text-blue-700 text-sm font-bold tracking-wide">
                          {service.service_date}
                        </span>

                        {service.mileage !== null && (
                          <span className="px-4 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-sm font-mono font-medium">
                            {service.mileage.toLocaleString()} km
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => onEditService?.(service)}
                          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all cursor-pointer shadow-sm"
                          title="Επεξεργασία"
                        >
                          <Pencil size={18} />
                        </button>

                        <button
                          onClick={() =>
                            setServiceDeleteModal({
                              isOpen: true,
                              serviceId: service.id,
                            })
                          }
                          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-all cursor-pointer shadow-sm"
                          title="Διαγραφή"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-3">
                        Περιγραφη Εργασιων
                      </h4>
                      <p className="text-slate-800 text-base whitespace-pre-line leading-relaxed wrap-break-word">
                        {service.work_description}
                      </p>
                    </div>

                    {service.future_work && (
                      <div className="mt-6 rounded-2xl border border-amber-200/60 bg-amber-50/50 p-5">
                        <div className="flex items-start gap-3.5">
                          <FileText
                            size={20}
                            className="text-amber-500 mt-0.5 shrink-0"
                          />
                          <div>
                            <h5 className="text-xs uppercase tracking-wider font-bold text-amber-700 mb-2">
                              Μελλοντικές Εργασίες
                            </h5>
                            <p className="text-slate-700 text-base leading-relaxed wrap-break-word">
                              {service.future_work}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <ConfirmModal
        isOpen={vehicleDeleteModal}
        title="Διαγραφή Οχήματος"
        message={`Θέλετε να διαγράψετε οριστικά το ${vehicle.make} ${vehicle.model} (${vehicle.plate});`}
        onConfirm={handleConfirmDeleteVehicle}
        onCancel={() => setVehicleDeleteModal(false)}
      />
      <ConfirmModal
        isOpen={serviceDeleteModal.isOpen}
        title="Διαγραφή Εργασίας"
        message="Θέλετε να διαγράψετε αυτή την εργασία;"
        onConfirm={handleConfirmDeleteService}
        onCancel={() =>
          setServiceDeleteModal({ isOpen: false, serviceId: null })
        }
      />
    </div>
  );
}
