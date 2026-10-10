export type CatalogItem = { id: string; title: string; brand: string; category: string; year_model: string; odometer_km: number | null; cash_price: number | null; swapping_value: number | null; is_cash_only: boolean; image_url: string; image_urls: string[]; condition_notes: string; is_available: boolean; is_published: boolean };
export type CatalogInput = Omit<CatalogItem, "id">;
export const blankItem: CatalogInput = { title: "", brand: "", category: "Street", year_model: "", odometer_km: null, cash_price: null, swapping_value: null, is_cash_only: false, image_url: "", image_urls: [], condition_notes: "", is_available: true, is_published: false };
export const categories = ["Adventure", "Cruiser", "Maxi Scoot", "Naked", "Scooter", "Scrambler", "Sport", "Street", "Other"];
export const peso = (value: number | null) => value == null ? "Ask for price" : `₱${value.toLocaleString("en-PH", { maximumFractionDigits: 0 })}`;
