import { DASHBOARD_CONFIG } from "./config.js";
import {
  calculateMetrics,
  categoryCounts,
  completedTests,
  filterRecords,
  getFilterOptions,
  monthlyCounts,
  normalizeDatabaseRows,
  recentlyAdded,
  resultCounts,
} from "./dashboard-core.js";

const CATEGORY_COLORS = ["#f45800", "#078879", "#2d6d8c", "#7756a9", "#d89a24"];
const PCR_COLORS = {
  Positive: "#bc4a4a",
  Negative: "#078879",
  Other: "#d89a24",
};

const translations = {
  en: {
    skip: "Skip to dashboard",
    brandTitle: "Lab Analysis",
    brandSubtitle: "Intelligence dashboard",
    signedOut: "Signed out",
    signedIn: "Signed in",
    connectionError: "Access denied",
    refresh: "Refresh",
    signOut: "Sign out",
    eyebrow: "Laboratory performance",
    heroTitle: "Completed tests, clearly connected.",
    heroDescription:
      "A secure, live view of completed diagnostic work across customers, categories, and pathogens.",
    lastUpdated: "Last updated",
    notYet: "Not yet",
    autoRefresh: "Refreshes every 30 seconds",
    privateTitle: "Private by design",
    privateDescription:
      "Email/password access is checked against the private approved-user list before any laboratory data is returned.",
    secureAccess: "Secure access",
    signInTitle: "Sign in to the lab dashboard",
    signInDescription:
      "Use the email approved by the administrator and your dashboard password.",
    email: "Email",
    password: "Password",
    newPassword: "New password",
    signIn: "Sign in",
    createPassword: "First time? Create password",
    createTitle: "Create your dashboard password",
    createDescription:
      "Use the exact email approved by the administrator. You will confirm the account by email.",
    recoveryTitle: "Choose a new password",
    recoveryDescription: "Enter a new password for your dashboard account.",
    forgotPassword: "Forgot password?",
    updatePassword: "Save new password",
    backToSignIn: "Back to sign in",
    accessNote:
      "Only active emails in the administrator’s approved-user list can view results.",
    setupTitle: "Dashboard temporarily unavailable",
    setupDescription: "The secure connection is not configured.",
    setupNote: "Please contact the dashboard administrator.",
    accessDeniedTitle: "This email is not approved",
    accessDeniedDescription:
      "Ask the administrator to add or activate this email in the approved-user list.",
    accountCreated:
      "Account created. Check your email to confirm it, then return here to sign in.",
    resetSent: "If an account exists, a password-reset email has been sent.",
    passwordUpdated: "Password updated. You can continue to the dashboard.",
    invalidCredentials: "The email or password is incorrect.",
    passwordLength: "Use at least 8 characters for the password.",
    configurationMissing: "The secure dashboard connection is unavailable.",
    explore: "Explore",
    filterTitle: "Filter completed tests",
    resetFilters: "Reset filters",
    customer: "Customer",
    category: "Test category",
    pathogen: "Pathogen / test detail",
    year: "Year",
    month: "Month",
    allCustomers: "All customers",
    allCategories: "All categories",
    allPathogens: "All pathogens",
    allYears: "All years",
    allMonths: "All months",
    recordsMatch: "{count} completed tests match the current filters.",
    atGlance: "At a glance",
    overviewTitle: "Completed work overview",
    completedTests: "Completed tests",
    uniqueTestIds: "Unique test IDs",
    totalSamples: "Total samples",
    reportedSamples: "Reported sample counts",
    uniqueCustomers: "Unique customers",
    acrossSelection: "Across current selection",
    namedFarms: "Named farms",
    optionalFarmNames: "Only populated farm names",
    pcrPositive: "PCR positive rate",
    reportedPcr: "Positive vs. reported PCR",
    qualityFlags: "Quality flags",
    reviewNotes: "Tests with a review note",
    trend: "Trend",
    monthlyTrend: "Completed tests by month",
    testsAcrossMonths: "{count} tests across {months} months",
    noChartData: "No completed tests match these filters.",
    composition: "Composition",
    testMix: "Test category mix",
    outcomes: "Outcomes",
    pcrOutcomes: "PCR results",
    positive: "Positive",
    negative: "Negative",
    other: "Other / not reported",
    details: "Details",
    recentTests: "Completed test register",
    historyEyebrow: "What’s new",
    historyTitle: "Recently added results",
    historyDescription:
      "Latest completed results, grouped by test category and ordered newest first.",
    recentCount: "{count} recent results",
    added: "Added",
    recordCount: "{count} records",
    date: "Date",
    farm: "Farm",
    pathogenShort: "Pathogen / detail",
    result: "Result",
    samples: "Samples",
    area: "Area",
    noFarm: "Not specified",
    noResult: "Not reported",
    emptyTable: "No completed tests match the current filters.",
    tableLimit: "Showing the latest 100 matching tests.",
    privacyFooter: "Private access • secured by approved-user permissions",
    loading: "Loading lab results…",
    refreshed: "Dashboard updated.",
    authExpired: "Your session expired. Sign in again.",
    generalError: "The dashboard could not load the results. Please try again.",
    categoryAntibiotic: "Antibiotic Sensitivity",
    categoryBacteriology: "Bacteriology",
  },
  ar: {
    skip: "الانتقال إلى لوحة المعلومات",
    brandTitle: "تحاليل المعمل",
    brandSubtitle: "لوحة مؤشرات ذكية",
    signedOut: "تم تسجيل الخروج",
    signedIn: "تم تسجيل الدخول",
    connectionError: "الدخول غير مسموح",
    refresh: "تحديث",
    signOut: "تسجيل الخروج",
    eyebrow: "أداء المعمل",
    heroTitle: "الاختبارات المكتملة، بصورة أوضح.",
    heroDescription:
      "عرض حي وآمن للاختبارات التشخيصية المكتملة حسب العملاء والفئات ومسببات الأمراض.",
    lastUpdated: "آخر تحديث",
    notYet: "لم يتم بعد",
    autoRefresh: "تحديث تلقائي كل 30 ثانية",
    privateTitle: "خصوصية من أساس التصميم",
    privateDescription:
      "يتم التحقق من البريد الإلكتروني وكلمة المرور وقائمة المستخدمين المعتمدين قبل عرض أي بيانات معملية.",
    secureAccess: "دخول آمن",
    signInTitle: "سجّل الدخول إلى لوحة المعمل",
    signInDescription:
      "استخدم البريد الإلكتروني المعتمد من المسؤول وكلمة مرور لوحة المعلومات.",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    newPassword: "كلمة المرور الجديدة",
    signIn: "تسجيل الدخول",
    createPassword: "أول مرة؟ أنشئ كلمة مرور",
    createTitle: "أنشئ كلمة مرور لوحة المعلومات",
    createDescription:
      "استخدم البريد الإلكتروني المعتمد لدى المسؤول، ثم أكد الحساب عبر البريد.",
    recoveryTitle: "اختر كلمة مرور جديدة",
    recoveryDescription: "أدخل كلمة مرور جديدة لحساب لوحة المعلومات.",
    forgotPassword: "نسيت كلمة المرور؟",
    updatePassword: "حفظ كلمة المرور الجديدة",
    backToSignIn: "العودة لتسجيل الدخول",
    accessNote:
      "يمكن فقط للبريد الإلكتروني النشط في قائمة المستخدمين المعتمدين عرض النتائج.",
    setupTitle: "لوحة المعلومات غير متاحة مؤقتاً",
    setupDescription: "لم يتم إعداد الاتصال الآمن.",
    setupNote: "يرجى التواصل مع مسؤول لوحة المعلومات.",
    accessDeniedTitle: "هذا البريد غير معتمد",
    accessDeniedDescription:
      "اطلب من المسؤول إضافة هذا البريد أو تفعيله في قائمة المستخدمين المعتمدين.",
    accountCreated:
      "تم إنشاء الحساب. تحقق من بريدك الإلكتروني ثم عد لتسجيل الدخول.",
    resetSent: "إذا كان الحساب موجوداً، فسيتم إرسال رسالة لإعادة تعيين كلمة المرور.",
    passwordUpdated: "تم تحديث كلمة المرور ويمكنك متابعة استخدام اللوحة.",
    invalidCredentials: "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
    passwordLength: "استخدم 8 أحرف على الأقل لكلمة المرور.",
    configurationMissing: "الاتصال الآمن بلوحة المعلومات غير متاح.",
    explore: "استكشف",
    filterTitle: "تصفية الاختبارات المكتملة",
    resetFilters: "إعادة ضبط التصفية",
    customer: "العميل",
    category: "فئة الاختبار",
    pathogen: "المسبب المرضي / تفاصيل الاختبار",
    year: "السنة",
    month: "الشهر",
    allCustomers: "كل العملاء",
    allCategories: "كل الفئات",
    allPathogens: "كل المسببات",
    allYears: "كل السنوات",
    allMonths: "كل الشهور",
    recordsMatch: "يوجد {count} اختبار مكتمل يطابق عوامل التصفية.",
    atGlance: "نظرة سريعة",
    overviewTitle: "ملخص العمل المكتمل",
    completedTests: "الاختبارات المكتملة",
    uniqueTestIds: "معرّفات اختبار فريدة",
    totalSamples: "إجمالي العينات",
    reportedSamples: "أعداد العينات المسجلة",
    uniqueCustomers: "العملاء الفريدون",
    acrossSelection: "ضمن التحديد الحالي",
    namedFarms: "المزارع المسماة",
    optionalFarmNames: "أسماء المزارع المدخلة فقط",
    pcrPositive: "نسبة PCR الإيجابية",
    reportedPcr: "الإيجابي من نتائج PCR المسجلة",
    qualityFlags: "علامات الجودة",
    reviewNotes: "اختبارات بها ملاحظة للمراجعة",
    trend: "الاتجاه",
    monthlyTrend: "الاختبارات المكتملة شهرياً",
    testsAcrossMonths: "{count} اختبار خلال {months} شهر",
    noChartData: "لا توجد اختبارات مكتملة تطابق عوامل التصفية.",
    composition: "التوزيع",
    testMix: "توزيع فئات الاختبار",
    outcomes: "النتائج",
    pcrOutcomes: "نتائج PCR",
    positive: "إيجابي",
    negative: "سلبي",
    other: "أخرى / غير مسجلة",
    details: "التفاصيل",
    recentTests: "سجل الاختبارات المكتملة",
    historyEyebrow: "أحدث الإضافات",
    historyTitle: "النتائج المضافة حديثاً",
    historyDescription:
      "أحدث النتائج المكتملة، مجمعة حسب فئة الاختبار ومرتبة من الأحدث.",
    recentCount: "{count} نتيجة حديثة",
    added: "أضيفت",
    recordCount: "{count} سجل",
    date: "التاريخ",
    farm: "المزرعة",
    pathogenShort: "المسبب / التفاصيل",
    result: "النتيجة",
    samples: "العينات",
    area: "المنطقة",
    noFarm: "غير محدد",
    noResult: "غير مسجل",
    emptyTable: "لا توجد اختبارات مكتملة تطابق عوامل التصفية الحالية.",
    tableLimit: "عرض أحدث 100 اختبار مطابق.",
    privacyFooter: "دخول خاص • محمي بصلاحيات المستخدمين المعتمدين",
    loading: "جارٍ تحميل نتائج المعمل…",
    refreshed: "تم تحديث لوحة المعلومات.",
    authExpired: "انتهت الجلسة. يرجى تسجيل الدخول مرة أخرى.",
    generalError: "تعذر تحميل النتائج. يرجى المحاولة مرة أخرى.",
    categoryAntibiotic: "حساسية المضادات الحيوية",
    categoryBacteriology: "البكتريولوجي",
  },
};

