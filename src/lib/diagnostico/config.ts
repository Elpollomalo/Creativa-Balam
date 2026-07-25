// Creativa Balam — Diagnóstico de Marketing Personalizado
// Portado de Framer (CreativaBalam_Diagnostico_Form_v3_1 / Formulario_marketing1).
// 7 bloques, 19 preguntas base + ramas condicionales + archivo opcional.
// Multi-idioma (ES / EN / ZH / HI), independiente del next-intl del resto del sitio.

export const COLORS = {
  negro: "#1A1A1A",
  jade: "#1B4D3E",
  ambar: "#C9962C",
  hueso: "#F8F6F2",
  piedra: "#6B6B6B",
  piedraClaro: "#D8D8D8",
} as const;

export type Lang = "es" | "en" | "zh" | "hi";
export const LANGS: { code: Lang; flag: string; label: string }[] = [
  { code: "es", flag: "🇪🇸", label: "Español" },
  { code: "en", flag: "🇬🇧", label: "English" },
  { code: "zh", flag: "🇨🇳", label: "中文" },
  { code: "hi", flag: "🇮🇳", label: "हिन्दी" },
];

export type LangText = Record<Lang, string>;

export type StepType =
  | "text"
  | "textarea"
  | "single"
  | "multi"
  | "yesno"
  | "scale"
  | "tel"
  | "file";

export interface StepOption {
  value: string;
  label: LangText;
}

export interface StepConfig {
  id: string;
  blockKey?: string;
  type: StepType;
  required?: boolean;
  options?: StepOption[];
  hasOtroInline?: boolean;
  showIf?: (a: Record<string, unknown>) => boolean;
  minLength?: number;
  maxSizeMB?: number;
  acceptedTypes?: string;
}

