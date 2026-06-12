// ======================== 聊天话术模板 ========================
// 按场景分类，每个场景含 en/fr/ar 三语
// 联系方式自动注入：📧 info@honglajiao1688.com / 💬 WhatsApp: +1 310-290-1842 / 💚 WeChat: MJ9588666

const CONTACT = `📧 info@honglajiao1688.com\n💬 WhatsApp: +1 310-290-1842\n💚 WeChat: MJ9588666`;

export interface ChatTemplate {
  en: string;
  fr: string;
  ar: string;
  zh?: string;
}

export const CHAT_TEMPLATES: Record<string, ChatTemplate> = {
  // ======================== 系统角色 ========================
  systemRole: {
    en: `You are a professional B2B used car export agent for ChinaCarExport (honglajiao1688.com).

IMPORTANT RULES:
1. Language: Always reply in ENGLISH.
2. Scope: ONLY talk about USED CAR EXPORT. NEVER mention auto parts, machinery, motorcycles, or any other product categories.
3. Purpose:
   - First: Understand customer needs (destination country, vehicle type, budget, quantity).
   - NEVER give a fixed price. Explain: "Price depends on quantity and destination port. 10 cars vs 20 cars differ. Ports like Dar es Salaam vs Lagos have different shipping costs."
   - Guide customers to fill the inquiry form on the website.
   - Guide customers to contact us via:
     ${CONTACT}
4. Tone: Professional, concise, helpful. Don't rush. Don't oversell.`,

    fr: `Vous êtes un agent professionnel B2B d'exportation de voitures d'occasion pour ChinaCarExport (honglajiao1688.com).

RÈGLES IMPORTANTES :
1. Langue : Répondez toujours en FRANÇAIS.
2. Domaine : Parlez UNIQUEMENT d'EXPORTATION DE VOITURES D'OCCASION. Ne mentionnez JAMAIS les pièces détachées, la machinerie, les motos ou toute autre catégorie de produits.
3. Objectif :
   - D'abord : Comprendre les besoins du client (pays de destination, type de véhicule, budget, quantité).
   - Ne JAMAIS donner un prix fixe. Expliquez : "Le prix dépend de la quantité et du port de destination. 10 voitures vs 20 voitures, c'est différent. Les ports comme Dar es Salaam vs Lagos ont des frais d'expédition différents."
   - Guider les clients vers le formulaire de demande sur le site web.
   - Guider les clients à nous contacter via :
     ${CONTACT}
4. Ton : Professionnel, concis, utile. Ne vous précipitez pas. Ne faites pas de vente agressive.`,

    ar: `أنت وكيل تصدير سيارات مستعملة محترف لشركة ChinaCarExport (honglajiao1688.com).

قواعد مهمة:
1. اللغة: قم بالرد دائمًا باللغة العربية.
2. النطاق: تحدث فقط عن تصدير السيارات المستعملة. لا تذكر أبدًا قطع الغيار أو الآلات أو الدراجات النارية أو أي فئات منتجات أخرى.
3. الهدف:
   - أولاً: فهم احتياجات العميل (بلد الوجهة، نوع السيارة، الميزانية، الكمية).
   - لا تعطي سعرًا ثابتًا أبدًا. اشرح: "السعر يعتمد على الكمية وميناء الوصول. 10 سيارات تختلف عن 20 سيارة. موانئ مثل دار السلام تختلف عن لاغوس في تكاليف الشحن."
   - توجيه العملاء لملء نموذج الاستفسار على الموقع.
   - توجيه العملاء للتواصل معنا عبر:
     ${CONTACT}
4. النبرة: محترف، موجز، مفيد. لا تتعجل. لا تبالغ في البيع.`,
  },

  // ======================== 欢迎语 ========================
  greeting: {
    en: `Hello! Welcome to ChinaCarExport. We specialize in exporting quality used cars to Africa, the Middle East, and beyond.

How can I help you today? To give you the best options, please let me know:
- Which country are you importing to?
- What type of vehicles are you looking for?
- What's your approximate budget and quantity?`,

    fr: `Bonjour ! Bienvenue chez ChinaCarExport. Nous sommes spécialisés dans l'exportation de voitures d'occasion de qualité vers l'Afrique, le Moyen-Orient et au-delà.

Comment puis-je vous aider aujourd'hui ? Pour vous proposer les meilleures options, veuillez m'indiquer :
- Vers quel pays importez-vous ?
- Quel type de véhicules recherchez-vous ?
- Quel est votre budget approximatif et la quantité ?`,

    ar: `مرحبًا! أهلاً بك في ChinaCarExport. نحن متخصصون في تصدير السيارات المستعملة عالية الجودة إلى أفريقيا والشرق الأوسط وغيرها.

كيف يمكنني مساعدتك اليوم؟ لأقدم لك أفضل الخيارات، يرجى إخباري:
- إلى أي بلد تستورد؟
- ما نوع السيارات التي تبحث عنها؟
- ما هي ميزانيتك التقريبية والكمية؟`,
  },

  // ======================== 不报价 ========================
  priceObjection: {
    en: `I understand you'd like a price, but I can't give you a fixed quote right now. Here's why:

The final price depends on:
1. Quantity — 10 units vs 20 units have different unit prices
2. Destination port — shipping to Dar es Salaam vs Lagos costs differently
3. Vehicle condition and specifications

Please tell me more about your needs, or fill out our inquiry form on the website. Our sales team will give you a detailed quotation within 24 hours.

You can also reach us directly:
${CONTACT}`,

    fr: `Je comprends que vous souhaitiez un prix, mais je ne peux pas vous donner un devis fixe maintenant. Voici pourquoi :

Le prix final dépend de :
1. La quantité — 10 unités vs 20 unités ont des prix unitaires différents
2. Le port de destination — l'expédition vers Dar es Salaam vs Lagos a des coûts différents
3. L'état et les spécifications du véhicule

Veuillez m'en dire plus sur vos besoins, ou remplissez notre formulaire de demande sur le site web. Notre équipe commerciale vous enverra un devis détaillé sous 24 heures.

Vous pouvez également nous contacter directement :
${CONTACT}`,

    ar: `أتفهم أنك ترغب في معرفة السعر، لكن لا يمكنني إعطاؤك عرض سعر ثابت الآن. إليك السبب:

السعر النهائي يعتمد على:
1. الكمية — 10 وحدات مقابل 20 وحدة لها أسعار وحدة مختلفة
2. ميناء الوجهة — الشحن إلى دار السلام مقابل لاغوس له تكاليف مختلفة
3. حالة السيارة ومواصفاتها

يرجى إخباري المزيد عن احتياجاتك، أو املأ نموذج الاستفسار على موقعنا. سيقوم فريق المبيعات لدينا بتزويدك بعرض سعر مفصل خلال 24 ساعة.

يمكنك أيضًا التواصل معنا مباشرة:
${CONTACT}`,
  },

  // ======================== 要联系方式 ========================
  contactCollection: {
    en: `Great! To make sure we don't lose touch, could you share your contact details?

You can:
- Leave your email address here
- Reach us on WhatsApp: +1 310-290-1842
- Add us on WeChat: MJ9588666
- Or fill out the inquiry form on our website

This way our sales team can follow up with detailed information tailored to your needs.`,

    fr: `Super ! Pour être sûr de ne pas perdre le contact, pourriez-vous partager vos coordonnées ?

Vous pouvez :
- Laisser votre adresse e-mail ici
- Nous contacter sur WhatsApp : +1 310-290-1842
- Nous ajouter sur WeChat : MJ9588666
- Ou remplir le formulaire de demande sur notre site web

Ainsi, notre équipe commerciale pourra vous envoyer des informations détaillées adaptées à vos besoins.`,

    ar: `رائع! لضمان عدم فقدان التواصل، هل يمكنك مشاركة تفاصيل الاتصال الخاصة بك؟

يمكنك:
- ترك عنوان بريدك الإلكتروني هنا
- التواصل معنا على واتساب: +1 310-290-1842
- إضافتنا على وي شات: MJ9588666
- أو ملء نموذج الاستفسار على موقعنا

بهذه الطريقة يمكن لفريق المبيعات لدينا متابعة الأمر بمعلومات مفصلة تناسب احتياجاتك.`,
  },

  // ======================== 问国家 ========================
  countryQuestion: {
    en: `Which country are you importing to? This helps us:
- Calculate accurate shipping costs
- Recommend vehicles popular in your market
- Check import regulations and duties

Common destinations we serve: Nigeria, Kenya, Ghana, Tanzania, Ethiopia, UAE, Saudi Arabia, and more.`,

    fr: `Vers quel pays importez-vous ? Cela nous aide à :
- Calculer les frais d'expédition précis
- Recommander des véhicules populaires sur votre marché
- Vérifier les réglementations et droits d'importation

Destinations courantes que nous desservons : Nigeria, Kenya, Ghana, Tanzanie, Éthiopie, EAU, Arabie Saoudite, et plus encore.`,

    ar: `إلى أي بلد تستورد؟ هذا يساعدنا في:
- حساب تكاليف الشحن بدقة
- التوصية بالسيارات الشائعة في سوقك
- التحقق من لوائح ورسوم الاستيراد

الوجهات الشائعة التي نخدمها: نيجيريا، كينيا، غانا، تنزانيا، إثيوبيا، الإمارات، السعودية، وغيرها.`,
  },

  // ======================== 问车型 ========================
  vehicleQuestion: {
    en: `What type of vehicles are you interested in? We have a wide range:

- Sedans (Toyota Corolla, Honda Civic, etc.)
- SUVs (Toyota RAV4, Honda CR-V, Land Cruiser, etc.)
- Pickups (Toyota Hilux, Ford Ranger, etc.)
- Luxury (Mercedes, BMW, Audi, Lexus, etc.)
- Electric/Hybrid (BYD, Tesla, Toyota Hybrid, etc.)

Any specific brands, models, or year ranges you're looking for?`,

    fr: `Quel type de véhicules vous intéresse ? Nous avons une large gamme :

- Berlines (Toyota Corolla, Honda Civic, etc.)
- SUV (Toyota RAV4, Honda CR-V, Land Cruiser, etc.)
- Pick-ups (Toyota Hilux, Ford Ranger, etc.)
- Luxe (Mercedes, BMW, Audi, Lexus, etc.)
- Électrique/Hybride (BYD, Tesla, Toyota Hybrid, etc.)

Des marques, modèles ou années spécifiques que vous recherchez ?`,

    ar: `ما نوع السيارات التي تهتم بها؟ لدينا مجموعة واسعة:

- سيدان (تويوتا كورولا، هوندا سيفيك، إلخ)
- SUV (تويوتا RAV4، هوندا CR-V، لاند كروزر، إلخ)
- بيك أب (تويوتا هايلكس، فورد رينجر، إلخ)
- فاخرة (مرسيدس، BMW، أودي، لكزس، إلخ)
- كهربائية/هجينة (BYD، تيسلا، تويوتا هايبرد، إلخ)

هل هناك علامات تجارية أو موديلات أو سنوات محددة تبحث عنها؟`,
  },

  // ======================== 问预算 ========================
  budgetQuestion: {
    en: `What's your approximate budget and quantity? This helps us recommend the best options.

For reference, our customers typically order:
- Small orders: 1-5 units for trial
- Medium orders: 10-20 units per shipment
- Large orders: 50+ units for container loads

No budget is too small or too large — we work with buyers at all scales.`,

    fr: `Quel est votre budget approximatif et la quantité ? Cela nous aide à recommander les meilleures options.

Pour référence, nos clients commandent généralement :
- Petites commandes : 1-5 unités pour essai
- Commandes moyennes : 10-20 unités par expédition
- Grandes commandes : 50+ unités par conteneur

Aucun budget n'est trop petit ou trop grand — nous travaillons avec des acheteurs de toutes tailles.`,

    ar: `ما هي ميزانيتك التقريبية والكمية؟ هذا يساعدنا في التوصية بأفضل الخيارات.

للإشارة، عملاؤنا يطلبون عادة:
- طلبات صغيرة: 1-5 وحدات للتجربة
- طلبات متوسطة: 10-20 وحدة لكل شحنة
- طلبات كبيرة: 50+ وحدة لحاويات كاملة

لا توجد ميزانية صغيرة جدًا أو كبيرة جدًا — نحن نعمل مع مشترين من جميع الأحجام.`,
  },

  // ======================== 结束语 ========================
  farewell: {
    en: `Thank you for chatting with us! Here's a quick summary:

- Our sales team will follow up with you shortly
- Feel free to reach out anytime:
  ${CONTACT}
- Browse our website for the latest inventory: honglajiao1688.com

Have a great day!`,

    fr: `Merci d'avoir discuté avec nous ! Voici un petit résumé :

- Notre équipe commerciale vous contactera bientôt
- N'hésitez pas à nous contacter à tout moment :
  ${CONTACT}
- Parcourez notre site web pour les dernières offres : honglajiao1688.com

Bonne journée !`,

    ar: `شكرًا لتواصلك معنا! إليك ملخص سريع:

- سيتواصل فريق المبيعات لدينا معك قريبًا
- لا تتردد في التواصل معنا في أي وقت:
  ${CONTACT}
- تصفح موقعنا للحصول على أحدث المخزون: honglajiao1688.com

طاب يومك!`,
  },

  // ======================== 客服繁忙/千问挂了兜底 ========================
  notAvailable: {
    en: `Sorry, at the yard checking a shipment. I'll reply soon. Urgent? WhatsApp: +1 (310) 290-1842\n\n📧 info@honglajiao1688.com`,
    fr: `Désolé, au dépôt en train de vérifier un chargement. Je réponds vite. Urgent ? WhatsApp: +1 (310) 290-1842\n\n📧 info@honglajiao1688.com`,
    ar: `عذرًا، أنا في المستودع أفحص شحنة. سأرد قريبًا. urgent؟ واتساب: +1 (310) 290-1842\n\n📧 info@honglajiao1688.com`,
  },

  // ======================== 转人工兜底 (MJ 口吻) ========================
  escalationAuto: {
    en: `Hey, MJ here — I'll take over from here. Leave your WhatsApp or email and I'll get back to you fast. Or reach me directly:\n\nWhatsApp: +1 (310) 290-1842\n📧 info@honglajiao1688.com\n💚 WeChat: MJ9588666\n\nI'll personally handle your inquiry. Talk soon.`,
    fr: `Salut, c'est MJ — je prends le relais. Laissez votre WhatsApp ou email, je vous réponds rapidement. Ou contactez-moi directement:\n\nWhatsApp: +1 (310) 290-1842\n📧 info@honglajiao1688.com\n💚 WeChat: MJ9588666\n\nJe traiterai personnellement votre demande. À bientôt.`,
    ar: `مرحبًا، أنا MJ — سأتولى الأمر من هنا. اترك واتسابك أو بريدك الإلكتروني وسأرد عليك بسرعة. أو تواصل معي مباشرة:\n\nWhatsApp: +1 (310) 290-1842\n📧 info@honglajiao1688.com\n💚 WeChat: MJ9588666\n\nسأتعامل مع استفسارك شخصيًا. نتحدث قريبًا.`,
    zh: `嗨，我是 MJ，我来接手。留个 WhatsApp 或邮箱，我尽快回复你。或者直接找我：\n\nWhatsApp: +1 (310) 290-1842\n📧 info@honglajiao1688.com\n💚 微信: MJ9588666\n\n你的询价我亲自跟。回聊。`,
  },

  // ======================== 空回复兜底 ========================
  emptyReply: {
    en: `Sorry, at the yard checking a shipment. I'll reply soon. Urgent? WhatsApp: +1 (310) 290-1842\n\n📧 info@honglajiao1688.com`,
    fr: `Désolé, au dépôt en train de vérifier un chargement. Je réponds vite. Urgent ? WhatsApp: +1 (310) 290-1842\n\n📧 info@honglajiao1688.com`,
    ar: `عذرًا، أنا في المستودع أفحص شحنة. سأرد قريبًا. urgent؟ واتساب: +1 (310) 290-1842\n\n📧 info@honglajiao1688.com`,
  },
};
