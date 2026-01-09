import { LibraryItem } from './types';

// Helper to generate consistent layouts, but we will define specific blocks for each item below.
// This function is kept for fallback but mostly unused in the new data structure.
const genContent = (title: string, type: string) => [
  { type: 'p' as const, content: `${type}: ${title}` }
];

// --- CN Data (Based on PDF) ---

const casesCn: LibraryItem[] = [
  { 
    slug: 'manufacturing-innovation-radar', 
    type: 'case', 
    title: "构建“创新雷达”：将概念迭代周期缩短至数小时", 
    subtitle: "某头部制造业如何利用 AI Agent 解决研发领域的“第一天难题”，实现系统化的信息扫描与聚焦。", 
    updatedAt: "2026-03-01", 
    readTime: "8", 
    tags: ["制造", "产品创新"], 
    clientIntro: "某头部制造业公司。", 
    coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1cUN0.jpeg", 
    contentBlocks: [
      { type: 'h2', content: "痛点：产品经理的信息消耗战" },
      { type: 'p', content: "许多企业面临的问题是产品创新的‘第一步’最难迈出。该公司的产品经理每天被数百篇行业报告、竞品动态和技术论文淹没。传统的创新流程始于一场艰苦的信息消耗战——团队花费数周时间搜集、阅读、试图从碎片中拼凑出趋势。结果往往是灵感枯竭，方向模糊，错过窗口。" },
      { type: 'h2', content: "解决方案：构建“创新雷达”与概念工作坊" },
      { type: 'p', content: "我们没有选择给企业一个单纯的信息工具，而是重新定义了创新流程。第一步是构建“创新雷达”。我们定义了核心观测维度（技术、竞品、用户、供应链），随后专属的 AI 智能体 7x24 小时在这些领域自动完成信息抓取、关联与可信度校验。" },
      { type: 'p', content: "第二步是“产品概念工作坊”。每周，AI 会生成一份《机会报告》，指出高潜力信号（如“AVC模型在汽车座舱应用升温”）。我们引导产品团队围绕高浓度信号进行深度讨论，AI 同步在场，实时生成概念草图和可行性分析。" },
      { type: 'quote', content: "传统流程是“人海搜寻+头脑风暴”，而 AI 的工作流应该是“系统扫描信息+人机共创产品概念”。" },
      { type: 'metrics', items: [{ label: '研发时间节省', value: '70%' }, { label: '单品类节省', value: '数百万', sub: '研发费用' }, { label: '迭代周期', value: '数小时', sub: '从数周缩短' }] }
    ] 
  },
  { 
    slug: 'pharma-knowledge-management', 
    type: 'case', 
    title: "解锁“暗知识”：让企业知识库真正实现对话式调用", 
    subtitle: "从“建仓库”到“建大脑”，利用知识图谱重构分析师的工作流，决策响应从天级提升至分钟级。", 
    updatedAt: "2026-02-28", 
    readTime: "7", 
    tags: ["医药", "知识管理"], 
    clientIntro: "某头部医药企业。", 
    coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1cZUF.jpeg", 
    contentBlocks: [
      { type: 'h2', content: "痛点：价值连城却无法使用的宝藏" },
      { type: 'p', content: "每个企业都藏着“暗知识”，散落在项目报告、专家经验和会议纪要中。该医药企业的分析师每月分析全国连锁药店数据，需耗时超过600小时从十几个系统中提取整合数据。新人上手慢，专家离职知识清零，决策缺乏历史依据。" },
      { type: 'h2', content: "解决方案：构建企业级 AI 知识图谱" },
      { type: 'p', content: "传统知识管理是“建仓库”，往往建成了一座迷宫。而 AI 知识管理咨询的逻辑是“建大脑”。我们进行了知识资产战略审计，设计了“知识运营”流程，并构建了企业级 AI 知识图谱。" },
      { type: 'p', content: "关键步骤不是导入数据，而是重新设计知识流。现在，管理者只需提问：“请对比华南与华东地区，近两年我们产品在 KA 渠道的促销投入与销售额关联度。”1分钟内，一份带可视化图表和引用来源的报告即刻生成。" },
      { type: 'metrics', items: [{ label: '节省工时', value: '600h+', sub: '每月' }, { label: '决策响应', value: '分钟级', sub: '从天级提升' }] }
    ] 
  },
  { 
    slug: 'fmcg-consumer-insight', 
    type: 'case', 
    title: "告别静态问卷：利用合成用户实现实时市场洞察", 
    subtitle: "从“拍照”变为“直播”，通过 Proactive Agent 接管海量并发访谈，重塑百亿单品的决策依据。", 
    updatedAt: "2026-02-25", 
    readTime: "9", 
    tags: ["快消", "消费者洞察"], 
    clientIntro: "某头部消费品企业。", 
    coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1crep.jpeg", 
    contentBlocks: [
      { type: 'h2', content: "痛点：昂贵且过时的“静态照片”" },
      { type: 'p', content: "传统调研如同给市场拍一张静态照片：耗资百万、历时三个月、基于有限样本。当报告完成时，消费者的喜好可能已经改变。企业面临的困境是样本有限、成本高昂且难以触及深层的“为什么”。" },
      { type: 'h2', content: "解决方案：从“拍照”变为“直播”" },
      { type: 'p', content: "我们利用 Atypica 生成多维虚拟用户画像，混合真实样本发起调研。AI 咨询团队进行了“需求解构”，将模糊目标拆解为对核心人群动机、场景、支付意愿的深度探查。" },
      { type: 'p', content: "Proactive Agent 接管了执行层，模拟人群生成定制化问题，管理海量并发访谈。我们的分析师则从 AI 提炼的数据中，为客户解读出“健康升级而非功能替代”这样的核心战略机会点。" },
      { type: 'metrics', items: [{ label: '成本降低', value: '60%', sub: '对比传统调研' }, { label: '新品速度', value: '350%', sub: '提升率' }, { label: '洞察速度', value: '100x', sub: '并发处理' }] }
    ] 
  },
  { 
    slug: 'alcohol-channel-growth', 
    type: 'case', 
    title: "千亿级销售网络重塑：实现“创作-分发-激励”闭环", 
    subtitle: "利用 AI 内容引擎赋能数千名经销商，解决渠道数字化中“大水漫灌”的难题。", 
    updatedAt: "2026-02-20", 
    readTime: "8", 
    tags: ["酒业", "渠道增长"], 
    clientIntro: "某白酒龙头企业。", 
    coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1cju9.jpeg", 
    contentBlocks: [
      { type: 'h2', content: "痛点：渠道数字化中的“大水漫灌”" },
      { type: 'p', content: "在新媒体时代，终端门店和 KOC 的社交影响力至关重要。但品牌面临巨大挑战：经销商不擅长创作，内容质量粗糙，总部无法批量管理和激励这些分散的产出。传统“下达任务+微信群扩散”的模式效率极低，数据由于分散如同黑洞。" },
      { type: 'h2', content: "解决方案：以内容驱动的 AI 智能体" },
      { type: 'p', content: "我们将品牌诉求转化为 AI 可理解的维度（如画面质感、酒文化）。新工作流中，总部发布创意任务，经销商一键接入 AI 创作助手，输入想法即可生成高质量图文/视频。内容经 AI 初筛后发布，平台实时追踪数据并自动分配激励。" },
      { type: 'p', content: "在这个流程中，AI 扮演了创意生产者、质量守门员和效果分析师三个角色。这不仅是 IT 升级，更是业务竞争力的增长。" },
      { type: 'metrics', items: [{ label: '运营效率', value: '+75%' }, { label: '曝光量', value: '5000w+', sub: '深度绑定门店' }] }
    ] 
  },
  { 
    slug: 'real-estate-localization', 
    type: 'case', 
    title: "破解本地化悖论：让非设计员工秒级生成合规内容", 
    subtitle: "通过解码品牌基因与建立 AI 规则库，解决全球品牌“集中管控”与“敏捷需求”的根本冲突。", 
    updatedAt: "2026-02-15", 
    readTime: "6", 
    tags: ["地产", "内容战略"], 
    clientIntro: "全球化地产集团，拥有30多个品牌。", 
    coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1cSOO.jpeg", 
    contentBlocks: [
      { type: 'h2', content: "痛点：规模与统一的矛盾" },
      { type: 'p', content: "一线团队有紧急的本地化内容需求（如婚礼促销），求助总部需排队数周，自行创作则会导致品牌视觉走样。这是“集中管控”与“敏捷需求”之间的根本性冲突。" },
      { type: 'h2', content: "解决方案：品牌基因的 AI 解码" },
      { type: 'p', content: "我们将核心 IP 形象解构为组件库，并建立了 AI 可理解的色彩、字体、构图规则库。新流程中，员工在线选择场景/主题，AI 在规则内实时生成多版合规设计。关键在于，AI 不是在随机创作，而是在精密规则内进行无限次的组合与创新。" },
      { type: 'quote', content: "内容生产从‘天/周’级进入‘分钟’级。非设计员工成为更懂场景的设计师。" },
      { type: 'metrics', items: [{ label: '生产耗时', value: '<1 min', sub: '单次设计' }, { label: '品牌合规', value: '100%', sub: '规则控制' }] }
    ] 
  },
  { 
    slug: 'luxury-retail-compliance', 
    type: 'case', 
    title: "解放注意力：提升关键业务节点的决策判断力", 
    subtitle: "AI 视觉智能体如何帮助品牌完成 100% 的初筛与推荐，让团队聚焦真正的业务思考。", 
    updatedAt: "2026-02-10", 
    readTime: "6", 
    tags: ["奢侈品", "合规风控"], 
    clientIntro: "某奢侈品品牌营销团队。", 
    coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1caQm.jpeg", 
    contentBlocks: [
      { type: 'h2', content: "痛点：注意力资源的浪费" },
      { type: 'p', content: "市场部专员每天需要人工浏览数家门店导购在社交平台发布的内容，只为找出违规贴文或发现优质 UGC。这导致他们没有时间思考真正的推广策略，而是将注意力耗费在琐碎的细节中。" },
      { type: 'h2', content: "解决方案：智能决策 Agent" },
      { type: 'p', content: "我们将“何为优质”、“何为违规”的模糊标准转化为结构化的规则体系（如 Do & Don'ts 列表、色调偏好）。部署的智能决策 Agent 7x24 小时扫描帖子，进行毫秒级判断。它不仅能过滤违规，更能自动推荐最具潜力的优质内容供团队加热。" },
      { type: 'quote', content: "AI 完成 100% 的初筛与推荐，人类专家处理 1% 的复杂边界案例并优化规则。" },
      { type: 'metrics', items: [{ label: '初筛覆盖', value: '100%' }, { label: '人工介入', value: '1%', sub: '仅处理边界' }] }
    ] 
  }
];

