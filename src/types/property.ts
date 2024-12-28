export interface Permit {
  date: string;
  type: string;
  description: string;
  status: string;
}

export interface PropertyData {
  address: string;
  year_built: number;
  square_feet: string;
  total_value: string;
  owner_name?: string;
  roof_material?: string;
  latest_roof_work?: string;
  roof_permits?: Permit[];
  permit_history?: Permit[];
  neighborhood_avg_age?: string;
  recent_area_permits?: string;
  storm_history?: string;
  legal_description?: string;
  zoning?: string;
  flood_zone?: string;
}