const elements = Object.fromEntries(
  [
    "accessPanel",
    "accessTitle",
    "accessDescription",
    "accessNote",
    "authForm",
    "emailLabel",
    "emailInput",
    "passwordInput",
    "passwordLabel",
    "authSubmitButton",
    "createAccountButton",
    "forgotPasswordButton",
    "authMessage",
    "dashboardContent",
    "connectionPill",
    "connectionText",
    "userBadge",
    "userName",
    "userRole",
    "refreshButton",
    "languageButton",
    "languageButtonLabel",
    "signOutButton",
    "lastUpdatedValue",
    "customerFilter",
    "categoryFilter",
    "detailFilter",
    "yearFilter",
    "monthFilter",
    "resetFiltersButton",
    "filterResult",
    "completedMetric",
    "samplesMetric",
    "customersMetric",
    "farmsMetric",
    "pcrMetric",
    "flagsMetric",
    "trendSummary",
    "monthlyChart",
    "monthlyEmpty",
    "categoryBars",
    "pcrDonut",
    "pcrDonutValue",
    "pcrLegend",
    "historyCount",
    "recentHistory",
    "tableCount",
    "recordsBody",
    "toast",
    "loadingOverlay",
  ].map((id) => [id, document.getElementById(id)]),
);

const state = {
  language: localStorage.getItem("lab-dashboard-language") === "ar" ? "ar" : "en",
  session: null,
  access: null,
  authMode: "signin",
  allRecords: [],
  filteredRecords: [],
  loading: false,
  refreshTimer: null,
  toastTimer: null,
  resizeTimer: null,
};

