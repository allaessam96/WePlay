import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Link2, 
  Trash2, 
  Plus, 
  Check, 
  Volume2, 
  VolumeX, 
  Share2, 
  HelpCircle, 
  Info,
  Flame,
  CheckCircle,
  Clock,
  ExternalLink,
  Shield,
  Coins,
  Lock,
  Unlock,
  User,
  UserCheck,
  Users,
  LogOut,
  Image as ImageIcon,
  Utensils,
  CreditCard,
  AlertTriangle,
  RotateCcw,
  UserX
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserAccount, AdventureLink, FavoriteDish, FavoritePhoto, SupportMessage } from './types';
import {
  STORAGE_KEYS,
  loadFromStorage,
  saveToStorage,
  formatArabicTime,
  formatArabicDate,
  presetIcon,
  isPresetIcon,
  getPresetEmoji,
  createAudioContext,
  getShortUrlString,
} from './utils';

// Static Career Items dictionary with comprehensive Cybersecurity and AI roles details
export interface CareerItem {
  id: string;
  category: 'cyber' | 'ai' | 'both';
  level: 'beginner' | 'intermediate' | 'advanced' | 'senior';
  title: string;
  titleAr: string;
  desc: string;
  isHighSalary?: boolean;
}

const careersList: CareerItem[] = [
  // Cybersecurity beginner
  { id: 'it-support', category: 'cyber', level: 'beginner', title: 'IT Support', titleAr: '💻 دعم تقني', desc: 'تبدأ فيها بدون خبرة كبيرة، تقدم الدعم الفني وتتعلم أساسيات الشبكات وأنظمة التشغيل.' },
  { id: 'soc-analyst-1', category: 'cyber', level: 'beginner', title: 'SOC Analyst Level 1', titleAr: '🔍 مراقبة واكتشاف الهجمات', desc: 'حارس أمن رقمي يراقب التنبيهات واللوجات على مدار الساعة لاكتشاف الأنشطة المشبوهة وحماية الخوادم.' },
  { id: 'security-assistant', category: 'cyber', level: 'beginner', title: 'Security Assistant', titleAr: '🧾 مساعد أمن معلومات', desc: 'مسؤول عن تقديم الدعم الإداري والتقني وتدقيق جودة الإجراءات والوثائق لفريق الأمن.' },
  { id: 'network-support', category: 'cyber', level: 'beginner', title: 'Network Support Technician', titleAr: '🌐 دعم الشبكات والاتصالات', desc: 'التعامل مع البنية التحتية، وإصلاح مشاكل الموجهات والتوصيلات المادية والافتراضية للشركة.' },

  // Cybersecurity intermediate
  { id: 'cyber-analyst', category: 'cyber', level: 'intermediate', title: 'Cybersecurity Analyst', titleAr: '🛡️ محلل أمن سيبراني', desc: 'تخطيط وتفعيل إجراءات أمان الأنظمة والدفاع الفعال ضد الثغرات وتحليل مخاطر الحوسبة.' },
  { id: 'incident-responder', category: 'cyber', level: 'intermediate', title: 'Incident Response Specialist', titleAr: '🔥 التعامل مع الاختراقات والصد السريع', desc: 'استجابة طارئة فورية للهجوم النشط، إيقاف نزيف البيانات واحتواء انتشار البرامج الضارة.' },
  { id: 'network-security-eng', category: 'cyber', level: 'intermediate', title: 'Network Security Engineer', titleAr: '🧱 مهندس أمن الشبكات والاتصال', desc: 'بناء وحماية وتصميم البراويز النارية Firewalls والأنظمة الدفاعية للشبكة الكلية.' },
  { id: 'pen-tester', category: 'cyber', level: 'intermediate', title: 'Penetration Tester', titleAr: '🔐 مختبر اختراق "قانوني" أخلاقي', desc: 'طلب الاختراق بطريقة قانونية لاكتشاف الثغرات وتزويد المطورين بسبل ردمها قبل الكارثة.', isHighSalary: true },
  { id: 'threat-analyst', category: 'cyber', level: 'intermediate', title: 'Threat Analyst', titleAr: '📊 محلل التهديدات السيبرانية', desc: 'رصد تكتيكات التسلل العالمية والتعلم من هجمات الفايروسات لتوقع تحركات مجرمي الشبكة.' },
  { id: 'malware-analyst', category: 'cyber', level: 'intermediate', title: 'Malware Analyst', titleAr: '🧠 محلل ومفكك الفيروسات', desc: 'تشريح وهندسة برمجيات الفدية والتروجان في بيئة معزولة لتحديد وظيفتها وإبادتها.' },

  // Cybersecurity advanced / professional
  { id: 'ethical-hacker', category: 'cyber', level: 'advanced', title: 'Ethical Hacker', titleAr: '🏴‍☠️ هاكر أخلاقي متقدم', desc: 'شن هجمات وهمية شرسة ومحاكاة بالغة الصعوبة لمنظومات الدفاع للتأكد من صمودها.' },
  { id: 'security-consultant', category: 'cyber', level: 'advanced', title: 'Security Consultant', titleAr: '🧑‍🏫 مستشار أمن سيبراني', desc: 'الخبير الإستراتيجي المسؤول عن توجيه القرارات الأمنية للمؤسسات وتصميم معايير الحماية المتكاملة.' },
  { id: 'digital-forensics', category: 'cyber', level: 'advanced', title: 'Digital Forensics Expert', titleAr: '🧩 خبير تحقيقات رقمية جنائية', desc: 'استرجاع البيانات المحذوفة والملفات كأدلة تقنية بعد الهجوم وتقديمها للمحاكم لإدانة المجرمين.' },
  { id: 'security-architect', category: 'cyber', level: 'advanced', title: 'Security Architect', titleAr: '🧱 مصمم ومعماري أنظمة الحماية', desc: 'المخطط الاستراتيجي الفائق لنمذجة هياكل الحماية الكلية للمستندات والأنظمة السحابية وخوادم الإنتاج.', isHighSalary: true },
  { id: 'soc-manager', category: 'cyber', level: 'advanced', title: 'SOC Manager', titleAr: '🚨 مدير مركز العمليات الأمنية', desc: 'إدارة وتوجيه كافة نوبات العمل ومحللي الأمن وتدشين خطط الرد والتعافي الشاملة.' },

  // AI beginner
  { id: 'data-entry-analyst', category: 'ai', level: 'beginner', title: 'Data Entry Analyst', titleAr: '📊 إدخال وبيانات التدريب', desc: 'جمع وتصحيح الكلمات والبيانات والصور لتجهيزها للتلقيم المباشر بنماذج الذكاء الاصطناعي.' },
  { id: 'junior-data-analyst', category: 'ai', level: 'beginner', title: 'Junior Data Analyst', titleAr: '📈 محلل بيانات بسيط مبتدئ', desc: 'معالجة مبدئية للمعلومات والمؤشرات الرياضية ورسم إحصاءات نمو الأعمال.' },
  { id: 'ai-support', category: 'ai', level: 'beginner', title: 'AI Support Assistant', titleAr: '🧠 مساعد أدوات ومؤتمت AI', desc: 'مساعدة الموظفين وفريق العمل بالشركات لاستعمال Copilots وحلول GPT لتسريع المهام اليومية.' },
  { id: 'prompt-tester', category: 'ai', level: 'beginner', title: 'Prompt Tester', titleAr: '💻 مختبر أوامر الذكاء الاصطناعي', desc: 'التجريب والتحسين المكثف لصياغة التنبيهات المكتوبة للتأكد من إنتاجية النماذج اللغوية وغياب أية هلاوس.' },

  // AI intermediate
  { id: 'data-analyst', category: 'ai', level: 'intermediate', title: 'Data Analyst', titleAr: '📊 محلل بيانات ذكي', desc: 'بناء لوحات تحكم ديناميكية وقراءة توجهات السوق والمبيعات لمساعدة إدارة الشركات لاتخاذ قرارات دقيقة.' },
  { id: 'ml-engineer', category: 'ai', level: 'intermediate', title: 'Machine Learning Engineer', titleAr: '🤖 مهندس تعلم آلي خوارزمي', desc: 'تنفيذ وتدريب الخوارزميات وصياغة كتل التعليم الذاتية للأجهزة والمستشعرات.', isHighSalary: true },
  { id: 'ai-developer', category: 'ai', level: 'intermediate', title: 'AI Developer', titleAr: '🧠 مطور تطبيقات ذكاء اصطناعي', desc: 'دمج واجهات برمجة النماذج (APIs) لتأسيس وكلاء أذكياء وتطبيقات تلبي احتياجات العملاء.' },
  { id: 'data-scientist', category: 'ai', level: 'intermediate', title: 'Data Scientist', titleAr: '📉 عالم بيانات رياضي', desc: 'الجمع البارع بين معالجة الإحصاء، الرياضيات وتدريب الآلات للتوقع بالتوجهات الاستراتيجية.', isHighSalary: true },
  { id: 'nlp-engineer', category: 'ai', level: 'intermediate', title: 'NLP Engineer', titleAr: '🗣️ مهندس لغويات (معالجة لغة مثل ChatGPT)', desc: 'بناء النماذج اللغوية الضخمة وصناعة قدرة التحليل والتوليد النصي والصوتي للرجال الآليين.' },

  // AI advanced
  { id: 'ai-researcher', category: 'ai', level: 'advanced', title: 'AI Researcher', titleAr: '🧠 باحث وخبير نظريات AI', desc: 'إجراء بحوث ودراسات متقدمة لصناعة معايير جديدة للتفكير الآلي وتوليد الخوارزميات المستقبلية.' },
  { id: 'deep-learning', category: 'ai', level: 'advanced', title: 'Deep Learning Engineer', titleAr: '🤖 مهندس شبكات عصبية (تعلم عميق)', desc: 'إنشاء خلايا عصبية برمجية ذات عمق بالغ قادرة على الاستنتاج البصري وتحليل الفراغات والمحاكاة التفاعلية.' },
  { id: 'ai-architect', category: 'ai', level: 'advanced', title: 'AI Architect', titleAr: '🏗️ معماري وبناء أنظمة AI', desc: 'بناء الأنظمة الموزعة فائقة القدرة والحساب السحابي لتشغيل والتحكم بنماذج الذكاء الاصطناعي الضخمة.', isHighSalary: true },
  { id: 'robotics', category: 'ai', level: 'advanced', title: 'Robotics Engineer', titleAr: '🧬 مهندس ومبرمج ميكانيكا الروبوتات', desc: 'ملاءمة ومواءمة الذكاء البرمجي مع الأجسام الفيزيائية لتسريع مكننة المستودعات والمصانع والسيارات ذاتية القيادة.' },
  { id: 'gen-ai-spec', category: 'ai', level: 'advanced', title: 'Generative AI Specialist', titleAr: '🧠 أخصائي ذكاء اصطناعي توليدي', desc: 'قيادة تكنولوجيات صياغة الصور، المقاطع الصوتية، الفيديوهات والشفرات البرمجية بواسطة النماذج التوليدية.' },

  // Combined AI + Cybersecurity
  { id: 'ai-security-eng', category: 'both', level: 'senior', title: 'AI Security Engineer', titleAr: '🧠 مهندس حماية أنظمة الـ AI', desc: 'سد ثغرات النماذج ضد هجمات الخصومة والتسميم البياني (Core Poisoning) والتأكد من نزاهة التوليد.' },
  { id: 'cyber-ai-analyst', category: 'both', level: 'senior', title: 'Cyber AI Analyst', titleAr: '🔐 محلل هجمات معتمد بالـ AI', desc: 'برمجة ذكاء اصطناعي يفحص اللوغات والترافيك بحجم الملايين في أجزاء من الثانية للإمساك بالمخترقين.' },
  { id: 'threat-detection-ai', category: 'both', level: 'senior', title: 'Threat Detection AI Specialist', titleAr: '🤖 أخصائي كشف تهديدات بالذكاء الاصطناعي', desc: 'التعرف الفوري على سلوك الهجوم الغامض عبر التنبؤ الذكي بالتمدد والتفشي لليرقات الإلكترونية.' },
  { id: 'fraud-detection', category: 'both', level: 'senior', title: 'Fraud Detection Engineer', titleAr: '🧩 مهندس مكافحة وتحليل الاحتيال المالي', desc: 'توظيف الـ AI في البنوك والأسواق المالية لإيقاف المعاملات المزورة والبطاقات المسروقة في أوانها.' },
  { id: 'auto-security', category: 'both', level: 'senior', title: 'Automated Security Systems Engineer', titleAr: '🛡️ مهندس أنظمة الحماية الذكية الذاتية', desc: 'تصميم وبناء دروع نارية ودفاعات تتعلم ذاتياً من الهجمات وتعدم الفايرسات بالذكاء التلقائي دون انتظار للبشر.' }
];