const reportsCn: LibraryItem[] = [
  { 
    slug: 'middle-layer-trap', 
    type: 'report', 
    title: "为什么只买 AI 软件是不够的？", 
    subtitle: "工具公司卡在“三个错位”里，真正的挑战在于工具与结果之间的“中间那一层”。", 
    updatedAt: "2026-01-10", 
    readTime: "8", 
    tags: ["战略", "行业洞察"], 
    coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1c0yH.jpeg", 
    contentBlocks: [
      { type: 'h2', content: "工具公司的三个错位" },
      { type: 'p', content: "在与 200 家企业级用户的合作中，我们发现只把软件做出来并不等于 AI 能产生价值。工具公司往往面临三个错位：时间错位（产品迭代快 vs 组织改变慢）、视角错位（功能视角 vs 结果视角）、责任错位（交付工具 vs 交付结果）。" },
      { type: 'h2', content: "缺失的“中间层”" },
      { type: 'p', content: "如果只停留在工具层，其实是在绕开最难但也最关键的那一层：专业服务。即怎样用 AI 变革企业的生意，以及怎样用 AI 重新塑造做企业的组织和人。如果中间这层缺失，AI 就只能停在 PPT 和试点里。" },
      { type: 'quote', content: "工具解决的是‘能力缺口’，专业服务解决的是‘认知与组织缺口’。" }
    ] 
  }
];

