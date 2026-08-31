import type { Language, TranslationDictionary } from '../types/i18n';

const ptBR: TranslationDictionary = {
  // Brand & Common
  appName: 'AuraMenu 3D',
  appTagline: 'Cardápio WebAR Imersivo & Inteligência Artificial para Cafés e Restaurantes',
  language: 'Idioma',
  portuguese: 'Português (BR)',
  spanish: 'Español (AR)',
  demoBadge: 'Demonstração Interativa',
  clientView: 'Visão do Cliente',
  adminView: 'Painel Admin',
  kdsView: 'Cozinha KDS',
  landingView: 'Página Inicial',
  currencySymbol: 'R$',

  // Landing Page
  heroBadge: 'Tecnologia WebAR de Nova Geração',
  heroTitle: 'O Cardápio em Realidade Aumentada que Aumenta seu Ticket Médio em até 38%',
  heroSubtitle: 'Seus clientes escaneiam o QR Code na mesa e visualizam os cafés, doces e pratos em 3D holográfico com escala real 1:1, sem baixar nenhum app.',
  heroCtaDemo: 'Ver Cardápio Interativo ao Vivo',
  heroCtaAdmin: 'Acessar Painel & Estúdio IA',
  heroMetric1Value: '+38%',
  heroMetric1Label: 'Aumento no Ticket Médio de Cafés e Sobremesas',
  heroMetric2Value: '0 Apps',
  heroMetric2Label: 'Abre direto na câmera do Safari e Chrome',
  heroMetric3Value: '15 Seg',
  heroMetric3Label: 'Para gerar o modelo 3D a partir da foto do prato',

  // Features Section
  featuresTitle: 'Por que o AuraMenu supera cardápios comuns e PDFs?',
  featuresSubtitle: 'Projetado para cafeterias especiais, bistrôs e restaurantes autorais que valorizam a apresentação gastronômica.',
  feature1Title: 'Fotogrametria IA Multi-Ângulo',
  feature1Desc: 'Tire de 1 a 4 fotos com seu smartphone. Nossa IA sintetiza a malha 3D e texturas realistas sem custo de modelagem manual.',
  feature2Title: 'Apple Quick Look & Google Scene Viewer',
  feature2Desc: 'Integração direta com o hardware nativo do iPhone (LiDAR/ARKit) e Android (ARCore) para projeção com sombras reais na mesa física.',
  feature3Title: 'Checkout & Pedidos na Mesa com Pix',
  feature3Desc: 'Permita que o cliente faça o pedido diretamente da mesa com pagamento instantâneo por Pix ou Mercado Pago e divisão de conta.',
  feature4Title: 'KDS Cozinha & Painel de Insights',
  feature4Desc: 'Receba os pedidos na tela da cozinha em tempo real e acompanhe quais pratos em 3D geram maior conversão e faturamento.',

  // How it works
  howItWorksTitle: 'Como funciona a experiência em 3 passos',
  howItWorksSubtitle: 'Simplicidade radical para o cliente e autonomia total para o dono do restaurante.',
  step1Title: '1. O Cliente Escaneia o QR Code',
  step1Desc: 'Posicionado sobre a mesa física, o QR Code abre o cardápio WebAR imediatamente no navegador.',
  step2Title: '2. Projeta o Prato em 3D na Mesa',
  step2Desc: 'Com 1 toque em "Projetar na Minha Mesa", a câmera detecta a mesa e exibe a porção em escala real.',
  step3Title: '3. Pede e Paga sem Esperar',
  step3Desc: 'Adiciona ao pedido, escolhe gorjeta, divide a conta com os amigos e envia direto para a cozinha.',

  // ROI Calculator
  roiTitle: 'Simulador de Lucro Adicional',
  roiSubtitle: 'Descubra quanto sua cafeteria ou restaurante pode faturar a mais todos os meses com o AuraMenu 3D.',
  roiTablesLabel: 'Número de Mesas no Salão:',
  roiTicketLabel: 'Ticket Médio Atual por Cliente:',
  roiEstimatedIncrease: 'Aumento Estimado nas Vendas (+32% em sobremesas e cafés especiais):',
  roiExtraMonthly: 'Faturamento Adicional Estimado / Mês:',
  roiExtraYearly: 'Lucro Anual Extra Projetado:',

  // Pricing
  pricingTitle: 'Planos Transparentes e sem Surpresas',
  pricingSubtitle: 'Investimento que se paga logo nos primeiros dias com o aumento nas vendas de sobremesas.',
  planMonthly: '/mês',
  planStarterName: 'Cafeteria & Doceria',
  planStarterPrice: 'R$ 99',
  planStarterDesc: 'Ideal para cafés especiais, confeitarias e quiosques que querem encantar clientes com sobremesas 3D.',
  planProName: 'Bistrô & Restaurante Pro',
  planProPrice: 'R$ 199',
  planProDesc: 'Para operações completas com pedidos na mesa, KDS da cozinha, split de conta e analytics avançado.',
  planEnterpriseName: 'Redes & Franquias',
  planEnterprisePrice: 'R$ 399',
  planEnterpriseDesc: 'Múltiplas lojas, integrações personalizadas com PDV e suporte dedicado com SLA de 1 hora.',
  planCta: 'Começar Demonstração Grátis',
  popularBadge: 'MAIS ESCOLHIDO',

  // Client Menu
  tableNumberLabel: 'Mesa',
  searchPlaceholder: 'Buscar cafés, sobremesas, pratos...',
  allCategories: 'Todos os Itens',
  featuredTitle: 'Destaques Imersivos em 3D',
  featuredSubtitle: 'Experiência WebAR Real',
  viewIn3D: 'Ver em 3D',
  viewInAR: 'VER NA MESA EM REALIDADE AUMENTADA',
  projectOnTable: 'PROJETAR NA MINHA MESA',
  addToCart: 'Adicionar ao Pedido',
  addedToCart: 'Adicionado ao Pedido!',
  portionLabel: 'Porção',
  prepTimeLabel: 'Preparo',
  caloriesLabel: 'Calorias',
  chefSpecial: 'ESCOLHA DO CHEF',
  vegetarian: 'VEGETARIANO',
  glutenFree: 'SEM GLÚTEN',
  kitchenNotesPlaceholder: 'Observações para a cozinha (ex: sem açúcar, bem passado)...',
  myOrder: 'Minha Comanda',
  emptyCart: 'Sua comanda está vazia',
  emptyCartSub: 'Selecione pratos e cafés no cardápio acima para adicionar ao seu pedido.',
  totalOrder: 'Total do Pedido',
  checkoutBtn: 'Fechar Comanda & Pagar',

  // Checkout & Payment
  checkoutTitle: 'Finalizar Pedido na Mesa',
  customerNameLabel: 'Seu Nome (para chamar na mesa):',
  customerNamePlaceholder: 'Ex: Pedro Silva',
  tipLabel: 'Gorjeta do Garçom / Atendimento:',
  noTip: 'Sem Gorjeta',
  customTip: 'Personalizada',
  splitBillTitle: 'Dividir Conta com Amigos (Split Bill):',
  splitPersons: 'Pessoa(s)',
  valuePerPerson: 'Valor por pessoa:',
  paymentMethodTitle: 'Forma de Pagamento:',
  payPix: 'Pix Instantâneo (QR Code)',
  payPixDesc: 'Aprovação em segundos direto pelo celular',
  payMercadoPago: 'Mercado Pago & Cartão Online',
  payMercadoPagoDesc: 'Cartão de crédito ou saldo Mercado Pago',
  payCard: 'Pagar na Maquininha na Mesa',
  payCardDesc: 'O garçom leva a maquininha até você',
  payWaiter: 'Dinheiro no Caixa',
  payWaiterDesc: 'Pague ao finalizar sua refeição',
  pixCopyCode: 'Copiar Código Pix',
  pixCopied: 'Código Pix Copiado!',
  pixExpiresIn: 'Expira em:',
  pixWaitingConfirm: 'Aguardando confirmação do pagamento...',
  confirmPaymentBtn: 'Confirmar Pedido & Enviar à Cozinha',
  orderSuccessTitle: 'Pedido Enviado com Sucesso à Cozinha! 🎉',
  orderSuccessDesc: 'Sua refeição já começou a ser preparada pelos nossos chefs e baristas.',
  orderStatusSent: 'Enviado à Cozinha',
  orderStatusPrep: 'Em Preparo',
  orderStatusReady: 'Pronto / A Caminho',
  orderStatusDelivered: 'Entregue na Mesa',
  trackOrderBtn: 'Acompanhar Status do Pedido',

  // Admin & AI Studio
  adminDishesTab: 'Cardápio & Pratos 3D',
  adminCategoriesTab: 'Categorias',
  adminQRCodesTab: 'QR Codes de Mesa',
  adminInsightsTab: 'Insights & Analytics',
  adminKDSTab: 'Cozinha KDS',
  adminBillingTab: 'Planos & Assinatura',
  adminProfileTab: 'Perfil do Restaurante',
  newDishBtn: 'Novo Prato',
  aiStudioBtn: 'Foto ➔ 3D IA',
  aiStudioTitle: 'Estúdio IA: Multi-Fotos ➔ Modelo 3D Real',
  aiStudioDesc: 'Envie de 1 a 4 fotos de ângulos diferentes para a IA sintetizar o prato idêntico ao real com fidelidade 1:1.',
  takePhotoFront: 'Frente (45°)',
  takePhotoSide1: 'Lado Direito',
  takePhotoSide2: 'Lado Esquerdo',
  takePhotoTop: 'Topo (Superior)',
  generate3DBtn: 'Gerar Modelo 3D Fotorealista',
  publishDirectBtn: 'Publicar no Cardápio Agora',

  // Insights / Analytics
  insightsTitle: 'Painel de Desempenho & Inteligência de Negócio',
  insightsSubtitle: 'Métricas em tempo real sobre vendas, engajamento em Realidade Aumentada e conversão.',
  totalRevenue: 'Faturamento Total',
  averageTicket: 'Ticket Médio por Mesa',
  totalOrders: 'Pedidos Concluídos',
  totalARViews: 'Visualizações em Realidade Aumentada',
  arConversionRate: 'Taxa de Conversão WebAR ➔ Compra',
  topViewedDishes: 'Pratos Mais Projetados em AR',
  ordersByHour: 'Horários com Maior Volume de Pedidos',
  deviceDistribution: 'Acessos por Sistema Operacional (iOS vs Android)',

  // KDS Kitchen
  kdsTitle: 'Cozinha & Bar KDS em Tempo Real',
  kdsActiveOrders: 'Pedidos Ativos no Salão',
  kdsMinutesAgo: 'min atrás',
  kdsMarkPreparing: 'Iniciar Preparo',
  kdsMarkReady: 'Pronto p/ Entrega',
  kdsMarkDelivered: 'Entregue na Mesa',
  kdsAllClear: 'Tudo limpo! Nenhum pedido pendente no momento.',
};