export const UI = {
  langScreenTitle: { es: "Bienvenido", en: "Welcome", zh: "欢迎", hi: "स्वागत है" } as LangText,
  langScreenSubtitle: {
    es: "Selecciona tu idioma para comenzar tu diagnóstico de marketing.",
    en: "Select your language to start your marketing diagnosis.",
    zh: "选择您的语言以开始您的营销诊断。",
    hi: "अपना मार्केटिंग डायग्नोसिस शुरू करने के लिए अपनी भाषा चुनें।",
  } as LangText,
  badgeFree: { es: "DIAGNÓSTICO GRATUITO", en: "FREE DIAGNOSIS", zh: "免费诊断", hi: "मुफ़्त निदान" } as LangText,
  introTitle: {
    es: "Diagnóstico de Marketing Personalizado",
    en: "Personalized Marketing Diagnosis",
    zh: "个性化营销诊断",
    hi: "व्यक्तिगत मार्केटिंग निदान",
  } as LangText,
  introP1: {
    es: "Descubramos juntos el potencial de tu negocio.",
    en: "Let's discover your business's potential together.",
    zh: "让我们一起发现您business的潜力。",
    hi: "आइए मिलकर आपके व्यवसाय की संभावनाओं का पता लगाएं।",
  } as LangText,
  introP2: {
    es: "Responder este diagnóstico te tomará aproximadamente 5 minutos.",
    en: "Completing this diagnosis takes about 5 minutes.",
    zh: "完成此诊断大约需要5分钟。",
    hi: "इस निदान को पूरा करने में लगभग 5 मिनट लगेंगे।",
  } as LangText,
  introP3: {
    es: "Con tus respuestas prepararemos un plan de marketing personalizado, con recomendaciones prácticas y adaptadas a la realidad de tu negocio.",
    en: "With your answers we'll prepare a personalized marketing plan, with practical recommendations tailored to your business.",
    zh: "根据您的回答，我们将为您准备一份个性化的营销计划，提供切合您业务实际情况的实用建议。",
    hi: "आपके उत्तरों के आधार पर हम आपके व्यवसाय के लिए एक व्यक्तिगत मार्केटिंग योजना तैयार करेंगे, जिसमें व्यावहारिक सुझाव होंगे।",
  } as LangText,
  expectTitle: { es: "¿Qué puedes esperar?", en: "What to expect", zh: "您可以期待什么？", hi: "आप क्या उम्मीद कर सकते हैं?" } as LangText,
  expectList: {
    es: [
      "Un análisis basado en la información que compartas.",
      "Recomendaciones claras y accionables.",
      "Estrategias adaptadas a tus objetivos y presupuesto.",
      "Tu plan de marketing y, después, el contenido de tus redes día a día, directo en Telegram.",
    ],
    en: [
      "An analysis based on the information you share.",
      "Clear, actionable recommendations.",
      "Strategies tailored to your goals and budget.",
      "Your marketing plan and, later, your day-to-day social content, delivered directly on Telegram.",
    ],
    zh: [
      "基于您提供信息的分析。",
      "清晰、可执行的建议。",
      "根据您的目标和预算量身定制的策略。",
      "您的营销计划，以及之后每天的社交媒体内容，直接通过Telegram发送。",
    ],
    hi: [
      "आपके द्वारा साझा की गई जानकारी पर आधारित एक विश्लेषण।",
      "स्पष्ट, क्रियान्वित करने योग्य सुझाव।",
      "आपके लक्ष्यों और बजट के अनुरूप रणनीतियाँ।",
      "आपकी मार्केटिंग योजना, और बाद में, आपकी रोज़ाना की सोशल मीडिया सामग्री, सीधे Telegram पर।",
    ],
  } as Record<Lang, string[]>,
  safeTitle: { es: "Tu información está segura.", en: "Your information is safe.", zh: "您的信息是安全的。", hi: "आपकी जानकारी सुरक्षित है।" } as LangText,
  safeList: {
    es: [
      "No haremos spam.",
      "No compartiremos tus datos con terceros.",
      "No solicitaremos información sensible.",
      "Solo utilizaremos tus respuestas para elaborar tu diagnóstico y, si así lo deseas, ponernos en contacto contigo para ayudarte.",
    ],
    en: [
      "We won't send spam.",
      "We won't share your data with third parties.",
      "We won't ask for sensitive information.",
      "We'll only use your answers to build your diagnosis and, if you'd like, to reach out and help you.",
    ],
    zh: [
      "我们不会发送垃圾信息。",
      "我们不会与第三方分享您的数据。",
      "我们不会索要敏感信息。",
      "我们仅使用您的回答来制定您的诊断报告，如果您愿意，我们会联系您提供帮助。",
    ],
    hi: [
      "हम स्पैम नहीं भेजेंगे।",
      "हम आपका डेटा किसी तीसरे पक्ष के साथ साझा नहीं करेंगे।",
      "हम संवेदनशील जानकारी नहीं मांगेंगे।",
      "हम आपके उत्तरों का उपयोग केवल आपका निदान तैयार करने के लिए करेंगे, और यदि आप चाहें, तो आपसे संपर्क करने के लिए।",
    ],
  } as Record<Lang, string[]>,
  startButton: { es: "Comenzar →", en: "Start →", zh: "开始 →", hi: "शुरू करें →" } as LangText,
  backButton: { es: "← Atrás", en: "← Back", zh: "← 返回", hi: "← वापस" } as LangText,
  nextButton: { es: "Siguiente →", en: "Next →", zh: "下一步 →", hi: "अगला →" } as LangText,
  submitButton: { es: "Enviar y recibir mi plan", en: "Submit and get my plan", zh: "提交并获取我的计划", hi: "सबमिट करें और अपनी योजना पाएं" } as LangText,
  otroPlaceholder: { es: "Cuéntanos más...", en: "Tell us more...", zh: "请告诉我们更多...", hi: "हमें और बताएं..." } as LangText,
  scaleWorst: { es: "Muy insatisfecho", en: "Very unsatisfied", zh: "非常不满意", hi: "बहुत असंतुष्ट" } as LangText,
  scaleBest: { es: "Muy satisfecho", en: "Very satisfied", zh: "非常满意", hi: "बहुत संतुष्ट" } as LangText,
  yes: { es: "Sí", en: "Yes", zh: "是", hi: "हाँ" } as LangText,
  no: { es: "No", en: "No", zh: "否", hi: "नहीं" } as LangText,
  fileUploaded: { es: "Archivo cargado:", en: "File uploaded:", zh: "已上传文件：", hi: "फ़ाइल अपलोड की गई:" } as LangText,
  fileTooLarge: {
    es: "El archivo supera el límite permitido.",
    en: "The file exceeds the allowed size limit.",
    zh: "文件超出允许的大小限制。",
    hi: "फ़ाइल अनुमत आकार सीमा से अधिक है।",
  } as LangText,
  tooShort: {
    es: "Por favor danos una respuesta un poco más completa.",
    en: "Please give us a slightly more complete answer.",
    zh: "请提供更完整一点的回答。",
    hi: "कृपया थोड़ा और पूरा उत्तर दें।",
  } as LangText,
  invalidPhone: {
    es: "Ingresa un número de Telegram válido (con lada/código de país).",
    en: "Enter a valid Telegram number (with country code).",
    zh: "请输入有效的Telegram号码（含国家代码）。",
    hi: "एक मान्य Telegram नंबर दर्ज करें (देश कोड सहित)।",
  } as LangText,
  invalidUrl: {
    es: "Ingresa una dirección web válida (ej. midominio.com).",
    en: "Enter a valid website address (e.g. mydomain.com).",
    zh: "请输入有效的网址（例如 mydomain.com）。",
    hi: "एक मान्य वेबसाइट पता दर्ज करें (जैसे mydomain.com)।",
  } as LangText,
  submitting: { es: "Enviando...", en: "Submitting...", zh: "提交中...", hi: "सबमिट हो रहा है..." } as LangText,
  submitError: {
    es: "Hubo un problema al enviar tu diagnóstico. Por favor intenta de nuevo.",
    en: "There was a problem submitting your diagnosis. Please try again.",
    zh: "提交诊断时出现问题。请重试。",
    hi: "आपका निदान सबमिट करने में समस्या हुई। कृपया पुनः प्रयास करें।",
  } as LangText,
  doneBadge: { es: "¡LISTO!", en: "DONE!", zh: "完成！", hi: "पूर्ण!" } as LangText,
  doneTitle: { es: "¡Gracias por completar tu diagnóstico!", en: "Thanks for completing your diagnosis!", zh: "感谢您完成诊断！", hi: "आपका निदान पूरा करने के लिए धन्यवाद!" } as LangText,
  doneP1: {
    es: "Hemos recibido tu información y comenzaremos a preparar tu plan de marketing personalizado.",
    en: "We've received your information and will start preparing your personalized marketing plan.",
    zh: "我们已收到您的信息，将开始为您准备个性化营销计划。",
    hi: "हमें आपकी जानकारी प्राप्त हो गई है और हम आपकी व्यक्तिगत मार्केटिंग योजना तैयार करना शुरू करेंगे।",
  } as LangText,
  doneP2: {
    es: "Lo recibirás por Telegram, en el número que nos proporcionaste.",
    en: "You'll receive it on Telegram, at the number you provided.",
    zh: "您将通过Telegram在您提供的号码上收到它。",
    hi: "आपको यह Telegram पर, आपके द्वारा दिए गए नंबर पर प्राप्त होगा।",
  } as LangText,
  doneP3: {
    es: "Como solicitaste una revisión con uno de nuestros especialistas, nos pondremos en contacto contigo por Telegram en los próximos días.",
    en: "Since you requested a review with one of our specialists, we'll reach out to you on Telegram in the coming days.",
    zh: "由于您申请了与我们专家的复核，我们将在未来几天通过Telegram与您联系。",
    hi: "चूंकि आपने हमारे किसी विशेषज्ञ के साथ समीक्षा का अनुरोध किया है, हम अगले कुछ दिनों में Telegram पर आपसे संपर्क करेंगे।",
  } as LangText,
  doneP4: { es: "¡Gracias por confiar en nosotros!", en: "Thank you for trusting us!", zh: "感谢您的信任！", hi: "हम पर भरोसा करने के लिए धन्यवाद!" } as LangText,
};