const methodsCn: LibraryItem[] = [
  { 
    slug: 'ai-full-stack-model', 
    type: 'methodology', 
    title: "什么是 AI Full Stack 公司？", 
    subtitle: "未来的企业需要一套从工具、方法到训练的一体化能力。", 
    updatedAt: "2026-01-20", 
    readTime: "7", 
    tags: ["框架模型", "组织设计"], 
    coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1jNtN.jpeg", 
    contentBlocks: [
      { type: 'h2', content: "Full Stack 的三层结构" },
      { type: 'p', content: "第一层是工具层：把 AI 做成真正可用的基础设施（模型、数据、工作流）。第二层是业务层：用 AI 重写生意的剧本，设计内容如何驱动增长、产品如何被验证。第三层是人和组织层：帮 CEO 和团队回答“在 AI 时代，你的最高价值到底是什么？”" },
      { type: 'h3', content: "不仅是咨询，更是伙伴" },
      { type: 'p', content: "如果没有后两层，工具层大概率只会停留在一句话：“我们做了一个很厉害的系统，欢迎来用。” AI Full Stack 意味着我们不只交付软件，而是交付一套能跑起来的业务闭环。" }
    ] 
  },
  { 
    slug: 'change-management', 
    type: 'methodology', 
    title: "变革管理：AI 转型的本质是 Change Management", 
    subtitle: "生意不会自己变好，组织也不会自动变智能。真正要被升级的，是组织。", 
    updatedAt: "2026-01-25", 
    readTime: "6", 
    tags: ["变革管理", "领导力"], 
    coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1j3eA.jpeg", 
    contentBlocks: [
      { type: 'h2', content: "系统性地做三件事" },
      { type: 'p', content: "第一，给 CEO 和核心团队一部“组织新宪法”，重新定义人和 AI 的边界及最小价值闭环。第二，给业务团队举办“AI 共创营与黑客松”，围绕真实目标，工具当场用，第二天就上线试错。第三，给未来的中层与骨干进行“角色重置”，从协调者变成能设计工作流的设计者。" },
      { type: 'quote', content: "在这个意义上，培训不再是补技能，而是换身份。" }
    ] 
  }
];