const esAR: TranslationDictionary = {
  // Brand & Common
  appName: 'AuraMenu 3D',
  appTagline: 'Carta WebAR Inmersiva e Inteligencia Artificial para Cafeterías y Restaurantes',
  language: 'Idioma',
  portuguese: 'Português (BR)',
  spanish: 'Español (AR)',
  demoBadge: 'Demostración Interactiva',
  clientView: 'Vista del Cliente',
  adminView: 'Panel Administrador',
  kdsView: 'Cocina KDS',
  landingView: 'Inicio',
  currencySymbol: '$',

  // Landing Page
  heroBadge: 'Tecnología WebAR de Nueva Generación',
  heroTitle: 'La Carta en Realidad Aumentada que Aumenta tu Ticket Promedio hasta un 38%',
  heroSubtitle: 'Tus clientes escanean el código QR en la mesa y proyectan cafés, medialunas y platos en 3D holográfico a escala real 1:1, sin descargar ninguna app.',
  heroCtaDemo: 'Ver Carta Interactiva en Vivo',
  heroCtaAdmin: 'Acceder al Panel & Estudio IA',
  heroMetric1Value: '+38%',
  heroMetric1Label: 'Aumento en el Ticket Promedio de Cafés y Postres',
  heroMetric2Value: '0 Apps',
  heroMetric2Label: 'Abre directo en la cámara de Safari y Chrome',
  heroMetric3Value: '15 Seg',
  heroMetric3Label: 'Para generar el modelo 3D desde las fotos del plato',

  // Features Section
  featuresTitle: '¿Por qué AuraMenu supera a las cartas en PDF y papel?',
  featuresSubtitle: 'Diseñado para cafeterías de especialidad, bistrós y restaurantes que destacan por su calidad gastronómica.',
  feature1Title: 'Fotogrametría IA Multi-Ángulo',
  feature1Desc: 'Tomá de 1 a 4 fotos con tu celular. Nuestra IA sintetiza la malla 3D y texturas realistas sin costo de modelado manual.',
  feature2Title: 'Apple Quick Look & Google Scene Viewer',
  feature2Desc: 'Integración nativa con hardware de iPhone (LiDAR/ARKit) y Android (ARCore) para proyectar con sombras reales sobre la mesa.',
  feature3Title: 'Checkout & Pedidos en la Mesa con Mercado Pago',
  feature3Desc: 'Permití que el cliente haga su pedido desde la mesa con pago instantáneo, propina para el mozo y división de cuenta.',
  feature4Title: 'KDS para Cocina & Panel de Métricas',
  feature4Desc: 'Recibí los pedidos en la pantalla de cocina en tiempo real y descubrí qué platos en 3D generan más ventas y rentabilidad.',

  // How it works
  howItWorksTitle: 'Cómo funciona en 3 simples pasos',
  howItWorksSubtitle: 'Simplicidad absoluta para el comensal y total autonomía para el dueño del local.',
  step1Title: '1. El Cliente Escanea el Código QR',
  step1Desc: 'Ubicado en la mesa, el código QR abre el menú WebAR al instante en el navegador del teléfono.',
  step2Title: '2. Proyecta el Plato en 3D en la Mesa',
  step2Desc: 'Con un toque en "Proyectar en mi Mesa", la cámara detecta la superficie y ubica la porción en tamaño real.',
  step3Title: '3. Pide y Paga sin Esperas',
  step3Desc: 'Suma a la comanda, elige la propina para el mozo, divide la cuenta con amigos y envía directo a la cocina.',

  // ROI Calculator
  roiTitle: 'Calculadora de Ganancia Adicional',
  roiSubtitle: 'Calculá cuánto más puede facturar tu cafetería o restaurante al mes con AuraMenu 3D.',
  roiTablesLabel: 'Cantidad de Mesas en el Salón:',
  roiTicketLabel: 'Ticket Promedio Actual por Cliente:',
  roiEstimatedIncrease: 'Aumento Estimado en Ventas (+32% en postres y cafés de especialidad):',
  roiExtraMonthly: 'Facturación Adicional Estimada / Mes:',
  roiExtraYearly: 'Ganancia Extra Anual Proyectada:',

  // Pricing
  pricingTitle: 'Planes Transparentes y Claros',
  pricingSubtitle: 'Una inversión que se amortiza en los primeros días gracias al aumento en el consumo de pastelería.',
  planMonthly: '/mes',
  planStarterName: 'Cafetería & Pastelería',
  planStarterPrice: '$ 19 USD',
  planStarterDesc: 'Ideal para cafeterías de especialidad, pastelerías y locales que quieren enamorar a sus clientes con 3D.',
  planProName: 'Bistró & Restaurante Pro',
  planProPrice: '$ 39 USD',
  planProDesc: 'Para salones completos con pedidos en mesa, KDS de cocina, división de cuenta y analíticas avanzadas.',
  planEnterpriseName: 'Cadenas & Franquicias',
  planEnterprisePrice: '$ 79 USD',
  planEnterpriseDesc: 'Múltiples sucursales, integraciones con sistema de caja / POS y soporte prioritario con SLA de 1 hora.',
  planCta: 'Iniciar Demostración Gratis',
  popularBadge: 'MÁS ELEGIDO',

  // Client Menu
  tableNumberLabel: 'Mesa',
  searchPlaceholder: 'Buscar cafés, postres, medialunas, platos...',
  allCategories: 'Todos los Platos',
  featuredTitle: 'Destacados Inmersivos en 3D',
  featuredSubtitle: 'Experiencia WebAR Real',
  viewIn3D: 'Ver en 3D',
  viewInAR: 'VER EN LA MESA EN REALIDAD AUMENTADA',
  projectOnTable: 'PROYECTAR EN MI MESA',
  addToCart: 'Agregar a la Comanda',
  addedToCart: '¡Agregado a la Comanda!',
  portionLabel: 'Porción',
  prepTimeLabel: 'Demora',
  caloriesLabel: 'Calorías',
  chefSpecial: 'SUGERENCIA DEL CHEF',
  vegetarian: 'VEGETARIANO',
  glutenFree: 'SIN TACC',
  kitchenNotesPlaceholder: 'Notas para la cocina (ej: cortado en jarrito, sin azúcar)...',
  myOrder: 'Mi Comanda',
  emptyCart: 'Tu comanda está vacía',
  emptyCartSub: 'Elegí tus cafés y platos en la carta para armar tu pedido.',
  totalOrder: 'Total de la Comanda',
  checkoutBtn: 'Cerrar Comanda & Pagar',

  // Checkout & Payment
  checkoutTitle: 'Finalizar Pedido en la Mesa',
  customerNameLabel: 'Tu Nombre (para llamarte a la mesa):',
  customerNamePlaceholder: 'Ej: Mateo Rossi',
  tipLabel: 'Propina para el Mozo / Servicio:',
  noTip: 'Sin Propina',
  customTip: 'Personalizada',
  splitBillTitle: 'Dividir la Cuenta entre Amigos (Split Bill):',
  splitPersons: 'Persona(s)',
  valuePerPerson: 'Monto por persona:',
  paymentMethodTitle: 'Medio de Pago:',
  payPix: 'Mercado Pago (QR Instantáneo)',
  payPixDesc: 'Pago inmediato con dinero en cuenta o débito',
  payMercadoPago: 'Tarjeta de Crédito Online',
  payMercadoPagoDesc: 'Visa, Mastercard o Amex en cuotas',
  payCard: 'Pedir Posnet / Terminal a la Mesa',
  payCardDesc: 'El mozo te acerca el posnet inalámbrico',
  payWaiter: 'Efectivo al Mozo / Caja',
  payWaiterDesc: 'Aboná en efectivo al finalizar',
  pixCopyCode: 'Copiar Código de Pago',
  pixCopied: '¡Código Copiado!',
  pixExpiresIn: 'Vence en:',
  pixWaitingConfirm: 'Esperando confirmación del pago...',
  confirmPaymentBtn: 'Confirmar Pedido & Enviar a Cocina',
  orderSuccessTitle: '¡Pedido Enviado a Cocina con Éxito! 🎉',
  orderSuccessDesc: 'Nuestros baristas y cocineros ya están marchando tu pedido.',
  orderStatusSent: 'Enviado a Cocina',
  orderStatusPrep: 'En Preparación',
  orderStatusReady: 'Listo / En Camino',
  orderStatusDelivered: 'Entregado en la Mesa',
  trackOrderBtn: 'Seguir Estado del Pedido',

  // Admin & AI Studio
  adminDishesTab: 'Carta & Platos 3D',
  adminCategoriesTab: 'Categorías',
  adminQRCodesTab: 'Códigos QR de Mesa',
  adminInsightsTab: 'Métricas & Analítica',
  adminKDSTab: 'Cocina KDS',
  adminBillingTab: 'Planes & Facturación',
  adminProfileTab: 'Perfil del Local',
  newDishBtn: 'Nuevo Plato',
  aiStudioBtn: 'Foto ➔ 3D IA',
  aiStudioTitle: 'Estudio IA: Multi-Fotos ➔ Modelo 3D Real',
  aiStudioDesc: 'Subí de 1 a 4 fotos desde diferentes ángulos para que la IA reconstruya el plato idéntico al real con escala 1:1.',
  takePhotoFront: 'Frente (45°)',
  takePhotoSide1: 'Lado Derecho',
  takePhotoSide2: 'Lado Izquierdo',
  takePhotoTop: 'Arriba (Cenital)',
  generate3DBtn: 'Generar Modelo 3D Fotorealista',
  publishDirectBtn: 'Publicar en la Carta Ahora',

  // Insights / Analytics
  insightsTitle: 'Panel de Rendimiento & Business Intelligence',
  insightsSubtitle: 'Métricas en tiempo real sobre ventas, engagement en Realidad Aumentada y conversión.',
  totalRevenue: 'Facturación Total',
  averageTicket: 'Ticket Promedio por Mesa',
  totalOrders: 'Pedidos Completados',
  totalARViews: 'Visualizaciones en Realidad Aumentada',
  arConversionRate: 'Tasa de Conversión WebAR ➔ Venta',
  topViewedDishes: 'Platos Más Proyectados en AR',
  ordersByHour: 'Horarios con Mayor Volumen de Pedidos',
  deviceDistribution: 'Dispositivos de los Clientes (iOS vs Android)',

  // KDS Kitchen
  kdsTitle: 'Cocina & Barra KDS en Tiempo Real',
  kdsActiveOrders: 'Comandas Activas en el Salón',
  kdsMinutesAgo: 'min atrás',
  kdsMarkPreparing: 'Iniciar Preparación',
  kdsMarkReady: 'Listo para Servir',
  kdsMarkDelivered: 'Entregado en Mesa',
  kdsAllClear: '¡Todo al día! No hay pedidos pendientes en este momento.',
};

const LANGUAGE_KEY = 'auramenu_preferred_lang_v1';

type Listener = () => void;
const listeners: Set<Listener> = new Set();

let currentLanguage: Language = (localStorage.getItem(LANGUAGE_KEY) as Language) || 'pt-BR';

export const i18n = {
  getLanguage(): Language {
    return currentLanguage;
  },

  setLanguage(lang: Language): void {
    currentLanguage = lang;
    localStorage.setItem(LANGUAGE_KEY, lang);
    listeners.forEach(cb => cb());
  },

  t(): TranslationDictionary {
    return currentLanguage === 'es-AR' ? esAR : ptBR;
  },

  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  formatCurrency(value: number): string {
    if (currentLanguage === 'es-AR') {
      return `$ ${value.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
};
