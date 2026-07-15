import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Link2, 
  Trash2, 
  Plus, 
  Check, 
  Volume2, 
  VolumeX, 
  HelpCircle, 
  Info,
  CheckCircle,
  ExternalLink,
  LogOut,
  Image as ImageIcon,
  Utensils,
  AlertTriangle
} from 'lucide-react';
import { motion } from 'motion/react';
import { UserAccount, AdventureLink, FavoriteDish, FavoritePhoto, SupportMessage } from './types';
import { createPasswordHash, isSafeHttpUrl, isSafeImageSource, normalizeHttpUrl, verifyPassword } from './security';

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

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

interface AudioEnabledWindow extends Window {
  webkitAudioContext?: typeof AudioContext;
}

const migrateStoredUsers = async (value: unknown): Promise<UserAccount[]> => {
  if (!Array.isArray(value)) {
    return [];
  }

  const migratedUsers = await Promise.all(value.map(async (entry) => {
    if (
      !isRecord(entry) ||
      entry.role === 'admin' ||
      typeof entry.id !== 'string' ||
      typeof entry.username !== 'string' ||
      typeof entry.email !== 'string' ||
      typeof entry.createdAt !== 'string'
    ) {
      return null;
    }

    const passwordHash = typeof entry.passwordHash === 'string'
      ? entry.passwordHash
      : typeof entry.password === 'string' && entry.password.length >= 10
        ? await createPasswordHash(entry.password)
        : null;

    if (!passwordHash) {
      return null;
    }

    return {
      id: entry.id,
      username: entry.username.slice(0, 50),
      email: entry.email.toLowerCase().slice(0, 254),
      role: 'regular' as const,
      createdAt: entry.createdAt,
      passwordHash,
    };
  }));

  return migratedUsers.filter((user): user is UserAccount => user !== null);
};

const readStoredLinks = (value: unknown): AdventureLink[] =>
  Array.isArray(value)
    ? value.slice(0, 500).filter((entry): entry is AdventureLink =>
        isRecord(entry) &&
        typeof entry.id === 'string' &&
        typeof entry.url === 'string' &&
        isSafeHttpUrl(entry.url) &&
        typeof entry.name === 'string' &&
        entry.name.length <= 100 &&
        typeof entry.createdAt === 'string' &&
        typeof entry.isCompleted === 'boolean' &&
        typeof entry.userId === 'string'
      )
    : [];

const readStoredDishes = (value: unknown): FavoriteDish[] =>
  Array.isArray(value)
    ? value.slice(0, 500).filter((entry): entry is FavoriteDish =>
        isRecord(entry) &&
        typeof entry.id === 'string' &&
        typeof entry.name === 'string' &&
        entry.name.length <= 100 &&
        typeof entry.image === 'string' &&
        isSafeImageSource(entry.image) &&
        typeof entry.createdAt === 'string' &&
        typeof entry.userId === 'string'
      )
    : [];

const readStoredPhotos = (value: unknown): FavoritePhoto[] =>
  Array.isArray(value)
    ? value.slice(0, 500).filter((entry): entry is FavoritePhoto =>
        isRecord(entry) &&
        typeof entry.id === 'string' &&
        typeof entry.title === 'string' &&
        entry.title.length <= 100 &&
        typeof entry.url === 'string' &&
        isSafeImageSource(entry.url) &&
        typeof entry.createdAt === 'string' &&
        typeof entry.userId === 'string'
      )
    : [];