const announcementsCn: LibraryItem[] = [
  { 
    slug: 'consulting-launch-offer', 
    type: 'announcement', 
    title: "Tezign AI Consulting 服务体系发布", 
    subtitle: "从诊断、部署到持续进化，我们提供全链路的 AI 转型支持。", 
    updatedAt: "2026-03-05", 
    readTime: "3", 
    tags: ["服务发布", "产品体系"], 
    coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1j1f4.jpeg", 
    contentBlocks: [
      { type: 'h2', content: "我们的服务模块" },
      { type: 'p', content: "1. AI 业务诊断与组织体检（2-4周）：精准定位企业级 AI 在现有组织内可实现的最高商业价值，产出策略一页纸与 AI 干预点图谱。" },
      { type: 'p', content: "2. AI 工作流设计与部署（4-6周）：将诊断洞察转化为可运行系统。包括竞品追踪 Agent、机会识别 Agent 等专属工作流系统的定制训练与部署。" },
      { type: 'p', content: "3. AI 组织进化与增长（按需持续）：确保系统持续进化，通过订阅制服务实现业务成果的持续达成。" }
    ] 
  }
];

// --- EN Data (Translated from Source) ---

const casesEn: LibraryItem[] = [
  { 
    slug: 'manufacturing-innovation-radar', 
    type: 'case', 
    title: "Building an 'Innovation Radar': Shortening Concept Iteration to Hours", 
    subtitle: "How a top manufacturer uses AI Agents to solve the 'Day One' problem of R&D, moving from weeks to hours.", 
    updatedAt: "2026-03-01", 
    readTime: "8", 
    tags: ["Manufacturing", "Product Innovation"], 
    clientIntro: "A leading manufacturing company.", 
    coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1cUN0.jpeg", 
    contentBlocks: [
      { type: 'h2', content: "Pain Point: The Information War of Product Managers" },
      { type: 'p', content: "A major issue companies face is that the 'first step' of product innovation is the hardest. Product managers are overwhelmed by hundreds of reports daily. The traditional process starts with an exhausting information war—collecting, reading, and piecing together trends, often resulting in missed windows." },
      { type: 'h2', content: "Solution: 'Innovation Radar' & Concept Workshops" },
      { type: 'p', content: "Instead of just an information tool, we redefined the innovation flow. First, we built an 'Innovation Radar' defining core dimensions (tech, competitors, users, supply chain). Dedicated AI agents monitor these areas 24/7." },
      { type: 'p', content: "Second, 'Product Concept Workshops'. Weekly, AI generates an 'Opportunity Report' identifying high-potential signals. We guide the team to discuss these signals deeply, with AI present to generate concept sketches and feasibility analyses in real-time." },
      { type: 'metrics', items: [{ label: 'R&D Time Saved', value: '70%' }, { label: 'Savings/Category', value: 'Millions', sub: 'R&D Expenses' }, { label: 'Cycle Time', value: 'Hours', sub: 'From Weeks' }] }
    ] 
  },
  { 
    slug: 'pharma-knowledge-management', 
    type: 'case', 
    title: "Unlocking 'Dark Knowledge': Making Knowledge Bases Conversational", 
    subtitle: "From 'Building Warehouses' to 'Building Brains': Transforming how analysts access data from days to minutes.", 
    updatedAt: "2026-02-28", 
    readTime: "7", 
    tags: ["Pharma", "Knowledge Management"], 
    clientIntro: "A leading pharmaceutical enterprise.", 
    coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1cZUF.jpeg", 
    contentBlocks: [
      { type: 'h2', content: "Pain Point: Buried Treasure" },
      { type: 'p', content: "Every company hides 'dark knowledge' in reports and expert experience. Analysts spent 600+ hours monthly manually extracting data from distinct systems. Turnover meant knowledge loss." },
      { type: 'h2', content: "Solution: Enterprise AI Knowledge Graph" },
      { type: 'p', content: "Traditional KM is like building a warehouse (a maze). AI KM is building a brain. We audited knowledge assets and designed a 'Knowledge Operations' flow, building an AI Knowledge Graph." },
      { type: 'p', content: "Managers can now simply ask complex comparative questions and receive visualized reports with citations in under 1 minute." },
      { type: 'metrics', items: [{ label: 'Hours Saved', value: '600h+', sub: 'Per Month' }, { label: 'Response Time', value: 'Minutes', sub: 'From Days' }] }
    ] 
  },
  { 
    slug: 'fmcg-consumer-insight', 
    type: 'case', 
    title: "Beyond Static Surveys: Real-time Insights via Synthetic Users", 
    subtitle: "Using Proactive Agents to handle massive concurrent interviews, reshaping decision-making for billion-dollar products.", 
    updatedAt: "2026-02-25", 
    readTime: "9", 
    tags: ["FMCG", "Consumer Insights"], 
    clientIntro: "A top consumer goods company.", 
    coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1crep.jpeg", 
    contentBlocks: [
      { type: 'h2', content: "Pain Point: Expensive 'Static Photos'" },
      { type: 'p', content: "Traditional surveys are like taking a static, expensive, and outdated photo of the market. By the time the report is done, consumer preferences may have shifted." },
      { type: 'h2', content: "Solution: From 'Photo' to 'Live Stream'" },
      { type: 'p', content: "We used Atypica to generate multi-dimensional virtual user personas. Proactive Agents took over execution, conducting massive concurrent interviews. Analysts then interpreted strategic opportunities from AI-distilled data." },
      { type: 'metrics', items: [{ label: 'Cost Reduction', value: '60%' }, { label: 'Launch Speed', value: '350%', sub: 'Improvement' }, { label: 'Insight Speed', value: '100x' }] }
    ] 
  },
  { 
    slug: 'alcohol-channel-growth', 
    type: 'case', 
    title: "Reshaping Sales Networks: The 'Create-Distribute-Reward' Loop", 
    subtitle: "Empowering thousands of distributors with an AI Content Engine to solve the 'spray and pray' content problem.", 
    updatedAt: "2026-02-20", 
    readTime: "8", 
    tags: ["Alcohol", "Channel Growth"], 
    clientIntro: "A leading liquor enterprise.", 
    coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1cju9.jpeg", 
    contentBlocks: [
      { type: 'h2', content: "Pain Point: Digital Disconnection" },
      { type: 'p', content: "Distributors lack content creation skills, and HQ cannot manage scattered outputs efficiently. The traditional 'broadcast task' model resulted in a data black hole." },
      { type: 'h2', content: "Solution: Content-Driven AI Agent" },
      { type: 'p', content: "We translated brand requirements into AI-understandable dimensions. Distributors use an AI assistant to generate high-quality content instantly. The platform tracks data and auto-allocates incentives based on performance." },
      { type: 'metrics', items: [{ label: 'Efficiency', value: '+75%' }, { label: 'Exposure', value: '50M+', sub: 'Deep Binding' }] }
    ] 
  },
  { 
    slug: 'real-estate-localization', 
    type: 'case', 
    title: "Solving the Localization Paradox: Instant Compliant Content Generation", 
    subtitle: "Resolving the conflict between 'Central Control' and 'Agile Needs' by decoding Brand DNA into AI rules.", 
    updatedAt: "2026-02-15", 
    readTime: "6", 
    tags: ["Real Estate", "Content Strategy"], 
    clientIntro: "Global Real Estate Group.", 
    coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1cSOO.jpeg", 
    contentBlocks: [
      { type: 'h2', content: "Pain Point: Scale vs. Consistency" },
      { type: 'p', content: "Local teams have urgent needs, but HQ design teams are bottlenecks. Self-creation leads to brand inconsistency." },
      { type: 'h2', content: "Solution: Decoding Brand DNA" },
      { type: 'p', content: "We deconstructed the IP into component libraries and established AI rules for color and composition. Staff can now generate compliant designs in real-time within these rules." },
      { type: 'metrics', items: [{ label: 'Production Time', value: '<1 min' }, { label: 'Compliance', value: '100%' }] }
    ] 
  },
  { 
    slug: 'luxury-retail-compliance', 
    type: 'case', 
    title: "Freeing Attention: Enhancing Judgment at Key Decision Nodes", 
    subtitle: "How AI Visual Agents handle 100% of initial screening, allowing marketers to focus on true business strategy.", 
    updatedAt: "2026-02-10", 
    readTime: "6", 
    tags: ["Luxury", "Compliance"], 
    clientIntro: "Luxury Brand Marketing Team.", 
    coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1caQm.jpeg", 
    contentBlocks: [
      { type: 'h2', content: "Pain Point: Wasted Attention" },
      { type: 'p', content: "Marketing specialists wasted time manually reviewing store staff posts for compliance, leaving no time for strategy." },
      { type: 'h2', content: "Solution: Intelligent Decision Agent" },
      { type: 'p', content: "We structured vague standards into a rule system (Do's & Don'ts). The Agent scans posts 24/7, filtering violations and recommending high-potential content." },
      { type: 'metrics', items: [{ label: 'Screening Coverage', value: '100%' }, { label: 'Human Intervention', value: '1%', sub: 'Edge Cases Only' }] }
    ] 
  }
];

