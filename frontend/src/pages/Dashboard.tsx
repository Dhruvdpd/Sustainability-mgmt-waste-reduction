import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BarChart3, TrendingUp, TrendingDown, Leaf, Activity } from 'lucide-react';
import { productAPI } from '../utils/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getAll();
      setProducts(response.data.data);
    } catch (error: any) {
      console.error('Error fetching products:', error);
      setError(error.response?.data?.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = async () => {
    try {
      setIsExporting(true);
      const response = await productAPI.export();
      
      // Create blob and download
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `sustainability-products-report-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      alert('Report exported successfully!');
    } catch (error: any) {
      console.error('Error exporting report:', error);
      alert('Failed to export report. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Calculate metrics from actual data
  const calculateMetrics = () => {
    if (!products.length) return {
      totalProducts: 0,
      totalCarbon: 0,
      avgEfficiency: 0,
      monthlySavings: 0
    };

    const totalCarbon = products.reduce((sum: number, product: any) => 
      sum + (product.carbonFootprint || 0), 0);
    
    return {
      totalProducts: products.length,
      totalCarbon: totalCarbon.toFixed(0),
      avgEfficiency: (85 + Math.random() * 10).toFixed(1), // Simulated
      monthlySavings: (totalCarbon * 0.25).toFixed(0) // Simulated savings
    };
  };

  const metrics = calculateMetrics();
  const metricsData = [
    {
      title: 'Total Products',
      value: metrics.totalProducts.toString(),
      change: '+12%',
      positive: true,
      icon: BarChart3, 
      color: 'bg-emerald-500'
    },
    {
      title: 'Carbon Saved (kg)',
      value: metrics.totalCarbon,
      change: '+18%',
      positive: true,
      icon: Leaf,
      color: 'bg-green-500'
    },
    {
      title: 'Efficiency Score',
      value: `${metrics.avgEfficiency}%`,
      change: '+5.2%',
      positive: true,
      icon: Activity,
      color: 'bg-amber-500'
    },
    {
      title: 'Monthly Savings',
      value: `$${metrics.monthlySavings}`,
      change: '+8.7%',
      positive: true,
      icon: TrendingUp,
      color: 'bg-slate-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/')}
              className="flex items-center text-emerald-600 hover:text-emerald-700 transition-colors mr-6"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Home
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Sustainability Dashboard</h1>
              <p className="text-gray-600">Monitor environmental impact and analytics</p>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 animate-pulse">
                <div className="h-16 bg-slate-200 rounded mb-4"></div>
                <div className="h-8 bg-slate-200 rounded mb-2"></div>
                <div className="h-4 bg-slate-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
            <p className="text-red-600">Error: {error}</p>
            <button 
              onClick={fetchProducts}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metricsData.map((metric, index) => {
              const IconComponent = metric.icon;
              return (
                <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`${metric.color} p-3 rounded-lg`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <div className={`flex items-center text-sm font-medium ${metric.positive ? 'text-green-600' : 'text-red-600'}`}>
                      {metric.positive ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                      {metric.change}
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</div>
                    <div className="text-gray-600 text-sm">{metric.title}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Carbon Footprint Chart */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Carbon Footprint Trends</h3>
            <div className="h-64 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="h-16 w-16 text-emerald-400 mx-auto mb-4" />
                <p className="text-gray-600">Interactive chart visualization</p>
                <p className="text-sm text-gray-500">Chart library integration needed</p>
                {products.length > 0 && (
                  <p className="text-sm text-emerald-600 mt-2">
                    Showing data from {products.length} products
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Activities</h3>
            <div className="space-y-4">
              {products.length > 0 ? (
                products.slice(0, 4).map((product: any, index: number) => (
                  <div key={index} className="flex items-center p-3 bg-slate-50 rounded-lg">
                    <div className="w-3 h-3 rounded-full mr-3 bg-green-500"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Product added</p>
                      <p className="text-sm text-gray-600">{product.name}</p>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No recent activities</p>
                  <button
                    onClick={() => navigate('/add-product')}
                    className="mt-2 text-emerald-600 hover:text-emerald-700"
                  >
                    Add your first product
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Products Table */}
        {products.length > 0 && (
          <div className="mt-8 bg-white rounded-xl p-6 shadow-lg border border-slate-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Products</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Product</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Category</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Transport</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Carbon (kg)</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {products.slice(0, 5).map((product: any, index: number) => (
                    <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4 font-medium text-gray-900">{product.name}</td>
                      <td className="py-3 px-4 text-gray-600 capitalize">{product.category}</td>
                      <td className="py-3 px-4 text-gray-600 capitalize">{product.transport?.type}</td>
                      <td className="py-3 px-4 text-gray-600">{product.carbonFootprint}</td>
                      <td className="py-3 px-4 text-gray-600">
                        {new Date(product.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap gap-4">
          <button
            onClick={() => navigate('/add-product')}
            className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all"
          >
            Add New Product
          </button>
          <button
            onClick={() => navigate('/simulator')}
            className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all"
          >
            Run Simulation
          </button>
          <button 
            onClick={fetchProducts}
            className="px-6 py-3 border border-slate-300 text-gray-700 rounded-lg hover:bg-slate-50 transition-all"
          >
            Refresh Data
          </button>
          <button 
            onClick={handleExportReport}
            disabled={isExporting || products.length === 0}
            className="px-6 py-3 border border-slate-300 text-gray-700 rounded-lg hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExporting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2 inline-block"></div>
                Exporting...
              </>
            ) : (
              'Export Report'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;