let supabaseClient = null;

function t(key, replacements = {}) {
  let value = translations[state.language][key] ?? translations.en[key] ?? key;
  for (const [name, replacement] of Object.entries(replacements)) {
    value = value.replaceAll(`{${name}}`, replacement);
  }
  return value;
}

function isConfigured() {
  return (
    DASHBOARD_CONFIG.supabaseUrl?.startsWith("https://") &&
    DASHBOARD_CONFIG.supabasePublishableKey?.startsWith("sb_publishable_") &&
    window.supabase?.createClient
  );
}

function setConnection(stateName, labelKey) {
  elements.connectionPill.dataset.state = stateName;
  elements.connectionText.textContent = t(labelKey);
}

function categoryLabel(category) {
  if (category === "Antibiotic Sensitivity") return t("categoryAntibiotic");
  if (category === "Bacteriology") return t("categoryBacteriology");
  return category;
}

function formatNumber(value, options = {}) {
  return new Intl.NumberFormat(state.language === "ar" ? "ar-EG" : "en-GB", {
    maximumFractionDigits: 1,
    ...options,
  }).format(value);
}

function formatDate(date) {
  if (!date) return "—";
  return new Intl.DateTimeFormat(state.language === "ar" ? "ar-EG" : "en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

function formatDateTime(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat(state.language === "ar" ? "ar-EG" : "en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function monthLabel(monthKey, format = "short") {
  const [year, month] = monthKey.split("-");
  if (!year || !month) return monthKey;
  return new Intl.DateTimeFormat(state.language === "ar" ? "ar-EG" : "en-GB", {
    month: format,
    year: format === "short" ? "2-digit" : undefined,
    timeZone: "UTC",
  }).format(new Date(`${year}-${month}-01T00:00:00Z`));
}

function updateTranslations() {
  document.documentElement.lang = state.language;
  document.documentElement.dir = state.language === "ar" ? "rtl" : "ltr";
  elements.languageButtonLabel.textContent =
    state.language === "en" ? "العربية" : "English";
  elements.languageButton.setAttribute(
    "aria-label",
    state.language === "en" ? "Switch to Arabic" : "التبديل إلى الإنجليزية",
  );

  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });

  if (state.session) {
    setConnection("online", "signedIn");
  } else if (elements.connectionPill.dataset.state === "error") {
    setConnection("error", "connectionError");
  } else {
    setConnection("offline", "signedOut");
  }
}

function showToast(message, kind = "info") {
  clearTimeout(state.toastTimer);
  elements.toast.textContent = message;
  elements.toast.dataset.kind = kind;
  elements.toast.classList.remove("hidden");
  state.toastTimer = setTimeout(() => elements.toast.classList.add("hidden"), 4200);
}

function showAuthMessage(message = "", kind = "info") {
  elements.authMessage.textContent = message;
  elements.authMessage.dataset.kind = kind;
  elements.authMessage.classList.toggle("hidden", !message);
}

function setAuthMode(mode) {
  state.authMode = mode;
  const isRecovery = mode === "recovery";
  const isSignup = mode === "signup";

  elements.emailLabel.classList.toggle("hidden", isRecovery);
  elements.passwordInput.autocomplete = isRecovery
    ? "new-password"
    : isSignup
      ? "new-password"
      : "current-password";
  elements.passwordLabel.textContent = t(isRecovery ? "newPassword" : "password");
  elements.authSubmitButton.textContent = t(
    isRecovery ? "updatePassword" : isSignup ? "createPassword" : "signIn",
  );
  elements.createAccountButton.textContent = t(
    isSignup || isRecovery ? "backToSignIn" : "createPassword",
  );
  elements.forgotPasswordButton.classList.toggle("hidden", isSignup || isRecovery);
  elements.accessTitle.textContent = t(
    isRecovery ? "recoveryTitle" : isSignup ? "createTitle" : "signInTitle",
  );
  elements.accessDescription.textContent = t(
    isRecovery
      ? "recoveryDescription"
      : isSignup
        ? "createDescription"
        : "signInDescription",
  );
  showAuthMessage();
}

function setLoading(loading, overlay = false) {
  state.loading = loading;
  elements.refreshButton.classList.toggle("loading", loading);
  elements.refreshButton.disabled = loading || !state.session;
  elements.loadingOverlay.classList.toggle("hidden", !loading || !overlay);
}

function showSetupState() {
  elements.accessPanel.classList.remove("hidden");
  elements.dashboardContent.classList.add("hidden");
  elements.authForm.classList.add("hidden");
  elements.createAccountButton.classList.add("hidden");
  elements.forgotPasswordButton.classList.add("hidden");
  elements.accessTitle.textContent = t("setupTitle");
  elements.accessDescription.textContent = t("setupDescription");
  elements.accessNote.textContent = t("setupNote");
  setConnection("offline", "signedOut");
}

function showConnectState({ denied = false } = {}) {
  elements.accessPanel.classList.remove("hidden");
  elements.dashboardContent.classList.add("hidden");
  elements.authForm.classList.remove("hidden");
  elements.createAccountButton.classList.remove("hidden");
  elements.forgotPasswordButton.classList.remove("hidden");
  setAuthMode("signin");
  elements.accessTitle.textContent = t(denied ? "accessDeniedTitle" : "signInTitle");
  elements.accessDescription.textContent = t(
    denied ? "accessDeniedDescription" : "signInDescription",
  );
  elements.accessNote.textContent = t("accessNote");
  setConnection(denied ? "error" : "offline", denied ? "connectionError" : "signedOut");
}

function showDashboard() {
  elements.accessPanel.classList.add("hidden");
  elements.dashboardContent.classList.remove("hidden");
  elements.signOutButton.classList.remove("hidden");
  elements.userBadge.classList.remove("hidden");
  elements.userName.textContent =
    state.access?.display_name || state.session?.user?.email || "";
  elements.userRole.textContent = state.access?.role || "";
  elements.refreshButton.disabled = false;
  setConnection("online", "signedIn");
}

function populateSelect(select, values, firstLabel, display = (value) => value) {
  const selected = select.value;
  select.replaceChildren();

  const allOption = document.createElement("option");
  allOption.value = "";
  allOption.textContent = firstLabel;
  select.append(allOption);

  for (const value of values) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = display(value);
    select.append(option);
  }

  if ([...select.options].some((option) => option.value === selected)) {
    select.value = selected;
  }
}