const reportsEn: LibraryItem[] = [
  { 
    slug: 'middle-layer-trap', 
    type: 'report', 
    title: "Why Buying AI Software Is Not Enough", 
    subtitle: "Tool companies are stuck in 'Three Misalignments'. The real challenge lies in the 'Middle Layer' between tools and results.", 
    updatedAt: "2026-01-10", 
    readTime: "8", 
    tags: ["Strategy", "Industry Insights"], 
    coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1c0yH.jpeg", 
    contentBlocks: [
      { type: 'h2', content: "The Three Misalignments" },
      { type: 'p', content: "In working with 200 enterprises, we realized tools alone don't equal value. The misalignments are: Time (Fast iterations vs Slow org change), Perspective (Feature vs Result), and Responsibility (Delivering tools vs Delivering results)." },
      { type: 'h2', content: "The Missing Middle Layer" },
      { type: 'p', content: "The middle layer is Professional Services: How to use AI to transform the business and reshape the organization. Without this, AI stays in PPTs." }
    ] 
  }
];

const methodsEn: LibraryItem[] = [
  { 
    slug: 'ai-full-stack-model', 
    type: 'methodology', 
    title: "What is an AI Full Stack Company?", 
    subtitle: "Future enterprises need an integrated capability from tools and methods to training.", 
    updatedAt: "2026-01-20", 
    readTime: "7", 
    tags: ["Framework", "Organizational Design"], 
    coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1jNtN.jpeg", 
    contentBlocks: [
      { type: 'h2', content: "The Three Layers of Full Stack" },
      { type: 'p', content: "Layer 1: Tools (Infrastructure). Layer 2: Business (Rewriting the business script). Layer 3: People & Org (Redefining human value)." },
      { type: 'h3', content: "Partners, Not Just Consultants" },
      { type: 'p', content: "We deliver not just a system, but a closed business loop that actually runs." }
    ] 
  },
  { 
    slug: 'change-management', 
    type: 'methodology', 
    title: "Change Management: The Essence of AI Transformation", 
    subtitle: "Business won't improve itself. The organization is what needs upgrading.", 
    updatedAt: "2026-01-25", 
    readTime: "6", 
    tags: ["Change Management", "Leadership"], 
    coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1j3eA.jpeg", 
    contentBlocks: [
      { type: 'h2', content: "Three Systematic Actions" },
      { type: 'p', content: "1. A 'New Constitution' for the CEO/Core Team. 2. 'AI Co-creation Camps' for Business Teams (Use tools immediately). 3. 'Role Reset' for Middle Management (From coordinators to workflow designers)." }
    ] 
  }
];