const readStoredSupportMessages = (value: unknown): SupportMessage[] =>
  Array.isArray(value)
    ? value.slice(0, 200).filter((entry): entry is SupportMessage =>
        isRecord(entry) &&
        typeof entry.id === 'string' &&
        typeof entry.userId === 'string' &&
        typeof entry.username === 'string' &&
        typeof entry.email === 'string' &&
        typeof entry.subject === 'string' &&
        entry.subject.length <= 120 &&
        typeof entry.message === 'string' &&
        entry.message.length <= 2000 &&
        typeof entry.createdAt === 'string' &&
        (entry.replyText === undefined || typeof entry.replyText === 'string')
      )
    : [];

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
  
  // Support Messages States
  const [supportTickets, setSupportTickets] = useState<SupportMessage[]>([]);
  const [supportSubject, setSupportSubject] = useState('');
  const [supportBody, setSupportBody] = useState('');

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
  const [activeTab, setActiveTab] = useState<'links' | 'dishes' | 'photos' | 'careers' | 'support'>('careers');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // Careers Hub Local States
  const [careerSearch, setCareerSearch] = useState('');
  const [careerCategory, setCareerCategory] = useState<'all' | 'cyber' | 'ai' | 'both' | 'high-salary'>('all');
  const [selectedCareerId, setSelectedCareerId] = useState<string | null>('soc-analyst-1');
  
  // Load from LocalStorage
  useEffect(() => {
    let cancelled = false;

    void (async () => {
      let parsedUsers: unknown = [];
      const savedUsers = localStorage.getItem('adv_users_v1');
      if (savedUsers) {
        try {
          parsedUsers = JSON.parse(savedUsers);
        } catch {
          localStorage.removeItem('adv_users_v1');
        }
      }

      const loadedUsers = await migrateStoredUsers(parsedUsers);
      if (cancelled) {
        return;
      }

      setUsers(loadedUsers);
      localStorage.setItem('adv_users_v1', JSON.stringify(loadedUsers));

      const savedSession = localStorage.getItem('adv_current_user_v1');
      if (savedSession && loadedUsers.length > 0) {
        try {
          const parsedSession: unknown = JSON.parse(savedSession);
          const sessionId = isRecord(parsedSession) && typeof parsedSession.id === 'string'
            ? parsedSession.id
            : null;
          const realUser = loadedUsers.find(user => user.id === sessionId);
          if (realUser) {
            setCurrentUser(realUser);
            localStorage.setItem(
              'adv_current_user_v1',
              JSON.stringify({ id: realUser.id }),
            );
          } else {
            localStorage.removeItem('adv_current_user_v1');
          }
        } catch {
          localStorage.removeItem('adv_current_user_v1');
        }
      }
    })();

    const savedTickets = localStorage.getItem('adv_support_messages_v1');
    if (savedTickets) {
      try {
        const parsedTickets: unknown = JSON.parse(savedTickets);
        setSupportTickets(readStoredSupportMessages(parsedTickets));
      } catch {
        localStorage.removeItem('adv_support_messages_v1');
      }
    }

    const savedLinks = localStorage.getItem('adv_links_v1');
    if (savedLinks) {
      try {
        const parsedLinks: unknown = JSON.parse(savedLinks);
        setLinks(readStoredLinks(parsedLinks));
      } catch {
        localStorage.removeItem('adv_links_v1');
      }
    }

    const savedDishes = localStorage.getItem('adv_dishes_v1');
    if (savedDishes) {
      try {
        const parsedDishes: unknown = JSON.parse(savedDishes);
        setDishes(readStoredDishes(parsedDishes));
      } catch {
        localStorage.removeItem('adv_dishes_v1');
      }
    } else {
      // Clean default food presets
      const defaultDishes: FavoriteDish[] = [
        { id: 'dish-1', name: 'مندي لحم بلدي فاخر 🥩', image: 'PRESET_ICON:🍛', createdAt: '١٢:٣٠ م', userId: 'all' },
        { id: 'dish-2', name: 'ورق عنب حامض حلو ذايب 🍋', image: 'PRESET_ICON:🥗', createdAt: '١٢:٣٥ م', userId: 'all' }
      ];
      setDishes(defaultDishes);
    }

    const savedPhotos = localStorage.getItem('adv_photos_v1');
    if (savedPhotos) {
      try {
        const parsedPhotos: unknown = JSON.parse(savedPhotos);
        setPhotos(readStoredPhotos(parsedPhotos));
      } catch {
        localStorage.removeItem('adv_photos_v1');
      }
    } else {
      const defaultPhotos: FavoritePhoto[] = [
        { id: 'photo-1', title: 'بوابة المغامرة الأولى 🚪', url: 'PRESET_ICON:🌌', createdAt: '١٢:٤٠ م', userId: 'all' }
      ];
      setPhotos(defaultPhotos);
    }
    return () => {
      cancelled = true;
    };
  }, []);

  // Save actions to local storage helper
  const saveUsersToStorage = (updatedUsers: UserAccount[]) => {
    setUsers(updatedUsers);
    localStorage.setItem('adv_users_v1', JSON.stringify(updatedUsers));
  };

  const saveLinksToStorage = (updatedLinks: AdventureLink[]) => {
    setLinks(updatedLinks);
    localStorage.setItem('adv_links_v1', JSON.stringify(updatedLinks));
  };

  const saveDishesToStorage = (updatedDishes: FavoriteDish[]) => {
    setDishes(updatedDishes);
    localStorage.setItem('adv_dishes_v1', JSON.stringify(updatedDishes));
  };

  const savePhotosToStorage = (updatedPhotos: FavoritePhoto[]) => {
    setPhotos(updatedPhotos);
    localStorage.setItem('adv_photos_v1', JSON.stringify(updatedPhotos));
  };

  useEffect(() => {
    if (currentUser) {
      const exists = users.find(u => u.id === currentUser.id);
      if (users.length > 0 && !exists) {
        setCurrentUser(null);
        localStorage.removeItem('adv_current_user_v1');
        playSynthSound(150, 'sawtooth', 0.5);
        setErrorMsg('لم يعد الملف المحلي متوفراً.');
      }
    }
  }, [users, currentUser]);

  const playSynthSound = (frequency: number, type: OscillatorType, duration: number) => {
    if (!soundEnabled) return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as AudioEnabledWindow).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
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

  const playAddSound = () => playSynthSound(440, 'triangle', 0.15); // Add
  const playCompleteSound = () => playSynthSound(880, 'sine', 0.2); // Check custom chime
  const playDeleteSound = () => playSynthSound(180, 'sawtooth', 0.25); // Delete item sound

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const username = regUsername.trim();
    const email = regEmail.trim().toLowerCase();
    if (
      username.length < 2 ||
      username.length > 50 ||
      email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      regPassword.length < 10 ||
      regPassword.length > 128
    ) {
      setErrorMsg('تحقق من البريد، واجعل الاسم بين 2 و50 حرفاً وكلمة المرور بين 10 و128 حرفاً.');
      return;
    }

    const duplicate = users.find(u =>
      u.username.toLowerCase() === username.toLowerCase() ||
      u.email === email
    );
    if (duplicate) {
      setErrorMsg('اسم المستخدم أو البريد الإلكتروني مسجل مسبقاً!');
      return;
    }

    const newUser: UserAccount = {
      id: crypto.randomUUID(),
      username,
      email,
      passwordHash: await createPasswordHash(regPassword),
      role: 'regular',
      createdAt: new Date().toLocaleDateString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
    };

    const nextUsers = [...users, newUser];
    saveUsersToStorage(nextUsers);
    setRegUsername('');
    setRegEmail('');
    setRegPassword('');
    setCurrentUser(newUser);
    localStorage.setItem('adv_current_user_v1', JSON.stringify({ id: newUser.id }));
    setSuccessMsg('تم إنشاء ملفك المحلي وتسجيل الدخول.');
    playCompleteSound();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!loginEmail.trim() || !loginPassword) {
      setErrorMsg('الرجاء إدخال البريد الإلكتروني وكلمة المرور للدخول!');
      return;
    }

    const found = users.find(u => u.email === loginEmail.trim().toLowerCase());
    if (!found || !(await verifyPassword(loginPassword, found.passwordHash))) {
      setErrorMsg('بيانات تسجيل الدخول غير صحيحة.');
      return;
    }

    setCurrentUser(found);
    localStorage.setItem('adv_current_user_v1', JSON.stringify({ id: found.id }));
    setLoginPassword('');
    setSuccessMsg(`مرحباً مجدداً، ${found.username}!`);
    playCompleteSound();
  };

  const handleSendSupportTicket = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!currentUser) return;
    if (
      !supportSubject.trim() ||
      !supportBody.trim() ||
      supportSubject.trim().length > 120 ||
      supportBody.trim().length > 2000
    ) {
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
      createdAt: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
    };

    const nextTickets = [newTicket, ...supportTickets];
    setSupportTickets(nextTickets);
    localStorage.setItem('adv_support_messages_v1', JSON.stringify(nextTickets));

    setSupportSubject('');
    setSupportBody('');
    setSuccessMsg('تم حفظ ملاحظتك محلياً في هذا المتصفح.');
    playCompleteSound();
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('adv_current_user_v1');
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

    let urlFormatted: string;
    try {
      urlFormatted = normalizeHttpUrl(inputUrl);
    } catch {
      setErrorMsg('تنسيق رابط غير صالح!');
      return;
    }

    if (inputUrlName.trim().length > 100) {
      setErrorMsg('اسم الرابط يجب ألا يتجاوز 100 حرف.');
      return;
    }

    const newLink: AdventureLink = {
      id: 'lnk-' + Date.now(),
      url: urlFormatted,
      name: inputUrlName.trim() || getShortUrlString(urlFormatted),
      createdAt: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
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
    if (!inputDish.trim() || inputDish.trim().length > 100) {
      setErrorMsg('الرجاء كتابة اسم وجبتك المفضلة!');
      return;
    }
    if (inputDishImage && !isSafeImageSource(inputDishImage)) {
      setErrorMsg('مصدر الصورة غير مسموح. استخدم رابط HTTP/HTTPS أو ملف صورة صالح.');
      return;
    }

    const newDish: FavoriteDish = {
      id: 'dsh-' + Date.now(),
      name: inputDish.trim(),
      image: inputDishImage || 'PRESET_ICON:🥘',
      createdAt: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
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
      if (!['image/png', 'image/jpeg', 'image/gif', 'image/webp'].includes(file.type)) {
        setErrorMsg('نوع الصورة غير مدعوم. استخدم PNG أو JPEG أو GIF أو WebP.');
        return;
      }
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
      image: `PRESET_ICON:${emojiIcon}`,
      createdAt: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
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
    if (!inputPhotoTitle.trim() || inputPhotoTitle.trim().length > 100) {
      setErrorMsg('برجاء كتابة عنوان لصورتك المفضلة!');
      return;
    }
    if (inputPhotoUrl && !isSafeImageSource(inputPhotoUrl)) {
      setErrorMsg('مصدر الصورة غير مسموح. استخدم رابط HTTP/HTTPS أو ملف صورة صالح.');
      return;
    }

    const newPhoto: FavoritePhoto = {
      id: 'pht-' + Date.now(),
      title: inputPhotoTitle.trim(),
      url: inputPhotoUrl || 'PRESET_ICON:🖼️',
      createdAt: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
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
      url: `PRESET_ICON:${emojiIcon}`,
      createdAt: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
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

  const getShortUrlString = (fullUrl: string) => {
    try {
      const parsed = new URL(fullUrl);
      return parsed.hostname + (parsed.pathname.length > 12 ? parsed.pathname.slice(0, 12) + '...' : parsed.pathname);
    } catch (_) {
      return fullUrl;
    }
  };

  // Scoped Data Arrays (Each user sees their own items, keeping it fully personal and organized)
  const scopedLinks = links.filter(l =>
    isSafeHttpUrl(l.url) &&
    (l.userId === 'all' || (currentUser && l.userId === currentUser.id))
  );
  const scopedDishes = dishes.filter(d =>
    isSafeImageSource(d.image) &&
    (d.userId === 'all' || (currentUser && d.userId === currentUser.id))
  );
  const scopedPhotos = photos.filter(p =>
    isSafeImageSource(p.url) &&
    (p.userId === 'all' || (currentUser && p.userId === currentUser.id))
  );

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
              ملف محلي 🎟️
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
              مساحة محلية لحفظ روابطك ووجباتك وصورك على هذا الجهاز.
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
          {!currentUser && (
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
                      minLength={2}
                      maxLength={50}
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
                      maxLength={254}
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
                      minLength={10}
                      maxLength={128}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#161619] border border-neutral-800 rounded-xl py-2.5 px-3.5 text-xs text-gray-200 focus:outline-none focus:ring-1 focus:ring-red-500/50 placeholder:text-gray-600 font-mono text-left"
                      dir="ltr"
                    />
                  </div>

                  <div className="p-3 bg-red-950/20 border border-red-900/30 rounded-lg text-[10.5px] text-gray-400 leading-relaxed">
                    <span className="font-bold text-red-400 block mb-0.5">ملاحظة الخصوصية:</span>
                    كلمة المرور تُشتق محلياً ولا تُحفظ كنص واضح. البيانات تبقى في هذا المتصفح ولا تمثل حساباً سحابياً.
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
                      maxLength={254}
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
                      maxLength={128}
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

          {/* ------------------------ CORE PORTAL WORKSPACE (FOR LOGGED USERS) ------------------------ */}
          {currentUser && (
            <div className="space-y-6 animate-fade-in relative z-10">
              
              {/* Account Profile Status Header */}
              <div className="bg-[#111113] border border-neutral-900 rounded-2xl p-4.5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-950/30 border border-red-900/40 flex items-center justify-center text-red-400 font-bold text-sm">
                    🔥
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-gray-200">
                      مرحباً، {currentUser.username}!
                    </h3>
                    <p className="text-[10px] text-gray-500">
                      ملف شخصي محلي على هذا الجهاز
                    </p>
                  </div>
                </div>

                <div className="bg-[#18181c] border border-neutral-850 text-emerald-400 px-3.5 py-2 rounded-xl text-xs font-bold self-center">
                  التخزين محلي ومتاح دون دفع
                </div>
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
                          maxLength={2048}
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
                          maxLength={100}
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
                        maxLength={100}
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
                          maxLength={2048}
                          value={inputDishImage.startsWith('PRESET_ICON:') ? '' : inputDishImage}
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
                                {dish.image.startsWith('PRESET_ICON:') ? (
                                  <span className="text-2xl">{dish.image.split(':')[1]}</span>
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
                        maxLength={100}
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
                          maxLength={2048}
                          value={inputPhotoUrl.startsWith('PRESET_ICON:') ? '' : inputPhotoUrl}
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
                              {p.url.startsWith('PRESET_ICON:') ? (
                                <span className="text-3xl select-none">{p.url.split(':')[1]}</span>
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
                      <span>ملاحظاتك المحلية 💬</span>
                    </h3>
                    <p className="text-[11px] text-gray-400 mt-1 leading-normal">
                      احفظ ملاحظة أو وصفاً لمشكلة تقنية داخل هذا المتصفح. لا تُرسل هذه البيانات إلى أي جهة خارجية.
                    </p>
                  </div>

                  <form onSubmit={handleSendSupportTicket} className="bg-[#121214] border border-neutral-900 p-4 rounded-xl space-y-3.5">
                    <span className="text-xs font-bold text-orange-400 block pb-1 border-b border-orange-950/20">تذكرة مساندة جديدة:</span>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400">موضوع الطلب:</label>
                      <input
                        type="text"
                        required
                        maxLength={120}
                        value={supportSubject}
                        onChange={(e) => setSupportSubject(e.target.value)}
                        placeholder="مثال: مشكلة في حفظ رابط..."
                        className="w-full bg-[#161619] border border-neutral-850 rounded-lg py-2 px-3 text-xs text-gray-200 focus:outline-none focus:ring-1 focus:ring-orange-500/40 font-medium"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400">تفاصيل الرسالة أو المشكلة التقنية:</label>
                      <textarea
                        required
                        rows={3}
                        maxLength={2000}
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
                      <span>💬 حفظ الملاحظة محلياً</span>
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
                                  💬 رد محفوظ سابقاً:
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

            </div>
          )}

          {/* Quick FAQ info panel */}
          <div className="relative z-10 p-4 bg-[#0e0e10]/80 border border-neutral-900 rounded-xl space-y-1">
            <h5 className="text-[11px] font-black text-gray-300 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-red-400" />
              كيف تعمل الخصوصية المحلية؟
            </h5>
            <p className="text-[10px] text-gray-500 leading-relaxed">
              تُحفظ الملفات والروابط والصور داخل تخزين المتصفح على جهازك. لا ترسل الصفحة كلمات مرور البريد أو بيانات البطاقات أو رموز التحقق، ولا توجد صلاحيات مدير مخفية.
            </p>
          </div>

        </div>

      </main>

      {/* Decorative Minimal Footer */}
      <footer className="relative z-10 w-full text-center py-6 text-[10px] text-gray-600 font-mono border-t border-neutral-900 bg-[#060607]">
        <div className="max-w-xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} بوابة شفرة المغامرة. كافة الحقوق محفوظة.</p>
          <div className="flex gap-2">
            <span>تخزين محلي</span>
            <span>|</span>
            <span>دون بيانات دفع</span>
            <span>|</span>
            <span className="text-red-500/75 animate-pulse">شغف كامل</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