function populateFilters() {
  const options = getFilterOptions(state.allRecords);
  populateSelect(
    elements.customerFilter,
    options.customers,
    t("allCustomers"),
  );
  populateSelect(
    elements.categoryFilter,
    options.categories,
    t("allCategories"),
    categoryLabel,
  );
  populateSelect(elements.detailFilter, options.details, t("allPathogens"));
  populateSelect(elements.yearFilter, options.years, t("allYears"));

  const months = Array.from({ length: 12 }, (_, index) =>
    String(index + 1).padStart(2, "0"),
  );
  populateSelect(elements.monthFilter, months, t("allMonths"), (month) => {
    const year = elements.yearFilter.value || "2026";
    return monthLabel(`${year}-${month}`, "long");
  });
}

function currentFilters() {
  return {
    customer: elements.customerFilter.value,
    category: elements.categoryFilter.value,
    detail: elements.detailFilter.value,
    year: elements.yearFilter.value,
    month: elements.monthFilter.value,
  };
}

function renderMetrics(records) {
  const metrics = calculateMetrics(records);
  elements.completedMetric.textContent = formatNumber(metrics.completed);
  elements.samplesMetric.textContent = formatNumber(metrics.samples);
  elements.customersMetric.textContent = formatNumber(metrics.customers);
  elements.farmsMetric.textContent = formatNumber(metrics.farms);
  elements.pcrMetric.textContent =
    metrics.pcrPositiveRate == null
      ? "—"
      : `${formatNumber(metrics.pcrPositiveRate)}%`;
  elements.flagsMetric.textContent = formatNumber(metrics.flagged);
}

