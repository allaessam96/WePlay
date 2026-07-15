import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

export const app = express();
const PORT = 3000;

app.use(express.json());

// Build the deterministic developer mock blueprint returned when no API key is configured.
export function buildMockBlueprint(appIdea: string) {
  return {
    isMock: true,
    appNameAr: `${appIdea.slice(0, 15)} الذكي`,
    appNameEn: "Smart App Blueprint",
    catchphrase: "مستقبل الحلول الرقمية يبدأ بفكرة بسيطة",
    problemSolved: "توفير حل متكامل ومبسط لإدارة هذه الفكرة وتطبيقها على أرض الواقع بكفاءة عالية وبأقل جهد.",
    audience: "الأفراد والمؤسسات المهتمين بتنظيم وتسهيل عملياتهم اليومية المتعلقة بهذا المجال ومواكبة التحول الرقمي.",
    brandVibe: "تصميم عصري وجريء يعتمد على واجهات مريحة للعين، مع درجات ألوان ملهمة وعناصر تحكم بديهية.",
    mvpFeatures: [
      {
        title: "لوحة التحكم الذكية والتقارير",
        description: "عرض إحصائيات فورية ومؤشرات الأداء للمستخدم بأسلوب مرئي بسيط لتسهيل اتخاذ القرارات اليومية.",
        impact: "High",
        complexity: "Low"
      },
      {
        title: "نظام إدارة المهام والتنبيهات",
        description: "تسهيل إنشاء المتطلبات ومتابعة تقدمها مع تذكيرات مؤتمتة وتنبيهات تفاعلية فورية.",
        impact: "High",
        complexity: "Medium"
      },
      {
        title: "مركز مشاركة البيانات والتصدير",
        description: "إمكانية مشاركة النتائج والتقارير مع زملاء العمل أو العملاء وتصديرها بصيغ متعددة بضغطة زر.",
        impact: "Medium",
        complexity: "Medium"
      }
    ],
    successIndicators: [
      "سرعة إنشاء الحساب والبدء في الاستخدام (أقل من دقيقتين)",
      "سهولة تتبع الأهداف الإجمالية عبر مؤشر التقدم البصري",
      "تفاعل لا يقل عن 3 مرات أسبوعياً من الفئة المستهدفة"
    ],
    roadmap: [
      {
        phaseName: "الترقية للمرحلة 1: إطلاق منتج MVP",
        timeline: "الأسابيع 1-4",
        deliverables: ["واجهة التحكم الأساسية", "نظام تسجيل الدخول الأولي", "قاعدة البيانات المحلية الفورية"]
      },
      {
        phaseName: "الترقية للمرحلة 2: تعزيز التفاعل والاتصال",
        timeline: "الأسابيع 5-8",
        deliverables: ["الإشعارات الذكية والرسائل الفورية", "ربط البيانات بالحسابات المتعددة", "دعم اللغتين العربية والإنجليزية"]
      },
      {
        phaseName: "الترقية للمرحلة 3: الذكاء والتوسع الكبير",
        timeline: "الأسابيع 9-12",
        deliverables: ["نظام تحليلات متقدم بالذكاء الاصطناعي", "أنظمة الاشتراكات والمدفوعات الآمنة", "تطبيق الهواتف المتكامل لنظامي iOS و Android"]
      }
    ],
    wireframeLayout: {
      description: "تصميم لوحة بانتو (Bento Grid) متجاوبة تعرض ملخص البيانات في الأعلى متبوعاً بقائمة المهام والرسوم البيانية المباشرة.",
      components: [
        { id: "comp-1", title: "ترويحة التطبيق والملف الشخصي", type: "header", colSpan: "full", details: "توفر وصولاً سريعاً لإعدادات الملف الشخصي وشريط بحث مدمج ذكي لتصفح البيانات بسرعة." },
        { id: "comp-2", title: "مؤشرات النجاح والعدادات السريعة", type: "metrics", colSpan: "2", details: "مكعبات تفاعلية تعرض حالة العمليات والنسب المئوية المحققة اليوم." },
        { id: "comp-3", title: "مخطط الأداء التفاعلي", type: "chart", colSpan: "2", details: "رسم بياني خطي يبين وتيرة التقدم والمقارنة مع الفترات السابقة." },
        { id: "comp-4", title: "جدول الأعمال وقائمة المتطلبات الأساسية", type: "list", colSpan: "3", details: "عرض تفاعلي يدعم تحديد حالة المهام، الإضافة والحذف السريع." },
        { id: "comp-5", title: "شريط المبيعات والإجراءات السريعة", type: "input", colSpan: "1", details: "أزرار عمل سريعة مع حقل إدخال ذكي لإضافة عناصر وملاحظات فورية." }
      ]
    }
  };
}

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
} else {
  console.warn("Warning: GEMINI_API_KEY is not defined in the environment. Application will run in developer mock mode.");
}

