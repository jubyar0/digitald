-- Performance Optimization Indexes
-- Add indexes for frequently queried fields to improve query performance

-- Orders table indexes
CREATE INDEX IF NOT EXISTS idx_orders_vendor_status ON "Order"("vendorId", "status");
CREATE INDEX IF NOT EXISTS idx_orders_user_created ON "Order"("userId", "createdAt" DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON "Order"("status");
CREATE INDEX IF NOT EXISTS idx_orders_created ON "Order"("createdAt" DESC);

-- Products table indexes
CREATE INDEX IF NOT EXISTS idx_products_vendor_status ON "Product"("vendorId", "status");
CREATE INDEX IF NOT EXISTS idx_products_category ON "Product"("categoryId");
CREATE INDEX IF NOT EXISTS idx_products_status ON "Product"("status");
CREATE INDEX IF NOT EXISTS idx_products_created ON "Product"("createdAt" DESC);

-- Users table indexes
CREATE INDEX IF NOT EXISTS idx_users_role ON "User"("role");
CREATE INDEX IF NOT EXISTS idx_users_email ON "User"("email");
CREATE INDEX IF NOT EXISTS idx_users_created ON "User"("createdAt" DESC);

-- Vendor table indexes
CREATE INDEX IF NOT EXISTS idx_vendors_user ON "Vendor"("userId");
CREATE INDEX IF NOT EXISTS idx_vendors_created ON "Vendor"("createdAt" DESC);

-- VendorApplication table indexes
CREATE INDEX IF NOT EXISTS idx_vendor_apps_status ON "VendorApplication"("status");
CREATE INDEX IF NOT EXISTS idx_vendor_apps_vendor ON "VendorApplication"("vendorId");

-- Withdrawal table indexes
CREATE INDEX IF NOT EXISTS idx_withdrawals_vendor_status ON "Withdrawal"("vendorId", "status");
CREATE INDEX IF NOT EXISTS idx_withdrawals_status ON "Withdrawal"("status");

-- Dispute table indexes
CREATE INDEX IF NOT EXISTS idx_disputes_status ON "Dispute"("status");
CREATE INDEX IF NOT EXISTS idx_disputes_order ON "Dispute"("orderId");

-- OrderItem table indexes
CREATE INDEX IF NOT EXISTS idx_order_items_product ON "OrderItem"("productId");
CREATE INDEX IF NOT EXISTS idx_order_items_order ON "OrderItem"("orderId");