function renderCategoryBars(records) {
  const counts = categoryCounts(records);
  const maximum = Math.max(...counts.map((item) => item.value), 1);
  elements.categoryBars.replaceChildren();

  if (counts.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-chart";
    empty.textContent = t("noChartData");
    elements.categoryBars.append(empty);
    return;
  }

  counts.forEach((item, index) => {
    const row = document.createElement("div");
    row.className = "bar-row";

    const label = document.createElement("span");
    label.className = "bar-label";
    label.textContent = categoryLabel(item.label);

    const value = document.createElement("strong");
    value.className = "bar-value";
    value.textContent = formatNumber(item.value);

    const track = document.createElement("span");
    track.className = "bar-track";
    const fill = document.createElement("span");
    fill.className = "bar-fill";
    fill.style.width = `${Math.max((item.value / maximum) * 100, 2)}%`;
    fill.style.setProperty("--bar-color", CATEGORY_COLORS[index % CATEGORY_COLORS.length]);
    track.append(fill);

    row.append(label, value, track);
    elements.categoryBars.append(row);
  });
}

function classifyPcrResults(records) {
  const groups = { Positive: 0, Negative: 0, Other: 0 };
  for (const item of resultCounts(records, "PCR")) {
    const normalized = item.label.toLowerCase();
    if (normalized === "positive") groups.Positive += item.value;
    else if (normalized === "negative") groups.Negative += item.value;
    else groups.Other += item.value;
  }
  return groups;
}

function renderPcrDonut(records) {
  const groups = classifyPcrResults(records);
  const total = Object.values(groups).reduce((sum, value) => sum + value, 0);
  elements.pcrDonutValue.textContent = formatNumber(total);
  elements.pcrLegend.replaceChildren();

  let start = 0;
  const gradientParts = [];
  const labels = {
    Positive: t("positive"),
    Negative: t("negative"),
    Other: t("other"),
  };

  Object.entries(groups).forEach(([key, value]) => {
    const percentage = total ? (value / total) * 100 : 0;
    const end = start + percentage;
    if (value > 0) {
      gradientParts.push(`${PCR_COLORS[key]} ${start}% ${end}%`);
    }
    start = end;

    const row = document.createElement("div");
    row.className = "legend-row";
    const swatch = document.createElement("span");
    swatch.className = "legend-swatch";
    swatch.style.setProperty("--legend-color", PCR_COLORS[key]);
    const label = document.createElement("span");
    label.textContent = labels[key];
    const count = document.createElement("strong");
    count.textContent = formatNumber(value);
    row.append(swatch, label, count);
    elements.pcrLegend.append(row);
  });

  elements.pcrDonut.style.background = total
    ? `conic-gradient(${gradientParts.join(", ")})`
    : "conic-gradient(#dfe5e7 0 100%)";
}

function niceMaximum(value) {
  if (value <= 5) return 5;
  const magnitude = 10 ** Math.floor(Math.log10(value));
  return Math.ceil(value / magnitude) * magnitude;
}

