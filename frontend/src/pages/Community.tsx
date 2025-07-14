import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, MessageCircle, ThumbsUp, Star, Plus, Search, X } from 'lucide-react';
import { tipAPI } from '../utils/api';
import ShareTipModal from '../components/ShareTipModal';

const Community = () => {
  const navigate = useNavigate();
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetchTips();
  }, []);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchQuery.trim()) {
        handleSearch();
      } else {
        fetchTips();
      }
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [searchQuery]);

  const fetchTips = async () => {
    try {
      setLoading(true);
      const response = await tipAPI.getAll();
      setTips(response.data.data);
    } catch (error: any) {
      console.error('Error fetching tips:', error);
      setError(error.response?.data?.message || 'Failed to fetch tips');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setIsSearching(true);
      const response = await tipAPI.search(searchQuery);
      setTips(response.data.data);
    } catch (error: any) {
      console.error('Error searching tips:', error);
      setError(error.response?.data?.message || 'Failed to search tips');
    } finally {
      setIsSearching(false);
    }
  };

  const handleLikeTip = async (tipId: string) => {
    try {
      await tipAPI.like(tipId);
      // Refresh tips or search results to get updated like count
      if (searchQuery.trim()) {
        handleSearch();
      } else {
        fetchTips();
      }
    } catch (error: any) {
      console.error('Error liking tip:', error);
      alert('Failed to like tip. Please try again.');
    }
  };

  const handleTipAdded = () => {
    // Refresh the tips list after a new tip is added
    if (searchQuery.trim()) {
      handleSearch();
    } else {
      fetchTips();
    }
  };

  // Fallback tips data if no tips from API
  const fallbackTips = [
    {
      id: 1,
      title: 'Reduce Packaging Waste by 30%',
      description: 'Switch to biodegradable packaging materials and optimize package sizing based on product dimensions.',
      author: { name: 'Sarah Johnson', department: 'Sustainability' },
      category: 'Packaging',
      likes: 42,
      tags: ['packaging', 'waste-reduction', 'sustainability'],
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 2,
      title: 'Electric Fleet Transition Strategy',
      description: 'Step-by-step guide to transitioning delivery fleets to electric vehicles for carbon footprint reduction.',
      author: { name: 'Mike Chen', department: 'Transportation' },
      category: 'Transportation',
      likes: 35,
      tags: ['transportation', 'electric', 'carbon-reduction'],
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 3,
      title: 'Supplier Sustainability Scoring',
      author: 'Emily Rodriguez',
      avatar: 'ER',
      category: 'Supply Chain',
      likes: 28,
      comments: 6,
      time: '1 day ago',
      content: 'Implement a comprehensive scoring system to evaluate and improve supplier sustainability practices.',
      tags: ['suppliers', 'scoring', 'evaluation']
    }
  ];

  const displayTips = tips.length > 0 ? tips : fallbackTips;

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="max-w-6xl mx-auto px-6 py-8">
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
              <h1 className="text-3xl font-bold text-gray-900">Tips & Community</h1>
              <p className="text-gray-600">Share insights and learn from sustainability experts</p>
            </div>
          </div>
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="flex items-center px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-all"
          >
            <Plus className="h-5 w-5 mr-2" />
            Share Tip
          </button>
        </div>

        {/* Stats Bar */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-600">247</div>
              <div className="text-gray-600 text-sm">Active Members</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">{displayTips.length}</div>
              <div className="text-gray-600 text-sm">Tips Available</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">1,234</div>
              <div className="text-gray-600 text-sm">Total Likes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-600">356</div>
              <div className="text-gray-600 text-sm">Comments</div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tips and discussions..."
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              {isSearching && (
                <div className="flex items-center text-gray-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                  Searching...
                </div>
              )}
              {searchQuery && (
                <span className="text-sm text-gray-600">
                  {tips.length} result{tips.length !== 1 ? 's' : ''} found
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Tips/Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {loading ? (
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 animate-pulse">
                    <div className="h-16 bg-slate-200 rounded mb-4"></div>
                    <div className="h-6 bg-slate-200 rounded mb-2"></div>
                    <div className="h-20 bg-slate-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <p className="text-red-600">Error: {error}</p>
                <button 
                  onClick={fetchTips}
                  className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                >
                  Retry
                </button>
              </div>
            ) : (
              displayTips.map((tip: any) => (
                <div key={tip.id || tip._id} className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-slate-500 rounded-full flex items-center justify-center text-white font-medium mr-3">
                        {getInitials(tip.author?.name || tip.author)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{tip.author?.name || tip.author}</div>
                        <div className="text-sm text-gray-500">{getTimeAgo(tip.createdAt)}</div>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-slate-100 text-slate-800 text-xs font-medium rounded-full">
                      {tip.category}
                    </span>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{tip.title}</h3>
                  <p className="text-gray-600 mb-4">{tip.description || tip.content}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {tip.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="flex items-center space-x-4">
                      <button 
                        onClick={() => handleLikeTip(tip._id || tip.id)}
                        className="flex items-center text-gray-600 hover:text-emerald-600 transition-colors"
                      >
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        {tip.likes}
                      </button>
                      <button className="flex items-center text-gray-600 hover:text-emerald-600 transition-colors">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        {tip.comments || 0}
                      </button>
                    </div>
                    <button className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors">
                      Read More
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Top Contributors */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Star className="h-5 w-5 mr-2 text-yellow-500" />
                Top Contributors
              </h3>
              <div className="space-y-3">
                {[
                  { name: 'Sarah Johnson', tips: 12 },
                  { name: 'Mike Chen', tips: 8 },
                  { name: 'Emily Rodriguez', tips: 6 },
                ].map((contributor, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-slate-500 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                        {getInitials(contributor.name)}
                      </div>
                      <span className="text-gray-900">{contributor.name}</span>
                    </div>
                    <span className="text-sm text-gray-500">{contributor.tips} tips</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular Tags */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {['sustainability', 'packaging', 'transportation', 'carbon-reduction', 'waste-management', 'energy-efficiency'].map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-emerald-100 hover:text-emerald-700 cursor-pointer transition-colors">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/add-product')}
                  className="w-full px-4 py-3 border border-slate-300 text-gray-700 rounded-lg hover:bg-slate-50 transition-all"
                >
                  Add Product
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-full px-4 py-3 border border-slate-300 text-gray-700 rounded-lg hover:bg-slate-50 transition-all"
                >
                  View Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Share Tip Modal */}
        <ShareTipModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          onTipAdded={handleTipAdded}
        />
      </div>
    </div>
  );
};

export default Community;