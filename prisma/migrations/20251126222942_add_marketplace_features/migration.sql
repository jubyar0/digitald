-- CreateEnum
CREATE TYPE "DisputeReason" AS ENUM ('FILE_CORRUPTED', 'NOT_WORKING', 'WRONG_DESCRIPTION', 'LICENSE_ISSUE', 'SELLER_UNRESPONSIVE', 'OTHER');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('NEW_SALE', 'DISPUTE_OPENED', 'DISPUTE_RESPONSE', 'DISPUTE_RESOLVED', 'PAYOUT_REQUESTED', 'PAYOUT_PROCESSED', 'REVIEW_RECEIVED', 'PRODUCT_APPROVED', 'PRODUCT_REJECTED', 'ORDER_COMPLETED');

-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('STRIPE', 'PAYPAL', 'BANK_TRANSFER', 'CRYPTO', 'LOCAL_GATEWAY');

-- AlterEnum
ALTER TYPE "ProductStatus" ADD VALUE 'DRAFT';

-- AlterTable
ALTER TABLE "disputes" ADD COLUMN     "buyerResponseDeadline" TIMESTAMP(3),
ADD COLUMN     "disputeReason" "DisputeReason",
ADD COLUMN     "evidenceFiles" JSONB,
ADD COLUMN     "refundAmount" DOUBLE PRECISION,
ADD COLUMN     "refundProcessed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sellerResponseDeadline" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "escrow_accounts" ADD COLUMN     "availableBalance" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "holdUntil" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "platform_settings" ADD COLUMN     "disputePeriodDays" INTEGER NOT NULL DEFAULT 14,
ADD COLUMN     "escrowHoldDays" INTEGER NOT NULL DEFAULT 7,
ALTER COLUMN "platformFeePercent" SET DEFAULT 30.0;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "currentVersion" TEXT DEFAULT '1.0.0',
ADD COLUMN     "images" JSONB,
ADD COLUMN     "isDraft" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "reviewNotes" TEXT;

-- AlterTable
ALTER TABLE "wallets" ADD COLUMN     "pendingBalance" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "carts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "carts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cart_items" (
    "id" TEXT NOT NULL,
    "cartId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cart_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_versions" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "changelog" TEXT,
    "uploadedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "data" JSONB,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT,
    "changes" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_methods" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "PaymentType" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "config" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_methods_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "carts_userId_key" ON "carts"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "cart_items_cartId_productId_key" ON "cart_items"("cartId", "productId");

-- AddForeignKey
ALTER TABLE "carts" ADD CONSTRAINT "carts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "carts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_versions" ADD CONSTRAINT "product_versions_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_versions" ADD CONSTRAINT "product_versions_uploadedBy_fkey" FOREIGN KEY ("uploadedBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