function drawMonthlyChart(records) {
  const series = monthlyCounts(records, elements.yearFilter.value);
  const nonZero = series.filter((item) => item.value > 0);
  const canvas = elements.monthlyChart;
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(rect.width, 300);
  const height = Math.max(rect.height, 220);
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  const context = canvas.getContext("2d");
  context.scale(dpr, dpr);
  context.clearRect(0, 0, width, height);

  elements.monthlyEmpty.classList.toggle("hidden", nonZero.length > 0);
  const total = series.reduce((sum, item) => sum + item.value, 0);
  elements.trendSummary.textContent = t("testsAcrossMonths", {
    count: formatNumber(total),
    months: formatNumber(nonZero.length),
  });
  if (!nonZero.length) return;

  const padding = { top: 16, right: 18, bottom: 42, left: 42 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;
  const maxValue = niceMaximum(Math.max(...series.map((item) => item.value)));
  const steps = 4;

  context.font = '11px Inter, "Segoe UI", Arial, sans-serif';
  context.lineWidth = 1;
  context.textBaseline = "middle";

  for (let step = 0; step <= steps; step += 1) {
    const y = padding.top + (plotHeight / steps) * step;
    const value = maxValue - (maxValue / steps) * step;
    context.strokeStyle = "#e5eaec";
    context.beginPath();
    context.moveTo(padding.left, y);
    context.lineTo(width - padding.right, y);
    context.stroke();
    context.fillStyle = "#7a8992";
    context.textAlign = "right";
    context.fillText(formatNumber(value, { maximumFractionDigits: 0 }), padding.left - 9, y);
  }

  const points = series.map((item, index) => {
    const x =
      padding.left +
      (plotWidth * index) / Math.max(series.length - 1, 1);
    const y = padding.top + plotHeight - (item.value / maxValue) * plotHeight;
    return { ...item, x, y };
  });

  const fill = context.createLinearGradient(0, padding.top, 0, height - padding.bottom);
  fill.addColorStop(0, "rgba(244, 88, 0, 0.24)");
  fill.addColorStop(1, "rgba(244, 88, 0, 0.015)");
  context.beginPath();
  context.moveTo(points[0].x, height - padding.bottom);
  points.forEach((point) => context.lineTo(point.x, point.y));
  context.lineTo(points.at(-1).x, height - padding.bottom);
  context.closePath();
  context.fillStyle = fill;
  context.fill();

  context.beginPath();
  points.forEach((point, index) => {
    if (index === 0) context.moveTo(point.x, point.y);
    else context.lineTo(point.x, point.y);
  });
  context.strokeStyle = "#f45800";
  context.lineWidth = 2.5;
  context.lineJoin = "round";
  context.lineCap = "round";
  context.stroke();

  const labelEvery = Math.max(1, Math.ceil(series.length / 8));
  points.forEach((point, index) => {
    if (point.value > 0) {
      context.beginPath();
      context.arc(point.x, point.y, 3.5, 0, Math.PI * 2);
      context.fillStyle = "#fff";
      context.fill();
      context.strokeStyle = "#f45800";
      context.lineWidth = 2;
      context.stroke();
    }

    if (index % labelEvery === 0 || index === points.length - 1) {
      context.fillStyle = "#7a8992";
      context.textAlign = "center";
      context.textBaseline = "top";
      context.fillText(monthLabel(point.key), point.x, height - padding.bottom + 14);
    }
  });
}

function categoryChipStyle(category) {
  const categories = [
    ["ELISA", "#fff0e8", "#c54400"],
    ["HI", "#e6f5f2", "#05695e"],
    ["PCR", "#e9f2f6", "#275f79"],
    ["Antibiotic Sensitivity", "#f1ebf9", "#674490"],
    ["Bacteriology", "#fff1d7", "#8b5a00"],
  ];
  const match = categories.find(([name]) => name === category) ?? categories[0];
  return { background: match[1], color: match[2] };
}

function renderTable(records) {
  elements.recordsBody.replaceChildren();
  elements.tableCount.textContent = t("recordCount", {
    count: formatNumber(records.length),
  });

  if (!records.length) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 8;
    cell.className = "empty-table";
    cell.textContent = t("emptyTable");
    row.append(cell);
    elements.recordsBody.append(row);
    return;
  }

  records.slice(0, 100).forEach((record) => {
    const row = document.createElement("tr");

    const dateCell = document.createElement("td");
    const datePrimary = document.createElement("span");
    datePrimary.className = "cell-primary";
    datePrimary.textContent = formatDate(record.date);
    const idSecondary = document.createElement("span");
    idSecondary.className = "cell-secondary";
    idSecondary.textContent = record.id;
    dateCell.append(datePrimary, idSecondary);

    const customerCell = document.createElement("td");
    customerCell.textContent = record.customer || "—";

    const farmCell = document.createElement("td");
    farmCell.textContent = record.farm || t("noFarm");

    const categoryCell = document.createElement("td");
    const chip = document.createElement("span");
    const chipStyle = categoryChipStyle(record.category);
    chip.className = "category-chip";
    chip.style.setProperty("--chip-bg", chipStyle.background);
    chip.style.setProperty("--chip-color", chipStyle.color);
    chip.textContent = categoryLabel(record.category);
    categoryCell.append(chip);

    const detailCell = document.createElement("td");
    detailCell.textContent = record.detail || "—";

    const resultCell = document.createElement("td");
    resultCell.textContent = record.result || t("noResult");

    const sampleCell = document.createElement("td");
    sampleCell.textContent = record.sampleCount
      ? formatNumber(record.sampleCount)
      : "—";

    const areaCell = document.createElement("td");
    areaCell.textContent = record.area || "—";

    row.append(
      dateCell,
      customerCell,
      farmCell,
      categoryCell,
      detailCell,
      resultCell,
      sampleCell,
      areaCell,
    );
    elements.recordsBody.append(row);
  });
}

