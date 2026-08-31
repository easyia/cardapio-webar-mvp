export type Language = 'pt-BR' | 'es-AR';

export interface TranslationDictionary {
  // Brand & Common
  appName: string;
  appTagline: string;
  language: string;
  portuguese: string;
  spanish: string;
  demoBadge: string;
  clientView: string;
  adminView: string;
  kdsView: string;
  landingView: string;
  currencySymbol: string;

  // Landing Page
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroCtaDemo: string;
  heroCtaAdmin: string;
  heroMetric1Value: string;
  heroMetric1Label: string;
  heroMetric2Value: string;
  heroMetric2Label: string;
  heroMetric3Value: string;
  heroMetric3Label: string;

  // Features Section
  featuresTitle: string;
  featuresSubtitle: string;
  feature1Title: string;
  feature1Desc: string;
  feature2Title: string;
  feature2Desc: string;
  feature3Title: string;
  feature3Desc: string;
  feature4Title: string;
  feature4Desc: string;

  // How it works
  howItWorksTitle: string;
  howItWorksSubtitle: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;

  // ROI Calculator
  roiTitle: string;
  roiSubtitle: string;
  roiTablesLabel: string;
  roiTicketLabel: string;
  roiEstimatedIncrease: string;
  roiExtraMonthly: string;
  roiExtraYearly: string;

  // Pricing
  pricingTitle: string;
  pricingSubtitle: string;
  planMonthly: string;
  planStarterName: string;
  planStarterPrice: string;
  planStarterDesc: string;
  planProName: string;
  planProPrice: string;
  planProDesc: string;
  planEnterpriseName: string;
  planEnterprisePrice: string;
  planEnterpriseDesc: string;
  planCta: string;
  popularBadge: string;

  // Client Menu
  tableNumberLabel: string;
  searchPlaceholder: string;
  allCategories: string;
  featuredTitle: string;
  featuredSubtitle: string;
  viewIn3D: string;
  viewInAR: string;
  projectOnTable: string;
  addToCart: string;
  addedToCart: string;
  portionLabel: string;
  prepTimeLabel: string;
  caloriesLabel: string;
  chefSpecial: string;
  vegetarian: string;
  glutenFree: string;
  kitchenNotesPlaceholder: string;
  myOrder: string;
  emptyCart: string;
  emptyCartSub: string;
  totalOrder: string;
  checkoutBtn: string;

  // Checkout & Payment
  checkoutTitle: string;
  customerNameLabel: string;
  customerNamePlaceholder: string;
  tipLabel: string;
  noTip: string;
  customTip: string;
  splitBillTitle: string;
  splitPersons: string;
  valuePerPerson: string;
  paymentMethodTitle: string;
  payPix: string;
  payPixDesc: string;
  payMercadoPago: string;
  payMercadoPagoDesc: string;
  payCard: string;
  payCardDesc: string;
  payWaiter: string;
  payWaiterDesc: string;
  pixCopyCode: string;
  pixCopied: string;
  pixExpiresIn: string;
  pixWaitingConfirm: string;
  confirmPaymentBtn: string;
  orderSuccessTitle: string;
  orderSuccessDesc: string;
  orderStatusSent: string;
  orderStatusPrep: string;
  orderStatusReady: string;
  orderStatusDelivered: string;
  trackOrderBtn: string;

  // Admin & AI Studio
  adminDishesTab: string;
  adminCategoriesTab: string;
  adminQRCodesTab: string;
  adminInsightsTab: string;
  adminKDSTab: string;
  adminBillingTab: string;
  adminProfileTab: string;
  newDishBtn: string;
  aiStudioBtn: string;
  aiStudioTitle: string;
  aiStudioDesc: string;
  takePhotoFront: string;
  takePhotoSide1: string;
  takePhotoSide2: string;
  takePhotoTop: string;
  generate3DBtn: string;
  publishDirectBtn: string;

  // Insights / Analytics
  insightsTitle: string;
  insightsSubtitle: string;
  totalRevenue: string;
  averageTicket: string;
  totalOrders: string;
  totalARViews: string;
  arConversionRate: string;
  topViewedDishes: string;
  ordersByHour: string;
  deviceDistribution: string;

  // KDS Kitchen
  kdsTitle: string;
  kdsActiveOrders: string;
  kdsMinutesAgo: string;
  kdsMarkPreparing: string;
  kdsMarkReady: string;
  kdsMarkDelivered: string;
  kdsAllClear: string;
}
