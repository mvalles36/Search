import type { PropertyData } from '@/types/property';

export const exportToCSV = (propertyData: PropertyData): void => {
  const csvData = [
    ['Property Data Report'],
    ['Generated on:', new Date().toLocaleString()],
    [''],
    ['Address:', propertyData.address],
    ['Year Built:', propertyData.year_built.toString()],
    ['Square Footage:', propertyData.square_feet],
    ['Property Value:', propertyData.total_value],
    ['Latest Roof Work:', propertyData.latest_roof_work || 'No records found'],
    [''],
    ['Permit History'],
    ['Date,Type,Description,Status']
  ];
  
  if (propertyData.permit_history) {
    propertyData.permit_history.forEach(permit => {
      csvData.push(`${permit.date},${permit.type},${permit.description},${permit.status}`);
    });
  }
  
  const csvContent = csvData.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `property-report-${propertyData.address.replace(/\s+/g, '-')}.csv`;
  a.click();
};