export const BLOCKS: Record<string, LangText> = {
  b1: { es: "BLOQUE 1 · Conozcamos tu negocio", en: "SECTION 1 · Let's meet your business", zh: "第一部分 · 了解您的业务", hi: "खंड 1 · आपके व्यवसाय को समझते हैं" },
  b2: { es: "BLOQUE 2 · Tus clientes", en: "SECTION 2 · Your customers", zh: "第二部分 · 您的客户", hi: "खंड 2 · आपके ग्राहक" },
  b3: { es: "BLOQUE 3 · Tu presencia digital", en: "SECTION 3 · Your digital presence", zh: "第三部分 · 您的数字化形象", hi: "खंड 3 · आपकी डिजिटल उपस्थिति" },
  b4: { es: "BLOQUE 4 · Tu negocio hoy", en: "SECTION 4 · Your business today", zh: "第四部分 · 您现在的业务", hi: "खंड 4 · आपका व्यवसाय आज" },
  b5: { es: "BLOQUE 5 · Construyamos un plan realista", en: "SECTION 5 · Let's build a realistic plan", zh: "第五部分 · 制定一个切实可行的计划", hi: "खंड 5 · एक यथार्थवादी योजना बनाएं" },
  b6: { es: "BLOQUE 6 · Una última pregunta", en: "SECTION 6 · One last question", zh: "第六部分 · 最后一个问题", hi: "खंड 6 · अंतिम प्रश्न" },
  b7: { es: "BLOQUE 7 · Recibe tu contenido", en: "SECTION 7 · Get your content", zh: "第七部分 · 获取您的内容", hi: "खंड 7 · अपनी सामग्री प्राप्त करें" },
};

