import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'cn';

interface LanguageContextType {
  lang: Language;
  toggleLang: () => void;
  t: (key: string) => string | string[];
}

const translations = {
  en: {
    // Content Types (Singular for Tags)
    typeCase: "Case Study",
    typeReport: "Report",
    typeMethod: "Methodology",
    typeAnnounce: "Announcement",

    // Nav & General
    resources: "Resources",
    cases: "Cases",
    reports: "Reports",
    methodologies: "Methodologies",
    announcements: "Announcements",
    login: "Log In",
    logout: "Logout",
    privacy: "Privacy Policy",
    terms: "Terms of Service",
    viewAll: "View all",
    learnMore: "Learn more",
    
    // Auth Dropdown
    account: "Account",
    bookmarks: "Bookmarks",
    consultations: "Consultations",
    settings: "Settings",

    // Profile Page
    myProfile: "My Profile",
    email: "Work Email",
    company: "Company",
    editProfile: "Edit Profile",
    savedItems: "Saved Items",
    preferences: "Preferences",
    notifications: "Notifications",
    notifyDesc: "Receive updates about new cases and reports",
    privacyDesc: "Manage data sharing and visibility",
    manage: "Manage",
    
    // Profile Consultations
    upcomingSessions: "Upcoming Sessions",
    pastSessions: "Past Sessions",
    noConsultations: "No scheduled sessions found.",
    status: "Status",
    date: "Date",
    time: "Time",
    confirmed: "Confirmed",
    completed: "Completed",
    
    // Profile Edit
    nickname: "Display Name",
    accountName: "Account Name",
    accountFixed: "Account name cannot be changed",
    changeAvatar: "Change Avatar",
    saveChanges: "Save Changes",
    cancel: "Cancel",
    changePassword: "Change Password",
    newPassword: "New Password",
    confirmPassword: "Confirm Password",
    passwordUpdated: "Password updated successfully",
    profileUpdated: "Profile updated successfully",
    enterPassword: "Enter new password",
    
    // Homepage Hero
    heroTitle: "Making AI a lasting enterprise capability",
    heroSubtitle: "We use an AI-native consulting approach to help enterprises build ways of working that are understandable, repeatable, and continuously evolving.",
    btnBookDemo: "Book a scenario session",
    
    // Interactive Search
    searchPlaceholder: "Ask about AI scenarios, cases, or signals…",
    searchPrompts: [
        "Which business areas are ready for AI?",
        "How should AI participate in decision-making?",
        "How should humans and agents divide work?",
        "Can AI become part of a long-term operating system?",
        "How do teams avoid one-off AI projects?",
        "Which content workflows are easiest to redesign with AI?",
        "What repetitive research tasks can AI take on?",
        "How should AI value be measured in real business?",
        "When should AI not be introduced?",
        "How can AI operate and evolve continuously?",
        "How do AI scenarios differ across industries?",
        "What defines an AI-native way of working?"
    ],
    aiResponseTitle: "AI Overview",
    aiResponseText: "Based on your library, AI is currently transforming workflows by moving from sporadic usage to systemic integration. Key patterns include signal-to-product engines and automated content supply chains.",
    
    // Recommendations
    recsTitle: "Latest",
    liveUpdate: "Live Updates",
    latestNews: "Latest Updates",
    viewNews: "View all resources",
    
    // Capabilities Sections
    capabilitiesTitle: "Three core capabilities of AI-native consulting",
    diagnoseTitle: "DIAGNOSE",
    diagnoseDesc: "Systematically identify which business areas are ready for AI, with clear priorities, value, and boundaries.",
    designTitle: "DESIGN",
    designDesc: "Design how humans, agents, and systems collaborate, making AI part of real workflows.",
    operateTitle: "OPERATE",
    operateDesc: "Build mechanisms that allow AI to operate and evolve continuously, rather than as one-off delivery.",
    multimodalTitle: "From business questions to running AI ways of working",
    codeGenTitle: "We focus not on individual tools or models, but on turning AI into ways of working that operate continuously in real business.",
    inputPrompt: "Could Tezign help make a demo based on this video?",
    outputResponse: "I see a murmuration of starlings, so I coded a flocking simulation.",

    // Homepage CTA
    ctaTitle: "Treat AI as a way of working, not a one-time solution",
    ctaButton: "Book a scenario session",

    // Library Page
    library: "Resources",
    librarySubtitle: "Cases and insights on how AI enters real business.",
    searchPlaceholderLib: "Search by industry, scenario, keyword...",
    read: "Read",
    readTime: "min read",
    updated: "Updated",
    back: "Back to Resources",
    recommended: "Recommended Next",
    clientProfile: "Client Profile",
    scenario: "Category",
    download: "Download 1-page summary",
    share: "Share this case",
    bookmark: "Bookmark",
    bookmarked: "Bookmarked",
    noResults: "No results found matching your query.",
    clearSearch: "Clear search",
    prevPage: "Previous",
    nextPage: "Next",
    
    // Gate / Auth
    unlockTitle: "Unlock full access",
    unlockSubtitle: "Join 10,000+ leaders getting our latest deep-dive cases and market signals.",
    namePlaceholder: "Full Name",
    emailPlaceholder: "Work Email",
    interestsLabel: "Select your interests",
    unlockButton: "Unlock Library",
    alreadyAccess: "I already have access",
    
    // Gate - Signup Flow
    createAccount: "Create Account",
    contactInfo: "Contact Info",
    mobileNumber: "Mobile Number",
    userType: "User Type",
    personal: "Personal",
    enterprise: "Enterprise",
    companyName: "Company Name",
    usageScenarios: "Usage Scenarios",
    selectMultiple: "Select all that apply (Multiple)",
    interests: "Interests",
    selectTopics: "Select topics (Multiple)",
    painPoints: "Pain Points",
    challengesPrompt: "What specific challenges are you facing?",
    describePlaceholder: "Describe here...",
    skip: "Skip",
    next: "Next",
    complete: "Complete",
    welcomeBack: "Welcome Back",
    signInSubtitle: "Sign in to access Tezign AI Consulting",
    accountNamePlaceholder: "Account Name/Email",
    passwordPlaceholder: "Password",
    newHere: "New here?",
    createAccountAction: "Create an account",
    fillAllFields: "Please fill in all required fields.",
    enterCredentials: "Please enter both account and password.",
    
    // New Fields & Lists
    verificationCode: "Verification Code",
    sendCode: "Send Code",
    resendCode: "Resend",
    department: "Department",
    jobTitle: "Job Title",
    profession: "Profession / Identity",
    country: "Country",
    city: "City",
    userDetails: "Details",
    selectCountry: "Select Country",
    selectCity: "Select City",
    
    countriesList: ["China", "United States", "United Kingdom", "Singapore", "Japan", "Germany", "France", "Canada", "Australia", "Other"],
    citiesListCN: ["Shanghai", "Beijing", "Shenzhen", "Guangzhou", "Hangzhou", "Chengdu", "Nanjing", "Wuhan", "Other"],
    citiesListUS: ["New York", "San Francisco", "Los Angeles", "Chicago", "Seattle", "Boston", "Other"],
    citiesListOther: ["London", "Tokyo", "Singapore", "Berlin", "Paris", "Toronto", "Sydney", "Other"],
    
    scenariosList: [
      "Strategic Planning", "Content Production", "Market Research", 
      "Product Innovation", "Customer Service", "Data Analysis",
      "Competitor Monitoring", "Trend Spotting"
    ],
    interestsList: [
      "Product Innovation", "Brand Strategy", "Retail Growth", 
      "Food & Beverage", "Luxury", "AI Ops", 
      "Consumer Insights", "Social Listening", "Competitive Intelligence"
    ],

    // Detail
    enjoyed: "Enjoyed this update?",
    diveDeeper: "Dive deeper into our strategic case studies to see how these signals apply to real business problems.",
    browseCases: "Browse Cases",
    listen: "Listen to summary",

    // Booking Modal
    scheduleConsultation: "Schedule a Consultation",
    bookingConfirmed: "Booking Confirmed",
    selectTime: "Select Time",
    pleaseSelectDate: "Please select a date first",
    confirmBooking: "Confirm Booking",
    bookingSuccessMsg1: "We have scheduled your session on ",
    bookingSuccessMsg2: " at ",
    bookingSuccessMsg3: ". A calendar invitation has been sent to your email.",
    backToBrowsing: "Back to browsing",
    calendarDaysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  },
  cn: {
    // Content Types
    typeCase: "案例",
    typeReport: "报告",
    typeMethod: "方法论",
    typeAnnounce: "公告",

    // Nav & General
    resources: "资源",
    cases: "案例",
    reports: "报告",
    methodologies: "方法论",
    announcements: "公告",
    login: "登录",
    logout: "登出",
    privacy: "隐私政策",
    terms: "服务条款",
    viewAll: "查看全部",
    learnMore: "了解更多",
    
    // Auth Dropdown
    account: "账户",
    bookmarks: "收藏",
    consultations: "预约咨询",
    settings: "设置",

    // Profile Page
    myProfile: "我的账户",
    email: "工作邮箱",
    company: "公司",
    editProfile: "编辑资料",
    savedItems: "收藏内容",
    preferences: "偏好设置",
    notifications: "通知消息",
    notifyDesc: "接收关于新案例和报告的更新推送",
    privacyDesc: "管理数据共享与账户可见性",
    manage: "管理",
    
    // Profile Consultations
    upcomingSessions: "即将进行的咨询",
    pastSessions: "历史咨询",
    noConsultations: "暂无预约记录",
    status: "状态",
    date: "日期",
    time: "时间",
    confirmed: "已确认",
    completed: "已完成",
    
    // Profile Edit
    nickname: "用户昵称",
    accountName: "账户名称",
    accountFixed: "账户名不可更改",
    changeAvatar: "更换头像",
    saveChanges: "保存更改",
    cancel: "取消",
    changePassword: "修改密码",
    newPassword: "新密码",
    confirmPassword: "确认新密码",
    passwordUpdated: "密码修改成功",
    profileUpdated: "资料更新成功",
    enterPassword: "输入新密码",

    // Homepage Hero
    heroTitle: "让 AI 成为企业的长期能力",
    heroSubtitle: "我们用 AI-native 的咨询方法，帮助企业建立可理解、可复制、可持续演进的 AI 工作方式。",
    btnBookDemo: "预约场景沟通",

    // Interactive Search
    searchPlaceholder: "询问 AI 场景、案例或信号...",
    searchPrompts: [
        "哪些业务环节值得被 AI 接管？",
        "如何判断 AI 应该介入决策的哪一部分？",
        "人与 Agent 在团队中应如何分工？",
        "AI 是否适合作为长期业务系统的一部分？",
        "如何避免 AI 项目变成一次性交付？",
        "哪些内容流程最容易被 AI 重构？",
        "AI 在研究中能承担哪些重复性工作？",
        "如何衡量 AI 在业务中的真实价值？",
        "什么时候不应该引入 AI？",
        "如何设计 AI 的持续运行与迭代机制？",
        "不同行业在 AI 场景上的差异在哪里？",
        "AI-native 工作方式与传统流程的本质区别是什么？"
    ],
    aiResponseTitle: "AI 总结",
    aiResponseText: "根据您的资料库，AI 目前正通过从零星使用转向系统性集成来改变工作流程。关键模式包括“信号到产品”引擎和自动化内容供应链。",

    // Recommendations
    recsTitle: "最新推荐",
    liveUpdate: "持续更新",
    latestNews: "最新动态",
    viewNews: "查看所有资源",
    
    // Capabilities Sections
    capabilitiesTitle: "AI-native consulting 的三项核心能力",
    diagnoseTitle: "诊断",
    diagnoseDesc: "系统判断哪些业务环节值得被 AI 接管，明确优先级、价值与边界。",
    designTitle: "协作",
    designDesc: "设计人 × Agent × 系统的协作方式，让 AI 成为真实工作流程的一部分。",
    operateTitle: "运行",
    operateDesc: "构建 AI 在业务中持续运行与不断进化的机制，而不是一次性交付。",
    multimodalTitle: "从业务问题，到可运行的 AI 工作方式",
    codeGenTitle: "我们关注的不是单点工具或模型能力，而是如何将 AI 转化为能够在真实业务中长期运行的工作方式。",
    inputPrompt: "Tezign 能否根据这个视频制作一个演示？",
    outputResponse: "我看到了一群椋鸟的低语，所以我编写了一个鸟群模拟。",

    // Homepage CTA
    ctaTitle: "将 AI 作为一种长期工作方式，而不是一次性方案",
    ctaButton: "预约场景沟通",

    // Library Page
    library: "资源",
    librarySubtitle: "关于 AI 如何进入真实业务的案例与洞察。",
    searchPlaceholderLib: "搜索行业、场景或关键词...",
    read: "阅读全文",
    readTime: "分钟阅读",
    updated: "更新于",
    back: "返回资源",
    recommended: "推荐阅读",
    clientProfile: "客户背景",
    scenario: "类别",
    download: "下载一页纸概要",
    share: "分享此案例",
    bookmark: "收藏",
    bookmarked: "已收藏",
    noResults: "未找到与您的查询匹配的结果。",
    clearSearch: "清除搜索",
    prevPage: "上一页",
    nextPage: "下一页",

    // Gate
    unlockTitle: "解锁完整内容",
    unlockSubtitle: "加入10,000+行业领袖，获取最新深度案例与市场信号。",
    namePlaceholder: "您的姓名",
    emailPlaceholder: "邮箱地址",
    interestsLabel: "选择您感兴趣的领域",
    unlockButton: "立即解锁",
    alreadyAccess: "我已有权限",
    
    // Gate - Signup Flow
    createAccount: "创建账户",
    contactInfo: "联系信息",
    mobileNumber: "手机号码",
    userType: "用户类型",
    personal: "个人用户",
    enterprise: "企业用户",
    companyName: "公司名称",
    usageScenarios: "使用场景",
    selectMultiple: "请选择（可多选）",
    interests: "兴趣领域",
    selectTopics: "请选择话题（可多选）",
    painPoints: "痛点与挑战",
    challengesPrompt: "您面临的具体挑战是什么？",
    describePlaceholder: "在此描述...",
    skip: "跳过",
    next: "下一步",
    complete: "完成",
    welcomeBack: "欢迎回来",
    signInSubtitle: "登录以访问特赞 AI 咨询",
    accountNamePlaceholder: "账户名/邮箱",
    passwordPlaceholder: "密码",
    newHere: "新用户？",
    createAccountAction: "注册账户",
    fillAllFields: "请填写所有必填项。",
    enterCredentials: "请输入账号和密码。",

    // New Fields & Lists
    verificationCode: "验证码",
    sendCode: "发送验证码",
    resendCode: "重新发送",
    department: "部门",
    jobTitle: "职位",
    profession: "职业 / 身份",
    country: "所在国家",
    city: "所在城市",
    userDetails: "详细信息",
    selectCountry: "选择国家",
    selectCity: "选择城市",

    countriesList: ["中国", "美国", "英国", "新加坡", "日本", "德国", "法国", "加拿大", "澳大利亚", "其他"],
    citiesListCN: ["上海", "北京", "深圳", "广州", "杭州", "成都", "南京", "武汉", "其他"],
    citiesListUS: ["纽约", "旧金山", "洛杉矶", "芝加哥", "西雅图", "波士顿", "其他"],
    citiesListOther: ["伦敦", "东京", "新加坡", "柏林", "巴黎", "多伦多", "悉尼", "其他"],

    scenariosList: [
      "战略规划", "内容生产", "市场研究", 
      "产品创新", "客户服务", "数据分析",
      "竞品监测", "趋势发现"
    ],
    interestsList: [
      "产品创新", "品牌战略", "零售增长", 
      "食品饮料", "奢侈品", "AI 运营", 
      "消费者洞察", "社媒聆听", "竞争情报"
    ],

    // Detail
    enjoyed: "喜欢这篇更新吗？",
    diveDeeper: "深入了解我们的战略案例，看这些信号如何应用于实际商业问题。",
    browseCases: "浏览案例",
    listen: "收听摘要",

    // Booking Modal
    scheduleConsultation: "预约咨询",
    bookingConfirmed: "预约已确认",
    selectTime: "选择时间",
    pleaseSelectDate: "请先选择日期",
    confirmBooking: "确认预约",
    bookingSuccessMsg1: "我们已为您安排了在 ",
    bookingSuccessMsg2: " ",
    bookingSuccessMsg3: " 的会议。日历邀请已发送至您的邮箱。",
    backToBrowsing: "返回浏览",
    calendarDaysShort: ["日", "一", "二", "三", "四", "五", "六"],
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>('cn'); // Default set to 'cn'

  const toggleLang = () => {
    setLang(prev => prev === 'en' ? 'cn' : 'en');
  };

  const t = (key: string) => {
    // @ts-ignore
    const val = translations[lang][key];
    if (val) return val;
    // Fallback for arrays or missing keys
    // @ts-ignore
    return translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};