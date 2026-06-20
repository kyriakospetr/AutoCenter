import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useUiStore } from "./store/useUiStore";
import { Layout } from "./components/Layout";
import { VehiclesPage } from "./features/vehicles/components/VehiclesPage";
import { AddVehiclePage } from "./features/vehicles/components/AddVehiclePage";
import { VehicleDetailsPage } from "./features/vehicles/components/VehicleDetailsPage";
import { UpdateVehiclePage } from "./features/vehicles/components/UpdateVehiclePage";
import { AddServiceEntryPage } from "./features/service-entries/components/AddServiceEntryPage";
import { UpdateServiceEntryPage } from "./features/service-entries/components/UpdateServiceEntryPage";
import { ServiceEntry } from "./features/service-entries/types";
import { ArrowLeft } from "lucide-react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

function AppContent() {
  const selectedVehicle = useUiStore((state) => state.selectedVehicle);
  const setSelectedVehicle = useUiStore((state) => state.setSelectedVehicle);
  const currentView = useUiStore((state) => state.currentView);
  const setView = useUiStore((state) => state.setView);

  const [selectedService, setSelectedService] = useState<ServiceEntry | null>(
    null,
  );

  const renderContent = () => {
    if (currentView === "add") {
      return <AddVehiclePage onClose={() => setView("list")} />;
    }

    if (currentView === "edit" && selectedVehicle) {
      return (
        <UpdateVehiclePage
          vehicle={selectedVehicle}
          onClose={() => setView("list")}
        />
      );
    }

    if (currentView === "add-service" && selectedVehicle) {
      return (
        <AddServiceEntryPage
          vehicle={selectedVehicle}
          onClose={() => setView("list")}
        />
      );
    }

    if (currentView === "edit-service" && selectedVehicle && selectedService) {
      return (
        <UpdateServiceEntryPage
          vehicle={selectedVehicle}
          entry={selectedService}
          onClose={() => {
            setSelectedService(null);
            setView("list");
          }}
        />
      );
    }

    if (selectedVehicle) {
      return (
        <div className="w-full bg-slate-50/50">
          {/* Outer div handles screen padding, inner div limits width to max-w-5xl. This perfectly aligns the button with the card's left edge! */}
          <div className="w-full flex justify-center px-6 md:px-12 pt-6 md:pt-12 -mb-4 md:-mb-8 relative z-10">
            <div className="w-full max-w-5xl">
              <button
                onClick={() => setSelectedVehicle(null)}
                className="text-slate-500 hover:text-blue-600 font-semibold flex items-center gap-2 transition-colors text-sm cursor-pointer w-fit"
              >
                <ArrowLeft size={18} />
                Επιστροφή στη λίστα
              </button>
            </div>
          </div>

          <VehicleDetailsPage
            vehicle={selectedVehicle}
            onEdit={() => setView("edit")}
            onDeleteSuccess={() => setSelectedVehicle(null)}
            onAddService={() => setView("add-service")}
            onEditService={(service) => {
              setSelectedService(service);
              setView("edit-service");
            }}
          />
        </div>
      );
    }

    return <VehiclesPage />;
  };

  return <Layout>{renderContent()}</Layout>;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
