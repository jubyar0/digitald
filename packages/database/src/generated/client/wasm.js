
Object.defineProperty(exports, "__esModule", { value: true });

const {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientRustPanicError,
  PrismaClientInitializationError,
  PrismaClientValidationError,
  NotFoundError,
  getPrismaClient,
  sqltag,
  empty,
  join,
  raw,
  Decimal,
  Debug,
  objectEnumValues,
  makeStrictEnum,
  Extensions,
  warnOnce,
  defineDmmfProperty,
  Public,
  detectRuntime,
} = require('./runtime/wasm.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.10.2
 * Query Engine version: 5a9203d0590c951969e85a7d07215503f4672eb9
 */
Prisma.prismaVersion = {
  client: "5.10.2",
  engine: "5a9203d0590c951969e85a7d07215503f4672eb9"
}

Prisma.PrismaClientKnownRequestError = PrismaClientKnownRequestError;
Prisma.PrismaClientUnknownRequestError = PrismaClientUnknownRequestError
Prisma.PrismaClientRustPanicError = PrismaClientRustPanicError
Prisma.PrismaClientInitializationError = PrismaClientInitializationError
Prisma.PrismaClientValidationError = PrismaClientValidationError
Prisma.NotFoundError = NotFoundError
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = sqltag
Prisma.empty = empty
Prisma.join = join
Prisma.raw = raw
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = Extensions.getExtensionContext
Prisma.defineExtension = Extensions.defineExtension

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */
exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  email: 'email',
  name: 'name',
  role: 'role',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  password: 'password',
  rememberToken: 'rememberToken',
  image: 'image',
  accountType: 'accountType',
  softwarePreferences: 'softwarePreferences',
  twoFactorEnabled: 'twoFactorEnabled',
  twoFactorSecret: 'twoFactorSecret',
  canHandleLiveChat: 'canHandleLiveChat'
};

exports.Prisma.VendorScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  userId: 'userId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  avatar: 'avatar',
  averageRating: 'averageRating',
  bio: 'bio',
  coverImage: 'coverImage',
  featuredLayout: 'featuredLayout',
  location: 'location',
  socialLinks: 'socialLinks',
  specializations: 'specializations',
  themeColor: 'themeColor',
  totalFollowers: 'totalFollowers',
  totalReviews: 'totalReviews',
  isVerified: 'isVerified',
  totalSales: 'totalSales'
};