export const Q: Record<string, { question: LangText; subtitle?: LangText; placeholder?: LangText }> = {
  nombreNegocio: { question: { es: "¿Cómo se llama tu negocio?", en: "What's your business called?", zh: "您的企业叫什么名字？", hi: "आपके व्यवसाय का नाम क्या है?" } },
  tipoNegocio: { question: { es: "¿A qué se dedica tu negocio?", en: "What does your business do?", zh: "您的企业从事什么行业？", hi: "आपका व्यवसाय क्या करता है?" } },
  principalProducto: {
    question: { es: "Describe brevemente tu principal producto o servicio", en: "Briefly describe your main product or service", zh: "简要描述您的主要产品或服务", hi: "अपने मुख्य उत्पाद या सेवा का संक्षेप में वर्णन करें" },
    subtitle: { es: 'Ejemplo: "Tours privados de snorkel para familias."', en: 'Example: "Private family snorkel tours."', zh: '例如："家庭浮潜私人游览。"', hi: 'उदाहरण: "परिवारों के लिए निजी स्नॉर्कल टूर।"' },
  },
  dondeOpera: {
    question: { es: "¿Dónde opera principalmente tu negocio?", en: "Where does your business mainly operate?", zh: "您的企业主要在哪里运营？", hi: "आपका व्यवसाय मुख्य रूप से कहाँ संचालित होता है?" },
    subtitle: { es: "Ejemplos: Playa del Carmen, Cancún, Todo México, Internacional", en: "Examples: Playa del Carmen, Cancún, All of Mexico, International", zh: "例如：普拉亚德尔卡曼、坎昆、全墨西哥、国际", hi: "उदाहरण: प्लाया डेल कारमेन, कैनकन, पूरे मेक्सिको में, अंतरराष्ट्रीय" },
  },
  porQueCreaste: {
    question: { es: "¿Por qué decidiste crear este negocio?", en: "Why did you decide to start this business?", zh: "您为什么决定创办这个企业？", hi: "आपने यह व्यवसाय शुरू करने का निर्णय क्यों लिया?" },
    subtitle: {
      es: "Nos ayudará a entender mejor la esencia de tu marca y elaborar un plan más alineado con tu visión.",
      en: "This helps us understand your brand's essence and build a plan aligned with your vision.",
      zh: "这将帮助我们更好地理解您品牌的本质，并制定与您愿景更契合的计划。",
      hi: "यह हमें आपके ब्रांड के सार को बेहतर ढंग से समझने और आपके दृष्टिकोण के अनुरूप योजना बनाने में मदद करेगा।",
    },
  },
  clienteIdeal: {
    question: { es: "¿Quién es tu cliente ideal?", en: "Who is your ideal customer?", zh: "谁是您的理想客户？", hi: "आपका आदर्श ग्राहक कौन है?" },
    subtitle: { es: "Puedes elegir varias opciones", en: "You can choose several options", zh: "您可以选择多个选项", hi: "आप कई विकल्प चुन सकते हैं" },
  },
  problemaResuelve: { question: { es: "¿Qué problema resuelves o cuál es el principal beneficio que obtiene tu cliente?", en: "What problem do you solve, or what's the main benefit your customer gets?", zh: "您解决了什么问题，或者您的客户获得的主要好处是什么？", hi: "आप कौन सी समस्या हल करते हैं, या आपके ग्राहक को मुख्य लाभ क्या मिलता है?" } },
  comoLlegan: {
    question: { es: "¿Cómo llegan hoy la mayoría de tus clientes?", en: "How do most of your customers find you today?", zh: "如今大多数客户是如何找到您的？", hi: "आज ज़्यादातर ग्राहक आप तक कैसे पहुँचते हैं?" },
    subtitle: { es: "Puedes elegir varias opciones", en: "You can choose several options", zh: "您可以选择多个选项", hi: "आप कई विकल्प चुन सकते हैं" },
  },
  presenciaDigital: {
    question: { es: "¿En cuáles de estas plataformas tiene presencia tu negocio?", en: "Which of these platforms is your business present on?", zh: "您的企业在哪些平台上有业务？", hi: "आपका व्यवसाय इनमें से किन प्लेटफ़ॉर्म पर मौजूद है?" },
    subtitle: { es: "Puedes elegir varias opciones", en: "You can choose several options", zh: "您可以选择多个选项", hi: "आप कई विकल्प चुन सकते हैं" },
  },
  tipoWeb: { question: { es: "¿Qué tipo de página web tiene tu negocio?", en: "What kind of website does your business have?", zh: "您的企业有哪种类型的网站？", hi: "आपके व्यवसाय की किस प्रकार की वेबसाइट है?" } },
  urlWeb: {
    question: { es: "¿Cuál es la dirección de tu página?", en: "What's your website's address?", zh: "您的网站地址是什么？", hi: "आपकी वेबसाइट का पता क्या है?" },
    subtitle: { es: "Opcional", en: "Optional", zh: "可选", hi: "वैकल्पिक" },
  },
  inviertePublicidad: { question: { es: "¿Actualmente inviertes en publicidad?", en: "Do you currently invest in advertising?", zh: "您目前是否在广告上投资？", hi: "क्या आप वर्तमान में विज्ञापन में निवेश करते हैं?" } },
  dondeAnuncias: { question: { es: "¿Dónde anuncias?", en: "Where do you advertise?", zh: "您在哪里做广告？", hi: "आप कहाँ विज्ञापन देते हैं?" } },
  satisfaccion: { question: { es: "¿Qué tan satisfecho estás con tu presencia digital actual?", en: "How satisfied are you with your current digital presence?", zh: "您对目前的数字形象满意吗？", hi: "आप अपनी वर्तमान डिजिटल उपस्थिति से कितने संतुष्ट हैं?" } },
  mayorReto: { question: { es: "¿Cuál es tu mayor reto actualmente?", en: "What's your biggest challenge right now?", zh: "您目前面临的最大挑战是什么？", hi: "अभी आपकी सबसे बड़ी चुनौती क्या है?" } },
  retoContexto: {
    question: { es: "Cuéntanos un poco más sobre ese reto", en: "Tell us a bit more about that challenge", zh: "请多告诉我们一些关于这个挑战的信息", hi: "उस चुनौती के बारे में हमें थोड़ा और बताएं" },
    subtitle: {
      es: "Mientras más contexto nos compartas, más útil será el diagnóstico.",
      en: "The more context you share, the more useful your diagnosis will be.",
      zh: "您提供的背景信息越多，诊断结果就越有用。",
      hi: "आप जितना अधिक संदर्भ साझा करेंगे, निदान उतना ही उपयोगी होगा।",
    },
  },
  ticketPromedio: {
    question: { es: "¿Cuál es el precio promedio que paga un cliente por compra o servicio?", en: "What's the average amount a customer pays per purchase or service?", zh: "客户每次购买或服务平均支付多少钱？", hi: "एक ग्राहक प्रति खरीद या सेवा औसतन कितना भुगतान करता है?" },
    subtitle: {
      es: "Para recomendarte estrategias acordes a tu negocio, necesitamos conocer un poco mejor tu operación.",
      en: "To recommend strategies suited to your business, we need to better understand your operation.",
      zh: "为了为您推荐适合您业务的策略，我们需要更好地了解您的运营情况。",
      hi: "आपके व्यवसाय के अनुरूप रणनीतियों की सिफारिश करने के लिए, हमें आपके संचालन को बेहतर ढंग से समझने की आवश्यकता है।",
    },
  },
  objetivo12meses: { question: { es: "Si todo saliera como esperas durante los próximos 12 meses, ¿cuál sería tu principal objetivo?", en: "If everything went as expected over the next 12 months, what would your main goal be?", zh: "如果未来12个月一切顺利，您的主要目标是什么？", hi: "यदि अगले 12 महीनों में सब कुछ अपेक्षा अनुसार हो, तो आपका मुख्य लक्ष्य क्या होगा?" } },
  presupuestoMensual: { question: { es: "¿Cuánto podrías invertir mensualmente en marketing?", en: "How much could you invest monthly in marketing?", zh: "您每月能在营销上投资多少？", hi: "आप मार्केटिंग में मासिक रूप से कितना निवेश कर सकते हैं?" } },
  quienImplementa: { question: { es: "¿Quién implementará este plan?", en: "Who will implement this plan?", zh: "谁将执行这个计划？", hi: "यह योजना कौन लागू करेगा?" } },
  perspectivaConsultor: {
    question: { es: "Si fueras consultor de tu propio negocio, ¿qué crees que está impidiendo que crezca más rápido?", en: "If you were a consultant for your own business, what do you think is holding back its growth?", zh: "如果您是自己企业的顾问，您认为是什么阻碍了企业更快增长？", hi: "यदि आप अपने खुद के व्यवसाय के सलाहकार होते, तो आपको क्या लगता है कि इसकी तेज़ी से वृद्धि में क्या बाधा डाल रहा है?" },
    subtitle: {
      es: "No hay respuestas correctas o incorrectas. Tu perspectiva nos ayudará a comprender mejor tu situación.",
      en: "There are no right or wrong answers. Your perspective helps us better understand your situation.",
      zh: "没有对错之分。您的观点将帮助我们更好地理解您的情况。",
      hi: "कोई सही या गलत उत्तर नहीं है। आपका दृष्टिकोण हमें आपकी स्थिति को बेहतर ढंग से समझने में मदद करेगा।",
    },
  },
  documentoAdicional: {
    question: { es: "¿Quieres compartir algún documento adicional?", en: "Would you like to share an additional document?", zh: "您想分享其他文件吗？", hi: "क्या आप कोई अतिरिक्त दस्तावेज़ साझा करना चाहेंगे?" },
    subtitle: {
      es: "Whitepaper, brochure, catálogo, etc. Opcional — máx. 10MB (PDF o Word).",
      en: "Whitepaper, brochure, catalog, etc. Optional — max. 10MB (PDF or Word).",
      zh: "白皮书、宣传册、目录等。可选 — 最大10MB（PDF或Word）。",
      hi: "व्हाइटपेपर, ब्रोशर, कैटलॉग आदि। वैकल्पिक — अधिकतम 10MB (PDF या Word)।",
    },
  },
  telegramContacto: {
    question: { es: "¿Cuál es tu número de Telegram?", en: "What's your Telegram number?", zh: "您的Telegram号码是多少？", hi: "आपका Telegram नंबर क्या है?" },
    subtitle: {
      es: "Ahí te enviaremos tu plan de marketing y, después, el contenido de tus redes listo para revisar día a día.",
      en: "We'll send your marketing plan there, and later your day-to-day social content, ready for you to review.",
      zh: "我们将把您的营销计划发送到那里，之后还会发送准备好供您审阅的每日社交内容。",
      hi: "हम आपकी मार्केटिंग योजना वहाँ भेजेंगे, और बाद में आपकी रोज़ाना की सोशल सामग्री, समीक्षा के लिए तैयार।",
    },
    placeholder: { es: "Ej. +52 999 123 4567", en: "E.g. +1 555 123 4567", zh: "例如 +86 138 0000 0000", hi: "जैसे +91 98765 43210" },
  },
  quiereRevision: { question: { es: "¿Te gustaría que uno de nuestros especialistas revise contigo el diagnóstico, sin costo?", en: "Would you like one of our specialists to review your diagnosis with you, at no cost?", zh: "您是否希望我们的专家免费与您一起复核诊断结果？", hi: "क्या आप चाहेंगे कि हमारा कोई विशेषज्ञ बिना किसी शुल्क के आपके निदान की समीक्षा करे?" } },
};

