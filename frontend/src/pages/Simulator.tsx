import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Zap, Play, RotateCcw, TrendingUp, Leaf } from 'lucide-react';

const Simulator = () => {
  const navigate = useNavigate();
  const [simulation, setSimulation] = useState({
    transportMode: 'truck',
    packagingType: 'standard',
    storageType: 'ambient',
    distance: 500,
    quantity: 1000
  });
  const [results, setResults] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const runSimulation = () => {
    setIsRunning(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const carbonFootprint = Math.random() * 1000 + 500;
      const cost = Math.random() * 5000 + 2000;
      const efficiency = Math.random() * 40 + 60;
      
      setResults({
        carbonFootprint: carbonFootprint.toFixed(2),
        cost: cost.toFixed(2),
        efficiency: efficiency.toFixed(1),
        recommendations: [
          'Switch to rail transport for 25% carbon reduction',
          'Use minimal packaging to reduce waste by 15%',
          'Optimize route planning for 10% efficiency gain'
        ]
      });
      setIsRunning(false);
    }, 2000);
  };

  const resetSimulation = () => {
    setResults(null);
    setSimulation({
      transportMode: 'truck',
      packagingType: 'standard',
      storageType: 'ambient',
      distance: 500,
      quantity: 1000
    });
  };

  const handleInputChange = (field: string, value: string | number) => {
    setSimulation(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-blue-600 hover:text-blue-700 transition-colors mr-6"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Scenario Simulator</h1>
            <p className="text-gray-600">Test different sustainability scenarios and their impact</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Simulation Inputs */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="bg-purple-100 p-3 rounded-xl mr-4">
                <Zap className="h-6 w-6 text-purple-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Simulation Parameters</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Transport Mode</label>
                <select
                  value={simulation.transportMode}
                  onChange={(e) => handleInputChange('transportMode', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                >
                  <option value="truck">Truck</option>
                  <option value="rail">Rail</option>
                  <option value="ship">Ship</option>
                  <option value="plane">Plane</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Packaging Type</label>
                <select
                  value={simulation.packagingType}
                  onChange={(e) => handleInputChange('packagingType', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                >
                  <option value="minimal">Minimal</option>
                  <option value="standard">Standard</option>
                  <option value="protective">Protective</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Storage Type</label>
                <select
                  value={simulation.storageType}
                  onChange={(e) => handleInputChange('storageType', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                >
                  <option value="ambient">Ambient</option>
                  <option value="refrigerated">Refrigerated</option>
                  <option value="frozen">Frozen</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Distance (km)</label>
                  <input
                    type="number"
                    value={simulation.distance}
                    onChange={(e) => handleInputChange('distance', parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                  <input
                    type="number"
                    value={simulation.quantity}
                    onChange={(e) => handleInputChange('quantity', parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    min="1"
                  />
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  onClick={runSimulation}
                  disabled={isRunning}
                  className="flex-1 flex items-center justify-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all disabled:opacity-50"
                >
                  {isRunning ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Running...
                    </>
                  ) : (
                    <>
                      <Play className="h-5 w-5 mr-2" />
                      Run Simulation
                    </>
                  )}
                </button>
                <button
                  onClick={resetSimulation}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
                >
                  <RotateCcw className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Simulation Results</h2>
            
            {results ? (
              <div className="space-y-6">
                {/* Metrics */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-red-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-red-600">{results.carbonFootprint}</div>
                    <div className="text-sm text-gray-600">kg CO2</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">${results.cost}</div>
                    <div className="text-sm text-gray-600">Total Cost</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">{results.efficiency}%</div>
                    <div className="text-sm text-gray-600">Efficiency</div>
                  </div>
                </div>

                {/* Recommendations */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Leaf className="h-5 w-5 mr-2 text-green-600" />
                    Recommendations
                  </h3>
                  <div className="space-y-3">
                    {results.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start p-3 bg-green-50 rounded-lg">
                        <TrendingUp className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                        <p className="text-sm text-gray-700">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                >
                  View in Dashboard
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <Zap className="h-16 w-16 text-gray-300 mb-4" />
                <p className="text-gray-600 mb-2">Configure parameters and run simulation</p>
                <p className="text-sm text-gray-500">Results will appear here after simulation</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Simulator;