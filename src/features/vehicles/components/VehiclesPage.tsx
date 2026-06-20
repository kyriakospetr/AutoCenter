import { useState, useMemo, useEffect } from "react";
import { useVehicles } from "../hooks";
import { useUiStore } from "../../../store/useUiStore";
import { VehicleCard } from "./VehicleCard";
import {
  Search,
  Plus,
  AlertTriangle,
  CarFront,
  Users,
  Activity,
} from "lucide-react";

function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

export function VehiclesPage() {
  const [search, setSearch] = useState("");

  const debouncedSearch = useDebouncedValue(search, 300);

  const { data: vehicles, isLoading, isError } = useVehicles(debouncedSearch);

  const setSelectedVehicle = useUiStore(
    (state) => state.setSelectedVehicle
  );

  const setView = useUiStore(
    (state) => state.setView
  );

  const vehicleCount = useMemo(
    () => vehicles?.length ?? 0,
    [vehicles]
  );

  return (
    <div className="w-full min-h-screen p-6 md:p-8 xl:p-10 flex flex-col gap-8">
      {/* Header */}
      <div className="max-w-7xl w-full mx-auto flex flex-col lg:flex-row justify-between gap-6 items-start lg:items-center">
        <div>
          <h1 className="text-3xl xl:text-4xl font-bold tracking-tight text-slate-900">
            Οχήματα
          </h1>

          <p className="mt-2 text-slate-500">
            Διαχείριση πελατών και καρτελών οχημάτων.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <div className="relative flex-1 sm:w-96">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
            />

            <input
              type="text"
              placeholder="Αναζήτηση πινακίδας, πελάτη..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
                w-full
                h-12
                pl-12
                pr-4
                rounded-2xl
                bg-white
                border
                border-slate-200
                shadow-sm
                text-sm
                focus:outline-none
                focus:ring-4
                focus:ring-blue-100
                focus:border-blue-500
                transition-all
              "
            />
          </div>

          <button
            type="button"
            onClick={() => setView("add")}
            className="
              h-12
              px-6
              rounded-2xl
              bg-slate-900
              hover:bg-black
              text-white
              font-semibold
              flex
              items-center
              justify-center
              gap-2
              shadow-sm
              hover:shadow-lg
              transition-all
              cursor-pointer
            "
          >
            <Plus size={18} />
            Νέο Όχημα
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Οχηματα
            </span>

            <CarFront
              size={18}
              className="text-blue-500"
            />
          </div>

          <p className="mt-3 text-3xl font-bold text-slate-900">
            {vehicleCount}
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Πελατες
            </span>

            <Users
              size={18}
              className="text-emerald-500"
            />
          </div>

          <p className="mt-3 text-3xl font-bold text-slate-900">
            {vehicleCount}
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Κατασταση
            </span>

            <Activity
              size={18}
              className="text-green-500"
            />
          </div>

          <p className="mt-3 text-lg font-semibold text-green-600">
            Online
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl w-full mx-auto flex-1">
        {isLoading ? (
          <div
            role="status"
            aria-live="polite"
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              xl:grid-cols-3
              2xl:grid-cols-4
              gap-6
            "
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="
                  h-56
                  rounded-3xl
                  bg-white
                  border
                  border-slate-200
                  animate-pulse
                "
              />
            ))}
          </div>
        ) : isError ? (
          <div className="
            bg-white
            rounded-3xl
            border
            border-red-200
            p-12
            text-center
            shadow-sm
          ">
            <AlertTriangle
              size={30}
              className="mx-auto text-red-500"
            />

            <p className="mt-4 font-medium text-red-500">
              Κάτι πήγε στραβά κατά τη φόρτωση των οχημάτων.
            </p>
          </div>
        ) : (
          <>
            <div
              role="list"
              aria-label={`${vehicleCount} οχήματα`}
              className="
                grid
                grid-cols-1
                md:grid-cols-2
                xl:grid-cols-3
                2xl:grid-cols-4
                gap-6
              "
            >
              {vehicles?.map((vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  onClick={(v) => setSelectedVehicle(v)}
                />
              ))}
            </div>

            {vehicleCount === 0 && (
              <div className="
                mt-6
                bg-white
                rounded-3xl
                border
                border-slate-200
                p-16
                text-center
                shadow-sm
              ">
                <CarFront
                  size={40}
                  className="mx-auto text-slate-300"
                />

                <h3 className="mt-4 text-lg font-semibold text-slate-700">
                  Δεν υπάρχουν οχήματα
                </h3>

                <p className="mt-2 text-slate-500">
                  Ξεκινήστε προσθέτοντας το πρώτο όχημα.
                </p>

                <button
                  onClick={() => setView("add")}
                  className="
                    mt-6
                    h-11
                    px-5
                    rounded-2xl
                    bg-slate-900
                    text-white
                    font-medium
                    hover:bg-black
                    transition-all
                    cursor-pointer
                  "
                >
                  Νέο Όχημα
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}