// API Route to generate the blueprint
app.post("/api/generate-blueprint", async (req, res) => {
  const { appIdea, platform, vibe, industry } = req.body;

  if (!appIdea) {
    return res.status(400).json({ error: "الرجاء إدخال فكرة التطبيق أولاً." });
  }

  // Developer mock mode if API Key is not configured
  if (!ai) {
    // Generate simulated response for development fallback
    return res.json(buildMockBlueprint(appIdea));
  }

  try {
    const prompt = `أنت خبير واستشاري عالمي في هندسة البرمجيات وتصميم تجارب المستخدم وتطبيقات الويب والمحمول الناجحة. 
يود المستخدم إنشاء تطبيق جديد. فكرة التطبيق هي: "${appIdea}".
المنصة المستهدفة: "${platform || 'ويب وموبايل'}".
طابع الفكرة وتصميمها (العواطف والمظهر): "${vibe || 'عصري وبسيط'}".
القطاع الصناعي للمشروع: "${industry || 'تقنية عامة'}".

قم بصياغة دراسة متكاملة وممتعة ومؤتمتة لهذا التطبيق المقترح لتوجيهه للنجاح.
قم بالاستجابة باللغة العربية الفصحى حصراً وبنية JSON مطابقة تماماً للمواصفات المرفقة بـ responseSchema.

يرجى الالتزام التام بالتعليمات التالية لتحديد شكل المكونات:
- في wireframeLayout.components، اختر أنواع مكونات (type) من بين التالية حصراً: "header" أو "hero" أو "grid" أو "list" أو "input" ou "metrics" أو "chart" أو "map" أو "footer".
- في wireframeLayout.components، اختر colSpan من بين التالية حصراً لتناسب نظام بانتو جريد: "1" أو "2" أو "3" أو "4" أو "full".
- اجعل أسماء الميزات والمهام عملية، جذابة، وحقيقية تناسب الفكرة، وتجنب تماماً التكرار.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            appNameAr: { type: Type.STRING, description: "Suggested name in Arabic, high quality and creative" },
            appNameEn: { type: Type.STRING, description: "Suggested name in English, relevant" },
            catchphrase: { type: Type.STRING, description: "An eye-catching, creative slogan/catchphrase in Arabic" },
            problemSolved: { type: Type.STRING, description: "Detailed explanation of the main user pain point this app solves" },
            audience: { type: Type.STRING, description: "The specific target group that will love this app" },
            brandVibe: { type: Type.STRING, description: "Suggested UI theme, visual directions, typography guidelines and style" },
            mvpFeatures: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: "Actionable name in Arabic" },
                  description: { type: Type.STRING, description: "Explains how it works and its value to the user" },
                  impact: { type: Type.STRING, description: "High, Medium, or Low" },
                  complexity: { type: Type.STRING, description: "High, Medium, or Low" }
                },
                required: ["title", "description", "impact", "complexity"]
              }
            },
            successIndicators: {
              type: Type.ARRAY,
              items: { type: Type.STRING, description: "Success metric, KPI or interaction goal that confirms app success" }
            },
            roadmap: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  phaseName: { type: Type.STRING, description: "e.g., المرحلة 1: تدشين الأساسيات (MVP)" },
                  timeline: { type: Type.STRING, description: "e.g., الأسابيع 1-4" },
                  deliverables: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING, description: "Deliverable item/core tasks" }
                  }
                },
                required: ["phaseName", "timeline", "deliverables"]
              }
            },
            wireframeLayout: {
              type: Type.OBJECT,
              properties: {
                description: { type: Type.STRING, description: "Brief visual concept layout description" },
                components: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING, description: "Unique ID like comp-1, comp-2..." },
                      title: { type: Type.STRING, description: "Component logical name" },
                      type: { type: Type.STRING, description: "One of: header, hero, grid, list, input, metrics, chart, map, footer" },
                      colSpan: { type: Type.STRING, description: "One of: 1, 2, 3, 4, full" },
                      details: { type: Type.STRING, description: "Interaction detail, and data displayed inside this wireframe card" }
                    },
                    required: ["id", "title", "type", "colSpan", "details"]
                  }
                }
              },
              required: ["description", "components"]
            }
          },
          required: [
            "appNameAr",
            "appNameEn",
            "catchphrase",
            "problemSolved",
            "audience",
            "brandVibe",
            "mvpFeatures",
            "successIndicators",
            "roadmap",
            "wireframeLayout"
          ]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("لم يتم إرجاع أي رد من خادم الذكاء الاصطناعي.");
    }

    const result = JSON.parse(text.trim());
    return res.json(result);

  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    return res.status(500).json({
      error: "حدث خطأ أثناء الاتصال بالذكاء الاصطناعي لتصميم التطبيق. الرجاء المحاولة مرة أخرى.",
      details: error.message
    });
  }
});

// Setup Vite Dev Server / Static Hosting
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development middleware integrated successfully.");
  } else {
    // Production settings
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving static production build from dist.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Smart App Blueprint server running on port ${PORT}`);
  });
}

// Only auto-start the server when executed directly (not when imported by tests).
const isDirectRun =
  typeof process.argv[1] === "string" &&
  /server\.(ts|cjs|js)$/.test(process.argv[1]);

if (isDirectRun) {
  startServer();
}
