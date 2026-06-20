import { Vehicle } from "../types";
import {
  User,
  Phone,
  ChevronRight,
  CarFront,
} from "lucide-react";

interface Props {
  vehicle: Vehicle;
  onClick: (vehicle: Vehicle) => void;
}

export function VehicleCard({ vehicle, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={() => onClick(vehicle)}
      className="
        group
        w-full
        text-left
        bg-white
        border
        cursor-pointer
        border-slate-200
        rounded-3xl
        p-5
        shadow-sm
        hover:shadow-xl
        hover:shadow-slate-200/50
        hover:-translate-y-1
        transition-all
        duration-300
      "
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="
              w-12
              h-12
              rounded-2xl
              bg-blue-50
              flex
              items-center
              justify-center
              text-blue-600
              shrink-0
            "
          >
            <CarFront size={22} />
          </div>

          <div className="min-w-0">
            <h3
              className="
                text-base
                font-bold
                text-slate-900
                truncate
              "
            >
              {vehicle.make} {vehicle.model}
            </h3>

            <p className="text-xs text-slate-500 mt-0.5">
              {vehicle.year || "Άγνωστο έτος"}
            </p>
          </div>
        </div>

        {vehicle.plate && (
          <div
            className="
              px-3
              py-1.5
              rounded-xl
              bg-slate-100
              border
              border-slate-200
              text-xs
              font-bold
              tracking-wider
              text-slate-700
              uppercase
              font-mono
              shrink-0
            "
          >
            {vehicle.plate}
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="h-px bg-slate-100 my-5" />

      {/* Owner */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div
            className="
              w-9
              h-9
              rounded-xl
              bg-slate-100
              flex
              items-center
              justify-center
              text-slate-500
            "
          >
            <User size={16} />
          </div>

          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
              Πελατης
            </p>

            <p className="text-sm font-semibold text-slate-800 truncate">
              {vehicle.owner}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div
            className="
              w-9
              h-9
              rounded-xl
              bg-slate-100
              flex
              items-center
              justify-center
              text-slate-500
            "
          >
            <Phone size={16} />
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
              Τηλεφωνο
            </p>

            <p className="text-sm text-slate-700 font-mono">
              {vehicle.phone || "-"}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500">
          Προβολή καρτέλας
        </span>

        <ChevronRight
          size={18}
          className="
            text-slate-400
            group-hover:text-blue-600
            group-hover:translate-x-1
            transition-all
          "
        />
      </div>
    </button>
  );
}