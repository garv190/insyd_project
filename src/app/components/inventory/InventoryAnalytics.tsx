'use client';

import { useState, useEffect } from 'react';

export default function InventoryAnalytics({ inventory }) {
  const [analytics, setAnalytics] = useState({
    totalValue: 0,
    lowStockValue: 0,
    deadStockValue: 0,
    overstockValue: 0,
    categoryBreakdown: {},
    topItems: [],
    slowItems: [],
  });

  useEffect(() => {
    calculateAnalytics();
  }, [inventory]);

  const calculateAnalytics = () => {
    const now = new Date();
    let totalValue = 0;
    let lowStockValue = 0;
    let deadStockValue = 0;
    let overstockValue = 0;
    const categoryBreakdown = {};
    const itemsWithValues = [];

    inventory.forEach(item => {
      const value = (item.currentStock || 0) * (item.unitPrice || 0);
      totalValue += value;
      
      // Category breakdown
      const category = item.category || 'Uncategorized';
      if (!categoryBreakdown[category]) {
        categoryBreakdown[category] = { count: 0, value: 0 };
      }
      categoryBreakdown[category].count++;
      categoryBreakdown[category].value += value;

      // Low stock
      if (item.currentStock < (item.reorderPoint || 0)) {
        lowStockValue += value;
      }

      // Dead stock (90+ days)
      if (item.lastMovementDate) {
        const lastMovement = new Date(item.lastMovementDate);
        const daysSinceMovement = (now - lastMovement) / (1000 * 60 * 60 * 24);
        if (daysSinceMovement > 90 && item.currentStock > 0) {
          deadStockValue += value;
        }
      }

      // Overstock
      if (item.currentStock > (item.maxStock || 0)) {
        overstockValue += value;
      }

      itemsWithValues.push({
        ...item,
        totalValue: value,
        turnover: calculateTurnover(item),
      });
    });

    // Sort items by value (top items)
    const topItems = [...itemsWithValues]
      .sort((a, b) => b.totalValue - a.totalValue)
      .slice(0, 10);

    // Sort items by turnover (slow movers)
    const slowItems = [...itemsWithValues]
      .filter(item => item.currentStock > 0)
      .sort((a, b) => a.turnover - b.turnover)
      .slice(0, 10);

    setAnalytics({
      totalValue,
      lowStockValue,
      deadStockValue,
      overstockValue,
      categoryBreakdown,
      topItems,
      slowItems,
    });
  };

  const calculateTurnover = (item) => {
    // days since last movement
    if (!item.lastMovementDate || item.currentStock === 0) return Infinity;
    
    const lastMovement = new Date(item.lastMovementDate);
    const daysSinceMovement = (new Date() - lastMovement) / (1000 * 60 * 60 * 24);
    return daysSinceMovement;
  };

  const healthScore = () => {
    let score = 100;
    const deadStockPercent = analytics.totalValue > 0 ? (analytics.deadStockValue / analytics.totalValue) * 100 : 0;
    const lowStockPercent = analytics.totalValue > 0 ? (analytics.lowStockValue / analytics.totalValue) * 100 : 0;
    const overstockPercent = analytics.totalValue > 0 ? (analytics.overstockValue / analytics.totalValue) * 100 : 0;

    score -= Math.min(deadStockPercent * 0.5, 30);
    score -= Math.min(lowStockPercent * 0.3, 20);
    score -= Math.min(overstockPercent * 0.2, 15);

    return Math.max(0, Math.round(score));
  };

  return (
    <div className="space-y-6">
      {/* Health Score */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Inventory Health Score</h2>
        <div className="flex items-center space-x-4">
          <div className="text-6xl font-bold">{healthScore()}</div>
          <div className="text-sm opacity-90">
            <p>Based on dead stock, low stock, and overstock metrics</p>
            <p className="mt-2">
              {healthScore() >= 80 ? '✅ Looking good!' : 
               healthScore() >= 60 ? '⚠️ Not bad, but could be better' : 
               healthScore() >= 40 ? '🔶 Needs some work' : '❌ Time to take action'}
            </p>
          </div>
        </div>
      </div>

      {/* Value Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Inventory Value"
          value={`₹${analytics.totalValue.toLocaleString('en-IN')}`}
          icon="💰"
          color="blue"
        />
        <MetricCard
          title="Low Stock Value"
          value={`₹${analytics.lowStockValue.toLocaleString('en-IN')}`}
          icon="⚠️"
          color="red"
          percent={analytics.totalValue > 0 ? ((analytics.lowStockValue / analytics.totalValue) * 100).toFixed(1) : 0}
        />
        <MetricCard
          title="Dead Stock Value"
          value={`₹${analytics.deadStockValue.toLocaleString('en-IN')}`}
          icon="💀"
          color="orange"
          percent={analytics.totalValue > 0 ? ((analytics.deadStockValue / analytics.totalValue) * 100).toFixed(1) : 0}
        />
        <MetricCard
          title="Overstock Value"
          value={`₹${analytics.overstockValue.toLocaleString('en-IN')}`}
          icon="📊"
          color="yellow"
          percent={analytics.totalValue > 0 ? ((analytics.overstockValue / analytics.totalValue) * 100).toFixed(1) : 0}
        />
      </div>

      {/* Category Breakdown */}
      <div className="bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Breakdown by Category
        </h2>
        <div className="space-y-4">
          {Object.entries(analytics.categoryBreakdown)
            .sort((a, b) => b[1].value - a[1].value)
            .map(([category, data]) => (
              <div key={category}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {category}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {data.count} items • ₹{data.value.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{
                      width: `${analytics.totalValue > 0 ? (data.value / analytics.totalValue) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Top 10 Items by Value */}
      <div className="bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Top 10 Items by Value
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  Rank
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  SKU
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  Stock
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  Total Value
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {analytics.topItems.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    #{index + 1}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {item.sku}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                    {item.name}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {item.currentStock} {item.unit}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    ₹{item.totalValue.toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slow Moving Items */}
      <div className="bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Slow Moving Items
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  SKU
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  Stock
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  Days Since Last Movement
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  Value
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {analytics.slowItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    All items are moving well!
                  </td>
                </tr>
              ) : (
                analytics.slowItems.map(item => {
                  const lastMovement = item.lastMovementDate 
                    ? new Date(item.lastMovementDate)
                    : null;
                  const daysSince = lastMovement 
                    ? Math.floor((new Date() - lastMovement) / (1000 * 60 * 60 * 24))
                    : 'N/A';
                  
                  return (
                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {item.sku}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                        {item.name}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {item.currentStock} {item.unit}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {typeof daysSince === 'number' ? `${daysSince} days` : daysSince}
                        {typeof daysSince === 'number' && daysSince > 90 && (
                          <span className="ml-2 text-red-600">⚠️</span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        ₹{item.totalValue.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon, color, percent }) {
  const colorClasses = {
    blue: 'bg-slate-100 dark:bg-slate-800/50 border-slate-300 dark:border-slate-700',
    red: 'bg-rose-100 dark:bg-rose-900/40 border-rose-300 dark:border-rose-800',
    orange: 'bg-amber-100 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700',
    yellow: 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700',
  };

  return (
    <div className={`${colorClasses[color]} rounded-md shadow-sm p-4 border-2`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {title}
        </span>
        <span className="text-2xl">{icon}</span>
      </div>
      <div className="text-2xl font-bold text-gray-900 dark:text-white">
        {value}
      </div>
      {percent !== undefined && (
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {percent}% of total inventory
        </div>
      )}
    </div>
  );
}

