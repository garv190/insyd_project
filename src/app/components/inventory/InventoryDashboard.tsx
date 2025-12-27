'use client';

import { useState, useEffect } from 'react';
import { addTransaction } from '../../utils/inventoryStorage';

export default function InventoryDashboard({ inventory, onEdit, onRefresh }) {
  const [stats, setStats] = useState({
    totalItems: 0,
    totalValue: 0,
    lowStockCount: 0,
    deadStockCount: 0,
    overstockCount: 0,
  });

  useEffect(() => {
    calculateStats();
  }, [inventory]);

  const calculateStats = () => {
    let totalValue = 0;
    let lowStock = 0;
    let deadStock = 0;
    let overstock = 0;
    const now = new Date();

    inventory.forEach(item => {
      const value = (item.currentStock || 0) * (item.unitPrice || 0);
      totalValue += value;

      // check if below reorder point
      if (item.currentStock < (item.reorderPoint || 0)) {
        lowStock++;
      }

      // hasn't moved in 90+ days = dead stock
      if (item.lastMovementDate) {
        const lastMovement = new Date(item.lastMovementDate);
        const daysSinceMovement = (now - lastMovement) / (1000 * 60 * 60 * 24);
        if (daysSinceMovement > 90 && item.currentStock > 0) {
          deadStock++;
        }
      }

      // way over the max
      if (item.currentStock > (item.maxStock || 0)) {
        overstock++;
      }
    });

    setStats({
      totalItems: inventory.length,
      totalValue,
      lowStockCount: lowStock,
      deadStockCount: deadStock,
      overstockCount: overstock,
    });
  };

  const handleQuickAction = (itemId, action, quantity) => {
    addTransaction(itemId, action, quantity);
    onRefresh();
  };

  const lowStockItems = inventory.filter(
    item => item.currentStock < (item.reorderPoint || 0)
  );

  const deadStockItems = inventory.filter(item => {
    if (!item.lastMovementDate || item.currentStock === 0) return false;
    const lastMovement = new Date(item.lastMovementDate);
    const daysSinceMovement = (new Date() - lastMovement) / (1000 * 60 * 60 * 24);
    return daysSinceMovement > 90;
  });

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Items"
          value={stats.totalItems}
          icon="📦"
          color="blue"
        />
        <StatCard
          title="Total Value"
          value={`₹${stats.totalValue.toLocaleString('en-IN')}`}
          icon="💰"
          color="green"
        />
        <StatCard
          title="Low Stock"
          value={stats.lowStockCount}
          icon="⚠️"
          color="red"
          isAlert={stats.lowStockCount > 0}
        />
        <StatCard
          title="Dead Stock"
          value={stats.deadStockCount}
          icon="💀"
          color="orange"
          isAlert={stats.deadStockCount > 0}
        />
        <StatCard
          title="Overstock"
          value={stats.overstockCount}
          icon="📊"
          color="yellow"
          isAlert={stats.overstockCount > 0}
        />
      </div>

      {/* Alerts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Alerts */}
        <div className="bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            ⚠️ Low Stock Items
          </h2>
          {lowStockItems.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">All good! No low stock items</p>
          ) : (
            <div className="space-y-3">
              {lowStockItems.slice(0, 5).map(item => (
                <div
                  key={item.id}
                  className="flex justify-between items-center p-3 bg-rose-100 dark:bg-rose-900/40 rounded border-l-4 border-l-rose-500"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {item.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {item.currentStock} {item.unit} (Reorder: {item.reorderPoint})
                    </p>
                  </div>
                  <button
                    onClick={() => onEdit(item)}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Restock
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Dead Stock Alerts */}
        <div className="bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            💀 Dead Stock
          </h2>
          {deadStockItems.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">Nothing stuck here - all items are moving</p>
          ) : (
            <div className="space-y-3">
              {deadStockItems.slice(0, 5).map(item => {
                const lastMovement = new Date(item.lastMovementDate);
                const daysSince = Math.floor(
                  (new Date() - lastMovement) / (1000 * 60 * 60 * 24)
                );
                return (
                  <div
                    key={item.id}
                    className="flex justify-between items-center p-3 bg-amber-100 dark:bg-amber-900/40 rounded border-l-4 border-l-amber-500"
                  >
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {item.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {item.currentStock} {item.unit} • {daysSince} days inactive
                      </p>
                    </div>
                    <button
                      onClick={() => onEdit(item)}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Review
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Quick View */}
      <div className="bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Quick View
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {inventory.slice(0, 10).map(item => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {item.sku}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {item.name}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {item.currentStock} {item.unit}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    ₹{((item.currentStock || 0) * (item.unitPrice || 0)).toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm space-x-2">
                    <button
                      onClick={() => handleQuickAction(item.id, 'in', 10)}
                      className="text-emerald-600 hover:text-emerald-800 font-semibold"
                      title="Stock In"
                    >
                      +10
                    </button>
                    <button
                      onClick={() => handleQuickAction(item.id, 'out', 5)}
                      className="text-rose-600 hover:text-rose-800 font-semibold"
                      title="Stock Out"
                    >
                      -5
                    </button>
                    <button
                      onClick={() => onEdit(item)}
                      className="text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, isAlert }) {
  const colorClasses = {
    blue: 'bg-slate-100 dark:bg-slate-800/50 border-slate-300 dark:border-slate-700',
    green: 'bg-emerald-100 dark:bg-emerald-900/30 border-emerald-300 dark:border-emerald-700',
    red: 'bg-rose-100 dark:bg-rose-900/40 border-rose-300 dark:border-rose-800',
    orange: 'bg-amber-100 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700',
    yellow: 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700',
  };

  return (
    <div
      className={`${colorClasses[color]} rounded-md shadow-sm p-4 border-2 ${
        isAlert ? 'ring-2 ring-rose-400 dark:ring-rose-600' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {value}
          </p>
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  );
}

