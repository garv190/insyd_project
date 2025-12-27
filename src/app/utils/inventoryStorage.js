// stores inventory data in localStorage (frontend only)

const STORAGE_KEY = 'inventory_data';

export const getInventoryData = () => {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading inventory data:', error);
    return [];
  }
};

export const saveInventoryData = (data) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving inventory data:', error);
  }
};

export const addInventoryItem = (item) => {
  const data = getInventoryData();
  const newItem = {
    id: Date.now().toString(),
    ...item,
    createdAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
  };
  data.push(newItem);
  saveInventoryData(data);
  return newItem;
};

export const updateInventoryItem = (id, updates) => {
  const data = getInventoryData();
  const index = data.findIndex(item => item.id === id);
  if (index !== -1) {
    data[index] = {
      ...data[index],
      ...updates,
      lastUpdated: new Date().toISOString(),
    };
    saveInventoryData(data);
    return data[index];
  }
  return null;
};

export const deleteInventoryItem = (id) => {
  const data = getInventoryData();
  const filtered = data.filter(item => item.id !== id);
  saveInventoryData(filtered);
  return filtered;
};

export const addTransaction = (itemId, type, quantity, notes = '') => {
  // type: 'in' (stock in) or 'out' (stock out)
  const data = getInventoryData();
  const index = data.findIndex(item => item.id === itemId);
  
  if (index !== -1) {
    const transaction = {
      id: Date.now().toString(),
      itemId,
      type,
      quantity: type === 'in' ? quantity : -quantity,
      notes,
      date: new Date().toISOString(),
    };
    
    // Update stock level
    const currentStock = data[index].currentStock || 0;
    data[index].currentStock = type === 'in' 
      ? currentStock + quantity 
      : Math.max(0, currentStock - quantity);
    
    // Update last movement date for 'out' transactions
    if (type === 'out') {
      data[index].lastMovementDate = new Date().toISOString();
    }
    
    // Add transaction to history
    if (!data[index].transactions) {
      data[index].transactions = [];
    }
    data[index].transactions.push(transaction);
    
    saveInventoryData(data);
    return transaction;
  }
  return null;
};

// add some sample data on first run
export const initializeSampleData = () => {
  const existingData = getInventoryData();
  if (existingData.length === 0) {
    const sampleData = [
      {
        id: '1',
        sku: 'MAT-001',
        name: 'Steel Rod 10mm',
        category: 'Raw Materials',
        currentStock: 150,
        unit: 'kg',
        reorderPoint: 50,
        maxStock: 200,
        unitPrice: 85,
        supplier: 'ABC Steel Works',
        lastMovementDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        lastUpdated: new Date().toISOString(),
        transactions: [],
      },
      {
        id: '2',
        sku: 'MAT-002',
        name: 'Cement Bag 50kg',
        category: 'Construction',
        currentStock: 25,
        unit: 'bags',
        reorderPoint: 30,
        maxStock: 100,
        unitPrice: 350,
        supplier: 'XYZ Cement Ltd',
        lastMovementDate: new Date(Date.now() - 95 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
        lastUpdated: new Date().toISOString(),
        transactions: [],
      },
      {
        id: '3',
        sku: 'MAT-003',
        name: 'Sand Fine Grade',
        category: 'Construction',
        currentStock: 500,
        unit: 'cubic feet',
        reorderPoint: 200,
        maxStock: 800,
        unitPrice: 45,
        supplier: 'River Sand Suppliers',
        lastMovementDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        lastUpdated: new Date().toISOString(),
        transactions: [],
      },
    ];
    saveInventoryData(sampleData);
  }
};

