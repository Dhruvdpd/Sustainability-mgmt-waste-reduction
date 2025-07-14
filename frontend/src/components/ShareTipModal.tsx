import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { tipAPI } from '../utils/api';

interface ShareTipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTipAdded: () => void;
}

const ShareTipModal: React.FC<ShareTipModalProps> = ({ isOpen, onClose, onTipAdded }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'packaging',
    author: {
      name: '',
      department: 'Sustainability'
    },
    tags: '',
    impact: {
      carbonReduction: 0,
      costSavings: 0,
      efficiencyGain: 0
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const tipData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
      };

      await tipAPI.create(tipData);
      alert('Tip shared successfully!');
      onTipAdded();
      onClose();
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: 'packaging',
        author: { name: '', department: 'Sustainability' },
        tags: '',
        impact: { carbonReduction: 0, costSavings: 0, efficiencyGain: 0 }
      });
    } catch (error: any) {
      console.error('Error sharing tip:', error);
      alert(error.response?.data?.message || 'Failed to share tip. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: child === 'carbonReduction' || child === 'costSavings' || child === 'efficiencyGain'
            ? parseFloat(value) || 0
            : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Share a Sustainability Tip</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tip Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                placeholder="Enter tip title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                required
              >
                <option value="packaging">Packaging</option>
                <option value="transportation">Transportation</option>
                <option value="storage">Storage</option>
                <option value="energy">Energy</option>
                <option value="waste">Waste</option>
                <option value="supply-chain">Supply Chain</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              placeholder="Describe your sustainability tip in detail..."
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Name
              </label>
              <input
                type="text"
                name="author.name"
                value={formData.author.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                placeholder="Enter your name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department
              </label>
              <input
                type="text"
                name="author.department"
                value={formData.author.department}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                placeholder="Enter your department"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              placeholder="e.g., sustainability, packaging, carbon-reduction"
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Expected Impact</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Carbon Reduction (kg)
                </label>
                <input
                  type="number"
                  name="impact.carbonReduction"
                  value={formData.impact.carbonReduction}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cost Savings ($)
                </label>
                <input
                  type="number"
                  name="impact.costSavings"
                  value={formData.impact.costSavings}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Efficiency Gain (%)
                </label>
                <input
                  type="number"
                  name="impact.efficiencyGain"
                  value={formData.impact.efficiencyGain}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  min="0"
                  max="100"
                  step="0.1"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-slate-300 text-gray-700 rounded-lg hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Sharing...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2" />
                  Share Tip
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShareTipModal;