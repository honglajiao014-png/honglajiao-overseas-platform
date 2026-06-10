import Link from "next/link";

interface CarCardProps {
  slug: string;
  brand: string;
  model: string;
  year: number;
  mileage: number | null;
  location: string | null;
  transmission: string | null;
  fuel: string | null;
  salePrice: number;
  images: string[];
  /** "horizontal" 用于列表，"vertical" 用于推荐卡片 */
  variant?: "horizontal" | "vertical";
  soldAt?: Date | string | null;
}

export function CarCard({ slug, brand, model, year, mileage, location, transmission, fuel, salePrice, images, variant = "horizontal", soldAt }: CarCardProps) {
  if (variant === "vertical") {
    return (
      <Link
        href={`/cars/${slug}`}
        className="block bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group"
      >
        <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center overflow-hidden">
          {images?.[0] ? (
            <img src={images[0]} alt={`${brand} ${model}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          ) : (
            <div className="text-5xl">🚘</div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
            {brand} {model} {year}
          </h3>
          <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1.5 text-[11px] text-gray-500">
            <span>{year}</span>
            {mileage ? <span>{mileage.toLocaleString()}km</span> : null}
            <span>{location || "China"}</span>
            {transmission ? <span>{transmission}</span> : null}
            {fuel ? <span>{fuel}</span> : null}
          </div>
          <div className="mt-3 text-lg font-extrabold text-red-500">
            {soldAt ? (
              <span className="inline-block bg-gray-200 text-gray-500 px-3 py-0.5 rounded-full text-sm font-bold">Sold</span>
            ) : (
              <>${salePrice.toLocaleString()}</>
            )}
          </div>
        </div>
      </Link>
    );
  }

  // horizontal — 列表用
  return (
    <Link
      href={`/cars/${slug}`}
      className="flex bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-200 group"
    >
      <div className="w-48 h-36 bg-gray-100 shrink-0 flex items-center justify-center overflow-hidden">
        {images?.[0] ? (
          <img src={images[0]} alt={model} className="w-full h-full object-cover" />
        ) : (
          <div className="text-5xl">🚘</div>
        )}
      </div>
      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          <h3 className="text-base font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
            {brand} {model}{year ? ` ${year}` : ""}
          </h3>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-500">
            <span>{year}</span>
            <span>{mileage ? `${mileage.toLocaleString()}km` : "-"}</span>
            <span>{location || "China"}</span>
            <span>{transmission || "-"}</span>
            <span>{fuel || "-"}</span>
          </div>
        </div>
        <div className="flex items-end justify-between mt-3">
          <span className="text-xl font-extrabold text-red-500">
            {soldAt ? (
              <span className="inline-block bg-gray-200 text-gray-500 px-3 py-0.5 rounded-full text-sm font-bold">Sold</span>
            ) : (
              <>${salePrice.toLocaleString()} <span className="text-xs font-normal text-gray-400">USD</span></>
            )}
          </span>
          <span className="text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            View Details →
          </span>
        </div>
      </div>
    </Link>
  );
}