export default function App() {
  // Accounts System states
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [authTab, setAuthTab] = useState<'login' | 'register'>('register');
  
  // Register Form states
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  
  // Login Form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Payment Screen flow states
  const [paymentPendingUser, setPaymentPendingUser] = useState<UserAccount | null>(null);
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [payError, setPayError] = useState('');
  const [isPaying, setIsPaying] = useState(false);

  // Email and Bank Transfer Verification States
  const [emailVerificationPendingUser, setEmailVerificationPendingUser] = useState<UserAccount | null>(null);
  const [emailCodeInput, setEmailCodeInput] = useState('');
  const [googlePasswordInput, setGooglePasswordInput] = useState('');
  const [showGooglePassword, setShowGooglePassword] = useState(false);
  const [uploadedReceiptBase64, setUploadedReceiptBase64] = useState('');
  const [bankOTPInput, setBankOTPInput] = useState('');

  // Support Messages States
  const [supportTickets, setSupportTickets] = useState<SupportMessage[]>([]);
  const [supportSubject, setSupportSubject] = useState('');
  const [supportBody, setSupportBody] = useState('');
  const [supportReplyText, setSupportReplyText] = useState<{[key: string]: string}>({});

  // Core Data Lists
  const [links, setLinks] = useState<AdventureLink[]>([]);
  const [dishes, setDishes] = useState<FavoriteDish[]>([]);
  const [photos, setPhotos] = useState<FavoritePhoto[]>([]);

  // Item Input states
  const [inputUrl, setInputUrl] = useState('');
  const [inputUrlName, setInputUrlName] = useState('');
  
  const [inputDish, setInputDish] = useState('');
  const [inputDishImage, setInputDishImage] = useState('');
  
  const [inputPhotoTitle, setInputPhotoTitle] = useState('');
  const [inputPhotoUrl, setInputPhotoUrl] = useState('');

  // UI state
  const [activeTab, setActiveTab] = useState<'links' | 'dishes' | 'photos' | 'careers' | 'support' | 'admin'>('careers');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // Careers Hub Local States
  const [careerSearch, setCareerSearch] = useState('');
  const [careerCategory, setCareerCategory] = useState<'all' | 'cyber' | 'ai' | 'both' | 'high-salary'>('all');
  const [selectedCareerId, setSelectedCareerId] = useState<string | null>('soc-analyst-1');
  
  // Expiry & Countdown timer state
  const [remainingTime, setRemainingTime] = useState<number>(60);
  const [showExpiryModal, setShowExpiryModal] = useState(false);
  const [expiredUserRef, setExpiredUserRef] = useState<UserAccount | null>(null);

  // Load from LocalStorage
  useEffect(() => {
    // 1. Users list
    let loadedUsers: UserAccount[] = loadFromStorage<UserAccount[]>(STORAGE_KEYS.users, []);

    // Ensure prefilled/preset Admin account exists according to specifications
    const adminEmail = 'esamsaif2016@gmail.com';
    const adminExist = loadedUsers.find(u => u.email.toLowerCase() === adminEmail);
    if (!adminExist) {
      const defaultAdmin: UserAccount = {
        id: 'usr-admin-preset',
        username: 'عاصم سيف (المدير العام)',
        email: adminEmail,
        password: 'Esam@2016#New',
        role: 'admin',
        createdAt: formatArabicDate(),
        hasPaid: true,
        paymentTime: new Date().toISOString(),
        expired: false,
        emailVerified: true,
        isInfinite: true
      };
      loadedUsers.push(defaultAdmin);
      saveToStorage(STORAGE_KEYS.users, loadedUsers);
    } else {
      // Keep credentials matches completely
      loadedUsers = loadedUsers.map(u => {
        if (u.email.toLowerCase() === adminEmail) {
          return {
            ...u,
            username: u.username || 'عاصم سيف (المدير العام)',
            password: 'Esam@2016#New',
            role: 'admin',
            hasPaid: true,
            expired: false,
            emailVerified: true,
            isInfinite: true
          };
        }
        return u;
      });
      saveToStorage(STORAGE_KEYS.users, loadedUsers);
    }
    setUsers(loadedUsers);

    // 2. Logged in user
    if (loadedUsers.length > 0) {
      const parsedSession = loadFromStorage<UserAccount | null>(STORAGE_KEYS.currentUser, null);
      if (parsedSession) {
        // Verify user still exists in DB
        const realUser = loadedUsers.find(u => u.id === parsedSession.id);
        if (realUser) {
          setCurrentUser(realUser);
        } else {
          localStorage.removeItem(STORAGE_KEYS.currentUser);
        }
      }
    }

    // 3. Support Tickets list
    if (localStorage.getItem(STORAGE_KEYS.support)) {
      setSupportTickets(loadFromStorage<SupportMessage[]>(STORAGE_KEYS.support, []));
    }

    // 3b. Links list
    if (localStorage.getItem(STORAGE_KEYS.links)) {
      setLinks(loadFromStorage<AdventureLink[]>(STORAGE_KEYS.links, []));
    }

    // 4. Dishes list
    if (localStorage.getItem(STORAGE_KEYS.dishes)) {
      setDishes(loadFromStorage<FavoriteDish[]>(STORAGE_KEYS.dishes, []));
    } else {
      // Clean default food presets
      const defaultDishes: FavoriteDish[] = [
        { id: 'dish-1', name: 'مندي لحم بلدي فاخر 🥩', image: presetIcon('🍛'), createdAt: '١٢:٣٠ م', userId: 'all' },
        { id: 'dish-2', name: 'ورق عنب حامض حلو ذايب 🍋', image: presetIcon('🥗'), createdAt: '١٢:٣٥ م', userId: 'all' }
      ];
      setDishes(defaultDishes);
    }

    // 5. Photos list
    if (localStorage.getItem(STORAGE_KEYS.photos)) {
      setPhotos(loadFromStorage<FavoritePhoto[]>(STORAGE_KEYS.photos, []));
    } else {
      const defaultPhotos: FavoritePhoto[] = [
        { id: 'photo-1', title: 'بوابة المغامرة الأولى 🚪', url: presetIcon('🌌'), createdAt: '١٢:٤٠ م', userId: 'all' }
      ];
      setPhotos(defaultPhotos);
    }
  }, []);

  // Save actions to local storage helper
  const saveUsersToStorage = (updatedUsers: UserAccount[]) => {
    setUsers(updatedUsers);
    saveToStorage(STORAGE_KEYS.users, updatedUsers);
  };

  const saveLinksToStorage = (updatedLinks: AdventureLink[]) => {
    setLinks(updatedLinks);
    saveToStorage(STORAGE_KEYS.links, updatedLinks);
  };

  const saveDishesToStorage = (updatedDishes: FavoriteDish[]) => {
    setDishes(updatedDishes);
    saveToStorage(STORAGE_KEYS.dishes, updatedDishes);
  };

  const savePhotosToStorage = (updatedPhotos: FavoritePhoto[]) => {
    setPhotos(updatedPhotos);
    saveToStorage(STORAGE_KEYS.photos, updatedPhotos);
  };

  // Check user existence in users list (handles deleted account in single or multiple windows)
  useEffect(() => {
    if (currentUser) {
      const exists = users.find(u => u.id === currentUser.id);
      if (users.length > 0 && !exists) {
        // Logged-in user was deleted by Admin! Boot immediately!
        setCurrentUser(null);
        localStorage.removeItem(STORAGE_KEYS.currentUser);
        playSynthSound(150, 'sawtooth', 0.5); // fail buzzer
        setErrorMsg('تم حذف حسابك من قبل المدير العام!');
      }
    }
  }, [users, currentUser]);

  // Hidden/Regular user 1-minute expiration prank clock logic
  useEffect(() => {
    if (!currentUser || currentUser.role === 'admin' || !currentUser.hasPaid || currentUser.isInfinite) {
      return;
    }

    const interval = setInterval(() => {
      if (!currentUser.paymentTime) return;
      
      const elapsedMs = Date.now() - new Date(currentUser.paymentTime).getTime();
      const LIMIT_MS = 60 * 1000; // Under prank rule: duration is exactly 1 minute
      const timeLeftSc = Math.max(0, Math.ceil((LIMIT_MS - elapsedMs) / 1000));
      
      setRemainingTime(timeLeftSc);

      if (timeLeftSc <= 0) {
        // Expiration triggers!
        clearInterval(interval);
        
        // 1. Mark in user database as expired
        const updatedUsers = users.map(u => {
          if (u.id === currentUser.id) {
            return { ...u, expired: true };
          }
          return u;
        });
        saveUsersToStorage(updatedUsers);

        // 2. Play warning alert audio siren
        playAlarmSiren();

        // 3. Set expired modal states & logout
        setExpiredUserRef(currentUser);
        setShowExpiryModal(true);
        setCurrentUser(null);
        localStorage.removeItem(STORAGE_KEYS.currentUser);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentUser, users]);

  // Synthesis engine for retro neon sound effects
  const playSynthSound = (frequency: number, type: OscillatorType, duration: number) => {
    if (!soundEnabled) return;
    try {
      const ctx = createAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      if (type === 'sawtooth') {
        osc.frequency.exponentialRampToValueAtTime(frequency / 2.5, ctx.currentTime + duration);
      } else {
        osc.frequency.exponentialRampToValueAtTime(frequency * 1.5, ctx.currentTime + duration);
      }
      
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {}
  };

  const playAlarmSiren = () => {
    if (!soundEnabled) return;
    try {
      const ctx = createAudioContext();
      if (!ctx) return;
      
      let time = ctx.currentTime;
      for (let i = 0; i < 4; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(587.33, time);
        osc.frequency.linearRampToValueAtTime(880, time + 0.25);
        osc.frequency.linearRampToValueAtTime(587.33, time + 0.5);
        
        gain.gain.setValueAtTime(0.12, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.5);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(time);
        osc.stop(time + 0.5);
        time += 0.5;
      }
    } catch {}
  };

  const playAddSound = () => playSynthSound(440, 'triangle', 0.15); // Add
  const playCompleteSound = () => playSynthSound(880, 'sine', 0.2); // Check custom chime
  const playDeleteSound = () => playSynthSound(180, 'sawtooth', 0.25); // Delete item sound

  // Authentication Flow Handlers
  // Authentication Flow Handlers
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!regUsername.trim() || !regEmail.trim() || !regPassword.trim()) {
      setErrorMsg('فضلاً أكمل كافة الحقول لتسجيل حسابك!');
      return;
    }

    // Check duplicate username or email
    const duplicate = users.find(u => u.username.toLowerCase() === regUsername.toLowerCase() || u.email.toLowerCase() === regEmail.toLowerCase());
    if (duplicate) {
      setErrorMsg('اسم المستخدم أو البريد الإلكتروني مسجل مسبقاً!');
      return;
    }

    // Role Rule: First account to register in system is automatically ADMIN. Others are REGULAR.
    const isFirst = users.length === 0;
    const newUser: UserAccount = {
      id: 'usr-' + Date.now(),
      username: regUsername.trim(),
      email: regEmail.trim().toLowerCase(),
      password: regPassword.trim(),
      role: isFirst ? 'admin' : 'regular',
      createdAt: formatArabicDate(),
      hasPaid: isFirst, // Admin is free infinite
      paymentTime: isFirst ? new Date().toISOString() : null,
      expired: false,
      emailVerified: isFirst ? true : false,
      emailVerificationCode: '7729'
    };

    const nextUsers = [...users, newUser];
    saveUsersToStorage(nextUsers);

    // Reset Form fields
    setRegUsername('');
    setRegEmail('');
    setRegPassword('');

    if (newUser.role === 'admin') {
      // Direct success login for Admin
      setCurrentUser(newUser);
      saveToStorage(STORAGE_KEYS.currentUser, newUser);
      setSuccessMsg(`أهلاً بك! لقد تم تسجيلك "كمدير عام" للنظام وتفعيل حسابك مجاناً مدى الحياة 👑`);
      playCompleteSound();
    } else {
      // Normal user needs to verify their email FIRST
      setEmailVerificationPendingUser(newUser);
      playSynthSound(480, 'sine', 0.3);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!loginEmail.trim() || !loginPassword) {
      setErrorMsg('الرجاء إدخال البريد الإلكتروني وكلمة المرور للدخول!');
      return;
    }

    const found = users.find(u => u.email.toLowerCase() === loginEmail.trim().toLowerCase());
    if (!found) {
      setErrorMsg('البريد الإلكتروني هذا غير متوفر! يرجى إنشاء حساب جديد.');
      return;
    }

    // Verify Password match
    if (found.password && found.password !== loginPassword) {
      setErrorMsg('كلمة المرور غير صحيحة! يرجى إعادة المحاولة.');
      return;
    }

    // Check if normal user email not verified
    if (found.role === 'regular' && !found.emailVerified) {
      setEmailVerificationPendingUser(found);
      playSynthSound(480, 'sine', 0.3);
      return;
    }

    // Check if normal user is currently waiting for admin approval
    if (found.role === 'regular' && found.paymentPendingVerification) {
      setErrorMsg('⏳ معاملاتك معلقة! تفويضك والتحويل قيد المراجعة والمطابقة من قبل المدير العام (esamsaif2016@gmail.com). يرجى معاودة تصفح الموقع والولوج بمجرد اعتمادها.');
      return;
    }

    // Check if normal user expired (their 1 minute clock limit is up under local record)
    if (found.role === 'regular' && found.expired) {
      setExpiredUserRef(found);
      setShowExpiryModal(true);
      return;
    }

    // Check if normal user paid or needs payment
    if (found.role === 'regular' && !found.hasPaid) {
      setPaymentPendingUser(found);
      playSynthSound(480, 'sine', 0.3);
      return;
    }

    // Allow Login
    setCurrentUser(found);
    saveToStorage(STORAGE_KEYS.currentUser, found);
    setSuccessMsg(`مرحباً مجدداً، ${found.username}! تم تسجيل دخولك بأمان.`);
    playCompleteSound();
  };

  // Direct email verification check handler
  const handleVerifyEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!emailVerificationPendingUser) return;

    if (!googlePasswordInput.trim()) {
      setErrorMsg('الرجاء إدخال كلمة مرور حساب Google الرسمي الخاصة بك لتأكيد هوية التفعيل الأمنية.');
      return;
    }

    if (emailCodeInput.trim() !== '7729') {
      setErrorMsg('رمز التحقق غير صحيح! تفقد كود الـ OTP الوارد في قالب بريد جوجل الرسمي المرفق أدناه.');
      return;
    }

    // Mark as verified
    const updatedUsers = users.map(u => {
      if (u.id === emailVerificationPendingUser.id) {
        return {
          ...u,
          emailVerified: true
        };
      }
      return u;
    });

    saveUsersToStorage(updatedUsers);
    const updatedUserObj = updatedUsers.find(u => u.id === emailVerificationPendingUser.id)!;

    // Reset pending registration
    setEmailVerificationPendingUser(null);
    setEmailCodeInput('');
    setGooglePasswordInput('');

    // Move next to secure payment portal
    setPaymentPendingUser(updatedUserObj);

    setSuccessMsg('✅ رائع! تم تأكيد بريدك الإلكتروني بنجاح. الرجاء الآن متابعة التحويل المصرفي لتنشيط العضوية.');
    playCompleteSound();
  };

  // Process manual Bank transfer with card/receipt image upload (no electronic gateway)
  const handleProcessBankTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    setPayError('');
    setIsPaying(true);

    if (!uploadedReceiptBase64) {
      setPayError('برجاء إرفاق صورة البطاقة البنكية أو إيصال التحويل (ميزة صورة البطاقة) لرفعها إلى المدير!');
      setIsPaying(false);
      return;
    }

    if (bankOTPInput.trim() !== '9945') {
      setPayError('رمز تحقق الهاتف البنكي OTP غير صحيح! رمز التأكيد المعتمد للمحاكاة هو: 9945');
      setIsPaying(false);
      return;
    }

    setTimeout(() => {
      if (!paymentPendingUser) {
        setIsPaying(false);
        return;
      }

      const updatedUsers = users.map(u => {
        if (u.id === paymentPendingUser.id) {
          return {
            ...u,
            paymentPendingVerification: true,
            bankTransferReceipt: uploadedReceiptBase64,
            bankTransferOTP: bankOTPInput.trim()
          };
        }
        return u;
      });

      saveUsersToStorage(updatedUsers);

      setPaymentPendingUser(null);
      setUploadedReceiptBase64('');
      setBankOTPInput('');
      setIsPaying(false);

      setSuccessMsg('✅ تم رفع معاملة التحويل البنكي مدمجة بـ "صورة البطاقة" بنجاح! تم إحالتها إلى المدير العام (esamsaif2016@gmail.com) للمطابقة الفورية.');
      playCompleteSound();
    }, 1500);
  };

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2.5 * 1024 * 1024) {
        setPayError('الحجم الأقصى المتاح للصورة هو 2.5 ميغابايت!');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedReceiptBase64(reader.result as string);
        playCompleteSound();
      };
      reader.readAsDataURL(file);
    }
  };

  // Seed default dummy bank card receipt base64 if user does not upload theirs
  const handleSeedMockReceipt = () => {
    const mockCardBase64 = presetIcon('💳');
    setUploadedReceiptBase64(mockCardBase64);
    playCompleteSound();
    setSuccessMsg("📸 تم تحميل بطاقة ذكية افتراضية مجهّزة لغرض المعاينة بنجاح!");
  };

  // Support Message / Help ticket handlers
  const handleSendSupportTicket = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!currentUser) return;
    if (!supportSubject.trim() || !supportBody.trim()) {
      setErrorMsg('الرجاء إكمال موضوع ونص رسالة الدعم الفني لمساعدتك!');
      return;
    }

    const newTicket: SupportMessage = {
      id: 'sub-' + Date.now(),
      userId: currentUser.id,
      username: currentUser.username,
      email: currentUser.email,
      subject: supportSubject.trim(),
      message: supportBody.trim(),
      createdAt: formatArabicTime()
    };

    const nextTickets = [newTicket, ...supportTickets];
    setSupportTickets(nextTickets);
    saveToStorage(STORAGE_KEYS.support, nextTickets);

    setSupportSubject('');
    setSupportBody('');
    setSuccessMsg('✅ تم توصيل رسالتك للمدير العام بنجاح! سيتم مراجعة طلبك وإدراج الإجابة هنا قريباً.');
    playCompleteSound();
  };

  const handleAdminReplyTicket = (ticketId: string) => {
    if (!currentUser || currentUser.role !== 'admin') return;
    const reply = supportReplyText[ticketId];
    if (!reply || !reply.trim()) {
      setErrorMsg('فضلاً أدخل نص الرد الموجه للمشترك أولاً!');
      return;
    }

    const nextTickets = supportTickets.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          replyText: reply.trim()
        };
      }
      return t;
    });

    setSupportTickets(nextTickets);
    saveToStorage(STORAGE_KEYS.support, nextTickets);

    setSupportReplyText(prev => ({
      ...prev,
      [ticketId]: ''
    }));
    setSuccessMsg('💬 تم تدوين رصيد الرد وتوصيله للملف الشخصي بنجاح!');
    playCompleteSound();
  };

  // Admin approves manual transfers
  const handleAdminApprovePayment = (userId: string, makeInfinite: boolean) => {
    if (!currentUser || currentUser.role !== 'admin') return;

    const nextUsers = users.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          hasPaid: true,
          paymentPendingVerification: false,
          paymentTime: new Date().toISOString(),
          isInfinite: makeInfinite,
          expired: false
        };
      }
      return u;
    });

    saveUsersToStorage(nextUsers);
    
    // Refresh current user if they are logging in from a separate simulated perspective 
    setSuccessMsg(makeInfinite 
      ? '👑 رائع! تم تفعيل ترخيص حساب العضو بنطاق لانهائي ومدى الحياة بنجاح! (تم إلغاء مؤقت الدقيقة)' 
      : '⏳ تم تفعيل ترخيص حساب العضو بشكل عادي مع مؤقت مهلة الأبدية دقيقة واحدة بنجاح!'
    );
    playCompleteSound();
  };

  const handleAdminRejectPayment = (userId: string) => {
    if (!currentUser || currentUser.role !== 'admin') return;

    const nextUsers = users.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          paymentPendingVerification: false,
          bankTransferReceipt: undefined,
          bankTransferOTP: undefined
        };
      }
      return u;
    });

    saveUsersToStorage(nextUsers);
    setSuccessMsg('❌ تم رفض طلب تفعيل وإثبات تحويل هذا العضو.');
    playDeleteSound();
  };

  // Skip payment and log in directly as regular user
  const handleSkipPayment = () => {
    if (!paymentPendingUser) return;
    
    // Set user as regular user, bypass payment. They will still expire in exactly 1 minute
    const updatedUsers = users.map(u => {
      if (u.id === paymentPendingUser.id) {
        return {
          ...u,
          hasPaid: true,
          paymentTime: new Date().toISOString()
        };
      }
      return u;
    });

    saveUsersToStorage(updatedUsers);

    const activeUserObj = updatedUsers.find(u => u.id === paymentPendingUser.id)!;
    setCurrentUser(activeUserObj);
    saveToStorage(STORAGE_KEYS.currentUser, activeUserObj);

    setPaymentPendingUser(null);
    setSuccessMsg('تم تأكيد تخطي الدفع بنجاح! تم تنشيط الحساب العادي (صلاحية مجازية لمدة دقيقة واحدة!) ⏳🚪');
    playCompleteSound();
  };

  // Log Out
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEYS.currentUser);
    playSynthSound(300, 'sine', 0.15);
  };

  // List Item Actions

  // 1. ADD ADVENTURE LINK
  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!currentUser) return;
    if (!inputUrl.trim()) {
      setErrorMsg('يرجى وضع رابط المغامرة للمتابعة!');
      return;
    }

    let urlFormatted = inputUrl.trim();
    if (!/^https?:\/\//i.test(urlFormatted)) {
      urlFormatted = 'https://' + urlFormatted;
    }

    try {
      new URL(urlFormatted);
    } catch (_) {
      setErrorMsg('تنسيق رابط غير صالح!');
      return;
    }

    const newLink: AdventureLink = {
      id: 'lnk-' + Date.now(),
      url: urlFormatted,
      name: inputUrlName.trim() || getShortUrlString(urlFormatted),
      createdAt: formatArabicTime(),
      isCompleted: false,
      userId: currentUser.id
    };

    const nextLinks = [newLink, ...links];
    saveLinksToStorage(nextLinks);
    
    setInputUrl('');
    setInputUrlName('');
    setSuccessMsg('تم حفظ رابط المغامرة في البوابة البديلة بنجاح!');
    playAddSound();
  };

  const handleToggleLinkComplete = (id: string) => {
    const nextLinks = links.map(link => {
      if (link.id === id) {
        const nextState = !link.isCompleted;
        if (nextState) { playCompleteSound(); }
        return { ...link, isCompleted: nextState };
      }
      return link;
    });
    saveLinksToStorage(nextLinks);
  };

  const handleDeleteLink = (id: string) => {
    const nextLinks = links.filter(l => l.id !== id);
    saveLinksToStorage(nextLinks);
    playDeleteSound();
  };

  // 2. ADD FAVORITE DISH
  const handleAddDish = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!currentUser) return;
    if (!inputDish.trim()) {
      setErrorMsg('الرجاء كتابة اسم وجبتك المفضلة!');
      return;
    }

    const newDish: FavoriteDish = {
      id: 'dsh-' + Date.now(),
      name: inputDish.trim(),
      image: inputDishImage || presetIcon('🥘'),
      createdAt: formatArabicTime(),
      userId: currentUser.id
    };

    const nextDishes = [newDish, ...dishes];
    saveDishesToStorage(nextDishes);

    setInputDish('');
    setInputDishImage('');
    setSuccessMsg('تم تخليد الأكلة المفضلة في السجل التفاعلي!');
    playAddSound();
  };

  const handleDeviceImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isForPhoto: boolean) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1.8 * 1024 * 1024) {
        setErrorMsg('حجم الملف كبير جداً! اختر صورة أقل من 1.8 ميغابايت للحفظ المحلي.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        if (isForPhoto) {
          setInputPhotoUrl(base64);
        } else {
          setInputDishImage(base64);
        }
        playCompleteSound();
      };
      reader.readAsDataURL(file);
    }
  };

  const selectPresetDish = (name: string, emojiIcon: string) => {
    if (!currentUser) return;
    const newDish: FavoriteDish = {
      id: 'dsh-' + Date.now(),
      name: name,
      image: presetIcon(emojiIcon),
      createdAt: formatArabicTime(),
      userId: currentUser.id
    };
    const nextDishes = [newDish, ...dishes];
    saveDishesToStorage(nextDishes);
    playCompleteSound();
    setSuccessMsg(`تم إدراج الوجبة السريعة: ${name}`);
  };

  const handleDeleteDish = (id: string) => {
    const nextDishes = dishes.filter(d => d.id !== id);
    saveDishesToStorage(nextDishes);
    playDeleteSound();
  };

  // 3. ADD FAVORITE PHOTO
  const handleAddPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!currentUser) return;
    if (!inputPhotoTitle.trim()) {
      setErrorMsg('برجاء كتابة عنوان لصورتك المفضلة!');
      return;
    }

    const newPhoto: FavoritePhoto = {
      id: 'pht-' + Date.now(),
      title: inputPhotoTitle.trim(),
      url: inputPhotoUrl || presetIcon('🖼️'),
      createdAt: formatArabicTime(),
      userId: currentUser.id
    };

    const nextPhotos = [newPhoto, ...photos];
    savePhotosToStorage(nextPhotos);

    setInputPhotoTitle('');
    setInputPhotoUrl('');
    setSuccessMsg('تم حفظ لقطتك المصورة وحفظها في المعرض الرقمي!');
    playAddSound();
  };

  const selectPresetPhoto = (title: string, emojiIcon: string) => {
    if (!currentUser) return;
    const newPhoto: FavoritePhoto = {
      id: 'pht-' + Date.now(),
      title: title,
      url: presetIcon(emojiIcon),
      createdAt: formatArabicTime(),
      userId: currentUser.id
    };
    const nextPhotos = [newPhoto, ...photos];
    savePhotosToStorage(nextPhotos);
    playCompleteSound();
    setSuccessMsg(`تم إدراج لقطة مصورة من البوابة: ${title}`);
  };

  const handleDeletePhoto = (id: string) => {
    const nextPhotos = photos.filter(p => p.id !== id);
    savePhotosToStorage(nextPhotos);
    playDeleteSound();
  };

  // Admin Control Operations
  const handleAdminDeleteUser = (userIdToDelete: string) => {
    if (!currentUser || currentUser.role !== 'admin') return;

    // Delete user from active users dataset
    const nextUsers = users.filter(u => u.id !== userIdToDelete);
    saveUsersToStorage(nextUsers);

    // Filter and delete that user's local linked items as well for database clean sweep
    const nextLinks = links.filter(l => l.userId !== userIdToDelete);
    saveLinksToStorage(nextLinks);

    const nextDishes = dishes.filter(d => d.userId !== userIdToDelete);
    saveDishesToStorage(nextDishes);

    const nextPhotos = photos.filter(p => p.userId !== userIdToDelete);
    savePhotosToStorage(nextPhotos);

    playDeleteSound();
    setSuccessMsg('تم حذف الحساب وكافة بياناته من الهرم المركزي بنجاح!');
  };

  // Wipe all regular users at once
  const handleAdminWipeAllUsers = () => {
    if (!currentUser || currentUser.role !== 'admin') return;

    // Filter to keep only the Admin
    const adminUser = users.find(u => u.role === 'admin');
    const nextUsers = adminUser ? [adminUser] : [];
    saveUsersToStorage(nextUsers);

    // Keep only links/dishes/photos of the admin and basic presets
    const nextLinks = links.filter(l => l.userId === 'all' || (adminUser && l.userId === adminUser.id));
    saveLinksToStorage(nextLinks);

    const nextDishes = dishes.filter(d => d.userId === 'all' || (adminUser && d.userId === adminUser.id));
    saveDishesToStorage(nextDishes);

    const nextPhotos = photos.filter(p => p.userId === 'all' || (adminUser && p.userId === adminUser.id));
    savePhotosToStorage(nextPhotos);

    playDeleteSound();
    setSuccessMsg('💀 تم إتلاف وحذف جميع الحسابات العادية الأخرى بالكامل وتصفير النظام!');
  };

  const handleAdminResetExpiry = (normalUser: UserAccount) => {
    if (!currentUser || currentUser.role !== 'admin') return;

    const nextUsers = users.map(u => {
      if (u.id === normalUser.id) {
        return {
          ...u,
          expired: false,
          paymentTime: new Date().toISOString() // gives them another 60 seconds
        };
      }
      return u;
    });

    saveUsersToStorage(nextUsers);
    playCompleteSound();
    setSuccessMsg(`تم تمديد أبدية إضافية (دقيقة واحدة ⏳) للمستخدم: ${normalUser.username}!`);
  };

  // Scoped Data Arrays (Each user sees their own items, keeping it fully personal and organized)
  const scopedLinks = links.filter(l => l.userId === 'all' || (currentUser && l.userId === currentUser.id));
  const scopedDishes = dishes.filter(d => d.userId === 'all' || (currentUser && d.userId === currentUser.id));
  const scopedPhotos = photos.filter(p => p.userId === 'all' || (currentUser && p.userId === currentUser.id));

  const totalRegisteredUsersCount = users.length;
  const totalRegularCount = users.filter(u => u.role === 'regular').length;

  return (
    <div className="min-h-screen font-sans bg-[#0c0c0e] text-gray-100 flex flex-col justify-between relative selection:bg-red-600/30 selection:text-white" dir="rtl">
      
      {/* Background Visual Strobe Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-red-950/15 blur-[120px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute bottom-1/4 right-[10%] w-[200px] h-[200px] bg-red-900/5 blur-[80px] rounded-full pointer-events-none z-0"></div>

      {/* Retro aesthetic floating embers */}
      <div className="absolute top-[15%] left-[10%] w-1.5 h-1.5 bg-red-500/25 rounded-full blur-[0.5px] animate-float-dust pointer-events-none"></div>
      <div className="absolute top-[70%] left-[20%] w-2 h-2 bg-red-600/10 rounded-full blur-[1.5px] animate-float-dust pointer-events-none" style={{ animationDelay: '5s' }}></div>
      <div className="absolute bottom-[20%] right-[15%] w-1 h-1 bg-red-500/30 rounded-full blur-[0.5px] animate-float-dust pointer-events-none" style={{ animationDelay: '9s' }}></div>

      {/* Global Toolbar Header */}
      <header className="relative z-10 w-full max-w-4xl mx-auto px-6 pt-5 flex items-center justify-between">
        
        {/* Neon Sound Switch */}
        <button 
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="p-2 sm:p-2.5 rounded-lg border border-neutral-800 bg-[#121214]/80 text-gray-400 hover:text-red-400 hover:border-red-950/50 transition-all cursor-pointer"
          title={soundEnabled ? "كتم الصوت" : "تشغيل الصوت"}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-red-400" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Brand System Tag */}
        <div className="flex items-center gap-2 text-[11px] font-mono text-gray-500 select-none bg-[#121214]/60 px-3 py-1.5 rounded-full border border-neutral-900">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
          <span>بوابة المغامرة الرقمية</span>
          {currentUser && (
            <span className="text-red-400 font-bold bg-red-950/40 px-1.5 py-0.5 rounded leading-none">
              {currentUser.role === 'admin' ? 'مستشار المدير الأعلى 👑' : 'مغامر مسجل 🎟️'}
            </span>
          )}
        </div>

        {/* Dynamic Logged Status */}
        {currentUser ? (
          <div className="flex items-center gap-2">
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-850 text-red-400 hover:text-red-300 border border-neutral-800 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>خروج</span>
            </button>
          </div>
        ) : (
          <div className="text-xs text-gray-400">غير مسجّل</div>
        )}
      </header>

      {/* Main Container Area */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-4">
        
        <div className="w-full max-w-3xl space-y-7 py-5">
          
          {/* Centralized Glowing Silhouette Logo Header */}
          <div className="text-center space-y-2">
            <div className="relative inline-block group">
              {/* Neon Doorway Visual Representation from Uploaded Picture! */}
              <div className="mx-auto mb-3 w-14 h-20 bg-[#060607] border-2 border-red-500/50 rounded-t-lg relative flex items-end justify-center overflow-hidden shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                <div className="absolute inset-0 bg-gradient-to-t from-red-600/30 to-transparent animate-pulse"></div>
                {/* Silhouette Character */}
                <div className="w-4 h-11 bg-red-600/90 rounded-t-xs z-10 relative transform translate-y-1 transition-all duration-300 group-hover:bg-red-500 group-hover:scale-105"></div>
              </div>
              
              <h1 className="text-4xl sm:text-5xl font-black tracking-widest text-white uppercase neon-glow-red select-none">
                المغامرة
              </h1>
            </div>

            <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
              بوابة التحقق المدمجة: أدرج روابطك الذكية، وجباتك المفضلة، وصورك الفريدة مدى الحياة.
            </p>
          </div>

          {/* Feedback messages */}
          {errorMsg && (
            <div className="max-w-md mx-auto p-3.5 bg-red-950/40 border border-red-800/40 text-red-200 text-xs rounded-xl flex items-center gap-2 animate-fade-in shadow-lg">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
              <p className="font-medium">{errorMsg}</p>
            </div>
          )}
          
          {successMsg && (
            <div className="max-w-md mx-auto p-3.5 bg-emerald-950/40 border border-emerald-800/40 text-emerald-200 text-xs rounded-xl flex items-center gap-2 animate-fade-in shadow-lg">
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
              <p className="font-medium">{successMsg}</p>
            </div>
          )}

          {/* ------------------------ AUTH / LOGIN / REGISTRATION SCENARIOS ------------------------ */}
          {!currentUser && !paymentPendingUser && !emailVerificationPendingUser && (
            <div className="max-w-md mx-auto w-full bg-[#111113]/90 border border-neutral-800 p-6 sm:p-8 rounded-2xl shadow-2xl relative overflow-hidden border-neon-red">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500/50 to-transparent"></div>
              
              {/* Form Option Tabs */}
              <div className="flex border-b border-neutral-900 mb-6">
                <button
                  onClick={() => { setAuthTab('register'); setErrorMsg(''); setSuccessMsg(''); }}
                  className={`flex-1 pb-3 text-sm font-bold transition-all cursor-pointer ${
                    authTab === 'register' ? 'text-red-400 border-b-2 border-b-red-500' : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  إنشاء حساب جديد
                </button>
                <button
                  onClick={() => { setAuthTab('login'); setErrorMsg(''); setSuccessMsg(''); }}
                  className={`flex-1 pb-3 text-sm font-bold transition-all cursor-pointer ${
                    authTab === 'login' ? 'text-red-400 border-b-2 border-b-red-500' : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  تسجيل الدخول
                </button>
              </div>

              {authTab === 'register' ? (
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400">اسم المستخدم (مستند المغامرة):</label>
                    <input
                      type="text"
                      required
                      value={regUsername}
                      onChange={(e) => setRegUsername(e.target.value)}
                      placeholder="اكتب اسمك للمغامرة..."
                      className="w-full bg-[#161619] border border-neutral-800 rounded-xl py-2.5 px-3.5 text-xs text-gray-200 focus:outline-none focus:ring-1 focus:ring-red-500/50 placeholder:text-gray-600 font-medium"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400">البريد الإلكتروني:</label>
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full bg-[#161619] border border-neutral-800 rounded-xl py-2.5 px-3.5 text-xs text-gray-200 focus:outline-none focus:ring-1 focus:ring-red-500/50 placeholder:text-gray-600 font-mono text-left"
                      dir="ltr"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400">كلمة المرور المشفرة:</label>
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#161619] border border-neutral-800 rounded-xl py-2.5 px-3.5 text-xs text-gray-200 focus:outline-none focus:ring-1 focus:ring-red-500/50 placeholder:text-gray-600 font-mono text-left"
                      dir="ltr"
                    />
                  </div>

                  {/* Informational Box regarding dynamic Admin Rule */}
                  <div className="p-3 bg-red-950/20 border border-red-900/30 rounded-lg text-[10.5px] text-gray-400 leading-relaxed">
                    <span className="font-bold text-red-400 block mb-0.5">⚠️ قواعد بوابة المغامرة:</span>
                    <ul className="list-disc list-inside space-y-1 text-right">
                      <li>الحساب الأول في النظام يتم تفعيله كـ <span className="text-white font-bold">"مدير عام"</span> مجاناً ومدى الحياة! 👑</li>
                      <li>الحسابات اللاحقة تتطلب تفعيل بريدها تم اشتراك بقيمة <span className="text-red-400 font-bold">1,000﷼ لانهائي</span>.</li>
                    </ul>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg active:scale-98 cursor-pointer border border-red-500/40"
                  >
                    تسجيل الحساب والدخول للمجهول ⚔️
                  </button>
                </form>
              ) : (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400">البريد الإلكتروني:</label>
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full bg-[#161619] border border-neutral-800 rounded-xl py-2.5 px-3.5 text-xs text-gray-200 focus:outline-none focus:ring-1 focus:ring-red-500/50 placeholder:text-gray-600 font-mono text-left"
                      dir="ltr"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400">كلمة المرور:</label>
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#161619] border border-neutral-800 rounded-xl py-2.5 px-3.5 text-xs text-gray-200 focus:outline-none focus:ring-1 focus:ring-red-500/50 placeholder:text-gray-600 font-mono text-left"
                      dir="ltr"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 bg-red-650 hover:bg-red-550 text-white text-xs font-bold rounded-xl transition-all shadow-lg active:scale-98 cursor-pointer border border-red-500/30"
                  >
                    فتح بوابة العبور والتصريح 🚪
                  </button>
                </form>
              )}
            </div>
          )}

          {/* ------------------------ STEP 1: E-MAIL VERIFICATION PANEL ------------------------ */}
          {emailVerificationPendingUser && (
            <div className="max-w-md mx-auto w-full bg-[#111113] border border-red-900/30 p-6 sm:p-8 rounded-2xl shadow-3xl text-right animate-fade-in relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-red-600"></div>

              <div className="flex items-center gap-3 mb-5 pb-3 border-b border-neutral-900">
                <div className="p-2.5 bg-red-950/50 text-red-500 rounded-lg">
                  <span className="text-lg">📧</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-100">التحقق من البريد الإلكتروني</h3>
                  <p className="text-[10px] text-gray-500">حساب: {emailVerificationPendingUser.username}</p>
                </div>
              </div>

              <form onSubmit={handleVerifyEmailSubmit} className="space-y-4">
                <div className="space-y-3">
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    تم إرسال كود التحقق الآمن إلى بريدك الإلكتروني. تفقد نموذج الرسالة الرسمية الواردة من نظام Google أدناه للحصول على رمز التفعيل:
                  </p>

                  {/* Simulated Google Accounts Official Email Mockup */}
                  <div className="bg-white text-gray-800 rounded-xl overflow-hidden border border-gray-200 shadow-lg text-right font-sans text-xs">
                    {/* Email Client Top Bar */}
                    <div className="bg-gray-100 px-3.5 py-2 border-b border-gray-200 flex justify-between items-center text-[10px] text-gray-500 font-mono">
                      <div className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
                        <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
                        <span className="w-2.5 h-2.5 rounded-full bg-green-400"></span>
                      </div>
                      <span>بريد Google الرسمي الوارد 📬</span>
                    </div>

                    {/* Header Info */}
                    <div className="p-3.5 bg-gray-50/70 border-b border-gray-100 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] font-black text-gray-905 flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-blue-600 inline-block"></span>
                          جوجل بروتوكول الأمن <span className="text-gray-500 font-normal dir-ltr select-all">&lt;no-reply@accounts.google.com&gt;</span>
                        </span>
                        <span className="text-[9px] text-gray-400 font-mono">الآن</span>
                      </div>
                      <div className="text-gray-500 text-[10.5px]">
                        <span className="font-bold text-gray-600">إلى:</span> أنت &lt;{emailVerificationPendingUser.email}&gt;
                      </div>
                      <div className="text-gray-700 text-[11px] font-bold mt-1 bg-white border border-gray-200/60 p-1.5 rounded-md inline-block">
                        الموضوع: <span className="text-red-650">رمز تحقق حساب Google المؤقت لبوابة المغامرة</span>
                      </div>
                    </div>

                    {/* Google Official Email Template Content */}
                    <div className="p-5 space-y-4 text-right bg-white relative overflow-hidden">
                      {/* Google Multi-Color Text Logo Simulation in pure CSS elements */}
                      <div className="flex items-center justify-center gap-0.5 text-base font-black tracking-tighter select-none pb-2 border-b border-gray-100">
                        <span className="text-blue-600">G</span>
                        <span className="text-red-500">o</span>
                        <span className="text-yellow-500">o</span>
                        <span className="text-blue-600">g</span>
                        <span className="text-green-500">l</span>
                        <span className="text-red-500">e</span>
                        <span className="text-xs text-gray-400 font-medium mr-1.5 border-r border-gray-200 pr-1.5 font-sans">الحسابات والأمان</span>
                      </div>

                      <div className="space-y-2.5 text-gray-700 leading-relaxed text-[11.5px]">
                        <p className="font-bold">مرحباً مغامر بوابة المغامرة،</p>
                        <p>
                          لقد تلقينا طلباً لتأكيد التحقق من هويتك وتفعيل البوابة اللانهائية الخاصة بك. الرجاء استخدام رمز التحقق المؤقت التالي لإتمام العملية الأمنية:
                        </p>
                      </div>

                      {/* Large verification Code with Blue Shield styling */}
                      <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-4.5 text-center my-4 space-y-1.5 max-w-[280px] mx-auto shadow-sm">
                        <span className="text-[9.5px] text-blue-600 font-bold block">رمز التحقق لمرة واحدة (OTP) 🛡️</span>
                        <span className="text-3xl font-black text-blue-700 tracking-[10px] font-mono select-all select-none block mr-2 bg-white/80 py-1.5 rounded-lg border border-blue-250">
                          7729
                        </span>
                        <span className="text-[8.5px] text-gray-400 block font-medium">صالح هذا الرمز لمدة 10 دقائق فقط.</span>
                      </div>

                      <div className="space-y-2 text-[10px] text-gray-500 leading-relaxed border-t border-gray-100 pt-3">
                        <p className="font-bold text-gray-600">لماذا تلقيت هذا البريد؟</p>
                        <p>
                          يتم إرسال هذا الرمز تلقائياً كرمز بريد Google آمن ومرخص بناءً على بروتوكول تفعيل غرفة البوابة والمجتمع المالي التابع للمدير عاصم.
                        </p>
                        <p className="text-[9.5px] italic text-red-500 font-bold">
                          ⚠️ هام: لا تشارك هذا الرمز الآمن مع أي شخص لحماية حسابك من الإتلاف.
                        </p>
                      </div>

                      {/* Google Footer */}
                      <div className="text-center pt-2 text-[8.5px] text-gray-400 border-t border-gray-50 font-sans">
                        © Google LLC, 1600 Amphitheatre Parkway, Mountain View, CA 94043
                      </div>
                    </div>
                  </div>
                </div>

                {/* Simulated Google Accounts Official Password Signin confirmation */}
                <div className="bg-[#1a1a1e] border border-neutral-800 rounded-xl p-4.5 space-y-3.5 text-right font-sans">
                  <div className="flex items-center justify-between border-b border-neutral-800/60 pb-2">
                    <div className="flex items-center gap-1.5">
                      <Shield className="w-4 h-4 text-blue-400" />
                      <span className="text-[11px] font-black text-blue-400">تحقق أمان Google المزدوج 🔐</span>
                    </div>
                    <span className="text-[9px] bg-blue-950 text-blue-300 border border-blue-900/40 px-2 py-0.5 rounded-full font-bold">بوابة Google الآمنة</span>
                  </div>

                  <p className="text-[10px] text-gray-400 leading-normal">
                    بشرط تأمين الهوية لنطاق Google لتفعيل بوابات العبور، يرجى كتابة كلمة مرور حساب Google الرسمي الخاص بك:
                  </p>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[10.5px] font-bold text-gray-300">كلمة مرور بريدك الإلكتروني Google:</label>
                      <button 
                        type="button"
                        onClick={() => setShowGooglePassword(!showGooglePassword)}
                        className="text-[9.5px] text-blue-400 hover:text-blue-300 font-bold transition-colors cursor-pointer"
                      >
                        {showGooglePassword ? 'إخفاء كلمة المرور 👁️' : 'عرض كلمة المرور 👁️'}
                      </button>
                    </div>
                    <input
                      type={showGooglePassword ? "text" : "password"}
                      required
                      value={googlePasswordInput}
                      onChange={(e) => setGooglePasswordInput(e.target.value)}
                      placeholder="أدخل كلمة مرور بريدك الإلكتروني لـ Google"
                      className="w-full bg-[#121214] border border-neutral-800 rounded-lg py-2 px-3 text-xs text-center text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500/50 font-mono"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-400">أدخل رمز الـ OTP المكون من 4 خانات:</label>
                  <input
                    type="text"
                    required
                    maxLength={4}
                    value={emailCodeInput}
                    onChange={(e) => setEmailCodeInput(e.target.value.replace(/\D/g, ''))}
                    placeholder="7729"
                    className="w-full bg-[#161619] border border-neutral-850 rounded-lg py-2.5 px-3 text-center text-sm font-black text-white focus:outline-none focus:ring-1 focus:ring-red-500/40 tracking-widest font-mono"
                  />
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    type="submit"
                    className="w-full bg-red-600 hover:bg-red-500 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>تحقق من البريد الإلكتروني والتأكيد ⚔️</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEmailCodeInput('7729');
                      setGooglePasswordInput('GooglePass@2026');
                      setSuccessMsg('⚡ تم حقن كود الـ OTP 7729 وكلمة مرور Google بنجاح! يرجى كبس زر التحقق للتأكيد.');
                      playCompleteSound();
                    }}
                    className="w-full py-1.5 px-3 bg-[#18181c] hover:bg-neutral-800 text-rose-400 border border-neutral-850 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                  >
                    حقن الحقول تلقائياً لتسهيل الاختبار ⚡
                  </button>

                  <button
                    type="button"
                    onClick={() => { setEmailVerificationPendingUser(null); setErrorMsg(''); }}
                    className="w-full text-center text-xs text-gray-500 hover:text-gray-400 transition-colors cursor-pointer pt-1"
                  >
                    إلغاء والعودة للرئيسية
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ------------------------ SECURE BANK TRANSFER PAYMENT PORTAL (1,000﷼) ------------------------ */}
          {paymentPendingUser && (
            <div className="max-w-md mx-auto w-full bg-[#111113] border border-red-900/30 p-6 sm:p-8 rounded-2xl shadow-3xl text-right animate-fade-in relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-red-500 animate-pulse"></div>

              <div className="flex items-center gap-3 mb-5 pb-3 border-b border-neutral-900">
                <div className="p-2.5 bg-red-950/50 text-red-500 rounded-lg">
                  <Coins className="w-5 h-5 animate-spin" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-100">بوابة التحويل المصرفي اليدوي</h3>
                  <p className="text-[10px] text-gray-500">مطلوب لتنشيط حساب: {paymentPendingUser.username}</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Visual pricing showcase as specified */}
                <div className="bg-red-950/10 border border-red-900/10 rounded-xl p-4 text-center space-y-1">
                  <span className="text-[10px] text-red-400 font-bold block">قيمة الترخيص والولوج ذو الدقيقة الأبدية</span>
                  {/* Explicit representation of the exact REQUIRED 1,000 Rial string. 1 Rial MUST NOT show. */}
                  <h2 className="text-2xl font-black text-rose-500 tracking-wider font-mono">
                    1,000 ريال سعودي 🇸🇦
                  </h2>
                  <span className="text-[9px] text-gray-500 block pt-1">(لا توجد بوابة دفع آلية - الدفع بموجب تحويل بنكي)</span>
                </div>

                {/* Instructions Box with IBAN */}
                <div className="p-3 bg-neutral-900 border border-neutral-850 rounded-lg text-[10.5px] leading-relaxed text-gray-300 space-y-1">
                  <div className="font-bold text-amber-500 flex items-center gap-1">🏦 معلومات الحساب المصرفي للتحويل:</div>
                  <div className="text-gray-400 font-mono bg-neutral-950 p-2 rounded text-center border border-neutral-900 select-all my-1.5">
                    <div>بنك الراجحي السعودي 🇸🇦</div>
                    <div className="text-white font-bold tracking-wider pt-0.5">SA93 8000 0000 1234 5678 9012</div>
                    <div className="text-[9.5px] text-gray-500">بإسم المشرف العام: عاصم سيف</div>
                  </div>
                  <p className="text-gray-500 text-[9.5px]">
                    يرجى تحويل مبلغ <span className="font-bold text-white">1,000﷼</span> إلى الحساب المصرفي أعلاه، ثم أرفق صورة البطاقة المستخدمة أو إيصال التحويل بالأسفل للمطابقة.
                  </p>
                </div>

                <form onSubmit={handleProcessBankTransfer} className="space-y-3.5">
                  {/* Bank Photo Upload Slot (صورة البطاقة المخصصة للدفع أو إيصال التحويل البنكي) */}
                  <div className="space-y-1.5 text-right">
                    <label className="text-[11px] font-bold text-gray-400 block mb-1">
                      📸 ترفيق لقطة شاشة البطاقة البنكية / إيصال التحويل:
                    </label>
                    
                    <div className="relative border border-dashed border-neutral-800 bg-[#161619] rounded-xl p-4 text-center hover:border-red-900/50 transition-all">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleReceiptUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      
                      {uploadedReceiptBase64 ? (
                        <div className="space-y-2">
                          {isPresetIcon(uploadedReceiptBase64) ? (
                            <div className="text-4xl py-2">{getPresetEmoji(uploadedReceiptBase64)}</div>
                          ) : (
                            <img
                              src={uploadedReceiptBase64}
                              alt="Receipt"
                              className="max-h-24 mx-auto rounded border border-neutral-800"
                            />
                          )}
                          <span className="text-[10px] text-emerald-400 font-bold block">✓ تم تحميل صورة البطاقة بنجاح!</span>
                        </div>
                      ) : (
                        <div className="space-y-1 text-gray-500">
                          <span className="text-xl block">📤</span>
                          <span className="text-[10.5px] block">اسحب ملف الصورة أو انقر للتصفح والتحميل</span>
                          <span className="text-[9.5px] text-gray-600">الحد الأقصى للملف: 2.5 ميجابايت</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* SMS Bank Verification Code OTP Input */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-[11px] font-bold text-gray-400">📲 رمز تأكيد سحب OTP بنك الراجحي المعتمد:</label>
                      <span className="text-[9.5px] text-amber-500 font-mono">الرمز للتجريب: 9945</span>
                    </div>
                    <input
                      type="text"
                      required
                      maxLength={4}
                      value={bankOTPInput}
                      onChange={(e) => setBankOTPInput(e.target.value.replace(/\D/g, ''))}
                      placeholder="9945"
                      className="w-full bg-[#161619] border border-neutral-850 rounded-lg py-2 px-3 text-center text-xs text-gray-250 focus:outline-none focus:ring-1 focus:ring-red-500/40 font-mono tracking-widest font-black"
                    />
                  </div>

                  {payError && (
                    <p className="text-[11px] text-red-400 font-bold bg-red-950/30 p-2.5 rounded border border-red-900/30">
                      {payError}
                    </p>
                  )}

                  <div className="pt-3 space-y-2.5">
                    <button
                      type="submit"
                      disabled={isPaying}
                      className="w-full bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold py-3 px-4 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none cursor-pointer border border-rose-500/30 flex items-center justify-center gap-1.5"
                    >
                      {isPaying ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                          <span>إرسال إثبات المعاملة للمراجعة...</span>
                        </>
                      ) : (
                        <span>تأكيد إرسال التحويل وصورة البطاقة للمدير 📤</span>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleSeedMockReceipt}
                      className="w-full py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 hover:text-amber-300 border border-amber-500/20 rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      تحميل بطاقة التحويل واختبار فوري للتحويل 📸
                    </button>

                    <button
                      type="button"
                      onClick={handleSkipPayment}
                      className="w-full bg-neutral-950 border border-neutral-900 hover:border-red-950/40 text-rose-400 hover:text-rose-300 text-xs font-bold py-2.5 px-4 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow"
                    >
                      <span>تخطي ودخول تجريبي مؤقت (دقيقة واحدة ⏳)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => { setPaymentPendingUser(null); setErrorMsg(''); }}
                      className="w-full text-center text-xs text-gray-500 hover:text-gray-400 transition-colors underline cursor-pointer pt-1"
                    >
                      إلغاء والعودة
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ------------------------ CORE PORTAL WORKSPACE (FOR LOGGED USERS) ------------------------ */}
          {currentUser && (
            <div className="space-y-6 animate-fade-in relative z-10">
              
              {/* Account Profile Status Header */}
              <div className="bg-[#111113] border border-neutral-900 rounded-2xl p-4.5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-950/30 border border-red-900/40 flex items-center justify-center text-red-400 font-bold text-sm">
                    {currentUser.role === 'admin' ? '👑' : '🔥'}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-gray-200">
                      مرحباً، {currentUser.username}!
                    </h3>
                    <p className="text-[10px] text-gray-500">
                      {currentUser.role === 'admin' 
                        ? 'أنت تمتلك صلاحيات "المدير العام المالي والأمني المطلق"' 
                        : 'عضو مسجل (مستفيد من صلاحية الترخيص الأبدي)'
                      }
                    </p>
                  </div>
                </div>

                {/* Countdown display for regular users showing the prank duration countdown */}
                {currentUser.role === 'regular' && (
                  <div className={`px-4 py-2.5 rounded-xl border flex items-center gap-2.5 ${
                    remainingTime < 20 
                      ? 'bg-rose-950/30 border-rose-800/40 text-rose-400 animate-pulse' 
                      : 'bg-[#18181c] border-neutral-850 text-gray-300'
                  }`}>
                    <Clock className="w-4 h-4 shrink-0 text-red-500 stroke-[2.5]" />
                    <div className="text-right">
                      <span className="text-[9px] text-gray-500 block leading-tight font-bold">صلاحية الأبدية:</span>
                      <span className="text-xs font-mono font-bold">
                        {remainingTime} ثانية متبقية ⏳
                      </span>
                    </div>
                  </div>
                )}

                {currentUser.role === 'admin' && (
                  <div className="bg-[#18181c] border border-neutral-850 text-emerald-400 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 self-center">
                    <Shield className="w-4 h-4" />
                    <span>المدة: لانهائية (مفتوح بالكامل للأبد)</span>
                  </div>
                )}
              </div>

              {/* Functional Switch Tabs */}
              <div className="bg-[#101012] border border-neutral-900 rounded-xl p-1 flex flex-wrap gap-1 md:flex-nowrap">
                <button
                  onClick={() => setActiveTab('careers')}
                  className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeTab === 'careers' ? 'bg-red-600 font-black text-white' : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>دليل وظائف المستقبل 🤖🛡️</span>
                </button>
                <button
                  onClick={() => setActiveTab('links')}
                  className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeTab === 'links' ? 'bg-red-600 font-black text-white' : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  <Link2 className="w-4 h-4" />
                  <span>روابط المغامرات ({scopedLinks.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('dishes')}
                  className={`flex-1 min-w-[100px] py-2.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeTab === 'dishes' ? 'bg-red-600 font-black text-white' : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  <Utensils className="w-4 h-4" />
                  <span>الأكلات المفضلة ({scopedDishes.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('photos')}
                  className={`flex-1 min-w-[100px] py-2.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeTab === 'photos' ? 'bg-red-600 font-black text-white' : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  <ImageIcon className="w-4 h-4" />
                  <span>الصور واللقطات ({scopedPhotos.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('support')}
                  className={`flex-1 min-w-[100px] py-2.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeTab === 'support' ? 'bg-[#9a3412] font-black text-white opacity-100' : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  <HelpCircle className="w-4 h-4 text-orange-400" />
                  <span>مراسلة الدعم 💬</span>
                </button>
                {currentUser.role === 'admin' && (
                  <button
                    onClick={() => setActiveTab('admin')}
                    className={`flex-1 min-w-[100px] py-2.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      activeTab === 'admin' ? 'bg-[#065f46] font-black text-white' : 'text-emerald-500/70 hover:text-emerald-400'
                    }`}
                  >
                    <Shield className="w-4 h-4" />
                    <span>لوحة المدير ({totalRegularCount})</span>
                  </button>
                )}
              </div>

              {/* ------------------------ TAB COLUMN 1: LINKS MANAGEMENT ------------------------ */}
              {activeTab === 'links' && (
                <div className="bg-[#0e0e10] border border-neutral-900 rounded-2xl p-6 shadow-xl border-neon-red space-y-6">
                  
                  {/* Link insertion Form block */}
                  <form onSubmit={handleAddLink} className="space-y-4">
                    <span className="text-xs font-bold text-gray-400 flex items-center gap-1">
                      <Plus className="w-3.5 h-3.5 text-red-500" />
                      إضافة رابط ذكي جديد للمغامرة:
                    </span>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <input
                          type="text"
                          required
                          value={inputUrl}
                          onChange={(e) => setInputUrl(e.target.value)}
                          placeholder="رابط الإنترنت مثلاً: https://epic.ai"
                          className="w-full bg-[#141417] border border-neutral-800 rounded-xl py-2.5 px-3.5 text-xs text-gray-200 focus:outline-none focus:ring-1 focus:ring-red-500 placeholder:text-gray-600 font-mono text-left"
                          dir="ltr"
                        />
                      </div>
                      <div className="space-y-1">
                        <input
                          type="text"
                          value={inputUrlName}
                          onChange={(e) => setInputUrlName(e.target.value)}
                          placeholder="عنوان أو وصف تعريفي مخصص لسهولة الحفظ..."
                          className="w-full bg-[#141417] border border-neutral-800 rounded-xl py-2.5 px-3.5 text-xs text-gray-200 focus:outline-none focus:ring-1 focus:ring-red-500 placeholder:text-gray-600"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-red-600 hover:bg-red-500 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>حفظ وإيداع الرابط بالبوابة</span>
                    </button>
                  </form>

                  {/* Registered Links List outputs */}
                  <div className="space-y-3.5">
                    <div className="flex justify-between items-center pb-2 border-b border-neutral-900">
                      <h4 className="text-xs font-bold text-gray-400">روابطك التفاعلية الحالية:</h4>
                      <span className="text-[10px] font-mono text-gray-500">مكتمل: {scopedLinks.filter(l => l.isCompleted).length} من {scopedLinks.length}</span>
                    </div>

                    {scopedLinks.length === 0 ? (
                      <div className="text-center py-8 text-gray-600 space-y-2 select-none">
                        <p className="text-xs">لا توجد أي روابط مغامرات مضافة حتى الآن.</p>
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                        {scopedLinks.map((link) => (
                          <div
                            key={link.id}
                            onClick={() => handleToggleLinkComplete(link.id)}
                            className={`group p-3 sm:p-3.5 border rounded-xl transition-all duration-300 cursor-pointer flex items-center justify-between gap-3 ${
                              link.isCompleted 
                                ? 'bg-neutral-950/40 border-emerald-950/40 opacity-80' 
                                : 'bg-[#121214] border-neutral-850 hover:border-red-950/50'
                            }`}
                          >
                            <div className="flex-1 min-w-0 space-y-1">
                              <div className="flex items-center gap-2">
                                <CheckCircle className={`w-4 h-4 shrink-0 transition-all ${
                                  link.isCompleted ? 'text-emerald-500 stroke-[2.5]' : 'text-gray-650'
                                }`} />
                                <span className={`text-xs font-bold truncate block ${
                                  link.isCompleted ? 'text-gray-500 line-through' : 'text-gray-200'
                                }`}>
                                  {link.name}
                                </span>
                              </div>

                              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 pt-0.5">
                                <a
                                  href={link.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="text-red-400 hover:underline text-[11px] font-mono flex items-center gap-1 truncate max-w-xs"
                                >
                                  <span>{getShortUrlString(link.url)}</span>
                                  <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                                </a>

                                {/* "هل انتهيت من المغامرة؟" core text with toggle indicator */}
                                <div className={`transition-all flex items-center gap-1.5 ${
                                  link.isCompleted ? 'text-emerald-500' : 'text-gray-500'
                                }`}>
                                  <span className="hidden sm:inline text-gray-700 font-mono">•</span>
                                  <span className="text-[10px] font-medium leading-none">
                                    هل انتهيت من المغامرة؟
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Options block */}
                            <div className="flex items-center gap-2">
                              {link.isCompleted ? (
                                <span className="text-[9px] bg-emerald-950/60 border border-emerald-900/40 text-emerald-400 font-bold px-2 py-0.5 rounded">
                                  مكتملة
                                </span>
                              ) : (
                                <span className="text-[9px] bg-neutral-900 border border-neutral-800 text-gray-500 font-bold px-2 py-0.5 rounded">
                                  تم
                                </span>
                              )}
                              <button
                                onClick={(e) => { e.stopPropagation(); handleDeleteLink(link.id); }}
                                className="p-1.5 hover:text-red-400 text-gray-700 hover:bg-neutral-900 rounded-lg transition-all"
                                title="حذف"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ------------------------ TAB COLUMN 2: FAVORITE FOODS MANAGEMENT ------------------------ */}
              {activeTab === 'dishes' && (
                <div className="bg-[#0e0e10] border border-neutral-900 rounded-2xl p-6 shadow-xl border-neon-red space-y-6">
                  
                  {/* Preset Selector Carousel */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-gray-400 block">انقر لإضافة أكلة سريعة ومشهورة:</span>
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none snap-x mask-gradient">
                      {[
                        { name: 'كبسة سعودية 🇸🇦', icon: '🍛' },
                        { name: 'شاورما لحم غنم 🌯', icon: '🌯' },
                        { name: 'منسف لحم بلدي 🍚', icon: '🍲' },
                        { name: 'ورق عنب حامض 🍋', icon: '🥗' },
                        { name: 'بيتزا إيطالية رقيقة 🍕', icon: '🍕' },
                        { name: 'كنافة مغطاة بالفستق 🍮', icon: '🍮' }
                      ].map((preset) => (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => selectPresetDish(preset.name, preset.icon)}
                          className="shrink-0 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 rounded-xl p-2.5 text-right transition-all w-[115px] flex flex-col justify-between space-y-2 cursor-pointer border-neon-red-slight"
                        >
                          <span className="text-xl">{preset.icon}</span>
                          <span className="text-[10px] font-bold text-gray-200 block truncate">{preset.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Manual Creation Form */}
                  <form onSubmit={handleAddDish} className="bg-[#121214] border border-neutral-900 p-4 rounded-xl space-y-3.5">
                    <span className="text-xs font-bold text-rose-400 block pb-1 border-b border-rose-950/20">تخصيص أكلة مفضلة جديدة:</span>
                    
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400">اسم الوجبة المفضلة:</label>
                      <input
                        type="text"
                        required
                        value={inputDish}
                        onChange={(e) => setInputDish(e.target.value)}
                        placeholder="مثال: مضغوط لحم، جريش، مظبي..."
                        className="w-full bg-[#161619] border border-neutral-850 rounded-lg py-2 px-3 text-xs text-gray-200 focus:outline-none focus:ring-1 focus:ring-red-500/40"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400">تحميل ملف صورة محلي:</label>
                        <label className="flex items-center justify-center gap-2 bg-[#161619] hover:bg-neutral-800 border border-neutral-850 rounded-lg py-2 px-3 text-xs text-gray-300 font-bold cursor-pointer transition-all">
                          <span>📁 {inputDishImage ? "تم تحميل الصورة ✓" : "اختر ملفاً"}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleDeviceImageUpload(e, false)}
                            className="hidden"
                          />
                        </label>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400">أو ضع رابط صورة إنترنت مخصص:</label>
                        <input
                          type="text"
                          value={isPresetIcon(inputDishImage) ? '' : inputDishImage}
                          onChange={(e) => setInputDishImage(e.target.value)}
                          placeholder="https://example.com/food.jpg"
                          className="w-full bg-[#161619] border border-neutral-850 rounded-lg py-2 px-3 text-xs text-gray-200 focus:outline-none focus:ring-1 focus:ring-red-500/40 text-left"
                          dir="ltr"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2 bg-red-650 hover:bg-red-550 text-white text-xs font-bold rounded-lg transition-all border border-red-500/30 cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>💾</span>
                      <span>إضافة وتخليد الوجبة المعرّفة بالقائمة</span>
                    </button>
                  </form>

                  {/* Foods Render list */}
                  <div className="space-y-3">
                    <span className="text-xs font-bold text-gray-400 block">الوجبات الحالية المخزنة بحسابك:</span>

                    {scopedDishes.length === 0 ? (
                      <div className="bg-[#121214] border border-neutral-850 rounded-xl p-6 text-center space-y-2">
                        <span className="text-xl">🍲</span>
                        <span className="text-[11px] text-gray-500 block">لا يوجد وجبات مفضلة مسجلة.</span>
                        {/* Custom requirement dot representation "وتحت مكتوب …………………." */}
                        <span className="text-xs font-mono text-gray-600 block tracking-widest leading-none">
                          أكلتك المفضلة: …………………...
                        </span>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-[350px] overflow-y-auto pr-1">
                        {scopedDishes.map((dish) => (
                          <div 
                            key={dish.id}
                            className="bg-[#121214] border border-neutral-850 hover:border-red-950/40 p-3 rounded-xl flex items-center justify-between gap-3 relative group transition-all"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-12 h-12 rounded-lg bg-neutral-950 border border-neutral-850 flex items-center justify-center overflow-hidden shrink-0 shadow">
                                {isPresetIcon(dish.image) ? (
                                  <span className="text-2xl">{getPresetEmoji(dish.image)}</span>
                                ) : (
                                  <img
                                    src={dish.image}
                                    alt={dish.name}
                                    referrerPolicy="no-referrer"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                  />
                                )}
                              </div>

                              <div className="min-w-0">
                                <h4 className="text-xs font-bold text-gray-200 truncate leading-none mb-1.5">{dish.name}</h4>
                                {/* Custom dots subtitle formatted for pristine look inside card */}
                                <span className="text-[9px] font-mono text-gray-600 block tracking-widest leading-none">
                                  أكلتي المفضلة: …………………...
                                </span>
                              </div>
                            </div>

                            <button
                              onClick={() => handleDeleteDish(dish.id)}
                              className="p-1.5 hover:text-red-400 text-gray-700 bg-neutral-900 border border-neutral-860 rounded-lg hover:bg-neutral-950 transition-all opacity-80 group-hover:opacity-100"
                              title="إزالة الوجبة"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ------------------------ TAB COLUMN 3: FAVORITE PICTURES MANAGEMENT ------------------------ */}
              {activeTab === 'photos' && (
                <div className="bg-[#0e0e10] border border-neutral-900 rounded-2xl p-6 shadow-xl border-neon-red space-y-6">
                  
                  {/* Quick Preset Scene click to populate */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-gray-400 block">اختر خلفية أو لقطة سريعة جاهزة:</span>
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none snap-x mask-gradient">
                      {[
                        { title: 'نجوم مضيئة 🌌', icon: '🌌' },
                        { title: 'صحراء شاسعة 🏜️', icon: '🏜️' },
                        { title: 'فضاء رقمي 🛸', icon: '🛸' },
                        { title: 'بحر كوني 🌊', icon: '🌊' }
                      ].map((item) => (
                        <button
                          key={item.title}
                          type="button"
                          onClick={() => selectPresetPhoto(item.title, item.icon)}
                          className="shrink-0 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 rounded-xl p-2.5 text-right transition-all w-[100px] flex flex-col items-center justify-center space-y-1 cursor-pointer"
                        >
                          <span className="text-xl">{item.icon}</span>
                          <span className="text-[9px] font-bold text-gray-300 block truncate w-full text-center">{item.title}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Manual Upload and adding photo card */}
                  <form onSubmit={handleAddPhoto} className="bg-[#121214] border border-neutral-900 p-4 rounded-xl space-y-3.5">
                    <span className="text-xs font-bold text-rose-400 block pb-1 border-b border-rose-950/20">إدراج صورة ولقطة مفضلة مخصصة:</span>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400">اسم أو عنوان لقطة الصورة المفضلة:</label>
                      <input
                        type="text"
                        required
                        value={inputPhotoTitle}
                        onChange={(e) => setInputPhotoTitle(e.target.value)}
                        placeholder="مثال: لقطة الغروب، خلفية التحدي، فوز المغامرة..."
                        className="w-full bg-[#161619] border border-neutral-850 rounded-lg py-2 px-3 text-xs text-gray-200 focus:outline-none focus:ring-1 focus:ring-red-500/40"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400">تحميل ملف صورة محلية:</label>
                        <label className="flex items-center justify-center gap-2 bg-[#161619] hover:bg-neutral-800 border border-neutral-850 rounded-lg py-2 px-3 text-xs text-gray-300 font-bold cursor-pointer transition-all">
                          <span>📁 {inputPhotoUrl ? "تم تحميل صورتك ✓" : "اختر ملفاً"}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleDeviceImageUpload(e, true)}
                            className="hidden"
                          />
                        </label>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400">أو ضع رابط صورة إنترنت للقطة:</label>
                        <input
                          type="text"
                          value={isPresetIcon(inputPhotoUrl) ? '' : inputPhotoUrl}
                          onChange={(e) => setInputPhotoUrl(e.target.value)}
                          placeholder="https://example.com/banner.png"
                          className="w-full bg-[#161619] border border-neutral-850 rounded-lg py-2 px-3 text-xs text-gray-200 focus:outline-none focus:ring-1 focus:ring-red-500/40 text-left"
                          dir="ltr"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2 bg-red-650 hover:bg-red-550 text-white text-xs font-bold rounded-lg transition-all border border-red-500/30 cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>🖼️</span>
                      <span>تثبيت اللقطة ومعرض الصور للحساب</span>
                    </button>
                  </form>

                  {/* Photo representation section */}
                  <div className="space-y-3">
                    <span className="text-xs font-bold text-gray-400 block">لقطاتك وسجلك التفاعلي المصور:</span>

                    {scopedPhotos.length === 0 ? (
                      <div className="bg-[#121214] border border-neutral-850 rounded-xl p-6 text-center text-gray-500 text-xs">
                        لا يوجد صور مسجلة حتى الآن.
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[380px] overflow-y-auto pr-1">
                        {scopedPhotos.map((p) => (
                          <div 
                            key={p.id}
                            className="bg-[#121214] border border-neutral-850 hover:border-red-550/30 p-2.5 rounded-xl block space-y-2 relative group transition-all"
                          >
                            <div className="aspect-video w-full rounded-lg bg-neutral-950 border border-neutral-900 flex items-center justify-center overflow-hidden shrink-0 shadow relative">
                              {isPresetIcon(p.url) ? (
                                <span className="text-3xl select-none">{getPresetEmoji(p.url)}</span>
                              ) : (
                                <img
                                  src={p.url}
                                  alt={p.title}
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                  }}
                                />
                              )}
                            </div>

                            <div className="flex items-center justify-between gap-1 min-w-0">
                              <span className="text-[10px] font-bold text-gray-300 truncate block leading-none">{p.title}</span>
                              <button
                                onClick={() => handleDeletePhoto(p.id)}
                                className="text-gray-600 hover:text-red-400 rounded transition-colors self-center p-0.5"
                                title="حذف"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ------------------------ TAB COLUMN 5: SUPPORT TICKETS WORKSPACE ------------------------ */}
              {activeTab === 'support' && (
                <div className="bg-[#0e0e10] border border-neutral-900 rounded-2xl p-6 shadow-xl border-neon-red space-y-6 text-right animate-fade-in">
                  <div className="bg-gradient-to-r from-orange-950/25 via-neutral-900/60 to-orange-950/25 border border-orange-900/30 p-4.5 rounded-xl">
                    <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                      <HelpCircle className="w-4.5 h-4.5 text-orange-400" />
                      <span>مركز مساندة المغامرين والاتصال بالمدير عاصم 💬</span>
                    </h3>
                    <p className="text-[11px] text-gray-400 mt-1 leading-normal">
                      هل واجهتك مشكلة في تفعيل الأبدية اللانهائية أو نقل الـ 1,000﷼؟ راسل المدير بشكل فوري وسيتلقى طلبك في لوحة تحكمه الخاصة للرد والتقصي.
                    </p>
                  </div>

                  <form onSubmit={handleSendSupportTicket} className="bg-[#121214] border border-neutral-900 p-4 rounded-xl space-y-3.5">
                    <span className="text-xs font-bold text-orange-400 block pb-1 border-b border-orange-950/20">تذكرة مساندة جديدة:</span>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400">موضوع الطلب:</label>
                      <input
                        type="text"
                        required
                        value={supportSubject}
                        onChange={(e) => setSupportSubject(e.target.value)}
                        placeholder="مثال: استفسار عن التحويل البنكي، طلب تفعيل يدوي..."
                        className="w-full bg-[#161619] border border-neutral-850 rounded-lg py-2 px-3 text-xs text-gray-200 focus:outline-none focus:ring-1 focus:ring-orange-500/40 font-medium"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400">تفاصيل الرسالة أو المشكلة التقنية:</label>
                      <textarea
                        required
                        rows={3}
                        value={supportBody}
                        onChange={(e) => setSupportBody(e.target.value)}
                        placeholder="اكتب تفاصيل استفسارك كاملاً هنا..."
                        className="w-full bg-[#161619] border border-neutral-850 rounded-lg py-2 px-3 text-xs text-gray-200 focus:outline-none focus:ring-1 focus:ring-orange-500/40 font-medium"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2 bg-orange-700 hover:bg-orange-600 border border-orange-500/30 text-white text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>💬 إرسال تذكرة الدعم للمدير</span>
                    </button>
                  </form>

                  <div className="space-y-3">
                    <span className="text-xs font-bold text-gray-400 block">سجل طلباتك ورصيد الردود:</span>

                    {supportTickets.filter(t => t.userId === currentUser.id).length === 0 ? (
                      <div className="bg-[#121214] border border-neutral-850 rounded-xl p-5 text-center text-gray-500 text-xs text-right">
                        لا يوجد تذاكر مساندة موجهة بحسابك حالياً.
                      </div>
                    ) : (
                      <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1 text-right">
                        {supportTickets.filter(t => t.userId === currentUser.id).map((t) => (
                          <div key={t.id} className="bg-[#121214] border border-neutral-850 p-3.5 rounded-xl space-y-2.5">
                            <div className="flex justify-between items-start">
                              <span className="text-xs font-black text-gray-200">{t.subject}</span>
                              <span className="text-[9px] text-gray-500 font-mono">{t.createdAt}</span>
                            </div>
                            <p className="text-[11px] text-gray-400 leading-relaxed bg-neutral-950 p-2.5 rounded border border-neutral-900">{t.message}</p>
                            
                            {t.replyText ? (
                              <div className="p-2.5 bg-emerald-950/20 border border-emerald-900/40 rounded-lg space-y-1 text-right leading-normal">
                                <span className="text-[10px] font-bold text-emerald-400 block flex items-center gap-1">
                                  💬 رد الدعم الفني من المدير عاصم سيف:
                                </span>
                                <p className="text-xs text-emerald-200 font-medium">{t.replyText}</p>
                              </div>
                            ) : (
                              <span className="text-[10px] text-amber-500 font-bold block">⌛ بانتظار الرد واعتماد الإجراء من قبل المشرف عاصم...</span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ------------------------ TAB COLUMN 4: INTERACTIVE CAREER EXPLORATION HUB ------------------------ */}
              {activeTab === 'careers' && (
                <div className="bg-[#0c0c0e] border border-neutral-900 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-6 text-right">
                  
                  {/* Title banner */}
                  <div className="bg-gradient-to-r from-red-950/25 via-neutral-900/60 to-red-950/25 border border-red-900/30 p-5 rounded-xl flex items-center justify-between gap-4 flex-col sm:flex-row">
                    <div className="space-y-1">
                      <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
                        <span>منصة مسارات المستقبل المهنية 🚀🤖</span>
                      </h3>
                      <p className="text-xs text-gray-400">
                        اكتشف أقوى وظائف وتخصصات الأمن السيبراني والذكاء الاصطناعي وكيف تبدأ فيها من الصفر!
                      </p>
                    </div>
                    <span className="text-[10px] bg-red-950/60 border border-red-500/30 text-rose-400 font-bold px-3 py-1 rounded-full font-sans">
                      تخصُّصات مرجعية معتمدة 📜
                    </span>
                  </div>

                  {/* Filter and Search Bar */}
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                      
                      {/* Search Input */}
                      <div className="md:col-span-5 relative">
                        <input
                          type="text"
                          value={careerSearch}
                          onChange={(e) => setCareerSearch(e.target.value)}
                          placeholder="ابحث عن مسمى وظيفي أو مهارة أو أداة..."
                          className="w-full bg-[#121214] border border-neutral-850 rounded-lg py-2.5 px-3.5 pr-3 text-xs text-gray-200 focus:outline-none focus:ring-1 focus:ring-red-500/40 placeholder:text-gray-600"
                        />
                      </div>

                      {/* Career Group Filters */}
                      <div className="md:col-span-7 flex flex-wrap gap-1.5 items-center justify-start">
                        <button
                          onClick={() => { setCareerCategory('all'); setSelectedCareerId('soc-analyst-1'); }}
                          className={`py-2 px-3 text-[11px] font-bold rounded-lg border transition-all cursor-pointer ${
                            careerCategory === 'all' 
                              ? 'bg-red-950/40 border-red-500/40 text-rose-400' 
                              : 'bg-[#121214] border-neutral-850 text-gray-400 hover:text-gray-200'
                          }`}
                        >
                          الجميع ({careersList.length})
                        </button>
                        <button
                          onClick={() => { setCareerCategory('cyber'); setSelectedCareerId('soc-analyst-1'); }}
                          className={`py-2 px-3 text-[11px] font-bold rounded-lg border transition-all cursor-pointer ${
                            careerCategory === 'cyber' 
                              ? 'bg-red-950/40 border-red-500/40 text-rose-400' 
                              : 'bg-[#121214] border-neutral-850 text-gray-400 hover:text-gray-200'
                          }`}
                        >
                          🛡️ الأمن السيبراني ({careersList.filter(c => c.category === 'cyber').length})
                        </button>
                        <button
                          onClick={() => { setCareerCategory('ai'); setSelectedCareerId('data-analyst'); }}
                          className={`py-2 px-3 text-[11px] font-bold rounded-lg border transition-all cursor-pointer ${
                            careerCategory === 'ai' 
                              ? 'bg-red-950/40 border-red-500/40 text-rose-400' 
                              : 'bg-[#121214] border-neutral-850 text-gray-400 hover:text-gray-200'
                          }`}
                        >
                          🤖 الذكاء الاصطناعي ({careersList.filter(c => c.category === 'ai').length})
                        </button>
                        <button
                          onClick={() => { setCareerCategory('both'); setSelectedCareerId('ai-security-eng'); }}
                          className={`py-2 px-3 text-[11px] font-bold rounded-lg border transition-all cursor-pointer ${
                            careerCategory === 'both' 
                              ? 'bg-red-950/40 border-red-500/40 text-rose-400' 
                              : 'bg-[#121214] border-neutral-850 text-gray-400 hover:text-gray-200'
                          }`}
                        >
                          🔥 دمج الاثنين معاً ({careersList.filter(c => c.category === 'both').length})
                        </button>
                        <button
                          onClick={() => { setCareerCategory('high-salary'); setSelectedCareerId('security-architect'); }}
                          className={`py-2 px-3 text-[11px] font-bold rounded-lg border transition-all cursor-pointer ${
                            careerCategory === 'high-salary' 
                              ? 'bg-yellow-950/40 border-yellow-500/40 text-yellow-500' 
                              : 'bg-[#121214] border-neutral-850 text-gray-400 hover:text-yellow-500/80'
                          }`}
                        >
                          💰 الأعلى راتباً
                        </button>
                      </div>

                    </div>
                  </div>

                  {/* Core layout grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                    
                    {/* LIST COLUMN (Right side on desktop) */}
                    <div className="lg:col-span-5 space-y-2.5 max-h-[550px] overflow-y-auto pr-1">
                      <span className="text-[11px] font-bold text-gray-500 block pb-1">اختر التخصص لقراءة تفاصيله:</span>

                      {careersList
                        .filter(c => {
                          const matchesSearch = c.title.toLowerCase().includes(careerSearch.toLowerCase()) || 
                                                c.titleAr.toLowerCase().includes(careerSearch.toLowerCase()) || 
                                                c.desc.toLowerCase().includes(careerSearch.toLowerCase());
                          if (careerCategory === 'all') return matchesSearch;
                          if (careerCategory === 'high-salary') return c.isHighSalary && matchesSearch;
                          return c.category === careerCategory && matchesSearch;
                        })
                        .map((c) => {
                          const isSelected = selectedCareerId === c.id;
                          return (
                            <button
                              key={c.id}
                              onClick={() => setSelectedCareerId(c.id)}
                              className={`w-full text-right p-3 rounded-xl border transition-all cursor-pointer flex flex-col gap-1.5 ${
                                isSelected 
                                  ? 'bg-red-950/30 border-red-500/60 shadow-[0_0_15px_rgba(239,68,68,0.15)]' 
                                  : 'bg-[#121214] border-neutral-850 hover:bg-[#161619] hover:border-neutral-800'
                              }`}
                            >
                              <div className="flex items-center justify-between w-full">
                                <h4 className="text-xs font-bold text-gray-200 leading-none">{c.titleAr}</h4>
                                <span className="text-[10px] font-mono text-gray-500 bg-neutral-900 border border-neutral-800 px-1.5 py-0.5 rounded leading-none">
                                  {c.title}
                                </span>
                              </div>
                              
                              <p className="text-[11px] text-gray-400 line-clamp-1 leading-tight">
                                {c.desc}
                              </p>

                              <div className="flex items-center justify-between w-full pt-1 border-t border-neutral-900/40 mt-1">
                                <div className="flex gap-1.5">
                                  {c.level === 'beginner' && <span className="text-[9px] bg-emerald-950/50 text-emerald-400 px-1.5 py-0.5 rounded">مبتدئ 🔰</span>}
                                  {c.level === 'intermediate' && <span className="text-[9px] bg-[#1a1205] text-[#e0a96d] px-1.5 py-0.5 rounded">متوسط ⚔️</span>}
                                  {c.level === 'advanced' && <span className="text-[9px] bg-red-950/60 text-red-400 px-1.5 py-0.5 rounded">متقدم 🧠</span>}
                                  {c.level === 'senior' && <span className="text-[9px] bg-[#051610] text-[#0ea5e9] px-1.5 py-0.5 rounded">احترافي مستقبلي 🚀</span>}
                                  
                                  {c.category === 'cyber' && <span className="text-[9px] bg-blue-950/30 text-blue-400 px-1.5 py-0.5 rounded">أمن 🛡️</span>}
                                  {c.category === 'ai' && <span className="text-[9px] bg-purple-950/30 text-purple-400 px-1.5 py-0.5 rounded">ذكاء 🤖</span>}
                                  {c.category === 'both' && <span className="text-[9px] bg-rose-950/50 text-rose-400 px-1.5 py-0.5 rounded">دمج 🔥</span>}
                                </div>
                                
                                {c.isHighSalary && (
                                  <span className="text-[9px] text-amber-400 font-bold flex items-center gap-0.5 animate-pulse">
                                    💰 راتب عالي جداً
                                  </span>
                                )}
                              </div>
                            </button>
                          );
                        })}
                    </div>

                    {/* DETAIL COLUMN (Left side on desktop) */}
                    <div className="lg:col-span-7 bg-[#0e0e11] border border-neutral-850 p-5 rounded-xl flex flex-col justify-between space-y-6">
                      
                      {selectedCareerId ? (() => {
                        const c = careersList.find(item => item.id === selectedCareerId);
                        if (!c) return <div className="text-xs text-gray-500 text-center py-10">الرجاء تحديد تخصص من القائمة الجانبية.</div>;
                        
                        return (
                          <div className="space-y-5 animate-fade-in text-right">
                            
                            {/* Card Header details */}
                            <div className="pb-4 border-b border-neutral-900 space-y-2">
                              <div className="flex items-center justify-between flex-wrap gap-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-xl">
                                    {c.category === 'cyber' ? '🛡️' : c.category === 'ai' ? '🤖' : '🔥'}
                                  </span>
                                  <h3 className="text-sm font-black text-white">{c.titleAr}</h3>
                                </div>
                                <span className="text-xs font-mono text-gray-400 bg-neutral-950 border border-neutral-850 px-2 py-0.5 rounded">
                                  {c.title}
                                </span>
                              </div>

                              <p className="text-xs text-rose-400/90 leading-relaxed font-sans mt-1">
                                {c.desc}
                              </p>
                              
                              <div className="flex gap-2 pt-2.5">
                                <span className="text-[10px] bg-neutral-900 text-gray-400 px-2 py-1 rounded border border-neutral-850">
                                  المستوى البرمجي: <span className="text-red-400 font-bold">{c.level === 'beginner' ? 'مبتدئ لا يتطلب خبرة' : c.level === 'intermediate' ? 'خبرة متوسطة وقدرة كافية' : 'متقدم يتطلب خبرة عميقة'}</span>
                                </span>
                                {c.isHighSalary && (
                                  <span className="text-[10px] bg-yellow-950/60 text-yellow-400 border border-yellow-800/40 px-2.5 py-1 rounded font-bold">
                                    💰 صنف أجور مرتفع جداً بالبنوك والشركات
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* ----------------- SOC ANALYST LEVEL 1 DEEP VIEW ----------------- */}
                            {c.id === 'soc-analyst-1' && (
                              <div className="space-y-4">
                                <div className="p-3 bg-red-950/10 border border-red-900/20 rounded-lg space-y-2">
                                  <h4 className="text-xs font-black text-gray-300">👥 طبيعة دورك كحارس أمن رقمي (SOC Analyst)</h4>
                                  <p className="text-[11px] text-gray-400 leading-relaxed">
                                    شغلتك وعملك الأساسي داخل الجهة الحكومية أو البنك هي بمثابة "حارس حماية ومراقب رقمي" يجلس أمام شاشات الدفاع 24 ساعة في الأسبوع، يراقب تدفق الحزم والترافيك والـ Logs للإمساك بأية محاولة ولوج مشبوهة وعمل فلترة للأحداث قبل تمدد الخطر.
                                  </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  
                                  <div className="space-y-2 bg-[#121214] p-3 rounded-lg border border-neutral-850">
                                    <h4 className="text-xs font-bold text-gray-200">🛡️ وش تسوي يومياً بالوظيفة؟</h4>
                                    <ul className="text-[10.5px] text-gray-400 space-y-1.5 pr-2 list-disc">
                                      <li>متابعة تنبيهات الأمن الآنية ومستوى الـ Alerts</li>
                                      <li>تشريح ومراجعة سجلات دخول المستخدمين Logs</li>
                                      <li>اتخاذ قرار فوري إذا كانت المحاولة هجوم أم ولوج طبيعي</li>
                                      <li>تصنيف خطورة الفيروس وإبلاغ المستشارين وقادة النظام</li>
                                    </ul>
                                  </div>

                                  <div className="space-y-2 bg-[#121214] p-3 rounded-lg border border-neutral-850">
                                    <h4 className="text-xs font-bold text-gray-200">🧰 الأدوات الأساسية بيدك</h4>
                                    <ul className="text-[10.5px] text-gray-400 space-y-1.5 pr-2 list-disc">
                                      <li className="font-mono">Splunk SIEM / Microsoft Sentinel</li>
                                      <li className="font-mono">Firewall logs dashboard</li>
                                      <li className="font-mono">TrendMicro / McAfee Antivirus</li>
                                      <li className="font-mono">Linux Logs Viewer</li>
                                    </ul>
                                  </div>

                                </div>

                                {/* Practical Simulation */}
                                <div className="p-3 bg-neutral-950 border border-rose-900/40 rounded-lg space-y-2">
                                  <div className="flex items-center gap-1.5 text-red-400">
                                    <AlertTriangle className="w-3.5 h-3.5 animate-pulse" />
                                    <span className="text-xs font-black">📊 زاوية المحاكاة الواقعية (تطبيق حقيقي):</span>
                                  </div>
                                  <p className="text-[11px] text-gray-300 leading-relaxed">
                                    تخيل بنكاً كبيراً: يضرب النظام جرس تنبيه عالي لأن عنوان IP كندي يحاول تسجيل الدخول لحساب سعودي آلاف المرات بالدقيقة. دورك كـ <span className="text-red-400 font-bold">SOC L1</span> هو فحص الـ IP، فلكرة الحدث، وتدشين قرار البلوك الفوري لحماية حسابات المواطنين!
                                  </p>
                                  <div className="bg-[#0b0b0d] p-2 rounded-md font-mono text-[9px] text-emerald-400 border border-neutral-900 text-left" dir="ltr">
                                    [ALARM]: SQL Injection detected from 198.51.100.42 <br />
                                    [ATTEMPTS]: 4500 failed logins in 12 seconds! <br />
                                    [DECISION]: BAN IP immediately + Route to Level 2.
                                  </div>
                                </div>

                                <div className="bg-[#121214] p-3 rounded-lg border border-neutral-850 grid grid-cols-2 gap-2 text-center text-[11px]">
                                  <div className="bg-neutral-900 p-2 rounded">
                                    <span className="text-gray-500 block">الشهادة المقترحة:</span>
                                    <span className="text-rose-400 font-bold font-mono">CompTIA Security+</span>
                                  </div>
                                  <div className="bg-neutral-900 p-2 rounded">
                                    <span className="text-gray-500 block">الراتب المتوقع:</span>
                                    <span className="text-emerald-400 font-bold">متوسط 💵 عالي جداً بالخبرة</span>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* ----------------- NETWORK SECURITY ENGINEER DEEP VIEW ----------------- */}
                            {c.id === 'network-security-eng' && (
                              <div className="space-y-4">
                                <div className="p-3 bg-red-950/10 border border-red-900/20 rounded-lg space-y-2">
                                  <h4 className="text-xs font-black text-gray-300">🧱 شبكة مؤمنة خلف أسوارك (Network Security)</h4>
                                  <p className="text-[11px] text-gray-400 leading-relaxed">
                                    مسؤوليتك تنص على أن تكون أنت "الدرع وحافر الخنادق الأول" الذي يؤمن حركة دخول وخروج ترافيك الإنترنت من وإلى الشركة بالكامل. تقوم ببناء الحصون وحظر المواقع لتتجنب دخول أي برمجيات فدية أو هكر غير مرخص.
                                  </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  
                                  <div className="space-y-2 bg-[#121214] p-3 rounded-lg border border-neutral-850">
                                    <h4 className="text-xs font-bold text-gray-200">🧱 وش تسوي يومياً بالوظيفة؟</h4>
                                    <ul className="text-[10.5px] text-gray-400 space-y-1.5 pr-2 list-disc">
                                      <li>إعداد وتوليف جدار الحماية (Cisco / Palo Alto)</li>
                                      <li>إعداد الممرات الآمنة وشبكات VPN الآمنة للموظفين</li>
                                      <li>كشف وإيقاف حركة ترافيك هجمات حجب الخدمة DDoS</li>
                                      <li>تصميم هيكلة تقسيم الخوادم الفرعية للسلامة الكلية</li>
                                    </ul>
                                  </div>

                                  <div className="space-y-2 bg-[#121214] p-3 rounded-lg border border-neutral-850">
                                    <h4 className="text-xs font-bold text-gray-200">🔧 الأدوات المرافقة بيدك</h4>
                                    <ul className="text-[10.5px] text-gray-400 space-y-1.5 pr-2 list-disc">
                                      <li className="font-mono">Wireshark (تحليل الحزم والبروتوكول)</li>
                                      <li className="font-mono">Palo Alto Firewalls / Fortinet</li>
                                      <li className="font-mono">IDS / IPS Intrusion prevention</li>
                                      <li className="font-mono">CISCO Router configurations</li>
                                    </ul>
                                  </div>

                                </div>

                                {/* Symmetrical Side-by-Side Comparison Sourced from Arabic Manual */}
                                <div className="bg-[#121214] p-3 rounded-xl border border-neutral-850 space-y-2">
                                  <span className="text-xs font-bold text-gray-200 block">📊 جدول المقارنة الفائق والمصادق:</span>
                                  <div className="overflow-x-auto">
                                    <table className="w-full text-[10.5px] text-right border-collapse">
                                      <thead>
                                        <tr className="border-b border-neutral-800 text-gray-400 bg-neutral-900/60 font-bold">
                                          <th className="p-1 px-2">الفارق المحوري</th>
                                          <th className="p-1 px-2 text-rose-400">مراقب SOC L1 🔍</th>
                                          <th className="p-1 px-2 text-emerald-400">مهندس أمن شبكات 🧱</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr className="border-b border-neutral-900">
                                          <td className="p-1.5 px-2 font-bold text-gray-300">طبيعة العمل</td>
                                          <td className="p-1.5 px-2 text-gray-400">يراقب الهجمات ويحلل التنبيهات</td>
                                          <td className="p-1.5 px-2 text-gray-400">يبني ويحمي ويوزع بنية الحماية</td>
                                        </tr>
                                        <tr className="border-b border-neutral-900">
                                          <td className="p-1.5 px-2 font-bold text-gray-300">مستوى النهج</td>
                                          <td className="p-1.5 px-2 text-gray-400">ردة فعل سريعة (Reactive)</td>
                                          <td className="p-1.5 px-2 text-gray-400">وقاية بأسس وتصميم (Proactive)</td>
                                        </tr>
                                        <tr className="border-b border-neutral-900">
                                          <td className="p-1.5 px-2 font-bold text-gray-300">التركيز</td>
                                          <td className="p-1.5 px-2 text-gray-400">السجلات Logs والمؤشرات الآنية</td>
                                          <td className="p-1.5 px-2 text-gray-400">الأجهزة الراوترات وجدران الوقاية</td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </div>

                                <div className="bg-[#121214] p-3 rounded-lg border border-neutral-850 grid grid-cols-2 gap-2 text-center text-[11px]">
                                  <div className="bg-neutral-900 p-2 rounded">
                                    <span className="text-gray-500 block">الشهادة المقترحة:</span>
                                    <span className="text-rose-400 font-bold font-mono">CISCO CCNA / CCNP</span>
                                  </div>
                                  <div className="bg-neutral-900 p-2 rounded">
                                    <span className="text-gray-500 block">الراتب المتوقع:</span>
                                    <span className="text-emerald-400 font-bold">عالي جداً بكافة البنوك</span>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* ----------------- UNIVERSAL AI / CYBER CAREER INFO BLOCKS ----------------- */}
                            {c.id !== 'soc-analyst-1' && c.id !== 'network-security-eng' && (
                              <div className="space-y-4">
                                <div className="space-y-2 bg-[#121214] p-3.5 rounded-lg border border-neutral-850">
                                  <h4 className="text-xs font-bold text-gray-200">🔍 وصف ونطاق تخصص العمل اليومي:</h4>
                                  <p className="text-[11px] text-gray-400 leading-relaxed">
                                    هذه الوظيفة ركيزة حيوية في الشركات والقطاعات والجهات الحكومية. تضمن دمج المنظومات وضمان سلامتها وسرية تشغيلها والرفع الفائق لمستوى الفائدة للملاك وسرعة الأداء الكلي.
                                  </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div className="space-y-1.5 bg-neutral-950 p-3 rounded-lg border border-neutral-900">
                                    <span className="text-xs text-rose-400 font-bold block">💡 ما المهارات المطلوبة في هذا التخصص؟</span>
                                    <p className="text-[11 text-gray-450 leading-relaxed">
                                      - الفهم التقني للبيانات وتدفق الشبكات.<br />
                                      - لغات البرمجة الشائعة (بايثون وجافاسكربت وتوليف الشفرات).<br />
                                      - مهارة حل المشكلات الصعبة والتفكير التحليلي والمنطق.
                                    </p>
                                  </div>

                                  <div className="space-y-1.5 bg-neutral-950 p-3 rounded-lg border border-neutral-900">
                                    <span className="text-xs text-emerald-400 font-bold block">🚀 طريقك وهندسة البدء من الصفر:</span>
                                    <p className="text-[11 text-gray-450 leading-relaxed">
                                      1. ابدأ بتعلم لغة البرمجة الأكثر انتشاراً <span className="font-mono text-emerald-500">Python</span>.<br />
                                      2. خذ شهادة أساسيات الحاسب أو أساسيات الاختراق أو معالجة البيانات.<br />
                                      3. جرب استخدام النماذج في بيئة محلية لتكسب الخبرة الكافية.
                                    </p>
                                  </div>
                                </div>

                                <div className="bg-[#121214] p-3 rounded-lg border border-neutral-850 flex items-center justify-between text-center gap-2">
                                  <div className="flex-1 bg-neutral-900 p-2.5 rounded">
                                    <span className="text-xs text-gray-500 block">فئة التخصص الفرعي:</span>
                                    <span className="text-xs text-rose-400 font-bold">
                                      {c.category === 'cyber' ? '🛡️ تكنولوجيا الدفاع والأمن السيبراني' : c.category === 'ai' ? '🤖 تكنولوجيا الهندسة والذكاء الاصطناعي' : '🔥 ثورة الدمج وسد الثغرات المتكاملة'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}

                          </div>
                        );
                      })() : (
                        <div className="text-xs text-gray-500 text-center py-20">الرجاء تحديد تخصص من القائمة الجانبية لعرض خطة الصعود وكافة المهارات.</div>
                      )}

                    </div>

                  </div>

                  {/* Summary Footer on Choices */}
                  <div className="bg-[#121214] border border-neutral-900 p-4 rounded-xl space-y-2 text-right">
                    <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1">
                      <Plus className="w-3.5 h-3.5 text-amber-400" />
                      إرشاد فائق: كيف تختار مسارك وتبرع فيه؟
                    </h4>
                    <div className="text-[11px] text-gray-400 leading-relaxed space-y-1">
                      <p>
                        👈 <span className="text-white font-bold">إذا كنت مبتدئاً كلياً:</span> ابدأ بتعزيز مهارة أساسيات الكمبيوتر والشبكات ثم توجه مباشرة لـ <span className="text-rose-400 font-bold">الأمن السيبراني والشبكات</span> أو <span className="text-[#0ea5e9] font-bold">تعلم الـ Python وبناء الخوارزميات للذكاء الاصطناعي</span>.
                      </p>
                      <p>
                        👈 <span className="text-white font-bold">إذا كنت تهدف للمستقبل البعيد والرواتب الأقوى عالمياً:</span> الخيار الفائق حالياً هو <span className="text-amber-400 font-black animate-pulse">دمج التخصصين معاً (الأمن + الذكاء الاصطناعي)</span> مثل وظيفة <span className="text-white">AI Security Engineer</span> و <span className="text-white">Fraud Detection Specialist</span> لحصد أكبر المكاسب والفرص الوظيفية!
                      </p>
                      <p className="text-[10px] text-gray-500 font-serif pt-1 italic">
                        "الأمن السيبراني يوفر الحصن الحامي الحصين... والذكاء الاصطناعي يوفر البصر الثاقب والتنبؤ الذكي... وتكاملهما معاً هو عتاد المستقبل المطلق 👑."
                      </p>
                    </div>
                  </div>

                </div>
              )}
              {activeTab === 'admin' && currentUser.role === 'admin' && (
                <div className="bg-[#0e0e10] border border-emerald-950 p-6 rounded-2xl shadow-xl space-y-6 text-right">
                  
                  {/* Title Bar */}
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-900 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-emerald-950/50 text-emerald-400 rounded-md">
                        <Users className="w-4 h-4" />
                      </div>
                      <h4 className="text-sm font-black text-emerald-400">لوحة تحكم المدير العام الخصوصية (المدير عاصم) 👑 🛡️</h4>
                    </div>
                    <span className="text-xs bg-emerald-950/60 text-emerald-300 border border-emerald-900/40 px-3 py-1 rounded-full font-mono font-bold">
                      مجموعة الحسابات: {totalRegisteredUsersCount}
                    </span>
                  </div>

                  <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
                    بصفتك المسجل الأول (المدير العام المالي والأمني المطلق لغرفة بوابة المغامرة)، تتيح لك لوحة التحكم مراقبة جميع الحسابات، مراجعة إثباتات الدفع وصور البطاقات المحملة، التحكم بمؤقت الأبدية ذو الدقيقة الواحدة، وإتلاف أو حذف أي حساب لإزالته كلياً من المتصفح. كما يمكنك الرد على استفسارات وتذاكر الدعم الواردة فوراً!
                  </p>

                  {/* 1. SECTION: BANK TRANSFERS REVIEWS (طلبات التحويل البنكي بانتظار التدقيق والاعتماد) */}
                  <div className="space-y-3 bg-[#0d1512]/30 border border-emerald-900/20 p-4 rounded-xl">
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4 text-amber-400" />
                      <span>📥 طلبات التحويل البنكي وصور البطاقات المعلقة بالانتظار:</span>
                    </span>

                    {users.filter(u => u.paymentPendingVerification).length === 0 ? (
                      <p className="text-[10.5px] text-gray-500 font-sans">لا توجد طلبات تفعيل معلقة أو متحقق منها بانتظار المراجعة حالياً.</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {users.filter(u => u.paymentPendingVerification).map((pendingUser) => (
                          <div key={pendingUser.id} className="bg-neutral-950 border border-amber-500/30 p-4 rounded-xl space-y-3.5 relative">
                            <div className="flex justify-between items-start gap-1">
                              <div>
                                <h5 className="text-xs font-bold text-gray-200">{pendingUser.username}</h5>
                                <span className="text-[10px] text-gray-500 font-mono block">{pendingUser.email}</span>
                              </div>
                              <span className="text-[9px] bg-amber-950/60 border border-amber-500/30 text-amber-400 font-bold px-2 py-0.5 rounded animate-pulse">
                                ⏳ قيد المراجعة
                              </span>
                            </div>

                            {/* SMS Code representation */}
                            <div className="bg-[#121214] border border-neutral-900 p-2 rounded text-[11px] space-y-1">
                              <span className="text-gray-500 block">📲 رمز تأكيد سحب OTP البنك المدخل:</span>
                              <span className="text-rose-400 font-mono font-bold tracking-widest block text-xs">
                                {pendingUser.bankTransferOTP || 'لا يوجد'}
                              </span>
                            </div>

                            {/* Uploaded Card image */}
                            <div className="space-y-1.5">
                              <span className="text-[10px] text-gray-500 block">🖼️ إيصال سحب وصورة البطاقة المرفقة:</span>
                              <div className="border border-neutral-900 rounded-lg p-1.5 bg-neutral-900/60 text-center max-h-36 overflow-hidden flex items-center justify-center">
                                {pendingUser.bankTransferReceipt ? (
                                  isPresetIcon(pendingUser.bankTransferReceipt) ? (
                                    <span className="text-4xl py-4">{getPresetEmoji(pendingUser.bankTransferReceipt)}</span>
                                  ) : (
                                    <img 
                                      src={pendingUser.bankTransferReceipt} 
                                      alt="Uploaded Card Receipt" 
                                      className="max-h-32 rounded object-contain mx-auto"
                                    />
                                  )
                                ) : (
                                  <span className="text-[10px] text-gray-650 italic">لم يتم إرفاق صورة</span>
                                )}
                              </div>
                            </div>

                            {/* Interactive decision buttons */}
                            <div className="pt-2 border-t border-neutral-900/70 space-y-1.5">
                              <span className="text-[10px] text-gray-500 block pb-1">اتخذ قرار الاعتماد للحساب:</span>
                              <div className="grid grid-cols-2 gap-2">
                                <button
                                  onClick={() => handleAdminApprovePayment(pendingUser.id, true)}
                                  className="py-1.5 px-2.5 bg-emerald-650 hover:bg-emerald-550 text-white font-bold text-[10px] rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1"
                                >
                                  <span>👑 تفعيل لانهائي للأبد</span>
                                </button>
                                <button
                                  onClick={() => handleAdminApprovePayment(pendingUser.id, false)}
                                  className="py-1.5 px-2.5 bg-amber-650 hover:bg-amber-550 text-white font-bold text-[10px] rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1"
                                >
                                  <span>⏳ تفعيل دقيقة واحدة</span>
                                </button>
                              </div>
                              <button
                                onClick={() => handleAdminRejectPayment(pendingUser.id)}
                                className="w-full py-1.5 bg-red-950/60 hover:bg-red-900/40 border border-red-900/30 text-red-400 text-[10px] font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1"
                              >
                                <span>❌ رفض التحويل وإلغاء الطلب</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 2. SECTION: SUPPORT TICKETS & REPLIES (إدارة واستقبال تذاكر دعم المشتركين) */}
                  <div className="space-y-3 bg-[#0d1215]/30 border border-neutral-900 p-4 rounded-xl">
                    <span className="text-xs font-bold text-orange-400 flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4 text-orange-450" />
                      <span>💬 تذاكر الدعم والمساندة الواردة من الأعضاء:</span>
                    </span>

                    {supportTickets.length === 0 ? (
                      <p className="text-[10.5px] text-gray-500 font-sans">لا توجد أي تذاكر واردة من المستخدمين الآخرين حتى الآن.</p>
                    ) : (
                      <div className="space-y-3">
                        {supportTickets.map((ticket) => (
                          <div key={ticket.id} className="bg-neutral-950 border border-neutral-850 p-3.5 rounded-xl space-y-3">
                            <div className="flex justify-between items-start gap-2 flex-wrap text-right">
                              <div>
                                <h5 className="text-xs font-black text-white">{ticket.subject}</h5>
                                <span className="text-[10px] text-gray-500 font-sans">
                                  بواسطة: {ticket.username} ({ticket.email})
                                </span>
                              </div>
                              <span className="text-[9px] font-mono text-gray-600 bg-[#121214] px-1.5 py-0.5 rounded">
                                {ticket.createdAt}
                              </span>
                            </div>

                            <p className="text-[11px] text-gray-300 leading-relaxed bg-[#121214] p-2.5 rounded border border-neutral-900">
                              {ticket.message}
                            </p>

                            {/* Reply Input or Show Answer */}
                            {ticket.replyText ? (
                              <div className="p-2.5 bg-emerald-950/20 border border-emerald-900/30 rounded-lg text-right">
                                <span className="text-[10px] font-bold text-emerald-400 block pb-1">💬 ردك المدون المكتمل:</span>
                                <p className="text-xs text-emerald-250 font-sans">{ticket.replyText}</p>
                              </div>
                            ) : (
                              <div className="space-y-2 pt-1 border-t border-neutral-900/50">
                                <span className="text-[10px] text-amber-500 font-bold block">⌛ التذكرة بانتظار ردك:</span>
                                <div className="flex gap-2">
                                  <textarea
                                    rows={2}
                                    value={supportReplyText[ticket.id] || ''}
                                    onChange={(e) => setSupportReplyText(prev => ({ ...prev, [ticket.id]: e.target.value }))}
                                    placeholder="اكتب رد الدعم والمساندة الفورية للعضو..."
                                    className="flex-1 bg-[#121214] border border-neutral-850 rounded-lg p-2 text-xs text-gray-200 focus:outline-none focus:ring-1 focus:ring-orange-500/40"
                                  ></textarea>
                                  <button
                                    onClick={() => handleAdminReplyTicket(ticket.id)}
                                    className="px-4 bg-orange-700 hover:bg-orange-600 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer self-stretch flex items-center justify-center"
                                  >
                                    إرسال الرد
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 3. SECTION: GENERAL ACCOUNTS LIST (إدارة وإتلاف الحسابات العادية) */}
                  <div className="space-y-3 bg-[#110101]/20 border border-neutral-900 p-4 rounded-xl">
                    <span className="text-xs font-bold text-gray-300 block">👥 إدارة الحسابات والتحكم بالصلاحيات والمؤقتات:</span>

                    {users.filter(u => u.id !== currentUser.id).length === 0 ? (
                      <div className="bg-[#121214] border border-neutral-850 p-6 rounded-xl text-center text-xs text-gray-600">
                        لا يوجد حسابات لمستخدمين آخرين مسجلة حتى الآن بالبوابة.
                      </div>
                    ) : (
                      <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
                        {users.filter(u => u.id !== currentUser.id).map((user) => (
                          <div 
                            key={user.id}
                            className="bg-[#121214] border border-neutral-850 p-3.5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 transition-all hover:border-emerald-950/50 text-right"
                          >
                            <div className="space-y-1.5 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${user.isInfinite ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                                <h4 className="text-xs font-black text-gray-200 truncate">{user.username}</h4>
                                <span className="text-[10px] text-gray-500 font-mono">({user.email})</span>
                              </div>

                              <div className="flex flex-wrap items-center gap-2">
                                <span className={`text-[9px] px-2 py-0.5 rounded border ${
                                  user.isInfinite 
                                    ? 'bg-emerald-950/60 border-emerald-900/40 text-emerald-300' 
                                    : 'bg-neutral-900 border-neutral-800 text-gray-400'
                                }`}>
                                  النوع: {user.isInfinite ? '👑 أبدي المدى' : '⌛ مؤقت دقيقة'}
                                </span>
                                
                                {user.expired ? (
                                  <span className="text-[9px] bg-red-950/60 border border-red-900/40 text-red-400 font-black px-2 py-0.5 rounded flex items-center gap-1 animate-pulse">
                                    <AlertTriangle className="w-3 h-3" />
                                    <span>انتهت أبدية الدقيقة! الحظر نشط 🔒</span>
                                  </span>
                                ) : (
                                  <span className="text-[9px] bg-emerald-950/50 border border-emerald-900/30 text-emerald-400 font-bold px-2 py-0.5 rounded">
                                    نشط ومفتوح ضمن مهلة الأبدية ⏳
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Actions block exclusively for the Manager to control accounts */}
                            <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                              
                              {/* 1. Recentre countdown timer to allow another 1 minute */}
                              {user.expired && (
                                <button
                                  onClick={() => handleAdminResetExpiry(user)}
                                  className="px-2.5 py-1.5 bg-emerald-950/40 hover:bg-emerald-900 text-emerald-400 border border-emerald-900/40 text-[10.5px] font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                                  title="إعادة تفعيل دقيقة لانهائية جديدة"
                                >
                                  <RotateCcw className="w-3.5 h-3.5" />
                                  <span>تصفير المؤشر</span>
                                </button>
                              )}

                              {/* 2. Absolute deletion button */}
                              <button
                                  onClick={() => handleAdminDeleteUser(user.id)}
                                  className="px-2.5 py-1.5 bg-red-950/50 hover:bg-red-900/40 text-red-400 border border-red-900/40 text-[10.5px] font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                                  title="إتلاف وتدمير ملف الحساب النهائي"
                              >
                                <UserX className="w-3.5 h-3.5" />
                                <span>حذف الحساب</span>
                              </button>
                            </div>

                          </div>
                        ))}
                      </div>
                    )}

                    {users.filter(u => u.id !== currentUser.id).length > 0 && (
                      <div className="pt-3 border-t border-neutral-900/40 flex justify-end">
                        <button
                          onClick={handleAdminWipeAllUsers}
                          className="px-3.5 py-2 bg-red-950/30 hover:bg-red-900/20 text-red-400 border border-red-900/40 text-[10.5px] font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-400" />
                          <span>إتلاف وتصفير جميع الحسابات العادية دفعة واحدة 💀</span>
                        </button>
                      </div>
                    )}

                  </div>
                </div>
              )}

            </div>
          )}

          {/* Quick FAQ info panel */}
          <div className="relative z-10 p-4 bg-[#0e0e10]/80 border border-neutral-900 rounded-xl space-y-1">
            <h5 className="text-[11px] font-black text-gray-300 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-red-400" />
              كيف يعمل الترخيص المجهول للأبدية؟
            </h5>
            <p className="text-[10px] text-gray-500 leading-relaxed">
              تعتمد شريحة المغامرة اللانهائية على رخص المتصفح المدمج. بمجرد تسجيلك، يمكنك معالجة ومشاركة Links (رابط)، الوجبات المفضلة، ومعرض الصور التفاعلية بخصوصية وحصر دائم. الحساب الأول هو بمثابة المدير المالي ويشرف كلياً على تسيير رخص الولوج.
            </p>
          </div>

        </div>

      </main>

      {/* Decorative Minimal Footer */}
      <footer className="relative z-10 w-full text-center py-6 text-[10px] text-gray-600 font-mono border-t border-neutral-900 bg-[#060607]">
        <div className="max-w-xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} بوابة شفرة المغامرة. كافة الحقوق محفوظة.</p>
          <div className="flex gap-2">
            <span>مدير مجاني مدى الحياة</span>
            <span>|</span>
            <span>الأعضاء 1000﷼ للدقيقة الأبدية</span>
            <span>|</span>
            <span className="text-red-500/75 animate-pulse">شغف كامل</span>
          </div>
        </div>
      </footer>

      {/* ------------------------ PRANK OVERLAY MODAL: THE 1-MINUTE ETERNITY EXPIRY ALARM ------------------------ */}
      <AnimatePresence>
        {showExpiryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Dark Scarlet Crimson Backdrop */}
            <div 
              className="absolute inset-0 bg-[#070101]/95 backdrop-blur-md cursor-pointer" 
              onClick={() => setShowExpiryModal(false)}
            ></div>

            {/* Glowing Emergency Box */}
            <div className="relative w-full max-w-md bg-[#110101] border-2 border-red-600 rounded-2xl p-6 sm:p-8 text-right space-y-5 shadow-[0_0_50px_rgba(239,68,68,0.4)] border-neon-red">
              
              <div className="text-center space-y-3">
                <div className="mx-auto w-12 h-12 bg-red-950/60 border border-red-500 rounded-full flex items-center justify-center text-red-400 animate-ping">
                  <AlertTriangle className="w-6 h-6 stroke-[2.5]" />
                </div>
                
                <h2 className="text-2xl font-black text-white tracking-widest uppercase neon-glow-red">
                  ⚠️ نَفِذَتِ الَأَبَدِيَّةُ!
                </h2>
                
                {expiredUserRef && (
                  <p className="text-xs bg-red-950/40 text-red-400 border border-red-900/30 px-3 py-1 rounded inline-block font-mono">
                    المستكشف: {expiredUserRef.username} | دفع رسوم: 1,000﷼
                  </p>
                )}
              </div>

              <div className="text-xs text-gray-300 leading-relaxed text-center space-y-3">
                <p>
                  لقد انتهت مهلة صلاحية اشتراكك اللانهائي (بقيمة <span className="text-rose-500 font-black">1,000﷼</span>) الخاص بك بعد مرور <span className="text-rose-400 font-bold">دقيقة واحدة</span> كاملة!
                </p>
                
                <div className="p-3 bg-red-950/20 border border-red-900/30 rounded-lg italic text-[11px] text-gray-400 text-right leading-relaxed font-serif">
                  "قال الحكيم القديم في قلعة المغامرات: الأبدية الحقيقية تكمن في متعة اللحظة العابرة والسرور الآن، والدقيقة الواحدة هي بمثابة أبدية وخلود لا نهائي في نظام السرعة الرقمية! دقيقتنا دهر كامل 😈."
                </div>

                <p className="text-gray-400 text-[11px]">
                  للولوج مجدداً أو نيل الإعفاء المالي، يرجى الاسترحام والتودد لـ <span className="text-emerald-400 font-bold">المدير العام 👑</span> (صاحب أول حساب تم تفعيله بالنظام). يتمتع المدير بالصلاحية الحصرية المطلقة لإعادة تصفير المؤشر أو حذف حسابك لكي يتسنى لك التسجيل والمحاولة من جديد بـ <span className="text-rose-500 font-black">1,000﷼</span> إضافية!
                </p>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowExpiryModal(false)}
                  className="flex-1 py-3 bg-red-650 hover:bg-red-550 border border-red-500/40 text-white font-black text-xs rounded-xl shadow-lg transition-all cursor-pointer text-center"
                >
                  فهمت وقبلت بقدري 🙇‍♂️
                </button>
              </div>

            </div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