function renderRecentHistory(records) {
  const recent = recentlyAdded(records, 30);
  elements.historyCount.textContent = t("recentCount", {
    count: formatNumber(recent.length),
  });
  elements.recentHistory.replaceChildren();

  if (!recent.length) {
    const empty = document.createElement("p");
    empty.className = "empty-table";
    empty.textContent = t("emptyTable");
    elements.recentHistory.append(empty);
    return;
  }

  const groups = new Map();
  for (const record of recent) {
    if (!groups.has(record.category)) groups.set(record.category, []);
    groups.get(record.category).push(record);
  }

  for (const [category, items] of groups) {
    const group = document.createElement("article");
    group.className = "history-group";

    const header = document.createElement("div");
    header.className = "history-group-header";
    const title = document.createElement("strong");
    title.textContent = categoryLabel(category);
    const count = document.createElement("span");
    count.textContent = formatNumber(items.length);
    header.append(title, count);

    const list = document.createElement("div");
    list.className = "history-list";

    for (const record of items) {
      const item = document.createElement("div");
      item.className = "history-item";

      const customer = document.createElement("strong");
      customer.textContent = record.customer || "—";

      const summary = document.createElement("p");
      summary.textContent =
        [record.detail, record.result || t("noResult")].filter(Boolean).join(" • ") ||
        "—";

      const meta = document.createElement("div");
      meta.className = "history-meta";
      const date = document.createElement("span");
      date.textContent = formatDateTime(record.addedAt);
      const id = document.createElement("span");
      id.textContent = record.id;
      meta.append(date, id);

      item.append(customer, summary, meta);
      list.append(item);
    }

    group.append(header, list);
    elements.recentHistory.append(group);
  }
}

function render() {
  state.filteredRecords = filterRecords(state.allRecords, currentFilters());
  const records = state.filteredRecords;
  elements.filterResult.textContent = t("recordsMatch", {
    count: formatNumber(records.length),
  });
  renderMetrics(records);
  renderCategoryBars(records);
  renderPcrDonut(records);
  drawMonthlyChart(records);
  renderRecentHistory(state.allRecords);
  renderTable(records);
}

function translateAndRender() {
  updateTranslations();
  if (!isConfigured()) {
    showSetupState();
  } else if (!state.session) {
    showConnectState({
      denied: elements.connectionPill.dataset.state === "error",
    });
  } else {
    showDashboard();
  }
  if (state.allRecords.length) {
    populateFilters();
    render();
  }
}

async function fetchDashboardData() {
  const email = state.session?.user?.email?.toLowerCase();
  if (!email) {
    const error = new Error("Missing authenticated email");
    error.status = 401;
    throw error;
  }

  const { data: access, error: accessError } = await supabaseClient
    .from("authorized_users")
    .select("email,display_name,role,active")
    .eq("email", email)
    .maybeSingle();

  if (accessError) {
    const error = new Error(accessError.message);
    error.status = accessError.code === "42501" ? 403 : 500;
    throw error;
  }
  if (!access?.active) {
    const error = new Error("Email is not approved");
    error.status = 403;
    throw error;
  }

  const { data: rows, error: rowsError } = await supabaseClient
    .from("lab_result_rows")
    .select(
      "test_id,test_date,customer_name,farm_name,lab_name,area,field_force,sample_type,test_category,detail,result,sample_count,status,quality_flag,added_at,added_by",
    )
    .order("test_date", { ascending: false })
    .limit(5000);

  if (rowsError) {
    const error = new Error(rowsError.message);
    error.status = rowsError.code === "42501" ? 403 : 500;
    throw error;
  }

  return { access, rows };
}

function startAutoRefresh() {
  clearInterval(state.refreshTimer);
  state.refreshTimer = setInterval(() => {
    if (state.session) loadData({ silent: true });
  }, DASHBOARD_CONFIG.refreshIntervalMs);
}

function clearDashboardState() {
  clearInterval(state.refreshTimer);
  state.session = null;
  state.access = null;
  state.allRecords = [];
  state.filteredRecords = [];
  elements.signOutButton.classList.add("hidden");
  elements.userBadge.classList.add("hidden");
  elements.refreshButton.disabled = true;
}

async function handleExpiredSession() {
  clearDashboardState();
  await supabaseClient?.auth.signOut({ scope: "local" }).catch(() => {});
  showConnectState();
  showToast(t("authExpired"), "error");
}

async function loadData({ silent = false } = {}) {
  if (state.loading || !state.session) return;
  setLoading(true, !silent);
  try {
    const payload = await fetchDashboardData();
    state.access = payload.access;
    state.allRecords = completedTests(normalizeDatabaseRows(payload.rows));
    populateFilters();
    showDashboard();
    render();
    elements.lastUpdatedValue.textContent = new Intl.DateTimeFormat(
      state.language === "ar" ? "ar-EG" : "en-GB",
      { hour: "2-digit", minute: "2-digit", second: "2-digit" },
    ).format(new Date());
    startAutoRefresh();
    if (!silent) showToast(t("refreshed"));
  } catch (error) {
    if (error.status === 401) {
      await handleExpiredSession();
    } else if (error.status === 403) {
      clearDashboardState();
      await supabaseClient.auth.signOut({ scope: "local" }).catch(() => {});
      showConnectState({ denied: true });
      showAuthMessage(t("accessDeniedDescription"), "error");
    } else {
      setConnection("error", "connectionError");
      showToast(t("generalError"), "error");
      console.error(error);
    }
  } finally {
    setLoading(false);
  }
}

