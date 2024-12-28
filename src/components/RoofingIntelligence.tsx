import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, Home, Calendar, Download, Search, AlertTriangle } from 'lucide-react';
import { calculateRoofingOpportunity } from '@/lib/calculations';
import { exportToCSV } from '@/lib/export';
import type { PropertyData } from '@/types/property';

const RoofingIntelligence = () => {
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [propertyData, setPropertyData] = useState<PropertyData | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/.netlify/functions/roofingLookup', {
        method: 'POST',
        body: JSON.stringify({ address: searchInput }),
        headers: { 'Content-Type': 'application/json' },
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setPropertyData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (propertyData) {
      exportToCSV(propertyData);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Home className="h-6 w-6" />
            Roofing Intelligence Dashboard
          </CardTitle>
          <CardDescription>
            Analyze properties for roofing opportunities in Tarrant County
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Enter property address..."
              className="flex-1"
              disabled={loading}
            />
            <Button type="submit" disabled={loading || !searchInput}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Search className="h-4 w-4 mr-2" />}
              Search
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {propertyData && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Property Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2">
                  <div>
                    <dt className="font-medium">Address</dt>
                    <dd>{propertyData.address}</dd>
                  </div>
                  <div>
                    <dt className="font-medium">Year Built</dt>
                    <dd className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {propertyData.year_built}
                      {(new Date().getFullYear() - propertyData.year_built) > 20 && (
                        <Badge variant="destructive">Aging Property</Badge>
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-medium">Square Footage</dt>
                    <dd>{propertyData.square_feet}</dd>
                  </div>
                  <div>
                    <dt className="font-medium">Property Value</dt>
                    <dd>{propertyData.total_value}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Roof Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="font-medium mb-1">Opportunity Score</div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`h-2 w-8 rounded ${
                            i < calculateRoofingOpportunity(propertyData)
                              ? 'bg-green-500'
                              : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <div className="font-medium">Latest Roof Work</div>
                    {propertyData.latest_roof_work ? (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {propertyData.latest_roof_work}
                      </div>
                    ) : (
                      <Badge>No Records Found</Badge>
                    )}
                  </div>

                  {propertyData.roof_material && (
                    <div>
                      <div className="font-medium">Roof Material</div>
                      <div>{propertyData.roof_material}</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Market Intelligence</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2">
                  <div>
                    <dt className="font-medium">Neighborhood Average Home Age</dt>
                    <dd>{propertyData.neighborhood_avg_age || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="font-medium">Recent Area Permits (1mi)</dt>
                    <dd>{propertyData.recent_area_permits || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="font-medium">Storm History</dt>
                    <dd>{propertyData.storm_history || 'No recent storms reported'}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </div>

          {propertyData.permit_history && propertyData.permit_history.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Permit History</CardTitle>
                <Button variant="outline" size="sm" onClick={handleExport}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Date</th>
                        <th className="text-left p-2">Type</th>
                        <th className="text-left p-2">Description</th>
                        <th className="text-left p-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {propertyData.permit_history.map((permit, index) => (
                        <tr key={index} className="border-b">
                          <td className="p-2">{permit.date}</td>
                          <td className="p-2">{permit.type}</td>
                          <td className="p-2">{permit.description}</td>
                          <td className="p-2">
                            <Badge
                              variant={
                                permit.status === 'COMPLETED' ? 'default' :
                                permit.status === 'PENDING' ? 'secondary' :
                                'outline'
                              }
                            >
                              {permit.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default RoofingIntelligence;