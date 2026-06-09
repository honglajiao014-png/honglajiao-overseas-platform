// ======================== 关键词路由表 ========================
// 在千问调用前匹配，命中后注入上下文或触发 action
// en 必须有翻译，fr/ar/zh 可选（fallback 到 en）

export type Lang = "en" | "fr" | "ar" | "zh";

export interface KeywordRoute {
  keywords: string[];
  category: string;
  reply: Record<Lang, string>;
  action?: "mark_urgent" | "escalate";
}

const CONTACT = `📧 junmu783@gmail.com\n💬 WhatsApp: +1 310-290-1842\n💚 WeChat: MJ9588666`;

export const KEYWORD_ROUTES: KeywordRoute[] = [
  // ======================== 国家检测 ========================
  {
    keywords: [
      "nigeria", "kenya", "ghana", "tanzania", "ethiopia",
      "dar es salaam", "mombasa", "lagos", "accra", "addis ababa",
      "nairobi", "abuja", "douala", "cotonou", "lome", "togo",
      "congo", "angola", "mozambique", "zambia", "zimbabwe",
      "uganda", "rwanda", "senegal", "ivory coast", "cameroon",
      "dubai", "uae", "saudi arabia", "jordan", "iraq", "libya",
    ],
    category: "country_detection",
    reply: {
      en: `[Context for AI: The customer mentioned a specific country. Import regulations and shipping costs vary by destination. Key points to mention:
- Each country has different import duties and age restrictions on used cars
- We regularly ship to this destination and know the procedures
- Shipping time is typically 25-45 days depending on port
- We can recommend vehicles that are popular and easy to clear in this market
Do NOT give a fixed price — explain it depends on quantity and port.]`,
      fr: `[Contexte pour l'IA : Le client a mentionné un pays spécifique. Les réglementations d'importation et les frais d'expédition varient selon la destination. Points clés à mentionner :
- Chaque pays a des droits d'importation et des restrictions d'âge différents sur les voitures d'occasion
- Nous expédions régulièrement vers cette destination et connaissons les procédures
- Le délai d'expédition est généralement de 25 à 45 jours selon le port
- Nous pouvons recommander des véhicules populaires et faciles à dédouaner sur ce marché
Ne donnez PAS de prix fixe — expliquez que cela dépend de la quantité et du port.]`,
      ar: `[سياق للذكاء الاصطناعي: ذكر العميل بلدًا محددًا. تختلف لوائح الاستيراد وتكاليف الشحن حسب الوجهة. نقاط رئيسية يجب ذكرها:
- لكل دولة رسوم استيراد وقيود عمر مختلفة على السيارات المستعملة
- نشحن بانتظام إلى هذه الوجهة ونعرف الإجراءات
- وقت الشحن عادة 25-45 يومًا حسب الميناء
- يمكننا التوصية بسيارات شائعة وسهلة التخليص في هذا السوق
لا تعط سعرًا ثابتًا — اشرح أنه يعتمد على الكمية والميناء.]`,
      zh: `[AI上下文：客户提到了具体国家。各国进口法规和运费不同。要点：各国关税和车龄限制不同/我们常走这条线/船期25-45天/可推荐当地热门易清关车型。不要报固定价格。]`,
    },
  },

  // ======================== 品牌车型 ========================
  {
    keywords: [
      "toyota", "honda", "bmw", "mercedes", "benz", "audi",
      "corolla", "rav4", "hilux", "land cruiser", "prado",
      "camry", "civic", "accord", "cr-v", "crv",
      "byd", "tesla", "nissan", "hyundai", "kia",
      "lexus", "range rover", "land rover", "porsche",
      "volkswagen", "mitsubishi", "suzuki", "ford", "chevrolet",
      "foton", "dongfeng", "geely", "changan", "great wall",
      "sprinter", "hiace", "dyna", "canter", "fuso",
    ],
    category: "brand_model",
    reply: {
      en: `[Context for AI: The customer mentioned a specific brand or model. We have access to this brand/model in our supply network. Key points:
- We source directly from Chinese wholesale markets and auctions
- All vehicles undergo professional inspection before shipping
- We can provide detailed photos, inspection reports, and auction sheets
- Popular models move fast — encourage the customer to specify year range and budget
Do NOT quote a specific price — explain it varies by year, condition, and quantity.]`,
      fr: `[Contexte pour l'IA : Le client a mentionné une marque ou un modèle spécifique. Nous avons accès à cette marque/modèle dans notre réseau d'approvisionnement. Points clés :
- Nous nous approvisionnons directement sur les marchés de gros et les enchères en Chine
- Tous les véhicules sont soumis à une inspection professionnelle avant expédition
- Nous pouvons fournir des photos détaillées, des rapports d'inspection et des feuilles d'enchères
- Les modèles populaires partent vite — encouragez le client à préciser la gamme d'années et le budget
Ne donnez PAS de prix spécifique — expliquez que cela varie selon l'année, l'état et la quantité.]`,
      ar: `[سياق للذكاء الاصطناعي: ذكر العميل علامة تجارية أو موديلًا محددًا. لدينا إمكانية الوصول إلى هذه العلامة/الموديل في شبكة التوريد لدينا. نقاط رئيسية:
- نستورد مباشرة من أسواق الجملة والمزادات الصينية
- تخضع جميع السيارات لفحص احترافي قبل الشحن
- يمكننا تقديم صور مفصلة وتقارير فحص وأوراق مزاد
- الموديلات الشائعة تنفد بسرعة — شجع العميل على تحديد نطاق السنة والميزانية
لا تعط سعرًا محددًا — اشرح أنه يختلف حسب السنة والحالة والكمية.]`,
      zh: `[AI上下文：客户提到了具体品牌/车型。我们供应链有货源。要点：中国批发市场+拍卖直采/全车专业检测/可提供详细照片和检测报告/热门车型走得快，引导客户给年份范围和预算。不要报具体价格。]`,
    },
  },

  // ======================== 预算询问 ========================
  {
    keywords: [
      "cheap", "cheapest", "affordable", "low price", "lowest price",
      "under", "budget", "price range", "how much", "cost",
      "inexpensive", "economical", "discount", "best price",
      "what is the price", "what's the price", "quote", "quotation",
    ],
    category: "budget_inquiry",
    reply: {
      en: `[Context for AI: The customer is asking about price/budget. IMPORTANT — do NOT give a fixed price. Instead:
- Explain that price depends on: quantity (bulk discount), destination port (shipping cost varies), vehicle year and condition
- Suggest the customer tell us their budget range so we can recommend the best options
- Mention that for reference, popular models like Toyota Corolla (2018-2020) typically range from $8,000-$15,000 FOB depending on condition and quantity
- Guide them to fill the inquiry form for a detailed quotation]`,
      fr: `[Contexte pour l'IA : Le client demande le prix/budget. IMPORTANT — ne donnez PAS de prix fixe. À la place :
- Expliquez que le prix dépend de : la quantité (remise sur volume), le port de destination (coût d'expédition variable), l'année et l'état du véhicule
- Suggérez au client de nous indiquer sa fourchette de budget pour que nous puissions recommander les meilleures options
- Mentionnez qu'à titre indicatif, les modèles populaires comme la Toyota Corolla (2018-2020) varient généralement de 8 000 à 15 000 $ FOB selon l'état et la quantité
- Orientez-les vers le formulaire de demande pour un devis détaillé]`,
      ar: `[سياق للذكاء الاصطناعي: العميل يسأل عن السعر/الميزانية. مهم — لا تعط سعرًا ثابتًا. بدلاً من ذلك:
- اشرح أن السعر يعتمد على: الكمية (خصم الكمية)، ميناء الوجهة (تكلفة الشحن تختلف)، سنة وحالة السيارة
- اقترح على العميل إخبارنا بنطاق ميزانيته حتى نتمكن من التوصية بأفضل الخيارات
- اذكر أنه كمرجع، الموديلات الشائعة مثل تويوتا كورولا (2018-2020) تتراوح عادة من 8,000-15,000 دولار FOB حسب الحالة والكمية
- وجههم لملء نموذج الاستفسار للحصول على عرض سعر مفصل]`,
      zh: `[AI上下文：客户问价格/预算。重要——不要报固定价格。解释价格取决于数量/目的港/车况年份。引导客户给预算范围。参考：热门车型如卡罗拉2018-2020约$8K-$15K FOB。引导填询价表。]`,
    },
  },

  // ======================== 急单标记 ========================
  {
    keywords: [
      "urgent", "urgently", "asap", "as soon as possible",
      "immediately", "right now", "emergency", "rush",
      "need it fast", "quick delivery", "fast delivery",
      "ready to buy", "ready to order", "serious buyer",
      "buy today", "buy now", "this week",
    ],
    category: "urgent",
    reply: {
      en: `[Context for AI: The customer shows URGENT buying intent. They want to move fast. Key actions:
- Prioritize this conversation — be direct and efficient
- Ask for exact requirements (model, year, quantity, destination) to give a quick quote
- Mention we can arrange priority inspection and shipping for urgent orders
- Guide them to contact us directly via WhatsApp/WeChat for faster response
- Our sales team can respond within hours for urgent inquiries]`,
      fr: `[Contexte pour l'IA : Le client montre une intention d'achat URGENTE. Il veut aller vite. Actions clés :
- Priorisez cette conversation — soyez direct et efficace
- Demandez les exigences exactes (modèle, année, quantité, destination) pour donner un devis rapide
- Mentionnez que nous pouvons organiser une inspection et une expédition prioritaires pour les commandes urgentes
- Orientez-les vers un contact direct via WhatsApp/WeChat pour une réponse plus rapide
- Notre équipe commerciale peut répondre dans les heures qui suivent pour les demandes urgentes]`,
      ar: `[سياق للذكاء الاصطناعي: يظهر العميل نية شراء عاجلة. يريد التحرك بسرعة. إجراءات رئيسية:
- أعط أولوية لهذه المحادثة — كن مباشرًا وفعالاً
- اسأل عن المتطلبات الدقيقة (الموديل، السنة، الكمية، الوجهة) لإعطاء عرض سعر سريع
- اذكر أنه يمكننا ترتيب فحص وشحن بأولوية للطلبات العاجلة
- وجههم للتواصل المباشر عبر واتساب/وي شات للحصول على رد أسرع
- يمكن لفريق المبيعات لدينا الرد في غضون ساعات للاستفسارات العاجلة]`,
      zh: `[AI上下文：客户表现出急单意向。优先处理——直接高效。问清具体需求给快速报价。可安排优先验车和加急船期。引导加WhatsApp/微信获取更快响应。]`,
    },
    action: "mark_urgent",
  },

  // ======================== 竞争对手 ========================
  {
    keywords: [
      "alibaba", "made-in-china", "made in china", "other supplier",
      "other seller", "another company", "competitor", "cheaper elsewhere",
      "better price elsewhere", "found cheaper", "other website",
      "global sources", "tradekey", "exportersindia",
    ],
    category: "competitor",
    reply: {
      en: `[Context for AI: The customer mentioned competitors or comparing with other suppliers. Key differentiators to emphasize:
- We do PROFESSIONAL VEHICLE INSPECTION — every car is checked by our own inspectors, not just photos from auctions
- We AUDIT every supplier — many Alibaba sellers are middlemen who never see the cars
- We handle ALL export documentation (B/L, Certificate of Origin, etc.) in-house
- We have a physical office and warehouse in China — you can visit us
- Our after-sales support: if there's an issue, we resolve it — not disappear like many online sellers
- We've been in this business for years with hundreds of satisfied African and Middle Eastern buyers
Be confident but not aggressive. Don't badmouth competitors directly — just state our advantages.]`,
      fr: `[Contexte pour l'IA : Le client a mentionné des concurrents ou compare avec d'autres fournisseurs. Différenciateurs clés à souligner :
- Nous faisons une INSPECTION PROFESSIONNELLE DES VÉHICULES — chaque voiture est vérifiée par nos propres inspecteurs, pas seulement des photos d'enchères
- Nous AUDITONS chaque fournisseur — de nombreux vendeurs Alibaba sont des intermédiaires qui ne voient jamais les voitures
- Nous gérons TOUS les documents d'exportation (B/L, Certificat d'Origine, etc.) en interne
- Nous avons un bureau physique et un entrepôt en Chine — vous pouvez nous rendre visite
- Notre support après-vente : s'il y a un problème, nous le résolvons — nous ne disparaissons pas comme de nombreux vendeurs en ligne
- Nous sommes dans ce métier depuis des années avec des centaines d'acheteurs africains et moyen-orientaux satisfaits
Soyez confiant mais pas agressif. Ne dénigrez pas directement les concurrents — énoncez simplement nos avantages.]`,
      ar: `[سياق للذكاء الاصطناعي: ذكر العميل منافسين أو يقارن مع موردين آخرين. مميزات رئيسية يجب التأكيد عليها:
- نقوم بفحص احترافي للسيارات — يتم فحص كل سيارة من قبل مفتشينا، ولي�� مجرد صور من المزادات
- ندقق على كل مورد — العديد من بائعي Alibaba هم وسطاء لا يرون السيارات أبدًا
- نتعامل مع جميع وثائق التصدير (B/L، شهادة المنشأ، إلخ) داخليًا
- لدينا مكتب ومستودع فعلي في الصين — يمكنك زيارتنا
- دعم ما بعد البيع: إذا كانت هناك مشكلة، نحلها — لا نختفي مثل العديد من البائعين عبر الإنترنت
- نحن في هذا المجال منذ سنوات مع مئات المشترين الأفارقة والشرق أوسطيين الراضين
كن واثقًا ولكن ليس عدوانيًا. لا تنتقد المنافسين مباشرة — فقط اذكر مزايانا.]`,
      zh: `[AI上下文：客户提到竞对或比价。强调差异化：专业验车（自有检测师，不是拍卖行照片）/审核每个供应商/全套出口单证自营/中国有实体办公室和仓库可参观/售后有问题我们解决不消失/多年经验数百非洲中东客户。自信但不攻击竞对。]`,
    },
  },

  // ======================== 港口物流 ========================
  {
    keywords: [
      "shipping", "freight", "container", "ro-ro", "roro", "ro ro",
      "cif", "fob", "delivery time", "shipping time", "shipping cost",
      "port", "vessel", "ship", "logistics", "transport",
      "customs", "clearance", "import duty", "import tax",
      "bill of lading", "export documents",
    ],
    category: "shipping_logistics",
    reply: {
      en: `[Context for AI: The customer is asking about shipping/logistics. Key information to share:
- We offer both FOB (we handle export; you arrange shipping) and CIF (we deliver to your port)
- Shipping methods: Ro-Ro (roll-on/roll-off — cheaper, for running cars) and Container (more secure, for high-value vehicles)
- Typical transit time: 25-45 days to major African ports, 15-25 days to Middle East
- We handle all export documentation: B/L, Certificate of Origin, Commercial Invoice, Export Declaration
- For exact shipping cost, we need to know: destination port, quantity, and vehicle types
- We work with reliable shipping lines and can recommend freight forwarders if needed
Guide the customer to share destination port and order details for a shipping quote.]`,
      fr: `[Contexte pour l'IA : Le client pose des questions sur l'expédition/la logistique. Informations clés à partager :
- Nous proposons FOB (nous gérons l'export ; vous organisez l'expédition) et CIF (nous livrons à votre port)
- Méthodes d'expédition : Ro-Ro (moins cher, pour voitures roulantes) et Conteneur (plus sécurisé, pour véhicules haut de gamme)
- Délai de transit typique : 25-45 jours vers les principaux ports africains, 15-25 jours vers le Moyen-Orient
- Nous gérons tous les documents d'exportation : B/L, Certificat d'Origine, Facture Commerciale, Déclaration d'Exportation
- Pour un coût d'expédition exact, nous avons besoin de connaître : le port de destination, la quantité et les types de véhicules
- Nous travaillons avec des compagnies maritimes fiables et pouvons recommander des transitaires si nécessaire
Orientez le client pour qu'il partage le port de destination et les détails de la commande pour un devis d'expédition.]`,
      ar: `[سياق للذكاء الاصطناعي: العميل يسأل عن الشحن/الخدمات اللوجستية. معلومات رئيسية للمشاركة:
- نقدم FOB (نتولى التصدير؛ ترتب أنت الشحن) و CIF (نوصل إلى مينائك)
- طرق الشحن: Ro-Ro (أرخص، للسيارات التي تعمل) والحاويات (أكثر أمانًا، للسيارات عالية القيمة)
- وقت العبور النموذجي: 25-45 يومًا إلى الموانئ الأفريقية الرئيسية، 15-25 يومًا إلى الشرق الأوسط
- نتعامل مع جميع وثائق التصدير: بوليصة الشحن، شهادة المنشأ، الفاتورة التجارية، بيان التصدير
- لتكلفة الشحن الدقيقة، نحتاج إلى معرفة: ميناء الوجهة، الكمية، وأنواع السيارات
- نعمل مع خطوط شحن موثوقة ويمكننا التوصية بوكلاء شحن إذا لزم الأمر
وجه العميل لمشاركة ميناء الوجهة وتفاصيل الطلب للحصول على عرض شحن.]`,
      zh: `[AI上下文：客户问物流。关键信息：FOB和CIF都做/Ro-Ro便宜适合能开的车，集装箱更安全适合高价值车/非洲主要港口25-45天，中东15-25天/全套出口单证我们包办/精确运费需要目的港+数量+车型。引导客户提供目的港和订单详情。]`,
    },
  },

  // ======================== 不满情绪 → escalate ========================
  {
    keywords: [
      "not helpful", "waste time", "waste of time", "useless",
      "real person", "real agent", "human", "talk to human",
      "speak to human", "agent please", "customer service",
      "manager", "supervisor", "complaint", "frustrated",
      "this is automated", "bot", "robot", "ai",
      "call me", "phone number", "phone call",
    ],
    category: "dissatisfaction",
    reply: {
      en: `I understand your frustration, and I'm sorry the automated assistant couldn't fully address your needs. Let me connect you with a real person.

Please leave your email address below, and our sales manager will personally reach out to you within 24 hours. You can also contact us directly:

${CONTACT}

We take every inquiry seriously and will make sure you get the help you need. Thank you for your patience.`,
      fr: `Je comprends votre frustration, et je suis désolé que l'assistant automatisé n'ait pas pu répondre pleinement à vos besoins. Laissez-moi vous mettre en relation avec une personne réelle.

Veuillez laisser votre adresse e-mail ci-dessous, et notre responsable commercial vous contactera personnellement dans les 24 heures. Vous pouvez également nous contacter directement :

${CONTACT}

Nous prenons chaque demande au sérieux et nous assurerons que vous obteniez l'aide dont vous avez besoin. Merci de votre patience.`,
      ar: `أتفهم إحباطك، وأنا آسف لأن المساعد الآلي لم يتمكن من تلبية احتياجاتك بالكامل. دعني أوصلك بشخص حقيقي.

يرجى ترك عنوان بريدك الإلكتروني أدناه، وسيتواصل معك مدير المبيعات لدينا شخصيًا خلال 24 ساعة. يمكنك أيضًا التواصل معنا مباشرة:

${CONTACT}

نحن نأخذ كل استفسار على محمل الجد وسنتأكد من حصولك على المساعدة التي تحتاجها. شكرًا لصبرك.`,
      zh: `我理解您的不满，很抱歉自动助手没能完全解决您的问题。请留下您的邮箱，我们的销售经理会在24小时内亲自联系您。您也可以直接联系我们：${CONTACT}。我们重视每一个询盘，一定会确保您得到需要的帮助。感谢您的耐心。`,
    },
    action: "escalate",
  },
];