async function handleAuthSubmit(event) {
  event.preventDefault();
  if (!supabaseClient || state.loading) return;

  const email = elements.emailInput.value.trim().toLowerCase();
  const password = elements.passwordInput.value;
  if (password.length < 8) {
    showAuthMessage(t("passwordLength"), "error");
    return;
  }

  setLoading(true);
  showAuthMessage();
  try {
    if (state.authMode === "recovery") {
      const { error } = await supabaseClient.auth.updateUser({ password });
      if (error) throw error;
      setAuthMode("signin");
      showToast(t("passwordUpdated"));
      setLoading(false);
      await loadData();
      return;
    }

    if (state.authMode === "signup") {
      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: DASHBOARD_CONFIG.siteUrl },
      });
      if (error) throw error;
      elements.passwordInput.value = "";
      if (data.session) {
        state.session = data.session;
        setLoading(false);
        await loadData();
      } else {
        setAuthMode("signin");
        elements.emailInput.value = email;
        showAuthMessage(t("accountCreated"));
      }
      return;
    }

    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    state.session = data.session;
    elements.passwordInput.value = "";
    setLoading(false);
    await loadData();
  } catch (error) {
    const message =
      error?.message?.toLowerCase().includes("invalid login") ||
      error?.message?.toLowerCase().includes("credentials")
        ? t("invalidCredentials")
        : error?.message || t("generalError");
    showAuthMessage(message, "error");
  } finally {
    setLoading(false);
  }
}

async function requestPasswordReset() {
  const email = elements.emailInput.value.trim().toLowerCase();
  if (!email) {
    elements.emailInput.focus();
    return;
  }
  setLoading(true);
  try {
    const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
      redirectTo: DASHBOARD_CONFIG.siteUrl,
    });
    if (error) throw error;
    showAuthMessage(t("resetSent"));
  } catch (error) {
    showAuthMessage(error?.message || t("generalError"), "error");
  } finally {
    setLoading(false);
  }
}

async function disconnect() {
  clearDashboardState();
  await supabaseClient.auth.signOut({ scope: "local" });
  showConnectState();
}

function resetFilters() {
  [
    elements.customerFilter,
    elements.categoryFilter,
    elements.detailFilter,
    elements.yearFilter,
    elements.monthFilter,
  ].forEach((select) => {
    select.value = "";
  });
  render();
}

function bindEvents() {
  elements.languageButton.addEventListener("click", () => {
    state.language = state.language === "en" ? "ar" : "en";
    localStorage.setItem("lab-dashboard-language", state.language);
    translateAndRender();
  });

  elements.authForm.addEventListener("submit", handleAuthSubmit);
  elements.createAccountButton.addEventListener("click", () => {
    setAuthMode(state.authMode === "signin" ? "signup" : "signin");
  });
  elements.forgotPasswordButton.addEventListener("click", requestPasswordReset);
  elements.refreshButton.addEventListener("click", () => loadData());
  elements.signOutButton.addEventListener("click", disconnect);
  elements.resetFiltersButton.addEventListener("click", resetFilters);

  [
    elements.customerFilter,
    elements.categoryFilter,
    elements.detailFilter,
    elements.yearFilter,
    elements.monthFilter,
  ].forEach((select) => select.addEventListener("change", render));

  window.addEventListener("resize", () => {
    clearTimeout(state.resizeTimer);
    state.resizeTimer = setTimeout(() => {
      if (state.allRecords.length) drawMonthlyChart(state.filteredRecords);
    }, 100);
  });
}

async function initialize() {
  bindEvents();
  updateTranslations();

  if (!isConfigured()) {
    showSetupState();
    return;
  }

  supabaseClient = window.supabase.createClient(
    DASHBOARD_CONFIG.supabaseUrl,
    DASHBOARD_CONFIG.supabasePublishableKey,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    },
  );

  supabaseClient.auth.onAuthStateChange((event, session) => {
    state.session = session;
    if (event === "PASSWORD_RECOVERY") {
      elements.accessPanel.classList.remove("hidden");
      elements.dashboardContent.classList.add("hidden");
      setAuthMode("recovery");
      return;
    }
    if (event === "SIGNED_OUT") {
      clearDashboardState();
      showConnectState();
      return;
    }
    if (session && ["SIGNED_IN", "TOKEN_REFRESHED", "INITIAL_SESSION"].includes(event)) {
      window.setTimeout(() => loadData({ silent: event !== "SIGNED_IN" }), 0);
    }
  });

  const {
    data: { session },
  } = await supabaseClient.auth.getSession();
  state.session = session;
  if (session) {
    await loadData();
  } else {
    showConnectState();
  }
}

initialize();
