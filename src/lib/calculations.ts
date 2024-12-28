import type { PropertyData } from '@/types/property';

export const calculateRoofingOpportunity = (data: PropertyData): number => {
  let score = 0;
  const currentYear = new Date().getFullYear();
  const propertyAge = currentYear - data.year_built;
  
  // Age-based scoring
  if (propertyAge > 20) score += 3;
  else if (propertyAge > 15) score += 2;
  else if (propertyAge > 10) score += 1;
  
  // No recent roof work
  if (!data.latest_roof_work) score += 2;
  
  // High property value
  if (parseInt(data.total_value?.replace(/[^0-9]/g, '')) > 300000) score += 1;
  
  return Math.min(score, 5); // Max score of 5
};