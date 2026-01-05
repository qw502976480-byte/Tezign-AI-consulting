import { LibraryItem } from './types';

// Helper to generate some dummy content
const genContent = (title: string, type: string) => [
  { type: 'p' as const, content: `${type}: ${title} - This is a summary of the content. In a real application, this would contain the full detailed text of the article or case study.` },
  { type: 'h2' as const, content: "Key Insights" },
  { type: 'p' as const, content: "We observed significant shifts in how organizations are approaching this topic. The integration of AI tools has moved from experimental pilots to core business workflows." },
  { type: 'quote' as const, content: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
  { type: 'metrics' as const, items: [{ label: 'Impact', value: 'High', sub: 'Strategic' }, { label: 'Timeframe', value: 'Q1 2026', sub: 'Implementation' }] }
];

// --- CN Data ---

const casesCn: LibraryItem[] = [
  { slug: 'aurora-growth', type: 'case', title: "Aurora：从消费者信号构建增长引擎", subtitle: "一家品牌如何将分散的用户反馈转化为可持续运行的 AI 工作方式。", updatedAt: "2026-01-04", readTime: "8", tags: ["Case Study"], clientIntro: "某全球知名食品饮料品牌。", coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1cUN0.jpeg", contentBlocks: genContent("Aurora", "Case") },
  { slug: 'new-product-decision', type: 'case', title: "让 AI 进入新品决策的第一步", subtitle: "一次关于“哪些判断值得交给 AI”的实践探索。", updatedAt: "2025-12-18", readTime: "7", tags: ["Case Study"], clientIntro: "国内领先零售企业。", coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1cTog.jpeg", contentBlocks: genContent("New Product", "Case") },
  { slug: 'content-production', type: 'case', title: "当内容生产不再依赖经验判断", subtitle: "AI 如何被引入日常内容决策流程。", updatedAt: "2026-02-02", readTime: "9", tags: ["Case Study"], clientIntro: "大型媒体集团。", coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1cSOO.jpeg", contentBlocks: genContent("Content Production", "Case") },
  { slug: 'pilot-to-ops', type: 'case', title: "从试点到运行：AI 如何真正被用起来", subtitle: "一次将 AI 从实验带入日常工作的过程。", updatedAt: "2026-01-22", readTime: "8", tags: ["Case Study"], clientIntro: "跨国科技公司。", coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1cvK6.jpeg", contentBlocks: genContent("Pilot to Ops", "Case") },
  { slug: 'early-demand', type: 'case', title: "AI 如何参与早期需求判断", subtitle: "在关键节点引入 AI，而不是在事后优化。", updatedAt: "2025-12-11", readTime: "6", tags: ["Case Study"], clientIntro: "新兴消费品牌。", coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1crep.jpeg", contentBlocks: genContent("Early Demand", "Case") },
  { slug: 'repeatable-decision', type: 'case', title: "建立可重复的 AI 决策机制", subtitle: "避免每一次判断都从零开始。", updatedAt: "2026-02-10", readTime: "7", tags: ["Case Study"], clientIntro: "金融服务机构。", coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1cju9.jpeg", contentBlocks: genContent("Repeatable Decision", "Case") },
  { slug: 'team-reliance', type: 'case', title: "当团队开始依赖 AI 做判断", subtitle: "人类角色如何随之发生变化。", updatedAt: "2026-01-14", readTime: "8", tags: ["Case Study"], clientIntro: "互联网独角兽。", coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1caQm.jpeg", contentBlocks: genContent("Team Reliance", "Case") },
  { slug: 'structured-signals', type: 'case', title: "从零散输入到结构化判断", subtitle: "AI 如何帮助团队识别真正重要的信号。", updatedAt: "2025-12-27", readTime: "6", tags: ["Case Study"], clientIntro: "市场研究公司。", coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1cZUF.jpeg", contentBlocks: genContent("Structured Signals", "Case") },
  { slug: 'way-of-working', type: 'case', title: "把 AI 当成工作方式，而不是工具", subtitle: "一次关于协作结构重构的实践。", updatedAt: "2026-02-18", readTime: "9", tags: ["Case Study"], clientIntro: "创意设计机构。", coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1cCYX.jpeg", contentBlocks: genContent("Way of Working", "Case") },
  { slug: 'beyond-pilot', type: 'case', title: "为什么这个 AI 项目没有停在试点阶段", subtitle: "运行机制设计比模型选择更重要。", updatedAt: "2026-01-30", readTime: "7", tags: ["Case Study"], clientIntro: "传统制造业巨头。", coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1c7gU.jpeg", contentBlocks: genContent("Beyond Pilot", "Case") },
];

const reportsCn: LibraryItem[] = [
  { slug: 'why-pilots-fail', type: 'report', title: "为什么 AI 项目常常停在试点阶段", subtitle: "问题并不在技术本身。", updatedAt: "2026-01-08", readTime: "6", tags: ["Report"], coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1c0yH.jpeg", contentBlocks: genContent("Why Pilots Fail", "Report") },
  { slug: 'professional-judgment', type: 'report', title: "AI 正在改变专业判断的形成方式", subtitle: "判断不再只来自经验或直觉。", updatedAt: "2025-12-20", readTime: "7", tags: ["Report"], coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1jNtN.jpeg", contentBlocks: genContent("Professional Judgment", "Report") },
  { slug: 'decision-chain', type: 'report', title: "当 AI 进入决策链路，会发生什么变化", subtitle: "从辅助分析到参与判断。", updatedAt: "2026-02-05", readTime: "8", tags: ["Report"], coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1j3eA.jpeg", contentBlocks: genContent("Decision Chain", "Report") },
  { slug: 'ai-native-consulting', type: 'report', title: "AI-native consulting 正在出现", subtitle: "一种不同于传统咨询的新形态。", updatedAt: "2026-01-16", readTime: "6", tags: ["Report"], coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1j1f4.jpeg", contentBlocks: genContent("AI Native Consulting", "Report") },
  { slug: 'using-ai-well', type: 'report', title: "为什么“用上 AI”并不等于“用好 AI”", subtitle: "运行方式决定最终价值。", updatedAt: "2025-12-29", readTime: "7", tags: ["Report"], coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1jBQq.jpeg", contentBlocks: genContent("Using AI Well", "Report") },
  { slug: 'rethinking-roles', type: 'report', title: "组织为何需要重新理解 AI 的角色", subtitle: "工具之外，AI 也是协作方。", updatedAt: "2026-02-14", readTime: "6", tags: ["Report"], coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1jt8x.jpeg", contentBlocks: genContent("Rethinking Roles", "Report") },
  { slug: 'scarcity-of-judgment', type: 'report', title: "判断正在成为稀缺能力", subtitle: "模型进步，并不会自动带来好决策。", updatedAt: "2026-01-26", readTime: "7", tags: ["Report"], coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1jr7h.jpeg", contentBlocks: genContent("Scarcity of Judgment", "Report") },
  { slug: 'impact-just-started', type: 'report', title: "AI 对工作方式的影响，才刚刚开始", subtitle: "真正的变化发生在日常协作中。", updatedAt: "2025-12-07", readTime: "6", tags: ["Report"], coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1cUN0.jpeg", contentBlocks: genContent("Impact Just Started", "Report") },
  { slug: 'value-shift', type: 'report', title: "从自动化到判断支持", subtitle: "AI 价值重心正在发生转移。", updatedAt: "2026-02-22", readTime: "7", tags: ["Report"], coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1cTog.jpeg", contentBlocks: genContent("Value Shift", "Report") },
  { slug: 'measuring-value', type: 'report', title: "为什么 AI 的长期价值难以衡量", subtitle: "短期指标掩盖了运行问题。", updatedAt: "2026-01-03", readTime: "8", tags: ["Report"], coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1cSOO.jpeg", contentBlocks: genContent("Measuring Value", "Report") },
];

const methodsCn: LibraryItem[] = [
  { slug: 'evaluating-scenarios', type: 'methodology', title: "如何判断一个 AI 场景是否值得投入", subtitle: "从价值、频率与风险三个维度出发。", updatedAt: "2025-12-15", readTime: "8", tags: ["Methodology"], coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1cvK6.jpeg", contentBlocks: genContent("Evaluating Scenarios", "Methodology") },
  { slug: 'diagnosis-principles', type: 'methodology', title: "AI 场景诊断的核心原则", subtitle: "避免把精力投入到低价值尝试中。", updatedAt: "2026-01-11", readTime: "7", tags: ["Methodology"], coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1crep.jpeg", contentBlocks: genContent("Diagnosis Principles", "Methodology") },
  { slug: 'human-ai-collab', type: 'methodology', title: "设计人 × AI 协作关系的基本方法", subtitle: "清晰分工比能力强弱更重要。", updatedAt: "2026-02-01", readTime: "6", tags: ["Methodology"], coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1cju9.jpeg", contentBlocks: genContent("Human AI Collab", "Methodology") },
  { slug: 'design-as-workflow', type: 'methodology', title: "为什么 AI 需要被设计成工作方式", subtitle: "而不仅仅是被部署。", updatedAt: "2025-12-23", readTime: "7", tags: ["Methodology"], coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1caQm.jpeg", contentBlocks: genContent("Design as Workflow", "Methodology") },
  { slug: 'runnable-systems', type: 'methodology', title: "构建可运行 AI 系统的关键要素", subtitle: "运行机制决定成败。", updatedAt: "2026-01-19", readTime: "8", tags: ["Methodology"], coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1cZUF.jpeg", contentBlocks: genContent("Runnable Systems", "Methodology") },
  { slug: 'step-evolution', type: 'methodology', title: "如何让 AI 在组织中逐步演进", subtitle: "避免激进替换带来的阻力。", updatedAt: "2026-02-09", readTime: "6", tags: ["Methodology"], coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1cCYX.jpeg", contentBlocks: genContent("Step Evolution", "Methodology") },
  { slug: 'systematic-judgment', type: 'methodology', title: "判断力如何被系统化", subtitle: "AI 并不会自动带来好判断。", updatedAt: "2025-12-05", readTime: "7", tags: ["Methodology"], coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1c7gU.jpeg", contentBlocks: genContent("Systematic Judgment", "Methodology") },
  { slug: 'continuous-running', type: 'methodology', title: "从一次性交付到持续运行", subtitle: "重新理解 AI 项目的成功标准。", updatedAt: "2026-01-27", readTime: "8", tags: ["Methodology"], coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1c0yH.jpeg", contentBlocks: genContent("Continuous Running", "Methodology") },
  { slug: 'workflow-myths', type: 'methodology', title: "AI 工作方式设计中的常见误区", subtitle: "多数问题源于结构，而非模型。", updatedAt: "2026-02-17", readTime: "7", tags: ["Methodology"], coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1jNtN.jpeg", contentBlocks: genContent("Workflow Myths", "Methodology") },
  { slug: 'running-success', type: 'methodology', title: "如何判断 AI 是否真正“跑起来了”", subtitle: "关注使用与影响，而不是功能。", updatedAt: "2026-01-06", readTime: "6", tags: ["Methodology"], coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1j3eA.jpeg", contentBlocks: genContent("Running Success", "Methodology") },
];

const announcementsCn: LibraryItem[] = [
  { slug: 'launch-consulting', type: 'announcement', title: "Tezign AI Consulting 正式发布", subtitle: "以“从问题到运行”为核心的专业服务。", updatedAt: "2026-01-05", readTime: "3", tags: ["Announcement"], coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1j1f4.jpeg", contentBlocks: genContent("Launch Consulting", "Announcement") },
  { slug: 'resource-page-live', type: 'announcement', title: "全新资源页正式上线", subtitle: "系统呈现 AI 如何进入真实业务。", updatedAt: "2025-12-12", readTime: "2", tags: ["Announcement"], coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1jBQq.jpeg", contentBlocks: genContent("Resource Page Live", "Announcement") },
  { slug: 'diagnosis-open', type: 'announcement', title: "AI 场景诊断方法对外开放", subtitle: "帮助团队识别高价值 AI 机会。", updatedAt: "2026-02-03", readTime: "3", tags: ["Announcement"], coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1jt8x.jpeg", contentBlocks: genContent("Diagnosis Open", "Announcement") },
  { slug: 'demo-booking', type: 'announcement', title: "全新 Demo 体验现已开放预约", subtitle: "展示 AI 如何参与真实工作。", updatedAt: "2026-01-18", readTime: "2", tags: ["Announcement"], coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1jr7h.jpeg", contentBlocks: genContent("Demo Booking", "Announcement") },
  { slug: 'research-published', type: 'announcement', title: "Tezign 发布最新研究成果", subtitle: "聚焦 AI 工作方式的长期影响。", updatedAt: "2025-12-28", readTime: "4", tags: ["Announcement"], coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1cUN0.jpeg", contentBlocks: genContent("Research Published", "Announcement") },
  { slug: 'roundtable', type: 'announcement', title: "AI-native consulting 圆桌讨论举行", subtitle: "围绕运行机制展开交流。", updatedAt: "2026-02-12", readTime: "3", tags: ["Announcement"], coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1cTog.jpeg", contentBlocks: genContent("Roundtable", "Announcement") },
  { slug: 'product-update', type: 'announcement', title: "产品能力持续更新", subtitle: "进一步强化运行与协作设计。", updatedAt: "2026-01-25", readTime: "2", tags: ["Announcement"], coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1cSOO.jpeg", contentBlocks: genContent("Product Update", "Announcement") },
  { slug: 'new-cases-added', type: 'announcement', title: "新一批案例已加入资源库", subtitle: "展示 AI 在不同情境下的运行方式。", updatedAt: "2025-12-08", readTime: "3", tags: ["Announcement"], coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1cvK6.jpeg", contentBlocks: genContent("New Cases Added", "Announcement") },
  { slug: 'service-expansion', type: 'announcement', title: "Tezign 拓展 AI Consulting 服务范围", subtitle: "支持更多复杂业务场景。", updatedAt: "2026-02-20", readTime: "3", tags: ["Announcement"], coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1crep.jpeg", contentBlocks: genContent("Service Expansion", "Announcement") },
  { slug: '2026-planning', type: 'announcement', title: "2026 年资源规划发布", subtitle: "聚焦判断、协作与运行。", updatedAt: "2026-01-02", readTime: "2", tags: ["Announcement"], coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1cju9.jpeg", contentBlocks: genContent("2026 Planning", "Announcement") },
];

// --- EN Data (Real Translations) ---

const casesEn: LibraryItem[] = [
  { slug: 'aurora-growth', type: 'case', title: "Aurora: Building a Growth Engine from Consumer Signals", subtitle: "How a brand transformed scattered user feedback into a sustainable AI way of working.", updatedAt: "2026-01-04", readTime: "8", tags: ["Case Study"], clientIntro: "A global food & beverage brand.", coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1cUN0.jpeg", contentBlocks: genContent("Aurora", "Case") },
  { slug: 'new-product-decision', type: 'case', title: "The First Step to Letting AI Decide on New Products", subtitle: "An exploration of which judgments are worth handing over to AI.", updatedAt: "2025-12-18", readTime: "7", tags: ["Case Study"], clientIntro: "Leading domestic retail enterprise.", coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1cTog.jpeg", contentBlocks: genContent("New Product", "Case") },
  { slug: 'content-production', type: 'case', title: "When Content Production No Longer Relies on Experience", subtitle: "How AI is introduced into daily content decision workflows.", updatedAt: "2026-02-02", readTime: "9", tags: ["Case Study"], clientIntro: "Large media group.", coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1cSOO.jpeg", contentBlocks: genContent("Content Production", "Case") },
  { slug: 'pilot-to-ops', type: 'case', title: "From Pilot to Operations: How AI is Really Used", subtitle: "The process of bringing AI from experiment to daily work.", updatedAt: "2026-01-22", readTime: "8", tags: ["Case Study"], clientIntro: "Multinational tech company.", coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1cvK6.jpeg", contentBlocks: genContent("Pilot to Ops", "Case") },
  { slug: 'early-demand', type: 'case', title: "How AI Participates in Early Demand Judgment", subtitle: "Introducing AI at critical nodes instead of optimizing afterwards.", updatedAt: "2025-12-11", readTime: "6", tags: ["Case Study"], clientIntro: "Emerging consumer brand.", coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1crep.jpeg", contentBlocks: genContent("Early Demand", "Case") },
  { slug: 'repeatable-decision', type: 'case', title: "Building a Repeatable AI Decision Mechanism", subtitle: "Avoiding starting from scratch for every judgment.", updatedAt: "2026-02-10", readTime: "7", tags: ["Case Study"], clientIntro: "Financial services institution.", coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1cju9.jpeg", contentBlocks: genContent("Repeatable Decision", "Case") },
  { slug: 'team-reliance', type: 'case', title: "When Teams Start Relying on AI for Judgments", subtitle: "How human roles change accordingly.", updatedAt: "2026-01-14", readTime: "8", tags: ["Case Study"], clientIntro: "Internet unicorn.", coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1caQm.jpeg", contentBlocks: genContent("Team Reliance", "Case") },
  { slug: 'structured-signals', type: 'case', title: "From Scattered Inputs to Structured Judgments", subtitle: "How AI helps teams identify truly important signals.", updatedAt: "2025-12-27", readTime: "6", tags: ["Case Study"], clientIntro: "Market research firm.", coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1cZUF.jpeg", contentBlocks: genContent("Structured Signals", "Case") },
  { slug: 'way-of-working', type: 'case', title: "Treating AI as a Way of Working, Not Just a Tool", subtitle: "A practice in restructuring collaboration.", updatedAt: "2026-02-18", readTime: "9", tags: ["Case Study"], clientIntro: "Creative design agency.", coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1cCYX.jpeg", contentBlocks: genContent("Way of Working", "Case") },
  { slug: 'beyond-pilot', type: 'case', title: "Why This AI Project Didn't Stop at the Pilot Phase", subtitle: "Operating mechanism design is more important than model selection.", updatedAt: "2026-01-30", readTime: "7", tags: ["Case Study"], clientIntro: "Traditional manufacturing giant.", coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1c7gU.jpeg", contentBlocks: genContent("Beyond Pilot", "Case") },
];

const reportsEn: LibraryItem[] = [
  { slug: 'why-pilots-fail', type: 'report', title: "Why AI Projects Often Stop at Pilot Phase", subtitle: "The problem is not the technology itself.", updatedAt: "2026-01-08", readTime: "6", tags: ["Report"], coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1c0yH.jpeg", contentBlocks: genContent("Why Pilots Fail", "Report") },
  { slug: 'professional-judgment', type: 'report', title: "AI is Changing How Professional Judgment is Formed", subtitle: "Judgment no longer comes only from experience or intuition.", updatedAt: "2025-12-20", readTime: "7", tags: ["Report"], coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1jNtN.jpeg", contentBlocks: genContent("Professional Judgment", "Report") },
  { slug: 'decision-chain', type: 'report', title: "What Happens When AI Enters the Decision Chain", subtitle: "From auxiliary analysis to participating in judgment.", updatedAt: "2026-02-05", readTime: "8", tags: ["Report"], coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1j3eA.jpeg", contentBlocks: genContent("Decision Chain", "Report") },
  { slug: 'ai-native-consulting', type: 'report', title: "AI-native Consulting is Emerging", subtitle: "A new form different from traditional consulting.", updatedAt: "2026-01-16", readTime: "6", tags: ["Report"], coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1j1f4.jpeg", contentBlocks: genContent("AI Native Consulting", "Report") },
  { slug: 'using-ai-well', type: 'report', title: "Why 'Using AI' Doesn't Mean 'Using AI Well'", subtitle: "Operating methods determine final value.", updatedAt: "2025-12-29", readTime: "7", tags: ["Report"], coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1jBQq.jpeg", contentBlocks: genContent("Using AI Well", "Report") },
  { slug: 'rethinking-roles', type: 'report', title: "Why Organizations Need to Rethink AI's Role", subtitle: "Beyond a tool, AI is also a collaborator.", updatedAt: "2026-02-14", readTime: "6", tags: ["Report"], coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1jt8x.jpeg", contentBlocks: genContent("Rethinking Roles", "Report") },
  { slug: 'scarcity-of-judgment', type: 'report', title: "Judgment is Becoming a Scarce Capability", subtitle: "Model progress doesn't automatically bring good decisions.", updatedAt: "2026-01-26", readTime: "7", tags: ["Report"], coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1jr7h.jpeg", contentBlocks: genContent("Scarcity of Judgment", "Report") },
  { slug: 'impact-just-started', type: 'report', title: "AI's Impact on Ways of Working Has Just Begun", subtitle: "Real change happens in daily collaboration.", updatedAt: "2025-12-07", readTime: "6", tags: ["Report"], coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1cUN0.jpeg", contentBlocks: genContent("Impact Just Started", "Report") },
  { slug: 'value-shift', type: 'report', title: "From Automation to Judgment Support", subtitle: "The center of AI value is shifting.", updatedAt: "2026-02-22", readTime: "7", tags: ["Report"], coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1cTog.jpeg", contentBlocks: genContent("Value Shift", "Report") },
  { slug: 'measuring-value', type: 'report', title: "Why AI's Long-term Value is Hard to Measure", subtitle: "Short-term metrics mask operating problems.", updatedAt: "2026-01-03", readTime: "8", tags: ["Report"], coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1cSOO.jpeg", contentBlocks: genContent("Measuring Value", "Report") },
];

const methodsEn: LibraryItem[] = [
  { slug: 'evaluating-scenarios', type: 'methodology', title: "How to Judge if an AI Scenario is Worth Investing In", subtitle: "Starting from value, frequency, and risk.", updatedAt: "2025-12-15", readTime: "8", tags: ["Methodology"], coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1cvK6.jpeg", contentBlocks: genContent("Evaluating Scenarios", "Methodology") },
  { slug: 'diagnosis-principles', type: 'methodology', title: "Core Principles of AI Scenario Diagnosis", subtitle: "Avoid putting energy into low-value attempts.", updatedAt: "2026-01-11", readTime: "7", tags: ["Methodology"], coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1crep.jpeg", contentBlocks: genContent("Diagnosis Principles", "Methodology") },
  { slug: 'human-ai-collab', type: 'methodology', title: "Basic Methods for Designing Human x AI Collaboration", subtitle: "Clear division of labor is more important than capability strength.", updatedAt: "2026-02-01", readTime: "6", tags: ["Methodology"], coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1cju9.jpeg", contentBlocks: genContent("Human AI Collab", "Methodology") },
  { slug: 'design-as-workflow', type: 'methodology', title: "Why AI Needs to be Designed as a Way of Working", subtitle: "And not just deployed.", updatedAt: "2025-12-23", readTime: "7", tags: ["Methodology"], coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1caQm.jpeg", contentBlocks: genContent("Design as Workflow", "Methodology") },
  { slug: 'runnable-systems', type: 'methodology', title: "Key Elements of Building Runnable AI Systems", subtitle: "Operating mechanism determines success or failure.", updatedAt: "2026-01-19", readTime: "8", tags: ["Methodology"], coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1cZUF.jpeg", contentBlocks: genContent("Runnable Systems", "Methodology") },
  { slug: 'step-evolution', type: 'methodology', title: "How to Let AI Evolve Gradually in Organizations", subtitle: "Avoiding resistance from radical replacement.", updatedAt: "2026-02-09", readTime: "6", tags: ["Methodology"], coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1cCYX.jpeg", contentBlocks: genContent("Step Evolution", "Methodology") },
  { slug: 'systematic-judgment', type: 'methodology', title: "How Judgment Can Be Systematized", subtitle: "AI won't automatically bring good judgment.", updatedAt: "2025-12-05", readTime: "7", tags: ["Methodology"], coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1c7gU.jpeg", contentBlocks: genContent("Systematic Judgment", "Methodology") },
  { slug: 'continuous-running', type: 'methodology', title: "From One-off Delivery to Continuous Running", subtitle: "Redefining the success criteria of AI projects.", updatedAt: "2026-01-27", readTime: "8", tags: ["Methodology"], coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1c0yH.jpeg", contentBlocks: genContent("Continuous Running", "Methodology") },
  { slug: 'workflow-myths', type: 'methodology', title: "Common Myths in AI Workflow Design", subtitle: "Most problems stem from structure, not models.", updatedAt: "2026-02-17", readTime: "7", tags: ["Methodology"], coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1jNtN.jpeg", contentBlocks: genContent("Workflow Myths", "Methodology") },
  { slug: 'running-success', type: 'methodology', title: "How to Judge if AI is Truly 'Running'", subtitle: "Focus on usage and impact, not functionality.", updatedAt: "2026-01-06", readTime: "6", tags: ["Methodology"], coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1j3eA.jpeg", contentBlocks: genContent("Running Success", "Methodology") },
];

const announcementsEn: LibraryItem[] = [
  { slug: 'launch-consulting', type: 'announcement', title: "Tezign AI Consulting Officially Launched", subtitle: "Professional services centered on 'From Problem to Running'.", updatedAt: "2026-01-05", readTime: "3", tags: ["Announcement"], coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1j1f4.jpeg", contentBlocks: genContent("Launch Consulting", "Announcement") },
  { slug: 'resource-page-live', type: 'announcement', title: "New Resource Page Officially Live", subtitle: "Systematically presenting how AI enters real business.", updatedAt: "2025-12-12", readTime: "2", tags: ["Announcement"], coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1jBQq.jpeg", contentBlocks: genContent("Resource Page Live", "Announcement") },
  { slug: 'diagnosis-open', type: 'announcement', title: "AI Scenario Diagnosis Method Opened to Public", subtitle: "Helping teams identify high-value AI opportunities.", updatedAt: "2026-02-03", readTime: "3", tags: ["Announcement"], coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1jt8x.jpeg", contentBlocks: genContent("Diagnosis Open", "Announcement") },
  { slug: 'demo-booking', type: 'announcement', title: "New Demo Experience Now Open for Booking", subtitle: "Showcasing how AI participates in real work.", updatedAt: "2026-01-18", readTime: "2", tags: ["Announcement"], coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1jr7h.jpeg", contentBlocks: genContent("Demo Booking", "Announcement") },
  { slug: 'research-published', type: 'announcement', title: "Tezign Releases Latest Research Findings", subtitle: "Focusing on the long-term impact of AI ways of working.", updatedAt: "2025-12-28", readTime: "4", tags: ["Announcement"], coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1cUN0.jpeg", contentBlocks: genContent("Research Published", "Announcement") },
  { slug: 'roundtable', type: 'announcement', title: "AI-native Consulting Roundtable Held", subtitle: "Exchange centered around operating mechanisms.", updatedAt: "2026-02-12", readTime: "3", tags: ["Announcement"], coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1cTog.jpeg", contentBlocks: genContent("Roundtable", "Announcement") },
  { slug: 'product-update', type: 'announcement', title: "Product Capabilities Continuously Updated", subtitle: "Further strengthening running and collaboration design.", updatedAt: "2026-01-25", readTime: "2", tags: ["Announcement"], coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1cSOO.jpeg", contentBlocks: genContent("Product Update", "Announcement") },
  { slug: 'new-cases-added', type: 'announcement', title: "New Batch of Case Studies Added to Library", subtitle: "Showcasing AI operating modes in different contexts.", updatedAt: "2025-12-08", readTime: "3", tags: ["Announcement"], coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1cvK6.jpeg", contentBlocks: genContent("New Cases Added", "Announcement") },
  { slug: 'service-expansion', type: 'announcement', title: "Tezign Expands AI Consulting Service Scope", subtitle: "Supporting more complex business scenarios.", updatedAt: "2026-02-20", readTime: "3", tags: ["Announcement"], coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1crep.jpeg", contentBlocks: genContent("Service Expansion", "Announcement") },
  { slug: '2026-planning', type: 'announcement', title: "2026 Resource Planning Released", subtitle: "Focusing on judgment, collaboration, and running.", updatedAt: "2026-01-02", readTime: "2", tags: ["Announcement"], coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1cju9.jpeg", contentBlocks: genContent("2026 Planning", "Announcement") },
];

// --- Search Logic ---
// Combine all CN and EN items to build a bilingual index
const allCnItems = [...casesCn, ...reportsCn, ...methodsCn, ...announcementsCn];
const allEnItems = [...casesEn, ...reportsEn, ...methodsEn, ...announcementsEn];

const bilingualIndex = allCnItems.map(cnItem => {
  const enItem = allEnItems.find(i => i.slug === cnItem.slug);
  // Fallback if EN item missing (though they match 1:1 in this mock data)
  const enTitle = enItem?.title.toLowerCase() || '';
  const enSubtitle = enItem?.subtitle.toLowerCase() || '';
  const enTags = enItem?.tags.join(' ').toLowerCase() || '';
  
  const cnTitle = cnItem.title.toLowerCase();
  const cnSubtitle = cnItem.subtitle.toLowerCase();
  const cnTags = cnItem.tags.join(' ').toLowerCase();

  return {
    slug: cnItem.slug,
    cnTitle,
    enTitle,
    fullText: `${cnTitle} ${cnSubtitle} ${cnTags} ${enTitle} ${enSubtitle} ${enTags}`
  };
});

export const searchLibrary = (query: string): string[] => {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  const scored = bilingualIndex.map(item => {
    let score = 0;
    // High priority: Title match
    if (item.cnTitle.includes(q) || item.enTitle.includes(q)) {
      score += 10;
    }
    // Medium priority: Full text match
    if (item.fullText.includes(q)) {
      score += 1;
    }
    return { slug: item.slug, score };
  });

  // Filter out non-matches and sort by score
  return scored
    .filter(i => i.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(i => i.slug);
};

export const getData = (lang: 'en' | 'cn') => {
  if (lang === 'cn') {
    return {
      cases: casesCn,
      reports: reportsCn,
      methodologies: methodsCn,
      announcements: announcementsCn,
      // Helper to return all mixed for specific needs
      all: [...casesCn, ...reportsCn, ...methodsCn, ...announcementsCn]
    };
  } else {
    return {
      cases: casesEn,
      reports: reportsEn,
      methodologies: methodsEn,
      announcements: announcementsEn,
      all: [...casesEn, ...reportsEn, ...methodsEn, ...announcementsEn]
    };
  }
};