const announcementsEn: LibraryItem[] = [
  { 
    slug: 'consulting-launch-offer', 
    type: 'announcement', 
    title: "Tezign AI Consulting Services Launched", 
    subtitle: "From Diagnosis to Evolution: Full-link support for AI transformation.", 
    updatedAt: "2026-03-05", 
    readTime: "3", 
    tags: ["Service Launch"], 
    coverImageUrl: "https://i.imgs.ovh/2025/12/29/C1j1f4.jpeg", 
    contentBlocks: [
      { type: 'h2', content: "Our Offerings" },
      { type: 'p', content: "1. AI Business Diagnosis (2-4 weeks): Pinpoint highest commercial value." },
      { type: 'p', content: "2. AI Workflow Design (4-6 weeks): Convert insights into runnable systems." },
      { type: 'p', content: "3. AI Org Evolution (Subscription): Ensuring continuous results." }
    ] 
  }
];

// --- Search Logic (Unchanged) ---
const allCnItems = [...casesCn, ...reportsCn, ...methodsCn, ...announcementsCn];
const allEnItems = [...casesEn, ...reportsEn, ...methodsEn, ...announcementsEn];

const bilingualIndex = allCnItems.map(cnItem => {
  const enItem = allEnItems.find(i => i.slug === cnItem.slug);
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
    if (item.cnTitle.includes(q) || item.enTitle.includes(q)) {
      score += 10;
    }
    if (item.fullText.includes(q)) {
      score += 1;
    }
    return { slug: item.slug, score };
  });

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