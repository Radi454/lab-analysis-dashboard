import { DASHBOARD_CONFIG } from "./config.js";
import {
  SHEET_DEFINITIONS,
  calculateMetrics,
  categoryCounts,
  completedTests,
  filterRecords,
  getFilterOptions,
  monthlyCounts,
  normalizeValueRanges,
  resultCounts,
} from "./dashboard-core.js";

const GOOGLE_SCOPE = "https://www.googleapis.com/auth/spreadsheets.readonly";
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
    notConnected: "Not connected",
    connected: "Connected",
    connectionError: "Access needed",
    refresh: "Refresh",
    signOut: "Disconnect",
    eyebrow: "Laboratory performance",
    heroTitle: "Completed tests, clearly connected.",
    heroDescription:
      "A secure, live view of completed diagnostic work across customers, categories, and pathogens.",
    lastUpdated: "Last updated",
    notYet: "Not yet",
    autoRefresh: "Refreshes every 30 seconds",
    privateTitle: "Private by design",
    privateDescription:
      "Data loads only after Google verifies that your account can open the source Sheet.",
    secureAccess: "Secure access",
    connectTitle: "Connect your Google account",
    connectDescription:
      "Sign in with an account that has been granted access to the lab results Sheet. The dashboard requests read-only permission.",
    connectButton: "Continue with Google",
    openSheet: "Open source Sheet",
    accessNote:
      "No laboratory data is stored in this website or its GitHub repository.",
    setupTitle: "One owner setup remains",
    setupDescription:
      "Add the production Google OAuth Client ID to config.js, then this button will securely connect approved Google accounts.",
    setupButton: "Google OAuth setup required",
    setupNote:
      "The source Sheet is already private and the dashboard contains no embedded laboratory records.",
    accessDeniedTitle: "This account cannot read the Sheet",
    accessDeniedDescription:
      "Ask the Sheet owner to share the workbook with this Google account, then connect again.",
    reconnect: "Reconnect with Google",
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
    privacyFooter: "Laboratory data remains in Google Drive.",
    loading: "Loading lab results…",
    refreshed: "Dashboard updated from Google Sheets.",
    authExpired: "Google access expired. Reconnect to continue refreshing.",
    generalError: "The dashboard could not load the Sheet. Please try again.",
    gisError: "Google sign-in could not start. Check your connection and try again.",
    popupClosed: "Google sign-in was closed before access was granted.",
    permissionMissing: "Read-only Sheets permission was not granted.",
    configurationMissing: "Google OAuth is not configured yet.",
    categoryAntibiotic: "Antibiotic Sensitivity",
    categoryBacteriology: "Bacteriology",
  },
  ar: {
    skip: "الانتقال إلى لوحة المعلومات",
    brandTitle: "تحاليل المعمل",
    brandSubtitle: "لوحة مؤشرات ذكية",
    notConnected: "غير متصل",
    connected: "متصل",
    connectionError: "يلزم تصريح",
    refresh: "تحديث",
    signOut: "قطع الاتصال",
    eyebrow: "أداء المعمل",
    heroTitle: "الاختبارات المكتملة، بصورة أوضح.",
    heroDescription:
      "عرض حي وآمن للاختبارات التشخيصية المكتملة حسب العملاء والفئات ومسببات الأمراض.",
    lastUpdated: "آخر تحديث",
    notYet: "لم يتم بعد",
    autoRefresh: "تحديث تلقائي كل 30 ثانية",
    privateTitle: "خصوصية من أساس التصميم",
    privateDescription:
      "لا تُحمّل البيانات إلا بعد أن تتحقق Google من صلاحية الحساب لفتح الجدول المصدر.",
    secureAccess: "دخول آمن",
    connectTitle: "اربط حساب Google",
    connectDescription:
      "سجّل الدخول بحساب لديه صلاحية الوصول إلى جدول نتائج المعمل. تطلب اللوحة صلاحية القراءة فقط.",
    connectButton: "المتابعة باستخدام Google",
    openSheet: "فتح الجدول المصدر",
    accessNote:
      "لا تُخزّن أي بيانات معملية داخل هذا الموقع أو مستودع GitHub الخاص به.",
    setupTitle: "تبقّت خطوة إعداد واحدة للمالك",
    setupDescription:
      "أضف معرّف Google OAuth الخاص بالموقع إلى config.js، وبعدها يمكن للحسابات المصرح لها الاتصال بأمان.",
    setupButton: "يلزم إعداد Google OAuth",
    setupNote:
      "الجدول المصدر خاص بالفعل، ولا تحتوي لوحة المعلومات على سجلات معملية مدمجة.",
    accessDeniedTitle: "هذا الحساب لا يستطيع قراءة الجدول",
    accessDeniedDescription:
      "اطلب من مالك الجدول مشاركته مع هذا الحساب، ثم أعد الاتصال.",
    reconnect: "إعادة الاتصال بـ Google",
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
    privacyFooter: "تبقى بيانات المعمل داخل Google Drive.",
    loading: "جارٍ تحميل نتائج المعمل…",
    refreshed: "تم تحديث اللوحة من Google Sheets.",
    authExpired: "انتهت صلاحية Google. أعد الاتصال لمواصلة التحديث.",
    generalError: "تعذر تحميل الجدول. يرجى المحاولة مرة أخرى.",
    gisError: "تعذر بدء تسجيل الدخول إلى Google. تحقق من الاتصال وحاول مرة أخرى.",
    popupClosed: "أُغلقت نافذة Google قبل منح صلاحية الوصول.",
    permissionMissing: "لم يتم منح صلاحية قراءة Google Sheets.",
    configurationMissing: "لم يتم إعداد Google OAuth بعد.",
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
    "connectButton",
    "openSheetLink",
    "dashboardContent",
    "connectionPill",
    "connectionText",
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
    "tableCount",
    "recordsBody",
    "sheetFooterLink",
    "toast",
    "loadingOverlay",
  ].map((id) => [id, document.getElementById(id)]),
);

