'use client';

import { useState, useEffect } from 'react';
import { getInventoryData, initializeSampleData, deleteInventoryItem } from '../utils/inventoryStorage';
import InventoryDashboard from '../components/inventory/InventoryDashboard';
import InventoryList from '../components/inventory/InventoryList';
import InventoryForm from '../components/inventory/InventoryForm';
import InventoryAnalytics from '../components/inventory/InventoryAnalytics';

export default function InventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    initializeSampleData(); // populates with some demo data on first load
    loadInventory();
  }, []);

  const loadInventory = () => {
    const data = getInventoryData();
    setInventory(data);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingItem(null);
    loadInventory();
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this item?')) {
      deleteInventoryItem(id);
      loadInventory();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b-2 border-gray-300 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Inventory Manager
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Keep track of your materials and stock levels
              </p>
            </div>
            <button
              onClick={() => {
                setEditingItem(null);
                setShowForm(true);
              }}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-semibold shadow-md"
            >
              + Add New Item
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: '📊' },
              { id: 'list', label: 'Inventory List', icon: '📦' },
              { id: 'analytics', label: 'Analytics', icon: '📈' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setShowForm(false);
                  setEditingItem(null);
                }}
                className={`${
                  activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-700 dark:text-indigo-400 font-semibold'
                    : 'border-transparent text-gray-600 hover:text-gray-800 dark:text-gray-400'
                } whitespace-nowrap py-4 px-2 border-b-2 text-sm`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <InventoryDashboard inventory={inventory} onEdit={handleEdit} onRefresh={loadInventory} />
        )}
        {activeTab === 'list' && (
          <InventoryList 
            inventory={inventory} 
            onEdit={handleEdit} 
            onDelete={handleDelete}
            onRefresh={loadInventory}
          />
        )}
        {activeTab === 'analytics' && (
          <InventoryAnalytics inventory={inventory} />
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div 
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={handleFormClose}
        >
          <div 
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <InventoryForm 
              item={editingItem} 
              onClose={handleFormClose}
              onSave={handleFormClose}
            />
          </div>
        </div>
      )}
    </div>
  );
}

