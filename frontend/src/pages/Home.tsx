import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, BarChart3, Zap, Users, Leaf } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  const navigationButtons = [
    {
      title: 'Add New Product',
      description: 'Input product details and sustainability metrics',
      icon: Plus,
      route: '/add-product',
      color: 'bg-emerald-500 hover:bg-emerald-600',
      iconBg: 'bg-emerald-100'
    },
    {
      title: 'Sustainability Dashboard',
      description: 'View analytics and environmental impact data',
      icon: BarChart3,
      route: '/dashboard',
      color: 'bg-green-500 hover:bg-green-600',
      iconBg: 'bg-green-100'
    },
    {
      title: 'Scenario Simulator',
      description: 'Test different sustainability scenarios',
      icon: Zap,
      route: '/simulator',
      color: 'bg-amber-500 hover:bg-amber-600',
      iconBg: 'bg-amber-100'
    },
    {
      title: 'Tips & Community',
      description: 'Share insights and learn from others',
      icon: Users,
      route: '/community',
      color: 'bg-slate-500 hover:bg-slate-600',
      iconBg: 'bg-slate-100'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-600 p-2 rounded-lg">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Walmart</h1>
              <p className="text-sm text-emerald-600 font-medium">Sustainability Hub</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Leaf className="h-4 w-4 mr-2" />
            Driving Environmental Impact
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Sustainable Product
            <span className="text-emerald-600 block">Management Platform</span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Empowering Walmart's sustainability initiatives through intelligent product tracking, 
            environmental impact analysis, and collaborative community insights.
          </p>

          <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Carbon Footprint Tracking
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-slate-500 rounded-full mr-2"></div>
              Supply Chain Optimization
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-amber-500 rounded-full mr-2"></div>
              Impact Simulation
            </div>
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {navigationButtons.map((button, index) => {
            const IconComponent = button.icon;
            return (
              <div
                key={index}
                onClick={() => navigate(button.route)}
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-slate-200 hover:border-emerald-200 transform hover:-translate-y-2"
              >
                <div className="flex items-start space-x-4">
                  <div className={`${button.iconBg} p-4 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="h-8 w-8 text-slate-700" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors">
                      {button.title}
                    </h3>
                    <p className="text-gray-600 text-lg leading-relaxed mb-6">
                      {button.description}
                    </p>
                    
                    <div className={`inline-flex items-center ${button.color} text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 group-hover:scale-105`}>
                      Get Started
                      <svg className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="mt-20 bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-emerald-600 mb-2">10,000+</div>
              <div className="text-gray-600">Products Analyzed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">25%</div>
              <div className="text-gray-600">Carbon Reduction</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-amber-600 mb-2">500+</div>
              <div className="text-gray-600">Active Users</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;