exports.Prisma.VendorPayoutMethodScalarFieldEnum = {
  id: 'id',
  vendorId: 'vendorId',
  type: 'type',
  label: 'label',
  details: 'details',
  isDefault: 'isDefault',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CollectionScalarFieldEnum = {
  id: 'id',
  name: 'name',
  slug: 'slug',
  description: 'description',
  icon: 'icon',
  image: 'image',
  order: 'order',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CategoryScalarFieldEnum = {
  id: 'id',
  name: 'name',
  slug: 'slug',
  isActive: 'isActive',
  parentId: 'parentId',
  collectionId: 'collectionId',
  description: 'description'
};

exports.Prisma.ProductScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  price: 'price',
  currency: 'currency',
  categoryId: 'categoryId',
  vendorId: 'vendorId',
  fileUrl: 'fileUrl',
  thumbnail: 'thumbnail',
  isActive: 'isActive',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  assetDetails: 'assetDetails',
  includedResolution: 'includedResolution',
  availableResolutions: 'availableResolutions',
  height: 'height',
  width: 'width',
  depth: 'depth',
  meshCount: 'meshCount',
  textureFiles: 'textureFiles',
  nativeFileFormats: 'nativeFileFormats',
  universalFileFormats: 'universalFileFormats',
  addonSupport: 'addonSupport',
  licenseInfo: 'licenseInfo',
  currentVersion: 'currentVersion',
  images: 'images',
  isDraft: 'isDraft',
  reviewNotes: 'reviewNotes',
  downloads: 'downloads',
  likes: 'likes',
  views: 'views',
  geometryType: 'geometryType',
  hasLOD: 'hasLOD',
  isAnimated: 'isAnimated',
  isRigged: 'isRigged',
  lodLevels: 'lodLevels',
  materialType: 'materialType',
  polygonCount: 'polygonCount',
  renderEngine: 'renderEngine',
  softwareCompatibility: 'softwareCompatibility',
  verticesCount: 'verticesCount',
  aiIssuesDetected: 'aiIssuesDetected',
  aiLodGenerated: 'aiLodGenerated',
  aiProcessedAt: 'aiProcessedAt',
  aiProcessingStatus: 'aiProcessingStatus',
  aiTagsSuggested: 'aiTagsSuggested',
  aiThumbnailGenerated: 'aiThumbnailGenerated',
  aiTopologyScore: 'aiTopologyScore',
  aiUvQualityScore: 'aiUvQualityScore',
  shippingProfileId: 'shippingProfileId'
};

exports.Prisma.FeaturedCollectionScalarFieldEnum = {
  id: 'id',
  title: 'title',
  identifier: 'identifier',
  description: 'description',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.EscrowAccountScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  vendorId: 'vendorId',
  balance: 'balance',
  currency: 'currency',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  availableBalance: 'availableBalance',
  holdUntil: 'holdUntil'
};

exports.Prisma.EscrowTransactionScalarFieldEnum = {
  id: 'id',
  escrowAccountId: 'escrowAccountId',
  orderId: 'orderId',
  amount: 'amount',
  type: 'type',
  status: 'status',
  description: 'description',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.OrderScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  vendorId: 'vendorId',
  totalAmount: 'totalAmount',
  currency: 'currency',
  status: 'status',
  paymentId: 'paymentId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PaymentScalarFieldEnum = {
  id: 'id',
  orderId: 'orderId',
  amount: 'amount',
  currency: 'currency',
  provider: 'provider',
  status: 'status',
  transactionId: 'transactionId',
  metadata: 'metadata',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.TransactionScalarFieldEnum = {
  id: 'id',
  type: 'type',
  amount: 'amount',
  currency: 'currency',
  status: 'status',
  description: 'description',
  referenceId: 'referenceId',
  userId: 'userId',
  metadata: 'metadata',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.OrderItemScalarFieldEnum = {
  id: 'id',
  orderId: 'orderId',
  productId: 'productId',
  quantity: 'quantity',
  price: 'price'
};

exports.Prisma.ConversationScalarFieldEnum = {
  id: 'id',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  customerId: 'customerId',
  vendorId: 'vendorId'
};

exports.Prisma.ConversationParticipantScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  conversationId: 'conversationId',
  createdAt: 'createdAt'
};

exports.Prisma.MessageScalarFieldEnum = {
  id: 'id',
  conversationId: 'conversationId',
  senderId: 'senderId',
  receiverId: 'receiverId',
  content: 'content',
  createdAt: 'createdAt',
  read: 'read',
  readAt: 'readAt',
  messageType: 'messageType',
  metadata: 'metadata'
};

exports.Prisma.DisputeScalarFieldEnum = {
  id: 'id',
  orderId: 'orderId',
  productId: 'productId',
  initiatorId: 'initiatorId',
  status: 'status',
  reason: 'reason',
  resolution: 'resolution',
  resolvedByAdmin: 'resolvedByAdmin',
  conversationId: 'conversationId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  buyerResponseDeadline: 'buyerResponseDeadline',
  disputeReason: 'disputeReason',
  evidenceFiles: 'evidenceFiles',
  refundAmount: 'refundAmount',
  refundProcessed: 'refundProcessed',
  sellerResponseDeadline: 'sellerResponseDeadline'
};

exports.Prisma.DisputeParticipantScalarFieldEnum = {
  id: 'id',
  disputeId: 'disputeId',
  userId: 'userId',
  role: 'role',
  createdAt: 'createdAt'
};

exports.Prisma.TagScalarFieldEnum = {
  id: 'id',
  name: 'name',
  slug: 'slug',
  isActive: 'isActive'
};

exports.Prisma.ProductTagScalarFieldEnum = {
  productId: 'productId',
  tagId: 'tagId',
  assignedAt: 'assignedAt',
  assignedBy: 'assignedBy'
};

exports.Prisma.PlatformSettingScalarFieldEnum = {
  id: 'id',
  platformFeePercent: 'platformFeePercent',
  cryptoPaymentEnabled: 'cryptoPaymentEnabled',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  disputePeriodDays: 'disputePeriodDays',
  escrowHoldDays: 'escrowHoldDays'
};

exports.Prisma.CryptoWalletScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  address: 'address',
  chain: 'chain',
  currency: 'currency',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CryptoPaymentScalarFieldEnum = {
  id: 'id',
  orderId: 'orderId',
  amount: 'amount',
  currency: 'currency',
  chain: 'chain',
  fromAddress: 'fromAddress',
  toAddress: 'toAddress',
  transactionHash: 'transactionHash',
  status: 'status',
  webhookReceivedAt: 'webhookReceivedAt',
  confirmedAt: 'confirmedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.DashboardStatScalarFieldEnum = {
  id: 'id',
  key: 'key',
  value: 'value',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.BannedUserScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  reason: 'reason',
  bannedBy: 'bannedBy',
  banStart: 'banStart',
  banEnd: 'banEnd',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.VendorApplicationScalarFieldEnum = {
  id: 'id',
  vendorId: 'vendorId',
  status: 'status',
  currentStep: 'currentStep',
  totalSteps: 'totalSteps',
  submittedAt: 'submittedAt',
  reviewedBy: 'reviewedBy',
  reviewedAt: 'reviewedAt',
  approvedAt: 'approvedAt',
  rejectedAt: 'rejectedAt',
  rejectionReason: 'rejectionReason',
  revisionRequested: 'revisionRequested',
  revisionRequestedAt: 'revisionRequestedAt',
  revisionRequestedBy: 'revisionRequestedBy',
  revisionReason: 'revisionReason',
  revisionCompletedAt: 'revisionCompletedAt',
  notes: 'notes',
  personaInquiryId: 'personaInquiryId',
  personaStatus: 'personaStatus',
  personaVerifiedAt: 'personaVerifiedAt',
  personaOverridden: 'personaOverridden',
  personaOverrideReason: 'personaOverrideReason',
  personaOverriddenBy: 'personaOverriddenBy',
  personaOverriddenAt: 'personaOverriddenAt',
  ipAddress: 'ipAddress',
  userAgent: 'userAgent',
  country: 'country',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  deletedAt: 'deletedAt'
};

exports.Prisma.ApplicationStepScalarFieldEnum = {
  id: 'id',
  applicationId: 'applicationId',
  stepNumber: 'stepNumber',
  stepName: 'stepName',
  stepSlug: 'stepSlug',
  status: 'status',
  data: 'data',
  files: 'files',
  completedAt: 'completedAt',
  revisionRequired: 'revisionRequired',
  revisionNotes: 'revisionNotes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ApplicationNoteScalarFieldEnum = {
  id: 'id',
  applicationId: 'applicationId',
  type: 'type',
  content: 'content',
  metadata: 'metadata',
  createdBy: 'createdBy',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ApplicationAuditLogScalarFieldEnum = {
  id: 'id',
  applicationId: 'applicationId',
  action: 'action',
  performedBy: 'performedBy',
  metadata: 'metadata',
  ipAddress: 'ipAddress',
  userAgent: 'userAgent',
  createdAt: 'createdAt'
};

exports.Prisma.PersonaVerificationScalarFieldEnum = {
  id: 'id',
  applicationId: 'applicationId',
  inquiryId: 'inquiryId',
  status: 'status',
  webhookData: 'webhookData',
  verificationUrl: 'verificationUrl',
  lastCheckedAt: 'lastCheckedAt',
  failureReason: 'failureReason',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.WithdrawalScalarFieldEnum = {
  id: 'id',
  vendorId: 'vendorId',
  amount: 'amount',
  currency: 'currency',
  status: 'status',
  method: 'method',
  details: 'details',
  processedBy: 'processedBy',
  processedAt: 'processedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.DigitalFileScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  url: 'url',
  size: 'size',
  mimeType: 'mimeType',
  productId: 'productId',
  uploadedBy: 'uploadedBy',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ReportScalarFieldEnum = {
  id: 'id',
  name: 'name',
  type: 'type',
  data: 'data',
  generatedBy: 'generatedBy',
  startDate: 'startDate',
  endDate: 'endDate',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SettingScalarFieldEnum = {
  id: 'id',
  key: 'key',
  value: 'value',
  type: 'type',
  description: 'description',
  group: 'group',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SeoSettingScalarFieldEnum = {
  id: 'id',
  page: 'page',
  title: 'title',
  description: 'description',
  keywords: 'keywords',
  author: 'author',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.Builder_pagesScalarFieldEnum = {
  id: 'id',
  slug: 'slug',
  title: 'title',
  description: 'description',
  content: 'content',
  status: 'status',
  version: 'version',
  published_at: 'published_at',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.Builder_page_versionsScalarFieldEnum = {
  id: 'id',
  page_id: 'page_id',
  content: 'content',
  version: 'version',
  created_at: 'created_at'
};

exports.Prisma.CmsPageScalarFieldEnum = {
  id: 'id',
  title: 'title',
  slug: 'slug',
  content: 'content',
  status: 'status',
  authorId: 'authorId',
  publishedAt: 'publishedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SupportTicketScalarFieldEnum = {
  id: 'id',
  subject: 'subject',
  description: 'description',
  userId: 'userId',
  status: 'status',
  priority: 'priority',
  assignedTo: 'assignedTo',
  category: 'category',
  closedAt: 'closedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  attachments: 'attachments',
  resolvedAt: 'resolvedAt',
  resolvedBy: 'resolvedBy',
  tags: 'tags'
};

exports.Prisma.SystemLogScalarFieldEnum = {
  id: 'id',
  level: 'level',
  message: 'message',
  metadata: 'metadata',
  timestamp: 'timestamp'
};

exports.Prisma.AnnouncementScalarFieldEnum = {
  id: 'id',
  title: 'title',
  content: 'content',
  status: 'status',
  priority: 'priority',
  startDate: 'startDate',
  endDate: 'endDate',
  createdBy: 'createdBy',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AdminAccountScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  permissions: 'permissions',
  lastLogin: 'lastLogin',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  isSuperAdmin: 'isSuperAdmin'
};

exports.Prisma.NavigationItemScalarFieldEnum = {
  id: 'id',
  label: 'label',
  url: 'url',
  order: 'order',
  isActive: 'isActive',
  isSection: 'isSection',
  parentId: 'parentId',
  icon: 'icon',
  description: 'description',
  image: 'image',
  isFeatured: 'isFeatured',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ContentScalarFieldEnum = {
  id: 'id',
  title: 'title',
  slug: 'slug',
  content: 'content',
  excerpt: 'excerpt',
  status: 'status',
  contentType: 'contentType',
  authorId: 'authorId',
  parentId: 'parentId',
  featuredImage: 'featuredImage',
  metaTitle: 'metaTitle',
  metaDescription: 'metaDescription',
  tags: 'tags',
  categories: 'categories',
  publishedAt: 'publishedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.DiscountScalarFieldEnum = {
  id: 'id',
  vendorId: 'vendorId',
  name: 'name',
  description: 'description',
  type: 'type',
  value: 'value',
  minPurchase: 'minPurchase',
  maxDiscount: 'maxDiscount',
  startDate: 'startDate',
  endDate: 'endDate',
  isActive: 'isActive',
  usageLimit: 'usageLimit',
  usageCount: 'usageCount',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CouponScalarFieldEnum = {
  id: 'id',
  vendorId: 'vendorId',
  code: 'code',
  description: 'description',
  type: 'type',
  value: 'value',
  minPurchase: 'minPurchase',
  maxDiscount: 'maxDiscount',
  startDate: 'startDate',
  endDate: 'endDate',
  isActive: 'isActive',
  usageLimit: 'usageLimit',
  usageCount: 'usageCount',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.RefundScalarFieldEnum = {
  id: 'id',
  orderId: 'orderId',
  orderItemId: 'orderItemId',
  amount: 'amount',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  notes: 'notes',
  processedBy: 'processedBy',
  reason: 'reason'
};

exports.Prisma.CouponUsageScalarFieldEnum = {
  id: 'id',
  couponId: 'couponId',
  userId: 'userId',
  orderId: 'orderId',
  usedAt: 'usedAt'
};

exports.Prisma.PromotionScalarFieldEnum = {
  id: 'id',
  vendorId: 'vendorId',
  name: 'name',
  description: 'description',
  type: 'type',
  conditions: 'conditions',
  rewards: 'rewards',
  startDate: 'startDate',
  endDate: 'endDate',
  isActive: 'isActive',
  priority: 'priority',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AffiliateScalarFieldEnum = {
  id: 'id',
  vendorId: 'vendorId',
  userId: 'userId',
  code: 'code',
  commissionRate: 'commissionRate',
  totalEarnings: 'totalEarnings',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AffiliateReferralScalarFieldEnum = {
  id: 'id',
  affiliateId: 'affiliateId',
  orderId: 'orderId',
  commission: 'commission',
  status: 'status',
  paidAt: 'paidAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.InvoiceScalarFieldEnum = {
  id: 'id',
  vendorId: 'vendorId',
  orderId: 'orderId',
  invoiceNumber: 'invoiceNumber',
  amount: 'amount',
  tax: 'tax',
  total: 'total',
  status: 'status',
  dueDate: 'dueDate',
  paidAt: 'paidAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ShippingSettingScalarFieldEnum = {
  id: 'id',
  vendorId: 'vendorId',
  freeShippingThreshold: 'freeShippingThreshold',
  flatRate: 'flatRate',
  zones: 'zones',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.TaxSettingScalarFieldEnum = {
  id: 'id',
  vendorId: 'vendorId',
  taxRate: 'taxRate',
  taxNumber: 'taxNumber',
  regions: 'regions',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.NotificationSettingScalarFieldEnum = {
  id: 'id',
  vendorId: 'vendorId',
  emailNotifications: 'emailNotifications',
  orderNotifications: 'orderNotifications',
  productNotifications: 'productNotifications',
  marketingNotifications: 'marketingNotifications',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.WishlistScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  productId: 'productId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ReviewScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  productId: 'productId',
  rating: 'rating',
  comment: 'comment',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.WalletScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  balance: 'balance',
  currency: 'currency',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  pendingBalance: 'pendingBalance'
};

exports.Prisma.WalletTransactionScalarFieldEnum = {
  id: 'id',
  walletId: 'walletId',
  amount: 'amount',
  type: 'type',
  status: 'status',
  reference: 'reference',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.GiftCardScalarFieldEnum = {
  id: 'id',
  code: 'code',
  amount: 'amount',
  currency: 'currency',
  balance: 'balance',
  status: 'status',
  expiresAt: 'expiresAt',
  createdById: 'createdById',
  vendorId: 'vendorId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.GiftCardRedemptionScalarFieldEnum = {
  id: 'id',
  giftCardId: 'giftCardId',
  userId: 'userId',
  amount: 'amount',
  createdAt: 'createdAt'
};

exports.Prisma.AddressScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  name: 'name',
  street: 'street',
  city: 'city',
  state: 'state',
  zip: 'zip',
  country: 'country',
  isDefault: 'isDefault',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CartScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CartItemScalarFieldEnum = {
  id: 'id',
  cartId: 'cartId',
  productId: 'productId',
  quantity: 'quantity',
  createdAt: 'createdAt'
};

exports.Prisma.ProductVersionScalarFieldEnum = {
  id: 'id',
  productId: 'productId',
  version: 'version',
  fileUrl: 'fileUrl',
  changelog: 'changelog',
  uploadedBy: 'uploadedBy',
  createdAt: 'createdAt'
};

exports.Prisma.NotificationScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  type: 'type',
  title: 'title',
  message: 'message',
  data: 'data',
  isRead: 'isRead',
  createdAt: 'createdAt'
};

exports.Prisma.AuditLogScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  action: 'action',
  entity: 'entity',
  entityId: 'entityId',
  changes: 'changes',
  ipAddress: 'ipAddress',
  userAgent: 'userAgent',
  createdAt: 'createdAt'
};

exports.Prisma.PaymentMethodScalarFieldEnum = {
  id: 'id',
  name: 'name',
  type: 'type',
  isActive: 'isActive',
  config: 'config',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ProductBadgeScalarFieldEnum = {
  id: 'id',
  productId: 'productId',
  badgeType: 'badgeType',
  assignedAt: 'assignedAt',
  assignedBy: 'assignedBy'
};

exports.Prisma.ThemeSettingScalarFieldEnum = {
  id: 'id',
  primaryColor: 'primaryColor',
  secondaryColor: 'secondaryColor',
  accentColor: 'accentColor',
  backgroundColor: 'backgroundColor',
  foregroundColor: 'foregroundColor',
  cardColor: 'cardColor',
  cardForegroundColor: 'cardForegroundColor',
  borderColor: 'borderColor',
  inputColor: 'inputColor',
  mutedColor: 'mutedColor',
  mutedForegroundColor: 'mutedForegroundColor',
  destructiveColor: 'destructiveColor',
  darkPrimaryColor: 'darkPrimaryColor',
  darkSecondaryColor: 'darkSecondaryColor',
  darkAccentColor: 'darkAccentColor',
  darkBackgroundColor: 'darkBackgroundColor',
  darkForegroundColor: 'darkForegroundColor',
  darkCardColor: 'darkCardColor',
  darkCardForegroundColor: 'darkCardForegroundColor',
  darkBorderColor: 'darkBorderColor',
  darkInputColor: 'darkInputColor',
  darkMutedColor: 'darkMutedColor',
  darkMutedForegroundColor: 'darkMutedForegroundColor',
  darkDestructiveColor: 'darkDestructiveColor',
  fontFamily: 'fontFamily',
  fontSize: 'fontSize',
  headingFontFamily: 'headingFontFamily',
  borderRadius: 'borderRadius',
  sidebarWidth: 'sidebarWidth',
  headerHeight: 'headerHeight',
  logoUrl: 'logoUrl',
  logoLightUrl: 'logoLightUrl',
  logoDarkUrl: 'logoDarkUrl',
  faviconUrl: 'faviconUrl',
  logoWidth: 'logoWidth',
  logoHeight: 'logoHeight',
  siteName: 'siteName',
  siteTagline: 'siteTagline',
  siteDescription: 'siteDescription',
  copyrightText: 'copyrightText',
  metaTitle: 'metaTitle',
  metaDescription: 'metaDescription',
  metaKeywords: 'metaKeywords',
  ogImage: 'ogImage',
  facebookUrl: 'facebookUrl',
  twitterUrl: 'twitterUrl',
  instagramUrl: 'instagramUrl',
  linkedinUrl: 'linkedinUrl',
  youtubeUrl: 'youtubeUrl',
  githubUrl: 'githubUrl',
  contactEmail: 'contactEmail',
  contactPhone: 'contactPhone',
  contactAddress: 'contactAddress',
  supportEmail: 'supportEmail',
  footerText: 'footerText',
  showSocialLinks: 'showSocialLinks',
  showContactInfo: 'showContactInfo',
  defaultMode: 'defaultMode',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SellerBadgeScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  icon: 'icon',
  color: 'color',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.VendorBadgeScalarFieldEnum = {
  id: 'id',
  vendorId: 'vendorId',
  badgeId: 'badgeId',
  assignedBy: 'assignedBy',
  assignedAt: 'assignedAt'
};

exports.Prisma.SoftwareToolScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  logoUrl: 'logoUrl',
  category: 'category',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.VendorSoftwareToolScalarFieldEnum = {
  id: 'id',
  vendorId: 'vendorId',
  softwareToolId: 'softwareToolId',
  addedAt: 'addedAt'
};

exports.Prisma.FollowScalarFieldEnum = {
  id: 'id',
  followerId: 'followerId',
  followingId: 'followingId',
  createdAt: 'createdAt'
};

exports.Prisma.SellerReviewScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  vendorId: 'vendorId',
  rating: 'rating',
  comment: 'comment',
  orderId: 'orderId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AIProcessingJobScalarFieldEnum = {
  id: 'id',
  productId: 'productId',
  jobType: 'jobType',
  status: 'status',
  progress: 'progress',
  result: 'result',
  error: 'error',
  startedAt: 'startedAt',
  completedAt: 'completedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ProductIssueScalarFieldEnum = {
  id: 'id',
  productId: 'productId',
  issueType: 'issueType',
  severity: 'severity',
  description: 'description',
  location: 'location',
  autoFixed: 'autoFixed',
  fixedAt: 'fixedAt',
  createdAt: 'createdAt'
};

exports.Prisma.JobOfferScalarFieldEnum = {
  id: 'id',
  conversationId: 'conversationId',
  vendorId: 'vendorId',
  customerId: 'customerId',
  title: 'title',
  description: 'description',
  budget: 'budget',
  currency: 'currency',
  status: 'status',
  acceptedAt: 'acceptedAt',
  completedAt: 'completedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.Api_settingsScalarFieldEnum = {
  id: 'id',
  provider: 'provider',
  settings: 'settings',
  isActive: 'isActive',
  lastUpdatedBy: 'lastUpdatedBy',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.LiveChatSessionScalarFieldEnum = {
  id: 'id',
  sessionId: 'sessionId',
  visitorId: 'visitorId',
  visitorName: 'visitorName',
  visitorEmail: 'visitorEmail',
  status: 'status',
  assignedTo: 'assignedTo',
  department: 'department',
  startedAt: 'startedAt',
  endedAt: 'endedAt',
  rating: 'rating',
  feedback: 'feedback',
  metadata: 'metadata',
  isAIHandled: 'isAIHandled',
  sentimentScore: 'sentimentScore',
  escalationReason: 'escalationReason',
  updatedAt: 'updatedAt'
};

exports.Prisma.LiveChatMessageScalarFieldEnum = {
  id: 'id',
  sessionId: 'sessionId',
  senderId: 'senderId',
  senderType: 'senderType',
  content: 'content',
  messageType: 'messageType',
  attachments: 'attachments',
  createdAt: 'createdAt',
  isRead: 'isRead',
  isAI: 'isAI',
  tokensUsed: 'tokensUsed'
};

exports.Prisma.LiveChatVisitorScalarFieldEnum = {
  id: 'id',
  fingerprint: 'fingerprint',
  name: 'name',
  email: 'email',
  phone: 'phone',
  country: 'country',
  city: 'city',
  userAgent: 'userAgent',
  ipAddress: 'ipAddress',
  firstVisit: 'firstVisit',
  lastVisit: 'lastVisit',
  pageViews: 'pageViews',
  totalChats: 'totalChats',
  isOnline: 'isOnline',
  currentPage: 'currentPage',
  metadata: 'metadata'
};

exports.Prisma.PageVisitHistoryScalarFieldEnum = {
  id: 'id',
  visitorId: 'visitorId',
  pageUrl: 'pageUrl',
  pageTitle: 'pageTitle',
  duration: 'duration',
  visitedAt: 'visitedAt'
};

exports.Prisma.CannedResponseScalarFieldEnum = {
  id: 'id',
  title: 'title',
  shortcut: 'shortcut',
  content: 'content',
  category: 'category',
  isActive: 'isActive',
  createdBy: 'createdBy',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.LiveChatSettingsScalarFieldEnum = {
  id: 'id',
  widgetColor: 'widgetColor',
  widgetPosition: 'widgetPosition',
  widgetIcon: 'widgetIcon',
  welcomeMessage: 'welcomeMessage',
  offlineMessage: 'offlineMessage',
  eyeCatcherEnabled: 'eyeCatcherEnabled',
  eyeCatcherText: 'eyeCatcherText',
  eyeCatcherDelay: 'eyeCatcherDelay',
  operatingHoursEnabled: 'operatingHoursEnabled',
  operatingHours: 'operatingHours',
  timezone: 'timezone',
  soundEnabled: 'soundEnabled',
  fileShareEnabled: 'fileShareEnabled',
  maxFileSize: 'maxFileSize',
  allowedFileTypes: 'allowedFileTypes',
  aiEnabled: 'aiEnabled',
  aiModel: 'aiModel',
  aiSystemPrompt: 'aiSystemPrompt',
  autoTranslateEnabled: 'autoTranslateEnabled',
  defaultLanguage: 'defaultLanguage',
  voiceEnabled: 'voiceEnabled',
  videoEnabled: 'videoEnabled',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.KnowledgeBaseArticleScalarFieldEnum = {
  id: 'id',
  title: 'title',
  content: 'content',
  category: 'category',
  tags: 'tags',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AIModelConfigScalarFieldEnum = {
  id: 'id',
  modelName: 'modelName',
  provider: 'provider',
  apiKey: 'apiKey',
  temperature: 'temperature',
  maxTokens: 'maxTokens',
  systemPrompt: 'systemPrompt',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ChatbotAnalyticsScalarFieldEnum = {
  id: 'id',
  date: 'date',
  totalSessions: 'totalSessions',
  aiHandled: 'aiHandled',
  escalated: 'escalated',
  avgResponseTime: 'avgResponseTime',
  sentimentScore: 'sentimentScore'
};

exports.Prisma.EmailCampaignScalarFieldEnum = {
  id: 'id',
  name: 'name',
  subject: 'subject',
  content: 'content',
  status: 'status',
  recipientType: 'recipientType',
  recipients: 'recipients',
  scheduledAt: 'scheduledAt',
  sentAt: 'sentAt',
  totalSent: 'totalSent',
  totalOpened: 'totalOpened',
  totalClicked: 'totalClicked',
  createdBy: 'createdBy',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SmtpSettingsScalarFieldEnum = {
  id: 'id',
  host: 'host',
  port: 'port',
  username: 'username',
  password: 'password',
  encryption: 'encryption',
  fromEmail: 'fromEmail',
  fromName: 'fromName',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SocialIntegrationScalarFieldEnum = {
  id: 'id',
  platform: 'platform',
  isEnabled: 'isEnabled',
  apiKey: 'apiKey',
  apiSecret: 'apiSecret',
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
  webhookUrl: 'webhookUrl',
  config: 'config',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SecuritySettingsScalarFieldEnum = {
  id: 'id',
  countryRestrictions: 'countryRestrictions',
  allowedCountries: 'allowedCountries',
  blockedCountries: 'blockedCountries',
  dosProtectionEnabled: 'dosProtectionEnabled',
  maxRequestsPerMinute: 'maxRequestsPerMinute',
  blockDuration: 'blockDuration',
  allowedDomains: 'allowedDomains',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AppScalarFieldEnum = {
  id: 'id',
  name: 'name',
  slug: 'slug',
  description: 'description',
  shortDescription: 'shortDescription',
  icon: 'icon',
  screenshots: 'screenshots',
  status: 'status',
  category: 'category',
  createdByAdmin: 'createdByAdmin',
  developerId: 'developerId',
  developerName: 'developerName',
  developerEmail: 'developerEmail',
  developerUrl: 'developerUrl',
  privacyPolicyUrl: 'privacyPolicyUrl',
  termsOfServiceUrl: 'termsOfServiceUrl',
  webhookSecret: 'webhookSecret',
  pricingType: 'pricingType',
  price: 'price',
  installCount: 'installCount',
  rating: 'rating',
  reviewCount: 'reviewCount',
  reviewedBy: 'reviewedBy',
  reviewedAt: 'reviewedAt',
  rejectionReason: 'rejectionReason',
  suspensionReason: 'suspensionReason',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AppPermissionScalarFieldEnum = {
  id: 'id',
  appId: 'appId',
  permission: 'permission',
  description: 'description',
  isRequired: 'isRequired'
};

exports.Prisma.MerchantAppInstallationScalarFieldEnum = {
  id: 'id',
  vendorId: 'vendorId',
  appId: 'appId',
  accessToken: 'accessToken',
  accessTokenPrefix: 'accessTokenPrefix',
  permissionsSnapshot: 'permissionsSnapshot',
  status: 'status',
  suspendedAt: 'suspendedAt',
  suspendedBy: 'suspendedBy',
  suspensionReason: 'suspensionReason',
  installedAt: 'installedAt',
  uninstalledAt: 'uninstalledAt',
  lastUsedAt: 'lastUsedAt'
};

exports.Prisma.AppWebhookScalarFieldEnum = {
  id: 'id',
  appId: 'appId',
  event: 'event',
  targetUrl: 'targetUrl',
  isActive: 'isActive',
  lastDeliveredAt: 'lastDeliveredAt',
  failureCount: 'failureCount',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AppActivityLogScalarFieldEnum = {
  id: 'id',
  vendorId: 'vendorId',
  appId: 'appId',
  installationId: 'installationId',
  action: 'action',
  endpoint: 'endpoint',
  method: 'method',
  statusCode: 'statusCode',
  metadata: 'metadata',
  ipAddress: 'ipAddress',
  userAgent: 'userAgent',
  createdAt: 'createdAt'
};

exports.Prisma.AppReviewScalarFieldEnum = {
  id: 'id',
  appId: 'appId',
  vendorId: 'vendorId',
  rating: 'rating',
  comment: 'comment',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.TicketMessageScalarFieldEnum = {
  id: 'id',
  ticketId: 'ticketId',
  userId: 'userId',
  content: 'content',
  attachments: 'attachments',
  isInternal: 'isInternal',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.MarketingCampaignScalarFieldEnum = {
  id: 'id',
  vendorId: 'vendorId',
  name: 'name',
  status: 'status',
  budget: 'budget',
  startDate: 'startDate',
  endDate: 'endDate',
  sessions: 'sessions',
  sales: 'sales',
  orders: 'orders',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.MarketingAutomationScalarFieldEnum = {
  id: 'id',
  vendorId: 'vendorId',
  name: 'name',
  type: 'type',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SegmentScalarFieldEnum = {
  id: 'id',
  vendorId: 'vendorId',
  name: 'name',
  query: 'query',
  description: 'description',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ShippingProfileScalarFieldEnum = {
  id: 'id',
  vendorId: 'vendorId',
  name: 'name',
  isGeneral: 'isGeneral',
  originAddress: 'originAddress',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ShippingZoneScalarFieldEnum = {
  id: 'id',
  profileId: 'profileId',
  name: 'name',
  countries: 'countries',
  regions: 'regions',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ShippingRateScalarFieldEnum = {
  id: 'id',
  zoneId: 'zoneId',
  name: 'name',
  type: 'type',
  price: 'price',
  currency: 'currency',
  minCondition: 'minCondition',
  maxCondition: 'maxCondition',
  carrierService: 'carrierService',
  minDeliveryDays: 'minDeliveryDays',
  maxDeliveryDays: 'maxDeliveryDays',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.LocalDeliverySettingScalarFieldEnum = {
  id: 'id',
  vendorId: 'vendorId',
  isEnabled: 'isEnabled',
  deliveryZoneType: 'deliveryZoneType',
  radiusValue: 'radiusValue',
  radiusUnit: 'radiusUnit',
  includeNeighboring: 'includeNeighboring',
  postalCodes: 'postalCodes',
  price: 'price',
  currency: 'currency',
  minOrderPrice: 'minOrderPrice',
  deliveryInfo: 'deliveryInfo',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PickupSettingScalarFieldEnum = {
  id: 'id',
  vendorId: 'vendorId',
  isEnabled: 'isEnabled',
  expectedPickupTime: 'expectedPickupTime',
  pickupInstructions: 'pickupInstructions',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SavedPackageScalarFieldEnum = {
  id: 'id',
  vendorId: 'vendorId',
  name: 'name',
  type: 'type',
  length: 'length',
  width: 'width',
  height: 'height',
  dimensionUnit: 'dimensionUnit',
  weight: 'weight',
  weightUnit: 'weightUnit',
  isDefault: 'isDefault',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.JsonNullValueInput = {
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};
exports.Role = exports.$Enums.Role = {
  ADMIN: 'ADMIN',
  VENDOR: 'VENDOR',
  CUSTOMER: 'CUSTOMER'
};

exports.AccountType = exports.$Enums.AccountType = {
  EMAIL: 'EMAIL',
  GOOGLE: 'GOOGLE',
  BOTH: 'BOTH'
};

exports.PaymentType = exports.$Enums.PaymentType = {
  STRIPE: 'STRIPE',
  PAYPAL: 'PAYPAL',
  BANK_TRANSFER: 'BANK_TRANSFER',
  CRYPTO: 'CRYPTO',
  LOCAL_GATEWAY: 'LOCAL_GATEWAY'
};

exports.ProductStatus = exports.$Enums.ProductStatus = {
  PENDING: 'PENDING',
  PUBLISHED: 'PUBLISHED',
  SUSPENDED: 'SUSPENDED',
  REJECTED: 'REJECTED',
  DRAFT: 'DRAFT'
};

exports.AIProcessingStatus = exports.$Enums.AIProcessingStatus = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED'
};

exports.EscrowTransactionType = exports.$Enums.EscrowTransactionType = {
  DEPOSIT: 'DEPOSIT',
  RELEASE: 'RELEASE',
  REFUND: 'REFUND',
  HOLD: 'HOLD',
  UNHOLD: 'UNHOLD',
  PLATFORM_FEE: 'PLATFORM_FEE'
};

exports.EscrowTransactionStatus = exports.$Enums.EscrowTransactionStatus = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED'
};

exports.OrderStatus = exports.$Enums.OrderStatus = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED'
};

exports.PaymentGateway = exports.$Enums.PaymentGateway = {
  STRIPE: 'STRIPE',
  PAYPAL: 'PAYPAL',
  CRYPTOMUS: 'CRYPTOMUS',
  BALANCE: 'BALANCE'
};

exports.PaymentStatus = exports.$Enums.PaymentStatus = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED'
};

exports.TransactionType = exports.$Enums.TransactionType = {
  PAYMENT_IN: 'PAYMENT_IN',
  PAYMENT_OUT: 'PAYMENT_OUT',
  COMMISSION_PLATFORM: 'COMMISSION_PLATFORM',
  COMMISSION_SELLER: 'COMMISSION_SELLER',
  REFUND: 'REFUND',
  ADJUSTMENT: 'ADJUSTMENT'
};

exports.TransactionStatus = exports.$Enums.TransactionStatus = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED'
};

exports.MessageType = exports.$Enums.MessageType = {
  USER: 'USER',
  SYSTEM: 'SYSTEM',
  JOB_OFFER: 'JOB_OFFER',
  DISPUTE_UPDATE: 'DISPUTE_UPDATE',
  ADMIN: 'ADMIN'
};

exports.DisputeStatus = exports.$Enums.DisputeStatus = {
  PENDING: 'PENDING',
  IN_REVIEW: 'IN_REVIEW',
  RESOLVED: 'RESOLVED',
  CANCELLED: 'CANCELLED'
};

exports.DisputeReason = exports.$Enums.DisputeReason = {
  FILE_CORRUPTED: 'FILE_CORRUPTED',
  NOT_AS_DESCRIBED: 'NOT_AS_DESCRIBED',
  WRONG_DESCRIPTION: 'WRONG_DESCRIPTION',
  LICENSE_ISSUE: 'LICENSE_ISSUE',
  SELLER_UNRESPONSIVE: 'SELLER_UNRESPONSIVE',
  OTHER: 'OTHER'
};

exports.DisputeRole = exports.$Enums.DisputeRole = {
  BUYER: 'BUYER',
  SELLER: 'SELLER',
  ADMIN: 'ADMIN'
};

exports.CryptoPaymentStatus = exports.$Enums.CryptoPaymentStatus = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  FAILED: 'FAILED'
};

exports.VendorApplicationStatus = exports.$Enums.VendorApplicationStatus = {
  PENDING: 'PENDING',
  UNDER_REVIEW: 'UNDER_REVIEW',
  NEEDS_REVISION: 'NEEDS_REVISION',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  CLOSED: 'CLOSED'
};

exports.PersonaStatus = exports.$Enums.PersonaStatus = {
  NOT_STARTED: 'NOT_STARTED',
  PENDING: 'PENDING',
  UNDER_REVIEW: 'UNDER_REVIEW',
  VERIFIED: 'VERIFIED',
  FAILED: 'FAILED',
  OVERRIDDEN: 'OVERRIDDEN'
};

exports.StepStatus = exports.$Enums.StepStatus = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  NEEDS_REVISION: 'NEEDS_REVISION',
  SKIPPED: 'SKIPPED'
};

exports.NoteType = exports.$Enums.NoteType = {
  ADMIN_INTERNAL: 'ADMIN_INTERNAL',
  USER_FACING: 'USER_FACING',
  SYSTEM: 'SYSTEM'
};

exports.AuditAction = exports.$Enums.AuditAction = {
  CREATED: 'CREATED',
  SUBMITTED: 'SUBMITTED',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  REVISION_REQUESTED: 'REVISION_REQUESTED',
  REVISION_COMPLETED: 'REVISION_COMPLETED',
  REOPENED: 'REOPENED',
  CLOSED: 'CLOSED',
  PERSONA_INITIATED: 'PERSONA_INITIATED',
  PERSONA_COMPLETED: 'PERSONA_COMPLETED',
  PERSONA_FAILED: 'PERSONA_FAILED',
  PERSONA_OVERRIDDEN: 'PERSONA_OVERRIDDEN',
  STEP_COMPLETED: 'STEP_COMPLETED',
  STEP_REVISION_REQUESTED: 'STEP_REVISION_REQUESTED',
  NOTE_ADDED: 'NOTE_ADDED',
  STATUS_CHANGED: 'STATUS_CHANGED'
};

exports.WithdrawalStatus = exports.$Enums.WithdrawalStatus = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED'
};

exports.FileStatus = exports.$Enums.FileStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  DELETED: 'DELETED'
};

exports.PageStatus = exports.$Enums.PageStatus = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  ARCHIVED: 'ARCHIVED'
};

exports.TicketStatus = exports.$Enums.TicketStatus = {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  RESOLVED: 'RESOLVED',
  CLOSED: 'CLOSED'
};

exports.TicketPriority = exports.$Enums.TicketPriority = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT'
};

exports.AnnouncementStatus = exports.$Enums.AnnouncementStatus = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  ARCHIVED: 'ARCHIVED'
};

exports.ContentStatus = exports.$Enums.ContentStatus = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  ARCHIVED: 'ARCHIVED'
};

exports.DiscountType = exports.$Enums.DiscountType = {
  PERCENTAGE: 'PERCENTAGE',
  FIXED_AMOUNT: 'FIXED_AMOUNT'
};

exports.CouponType = exports.$Enums.CouponType = {
  PERCENTAGE: 'PERCENTAGE',
  FIXED_AMOUNT: 'FIXED_AMOUNT',
  FREE_SHIPPING: 'FREE_SHIPPING'
};

exports.RefundStatus = exports.$Enums.RefundStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  COMPLETED: 'COMPLETED'
};

exports.RefundReason = exports.$Enums.RefundReason = {
  DEFECTIVE_PRODUCT: 'DEFECTIVE_PRODUCT',
  NOT_AS_DESCRIBED: 'NOT_AS_DESCRIBED',
  CHANGED_MIND: 'CHANGED_MIND',
  DUPLICATE_ORDER: 'DUPLICATE_ORDER',
  OTHER: 'OTHER'
};

exports.PromotionType = exports.$Enums.PromotionType = {
  BUY_X_GET_Y: 'BUY_X_GET_Y',
  BUNDLE: 'BUNDLE',
  FLASH_SALE: 'FLASH_SALE',
  SEASONAL: 'SEASONAL'
};

exports.AffiliateStatus = exports.$Enums.AffiliateStatus = {
  PENDING: 'PENDING',
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED',
  TERMINATED: 'TERMINATED'
};

exports.ReferralStatus = exports.$Enums.ReferralStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  PAID: 'PAID',
  CANCELLED: 'CANCELLED'
};

exports.InvoiceStatus = exports.$Enums.InvoiceStatus = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  OVERDUE: 'OVERDUE',
  CANCELLED: 'CANCELLED'
};

exports.WalletTransactionType = exports.$Enums.WalletTransactionType = {
  DEPOSIT: 'DEPOSIT',
  WITHDRAWAL: 'WITHDRAWAL',
  PURCHASE: 'PURCHASE',
  REFUND: 'REFUND',
  GIFT_CARD_REDEMPTION: 'GIFT_CARD_REDEMPTION',
  CREDIT_ADJUSTMENT: 'CREDIT_ADJUSTMENT'
};

exports.WalletTransactionStatus = exports.$Enums.WalletTransactionStatus = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED'
};

exports.GiftCardStatus = exports.$Enums.GiftCardStatus = {
  ACTIVE: 'ACTIVE',
  REDEEMED: 'REDEEMED',
  EXPIRED: 'EXPIRED',
  VOIDED: 'VOIDED'
};

exports.NotificationType = exports.$Enums.NotificationType = {
  NEW_SALE: 'NEW_SALE',
  DISPUTE_OPENED: 'DISPUTE_OPENED',
  DISPUTE_RESPONSE: 'DISPUTE_RESPONSE',
  DISPUTE_RESOLVED: 'DISPUTE_RESOLVED',
  PAYOUT_REQUESTED: 'PAYOUT_REQUESTED',
  PAYOUT_PROCESSED: 'PAYOUT_PROCESSED',
  REVIEW_RECEIVED: 'REVIEW_RECEIVED',
  PRODUCT_APPROVED: 'PRODUCT_APPROVED',
  PRODUCT_REJECTED: 'PRODUCT_REJECTED',
  ORDER_COMPLETED: 'ORDER_COMPLETED',
  APPLICATION_SUBMITTED: 'APPLICATION_SUBMITTED',
  APPLICATION_APPROVED: 'APPLICATION_APPROVED',
  APPLICATION_REJECTED: 'APPLICATION_REJECTED',
  APPLICATION_REVISION_REQUESTED: 'APPLICATION_REVISION_REQUESTED'
};

exports.BadgeType = exports.$Enums.BadgeType = {
  GAME_READY: 'GAME_READY',
  PBR_CERTIFIED: 'PBR_CERTIFIED',
  PRINT_READY: 'PRINT_READY',
  QUALITY_VERIFIED: 'QUALITY_VERIFIED',
  LOW_POLY: 'LOW_POLY',
  HIGH_DETAIL: 'HIGH_DETAIL',
  ANIMATION_READY: 'ANIMATION_READY',
  VR_OPTIMIZED: 'VR_OPTIMIZED'
};

exports.AIJobType = exports.$Enums.AIJobType = {
  THUMBNAIL_GENERATION: 'THUMBNAIL_GENERATION',
  TOPOLOGY_OPTIMIZATION: 'TOPOLOGY_OPTIMIZATION',
  TAG_SUGGESTION: 'TAG_SUGGESTION',
  ISSUE_DETECTION: 'ISSUE_DETECTION',
  LOD_GENERATION: 'LOD_GENERATION',
  UV_OPTIMIZATION: 'UV_OPTIMIZATION'
};

exports.IssueType = exports.$Enums.IssueType = {
  NON_MANIFOLD_GEOMETRY: 'NON_MANIFOLD_GEOMETRY',
  OVERLAPPING_FACES: 'OVERLAPPING_FACES',
  FLIPPED_NORMALS: 'FLIPPED_NORMALS',
  MISSING_UVS: 'MISSING_UVS',
  UV_OVERLAP: 'UV_OVERLAP',
  ZERO_AREA_FACES: 'ZERO_AREA_FACES',
  DUPLICATE_VERTICES: 'DUPLICATE_VERTICES',
  ISOLATED_VERTICES: 'ISOLATED_VERTICES'
};

exports.IssueSeverity = exports.$Enums.IssueSeverity = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL'
};

exports.JobOfferStatus = exports.$Enums.JobOfferStatus = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
};

exports.ChatSessionStatus = exports.$Enums.ChatSessionStatus = {
  WAITING: 'WAITING',
  ACTIVE: 'ACTIVE',
  CLOSED: 'CLOSED',
  MISSED: 'MISSED'
};

exports.ChatSenderType = exports.$Enums.ChatSenderType = {
  VISITOR: 'VISITOR',
  AGENT: 'AGENT',
  BOT: 'BOT',
  SYSTEM: 'SYSTEM'
};

exports.ChatMessageType = exports.$Enums.ChatMessageType = {
  TEXT: 'TEXT',
  IMAGE: 'IMAGE',
  FILE: 'FILE',
  VOICE: 'VOICE',
  VIDEO: 'VIDEO',
  SYSTEM: 'SYSTEM'
};

exports.EmailCampaignStatus = exports.$Enums.EmailCampaignStatus = {
  DRAFT: 'DRAFT',
  SCHEDULED: 'SCHEDULED',
  SENDING: 'SENDING',
  SENT: 'SENT',
  CANCELLED: 'CANCELLED'
};

exports.AppStatus = exports.$Enums.AppStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  SUSPENDED: 'SUSPENDED',
  REJECTED: 'REJECTED'
};

exports.InstallationStatus = exports.$Enums.InstallationStatus = {
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED',
  UNINSTALLED: 'UNINSTALLED'
};

exports.CampaignStatus = exports.$Enums.CampaignStatus = {
  DRAFT: 'DRAFT',
  ACTIVE: 'ACTIVE',
  PAUSED: 'PAUSED',
  COMPLETED: 'COMPLETED'
};

exports.AutomationType = exports.$Enums.AutomationType = {
  ABANDONED_CART: 'ABANDONED_CART',
  ABANDONED_CHECKOUT: 'ABANDONED_CHECKOUT',
  WELCOME_SERIES: 'WELCOME_SERIES',
  POST_PURCHASE: 'POST_PURCHASE'
};

exports.AutomationStatus = exports.$Enums.AutomationStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE'
};

exports.Prisma.ModelName = {
  User: 'User',
  Vendor: 'Vendor',
  VendorPayoutMethod: 'VendorPayoutMethod',
  Collection: 'Collection',
  Category: 'Category',
  Product: 'Product',
  FeaturedCollection: 'FeaturedCollection',
  EscrowAccount: 'EscrowAccount',
  EscrowTransaction: 'EscrowTransaction',
  Order: 'Order',
  Payment: 'Payment',
  Transaction: 'Transaction',
  OrderItem: 'OrderItem',
  Conversation: 'Conversation',
  ConversationParticipant: 'ConversationParticipant',
  Message: 'Message',
  Dispute: 'Dispute',
  DisputeParticipant: 'DisputeParticipant',
  Tag: 'Tag',
  ProductTag: 'ProductTag',
  PlatformSetting: 'PlatformSetting',
  CryptoWallet: 'CryptoWallet',
  CryptoPayment: 'CryptoPayment',
  DashboardStat: 'DashboardStat',
  BannedUser: 'BannedUser',
  VendorApplication: 'VendorApplication',
  ApplicationStep: 'ApplicationStep',
  ApplicationNote: 'ApplicationNote',
  ApplicationAuditLog: 'ApplicationAuditLog',
  PersonaVerification: 'PersonaVerification',
  Withdrawal: 'Withdrawal',
  DigitalFile: 'DigitalFile',
  Report: 'Report',
  Setting: 'Setting',
  SeoSetting: 'SeoSetting',
  builder_pages: 'builder_pages',
  builder_page_versions: 'builder_page_versions',
  CmsPage: 'CmsPage',
  SupportTicket: 'SupportTicket',
  SystemLog: 'SystemLog',
  Announcement: 'Announcement',
  AdminAccount: 'AdminAccount',
  NavigationItem: 'NavigationItem',
  Content: 'Content',
  Discount: 'Discount',
  Coupon: 'Coupon',
  Refund: 'Refund',
  CouponUsage: 'CouponUsage',
  Promotion: 'Promotion',
  Affiliate: 'Affiliate',
  AffiliateReferral: 'AffiliateReferral',
  Invoice: 'Invoice',
  ShippingSetting: 'ShippingSetting',
  TaxSetting: 'TaxSetting',
  NotificationSetting: 'NotificationSetting',
  Wishlist: 'Wishlist',
  Review: 'Review',
  Wallet: 'Wallet',
  WalletTransaction: 'WalletTransaction',
  GiftCard: 'GiftCard',
  GiftCardRedemption: 'GiftCardRedemption',
  Address: 'Address',
  Cart: 'Cart',
  CartItem: 'CartItem',
  ProductVersion: 'ProductVersion',
  Notification: 'Notification',
  AuditLog: 'AuditLog',
  PaymentMethod: 'PaymentMethod',
  ProductBadge: 'ProductBadge',
  ThemeSetting: 'ThemeSetting',
  SellerBadge: 'SellerBadge',
  VendorBadge: 'VendorBadge',
  SoftwareTool: 'SoftwareTool',
  VendorSoftwareTool: 'VendorSoftwareTool',
  Follow: 'Follow',
  SellerReview: 'SellerReview',
  AIProcessingJob: 'AIProcessingJob',
  ProductIssue: 'ProductIssue',
  JobOffer: 'JobOffer',
  api_settings: 'api_settings',
  LiveChatSession: 'LiveChatSession',
  LiveChatMessage: 'LiveChatMessage',
  LiveChatVisitor: 'LiveChatVisitor',
  PageVisitHistory: 'PageVisitHistory',
  CannedResponse: 'CannedResponse',
  LiveChatSettings: 'LiveChatSettings',
  KnowledgeBaseArticle: 'KnowledgeBaseArticle',
  AIModelConfig: 'AIModelConfig',
  ChatbotAnalytics: 'ChatbotAnalytics',
  EmailCampaign: 'EmailCampaign',
  SmtpSettings: 'SmtpSettings',
  SocialIntegration: 'SocialIntegration',
  SecuritySettings: 'SecuritySettings',
  App: 'App',
  AppPermission: 'AppPermission',
  MerchantAppInstallation: 'MerchantAppInstallation',
  AppWebhook: 'AppWebhook',
  AppActivityLog: 'AppActivityLog',
  AppReview: 'AppReview',
  TicketMessage: 'TicketMessage',
  MarketingCampaign: 'MarketingCampaign',
  MarketingAutomation: 'MarketingAutomation',
  Segment: 'Segment',
  ShippingProfile: 'ShippingProfile',
  ShippingZone: 'ShippingZone',
  ShippingRate: 'ShippingRate',
  LocalDeliverySetting: 'LocalDeliverySetting',
  PickupSetting: 'PickupSetting',
  SavedPackage: 'SavedPackage'
};
/**
 * Create the Client
 */
const config = {
  "generator": {
    "name": "client",
    "provider": {
      "fromEnvVar": null,
      "value": "prisma-client-js"
    },
    "output": {
      "value": "C:\\Users\\Hossame\\Desktop\\Dig\\packages\\database\\src\\generated\\client",
      "fromEnvVar": null
    },
    "config": {
      "engineType": "library"
    },
    "binaryTargets": [
      {
        "fromEnvVar": null,
        "value": "windows",
        "native": true
      }
    ],
    "previewFeatures": [
      "driverAdapters"
    ],
    "isCustomOutput": true
  },
  "relativeEnvPaths": {
    "rootEnvPath": null,
    "schemaEnvPath": "../../../.env"
  },
  "relativePath": "../../../prisma",
  "clientVersion": "5.10.2",
  "engineVersion": "5a9203d0590c951969e85a7d07215503f4672eb9",
  "datasourceNames": [
    "db"
  ],
  "activeProvider": "postgresql",
  "postinstall": false,
  "inlineDatasources": {
    "db": {
      "url": {
        "fromEnvVar": "DATABASE_URL",
        "value": null
      }
    }
  },
  "inlineSchema": "generator client {\r\n  provider = \"prisma-client-js\"\r\n  output   = \"../src/generated/client\"\r\n  previewFeatures = [\"driverAdapters\"]\r\n}\r\n\r\ndatasource db {\r\n  provider = \"postgresql\"\r\n  url      = env(\"DATABASE_URL\")\r\n}\r\n\r\nmodel User {\r\n  id                                                String                    @id @default(cuid())\r\n  email                                             String                    @unique\r\n  name                                              String?\r\n  role                                              Role                      @default(CUSTOMER)\r\n  createdAt                                         DateTime                  @default(now())\r\n  updatedAt                                         DateTime                  @updatedAt\r\n  password                                          String?\r\n  rememberToken                                     String?\r\n  image                                             String?\r\n  accountType                                       AccountType               @default(EMAIL)\r\n  softwarePreferences                               Json?\r\n  twoFactorEnabled                                  Boolean                   @default(false)\r\n  twoFactorSecret                                   String?\r\n  addresses                                         Address[]\r\n  adminAccount                                      AdminAccount?\r\n  affiliates                                        Affiliate[]               @relation(\"UserAffiliates\")\r\n  announcements                                     Announcement[]\r\n  auditLogs                                         AuditLog[]\r\n  bannedByEntries                                   BannedUser[]              @relation(\"BannedByUsers\")\r\n  bannedUsers                                       BannedUser?\r\n  cart                                              Cart?\r\n  cmsPages                                          CmsPage[]\r\n  content                                           Content[]\r\n  conversations                                     ConversationParticipant[]\r\n  customerConversations                             Conversation[]            @relation(\"CustomerConversations\")\r\n  couponUsages                                      CouponUsage[]             @relation(\"CouponUsers\")\r\n  cryptoWallets                                     CryptoWallet[]\r\n  uploadedFiles                                     DigitalFile[]             @relation(\"DigitalFileUploaders\")\r\n  disputeParticipants                               DisputeParticipant[]\r\n  disputesInitiated                                 Dispute[]                 @relation(\"UserDisputes\")\r\n  escrowAccounts                                    EscrowAccount[]\r\n  following                                         Follow[]                  @relation(\"UserFollowing\")\r\n  jobOffersAsCustomer                               JobOffer[]                @relation(\"CustomerJobOffers\")\r\n  receivedMessages                                  Message[]                 @relation(\"ReceivedMessages\")\r\n  sentMessages                                      Message[]                 @relation(\"SentMessages\")\r\n  notifications                                     Notification[]\r\n  orders                                            Order[]                   @relation(\"UserOrders\")\r\n  productVersions                                   ProductVersion[]          @relation(\"ProductVersionUploaders\")\r\n  generatedReports                                  Report[]                  @relation(\"ReportGenerators\")\r\n  reviews                                           Review[]\r\n  sellerReviews                                     SellerReview[]            @relation(\"UserSellerReviews\")\r\n\r\n  transactions                                      Transaction[]\r\n\r\n  vendorApplicationReviews                          VendorApplication[]       @relation(\"VendorApplicationReviewers\")\r\n  vendorApplicationRevisionRequests                 VendorApplication[]       @relation(\"VendorApplicationRevisionRequesters\")\r\n  vendorApplicationPersonaOverrides                 VendorApplication[]       @relation(\"VendorApplicationPersonaOverriders\")\r\n  applicationNotes                                  ApplicationNote[]         @relation(\"ApplicationNoteAuthors\")\r\n  applicationAuditLogs                              ApplicationAuditLog[]     @relation(\"AuditLogPerformers\")\r\n  vendors                                           Vendor?                   @relation(\"UserVendors\")\r\n  wallet                                            Wallet?\r\n  wishlist                                          Wishlist[]\r\n  processedWithdrawals                              Withdrawal[]              @relation(\"WithdrawalProcessors\")\r\n  giftCardRedemptions                               GiftCardRedemption[]\r\n  canHandleLiveChat                                 Boolean                   @default(false)\r\n  assignedLiveChatSessions                          LiveChatSession[]         @relation(\"LiveChatAssignee\")\r\n  developedApps                                     App[]                     @relation(\"AppDeveloper\")\r\n  supportTickets                                    SupportTicket[]\r\n  supportTicketsAssigned                            SupportTicket[]           @relation(\"SupportTicketAssignees\")\r\n  supportTicketsResolved                            SupportTicket[]           @relation(\"support_tickets_resolvedByTousers\")\r\n  ticketMessages                                    TicketMessage[]\r\n\r\n  @@index([role])\r\n  @@index([createdAt])\r\n  @@index([role, createdAt])\r\n  @@map(\"users\")\r\n}\r\n\r\nmodel Vendor {\r\n  id                  String               @id @default(cuid())\r\n  name                String\r\n  description         String?\r\n  userId              String               @unique\r\n  createdAt           DateTime             @default(now())\r\n  updatedAt           DateTime             @updatedAt\r\n  avatar              String?\r\n  averageRating       Float                @default(0)\r\n  bio                 String?\r\n  coverImage          String?\r\n  featuredLayout      String?              @default(\"grid\")\r\n  location            String?\r\n  socialLinks         Json?\r\n  specializations     Json?\r\n  themeColor          String?              @default(\"#000000\")\r\n  totalFollowers      Int                  @default(0)\r\n  totalReviews        Int                  @default(0)\r\n  isVerified          Boolean              @default(false)\r\n  totalSales          Int                  @default(0)\r\n  affiliates          Affiliate[]\r\n  conversations       Conversation[]       @relation(\"VendorConversations\")\r\n  coupons             Coupon[]\r\n  discounts           Discount[]\r\n  escrowAccount       EscrowAccount?\r\n  followers           Follow[]             @relation(\"VendorFollowers\")\r\n  invoices            Invoice[]\r\n  jobOffersAsVendor   JobOffer[]           @relation(\"VendorJobOffers\")\r\n  notificationSetting NotificationSetting?\r\n  orders              Order[]              @relation(\"VendorOrders\")\r\n  products            Product[]\r\n  promotions          Promotion[]\r\n  sellerReviews       SellerReview[]\r\n  shippingSetting     ShippingSetting?\r\n  taxSetting          TaxSetting?\r\n  vendorApplication   VendorApplication?\r\n  badges              VendorBadge[]\r\n  payoutMethods       VendorPayoutMethod[] @relation(\"VendorPayoutMethods\")\r\n  softwareTools       VendorSoftwareTool[]\r\n  user                User                 @relation(\"UserVendors\", fields: [userId], references: [id])\r\n  withdrawals         Withdrawal[]\r\n  giftCards           GiftCard[]\r\n  appInstallations    MerchantAppInstallation[]\r\n  appReviews          AppReview[]\r\n  marketingCampaigns  MarketingCampaign[]\r\n  marketingAutomations MarketingAutomation[]\r\n  shippingProfiles    ShippingProfile[]\r\n  localDeliverySettings LocalDeliverySetting?\r\n  pickupSettings      PickupSetting?\r\n  savedPackages       SavedPackage[]\r\n  segments            Segment[]\r\n\r\n  @@index([userId])\r\n  @@index([createdAt])\r\n  @@index([averageRating])\r\n  @@map(\"vendors\")\r\n}\r\n\r\n\r\nmodel VendorPayoutMethod {\r\n  id        String      @id @default(cuid())\r\n  vendorId  String\r\n  type      PaymentType\r\n  label     String\r\n  details   Json\r\n  isDefault Boolean     @default(false)\r\n  isActive  Boolean     @default(true)\r\n  createdAt DateTime    @default(now())\r\n  updatedAt DateTime    @updatedAt\r\n  vendor    Vendor      @relation(\"VendorPayoutMethods\", fields: [vendorId], references: [id], onDelete: Cascade)\r\n\r\n  @@index([vendorId])\r\n  @@index([vendorId, isDefault])\r\n  @@map(\"vendor_payout_methods\")\r\n}\r\n\r\nmodel Collection {\r\n  id          String     @id @default(cuid())\r\n  name        String     @unique\r\n  slug        String     @unique\r\n  description String?\r\n  icon        String?\r\n  image       String?\r\n  order       Int        @default(0)\r\n  isActive    Boolean    @default(true)\r\n  createdAt   DateTime   @default(now())\r\n  updatedAt   DateTime   @updatedAt\r\n  categories  Category[]\r\n\r\n  @@index([isActive])\r\n  @@index([order])\r\n  @@map(\"collections\")\r\n}\r\n\r\nmodel Category {\r\n  id           String      @id @default(cuid())\r\n  name         String      @unique\r\n  slug         String      @unique\r\n  isActive     Boolean     @default(true)\r\n  parentId     String?\r\n  collectionId String?\r\n  description  String?\r\n  collection   Collection? @relation(fields: [collectionId], references: [id])\r\n  parent       Category?   @relation(\"CategoryRelation\", fields: [parentId], references: [id])\r\n  children     Category[]  @relation(\"CategoryRelation\")\r\n  products     Product[]\r\n\r\n  @@index([isActive])\r\n  @@index([parentId])\r\n  @@index([collectionId])\r\n  @@map(\"categories\")\r\n}\r\n\r\nmodel Product {\r\n  id                    String              @id @default(cuid())\r\n  name                  String\r\n  description           String\r\n  price                 Float\r\n  currency              String              @default(\"USD\")\r\n  categoryId            String\r\n  vendorId              String\r\n  fileUrl               String\r\n  thumbnail             String?\r\n  isActive              Boolean             @default(true)\r\n  status                ProductStatus       @default(PENDING)\r\n  createdAt             DateTime            @default(now())\r\n  updatedAt             DateTime            @updatedAt\r\n  assetDetails          String?\r\n  includedResolution    String?\r\n  availableResolutions  String?\r\n  height                Float?\r\n  width                 Float?\r\n  depth                 Float?\r\n  meshCount             Int?\r\n  textureFiles          Json?\r\n  nativeFileFormats     Json?\r\n  universalFileFormats  Json?\r\n  addonSupport          Json?\r\n  licenseInfo           Json?\r\n  currentVersion        String?             @default(\"1.0.0\")\r\n  images                Json?\r\n  isDraft               Boolean             @default(false)\r\n  reviewNotes           String?\r\n  downloads             Int                 @default(0)\r\n  likes                 Int                 @default(0)\r\n  views                 Int                 @default(0)\r\n  geometryType          String?\r\n  hasLOD                Boolean             @default(false)\r\n  isAnimated            Boolean             @default(false)\r\n  isRigged              Boolean             @default(false)\r\n  lodLevels             Int?\r\n  materialType          String?\r\n  polygonCount          Int?\r\n  renderEngine          String?\r\n  softwareCompatibility Json?\r\n  verticesCount         Int?\r\n  aiIssuesDetected      Json?\r\n  aiLodGenerated        Boolean             @default(false)\r\n  aiProcessedAt         DateTime?\r\n  aiProcessingStatus    AIProcessingStatus? @default(PENDING)\r\n  aiTagsSuggested       Json?\r\n  aiThumbnailGenerated  Boolean             @default(false)\r\n  aiTopologyScore       Float?\r\n  aiUvQualityScore      Float?\r\n  aiProcessingJobs      AIProcessingJob[]\r\n  cartItems             CartItem[]\r\n  digitalFiles          DigitalFile[]\r\n  disputes              Dispute[]\r\n  orders                OrderItem[]\r\n  badges                ProductBadge[]\r\n  productIssues         ProductIssue[]\r\n  productTags           ProductTag[]\r\n  versions              ProductVersion[]\r\n  category              Category            @relation(fields: [categoryId], references: [id])\r\n  vendor                Vendor              @relation(fields: [vendorId], references: [id])\r\n  reviews               Review[]\r\n  wishlistedBy          Wishlist[]\r\n  tags                  Tag[]               @relation(\"ProductTags\")\r\n  shippingProfileId     String?\r\n  shippingProfile       ShippingProfile?    @relation(fields: [shippingProfileId], references: [id])\r\n\r\n  // Dynamic Collections Relation\r\n  featuredCollections  FeaturedCollection[] @relation(\"ProductFeaturedCollections\")\r\n\r\n  @@index([status])\r\n  @@index([categoryId])\r\n  @@index([vendorId])\r\n  @@index([createdAt])\r\n  @@index([isActive])\r\n  @@index([status, categoryId])\r\n  @@index([status, vendorId])\r\n  @@index([isRigged])\r\n  @@index([isAnimated])\r\n  @@index([aiProcessingStatus])\r\n  @@map(\"products\")\r\n}\r\n\r\nmodel FeaturedCollection {\r\n  id          String    @id @default(cuid())\r\n  title       String\r\n  identifier  String    @unique // e.g., \"holiday-finds\", \"picks-inspired\"\r\n  description String?\r\n  isActive    Boolean   @default(true)\r\n  createdAt   DateTime  @default(now())\r\n  updatedAt   DateTime  @updatedAt\r\n  products    Product[] @relation(\"ProductFeaturedCollections\")\r\n\r\n  @@map(\"featured_collections\")\r\n}\r\n\r\nmodel EscrowAccount {\r\n  id               String              @id @default(cuid())\r\n  userId           String?\r\n  vendorId         String?             @unique\r\n  balance          Float               @default(0)\r\n  currency         String              @default(\"USD\")\r\n  createdAt        DateTime            @default(now())\r\n  updatedAt        DateTime            @updatedAt\r\n  availableBalance Float               @default(0)\r\n  holdUntil        DateTime?\r\n  user             User?               @relation(fields: [userId], references: [id])\r\n  vendor           Vendor?             @relation(fields: [vendorId], references: [id])\r\n  transactions     EscrowTransaction[]\r\n\r\n  @@unique([userId, vendorId])\r\n  @@index([userId])\r\n  @@index([vendorId])\r\n  @@map(\"escrow_accounts\")\r\n}\r\n\r\nmodel EscrowTransaction {\r\n  id              String                  @id @default(cuid())\r\n  escrowAccountId String\r\n  orderId         String?                 @unique\r\n  amount          Float\r\n  type            EscrowTransactionType\r\n  status          EscrowTransactionStatus\r\n  description     String?\r\n  createdAt       DateTime                @default(now())\r\n  updatedAt       DateTime                @updatedAt\r\n  escrowAccount   EscrowAccount           @relation(fields: [escrowAccountId], references: [id])\r\n  order           Order?                  @relation(fields: [orderId], references: [id])\r\n\r\n  @@index([escrowAccountId])\r\n  @@index([status])\r\n  @@index([createdAt])\r\n  @@map(\"escrow_transactions\")\r\n}\r\n\r\nmodel Order {\r\n  id                String             @id @default(cuid())\r\n  userId            String\r\n  vendorId          String\r\n  totalAmount       Float\r\n  currency          String             @default(\"USD\")\r\n  status            OrderStatus        @default(PENDING)\r\n  paymentId         String?\r\n  createdAt         DateTime           @default(now())\r\n  updatedAt         DateTime           @updatedAt\r\n  cryptoPayment     CryptoPayment?\r\n  dispute           Dispute?\r\n  escrowTransaction EscrowTransaction?\r\n  items             OrderItem[]\r\n  user              User               @relation(\"UserOrders\", fields: [userId], references: [id])\r\n  vendor            Vendor             @relation(\"VendorOrders\", fields: [vendorId], references: [id])\r\n  payment           Payment?\r\n  refunds           Refund[]\r\n  sellerReviews     SellerReview[]     @relation(\"OrderSellerReviews\")\r\n\r\n  @@index([userId])\r\n  @@index([vendorId])\r\n  @@index([status])\r\n  @@index([createdAt])\r\n  @@index([status, vendorId])\r\n  @@index([status, userId])\r\n  @@map(\"orders\")\r\n}\r\n\r\nmodel Payment {\r\n  id            String         @id @default(cuid())\r\n  orderId       String         @unique\r\n  amount        Float\r\n  currency      String         @default(\"USD\")\r\n  provider      PaymentGateway\r\n  status        PaymentStatus  @default(PENDING)\r\n  transactionId String?\r\n  metadata      Json?\r\n  createdAt     DateTime       @default(now())\r\n  updatedAt     DateTime       @updatedAt\r\n  order         Order          @relation(fields: [orderId], references: [id])\r\n\r\n  @@index([status])\r\n  @@index([provider])\r\n  @@map(\"payments\")\r\n}\r\n\r\nmodel Transaction {\r\n  id          String            @id @default(cuid())\r\n  type        TransactionType\r\n  amount      Float\r\n  currency    String            @default(\"USD\")\r\n  status      TransactionStatus @default(COMPLETED)\r\n  description String?\r\n  referenceId String?\r\n  userId      String?\r\n  metadata    Json?\r\n  createdAt   DateTime          @default(now())\r\n  updatedAt   DateTime          @updatedAt\r\n  user        User?             @relation(fields: [userId], references: [id])\r\n\r\n  @@index([type])\r\n  @@index([userId])\r\n  @@index([createdAt])\r\n  @@map(\"transactions\")\r\n}\r\n\r\nmodel OrderItem {\r\n  id        String   @id @default(cuid())\r\n  orderId   String\r\n  productId String\r\n  quantity  Int\r\n  price     Float\r\n  order     Order    @relation(fields: [orderId], references: [id])\r\n  product   Product  @relation(fields: [productId], references: [id])\r\n  refunds   Refund[]\r\n\r\n  @@index([orderId])\r\n  @@index([productId])\r\n  @@map(\"order_items\")\r\n}\r\n\r\nmodel Conversation {\r\n  id           String                    @id @default(cuid())\r\n  createdAt    DateTime                  @default(now())\r\n  updatedAt    DateTime                  @updatedAt\r\n  customerId   String?\r\n  vendorId     String?\r\n  participants ConversationParticipant[]\r\n  customer     User?                     @relation(\"CustomerConversations\", fields: [customerId], references: [id])\r\n  vendor       Vendor?                   @relation(\"VendorConversations\", fields: [vendorId], references: [id])\r\n  dispute      Dispute?                  @relation(\"ConversationDispute\")\r\n  jobOffer     JobOffer?\r\n  messages     Message[]\r\n\r\n  @@map(\"conversations\")\r\n}\r\n\r\nmodel ConversationParticipant {\r\n  id             String       @id @default(cuid())\r\n  userId         String\r\n  conversationId String\r\n  createdAt      DateTime     @default(now())\r\n  conversation   Conversation @relation(fields: [conversationId], references: [id])\r\n  user           User         @relation(fields: [userId], references: [id])\r\n\r\n  @@unique([userId, conversationId])\r\n  @@map(\"conversation_participants\")\r\n}\r\n\r\nmodel Message {\r\n  id             String       @id @default(cuid())\r\n  conversationId String\r\n  senderId       String\r\n  receiverId     String?\r\n  content        String\r\n  createdAt      DateTime     @default(now())\r\n  read           Boolean      @default(false)\r\n  readAt         DateTime?\r\n  messageType    MessageType  @default(USER)\r\n  metadata       Json?\r\n  conversation   Conversation @relation(fields: [conversationId], references: [id])\r\n  receiver       User?        @relation(\"ReceivedMessages\", fields: [receiverId], references: [id])\r\n  sender         User         @relation(\"SentMessages\", fields: [senderId], references: [id])\r\n\r\n  @@index([conversationId])\r\n  @@index([senderId])\r\n  @@index([receiverId])\r\n  @@index([conversationId, createdAt])\r\n  @@index([messageType])\r\n  @@map(\"messages\")\r\n}\r\n\r\nmodel Dispute {\r\n  id                     String               @id @default(cuid())\r\n  orderId                String               @unique\r\n  productId              String\r\n  initiatorId            String\r\n  status                 DisputeStatus        @default(PENDING)\r\n  reason                 String\r\n  resolution             String?\r\n  resolvedByAdmin        Boolean              @default(false)\r\n  conversationId         String?              @unique\r\n  createdAt              DateTime             @default(now())\r\n  updatedAt              DateTime             @updatedAt\r\n  buyerResponseDeadline  DateTime?\r\n  disputeReason          DisputeReason?\r\n  evidenceFiles          Json?\r\n  refundAmount           Float?\r\n  refundProcessed        Boolean              @default(false)\r\n  sellerResponseDeadline DateTime?\r\n  participants           DisputeParticipant[]\r\n  conversation           Conversation?        @relation(\"ConversationDispute\", fields: [conversationId], references: [id])\r\n  initiator              User                 @relation(\"UserDisputes\", fields: [initiatorId], references: [id])\r\n  order                  Order                @relation(fields: [orderId], references: [id])\r\n  product                Product              @relation(fields: [productId], references: [id])\r\n\r\n  @@index([status])\r\n  @@index([initiatorId])\r\n  @@index([productId])\r\n  @@index([createdAt])\r\n  @@index([status, createdAt])\r\n  @@map(\"disputes\")\r\n}\r\n\r\nmodel DisputeParticipant {\r\n  id        String      @id @default(cuid())\r\n  disputeId String\r\n  userId    String\r\n  role      DisputeRole\r\n  createdAt DateTime    @default(now())\r\n  dispute   Dispute     @relation(fields: [disputeId], references: [id])\r\n  user      User        @relation(fields: [userId], references: [id])\r\n\r\n  @@unique([disputeId, userId])\r\n  @@map(\"dispute_participants\")\r\n}\r\n\r\nmodel Tag {\r\n  id          String       @id @default(cuid())\r\n  name        String       @unique\r\n  slug        String       @unique\r\n  isActive    Boolean      @default(true)\r\n  productTags ProductTag[]\r\n  products    Product[]    @relation(\"ProductTags\")\r\n\r\n  @@map(\"tags\")\r\n}\r\n\r\nmodel ProductTag {\r\n  productId  String\r\n  tagId      String\r\n  assignedAt DateTime @default(now())\r\n  assignedBy String\r\n  product    Product  @relation(fields: [productId], references: [id])\r\n  tag        Tag      @relation(fields: [tagId], references: [id])\r\n\r\n  @@id([productId, tagId])\r\n  @@map(\"product_tags\")\r\n}\r\n\r\nmodel PlatformSetting {\r\n  id                   String   @id @default(cuid())\r\n  platformFeePercent   Float    @default(30.0)\r\n  cryptoPaymentEnabled Boolean  @default(true)\r\n  createdAt            DateTime @default(now())\r\n  updatedAt            DateTime @updatedAt\r\n  disputePeriodDays    Int      @default(14)\r\n  escrowHoldDays       Int      @default(7)\r\n\r\n  @@map(\"platform_settings\")\r\n}\r\n\r\nmodel CryptoWallet {\r\n  id        String   @id @default(cuid())\r\n  userId    String\r\n  address   String   @unique\r\n  chain     String\r\n  currency  String\r\n  createdAt DateTime @default(now())\r\n  updatedAt DateTime @updatedAt\r\n  user      User     @relation(fields: [userId], references: [id])\r\n\r\n  @@map(\"crypto_wallets\")\r\n}\r\n\r\nmodel CryptoPayment {\r\n  id                String              @id @default(cuid())\r\n  orderId           String              @unique\r\n  amount            Float\r\n  currency          String\r\n  chain             String\r\n  fromAddress       String\r\n  toAddress         String\r\n  transactionHash   String              @unique\r\n  status            CryptoPaymentStatus @default(PENDING)\r\n  webhookReceivedAt DateTime?\r\n  confirmedAt       DateTime?\r\n  createdAt         DateTime            @default(now())\r\n  updatedAt         DateTime            @updatedAt\r\n  order             Order               @relation(fields: [orderId], references: [id])\r\n\r\n  @@map(\"crypto_payments\")\r\n}\r\n\r\nmodel DashboardStat {\r\n  id        String   @id @default(cuid())\r\n  key       String   @unique\r\n  value     String\r\n  createdAt DateTime @default(now())\r\n  updatedAt DateTime @updatedAt\r\n\r\n  @@map(\"dashboard_stats\")\r\n}\r\n\r\nmodel BannedUser {\r\n  id           String    @id @default(cuid())\r\n  userId       String    @unique\r\n  reason       String\r\n  bannedBy     String\r\n  banStart     DateTime  @default(now())\r\n  banEnd       DateTime?\r\n  isActive     Boolean   @default(true)\r\n  createdAt    DateTime  @default(now())\r\n  updatedAt    DateTime  @updatedAt\r\n  bannedByUser User      @relation(\"BannedByUsers\", fields: [bannedBy], references: [id])\r\n  user         User      @relation(fields: [userId], references: [id])\r\n\r\n  @@index([isActive])\r\n  @@index([createdAt])\r\n  @@map(\"banned_users\")\r\n}\r\n\r\nmodel VendorApplication {\r\n  id                    String                  @id @default(cuid())\r\n  vendorId              String                  @unique\r\n  status                VendorApplicationStatus @default(PENDING)\r\n  currentStep           Int                     @default(1)\r\n  totalSteps            Int                     @default(4)\r\n  \r\n  // Submission & Review tracking\r\n  submittedAt           DateTime?\r\n  reviewedBy            String?\r\n  reviewedAt            DateTime?\r\n  approvedAt            DateTime?\r\n  rejectedAt            DateTime?\r\n  rejectionReason       String?\r\n  \r\n  // Revision tracking\r\n  revisionRequested     Boolean                 @default(false)\r\n  revisionRequestedAt   DateTime?\r\n  revisionRequestedBy   String?\r\n  revisionReason        String?\r\n  revisionCompletedAt   DateTime?\r\n  \r\n  // Legacy notes field (for backward compatibility)\r\n  notes                 String?\r\n  \r\n  // Persona Verification\r\n  personaInquiryId      String?                 @unique\r\n  personaStatus         PersonaStatus           @default(NOT_STARTED)\r\n  personaVerifiedAt     DateTime?\r\n  personaOverridden     Boolean                 @default(false)\r\n  personaOverrideReason String?\r\n  personaOverriddenBy   String?\r\n  personaOverriddenAt   DateTime?\r\n  \r\n  // Metadata\r\n  ipAddress             String?\r\n  userAgent             String?\r\n  country               String?\r\n  \r\n  // Timestamps\r\n  createdAt             DateTime                @default(now())\r\n  updatedAt             DateTime                @updatedAt\r\n  deletedAt             DateTime?\r\n  \r\n  // Relations\r\n  vendor                Vendor                  @relation(fields: [vendorId], references: [id])\r\n  reviewer              User?                   @relation(\"VendorApplicationReviewers\", fields: [reviewedBy], references: [id])\r\n  revisionRequestedByUser User?                 @relation(\"VendorApplicationRevisionRequesters\", fields: [revisionRequestedBy], references: [id])\r\n  personaOverriddenByUser User?                 @relation(\"VendorApplicationPersonaOverriders\", fields: [personaOverriddenBy], references: [id])\r\n  steps                 ApplicationStep[]\r\n  applicationNotes      ApplicationNote[]\r\n  auditLogs             ApplicationAuditLog[]\r\n  personaVerification   PersonaVerification?\r\n\r\n  @@index([status])\r\n  @@index([createdAt])\r\n  @@index([personaStatus])\r\n  @@index([status, createdAt])\r\n  @@index([reviewedBy])\r\n  @@index([deletedAt])\r\n  @@map(\"vendor_applications\")\r\n}\r\n\r\nmodel ApplicationStep {\r\n  id               String             @id @default(cuid())\r\n  applicationId    String\r\n  stepNumber       Int\r\n  stepName         String\r\n  stepSlug         String             // e.g., \"business-info\", \"documents\", \"verification\"\r\n  status           StepStatus         @default(PENDING)\r\n  data             Json?              // Step-specific data (form fields, etc.)\r\n  files            Json?              // Uploaded files for this step [{name, url, size, type}]\r\n  completedAt      DateTime?\r\n  revisionRequired Boolean            @default(false)\r\n  revisionNotes    String?\r\n  createdAt        DateTime           @default(now())\r\n  updatedAt        DateTime           @updatedAt\r\n  \r\n  application      VendorApplication  @relation(fields: [applicationId], references: [id], onDelete: Cascade)\r\n  \r\n  @@unique([applicationId, stepNumber])\r\n  @@index([applicationId])\r\n  @@index([status])\r\n  @@index([stepSlug])\r\n  @@map(\"application_steps\")\r\n}\r\n\r\nmodel ApplicationNote {\r\n  id            String            @id @default(cuid())\r\n  applicationId String\r\n  type          NoteType          // ADMIN_INTERNAL, USER_FACING, SYSTEM\r\n  content       String            @db.Text\r\n  metadata      Json?             // Additional context (e.g., related step, action type)\r\n  createdBy     String?\r\n  createdAt     DateTime          @default(now())\r\n  updatedAt     DateTime          @updatedAt\r\n  \r\n  application   VendorApplication @relation(fields: [applicationId], references: [id], onDelete: Cascade)\r\n  author        User?             @relation(\"ApplicationNoteAuthors\", fields: [createdBy], references: [id])\r\n  \r\n  @@index([applicationId])\r\n  @@index([type])\r\n  @@index([createdAt])\r\n  @@index([applicationId, type])\r\n  @@map(\"application_notes\")\r\n}\r\n\r\nmodel ApplicationAuditLog {\r\n  id            String            @id @default(cuid())\r\n  applicationId String\r\n  action        AuditAction       // CREATED, APPROVED, REJECTED, REVISION_REQUESTED, etc.\r\n  performedBy   String\r\n  metadata      Json?             // Additional context about the action\r\n  ipAddress     String?\r\n  userAgent     String?\r\n  createdAt     DateTime          @default(now())\r\n  \r\n  application   VendorApplication @relation(fields: [applicationId], references: [id], onDelete: Cascade)\r\n  admin         User              @relation(\"AuditLogPerformers\", fields: [performedBy], references: [id])\r\n  \r\n  @@index([applicationId])\r\n  @@index([action])\r\n  @@index([createdAt])\r\n  @@index([performedBy])\r\n  @@index([applicationId, createdAt])\r\n  @@map(\"application_audit_logs\")\r\n}\r\n\r\nmodel PersonaVerification {\r\n  id                String            @id @default(cuid())\r\n  applicationId     String            @unique\r\n  inquiryId         String            @unique  // Persona inquiry ID\r\n  status            PersonaStatus     @default(PENDING)\r\n  webhookData       Json?             // Store raw webhook data\r\n  verificationUrl   String?           // URL for user to complete verification\r\n  lastCheckedAt     DateTime?\r\n  failureReason     String?\r\n  createdAt         DateTime          @default(now())\r\n  updatedAt         DateTime          @updatedAt\r\n  \r\n  application       VendorApplication @relation(fields: [applicationId], references: [id], onDelete: Cascade)\r\n  \r\n  @@index([status])\r\n  @@index([inquiryId])\r\n  @@map(\"persona_verifications\")\r\n}\r\n\r\nmodel Withdrawal {\r\n  id          String           @id @default(cuid())\r\n  vendorId    String\r\n  amount      Float\r\n  currency    String           @default(\"USD\")\r\n  status      WithdrawalStatus @default(PENDING)\r\n  method      String\r\n  details     String\r\n  processedBy String?\r\n  processedAt DateTime?\r\n  createdAt   DateTime         @default(now())\r\n  updatedAt   DateTime         @updatedAt\r\n  processor   User?            @relation(\"WithdrawalProcessors\", fields: [processedBy], references: [id])\r\n  vendor      Vendor           @relation(fields: [vendorId], references: [id])\r\n\r\n  @@index([vendorId])\r\n  @@index([status])\r\n  @@index([createdAt])\r\n  @@index([vendorId, status])\r\n  @@map(\"withdrawals\")\r\n}\r\n\r\nmodel DigitalFile {\r\n  id          String     @id @default(cuid())\r\n  name        String\r\n  description String?\r\n  url         String\r\n  size        Int\r\n  mimeType    String\r\n  productId   String?\r\n  uploadedBy  String\r\n  status      FileStatus @default(ACTIVE)\r\n  createdAt   DateTime   @default(now())\r\n  updatedAt   DateTime   @updatedAt\r\n  product     Product?   @relation(fields: [productId], references: [id])\r\n  uploader    User       @relation(\"DigitalFileUploaders\", fields: [uploadedBy], references: [id])\r\n\r\n  @@map(\"digital_files\")\r\n}\r\n\r\nmodel Report {\r\n  id          String    @id @default(cuid())\r\n  name        String\r\n  type        String\r\n  data        Json\r\n  generatedBy String\r\n  startDate   DateTime?\r\n  endDate     DateTime?\r\n  createdAt   DateTime  @default(now())\r\n  updatedAt   DateTime  @updatedAt\r\n  generator   User      @relation(\"ReportGenerators\", fields: [generatedBy], references: [id])\r\n\r\n  @@map(\"reports\")\r\n}\r\n\r\nmodel Setting {\r\n  id          String   @id @default(cuid())\r\n  key         String   @unique\r\n  value       String\r\n  type        String   @default(\"string\")\r\n  description String?\r\n  group       String   @default(\"general\")\r\n  createdAt   DateTime @default(now())\r\n  updatedAt   DateTime @updatedAt\r\n\r\n  @@map(\"settings\")\r\n}\r\n\r\nmodel SeoSetting {\r\n  id          String   @id @default(cuid())\r\n  page        String   @unique\r\n  title       String?\r\n  description String?\r\n  keywords    String?\r\n  author      String?\r\n  createdAt   DateTime @default(now())\r\n  updatedAt   DateTime @updatedAt\r\n\r\n  @@map(\"seo_settings\")\r\n}\r\n\r\n// ============================================\r\n// PAGE BUILDER TABLES\r\n// ============================================\r\n\r\nmodel builder_pages {\r\n  id           String                 @id @default(cuid())\r\n  slug         String                 @unique\r\n  title        String\r\n  description  String?\r\n  content      Json\r\n  status       String                 @default(\"draft\") // draft, published, archived\r\n  version      Int                    @default(1)\r\n  published_at DateTime?\r\n  created_at   DateTime               @default(now())\r\n  updated_at   DateTime               @updatedAt\r\n  versions     builder_page_versions[]\r\n\r\n  @@index([status])\r\n  @@index([slug])\r\n  @@index([updated_at])\r\n}\r\n\r\nmodel builder_page_versions {\r\n  id         String        @id @default(cuid())\r\n  page_id    String\r\n  content    Json\r\n  version    Int\r\n  created_at DateTime      @default(now())\r\n  page       builder_pages @relation(fields: [page_id], references: [id], onDelete: Cascade)\r\n\r\n  @@index([page_id])\r\n  @@index([version])\r\n}\r\n\r\nmodel CmsPage {\r\n  id          String     @id @default(cuid())\r\n  title       String\r\n  slug        String     @unique\r\n  content     String\r\n  status      PageStatus @default(DRAFT)\r\n  authorId    String\r\n  publishedAt DateTime?\r\n  createdAt   DateTime   @default(now())\r\n  updatedAt   DateTime   @updatedAt\r\n  author      User       @relation(fields: [authorId], references: [id])\r\n\r\n  @@map(\"cms_pages\")\r\n}\r\n\r\nmodel SupportTicket {\r\n  id                                      String            @id @default(cuid())\r\n  subject                                 String\r\n  description                             String\r\n  userId                                  String\r\n  status                                  TicketStatus      @default(OPEN)\r\n  priority                                TicketPriority    @default(MEDIUM)\r\n  assignedTo                              String?\r\n  category                                String\r\n  closedAt                                DateTime?\r\n  createdAt                               DateTime          @default(now())\r\n  updatedAt                               DateTime          @updatedAt\r\n  attachments                             Json?\r\n  resolvedAt                              DateTime?\r\n  resolvedBy                              String?\r\n  tags                                    String[]          @default([])\r\n  ticket_messages                         TicketMessage[]\r\n  assignee                                User?             @relation(\"SupportTicketAssignees\", fields: [assignedTo], references: [id])\r\n  users_support_tickets_resolvedByTousers User?             @relation(\"support_tickets_resolvedByTousers\", fields: [resolvedBy], references: [id])\r\n  user                                    User              @relation(fields: [userId], references: [id])\r\n\r\n  @@index([userId])\r\n  @@index([status])\r\n  @@index([assignedTo])\r\n  @@index([userId, status])\r\n  @@index([status, priority])\r\n  @@index([category])\r\n  @@map(\"support_tickets\")\r\n}\r\n\r\nmodel SystemLog {\r\n  id        String   @id @default(cuid())\r\n  level     String\r\n  message   String\r\n  metadata  Json?\r\n  timestamp DateTime @default(now())\r\n\r\n  @@map(\"system_logs\")\r\n}\r\n\r\nmodel Announcement {\r\n  id        String             @id @default(cuid())\r\n  title     String\r\n  content   String\r\n  status    AnnouncementStatus @default(DRAFT)\r\n  priority  Int                @default(0)\r\n  startDate DateTime?\r\n  endDate   DateTime?\r\n  createdBy String\r\n  createdAt DateTime           @default(now())\r\n  updatedAt DateTime           @updatedAt\r\n  author    User               @relation(fields: [createdBy], references: [id])\r\n\r\n  @@map(\"announcements\")\r\n}\r\n\r\nmodel AdminAccount {\r\n  id           String    @id @default(cuid())\r\n  userId       String    @unique\r\n  permissions  Json?\r\n  lastLogin    DateTime?\r\n  createdAt    DateTime  @default(now())\r\n  updatedAt    DateTime  @updatedAt\r\n  isSuperAdmin Boolean   @default(false)\r\n  user         User      @relation(fields: [userId], references: [id])\r\n\r\n  @@map(\"admin_accounts\")\r\n}\r\n\r\nmodel NavigationItem {\r\n  id          String           @id @default(cuid())\r\n  label       String\r\n  url         String\r\n  order       Int\r\n  isActive    Boolean          @default(true)\r\n  isSection   Boolean          @default(false)\r\n  parentId    String?\r\n  icon        String?\r\n  description String?\r\n  image       String?\r\n  isFeatured  Boolean          @default(false)\r\n  createdAt   DateTime         @default(now())\r\n  updatedAt   DateTime         @updatedAt\r\n  parent      NavigationItem?  @relation(\"NavigationItems\", fields: [parentId], references: [id])\r\n  children    NavigationItem[] @relation(\"NavigationItems\")\r\n\r\n  @@map(\"navigation_items\")\r\n}\r\n\r\nmodel Content {\r\n  id              String        @id @default(cuid())\r\n  title           String\r\n  slug            String        @unique\r\n  content         String\r\n  excerpt         String?\r\n  status          ContentStatus @default(DRAFT)\r\n  contentType     String\r\n  authorId        String\r\n  parentId        String?\r\n  featuredImage   String?\r\n  metaTitle       String?\r\n  metaDescription String?\r\n  tags            String[]\r\n  categories      String[]\r\n  publishedAt     DateTime?\r\n  createdAt       DateTime      @default(now())\r\n  updatedAt       DateTime      @updatedAt\r\n  author          User          @relation(fields: [authorId], references: [id])\r\n  parent          Content?      @relation(\"ContentRelation\", fields: [parentId], references: [id])\r\n  children        Content[]     @relation(\"ContentRelation\")\r\n\r\n  @@map(\"content\")\r\n}\r\n\r\nmodel Discount {\r\n  id          String       @id @default(cuid())\r\n  vendorId    String\r\n  name        String\r\n  description String?\r\n  type        DiscountType\r\n  value       Float\r\n  minPurchase Float?\r\n  maxDiscount Float?\r\n  startDate   DateTime\r\n  endDate     DateTime\r\n  isActive    Boolean      @default(true)\r\n  usageLimit  Int?\r\n  usageCount  Int          @default(0)\r\n  createdAt   DateTime     @default(now())\r\n  updatedAt   DateTime     @updatedAt\r\n  vendor      Vendor       @relation(fields: [vendorId], references: [id])\r\n\r\n  @@map(\"discounts\")\r\n}\r\n\r\nmodel Coupon {\r\n  id          String        @id @default(cuid())\r\n  vendorId    String\r\n  code        String        @unique\r\n  description String?\r\n  type        CouponType\r\n  value       Float\r\n  minPurchase Float?\r\n  maxDiscount Float?\r\n  startDate   DateTime\r\n  endDate     DateTime\r\n  isActive    Boolean       @default(true)\r\n  usageLimit  Int?\r\n  usageCount  Int           @default(0)\r\n  createdAt   DateTime      @default(now())\r\n  updatedAt   DateTime      @updatedAt\r\n  usedBy      CouponUsage[]\r\n  vendor      Vendor        @relation(fields: [vendorId], references: [id])\r\n\r\n  @@map(\"coupons\")\r\n}\r\n\r\nmodel Refund {\r\n  id          String       @id @default(cuid())\r\n  orderId     String\r\n  orderItemId String?\r\n  amount      Float\r\n  status      RefundStatus @default(PENDING)\r\n  createdAt   DateTime     @default(now())\r\n  updatedAt   DateTime     @updatedAt\r\n  notes       String?\r\n  processedBy String?\r\n  reason      RefundReason\r\n  order       Order        @relation(fields: [orderId], references: [id])\r\n  orderItem   OrderItem?   @relation(fields: [orderItemId], references: [id])\r\n\r\n  @@index([orderId])\r\n  @@index([orderItemId])\r\n  @@index([status])\r\n  @@index([processedBy])\r\n  @@map(\"refunds\")\r\n}\r\n\r\nmodel CouponUsage {\r\n  id       String   @id @default(cuid())\r\n  couponId String\r\n  userId   String\r\n  orderId  String\r\n  usedAt   DateTime @default(now())\r\n  coupon   Coupon   @relation(fields: [couponId], references: [id])\r\n  user     User     @relation(\"CouponUsers\", fields: [userId], references: [id])\r\n\r\n  @@index([couponId])\r\n  @@index([userId])\r\n  @@map(\"coupon_usage\")\r\n}\r\n\r\nmodel Promotion {\r\n  id          String        @id @default(cuid())\r\n  vendorId    String\r\n  name        String\r\n  description String?\r\n  type        PromotionType\r\n  conditions  Json\r\n  rewards     Json\r\n  startDate   DateTime\r\n  endDate     DateTime\r\n  isActive    Boolean       @default(true)\r\n  priority    Int           @default(0)\r\n  createdAt   DateTime      @default(now())\r\n  updatedAt   DateTime      @updatedAt\r\n  vendor      Vendor        @relation(fields: [vendorId], references: [id])\r\n\r\n  @@map(\"promotions\")\r\n}\r\n\r\nmodel Affiliate {\r\n  id             String              @id @default(cuid())\r\n  vendorId       String\r\n  userId         String\r\n  code           String              @unique\r\n  commissionRate Float\r\n  totalEarnings  Float               @default(0)\r\n  status         AffiliateStatus     @default(PENDING)\r\n  createdAt      DateTime            @default(now())\r\n  updatedAt      DateTime            @updatedAt\r\n  referrals      AffiliateReferral[]\r\n  user           User                @relation(\"UserAffiliates\", fields: [userId], references: [id])\r\n  vendor         Vendor              @relation(fields: [vendorId], references: [id])\r\n\r\n  @@index([vendorId])\r\n  @@index([userId])\r\n  @@index([status])\r\n  @@map(\"affiliates\")\r\n}\r\n\r\nmodel AffiliateReferral {\r\n  id          String         @id @default(cuid())\r\n  affiliateId String\r\n  orderId     String\r\n  commission  Float\r\n  status      ReferralStatus @default(PENDING)\r\n  paidAt      DateTime?\r\n  createdAt   DateTime       @default(now())\r\n  updatedAt   DateTime       @updatedAt\r\n  affiliate   Affiliate      @relation(fields: [affiliateId], references: [id])\r\n\r\n  @@map(\"affiliate_referrals\")\r\n}\r\n\r\nmodel Invoice {\r\n  id            String        @id @default(cuid())\r\n  vendorId      String\r\n  orderId       String        @unique\r\n  invoiceNumber String        @unique\r\n  amount        Float\r\n  tax           Float         @default(0)\r\n  total         Float\r\n  status        InvoiceStatus @default(PENDING)\r\n  dueDate       DateTime?\r\n  paidAt        DateTime?\r\n  createdAt     DateTime      @default(now())\r\n  updatedAt     DateTime      @updatedAt\r\n  vendor        Vendor        @relation(fields: [vendorId], references: [id])\r\n\r\n  @@map(\"invoices\")\r\n}\r\n\r\nmodel ShippingSetting {\r\n  id                    String   @id @default(cuid())\r\n  vendorId              String   @unique\r\n  freeShippingThreshold Float?\r\n  flatRate              Float?\r\n  zones                 Json?\r\n  createdAt             DateTime @default(now())\r\n  updatedAt             DateTime @updatedAt\r\n  vendor                Vendor   @relation(fields: [vendorId], references: [id])\r\n\r\n  @@map(\"shipping_settings\")\r\n}\r\n\r\nmodel TaxSetting {\r\n  id        String   @id @default(cuid())\r\n  vendorId  String   @unique\r\n  taxRate   Float    @default(0)\r\n  taxNumber String?\r\n  regions   Json?\r\n  createdAt DateTime @default(now())\r\n  updatedAt DateTime @updatedAt\r\n  vendor    Vendor   @relation(fields: [vendorId], references: [id])\r\n\r\n  @@map(\"tax_settings\")\r\n}\r\n\r\nmodel NotificationSetting {\r\n  id                     String   @id @default(cuid())\r\n  vendorId               String   @unique\r\n  emailNotifications     Boolean  @default(true)\r\n  orderNotifications     Boolean  @default(true)\r\n  productNotifications   Boolean  @default(true)\r\n  marketingNotifications Boolean  @default(false)\r\n  createdAt              DateTime @default(now())\r\n  updatedAt              DateTime @updatedAt\r\n  vendor                 Vendor   @relation(fields: [vendorId], references: [id])\r\n\r\n  @@map(\"notification_settings\")\r\n}\r\n\r\nmodel Wishlist {\r\n  id        String   @id @default(cuid())\r\n  userId    String\r\n  productId String\r\n  createdAt DateTime @default(now())\r\n  updatedAt DateTime @updatedAt\r\n  product   Product  @relation(fields: [productId], references: [id])\r\n  user      User     @relation(fields: [userId], references: [id])\r\n\r\n  @@unique([userId, productId])\r\n  @@map(\"wishlists\")\r\n}\r\n\r\nmodel Review {\r\n  id        String   @id @default(cuid())\r\n  userId    String\r\n  productId String\r\n  rating    Int\r\n  comment   String?\r\n  createdAt DateTime @default(now())\r\n  updatedAt DateTime @updatedAt\r\n  product   Product  @relation(fields: [productId], references: [id])\r\n  user      User     @relation(fields: [userId], references: [id])\r\n\r\n  @@unique([userId, productId])\r\n  @@index([productId, rating])\r\n  @@map(\"reviews\")\r\n}\r\n\r\nmodel Wallet {\r\n  id             String              @id @default(cuid())\r\n  userId         String              @unique\r\n  balance        Float               @default(0)\r\n  currency       String              @default(\"USD\")\r\n  createdAt      DateTime            @default(now())\r\n  updatedAt      DateTime            @updatedAt\r\n  pendingBalance Float               @default(0)\r\n  transactions   WalletTransaction[]\r\n  user           User                @relation(fields: [userId], references: [id])\r\n\r\n  @@map(\"wallets\")\r\n}\r\n\r\nmodel WalletTransaction {\r\n  id        String                  @id @default(cuid())\r\n  walletId  String\r\n  amount    Float\r\n  type      WalletTransactionType\r\n  status    WalletTransactionStatus @default(COMPLETED)\r\n  reference String?\r\n  createdAt DateTime                @default(now())\r\n  updatedAt DateTime                @updatedAt\r\n  wallet    Wallet                  @relation(fields: [walletId], references: [id])\r\n\r\n  @@index([walletId])\r\n  @@index([type])\r\n  @@index([status])\r\n  @@map(\"wallet_transactions\")\r\n}\r\n\r\nmodel GiftCard {\r\n  id          String           @id @default(cuid())\r\n  code        String           @unique\r\n  amount      Float\r\n  currency    String           @default(\"USD\")\r\n  balance     Float\r\n  status      GiftCardStatus   @default(ACTIVE)\r\n  expiresAt   DateTime?\r\n  createdById String?\r\n  vendorId    String?\r\n  createdAt   DateTime         @default(now())\r\n  updatedAt   DateTime         @updatedAt\r\n  redemptions GiftCardRedemption[]\r\n  vendor      Vendor?          @relation(fields: [vendorId], references: [id])\r\n\r\n  @@index([code])\r\n  @@index([status])\r\n  @@index([vendorId])\r\n  @@map(\"gift_cards\")\r\n}\r\n\r\nmodel GiftCardRedemption {\r\n  id         String   @id @default(cuid())\r\n  giftCardId String\r\n  userId     String\r\n  amount     Float\r\n  createdAt  DateTime @default(now())\r\n  giftCard   GiftCard @relation(fields: [giftCardId], references: [id])\r\n  user       User     @relation(fields: [userId], references: [id])\r\n\r\n  @@index([giftCardId])\r\n  @@index([userId])\r\n  @@map(\"gift_card_redemptions\")\r\n}\r\n\r\nmodel Address {\r\n  id        String   @id @default(cuid())\r\n  userId    String\r\n  name      String\r\n  street    String\r\n  city      String\r\n  state     String\r\n  zip       String\r\n  country   String\r\n  isDefault Boolean  @default(false)\r\n  createdAt DateTime @default(now())\r\n  updatedAt DateTime @updatedAt\r\n  user      User     @relation(fields: [userId], references: [id])\r\n\r\n  @@index([userId])\r\n  @@index([isDefault])\r\n  @@map(\"addresses\")\r\n}\r\n\r\nmodel Cart {\r\n  id        String     @id @default(cuid())\r\n  userId    String     @unique\r\n  createdAt DateTime   @default(now())\r\n  updatedAt DateTime   @updatedAt\r\n  items     CartItem[]\r\n  user      User       @relation(fields: [userId], references: [id])\r\n\r\n  @@map(\"carts\")\r\n}\r\n\r\nmodel CartItem {\r\n  id        String   @id @default(cuid())\r\n  cartId    String\r\n  productId String\r\n  quantity  Int      @default(1)\r\n  createdAt DateTime @default(now())\r\n  cart      Cart     @relation(fields: [cartId], references: [id], onDelete: Cascade)\r\n  product   Product  @relation(fields: [productId], references: [id])\r\n\r\n  @@unique([cartId, productId])\r\n  @@index([cartId])\r\n  @@index([productId])\r\n  @@map(\"cart_items\")\r\n}\r\n\r\nmodel ProductVersion {\r\n  id         String   @id @default(cuid())\r\n  productId  String\r\n  version    String\r\n  fileUrl    String\r\n  changelog  String?\r\n  uploadedBy String\r\n  createdAt  DateTime @default(now())\r\n  product    Product  @relation(fields: [productId], references: [id], onDelete: Cascade)\r\n  uploader   User     @relation(\"ProductVersionUploaders\", fields: [uploadedBy], references: [id])\r\n\r\n  @@index([productId])\r\n  @@index([uploadedBy])\r\n  @@index([createdAt])\r\n  @@map(\"product_versions\")\r\n}\r\n\r\nmodel Notification {\r\n  id        String           @id @default(cuid())\r\n  userId    String\r\n  type      NotificationType\r\n  title     String\r\n  message   String\r\n  data      Json?\r\n  isRead    Boolean          @default(false)\r\n  createdAt DateTime         @default(now())\r\n  user      User             @relation(fields: [userId], references: [id])\r\n\r\n  @@index([userId])\r\n  @@index([type])\r\n  @@index([userId, isRead])\r\n  @@index([userId, createdAt])\r\n  @@map(\"notifications\")\r\n}\r\n\r\nmodel AuditLog {\r\n  id        String   @id @default(cuid())\r\n  userId    String?\r\n  action    String\r\n  entity    String\r\n  entityId  String?\r\n  changes   Json?\r\n  ipAddress String?\r\n  userAgent String?\r\n  createdAt DateTime @default(now())\r\n  user      User?    @relation(fields: [userId], references: [id])\r\n\r\n  @@index([userId])\r\n  @@index([entity])\r\n  @@index([createdAt])\r\n  @@map(\"audit_logs\")\r\n}\r\n\r\nmodel PaymentMethod {\r\n  id        String      @id @default(cuid())\r\n  name      String\r\n  type      PaymentType\r\n  isActive  Boolean     @default(true)\r\n  config    Json?\r\n  createdAt DateTime    @default(now())\r\n  updatedAt DateTime    @updatedAt\r\n\r\n  @@map(\"payment_methods\")\r\n}\r\n\r\nmodel ProductBadge {\r\n  id         String    @id @default(cuid())\r\n  productId  String\r\n  badgeType  BadgeType\r\n  assignedAt DateTime  @default(now())\r\n  assignedBy String?\r\n  product    Product   @relation(fields: [productId], references: [id], onDelete: Cascade)\r\n\r\n  @@index([productId])\r\n  @@index([badgeType])\r\n  @@map(\"product_badges\")\r\n}\r\n\r\nmodel ThemeSetting {\r\n  id                       String   @id @default(cuid())\r\n  primaryColor             String   @default(\"#3b82f6\")\r\n  secondaryColor           String   @default(\"#f4f4f5\")\r\n  accentColor              String   @default(\"#f4f4f5\")\r\n  backgroundColor          String   @default(\"#ffffff\")\r\n  foregroundColor          String   @default(\"#09090b\")\r\n  cardColor                String   @default(\"#ffffff\")\r\n  cardForegroundColor      String   @default(\"#09090b\")\r\n  borderColor              String   @default(\"#e4e4e7\")\r\n  inputColor               String   @default(\"#e4e4e7\")\r\n  mutedColor               String   @default(\"#f4f4f5\")\r\n  mutedForegroundColor     String   @default(\"#71717a\")\r\n  destructiveColor         String   @default(\"#dc2626\")\r\n  darkPrimaryColor         String   @default(\"#2563eb\")\r\n  darkSecondaryColor       String   @default(\"#27272a\")\r\n  darkAccentColor          String   @default(\"#18181b\")\r\n  darkBackgroundColor      String   @default(\"#09090b\")\r\n  darkForegroundColor      String   @default(\"#fafafa\")\r\n  darkCardColor            String   @default(\"#09090b\")\r\n  darkCardForegroundColor  String   @default(\"#fafafa\")\r\n  darkBorderColor          String   @default(\"#27272a\")\r\n  darkInputColor           String   @default(\"#27272a\")\r\n  darkMutedColor           String   @default(\"#18181b\")\r\n  darkMutedForegroundColor String   @default(\"#71717a\")\r\n  darkDestructiveColor     String   @default(\"#dc2626\")\r\n  fontFamily               String   @default(\"Inter\")\r\n  fontSize                 String   @default(\"14px\")\r\n  headingFontFamily        String?\r\n  borderRadius             String   @default(\"0.5rem\")\r\n  sidebarWidth             String   @default(\"280px\")\r\n  headerHeight             String   @default(\"70px\")\r\n  logoUrl                  String?\r\n  logoLightUrl             String?\r\n  logoDarkUrl              String?\r\n  faviconUrl               String?\r\n  logoWidth                String   @default(\"150px\")\r\n  logoHeight               String   @default(\"40px\")\r\n  siteName                 String   @default(\"Digital Marketplace\")\r\n  siteTagline              String?\r\n  siteDescription          String?\r\n  copyrightText            String?\r\n  metaTitle                String?\r\n  metaDescription          String?\r\n  metaKeywords             String?\r\n  ogImage                  String?\r\n  facebookUrl              String?\r\n  twitterUrl               String?\r\n  instagramUrl             String?\r\n  linkedinUrl              String?\r\n  youtubeUrl               String?\r\n  githubUrl                String?\r\n  contactEmail             String?\r\n  contactPhone             String?\r\n  contactAddress           String?\r\n  supportEmail             String?\r\n  footerText               String?\r\n  showSocialLinks          Boolean  @default(true)\r\n  showContactInfo          Boolean  @default(true)\r\n  defaultMode              String   @default(\"light\")\r\n  createdAt                DateTime @default(now())\r\n  updatedAt                DateTime @updatedAt\r\n\r\n  @@map(\"theme_settings\")\r\n}\r\n\r\nmodel SellerBadge {\r\n  id          String        @id @default(cuid())\r\n  name        String        @unique\r\n  description String?\r\n  icon        String\r\n  color       String        @default(\"#3b82f6\")\r\n  isActive    Boolean       @default(true)\r\n  createdAt   DateTime      @default(now())\r\n  updatedAt   DateTime      @updatedAt\r\n  vendors     VendorBadge[]\r\n\r\n  @@map(\"seller_badges\")\r\n}\r\n\r\nmodel VendorBadge {\r\n  id         String      @id @default(cuid())\r\n  vendorId   String\r\n  badgeId    String\r\n  assignedBy String\r\n  assignedAt DateTime    @default(now())\r\n  badge      SellerBadge @relation(fields: [badgeId], references: [id], onDelete: Cascade)\r\n  vendor     Vendor      @relation(fields: [vendorId], references: [id], onDelete: Cascade)\r\n\r\n  @@unique([vendorId, badgeId])\r\n  @@index([vendorId])\r\n  @@index([badgeId])\r\n  @@index([assignedBy])\r\n  @@map(\"vendor_badges\")\r\n}\r\n\r\nmodel SoftwareTool {\r\n  id          String               @id @default(cuid())\r\n  name        String               @unique\r\n  description String?\r\n  logoUrl     String\r\n  category    String?\r\n  isActive    Boolean              @default(true)\r\n  createdAt   DateTime             @default(now())\r\n  updatedAt   DateTime             @updatedAt\r\n  vendors     VendorSoftwareTool[]\r\n\r\n  @@index([isActive])\r\n  @@map(\"software_tools\")\r\n}\r\n\r\nmodel VendorSoftwareTool {\r\n  id             String       @id @default(cuid())\r\n  vendorId       String\r\n  softwareToolId String\r\n  addedAt        DateTime     @default(now())\r\n  softwareTool   SoftwareTool @relation(fields: [softwareToolId], references: [id], onDelete: Cascade)\r\n  vendor         Vendor       @relation(fields: [vendorId], references: [id], onDelete: Cascade)\r\n\r\n  @@unique([vendorId, softwareToolId])\r\n  @@index([vendorId])\r\n  @@index([softwareToolId])\r\n  @@map(\"vendor_software_tools\")\r\n}\r\n\r\nmodel Follow {\r\n  id          String   @id @default(cuid())\r\n  followerId  String\r\n  followingId String\r\n  createdAt   DateTime @default(now())\r\n  follower    User     @relation(\"UserFollowing\", fields: [followerId], references: [id], onDelete: Cascade)\r\n  following   Vendor   @relation(\"VendorFollowers\", fields: [followingId], references: [id], onDelete: Cascade)\r\n\r\n  @@unique([followerId, followingId])\r\n  @@index([followerId])\r\n  @@index([followingId])\r\n  @@map(\"follows\")\r\n}\r\n\r\nmodel SellerReview {\r\n  id        String   @id @default(cuid())\r\n  userId    String\r\n  vendorId  String\r\n  rating    Int\r\n  comment   String?\r\n  orderId   String?\r\n  createdAt DateTime @default(now())\r\n  updatedAt DateTime @updatedAt\r\n  order     Order?   @relation(\"OrderSellerReviews\", fields: [orderId], references: [id])\r\n  user      User     @relation(\"UserSellerReviews\", fields: [userId], references: [id], onDelete: Cascade)\r\n  vendor    Vendor   @relation(fields: [vendorId], references: [id], onDelete: Cascade)\r\n\r\n  @@unique([userId, vendorId])\r\n  @@index([userId])\r\n  @@index([vendorId])\r\n  @@index([orderId])\r\n  @@index([rating])\r\n  @@index([createdAt])\r\n  @@index([vendorId, rating])\r\n  @@map(\"seller_reviews\")\r\n}\r\n\r\nmodel AIProcessingJob {\r\n  id          String             @id @default(cuid())\r\n  productId   String\r\n  jobType     AIJobType\r\n  status      AIProcessingStatus @default(PENDING)\r\n  progress    Int                @default(0)\r\n  result      Json?\r\n  error       String?\r\n  startedAt   DateTime?\r\n  completedAt DateTime?\r\n  createdAt   DateTime           @default(now())\r\n  updatedAt   DateTime           @updatedAt\r\n  product     Product            @relation(fields: [productId], references: [id], onDelete: Cascade)\r\n\r\n  @@index([productId])\r\n  @@index([status])\r\n  @@index([jobType])\r\n  @@index([createdAt])\r\n  @@map(\"ai_processing_jobs\")\r\n}\r\n\r\nmodel ProductIssue {\r\n  id          String        @id @default(cuid())\r\n  productId   String\r\n  issueType   IssueType\r\n  severity    IssueSeverity\r\n  description String\r\n  location    Json?\r\n  autoFixed   Boolean       @default(false)\r\n  fixedAt     DateTime?\r\n  createdAt   DateTime      @default(now())\r\n  product     Product       @relation(fields: [productId], references: [id], onDelete: Cascade)\r\n\r\n  @@index([productId])\r\n  @@index([issueType])\r\n  @@index([severity])\r\n  @@map(\"product_issues\")\r\n}\r\n\r\nmodel JobOffer {\r\n  id             String         @id @default(cuid())\r\n  conversationId String         @unique\r\n  vendorId       String\r\n  customerId     String\r\n  title          String\r\n  description    String\r\n  budget         Float\r\n  currency       String         @default(\"USD\")\r\n  status         JobOfferStatus @default(PENDING)\r\n  acceptedAt     DateTime?\r\n  completedAt    DateTime?\r\n  createdAt      DateTime       @default(now())\r\n  updatedAt      DateTime       @updatedAt\r\n  conversation   Conversation   @relation(fields: [conversationId], references: [id])\r\n  customer       User           @relation(\"CustomerJobOffers\", fields: [customerId], references: [id])\r\n  vendor         Vendor         @relation(\"VendorJobOffers\", fields: [vendorId], references: [id])\r\n\r\n  @@index([vendorId])\r\n  @@index([customerId])\r\n  @@index([status])\r\n  @@index([createdAt])\r\n  @@map(\"job_offers\")\r\n}\r\n\r\nmodel api_settings {\r\n  id            String   @id\r\n  provider      String   @unique\r\n  settings      String\r\n  isActive      Boolean  @default(true)\r\n  lastUpdatedBy String?\r\n  createdAt     DateTime @default(now())\r\n  updatedAt     DateTime\r\n\r\n  @@index([provider])\r\n}\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\nenum PaymentGateway {\r\n  STRIPE\r\n  PAYPAL\r\n  CRYPTOMUS\r\n  BALANCE\r\n}\r\n\r\nenum PaymentStatus {\r\n  PENDING\r\n  COMPLETED\r\n  FAILED\r\n  REFUNDED\r\n}\r\n\r\nenum TransactionType {\r\n  PAYMENT_IN\r\n  PAYMENT_OUT\r\n  COMMISSION_PLATFORM\r\n  COMMISSION_SELLER\r\n  REFUND\r\n  ADJUSTMENT\r\n}\r\n\r\nenum TransactionStatus {\r\n  PENDING\r\n  COMPLETED\r\n  FAILED\r\n  CANCELLED\r\n}\r\n\r\nenum RefundStatus {\r\n  PENDING\r\n  APPROVED\r\n  REJECTED\r\n  COMPLETED\r\n}\r\n\r\nenum Role {\r\n  ADMIN\r\n  VENDOR\r\n  CUSTOMER\r\n}\r\n\r\nenum EscrowTransactionType {\r\n  DEPOSIT\r\n  RELEASE\r\n  REFUND\r\n  HOLD\r\n  UNHOLD\r\n  PLATFORM_FEE\r\n}\r\n\r\nenum EscrowTransactionStatus {\r\n  PENDING\r\n  COMPLETED\r\n  FAILED\r\n  CANCELLED\r\n}\r\n\r\nenum OrderStatus {\r\n  PENDING\r\n  PAID\r\n  SHIPPED\r\n  DELIVERED\r\n  CANCELLED\r\n  COMPLETED\r\n}\r\n\r\nenum DisputeStatus {\r\n  PENDING\r\n  IN_REVIEW\r\n  RESOLVED\r\n  CANCELLED\r\n}\r\n\r\nenum DisputeRole {\r\n  BUYER\r\n  SELLER\r\n  ADMIN\r\n}\r\n\r\nenum ProductStatus {\r\n  PENDING\r\n  PUBLISHED\r\n  SUSPENDED\r\n  REJECTED\r\n  DRAFT\r\n}\r\n\r\nenum CryptoPaymentStatus {\r\n  PENDING\r\n  CONFIRMED\r\n  FAILED\r\n}\r\n\r\nenum VendorApplicationStatus {\r\n  PENDING\r\n  UNDER_REVIEW\r\n  NEEDS_REVISION\r\n  APPROVED\r\n  REJECTED\r\n  CLOSED\r\n}\r\n\r\nenum WithdrawalStatus {\r\n  PENDING\r\n  PROCESSING\r\n  COMPLETED\r\n  FAILED\r\n  CANCELLED\r\n}\r\n\r\nenum FileStatus {\r\n  ACTIVE\r\n  INACTIVE\r\n  DELETED\r\n}\r\n\r\nenum PageStatus {\r\n  DRAFT\r\n  PUBLISHED\r\n  ARCHIVED\r\n}\r\n\r\nenum TicketStatus {\r\n  OPEN\r\n  IN_PROGRESS\r\n  RESOLVED\r\n  CLOSED\r\n}\r\n\r\nenum TicketPriority {\r\n  LOW\r\n  MEDIUM\r\n  HIGH\r\n  URGENT\r\n}\r\n\r\nenum AnnouncementStatus {\r\n  DRAFT\r\n  PUBLISHED\r\n  ARCHIVED\r\n}\r\n\r\nenum ContentStatus {\r\n  DRAFT\r\n  PUBLISHED\r\n  ARCHIVED\r\n}\r\n\r\nenum DiscountType {\r\n  PERCENTAGE\r\n  FIXED_AMOUNT\r\n}\r\n\r\nenum CouponType {\r\n  PERCENTAGE\r\n  FIXED_AMOUNT\r\n  FREE_SHIPPING\r\n}\r\n\r\nenum PromotionType {\r\n  BUY_X_GET_Y\r\n  BUNDLE\r\n  FLASH_SALE\r\n  SEASONAL\r\n}\r\n\r\nenum AffiliateStatus {\r\n  PENDING\r\n  ACTIVE\r\n  SUSPENDED\r\n  TERMINATED\r\n}\r\n\r\nenum ReferralStatus {\r\n  PENDING\r\n  APPROVED\r\n  PAID\r\n  CANCELLED\r\n}\r\n\r\nenum InvoiceStatus {\r\n  PENDING\r\n  PAID\r\n  OVERDUE\r\n  CANCELLED\r\n}\r\n\r\nenum WalletTransactionType {\r\n  DEPOSIT\r\n  WITHDRAWAL\r\n  PURCHASE\r\n  REFUND\r\n  GIFT_CARD_REDEMPTION\r\n  CREDIT_ADJUSTMENT\r\n}\r\n\r\nenum WalletTransactionStatus {\r\n  PENDING\r\n  COMPLETED\r\n  FAILED\r\n}\r\n\r\nenum RefundReason {\r\n  DEFECTIVE_PRODUCT\r\n  NOT_AS_DESCRIBED\r\n  CHANGED_MIND\r\n  DUPLICATE_ORDER\r\n  OTHER\r\n}\r\n\r\nenum BadgeType {\r\n  GAME_READY\r\n  PBR_CERTIFIED\r\n  PRINT_READY\r\n  QUALITY_VERIFIED\r\n  LOW_POLY\r\n  HIGH_DETAIL\r\n  ANIMATION_READY\r\n  VR_OPTIMIZED\r\n}\r\n\r\nenum DisputeReason {\r\n  FILE_CORRUPTED\r\n  NOT_AS_DESCRIBED\r\n  WRONG_DESCRIPTION\r\n  LICENSE_ISSUE\r\n  SELLER_UNRESPONSIVE\r\n  OTHER\r\n}\r\n\r\nenum NotificationType {\r\n  NEW_SALE\r\n  DISPUTE_OPENED\r\n  DISPUTE_RESPONSE\r\n  DISPUTE_RESOLVED\r\n  PAYOUT_REQUESTED\r\n  PAYOUT_PROCESSED\r\n  REVIEW_RECEIVED\r\n  PRODUCT_APPROVED\r\n  PRODUCT_REJECTED\r\n  ORDER_COMPLETED\r\n  APPLICATION_SUBMITTED\r\n  APPLICATION_APPROVED\r\n  APPLICATION_REJECTED\r\n  APPLICATION_REVISION_REQUESTED\r\n}\r\n\r\nenum PaymentType {\r\n  STRIPE\r\n  PAYPAL\r\n  BANK_TRANSFER\r\n  CRYPTO\r\n  LOCAL_GATEWAY\r\n}\r\n\r\nenum AIProcessingStatus {\r\n  PENDING\r\n  PROCESSING\r\n  COMPLETED\r\n  FAILED\r\n}\r\n\r\nenum AIJobType {\r\n  THUMBNAIL_GENERATION\r\n  TOPOLOGY_OPTIMIZATION\r\n  TAG_SUGGESTION\r\n  ISSUE_DETECTION\r\n  LOD_GENERATION\r\n  UV_OPTIMIZATION\r\n}\r\n\r\nenum IssueType {\r\n  NON_MANIFOLD_GEOMETRY\r\n  OVERLAPPING_FACES\r\n  FLIPPED_NORMALS\r\n  MISSING_UVS\r\n  UV_OVERLAP\r\n  ZERO_AREA_FACES\r\n  DUPLICATE_VERTICES\r\n  ISOLATED_VERTICES\r\n}\r\n\r\nenum IssueSeverity {\r\n  LOW\r\n  MEDIUM\r\n  HIGH\r\n  CRITICAL\r\n}\r\n\r\nenum JobOfferStatus {\r\n  PENDING\r\n  ACCEPTED\r\n  REJECTED\r\n  COMPLETED\r\n  CANCELLED\r\n}\r\n\r\nenum MessageType {\r\n  USER\r\n  SYSTEM\r\n  JOB_OFFER\r\n  DISPUTE_UPDATE\r\n  ADMIN\r\n}\r\n\r\nenum AccountType {\r\n  EMAIL\r\n  GOOGLE\r\n  BOTH\r\n}\r\n\r\nenum GiftCardStatus {\r\n  ACTIVE\r\n  REDEEMED\r\n  EXPIRED\r\n  VOIDED\r\n}\r\n\r\nenum StepStatus {\r\n  PENDING\r\n  IN_PROGRESS\r\n  COMPLETED\r\n  NEEDS_REVISION\r\n  SKIPPED\r\n}\r\n\r\nenum NoteType {\r\n  ADMIN_INTERNAL\r\n  USER_FACING\r\n  SYSTEM\r\n}\r\n\r\nenum AuditAction {\r\n  CREATED\r\n  SUBMITTED\r\n  APPROVED\r\n  REJECTED\r\n  REVISION_REQUESTED\r\n  REVISION_COMPLETED\r\n  REOPENED\r\n  CLOSED\r\n  PERSONA_INITIATED\r\n  PERSONA_COMPLETED\r\n  PERSONA_FAILED\r\n  PERSONA_OVERRIDDEN\r\n  STEP_COMPLETED\r\n  STEP_REVISION_REQUESTED\r\n  NOTE_ADDED\r\n  STATUS_CHANGED\r\n}\r\n\r\nenum PersonaStatus {\r\n  NOT_STARTED\r\n  PENDING\r\n  UNDER_REVIEW\r\n  VERIFIED\r\n  FAILED\r\n  OVERRIDDEN\r\n}\r\n\r\n// ============================================\r\n// LIVECHAT SYSTEM\r\n// ============================================\r\n\r\nmodel LiveChatSession {\r\n  id            String            @id @default(cuid())\r\n  sessionId     String            @unique\r\n  visitorId     String\r\n  visitorName   String?\r\n  visitorEmail  String?\r\n  status        ChatSessionStatus @default(WAITING)\r\n  assignedTo    String?\r\n  department    String?\r\n  startedAt     DateTime          @default(now())\r\n  endedAt       DateTime?\r\n  rating        Int?\r\n  feedback      String?\r\n  metadata      Json?\r\n  isAIHandled   Boolean           @default(false)\r\n  sentimentScore Float?\r\n  escalationReason String?\r\n  updatedAt     DateTime          @default(now()) @updatedAt\r\n  \r\n  messages      LiveChatMessage[]\r\n  assignee      User?             @relation(\"LiveChatAssignee\", fields: [assignedTo], references: [id])\r\n  visitor       LiveChatVisitor   @relation(fields: [visitorId], references: [id])\r\n  \r\n  @@index([status])\r\n  @@index([assignedTo])\r\n  @@index([startedAt])\r\n  @@map(\"livechat_sessions\")\r\n}\r\n\r\nmodel LiveChatMessage {\r\n  id          String          @id @default(cuid())\r\n  sessionId   String\r\n  senderId    String?\r\n  senderType  ChatSenderType\r\n  content     String\r\n  messageType ChatMessageType @default(TEXT)\r\n  attachments Json?\r\n  createdAt   DateTime        @default(now())\r\n  isRead      Boolean         @default(false)\r\n  isAI        Boolean         @default(false)\r\n  tokensUsed  Int?\r\n  \r\n  session     LiveChatSession @relation(fields: [sessionId], references: [id], onDelete: Cascade)\r\n  \r\n  @@index([sessionId])\r\n  @@index([createdAt])\r\n  @@map(\"livechat_messages\")\r\n}\r\n\r\nmodel LiveChatVisitor {\r\n  id          String    @id @default(cuid())\r\n  fingerprint String    @unique\r\n  name        String?\r\n  email       String?\r\n  phone       String?\r\n  country     String?\r\n  city        String?\r\n  userAgent   String?\r\n  ipAddress   String?\r\n  firstVisit  DateTime  @default(now())\r\n  lastVisit   DateTime  @updatedAt\r\n  pageViews   Int       @default(0)\r\n  totalChats  Int       @default(0)\r\n  isOnline    Boolean   @default(true)\r\n  currentPage String?\r\n  metadata    Json?\r\n  \r\n  sessions    LiveChatSession[]\r\n  pageHistory PageVisitHistory[]\r\n  \r\n  @@index([isOnline])\r\n  @@index([lastVisit])\r\n  @@map(\"livechat_visitors\")\r\n}\r\n\r\nmodel PageVisitHistory {\r\n  id        String    @id @default(cuid())\r\n  visitorId String\r\n  pageUrl   String\r\n  pageTitle String?\r\n  duration  Int?\r\n  visitedAt DateTime  @default(now())\r\n  \r\n  visitor   LiveChatVisitor @relation(fields: [visitorId], references: [id], onDelete: Cascade)\r\n  \r\n  @@index([visitorId])\r\n  @@index([visitedAt])\r\n  @@map(\"page_visit_history\")\r\n}\r\n\r\nmodel CannedResponse {\r\n  id        String    @id @default(cuid())\r\n  title     String\r\n  shortcut  String    @unique\r\n  content   String\r\n  category  String?\r\n  isActive  Boolean   @default(true)\r\n  createdBy String?\r\n  createdAt DateTime  @default(now())\r\n  updatedAt DateTime  @updatedAt\r\n  \r\n  @@index([shortcut])\r\n  @@index([category])\r\n  @@map(\"canned_responses\")\r\n}\r\n\r\nmodel LiveChatSettings {\r\n  id                    String    @id @default(cuid())\r\n  \r\n  // Appearance\r\n  widgetColor           String?   @default(\"#f97316\")\r\n  widgetPosition        String?   @default(\"bottom-right\")\r\n  widgetIcon            String?\r\n  welcomeMessage        String?   @default(\"Hi! How can we help you today?\")\r\n  offlineMessage        String?   @default(\"We're currently offline. Leave a message!\")\r\n  \r\n  // Eye Catcher\r\n  eyeCatcherEnabled     Boolean   @default(true)\r\n  eyeCatcherText        String?   @default(\"Need help? Chat with us!\")\r\n  eyeCatcherDelay       Int       @default(3000)\r\n  \r\n  // Operating Hours\r\n  operatingHoursEnabled Boolean   @default(false)\r\n  operatingHours        Json?\r\n  timezone              String?   @default(\"UTC\")\r\n  \r\n  // Features\r\n  soundEnabled          Boolean   @default(true)\r\n  fileShareEnabled      Boolean   @default(true)\r\n  maxFileSize           Int       @default(10)\r\n  allowedFileTypes      String[]  @default([\"image/*\", \"application/pdf\"])\r\n  \r\n  // AI & Translation\r\n  aiEnabled             Boolean   @default(false)\r\n  aiModel               String?   @default(\"gpt-4\")\r\n  aiSystemPrompt        String?\r\n  autoTranslateEnabled  Boolean   @default(false)\r\n  defaultLanguage       String?   @default(\"en\")\r\n  \r\n  // Voice/Video\r\n  voiceEnabled          Boolean   @default(false)\r\n  videoEnabled          Boolean   @default(false)\r\n  \r\n  createdAt             DateTime  @default(now())\r\n  updatedAt             DateTime  @updatedAt\r\n  \r\n  @@map(\"livechat_settings\")\r\n}\r\n\r\nmodel KnowledgeBaseArticle {\r\n  id        String   @id @default(cuid())\r\n  title     String\r\n  content   String   @db.Text\r\n  category  String?\r\n  tags      String[]\r\n  isActive  Boolean  @default(true)\r\n  createdAt DateTime @default(now())\r\n  updatedAt DateTime @updatedAt\r\n\r\n  @@map(\"knowledge_base_articles\")\r\n}\r\n\r\nmodel AIModelConfig {\r\n  id            String   @id @default(cuid())\r\n  modelName     String   // e.g., \"gpt-4\", \"claude-3\"\r\n  provider      String   // \"openai\", \"anthropic\"\r\n  apiKey        String?  // Encrypted or reference to env var\r\n  temperature   Float    @default(0.7)\r\n  maxTokens     Int      @default(1000)\r\n  systemPrompt  String   @db.Text\r\n  isActive      Boolean  @default(false)\r\n  createdAt     DateTime @default(now())\r\n  updatedAt     DateTime @updatedAt\r\n\r\n  @@map(\"ai_model_configs\")\r\n}\r\n\r\nmodel ChatbotAnalytics {\r\n  id             String   @id @default(cuid())\r\n  date           DateTime @default(now()) @db.Date\r\n  totalSessions  Int      @default(0)\r\n  aiHandled      Int      @default(0)\r\n  escalated      Int      @default(0)\r\n  avgResponseTime Float   @default(0)\r\n  sentimentScore Float    @default(0)\r\n\r\n  @@unique([date])\r\n  @@map(\"chatbot_analytics\")\r\n}\r\n\r\nmodel EmailCampaign {\r\n  id            String              @id @default(cuid())\r\n  name          String\r\n  subject       String\r\n  content       String\r\n  status        EmailCampaignStatus @default(DRAFT)\r\n  recipientType String?             @default(\"all\")\r\n  recipients    Json?\r\n  scheduledAt   DateTime?\r\n  sentAt        DateTime?\r\n  totalSent     Int                 @default(0)\r\n  totalOpened   Int                 @default(0)\r\n  totalClicked  Int                 @default(0)\r\n  createdBy     String?\r\n  createdAt     DateTime            @default(now())\r\n  updatedAt     DateTime            @updatedAt\r\n  \r\n  @@index([status])\r\n  @@index([scheduledAt])\r\n  @@map(\"email_campaigns\")\r\n}\r\n\r\nmodel SmtpSettings {\r\n  id            String    @id @default(cuid())\r\n  host          String?\r\n  port          Int?      @default(587)\r\n  username      String?\r\n  password      String?\r\n  encryption    String?   @default(\"tls\")\r\n  fromEmail     String?\r\n  fromName      String?\r\n  isActive      Boolean   @default(false)\r\n  createdAt     DateTime  @default(now())\r\n  updatedAt     DateTime  @updatedAt\r\n  \r\n  @@map(\"smtp_settings\")\r\n}\r\n\r\nmodel SocialIntegration {\r\n  id            String    @id @default(cuid())\r\n  platform      String    @unique\r\n  isEnabled     Boolean   @default(false)\r\n  apiKey        String?\r\n  apiSecret     String?\r\n  accessToken   String?\r\n  refreshToken  String?\r\n  webhookUrl    String?\r\n  config        Json?\r\n  createdAt     DateTime  @default(now())\r\n  updatedAt     DateTime  @updatedAt\r\n  \r\n  @@map(\"social_integrations\")\r\n}\r\n\r\nmodel SecuritySettings {\r\n  id                      String    @id @default(cuid())\r\n  \r\n  // Country Restrictions\r\n  countryRestrictions     Boolean   @default(false)\r\n  allowedCountries        String[]  @default([])\r\n  blockedCountries        String[]  @default([])\r\n  \r\n  // DoS Protection\r\n  dosProtectionEnabled    Boolean   @default(true)\r\n  maxRequestsPerMinute    Int       @default(100)\r\n  blockDuration           Int       @default(3600)\r\n  \r\n  // Domain Settings\r\n  allowedDomains          String[]  @default([])\r\n  \r\n  createdAt               DateTime  @default(now())\r\n  updatedAt               DateTime  @updatedAt\r\n  \r\n  @@map(\"security_settings\")\r\n}\r\n\r\n// Livechat Enums\r\nenum ChatSessionStatus {\r\n  WAITING\r\n  ACTIVE\r\n  CLOSED\r\n  MISSED\r\n}\r\n\r\nenum ChatSenderType {\r\n  VISITOR\r\n  AGENT\r\n  BOT\r\n  SYSTEM\r\n}\r\n\r\nenum ChatMessageType {\r\n  TEXT\r\n  IMAGE\r\n  FILE\r\n  VOICE\r\n  VIDEO\r\n  SYSTEM\r\n}\r\n\r\nenum EmailCampaignStatus {\r\n  DRAFT\r\n  SCHEDULED\r\n  SENDING\r\n  SENT\r\n  CANCELLED\r\n}\r\n\r\n// ============================================================================\r\n// App System Module\r\n// ============================================================================\r\n\r\nenum AppStatus {\r\n  PENDING\r\n  APPROVED\r\n  SUSPENDED\r\n  REJECTED\r\n}\r\n\r\nenum InstallationStatus {\r\n  ACTIVE\r\n  SUSPENDED\r\n  UNINSTALLED\r\n}\r\n\r\nmodel App {\r\n  id              String      @id @default(cuid())\r\n  name            String\r\n  slug            String      @unique\r\n  description     String?     @db.Text\r\n  shortDescription String?\r\n  icon            String?\r\n  screenshots     Json?       // Array of screenshot URLs\r\n  status          AppStatus   @default(PENDING)\r\n  category        String?     // e.g., \"marketing\", \"analytics\", \"shipping\"\r\n  \r\n  // Developer Info\r\n  createdByAdmin  Boolean     @default(false)\r\n  developerId     String?\r\n  developer       User?       @relation(\"AppDeveloper\", fields: [developerId], references: [id])\r\n  developerName   String?\r\n  developerEmail  String?\r\n  developerUrl    String?\r\n  privacyPolicyUrl String?\r\n  termsOfServiceUrl String?\r\n  \r\n  // Webhook Configuration\r\n  webhookSecret   String?     // For signing webhook payloads\r\n  \r\n  // Pricing\r\n  pricingType     String?     @default(\"free\") // free, paid, freemium\r\n  price           Float?\r\n  \r\n  // Stats\r\n  installCount    Int         @default(0)\r\n  rating          Float       @default(0)\r\n  reviewCount     Int         @default(0)\r\n  \r\n  // Review/Moderation\r\n  reviewedBy      String?\r\n  reviewedAt      DateTime?\r\n  rejectionReason String?\r\n  suspensionReason String?\r\n  \r\n  createdAt       DateTime    @default(now())\r\n  updatedAt       DateTime    @updatedAt\r\n  \r\n  // Relations\r\n  permissions     AppPermission[]\r\n  installations   MerchantAppInstallation[]\r\n  webhooks        AppWebhook[]\r\n  activityLogs    AppActivityLog[]\r\n  reviews         AppReview[]\r\n  \r\n  @@index([status])\r\n  @@index([category])\r\n  @@index([createdAt])\r\n  @@index([slug])\r\n  @@map(\"apps\")\r\n}\r\n\r\nmodel AppPermission {\r\n  id          String   @id @default(cuid())\r\n  appId       String\r\n  permission  String   // e.g., \"read_orders\", \"write_products\"\r\n  description String?  // Human-readable description\r\n  isRequired  Boolean  @default(true)\r\n  \r\n  app         App      @relation(fields: [appId], references: [id], onDelete: Cascade)\r\n  \r\n  @@unique([appId, permission])\r\n  @@index([appId])\r\n  @@map(\"app_permissions\")\r\n}\r\n\r\nmodel MerchantAppInstallation {\r\n  id                  String             @id @default(cuid())\r\n  vendorId            String\r\n  appId               String\r\n  accessToken         String             // Hashed token\r\n  accessTokenPrefix   String?            // First 8 chars for identification\r\n  permissionsSnapshot Json               // Permissions at installation time\r\n  status              InstallationStatus @default(ACTIVE)\r\n  \r\n  // Suspension info\r\n  suspendedAt         DateTime?\r\n  suspendedBy         String?            // Admin user ID\r\n  suspensionReason    String?\r\n  \r\n  installedAt         DateTime           @default(now())\r\n  uninstalledAt       DateTime?\r\n  lastUsedAt          DateTime?\r\n  \r\n  // Relations\r\n  vendor              Vendor             @relation(fields: [vendorId], references: [id], onDelete: Cascade)\r\n  app                 App                @relation(fields: [appId], references: [id], onDelete: Cascade)\r\n  activityLogs        AppActivityLog[]\r\n  \r\n  @@unique([vendorId, appId])\r\n  @@index([vendorId])\r\n  @@index([appId])\r\n  @@index([status])\r\n  @@index([accessToken])\r\n  @@map(\"merchant_app_installations\")\r\n}\r\n\r\nmodel AppWebhook {\r\n  id          String   @id @default(cuid())\r\n  appId       String\r\n  event       String   // e.g., \"order.created\", \"product.updated\"\r\n  targetUrl   String\r\n  isActive    Boolean  @default(true)\r\n  \r\n  // Delivery stats\r\n  lastDeliveredAt DateTime?\r\n  failureCount    Int      @default(0)\r\n  \r\n  createdAt   DateTime @default(now())\r\n  updatedAt   DateTime @updatedAt\r\n  \r\n  app         App      @relation(fields: [appId], references: [id], onDelete: Cascade)\r\n  \r\n  @@unique([appId, event])\r\n  @@index([appId])\r\n  @@index([event])\r\n  @@index([isActive])\r\n  @@map(\"app_webhooks\")\r\n}\r\n\r\nmodel AppActivityLog {\r\n  id              String   @id @default(cuid())\r\n  vendorId        String?\r\n  appId           String\r\n  installationId  String?\r\n  \r\n  action          String   // e.g., \"api_call\", \"webhook_sent\", \"token_regenerated\"\r\n  endpoint        String?  // API endpoint accessed\r\n  method          String?  // HTTP method\r\n  statusCode      Int?     // Response status code\r\n  metadata        Json?    // Additional context\r\n  \r\n  ipAddress       String?\r\n  userAgent       String?\r\n  \r\n  createdAt       DateTime @default(now())\r\n  \r\n  app             App      @relation(fields: [appId], references: [id], onDelete: Cascade)\r\n  installation    MerchantAppInstallation? @relation(fields: [installationId], references: [id], onDelete: SetNull)\r\n  \r\n  @@index([appId])\r\n  @@index([vendorId])\r\n  @@index([installationId])\r\n  @@index([action])\r\n  @@index([createdAt])\r\n  @@map(\"app_activity_logs\")\r\n}\r\n\r\nmodel AppReview {\r\n  id          String   @id @default(cuid())\r\n  appId       String\r\n  vendorId    String\r\n  rating      Int      // 1-5\r\n  comment     String?  @db.Text\r\n  \r\n  createdAt   DateTime @default(now())\r\n  updatedAt   DateTime @updatedAt\r\n  \r\n  app         App      @relation(fields: [appId], references: [id], onDelete: Cascade)\r\n  vendor      Vendor   @relation(fields: [vendorId], references: [id], onDelete: Cascade)\r\n  \r\n  @@unique([appId, vendorId]) // One review per vendor per app\r\n  @@index([appId])\r\n  @@index([vendorId])\r\n  @@map(\"app_reviews\")\r\n}\r\n\r\nmodel TicketMessage {\r\n  id          String        @id @default(cuid())\r\n  ticketId    String\r\n  userId      String\r\n  content     String\r\n  attachments Json?\r\n  isInternal  Boolean       @default(false)\r\n  createdAt   DateTime      @default(now())\r\n  updatedAt   DateTime      @updatedAt\r\n\r\n  ticket      SupportTicket @relation(fields: [ticketId], references: [id], onDelete: Cascade)\r\n  user        User          @relation(fields: [userId], references: [id])\r\n\r\n  @@index([ticketId])\r\n  @@index([userId])\r\n  @@map(\"ticket_messages\")\r\n}\r\n\r\nmodel MarketingCampaign {\r\n  id          String         @id @default(cuid())\r\n  vendorId    String\r\n  name        String\r\n  status      CampaignStatus @default(DRAFT)\r\n  budget      Float?\r\n  startDate   DateTime?\r\n  endDate     DateTime?\r\n  sessions    Int            @default(0)\r\n  sales       Float          @default(0)\r\n  orders      Int            @default(0)\r\n  createdAt   DateTime       @default(now())\r\n  updatedAt   DateTime       @updatedAt\r\n  vendor      Vendor         @relation(fields: [vendorId], references: [id], onDelete: Cascade)\r\n\r\n  @@index([vendorId])\r\n  @@map(\"marketing_campaigns\")\r\n}\r\n\r\nmodel MarketingAutomation {\r\n  id          String           @id @default(cuid())\r\n  vendorId    String\r\n  name        String\r\n  type        AutomationType\r\n  status      AutomationStatus @default(INACTIVE)\r\n  createdAt   DateTime         @default(now())\r\n  updatedAt   DateTime         @updatedAt\r\n  vendor      Vendor           @relation(fields: [vendorId], references: [id], onDelete: Cascade)\r\n\r\n  @@index([vendorId])\r\n  @@map(\"marketing_automations\")\r\n}\r\n\r\nenum CampaignStatus {\r\n  DRAFT\r\n  ACTIVE\r\n  PAUSED\r\n  COMPLETED\r\n}\r\n\r\nenum AutomationType {\r\n  ABANDONED_CART\r\n  ABANDONED_CHECKOUT\r\n  WELCOME_SERIES\r\n  POST_PURCHASE\r\n}\r\n\r\nenum AutomationStatus {\r\n  ACTIVE\r\n  INACTIVE\r\n}\r\n\r\nmodel Segment {\r\n  id          String   @id @default(cuid())\r\n  vendorId    String\r\n  name        String\r\n  query       String   @db.Text\r\n  description String?\r\n  createdAt   DateTime @default(now())\r\n  updatedAt   DateTime @updatedAt\r\n  vendor      Vendor   @relation(fields: [vendorId], references: [id], onDelete: Cascade)\r\n\r\n  @@index([vendorId])\r\n  @@map(\"segments\")\r\n}\r\n\r\n// ============================================\r\n// SHIPPING SYSTEM\r\n// ============================================\r\n\r\nmodel ShippingProfile {\r\n  id          String   @id @default(cuid())\r\n  vendorId    String\r\n  name        String   // \"General Profile\" or custom\r\n  isGeneral   Boolean  @default(false)\r\n  \r\n  originAddress Json?  // { country, state, city, zip, address1, address2, phone }\r\n  \r\n  zones       ShippingZone[]\r\n  products    Product[] // Relation to products assigned to this profile (needs update in Product model if not using default)\r\n  \r\n  createdAt   DateTime @default(now())\r\n  updatedAt   DateTime @updatedAt\r\n  \r\n  vendor      Vendor   @relation(fields: [vendorId], references: [id], onDelete: Cascade)\r\n\r\n  @@index([vendorId])\r\n  @@map(\"shipping_profiles\")\r\n}\r\n\r\nmodel ShippingZone {\r\n  id          String   @id @default(cuid())\r\n  profileId   String\r\n  name        String\r\n  countries   String[] // Array of country codes [\"US\", \"CA\"]\r\n  regions     Json?    // Specific regions/states if needed\r\n  \r\n  rates       ShippingRate[]\r\n  \r\n  createdAt   DateTime @default(now())\r\n  updatedAt   DateTime @updatedAt\r\n  \r\n  profile     ShippingProfile @relation(fields: [profileId], references: [id], onDelete: Cascade)\r\n\r\n  @@index([profileId])\r\n  @@map(\"shipping_zones\")\r\n}\r\n\r\nmodel ShippingRate {\r\n  id              String   @id @default(cuid())\r\n  zoneId          String\r\n  name            String   // \"Standard\", \"Express\"\r\n  type            String   // \"price\", \"weight\", \"calculated\"\r\n  \r\n  price           Float    @default(0)\r\n  currency        String   @default(\"USD\")\r\n  \r\n  minCondition    Float?   // Min weight or price\r\n  maxCondition    Float?   // Max weight or price\r\n  \r\n  // For calculated rates (Carrier)\r\n  carrierService  String?\r\n  \r\n  // Delivery time\r\n  minDeliveryDays Int?\r\n  maxDeliveryDays Int?\r\n  \r\n  createdAt       DateTime @default(now())\r\n  updatedAt       DateTime @updatedAt\r\n  \r\n  zone            ShippingZone @relation(fields: [zoneId], references: [id], onDelete: Cascade)\r\n\r\n  @@index([zoneId])\r\n  @@map(\"shipping_rates\")\r\n}\r\n\r\nmodel LocalDeliverySetting {\r\n  id                  String   @id @default(cuid())\r\n  vendorId            String   @unique\r\n  isEnabled           Boolean  @default(false)\r\n  \r\n  deliveryZoneType    String   @default(\"radius\") // \"radius\" or \"postal\"\r\n  \r\n  // Radius settings\r\n  radiusValue         Float?\r\n  radiusUnit          String?  @default(\"km\") // \"km\" or \"mi\"\r\n  includeNeighboring  Boolean  @default(false)\r\n  \r\n  // Postal settings\r\n  postalCodes         String[]\r\n  \r\n  // Pricing\r\n  price               Float    @default(0)\r\n  currency            String   @default(\"USD\")\r\n  minOrderPrice       Float?\r\n  deliveryInfo        String?  @db.Text\r\n  \r\n  createdAt           DateTime @default(now())\r\n  updatedAt           DateTime @updatedAt\r\n  \r\n  vendor              Vendor   @relation(fields: [vendorId], references: [id], onDelete: Cascade)\r\n\r\n  @@map(\"local_delivery_settings\")\r\n}\r\n\r\nmodel PickupSetting {\r\n  id                  String   @id @default(cuid())\r\n  vendorId            String   @unique\r\n  isEnabled           Boolean  @default(false)\r\n  \r\n  expectedPickupTime  String   @default(\"24hours\") // \"1hour\", \"24hours\", \"2days\", etc.\r\n  pickupInstructions  String?  @db.Text\r\n  \r\n  createdAt           DateTime @default(now())\r\n  updatedAt           DateTime @updatedAt\r\n  \r\n  vendor              Vendor   @relation(fields: [vendorId], references: [id], onDelete: Cascade)\r\n\r\n  @@map(\"pickup_settings\")\r\n}\r\n\r\nmodel SavedPackage {\r\n  id              String   @id @default(cuid())\r\n  vendorId        String\r\n  name            String\r\n  type            String   // \"box\", \"envelope\", \"soft\"\r\n  \r\n  length          Float?\r\n  width           Float?\r\n  height          Float?\r\n  dimensionUnit   String   @default(\"cm\") // \"cm\", \"in\"\r\n  \r\n  weight          Float?\r\n  weightUnit      String   @default(\"kg\") // \"kg\", \"g\", \"lb\", \"oz\"\r\n  \r\n  isDefault       Boolean  @default(false)\r\n  \r\n  createdAt       DateTime @default(now())\r\n  updatedAt       DateTime @updatedAt\r\n  \r\n  vendor          Vendor   @relation(fields: [vendorId], references: [id], onDelete: Cascade)\r\n\r\n  @@index([vendorId])\r\n  @@map(\"saved_packages\")\r\n}\r\n",
  "inlineSchemaHash": "28aac1a018ceb59c55fec87a8c418dd7b7f7624c0cc3649de8aa0d74684b3bc9",
  "copyEngine": true
}
config.dirname = '/'

config.runtimeDataModel = JSON.parse("{\"models\":{\"User\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"email\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"role\",\"kind\":\"enum\",\"type\":\"Role\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"password\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"rememberToken\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"image\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"accountType\",\"kind\":\"enum\",\"type\":\"AccountType\"},{\"name\":\"softwarePreferences\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"twoFactorEnabled\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"twoFactorSecret\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"addresses\",\"kind\":\"object\",\"type\":\"Address\",\"relationName\":\"AddressToUser\"},{\"name\":\"adminAccount\",\"kind\":\"object\",\"type\":\"AdminAccount\",\"relationName\":\"AdminAccountToUser\"},{\"name\":\"affiliates\",\"kind\":\"object\",\"type\":\"Affiliate\",\"relationName\":\"UserAffiliates\"},{\"name\":\"announcements\",\"kind\":\"object\",\"type\":\"Announcement\",\"relationName\":\"AnnouncementToUser\"},{\"name\":\"auditLogs\",\"kind\":\"object\",\"type\":\"AuditLog\",\"relationName\":\"AuditLogToUser\"},{\"name\":\"bannedByEntries\",\"kind\":\"object\",\"type\":\"BannedUser\",\"relationName\":\"BannedByUsers\"},{\"name\":\"bannedUsers\",\"kind\":\"object\",\"type\":\"BannedUser\",\"relationName\":\"BannedUserToUser\"},{\"name\":\"cart\",\"kind\":\"object\",\"type\":\"Cart\",\"relationName\":\"CartToUser\"},{\"name\":\"cmsPages\",\"kind\":\"object\",\"type\":\"CmsPage\",\"relationName\":\"CmsPageToUser\"},{\"name\":\"content\",\"kind\":\"object\",\"type\":\"Content\",\"relationName\":\"ContentToUser\"},{\"name\":\"conversations\",\"kind\":\"object\",\"type\":\"ConversationParticipant\",\"relationName\":\"ConversationParticipantToUser\"},{\"name\":\"customerConversations\",\"kind\":\"object\",\"type\":\"Conversation\",\"relationName\":\"CustomerConversations\"},{\"name\":\"couponUsages\",\"kind\":\"object\",\"type\":\"CouponUsage\",\"relationName\":\"CouponUsers\"},{\"name\":\"cryptoWallets\",\"kind\":\"object\",\"type\":\"CryptoWallet\",\"relationName\":\"CryptoWalletToUser\"},{\"name\":\"uploadedFiles\",\"kind\":\"object\",\"type\":\"DigitalFile\",\"relationName\":\"DigitalFileUploaders\"},{\"name\":\"disputeParticipants\",\"kind\":\"object\",\"type\":\"DisputeParticipant\",\"relationName\":\"DisputeParticipantToUser\"},{\"name\":\"disputesInitiated\",\"kind\":\"object\",\"type\":\"Dispute\",\"relationName\":\"UserDisputes\"},{\"name\":\"escrowAccounts\",\"kind\":\"object\",\"type\":\"EscrowAccount\",\"relationName\":\"EscrowAccountToUser\"},{\"name\":\"following\",\"kind\":\"object\",\"type\":\"Follow\",\"relationName\":\"UserFollowing\"},{\"name\":\"jobOffersAsCustomer\",\"kind\":\"object\",\"type\":\"JobOffer\",\"relationName\":\"CustomerJobOffers\"},{\"name\":\"receivedMessages\",\"kind\":\"object\",\"type\":\"Message\",\"relationName\":\"ReceivedMessages\"},{\"name\":\"sentMessages\",\"kind\":\"object\",\"type\":\"Message\",\"relationName\":\"SentMessages\"},{\"name\":\"notifications\",\"kind\":\"object\",\"type\":\"Notification\",\"relationName\":\"NotificationToUser\"},{\"name\":\"orders\",\"kind\":\"object\",\"type\":\"Order\",\"relationName\":\"UserOrders\"},{\"name\":\"productVersions\",\"kind\":\"object\",\"type\":\"ProductVersion\",\"relationName\":\"ProductVersionUploaders\"},{\"name\":\"generatedReports\",\"kind\":\"object\",\"type\":\"Report\",\"relationName\":\"ReportGenerators\"},{\"name\":\"reviews\",\"kind\":\"object\",\"type\":\"Review\",\"relationName\":\"ReviewToUser\"},{\"name\":\"sellerReviews\",\"kind\":\"object\",\"type\":\"SellerReview\",\"relationName\":\"UserSellerReviews\"},{\"name\":\"transactions\",\"kind\":\"object\",\"type\":\"Transaction\",\"relationName\":\"TransactionToUser\"},{\"name\":\"vendorApplicationReviews\",\"kind\":\"object\",\"type\":\"VendorApplication\",\"relationName\":\"VendorApplicationReviewers\"},{\"name\":\"vendorApplicationRevisionRequests\",\"kind\":\"object\",\"type\":\"VendorApplication\",\"relationName\":\"VendorApplicationRevisionRequesters\"},{\"name\":\"vendorApplicationPersonaOverrides\",\"kind\":\"object\",\"type\":\"VendorApplication\",\"relationName\":\"VendorApplicationPersonaOverriders\"},{\"name\":\"applicationNotes\",\"kind\":\"object\",\"type\":\"ApplicationNote\",\"relationName\":\"ApplicationNoteAuthors\"},{\"name\":\"applicationAuditLogs\",\"kind\":\"object\",\"type\":\"ApplicationAuditLog\",\"relationName\":\"AuditLogPerformers\"},{\"name\":\"vendors\",\"kind\":\"object\",\"type\":\"Vendor\",\"relationName\":\"UserVendors\"},{\"name\":\"wallet\",\"kind\":\"object\",\"type\":\"Wallet\",\"relationName\":\"UserToWallet\"},{\"name\":\"wishlist\",\"kind\":\"object\",\"type\":\"Wishlist\",\"relationName\":\"UserToWishlist\"},{\"name\":\"processedWithdrawals\",\"kind\":\"object\",\"type\":\"Withdrawal\",\"relationName\":\"WithdrawalProcessors\"},{\"name\":\"giftCardRedemptions\",\"kind\":\"object\",\"type\":\"GiftCardRedemption\",\"relationName\":\"GiftCardRedemptionToUser\"},{\"name\":\"canHandleLiveChat\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"assignedLiveChatSessions\",\"kind\":\"object\",\"type\":\"LiveChatSession\",\"relationName\":\"LiveChatAssignee\"},{\"name\":\"developedApps\",\"kind\":\"object\",\"type\":\"App\",\"relationName\":\"AppDeveloper\"},{\"name\":\"supportTickets\",\"kind\":\"object\",\"type\":\"SupportTicket\",\"relationName\":\"SupportTicketToUser\"},{\"name\":\"supportTicketsAssigned\",\"kind\":\"object\",\"type\":\"SupportTicket\",\"relationName\":\"SupportTicketAssignees\"},{\"name\":\"supportTicketsResolved\",\"kind\":\"object\",\"type\":\"SupportTicket\",\"relationName\":\"support_tickets_resolvedByTousers\"},{\"name\":\"ticketMessages\",\"kind\":\"object\",\"type\":\"TicketMessage\",\"relationName\":\"TicketMessageToUser\"}],\"dbName\":\"users\"},\"Vendor\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"avatar\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"averageRating\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"bio\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"coverImage\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"featuredLayout\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"location\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"socialLinks\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"specializations\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"themeColor\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"totalFollowers\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"totalReviews\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"isVerified\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"totalSales\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"affiliates\",\"kind\":\"object\",\"type\":\"Affiliate\",\"relationName\":\"AffiliateToVendor\"},{\"name\":\"conversations\",\"kind\":\"object\",\"type\":\"Conversation\",\"relationName\":\"VendorConversations\"},{\"name\":\"coupons\",\"kind\":\"object\",\"type\":\"Coupon\",\"relationName\":\"CouponToVendor\"},{\"name\":\"discounts\",\"kind\":\"object\",\"type\":\"Discount\",\"relationName\":\"DiscountToVendor\"},{\"name\":\"escrowAccount\",\"kind\":\"object\",\"type\":\"EscrowAccount\",\"relationName\":\"EscrowAccountToVendor\"},{\"name\":\"followers\",\"kind\":\"object\",\"type\":\"Follow\",\"relationName\":\"VendorFollowers\"},{\"name\":\"invoices\",\"kind\":\"object\",\"type\":\"Invoice\",\"relationName\":\"InvoiceToVendor\"},{\"name\":\"jobOffersAsVendor\",\"kind\":\"object\",\"type\":\"JobOffer\",\"relationName\":\"VendorJobOffers\"},{\"name\":\"notificationSetting\",\"kind\":\"object\",\"type\":\"NotificationSetting\",\"relationName\":\"NotificationSettingToVendor\"},{\"name\":\"orders\",\"kind\":\"object\",\"type\":\"Order\",\"relationName\":\"VendorOrders\"},{\"name\":\"products\",\"kind\":\"object\",\"type\":\"Product\",\"relationName\":\"ProductToVendor\"},{\"name\":\"promotions\",\"kind\":\"object\",\"type\":\"Promotion\",\"relationName\":\"PromotionToVendor\"},{\"name\":\"sellerReviews\",\"kind\":\"object\",\"type\":\"SellerReview\",\"relationName\":\"SellerReviewToVendor\"},{\"name\":\"shippingSetting\",\"kind\":\"object\",\"type\":\"ShippingSetting\",\"relationName\":\"ShippingSettingToVendor\"},{\"name\":\"taxSetting\",\"kind\":\"object\",\"type\":\"TaxSetting\",\"relationName\":\"TaxSettingToVendor\"},{\"name\":\"vendorApplication\",\"kind\":\"object\",\"type\":\"VendorApplication\",\"relationName\":\"VendorToVendorApplication\"},{\"name\":\"badges\",\"kind\":\"object\",\"type\":\"VendorBadge\",\"relationName\":\"VendorToVendorBadge\"},{\"name\":\"payoutMethods\",\"kind\":\"object\",\"type\":\"VendorPayoutMethod\",\"relationName\":\"VendorPayoutMethods\"},{\"name\":\"softwareTools\",\"kind\":\"object\",\"type\":\"VendorSoftwareTool\",\"relationName\":\"VendorToVendorSoftwareTool\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"UserVendors\"},{\"name\":\"withdrawals\",\"kind\":\"object\",\"type\":\"Withdrawal\",\"relationName\":\"VendorToWithdrawal\"},{\"name\":\"giftCards\",\"kind\":\"object\",\"type\":\"GiftCard\",\"relationName\":\"GiftCardToVendor\"},{\"name\":\"appInstallations\",\"kind\":\"object\",\"type\":\"MerchantAppInstallation\",\"relationName\":\"MerchantAppInstallationToVendor\"},{\"name\":\"appReviews\",\"kind\":\"object\",\"type\":\"AppReview\",\"relationName\":\"AppReviewToVendor\"},{\"name\":\"marketingCampaigns\",\"kind\":\"object\",\"type\":\"MarketingCampaign\",\"relationName\":\"MarketingCampaignToVendor\"},{\"name\":\"marketingAutomations\",\"kind\":\"object\",\"type\":\"MarketingAutomation\",\"relationName\":\"MarketingAutomationToVendor\"},{\"name\":\"shippingProfiles\",\"kind\":\"object\",\"type\":\"ShippingProfile\",\"relationName\":\"ShippingProfileToVendor\"},{\"name\":\"localDeliverySettings\",\"kind\":\"object\",\"type\":\"LocalDeliverySetting\",\"relationName\":\"LocalDeliverySettingToVendor\"},{\"name\":\"pickupSettings\",\"kind\":\"object\",\"type\":\"PickupSetting\",\"relationName\":\"PickupSettingToVendor\"},{\"name\":\"savedPackages\",\"kind\":\"object\",\"type\":\"SavedPackage\",\"relationName\":\"SavedPackageToVendor\"},{\"name\":\"segments\",\"kind\":\"object\",\"type\":\"Segment\",\"relationName\":\"SegmentToVendor\"}],\"dbName\":\"vendors\"},\"VendorPayoutMethod\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"vendorId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"type\",\"kind\":\"enum\",\"type\":\"PaymentType\"},{\"name\":\"label\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"details\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"isDefault\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"isActive\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"vendor\",\"kind\":\"object\",\"type\":\"Vendor\",\"relationName\":\"VendorPayoutMethods\"}],\"dbName\":\"vendor_payout_methods\"},\"Collection\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"slug\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"icon\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"image\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"order\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"isActive\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"categories\",\"kind\":\"object\",\"type\":\"Category\",\"relationName\":\"CategoryToCollection\"}],\"dbName\":\"collections\"},\"Category\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"slug\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"isActive\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"parentId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"collectionId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"collection\",\"kind\":\"object\",\"type\":\"Collection\",\"relationName\":\"CategoryToCollection\"},{\"name\":\"parent\",\"kind\":\"object\",\"type\":\"Category\",\"relationName\":\"CategoryRelation\"},{\"name\":\"children\",\"kind\":\"object\",\"type\":\"Category\",\"relationName\":\"CategoryRelation\"},{\"name\":\"products\",\"kind\":\"object\",\"type\":\"Product\",\"relationName\":\"CategoryToProduct\"}],\"dbName\":\"categories\"},\"Product\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"price\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"currency\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"categoryId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"vendorId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"fileUrl\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"thumbnail\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"isActive\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"status\",\"kind\":\"enum\",\"type\":\"ProductStatus\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"assetDetails\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"includedResolution\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"availableResolutions\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"height\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"width\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"depth\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"meshCount\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"textureFiles\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"nativeFileFormats\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"universalFileFormats\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"addonSupport\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"licenseInfo\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"currentVersion\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"images\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"isDraft\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"reviewNotes\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"downloads\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"likes\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"views\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"geometryType\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"hasLOD\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"isAnimated\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"isRigged\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"lodLevels\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"materialType\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"polygonCount\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"renderEngine\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"softwareCompatibility\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"verticesCount\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"aiIssuesDetected\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"aiLodGenerated\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"aiProcessedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"aiProcessingStatus\",\"kind\":\"enum\",\"type\":\"AIProcessingStatus\"},{\"name\":\"aiTagsSuggested\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"aiThumbnailGenerated\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"aiTopologyScore\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"aiUvQualityScore\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"aiProcessingJobs\",\"kind\":\"object\",\"type\":\"AIProcessingJob\",\"relationName\":\"AIProcessingJobToProduct\"},{\"name\":\"cartItems\",\"kind\":\"object\",\"type\":\"CartItem\",\"relationName\":\"CartItemToProduct\"},{\"name\":\"digitalFiles\",\"kind\":\"object\",\"type\":\"DigitalFile\",\"relationName\":\"DigitalFileToProduct\"},{\"name\":\"disputes\",\"kind\":\"object\",\"type\":\"Dispute\",\"relationName\":\"DisputeToProduct\"},{\"name\":\"orders\",\"kind\":\"object\",\"type\":\"OrderItem\",\"relationName\":\"OrderItemToProduct\"},{\"name\":\"badges\",\"kind\":\"object\",\"type\":\"ProductBadge\",\"relationName\":\"ProductToProductBadge\"},{\"name\":\"productIssues\",\"kind\":\"object\",\"type\":\"ProductIssue\",\"relationName\":\"ProductToProductIssue\"},{\"name\":\"productTags\",\"kind\":\"object\",\"type\":\"ProductTag\",\"relationName\":\"ProductToProductTag\"},{\"name\":\"versions\",\"kind\":\"object\",\"type\":\"ProductVersion\",\"relationName\":\"ProductToProductVersion\"},{\"name\":\"category\",\"kind\":\"object\",\"type\":\"Category\",\"relationName\":\"CategoryToProduct\"},{\"name\":\"vendor\",\"kind\":\"object\",\"type\":\"Vendor\",\"relationName\":\"ProductToVendor\"},{\"name\":\"reviews\",\"kind\":\"object\",\"type\":\"Review\",\"relationName\":\"ProductToReview\"},{\"name\":\"wishlistedBy\",\"kind\":\"object\",\"type\":\"Wishlist\",\"relationName\":\"ProductToWishlist\"},{\"name\":\"tags\",\"kind\":\"object\",\"type\":\"Tag\",\"relationName\":\"ProductTags\"},{\"name\":\"shippingProfileId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"shippingProfile\",\"kind\":\"object\",\"type\":\"ShippingProfile\",\"relationName\":\"ProductToShippingProfile\"},{\"name\":\"featuredCollections\",\"kind\":\"object\",\"type\":\"FeaturedCollection\",\"relationName\":\"ProductFeaturedCollections\"}],\"dbName\":\"products\"},\"FeaturedCollection\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"title\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"identifier\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"isActive\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"products\",\"kind\":\"object\",\"type\":\"Product\",\"relationName\":\"ProductFeaturedCollections\"}],\"dbName\":\"featured_collections\"},\"EscrowAccount\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"vendorId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"balance\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"currency\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"availableBalance\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"holdUntil\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"EscrowAccountToUser\"},{\"name\":\"vendor\",\"kind\":\"object\",\"type\":\"Vendor\",\"relationName\":\"EscrowAccountToVendor\"},{\"name\":\"transactions\",\"kind\":\"object\",\"type\":\"EscrowTransaction\",\"relationName\":\"EscrowAccountToEscrowTransaction\"}],\"dbName\":\"escrow_accounts\"},\"EscrowTransaction\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"escrowAccountId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"orderId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"amount\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"type\",\"kind\":\"enum\",\"type\":\"EscrowTransactionType\"},{\"name\":\"status\",\"kind\":\"enum\",\"type\":\"EscrowTransactionStatus\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"escrowAccount\",\"kind\":\"object\",\"type\":\"EscrowAccount\",\"relationName\":\"EscrowAccountToEscrowTransaction\"},{\"name\":\"order\",\"kind\":\"object\",\"type\":\"Order\",\"relationName\":\"EscrowTransactionToOrder\"}],\"dbName\":\"escrow_transactions\"},\"Order\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"vendorId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"totalAmount\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"currency\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"status\",\"kind\":\"enum\",\"type\":\"OrderStatus\"},{\"name\":\"paymentId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"cryptoPayment\",\"kind\":\"object\",\"type\":\"CryptoPayment\",\"relationName\":\"CryptoPaymentToOrder\"},{\"name\":\"dispute\",\"kind\":\"object\",\"type\":\"Dispute\",\"relationName\":\"DisputeToOrder\"},{\"name\":\"escrowTransaction\",\"kind\":\"object\",\"type\":\"EscrowTransaction\",\"relationName\":\"EscrowTransactionToOrder\"},{\"name\":\"items\",\"kind\":\"object\",\"type\":\"OrderItem\",\"relationName\":\"OrderToOrderItem\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"UserOrders\"},{\"name\":\"vendor\",\"kind\":\"object\",\"type\":\"Vendor\",\"relationName\":\"VendorOrders\"},{\"name\":\"payment\",\"kind\":\"object\",\"type\":\"Payment\",\"relationName\":\"OrderToPayment\"},{\"name\":\"refunds\",\"kind\":\"object\",\"type\":\"Refund\",\"relationName\":\"OrderToRefund\"},{\"name\":\"sellerReviews\",\"kind\":\"object\",\"type\":\"SellerReview\",\"relationName\":\"OrderSellerReviews\"}],\"dbName\":\"orders\"},\"Payment\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"orderId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"amount\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"currency\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"provider\",\"kind\":\"enum\",\"type\":\"PaymentGateway\"},{\"name\":\"status\",\"kind\":\"enum\",\"type\":\"PaymentStatus\"},{\"name\":\"transactionId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"metadata\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"order\",\"kind\":\"object\",\"type\":\"Order\",\"relationName\":\"OrderToPayment\"}],\"dbName\":\"payments\"},\"Transaction\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"type\",\"kind\":\"enum\",\"type\":\"TransactionType\"},{\"name\":\"amount\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"currency\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"status\",\"kind\":\"enum\",\"type\":\"TransactionStatus\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"referenceId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"metadata\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"TransactionToUser\"}],\"dbName\":\"transactions\"},\"OrderItem\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"orderId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"productId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"quantity\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"price\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"order\",\"kind\":\"object\",\"type\":\"Order\",\"relationName\":\"OrderToOrderItem\"},{\"name\":\"product\",\"kind\":\"object\",\"type\":\"Product\",\"relationName\":\"OrderItemToProduct\"},{\"name\":\"refunds\",\"kind\":\"object\",\"type\":\"Refund\",\"relationName\":\"OrderItemToRefund\"}],\"dbName\":\"order_items\"},\"Conversation\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"customerId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"vendorId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"participants\",\"kind\":\"object\",\"type\":\"ConversationParticipant\",\"relationName\":\"ConversationToConversationParticipant\"},{\"name\":\"customer\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"CustomerConversations\"},{\"name\":\"vendor\",\"kind\":\"object\",\"type\":\"Vendor\",\"relationName\":\"VendorConversations\"},{\"name\":\"dispute\",\"kind\":\"object\",\"type\":\"Dispute\",\"relationName\":\"ConversationDispute\"},{\"name\":\"jobOffer\",\"kind\":\"object\",\"type\":\"JobOffer\",\"relationName\":\"ConversationToJobOffer\"},{\"name\":\"messages\",\"kind\":\"object\",\"type\":\"Message\",\"relationName\":\"ConversationToMessage\"}],\"dbName\":\"conversations\"},\"ConversationParticipant\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"conversationId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"conversation\",\"kind\":\"object\",\"type\":\"Conversation\",\"relationName\":\"ConversationToConversationParticipant\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"ConversationParticipantToUser\"}],\"dbName\":\"conversation_participants\"},\"Message\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"conversationId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"senderId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"receiverId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"content\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"read\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"readAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"messageType\",\"kind\":\"enum\",\"type\":\"MessageType\"},{\"name\":\"metadata\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"conversation\",\"kind\":\"object\",\"type\":\"Conversation\",\"relationName\":\"ConversationToMessage\"},{\"name\":\"receiver\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"ReceivedMessages\"},{\"name\":\"sender\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"SentMessages\"}],\"dbName\":\"messages\"},\"Dispute\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"orderId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"productId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"initiatorId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"status\",\"kind\":\"enum\",\"type\":\"DisputeStatus\"},{\"name\":\"reason\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"resolution\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"resolvedByAdmin\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"conversationId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"buyerResponseDeadline\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"disputeReason\",\"kind\":\"enum\",\"type\":\"DisputeReason\"},{\"name\":\"evidenceFiles\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"refundAmount\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"refundProcessed\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"sellerResponseDeadline\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"participants\",\"kind\":\"object\",\"type\":\"DisputeParticipant\",\"relationName\":\"DisputeToDisputeParticipant\"},{\"name\":\"conversation\",\"kind\":\"object\",\"type\":\"Conversation\",\"relationName\":\"ConversationDispute\"},{\"name\":\"initiator\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"UserDisputes\"},{\"name\":\"order\",\"kind\":\"object\",\"type\":\"Order\",\"relationName\":\"DisputeToOrder\"},{\"name\":\"product\",\"kind\":\"object\",\"type\":\"Product\",\"relationName\":\"DisputeToProduct\"}],\"dbName\":\"disputes\"},\"DisputeParticipant\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"disputeId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"role\",\"kind\":\"enum\",\"type\":\"DisputeRole\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"dispute\",\"kind\":\"object\",\"type\":\"Dispute\",\"relationName\":\"DisputeToDisputeParticipant\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"DisputeParticipantToUser\"}],\"dbName\":\"dispute_participants\"},\"Tag\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"slug\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"isActive\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"productTags\",\"kind\":\"object\",\"type\":\"ProductTag\",\"relationName\":\"ProductTagToTag\"},{\"name\":\"products\",\"kind\":\"object\",\"type\":\"Product\",\"relationName\":\"ProductTags\"}],\"dbName\":\"tags\"},\"ProductTag\":{\"fields\":[{\"name\":\"productId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"tagId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"assignedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"assignedBy\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"product\",\"kind\":\"object\",\"type\":\"Product\",\"relationName\":\"ProductToProductTag\"},{\"name\":\"tag\",\"kind\":\"object\",\"type\":\"Tag\",\"relationName\":\"ProductTagToTag\"}],\"dbName\":\"product_tags\"},\"PlatformSetting\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"platformFeePercent\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"cryptoPaymentEnabled\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"disputePeriodDays\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"escrowHoldDays\",\"kind\":\"scalar\",\"type\":\"Int\"}],\"dbName\":\"platform_settings\"},\"CryptoWallet\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"address\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"chain\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"currency\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"CryptoWalletToUser\"}],\"dbName\":\"crypto_wallets\"},\"CryptoPayment\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"orderId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"amount\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"currency\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"chain\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"fromAddress\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"toAddress\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"transactionHash\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"status\",\"kind\":\"enum\",\"type\":\"CryptoPaymentStatus\"},{\"name\":\"webhookReceivedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"confirmedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"order\",\"kind\":\"object\",\"type\":\"Order\",\"relationName\":\"CryptoPaymentToOrder\"}],\"dbName\":\"crypto_payments\"},\"DashboardStat\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"key\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"value\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":\"dashboard_stats\"},\"BannedUser\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"reason\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"bannedBy\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"banStart\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"banEnd\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"isActive\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"bannedByUser\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"BannedByUsers\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"BannedUserToUser\"}],\"dbName\":\"banned_users\"},\"VendorApplication\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"vendorId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"status\",\"kind\":\"enum\",\"type\":\"VendorApplicationStatus\"},{\"name\":\"currentStep\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"totalSteps\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"submittedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"reviewedBy\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"reviewedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"approvedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"rejectedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"rejectionReason\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"revisionRequested\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"revisionRequestedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"revisionRequestedBy\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"revisionReason\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"revisionCompletedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"notes\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"personaInquiryId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"personaStatus\",\"kind\":\"enum\",\"type\":\"PersonaStatus\"},{\"name\":\"personaVerifiedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"personaOverridden\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"personaOverrideReason\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"personaOverriddenBy\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"personaOverriddenAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"ipAddress\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userAgent\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"country\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"deletedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"vendor\",\"kind\":\"object\",\"type\":\"Vendor\",\"relationName\":\"VendorToVendorApplication\"},{\"name\":\"reviewer\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"VendorApplicationReviewers\"},{\"name\":\"revisionRequestedByUser\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"VendorApplicationRevisionRequesters\"},{\"name\":\"personaOverriddenByUser\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"VendorApplicationPersonaOverriders\"},{\"name\":\"steps\",\"kind\":\"object\",\"type\":\"ApplicationStep\",\"relationName\":\"ApplicationStepToVendorApplication\"},{\"name\":\"applicationNotes\",\"kind\":\"object\",\"type\":\"ApplicationNote\",\"relationName\":\"ApplicationNoteToVendorApplication\"},{\"name\":\"auditLogs\",\"kind\":\"object\",\"type\":\"ApplicationAuditLog\",\"relationName\":\"ApplicationAuditLogToVendorApplication\"},{\"name\":\"personaVerification\",\"kind\":\"object\",\"type\":\"PersonaVerification\",\"relationName\":\"PersonaVerificationToVendorApplication\"}],\"dbName\":\"vendor_applications\"},\"ApplicationStep\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"applicationId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"stepNumber\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"stepName\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"stepSlug\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"status\",\"kind\":\"enum\",\"type\":\"StepStatus\"},{\"name\":\"data\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"files\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"completedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"revisionRequired\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"revisionNotes\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"application\",\"kind\":\"object\",\"type\":\"VendorApplication\",\"relationName\":\"ApplicationStepToVendorApplication\"}],\"dbName\":\"application_steps\"},\"ApplicationNote\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"applicationId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"type\",\"kind\":\"enum\",\"type\":\"NoteType\"},{\"name\":\"content\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"metadata\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"createdBy\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"application\",\"kind\":\"object\",\"type\":\"VendorApplication\",\"relationName\":\"ApplicationNoteToVendorApplication\"},{\"name\":\"author\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"ApplicationNoteAuthors\"}],\"dbName\":\"application_notes\"},\"ApplicationAuditLog\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"applicationId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"action\",\"kind\":\"enum\",\"type\":\"AuditAction\"},{\"name\":\"performedBy\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"metadata\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"ipAddress\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userAgent\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"application\",\"kind\":\"object\",\"type\":\"VendorApplication\",\"relationName\":\"ApplicationAuditLogToVendorApplication\"},{\"name\":\"admin\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"AuditLogPerformers\"}],\"dbName\":\"application_audit_logs\"},\"PersonaVerification\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"applicationId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"inquiryId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"status\",\"kind\":\"enum\",\"type\":\"PersonaStatus\"},{\"name\":\"webhookData\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"verificationUrl\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"lastCheckedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"failureReason\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"application\",\"kind\":\"object\",\"type\":\"VendorApplication\",\"relationName\":\"PersonaVerificationToVendorApplication\"}],\"dbName\":\"persona_verifications\"},\"Withdrawal\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"vendorId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"amount\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"currency\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"status\",\"kind\":\"enum\",\"type\":\"WithdrawalStatus\"},{\"name\":\"method\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"details\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"processedBy\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"processedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"processor\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"WithdrawalProcessors\"},{\"name\":\"vendor\",\"kind\":\"object\",\"type\":\"Vendor\",\"relationName\":\"VendorToWithdrawal\"}],\"dbName\":\"withdrawals\"},\"DigitalFile\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"url\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"size\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"mimeType\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"productId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"uploadedBy\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"status\",\"kind\":\"enum\",\"type\":\"FileStatus\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"product\",\"kind\":\"object\",\"type\":\"Product\",\"relationName\":\"DigitalFileToProduct\"},{\"name\":\"uploader\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"DigitalFileUploaders\"}],\"dbName\":\"digital_files\"},\"Report\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"type\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"data\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"generatedBy\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"startDate\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"endDate\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"generator\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"ReportGenerators\"}],\"dbName\":\"reports\"},\"Setting\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"key\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"value\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"type\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"group\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":\"settings\"},\"SeoSetting\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"page\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"title\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"keywords\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"author\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":\"seo_settings\"},\"builder_pages\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"slug\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"title\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"content\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"status\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"version\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"published_at\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"created_at\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updated_at\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"versions\",\"kind\":\"object\",\"type\":\"builder_page_versions\",\"relationName\":\"builder_page_versionsTobuilder_pages\"}],\"dbName\":null},\"builder_page_versions\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"page_id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"content\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"version\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"created_at\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"page\",\"kind\":\"object\",\"type\":\"builder_pages\",\"relationName\":\"builder_page_versionsTobuilder_pages\"}],\"dbName\":null},\"CmsPage\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"title\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"slug\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"content\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"status\",\"kind\":\"enum\",\"type\":\"PageStatus\"},{\"name\":\"authorId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"publishedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"author\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"CmsPageToUser\"}],\"dbName\":\"cms_pages\"},\"SupportTicket\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"subject\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"status\",\"kind\":\"enum\",\"type\":\"TicketStatus\"},{\"name\":\"priority\",\"kind\":\"enum\",\"type\":\"TicketPriority\"},{\"name\":\"assignedTo\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"category\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"closedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"attachments\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"resolvedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"resolvedBy\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"tags\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"ticket_messages\",\"kind\":\"object\",\"type\":\"TicketMessage\",\"relationName\":\"SupportTicketToTicketMessage\"},{\"name\":\"assignee\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"SupportTicketAssignees\"},{\"name\":\"users_support_tickets_resolvedByTousers\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"support_tickets_resolvedByTousers\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"SupportTicketToUser\"}],\"dbName\":\"support_tickets\"},\"SystemLog\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"level\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"message\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"metadata\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"timestamp\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":\"system_logs\"},\"Announcement\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"title\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"content\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"status\",\"kind\":\"enum\",\"type\":\"AnnouncementStatus\"},{\"name\":\"priority\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"startDate\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"endDate\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"createdBy\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"author\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"AnnouncementToUser\"}],\"dbName\":\"announcements\"},\"AdminAccount\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"permissions\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"lastLogin\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"isSuperAdmin\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"AdminAccountToUser\"}],\"dbName\":\"admin_accounts\"},\"NavigationItem\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"label\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"url\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"order\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"isActive\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"isSection\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"parentId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"icon\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"image\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"isFeatured\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"parent\",\"kind\":\"object\",\"type\":\"NavigationItem\",\"relationName\":\"NavigationItems\"},{\"name\":\"children\",\"kind\":\"object\",\"type\":\"NavigationItem\",\"relationName\":\"NavigationItems\"}],\"dbName\":\"navigation_items\"},\"Content\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"title\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"slug\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"content\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"excerpt\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"status\",\"kind\":\"enum\",\"type\":\"ContentStatus\"},{\"name\":\"contentType\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"authorId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"parentId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"featuredImage\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"metaTitle\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"metaDescription\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"tags\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"categories\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"publishedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"author\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"ContentToUser\"},{\"name\":\"parent\",\"kind\":\"object\",\"type\":\"Content\",\"relationName\":\"ContentRelation\"},{\"name\":\"children\",\"kind\":\"object\",\"type\":\"Content\",\"relationName\":\"ContentRelation\"}],\"dbName\":\"content\"},\"Discount\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"vendorId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"type\",\"kind\":\"enum\",\"type\":\"DiscountType\"},{\"name\":\"value\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"minPurchase\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"maxDiscount\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"startDate\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"endDate\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"isActive\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"usageLimit\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"usageCount\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"vendor\",\"kind\":\"object\",\"type\":\"Vendor\",\"relationName\":\"DiscountToVendor\"}],\"dbName\":\"discounts\"},\"Coupon\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"vendorId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"code\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"type\",\"kind\":\"enum\",\"type\":\"CouponType\"},{\"name\":\"value\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"minPurchase\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"maxDiscount\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"startDate\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"endDate\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"isActive\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"usageLimit\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"usageCount\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"usedBy\",\"kind\":\"object\",\"type\":\"CouponUsage\",\"relationName\":\"CouponToCouponUsage\"},{\"name\":\"vendor\",\"kind\":\"object\",\"type\":\"Vendor\",\"relationName\":\"CouponToVendor\"}],\"dbName\":\"coupons\"},\"Refund\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"orderId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"orderItemId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"amount\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"status\",\"kind\":\"enum\",\"type\":\"RefundStatus\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"notes\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"processedBy\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"reason\",\"kind\":\"enum\",\"type\":\"RefundReason\"},{\"name\":\"order\",\"kind\":\"object\",\"type\":\"Order\",\"relationName\":\"OrderToRefund\"},{\"name\":\"orderItem\",\"kind\":\"object\",\"type\":\"OrderItem\",\"relationName\":\"OrderItemToRefund\"}],\"dbName\":\"refunds\"},\"CouponUsage\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"couponId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"orderId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"usedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"coupon\",\"kind\":\"object\",\"type\":\"Coupon\",\"relationName\":\"CouponToCouponUsage\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"CouponUsers\"}],\"dbName\":\"coupon_usage\"},\"Promotion\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"vendorId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"type\",\"kind\":\"enum\",\"type\":\"PromotionType\"},{\"name\":\"conditions\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"rewards\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"startDate\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"endDate\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"isActive\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"priority\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"vendor\",\"kind\":\"object\",\"type\":\"Vendor\",\"relationName\":\"PromotionToVendor\"}],\"dbName\":\"promotions\"},\"Affiliate\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"vendorId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"code\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"commissionRate\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"totalEarnings\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"status\",\"kind\":\"enum\",\"type\":\"AffiliateStatus\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"referrals\",\"kind\":\"object\",\"type\":\"AffiliateReferral\",\"relationName\":\"AffiliateToAffiliateReferral\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"UserAffiliates\"},{\"name\":\"vendor\",\"kind\":\"object\",\"type\":\"Vendor\",\"relationName\":\"AffiliateToVendor\"}],\"dbName\":\"affiliates\"},\"AffiliateReferral\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"affiliateId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"orderId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"commission\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"status\",\"kind\":\"enum\",\"type\":\"ReferralStatus\"},{\"name\":\"paidAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"affiliate\",\"kind\":\"object\",\"type\":\"Affiliate\",\"relationName\":\"AffiliateToAffiliateReferral\"}],\"dbName\":\"affiliate_referrals\"},\"Invoice\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"vendorId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"orderId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"invoiceNumber\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"amount\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"tax\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"total\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"status\",\"kind\":\"enum\",\"type\":\"InvoiceStatus\"},{\"name\":\"dueDate\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"paidAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"vendor\",\"kind\":\"object\",\"type\":\"Vendor\",\"relationName\":\"InvoiceToVendor\"}],\"dbName\":\"invoices\"},\"ShippingSetting\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"vendorId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"freeShippingThreshold\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"flatRate\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"zones\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"vendor\",\"kind\":\"object\",\"type\":\"Vendor\",\"relationName\":\"ShippingSettingToVendor\"}],\"dbName\":\"shipping_settings\"},\"TaxSetting\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"vendorId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"taxRate\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"taxNumber\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"regions\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"vendor\",\"kind\":\"object\",\"type\":\"Vendor\",\"relationName\":\"TaxSettingToVendor\"}],\"dbName\":\"tax_settings\"},\"NotificationSetting\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"vendorId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"emailNotifications\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"orderNotifications\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"productNotifications\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"marketingNotifications\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"vendor\",\"kind\":\"object\",\"type\":\"Vendor\",\"relationName\":\"NotificationSettingToVendor\"}],\"dbName\":\"notification_settings\"},\"Wishlist\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"productId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"product\",\"kind\":\"object\",\"type\":\"Product\",\"relationName\":\"ProductToWishlist\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"UserToWishlist\"}],\"dbName\":\"wishlists\"},\"Review\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"productId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"rating\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"comment\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"product\",\"kind\":\"object\",\"type\":\"Product\",\"relationName\":\"ProductToReview\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"ReviewToUser\"}],\"dbName\":\"reviews\"},\"Wallet\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"balance\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"currency\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"pendingBalance\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"transactions\",\"kind\":\"object\",\"type\":\"WalletTransaction\",\"relationName\":\"WalletToWalletTransaction\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"UserToWallet\"}],\"dbName\":\"wallets\"},\"WalletTransaction\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"walletId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"amount\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"type\",\"kind\":\"enum\",\"type\":\"WalletTransactionType\"},{\"name\":\"status\",\"kind\":\"enum\",\"type\":\"WalletTransactionStatus\"},{\"name\":\"reference\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"wallet\",\"kind\":\"object\",\"type\":\"Wallet\",\"relationName\":\"WalletToWalletTransaction\"}],\"dbName\":\"wallet_transactions\"},\"GiftCard\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"code\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"amount\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"currency\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"balance\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"status\",\"kind\":\"enum\",\"type\":\"GiftCardStatus\"},{\"name\":\"expiresAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"createdById\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"vendorId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"redemptions\",\"kind\":\"object\",\"type\":\"GiftCardRedemption\",\"relationName\":\"GiftCardToGiftCardRedemption\"},{\"name\":\"vendor\",\"kind\":\"object\",\"type\":\"Vendor\",\"relationName\":\"GiftCardToVendor\"}],\"dbName\":\"gift_cards\"},\"GiftCardRedemption\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"giftCardId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"amount\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"giftCard\",\"kind\":\"object\",\"type\":\"GiftCard\",\"relationName\":\"GiftCardToGiftCardRedemption\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"GiftCardRedemptionToUser\"}],\"dbName\":\"gift_card_redemptions\"},\"Address\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"street\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"city\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"state\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"zip\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"country\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"isDefault\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"AddressToUser\"}],\"dbName\":\"addresses\"},\"Cart\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"items\",\"kind\":\"object\",\"type\":\"CartItem\",\"relationName\":\"CartToCartItem\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"CartToUser\"}],\"dbName\":\"carts\"},\"CartItem\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"cartId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"productId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"quantity\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"cart\",\"kind\":\"object\",\"type\":\"Cart\",\"relationName\":\"CartToCartItem\"},{\"name\":\"product\",\"kind\":\"object\",\"type\":\"Product\",\"relationName\":\"CartItemToProduct\"}],\"dbName\":\"cart_items\"},\"ProductVersion\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"productId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"version\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"fileUrl\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"changelog\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"uploadedBy\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"product\",\"kind\":\"object\",\"type\":\"Product\",\"relationName\":\"ProductToProductVersion\"},{\"name\":\"uploader\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"ProductVersionUploaders\"}],\"dbName\":\"product_versions\"},\"Notification\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"type\",\"kind\":\"enum\",\"type\":\"NotificationType\"},{\"name\":\"title\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"message\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"data\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"isRead\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"NotificationToUser\"}],\"dbName\":\"notifications\"},\"AuditLog\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"action\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"entity\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"entityId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"changes\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"ipAddress\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userAgent\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"AuditLogToUser\"}],\"dbName\":\"audit_logs\"},\"PaymentMethod\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"type\",\"kind\":\"enum\",\"type\":\"PaymentType\"},{\"name\":\"isActive\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"config\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":\"payment_methods\"},\"ProductBadge\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"productId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"badgeType\",\"kind\":\"enum\",\"type\":\"BadgeType\"},{\"name\":\"assignedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"assignedBy\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"product\",\"kind\":\"object\",\"type\":\"Product\",\"relationName\":\"ProductToProductBadge\"}],\"dbName\":\"product_badges\"},\"ThemeSetting\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"primaryColor\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"secondaryColor\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"accentColor\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"backgroundColor\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"foregroundColor\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"cardColor\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"cardForegroundColor\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"borderColor\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"inputColor\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"mutedColor\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"mutedForegroundColor\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"destructiveColor\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"darkPrimaryColor\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"darkSecondaryColor\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"darkAccentColor\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"darkBackgroundColor\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"darkForegroundColor\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"darkCardColor\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"darkCardForegroundColor\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"darkBorderColor\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"darkInputColor\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"darkMutedColor\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"darkMutedForegroundColor\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"darkDestructiveColor\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"fontFamily\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"fontSize\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"headingFontFamily\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"borderRadius\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"sidebarWidth\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"headerHeight\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"logoUrl\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"logoLightUrl\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"logoDarkUrl\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"faviconUrl\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"logoWidth\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"logoHeight\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"siteName\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"siteTagline\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"siteDescription\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"copyrightText\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"metaTitle\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"metaDescription\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"metaKeywords\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"ogImage\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"facebookUrl\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"twitterUrl\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"instagramUrl\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"linkedinUrl\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"youtubeUrl\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"githubUrl\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"contactEmail\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"contactPhone\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"contactAddress\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"supportEmail\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"footerText\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"showSocialLinks\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"showContactInfo\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"defaultMode\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":\"theme_settings\"},\"SellerBadge\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"icon\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"color\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"isActive\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"vendors\",\"kind\":\"object\",\"type\":\"VendorBadge\",\"relationName\":\"SellerBadgeToVendorBadge\"}],\"dbName\":\"seller_badges\"},\"VendorBadge\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"vendorId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"badgeId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"assignedBy\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"assignedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"badge\",\"kind\":\"object\",\"type\":\"SellerBadge\",\"relationName\":\"SellerBadgeToVendorBadge\"},{\"name\":\"vendor\",\"kind\":\"object\",\"type\":\"Vendor\",\"relationName\":\"VendorToVendorBadge\"}],\"dbName\":\"vendor_badges\"},\"SoftwareTool\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"logoUrl\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"category\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"isActive\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"vendors\",\"kind\":\"object\",\"type\":\"VendorSoftwareTool\",\"relationName\":\"SoftwareToolToVendorSoftwareTool\"}],\"dbName\":\"software_tools\"},\"VendorSoftwareTool\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"vendorId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"softwareToolId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"addedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"softwareTool\",\"kind\":\"object\",\"type\":\"SoftwareTool\",\"relationName\":\"SoftwareToolToVendorSoftwareTool\"},{\"name\":\"vendor\",\"kind\":\"object\",\"type\":\"Vendor\",\"relationName\":\"VendorToVendorSoftwareTool\"}],\"dbName\":\"vendor_software_tools\"},\"Follow\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"followerId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"followingId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"follower\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"UserFollowing\"},{\"name\":\"following\",\"kind\":\"object\",\"type\":\"Vendor\",\"relationName\":\"VendorFollowers\"}],\"dbName\":\"follows\"},\"SellerReview\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"vendorId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"rating\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"comment\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"orderId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"order\",\"kind\":\"object\",\"type\":\"Order\",\"relationName\":\"OrderSellerReviews\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"UserSellerReviews\"},{\"name\":\"vendor\",\"kind\":\"object\",\"type\":\"Vendor\",\"relationName\":\"SellerReviewToVendor\"}],\"dbName\":\"seller_reviews\"},\"AIProcessingJob\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"productId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"jobType\",\"kind\":\"enum\",\"type\":\"AIJobType\"},{\"name\":\"status\",\"kind\":\"enum\",\"type\":\"AIProcessingStatus\"},{\"name\":\"progress\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"result\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"error\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"startedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"completedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"product\",\"kind\":\"object\",\"type\":\"Product\",\"relationName\":\"AIProcessingJobToProduct\"}],\"dbName\":\"ai_processing_jobs\"},\"ProductIssue\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"productId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"issueType\",\"kind\":\"enum\",\"type\":\"IssueType\"},{\"name\":\"severity\",\"kind\":\"enum\",\"type\":\"IssueSeverity\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"location\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"autoFixed\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"fixedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"product\",\"kind\":\"object\",\"type\":\"Product\",\"relationName\":\"ProductToProductIssue\"}],\"dbName\":\"product_issues\"},\"JobOffer\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"conversationId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"vendorId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"customerId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"title\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"budget\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"currency\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"status\",\"kind\":\"enum\",\"type\":\"JobOfferStatus\"},{\"name\":\"acceptedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"completedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"conversation\",\"kind\":\"object\",\"type\":\"Conversation\",\"relationName\":\"ConversationToJobOffer\"},{\"name\":\"customer\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"CustomerJobOffers\"},{\"name\":\"vendor\",\"kind\":\"object\",\"type\":\"Vendor\",\"relationName\":\"VendorJobOffers\"}],\"dbName\":\"job_offers\"},\"api_settings\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"provider\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"settings\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"isActive\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"lastUpdatedBy\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"LiveChatSession\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"sessionId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"visitorId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"visitorName\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"visitorEmail\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"status\",\"kind\":\"enum\",\"type\":\"ChatSessionStatus\"},{\"name\":\"assignedTo\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"department\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"startedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"endedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"rating\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"feedback\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"metadata\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"isAIHandled\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"sentimentScore\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"escalationReason\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"messages\",\"kind\":\"object\",\"type\":\"LiveChatMessage\",\"relationName\":\"LiveChatMessageToLiveChatSession\"},{\"name\":\"assignee\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"LiveChatAssignee\"},{\"name\":\"visitor\",\"kind\":\"object\",\"type\":\"LiveChatVisitor\",\"relationName\":\"LiveChatSessionToLiveChatVisitor\"}],\"dbName\":\"livechat_sessions\"},\"LiveChatMessage\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"sessionId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"senderId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"senderType\",\"kind\":\"enum\",\"type\":\"ChatSenderType\"},{\"name\":\"content\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"messageType\",\"kind\":\"enum\",\"type\":\"ChatMessageType\"},{\"name\":\"attachments\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"isRead\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"isAI\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"tokensUsed\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"session\",\"kind\":\"object\",\"type\":\"LiveChatSession\",\"relationName\":\"LiveChatMessageToLiveChatSession\"}],\"dbName\":\"livechat_messages\"},\"LiveChatVisitor\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"fingerprint\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"email\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"phone\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"country\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"city\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userAgent\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"ipAddress\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"firstVisit\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"lastVisit\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"pageViews\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"totalChats\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"isOnline\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"currentPage\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"metadata\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"sessions\",\"kind\":\"object\",\"type\":\"LiveChatSession\",\"relationName\":\"LiveChatSessionToLiveChatVisitor\"},{\"name\":\"pageHistory\",\"kind\":\"object\",\"type\":\"PageVisitHistory\",\"relationName\":\"LiveChatVisitorToPageVisitHistory\"}],\"dbName\":\"livechat_visitors\"},\"PageVisitHistory\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"visitorId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"pageUrl\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"pageTitle\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"duration\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"visitedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"visitor\",\"kind\":\"object\",\"type\":\"LiveChatVisitor\",\"relationName\":\"LiveChatVisitorToPageVisitHistory\"}],\"dbName\":\"page_visit_history\"},\"CannedResponse\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"title\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"shortcut\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"content\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"category\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"isActive\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"createdBy\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":\"canned_responses\"},\"LiveChatSettings\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"widgetColor\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"widgetPosition\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"widgetIcon\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"welcomeMessage\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"offlineMessage\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"eyeCatcherEnabled\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"eyeCatcherText\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"eyeCatcherDelay\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"operatingHoursEnabled\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"operatingHours\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"timezone\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"soundEnabled\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"fileShareEnabled\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"maxFileSize\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"allowedFileTypes\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"aiEnabled\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"aiModel\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"aiSystemPrompt\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"autoTranslateEnabled\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"defaultLanguage\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"voiceEnabled\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"videoEnabled\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":\"livechat_settings\"},\"KnowledgeBaseArticle\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"title\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"content\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"category\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"tags\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"isActive\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":\"knowledge_base_articles\"},\"AIModelConfig\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"modelName\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"provider\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"apiKey\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"temperature\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"maxTokens\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"systemPrompt\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"isActive\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":\"ai_model_configs\"},\"ChatbotAnalytics\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"date\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"totalSessions\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"aiHandled\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"escalated\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"avgResponseTime\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"sentimentScore\",\"kind\":\"scalar\",\"type\":\"Float\"}],\"dbName\":\"chatbot_analytics\"},\"EmailCampaign\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"subject\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"content\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"status\",\"kind\":\"enum\",\"type\":\"EmailCampaignStatus\"},{\"name\":\"recipientType\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"recipients\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"scheduledAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"sentAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"totalSent\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"totalOpened\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"totalClicked\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"createdBy\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":\"email_campaigns\"},\"SmtpSettings\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"host\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"port\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"username\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"password\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"encryption\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"fromEmail\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"fromName\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"isActive\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":\"smtp_settings\"},\"SocialIntegration\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"platform\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"isEnabled\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"apiKey\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"apiSecret\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"accessToken\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"refreshToken\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"webhookUrl\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"config\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":\"social_integrations\"},\"SecuritySettings\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"countryRestrictions\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"allowedCountries\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"blockedCountries\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"dosProtectionEnabled\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"maxRequestsPerMinute\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"blockDuration\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"allowedDomains\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":\"security_settings\"},\"App\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"slug\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"shortDescription\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"icon\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"screenshots\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"status\",\"kind\":\"enum\",\"type\":\"AppStatus\"},{\"name\":\"category\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdByAdmin\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"developerId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"developer\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"AppDeveloper\"},{\"name\":\"developerName\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"developerEmail\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"developerUrl\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"privacyPolicyUrl\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"termsOfServiceUrl\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"webhookSecret\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"pricingType\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"price\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"installCount\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"rating\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"reviewCount\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"reviewedBy\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"reviewedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"rejectionReason\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"suspensionReason\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"permissions\",\"kind\":\"object\",\"type\":\"AppPermission\",\"relationName\":\"AppToAppPermission\"},{\"name\":\"installations\",\"kind\":\"object\",\"type\":\"MerchantAppInstallation\",\"relationName\":\"AppToMerchantAppInstallation\"},{\"name\":\"webhooks\",\"kind\":\"object\",\"type\":\"AppWebhook\",\"relationName\":\"AppToAppWebhook\"},{\"name\":\"activityLogs\",\"kind\":\"object\",\"type\":\"AppActivityLog\",\"relationName\":\"AppToAppActivityLog\"},{\"name\":\"reviews\",\"kind\":\"object\",\"type\":\"AppReview\",\"relationName\":\"AppToAppReview\"}],\"dbName\":\"apps\"},\"AppPermission\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"appId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"permission\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"isRequired\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"app\",\"kind\":\"object\",\"type\":\"App\",\"relationName\":\"AppToAppPermission\"}],\"dbName\":\"app_permissions\"},\"MerchantAppInstallation\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"vendorId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"appId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"accessToken\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"accessTokenPrefix\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"permissionsSnapshot\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"status\",\"kind\":\"enum\",\"type\":\"InstallationStatus\"},{\"name\":\"suspendedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"suspendedBy\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"suspensionReason\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"installedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"uninstalledAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"lastUsedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"vendor\",\"kind\":\"object\",\"type\":\"Vendor\",\"relationName\":\"MerchantAppInstallationToVendor\"},{\"name\":\"app\",\"kind\":\"object\",\"type\":\"App\",\"relationName\":\"AppToMerchantAppInstallation\"},{\"name\":\"activityLogs\",\"kind\":\"object\",\"type\":\"AppActivityLog\",\"relationName\":\"AppActivityLogToMerchantAppInstallation\"}],\"dbName\":\"merchant_app_installations\"},\"AppWebhook\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"appId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"event\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"targetUrl\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"isActive\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"lastDeliveredAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"failureCount\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"app\",\"kind\":\"object\",\"type\":\"App\",\"relationName\":\"AppToAppWebhook\"}],\"dbName\":\"app_webhooks\"},\"AppActivityLog\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"vendorId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"appId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"installationId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"action\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"endpoint\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"method\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"statusCode\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"metadata\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"ipAddress\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userAgent\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"app\",\"kind\":\"object\",\"type\":\"App\",\"relationName\":\"AppToAppActivityLog\"},{\"name\":\"installation\",\"kind\":\"object\",\"type\":\"MerchantAppInstallation\",\"relationName\":\"AppActivityLogToMerchantAppInstallation\"}],\"dbName\":\"app_activity_logs\"},\"AppReview\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"appId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"vendorId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"rating\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"comment\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"app\",\"kind\":\"object\",\"type\":\"App\",\"relationName\":\"AppToAppReview\"},{\"name\":\"vendor\",\"kind\":\"object\",\"type\":\"Vendor\",\"relationName\":\"AppReviewToVendor\"}],\"dbName\":\"app_reviews\"},\"TicketMessage\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"ticketId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"content\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"attachments\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"isInternal\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"ticket\",\"kind\":\"object\",\"type\":\"SupportTicket\",\"relationName\":\"SupportTicketToTicketMessage\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"TicketMessageToUser\"}],\"dbName\":\"ticket_messages\"},\"MarketingCampaign\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"vendorId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"status\",\"kind\":\"enum\",\"type\":\"CampaignStatus\"},{\"name\":\"budget\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"startDate\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"endDate\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"sessions\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"sales\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"orders\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"vendor\",\"kind\":\"object\",\"type\":\"Vendor\",\"relationName\":\"MarketingCampaignToVendor\"}],\"dbName\":\"marketing_campaigns\"},\"MarketingAutomation\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"vendorId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"type\",\"kind\":\"enum\",\"type\":\"AutomationType\"},{\"name\":\"status\",\"kind\":\"enum\",\"type\":\"AutomationStatus\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"vendor\",\"kind\":\"object\",\"type\":\"Vendor\",\"relationName\":\"MarketingAutomationToVendor\"}],\"dbName\":\"marketing_automations\"},\"Segment\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"vendorId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"query\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"vendor\",\"kind\":\"object\",\"type\":\"Vendor\",\"relationName\":\"SegmentToVendor\"}],\"dbName\":\"segments\"},\"ShippingProfile\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"vendorId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"isGeneral\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"originAddress\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"zones\",\"kind\":\"object\",\"type\":\"ShippingZone\",\"relationName\":\"ShippingProfileToShippingZone\"},{\"name\":\"products\",\"kind\":\"object\",\"type\":\"Product\",\"relationName\":\"ProductToShippingProfile\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"vendor\",\"kind\":\"object\",\"type\":\"Vendor\",\"relationName\":\"ShippingProfileToVendor\"}],\"dbName\":\"shipping_profiles\"},\"ShippingZone\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"profileId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"countries\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"regions\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"rates\",\"kind\":\"object\",\"type\":\"ShippingRate\",\"relationName\":\"ShippingRateToShippingZone\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"profile\",\"kind\":\"object\",\"type\":\"ShippingProfile\",\"relationName\":\"ShippingProfileToShippingZone\"}],\"dbName\":\"shipping_zones\"},\"ShippingRate\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"zoneId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"type\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"price\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"currency\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"minCondition\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"maxCondition\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"carrierService\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"minDeliveryDays\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"maxDeliveryDays\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"zone\",\"kind\":\"object\",\"type\":\"ShippingZone\",\"relationName\":\"ShippingRateToShippingZone\"}],\"dbName\":\"shipping_rates\"},\"LocalDeliverySetting\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"vendorId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"isEnabled\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"deliveryZoneType\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"radiusValue\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"radiusUnit\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"includeNeighboring\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"postalCodes\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"price\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"currency\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"minOrderPrice\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"deliveryInfo\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"vendor\",\"kind\":\"object\",\"type\":\"Vendor\",\"relationName\":\"LocalDeliverySettingToVendor\"}],\"dbName\":\"local_delivery_settings\"},\"PickupSetting\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"vendorId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"isEnabled\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"expectedPickupTime\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"pickupInstructions\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"vendor\",\"kind\":\"object\",\"type\":\"Vendor\",\"relationName\":\"PickupSettingToVendor\"}],\"dbName\":\"pickup_settings\"},\"SavedPackage\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"vendorId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"type\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"length\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"width\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"height\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"dimensionUnit\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"weight\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"weightUnit\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"isDefault\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"vendor\",\"kind\":\"object\",\"type\":\"Vendor\",\"relationName\":\"SavedPackageToVendor\"}],\"dbName\":\"saved_packages\"}},\"enums\":{},\"types\":{}}")
defineDmmfProperty(exports.Prisma, config.runtimeDataModel)
config.engineWasm = {
      getRuntime: () => require('./query_engine_bg.js'),
      getQueryEngineWasmModule: async () => {
        if (detectRuntime() === 'edge-light') {
          return (await import(`./query_engine_bg.wasm${'?module'}`)).default
        } else {
          return (await import(`./query_engine_bg.wasm`)).default
        }
      }
    }

config.injectableEdgeEnv = () => ({
  parsed: {
    DATABASE_URL: typeof globalThis !== 'undefined' && globalThis['DATABASE_URL'] || typeof process !== 'undefined' && process.env && process.env.DATABASE_URL || undefined
  }
})

if (typeof globalThis !== 'undefined' && globalThis['DEBUG'] || typeof process !== 'undefined' && process.env && process.env.DEBUG || undefined) {
  Debug.enable(typeof globalThis !== 'undefined' && globalThis['DEBUG'] || typeof process !== 'undefined' && process.env && process.env.DEBUG || undefined)
}

const PrismaClient = getPrismaClient(config)
exports.PrismaClient = PrismaClient
Object.assign(exports, Prisma)

