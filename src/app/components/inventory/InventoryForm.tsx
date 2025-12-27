'use client';

import { useState, useEffect } from 'react';
import { addInventoryItem, updateInventoryItem } from '../../utils/inventoryStorage';

export default function InventoryForm({ item, onClose, onSave }) {
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    category: '',
    currentStock: 0,
    unit: 'kg',
    reorderPoint: 0,
    maxStock: 0,
    unitPrice: 0,
    supplier: '',
    description: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (item) {
      setFormData({
        sku: item.sku || '',
        name: item.name || '',
        category: item.category || '',
        currentStock: item.currentStock || 0,
        unit: item.unit || 'kg',
        reorderPoint: item.reorderPoint || 0,
        maxStock: item.maxStock || 0,
        unitPrice: item.unitPrice || 0,
        supplier: item.supplier || '',
        description: item.description || '',
      });
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'currentStock' || name === 'reorderPoint' || name === 'maxStock' || name === 'unitPrice'
        ? parseFloat(value) || 0
        : value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.sku.trim()) newErrors.sku = 'Need a SKU';
    if (!formData.name.trim()) newErrors.name = 'Item name required';
    if (!formData.category.trim()) newErrors.category = 'Category needed';
    if (formData.reorderPoint < 0) newErrors.reorderPoint = 'Can\'t be negative';
    if (formData.maxStock < formData.reorderPoint) {
      newErrors.maxStock = 'Max should be higher than reorder point';
    }
    if (formData.unitPrice < 0) newErrors.unitPrice = 'Price can\'t be negative';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    if (item) {
      updateInventoryItem(item.id, formData);
    } else {
      addInventoryItem(formData);
    }
    onSave();
  };

  const units = ['kg', 'bags', 'pieces', 'liters', 'cubic feet', 'sq ft', 'meters', 'boxes', 'cartons', 'tons'];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-3xl mx-auto relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {item ? 'Edit Item' : 'Add New Item'}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl leading-none"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* SKU */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              SKU <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              className={`w-full px-3 py-2 border-2 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 ${
                errors.sku ? 'border-rose-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="MAT-001"
            />
            {errors.sku && <p className="mt-1 text-sm text-rose-600">{errors.sku}</p>}
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border-2 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 ${
                errors.name ? 'border-rose-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="Item Name"
            />
            {errors.name && <p className="mt-1 text-sm text-rose-600">{errors.name}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full px-3 py-2 border-2 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 ${
                errors.category ? 'border-rose-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="e.g., Raw Materials, Construction"
            />
            {errors.category && <p className="mt-1 text-sm text-rose-600">{errors.category}</p>}
          </div>

          {/* Supplier */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Supplier
            </label>
            <input
              type="text"
              name="supplier"
              value={formData.supplier}
              onChange={handleChange}
              className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Supplier Name"
            />
          </div>

          {/* Current Stock */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Current Stock
            </label>
            <input
              type="number"
              name="currentStock"
              value={formData.currentStock}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Unit */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Unit
            </label>
            <select
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              {units.map(unit => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </div>

          {/* Reorder Point */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Reorder Point
            </label>
            <input
              type="number"
              name="reorderPoint"
              value={formData.reorderPoint}
              onChange={handleChange}
              min="0"
              step="0.01"
              className={`w-full px-3 py-2 border-2 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 ${
                errors.reorderPoint ? 'border-rose-500' : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {errors.reorderPoint && <p className="mt-1 text-sm text-rose-600">{errors.reorderPoint}</p>}
          </div>

          {/* Max Stock */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Max Stock
            </label>
            <input
              type="number"
              name="maxStock"
              value={formData.maxStock}
              onChange={handleChange}
              min="0"
              step="0.01"
              className={`w-full px-3 py-2 border-2 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 ${
                errors.maxStock ? 'border-rose-500' : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {errors.maxStock && <p className="mt-1 text-sm text-rose-600">{errors.maxStock}</p>}
          </div>

          {/* Unit Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Unit Price (₹)
            </label>
            <input
              type="number"
              name="unitPrice"
              value={formData.unitPrice}
              onChange={handleChange}
              min="0"
              step="0.01"
              className={`w-full px-3 py-2 border-2 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 ${
                errors.unitPrice ? 'border-rose-500' : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {errors.unitPrice && <p className="mt-1 text-sm text-rose-600">{errors.unitPrice}</p>}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Additional notes or description"
          />
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-semibold shadow-md"
          >
            {item ? 'Update Item' : 'Add Item'}
          </button>
        </div>
      </form>
    </div>
  );
}