const opt = (value: string, es: string, en: string, zh: string, hi: string): StepOption => ({
  value,
  label: { es, en, zh, hi },
});

export const ALL_STEPS: StepConfig[] = [
  // BLOQUE 1
  { id: "nombreNegocio", blockKey: "b1", type: "text", required: true, minLength: 2 },
  {
    id: "tipoNegocio", type: "single", required: true, hasOtroInline: true,
    options: [
      opt("restaurant", "Restaurante o cafetería", "Restaurant or café", "餐厅或咖啡馆", "रेस्तरां या कैफे"),
      opt("hotel", "Hotel u hospedaje", "Hotel or lodging", "酒店或住宿", "होटल या आवास"),
      opt("tours", "Tours y experiencias", "Tours and experiences", "旅游和体验", "टूर और अनुभव"),
      opt("realestate", "Bienes raíces", "Real estate", "房地产", "रियल एस्टेट"),
      opt("health", "Salud y bienestar", "Health and wellness", "健康与保健", "स्वास्थ्य और कल्याण"),
      opt("beauty", "Belleza", "Beauty", "美容", "सौंदर्य"),
      opt("retail", "Retail o tienda", "Retail or store", "零售或商店", "रिटेल या दुकान"),
      opt("professional", "Servicios profesionales", "Professional services", "专业服务", "व्यावसायिक सेवाएं"),
      opt("education", "Educación", "Education", "教育", "शिक्षा"),
      opt("construction", "Construcción", "Construction", "建筑", "निर्माण"),
      opt("manufacturing", "Manufactura", "Manufacturing", "制造业", "विनिर्माण"),
      opt("otro", "Otro", "Other", "其他", "अन्य"),
    ],
  },
  { id: "principalProducto", type: "text", required: true, minLength: 15 },
  { id: "dondeOpera", type: "text", required: true, minLength: 3 },
  { id: "porQueCreaste", type: "textarea", required: true, minLength: 30 },

  // BLOQUE 2
  {
    id: "clienteIdeal", blockKey: "b2", type: "multi", required: true, hasOtroInline: true,
    options: [
      opt("locals", "Residentes locales", "Local residents", "本地居民", "स्थानीय निवासी"),
      opt("domestic_tourists", "Turistas nacionales", "Domestic tourists", "国内游客", "घरेलू पर्यटक"),
      opt("intl_tourists", "Turistas internacionales", "International tourists", "国际游客", "अंतरराष्ट्रीय पर्यटक"),
      opt("business", "Empresas", "Businesses", "企业", "व्यवसाय"),
      opt("families", "Familias", "Families", "家庭", "परिवार"),
      opt("couples", "Parejas", "Couples", "情侣", "जोड़े"),
      opt("youth", "Jóvenes", "Young people", "年轻人", "युवा"),
      opt("seniors", "Adultos mayores", "Older adults", "老年人", "वरिष्ठ नागरिक"),
      opt("otro", "Otro", "Other", "其他", "अन्य"),
    ],
  },
  { id: "problemaResuelve", type: "text", required: true, minLength: 15 },
  {
    id: "comoLlegan", type: "multi", required: true, hasOtroInline: true,
    options: [
      opt("referrals", "Recomendaciones", "Referrals", "推荐", "सिफारिशें"),
      opt("facebook", "Facebook", "Facebook", "Facebook", "Facebook"),
      opt("instagram", "Instagram", "Instagram", "Instagram", "Instagram"),
      opt("tiktok", "TikTok", "TikTok", "TikTok", "TikTok"),
      opt("google", "Google", "Google", "Google", "Google"),
      opt("google_maps", "Google Maps", "Google Maps", "Google 地图", "Google Maps"),
      opt("website", "Página web", "Website", "网站", "वेबसाइट"),
      opt("whatsapp", "WhatsApp", "WhatsApp", "WhatsApp", "WhatsApp"),
      opt("airbnb", "Airbnb", "Airbnb", "Airbnb", "Airbnb"),
      opt("booking", "Booking", "Booking", "Booking", "Booking"),
      opt("expedia", "Expedia", "Expedia", "Expedia", "Expedia"),
      opt("agencies", "Agencias", "Agencies", "代理机构", "एजेंसियां"),
      opt("walkin", "Pasan por el local", "Walk-ins", "路过店面", "दुकान पर आना"),
      opt("otro", "Otro", "Other", "其他", "अन्य"),
    ],
  },

  // BLOQUE 3
  {
    id: "presenciaDigital", blockKey: "b3", type: "multi", required: true, hasOtroInline: true,
    options: [
      opt("website", "Página web", "Website", "网站", "वेबसाइट"),
      opt("gbp", "Google Business Profile", "Google Business Profile", "Google 商家资料", "Google Business Profile"),
      opt("facebook", "Facebook", "Facebook", "Facebook", "Facebook"),
      opt("instagram", "Instagram", "Instagram", "Instagram", "Instagram"),
      opt("tiktok", "TikTok", "TikTok", "TikTok", "TikTok"),
      opt("whatsapp_business", "WhatsApp Business", "WhatsApp Business", "WhatsApp Business", "WhatsApp Business"),
      opt("email_marketing", "Email Marketing", "Email Marketing", "邮件营销", "ईमेल मार्केटिंग"),
      opt("none", "Ninguna de las anteriores", "None of the above", "以上都不是", "उपरोक्त में से कोई नहीं"),
      opt("otro", "Otro", "Other", "其他", "अन्य"),
    ],
  },
  {
    id: "tipoWeb", type: "single", required: true,
    options: [
      opt("no_web", "No tengo página web", "I don't have a website", "我没有网站", "मेरी कोई वेबसाइट नहीं है"),
      opt("landing", "Landing Page", "Landing page", "落地页", "लैंडिंग पेज"),
      opt("corporate", "Sitio web corporativo", "Corporate website", "企业网站", "कॉर्पोरेट वेबसाइट"),
      opt("ecommerce", "Tienda en línea (eCommerce)", "Online store (eCommerce)", "在线商店（电子商务）", "ऑनलाइन स्टोर (ईकॉमर्स)"),
      opt("booking_system", "Sistema de reservas", "Booking system", "预订系统", "बुकिंग सिस्टम"),
      opt("not_sure", "No estoy seguro", "Not sure", "不确定", "निश्चित नहीं"),
    ],
  },
  {
    id: "urlWeb", type: "text", required: false,
    showIf: (a) => Boolean(a.tipoWeb) && a.tipoWeb !== "no_web" && a.tipoWeb !== "not_sure",
  },
  { id: "inviertePublicidad", type: "yesno", required: true },
  {
    id: "dondeAnuncias", type: "multi", required: true, hasOtroInline: true,
    showIf: (a) => a.inviertePublicidad === "yes",
    options: [
      opt("facebook", "Facebook", "Facebook", "Facebook", "Facebook"),
      opt("instagram", "Instagram", "Instagram", "Instagram", "Instagram"),
      opt("google", "Google", "Google", "Google", "Google"),
      opt("tiktok", "TikTok", "TikTok", "TikTok", "TikTok"),
      opt("otro", "Otro", "Other", "其他", "अन्य"),
    ],
  },
  { id: "satisfaccion", type: "scale", required: true },

  // BLOQUE 4
  {
    id: "mayorReto", blockKey: "b4", type: "single", required: true, hasOtroInline: true,
    options: [
      opt("more_clients", "Conseguir más clientes", "Getting more customers", "获得更多客户", "अधिक ग्राहक प्राप्त करना"),
      opt("sell_more_current", "Vender más a los clientes actuales", "Selling more to current customers", "向现有客户销售更多产品", "मौजूदा ग्राहकों को अधिक बेचना"),
      opt("better_quality_clients", "Conseguir clientes de mejor calidad", "Getting higher-quality customers", "获得更优质的客户", "बेहतर गुणवत्ता वाले ग्राहक प्राप्त करना"),
      opt("less_intermediaries", "Depender menos de intermediarios", "Relying less on intermediaries", "减少对中间商的依赖", "बिचौलियों पर कम निर्भर रहना"),
      opt("differentiate", "Diferenciarme de la competencia", "Standing out from competitors", "在竞争中脱颖而出", "प्रतिस्पर्धा से अलग दिखना"),
      opt("dont_know", "No sé por dónde empezar", "I don't know where to start", "我不知道从哪里开始", "मुझे नहीं पता कहाँ से शुरू करूं"),
      opt("otro", "Otro", "Other", "其他", "अन्य"),
    ],
  },
  { id: "retoContexto", type: "textarea", required: true, minLength: 30 },

  // BLOQUE 5
  {
    id: "ticketPromedio", blockKey: "b5", type: "single", required: true,
    options: [
      opt("t1", "Menos de $500 MXN", "Less than $500 MXN", "少于500墨西哥比索", "500 MXN से कम"),
      opt("t2", "$500 – $2,000 MXN", "$500 – $2,000 MXN", "500–2,000墨西哥比索", "500 – 2,000 MXN"),
      opt("t3", "$2,000 – $10,000 MXN", "$2,000 – $10,000 MXN", "2,000–10,000墨西哥比索", "2,000 – 10,000 MXN"),
      opt("t4", "Más de $10,000 MXN", "More than $10,000 MXN", "超过10,000墨西哥比索", "10,000 MXN से अधिक"),
    ],
  },
  {
    id: "objetivo12meses", type: "single", required: true, hasOtroInline: true,
    options: [
      opt("increase_sales", "Aumentar ventas", "Increase sales", "增加销售额", "बिक्री बढ़ाना"),
      opt("more_bookings", "Obtener más reservas", "Get more bookings", "获得更多预订", "अधिक बुकिंग प्राप्त करना"),
      opt("more_clients", "Conseguir más clientes", "Get more customers", "获得更多客户", "अधिक ग्राहक प्राप्त करना"),
      opt("stronger_brand", "Construir una marca más fuerte", "Build a stronger brand", "打造更强大的品牌", "एक मजबूत ब्रांड बनाना"),
      opt("open_branch", "Abrir otra sucursal", "Open another branch", "开设另一家分店", "एक और शाखा खोलना"),
      opt("launch_product", "Lanzar un nuevo producto o servicio", "Launch a new product or service", "推出新产品或服务", "एक नया उत्पाद या सेवा लॉन्च करना"),
      opt("reduce_intermediaries", "Reducir mi dependencia de intermediarios", "Reduce my dependence on intermediaries", "减少对中间商的依赖", "बिचौलियों पर अपनी निर्भरता कम करना"),
      opt("otro", "Otro", "Other", "其他", "अन्य"),
    ],
  },
  {
    id: "presupuestoMensual", type: "single", required: true,
    options: [
      opt("b1", "Menos de $5,000 MXN", "Less than $5,000 MXN", "少于5,000墨西哥比索", "5,000 MXN से कम"),
      opt("b2", "$5,000 – $15,000 MXN", "$5,000 – $15,000 MXN", "5,000–15,000墨西哥比索", "5,000 – 15,000 MXN"),
      opt("b3", "$15,000 – $30,000 MXN", "$15,000 – $30,000 MXN", "15,000–30,000墨西哥比索", "15,000 – 30,000 MXN"),
      opt("b4", "Más de $30,000 MXN", "More than $30,000 MXN", "超过30,000墨西哥比索", "30,000 MXN से अधिक"),
      opt("unknown", "Aún no lo sé", "I don't know yet", "我还不知道", "अभी नहीं पता"),
    ],
  },
  {
    id: "quienImplementa", type: "single", required: true,
    options: [
      opt("myself", "Yo mismo", "Myself", "我自己", "मैं स्वयं"),
      opt("my_team", "Mi equipo", "My team", "我的团队", "मेरी टीम"),
      opt("agency", "Una agencia", "An agency", "一家代理机构", "एक एजेंसी"),
      opt("unknown", "Aún no lo sé", "I don't know yet", "我还不知道", "अभी नहीं पता"),
    ],
  },

  // BLOQUE 6
  { id: "perspectivaConsultor", blockKey: "b6", type: "textarea", required: true, minLength: 30 },
  { id: "documentoAdicional", type: "file", required: false, maxSizeMB: 10, acceptedTypes: ".pdf,.doc,.docx" },

  // BLOQUE 7
  { id: "telegramContacto", blockKey: "b7", type: "tel", required: true },
  {
    id: "quiereRevision", type: "single", required: true,
    options: [
      opt("yes", "Sí, me gustaría.", "Yes, I'd like that.", "是的，我愿意。", "हाँ, मुझे यह पसंद आएगा।"),
      opt("no", "No, por el momento solo quiero recibir mi plan.", "No, for now I just want to receive my plan.", "不用了，目前我只想收到我的计划。", "नहीं, फ़िलहाल मुझे केवल अपनी योजना चाहिए।"),
    ],
  },
];

export const PHONE_REGEX = /^\+?[\d\s()-]{8,}$/;
export const URL_REGEX = /^(https?:\/\/)?[\w-]+(\.[\w-]+)+[/#?]?.*$/;