const state = {
  language: localStorage.getItem("lab-dashboard-language") === "ar" ? "ar" : "en",
  token: "",
  tokenExpiresAt: 0,
  tokenClient: null,
  allRecords: [],
  filteredRecords: [],
  loading: false,
  refreshTimer: null,
  toastTimer: null,
  resizeTimer: null,
};

function t(key, replacements = {}) {
  let value = translations[state.language][key] ?? translations.en[key] ?? key;
  for (const [name, replacement] of Object.entries(replacements)) {
    value = value.replaceAll(`{${name}}`, replacement);
  }
  return value;
}

function isConfigured() {
  return (
    DASHBOARD_CONFIG.googleClientId &&
    !DASHBOARD_CONFIG.googleClientId.includes("YOUR_GOOGLE") &&
    DASHBOARD_CONFIG.googleClientId.endsWith(".apps.googleusercontent.com")
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

  if (state.token) {
    setConnection("online", "connected");
  } else if (elements.connectionPill.dataset.state === "error") {
    setConnection("error", "connectionError");
  } else {
    setConnection("offline", "notConnected");
  }
}

function showToast(message, kind = "info") {
  clearTimeout(state.toastTimer);
  elements.toast.textContent = message;
  elements.toast.dataset.kind = kind;
  elements.toast.classList.remove("hidden");
  state.toastTimer = setTimeout(() => elements.toast.classList.add("hidden"), 4200);
}

function setLoading(loading, overlay = false) {
  state.loading = loading;
  elements.refreshButton.classList.toggle("loading", loading);
  elements.refreshButton.disabled = loading || !state.token;
  elements.loadingOverlay.classList.toggle("hidden", !loading || !overlay);
}

function showSetupState() {
  elements.accessPanel.classList.remove("hidden");
  elements.dashboardContent.classList.add("hidden");
  elements.connectButton.disabled = true;
  elements.openSheetLink.classList.remove("hidden");
  elements.accessTitle.textContent = t("setupTitle");
  elements.accessDescription.textContent = t("setupDescription");
  elements.accessNote.textContent = t("setupNote");
  elements.connectButton.querySelector("[data-i18n]").textContent = t("setupButton");
  setConnection("offline", "notConnected");
}

function showConnectState({ denied = false } = {}) {
  elements.accessPanel.classList.remove("hidden");
  elements.dashboardContent.classList.add("hidden");
  elements.connectButton.disabled = false;
  elements.openSheetLink.classList.remove("hidden");
  elements.accessTitle.textContent = t(denied ? "accessDeniedTitle" : "connectTitle");
  elements.accessDescription.textContent = t(
    denied ? "accessDeniedDescription" : "connectDescription",
  );
  elements.accessNote.textContent = t("accessNote");
  elements.connectButton.querySelector("[data-i18n]").textContent = t(
    denied ? "reconnect" : "connectButton",
  );
  setConnection(denied ? "error" : "offline", denied ? "connectionError" : "notConnected");
}

function showDashboard() {
  elements.accessPanel.classList.add("hidden");
  elements.dashboardContent.classList.remove("hidden");
  elements.signOutButton.classList.remove("hidden");
  elements.refreshButton.disabled = false;
  setConnection("online", "connected");
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
  renderTable(records);
}

function translateAndRender() {
  updateTranslations();
  if (!isConfigured()) {
    showSetupState();
  } else if (!state.token) {
    showConnectState({
      denied: elements.connectionPill.dataset.state === "error",
    });
  }
  if (state.allRecords.length) {
    populateFilters();
    render();
  }
}

async function fetchSheetData() {
  const parameters = new URLSearchParams({
    majorDimension: "ROWS",
    valueRenderOption: "FORMATTED_VALUE",
  });
  SHEET_DEFINITIONS.forEach((definition) =>
    parameters.append("ranges", definition.range),
  );

  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${DASHBOARD_CONFIG.spreadsheetId}/values:batchGet?${parameters}`,
    {
      headers: { Authorization: `Bearer ${state.token}` },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    const error = new Error(payload.error?.message || `Google Sheets error ${response.status}`);
    error.status = response.status;
    throw error;
  }

  return response.json();
}

function startAutoRefresh() {
  clearInterval(state.refreshTimer);
  state.refreshTimer = setInterval(() => {
    if (!state.token) return;
    if (Date.now() >= state.tokenExpiresAt) {
      handleExpiredToken();
      return;
    }
    loadData({ silent: true });
  }, DASHBOARD_CONFIG.refreshIntervalMs);
}

function handleExpiredToken() {
  clearInterval(state.refreshTimer);
  state.token = "";
  state.tokenExpiresAt = 0;
  elements.signOutButton.classList.add("hidden");
  showConnectState();
  showToast(t("authExpired"), "error");
}

async function loadData({ silent = false } = {}) {
  if (state.loading || !state.token) return;
  setLoading(true, !silent);
  try {
    const payload = await fetchSheetData();
    state.allRecords = completedTests(normalizeValueRanges(payload.valueRanges));
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
      handleExpiredToken();
    } else if (error.status === 403 || error.status === 404) {
      clearInterval(state.refreshTimer);
      state.token = "";
      state.tokenExpiresAt = 0;
      elements.signOutButton.classList.add("hidden");
      showConnectState({ denied: true });
      showToast(t("accessDeniedDescription"), "error");
    } else {
      setConnection("error", "connectionError");
      showToast(t("generalError"), "error");
      console.error(error);
    }
  } finally {
    setLoading(false);
  }
}

function requestGoogleAccess() {
  if (!isConfigured()) {
    showToast(t("configurationMissing"), "error");
    return;
  }
  if (!state.tokenClient) {
    showToast(t("gisError"), "error");
    return;
  }
  state.tokenClient.requestAccessToken({ prompt: "select_account" });
}

function initializeGoogleClient() {
  state.tokenClient = window.google.accounts.oauth2.initTokenClient({
    client_id: DASHBOARD_CONFIG.googleClientId,
    scope: GOOGLE_SCOPE,
    callback: async (response) => {
      if (response.error) {
        showToast(
          response.error === "popup_closed" ? t("popupClosed") : t("gisError"),
          "error",
        );
        return;
      }

      if (
        !response.access_token ||
        !window.google.accounts.oauth2.hasGrantedAllScopes(response, GOOGLE_SCOPE)
      ) {
        showToast(t("permissionMissing"), "error");
        return;
      }

      state.token = response.access_token;
      state.tokenExpiresAt =
        Date.now() + Math.max(Number(response.expires_in || 3600) - 60, 60) * 1000;
      await loadData();
    },
    error_callback: (error) => {
      showToast(
        error.type === "popup_closed" ? t("popupClosed") : t("gisError"),
        "error",
      );
    },
  });
}

async function waitForGoogleIdentity(timeoutMs = 12_000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    if (window.google?.accounts?.oauth2) return true;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  return false;
}

function disconnect() {
  clearInterval(state.refreshTimer);
  const token = state.token;
  state.token = "";
  state.tokenExpiresAt = 0;
  state.allRecords = [];
  state.filteredRecords = [];
  elements.signOutButton.classList.add("hidden");
  elements.refreshButton.disabled = true;
  showConnectState();
  if (token && window.google?.accounts?.oauth2) {
    window.google.accounts.oauth2.revoke(token, () => {});
  }
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

  elements.connectButton.addEventListener("click", requestGoogleAccess);
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
  elements.openSheetLink.href = DASHBOARD_CONFIG.sheetUrl;
  elements.sheetFooterLink.href = DASHBOARD_CONFIG.sheetUrl;
  bindEvents();
  updateTranslations();

  if (!isConfigured()) {
    showSetupState();
    return;
  }

  showConnectState();
  const ready = await waitForGoogleIdentity();
  if (ready) {
    initializeGoogleClient();
  } else {
    elements.connectButton.disabled = true;
    showToast(t("gisError"), "error");
  }
}

initialize();
