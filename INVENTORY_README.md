# Inventory Management System

A comprehensive frontend-only inventory management application built with Next.js and React, designed to solve inventory visibility problems for Indian material businesses.

## Features

### 📊 Dashboard
- Real-time inventory statistics (Total Items, Total Value, Low Stock, Dead Stock, Overstock)
- Low stock alerts with quick restock options
- Dead stock identification (items with no movement in 90+ days)
- Recent inventory items with quick actions

### 📦 Inventory Management
- Complete CRUD operations (Create, Read, Update, Delete)
- Stock In/Out transactions
- SKU-based tracking
- Category organization
- Search and filter functionality
- Sort by name, SKU, stock level, or value

### 📈 Analytics & Reporting
- Inventory Health Score calculation
- Category-wise breakdown
- Top 10 items by value
- Slow-moving items identification
- Dead stock analysis
- Low stock percentage tracking
- Overstock monitoring

## Getting Started

1. **Install Dependencies** (if not already installed):
   ```bash
   npm install
   ```

2. **Run the Development Server**:
   ```bash
   npm run dev
   ```

3. **Access the Inventory Management**:
   Navigate to `http://localhost:3000/inventory` in your browser

## Data Storage

This is a **frontend-only** solution using **localStorage** for data persistence. All inventory data is stored in the browser's local storage, which means:
- ✅ No backend required
- ✅ Works offline (after initial load)
- ✅ Data persists across page refreshes
- ⚠️ Data is specific to each browser/device
- ⚠️ Data will be lost if browser data is cleared

**Note:** For production use, you may want to upgrade to a backend database or cloud storage solution.

## Usage Guide

### Adding New Inventory Items

1. Click the **"+ Add New Item"** button
2. Fill in the required fields:
   - SKU (Stock Keeping Unit) - unique identifier
   - Name - item name
   - Category - e.g., "Raw Materials", "Construction"
   - Current Stock - initial quantity
   - Unit - kg, bags, pieces, etc.
   - Reorder Point - minimum stock level before reordering
   - Max Stock - maximum stock level
   - Unit Price - price per unit
   - Supplier (optional)
3. Click **"Add Item"** to save

### Managing Stock Levels

#### Stock In (Adding Stock):
- From Dashboard: Click the **"+10"** quick action button
- From Inventory List: Click the **⬆️** icon and enter quantity

#### Stock Out (Removing Stock):
- From Dashboard: Click the **"-5"** quick action button
- From Inventory List: Click the **⬇️** icon and enter quantity

### Understanding Alerts

#### Low Stock ⚠️
- Items below their reorder point
- Appears in red on the dashboard
- Quick "Restock" button available

#### Dead Stock 💀
- Items with no movement in 90+ days
- Indicates potentially obsolete inventory
- Review and consider liquidation or discounting

#### Overstock 📊
- Items exceeding maximum stock level
- Ties up unnecessary capital
- Consider reducing future orders

### Analytics Features

#### Health Score
- Calculated based on dead stock, low stock, and overstock percentages
- Score 80+: Excellent
- Score 60-79: Good
- Score 40-59: Needs Improvement
- Score <40: Critical

#### Category Breakdown
- Visual representation of inventory distribution
- Helps identify which categories hold the most value

#### Top Items by Value
- Identifies high-value inventory items
- Focus attention on items with significant capital investment

#### Slow Moving Items
- Lists items with longest time since last movement
- Helps identify potential dead stock candidates

## Sample Data

The application initializes with sample data when first loaded:
- Steel Rod 10mm (MAT-001)
- Cement Bag 50kg (MAT-002)
- Sand Fine Grade (MAT-003)

You can edit or delete these sample items as needed.

## Key Metrics Explained

1. **Total Inventory Value**: Sum of (Current Stock × Unit Price) for all items
2. **Low Stock Count**: Number of items below reorder point
3. **Dead Stock**: Items with no stock movement in 90+ days
4. **Overstock**: Items exceeding maximum stock level
5. **Turnover**: Days since last movement (lower is better)

## Technology Stack

- **Next.js 14** - React framework
- **React** - UI library
- **Tailwind CSS** - Styling
- **localStorage** - Data persistence (frontend-only)

## File Structure

```
src/app/
├── inventory/
│   └── page.tsx                    # Main inventory page
├── components/inventory/
│   ├── InventoryDashboard.tsx      # Dashboard with stats and alerts
│   ├── InventoryList.tsx           # Full inventory list with filters
│   ├── InventoryForm.tsx           # Add/Edit form
│   └── InventoryAnalytics.tsx      # Analytics and reporting
└── utils/
    └── inventoryStorage.js         # localStorage utility functions
```

## Future Enhancements (Optional)

- Export data to CSV/Excel
- Barcode/QR code scanning
- Purchase order management
- Multi-location support
- User authentication
- Cloud sync/backup
- Mobile app version
- Integration with accounting software

## Support

For issues or questions, refer to the problem-solving document (`PROBLEM_SOLVING_DOCUMENT.md`) for detailed information about the solution approach.

