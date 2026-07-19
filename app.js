import { DASHBOARD_CONFIG } from "./config.js";
import {
  calculateMetrics,
  categoryCounts,
  completedTests,
  filterRecords,
  getFilterOptions,
  matchingCustomers,
  monthlyCounts,
  normalizeDatabaseRows,
  pathogenType,
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
    heroTitle: "Completed lab analyses",
    lastUpdated: "Updated",
    notYet: "Not yet",
    signInTitle: "Sign in to view results",
    signInDescription: "",
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
    setupTitle: "Dashboard temporarily unavailable",
    setupDescription: "Please contact the dashboard administrator.",
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
    pathogen: "Pathogen / disease",
    year: "Year",
    month: "Month",
    allCustomers: "All customers",
    searchCustomers: "Search customers by name",
    clearCustomer: "Clear customer",
    noCustomers: "No matching customers",
    allCategories: "All categories",
    allPathogens: "All pathogens",
    viral: "Viral",
    bacterial: "Bacterial",
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
    allTestTypes: "All",
    testTypes: "Test types",
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
    loading: "Loading lab results…",
    refreshed: "Dashboard updated.",
    authExpired: "Your session expired. Sign in again.",
    generalError: "The dashboard could not load the results. Please try again.",
    categoryAntibiotic: "Antibiotic Sensitivity",
    categoryBacteriology: "Bacteriology",
    pathogenAdenovirus: "Adenovirus",
    pathogenInfluenza: "Influenza",
    pathogenPseudomonas: "Pseudomonas",
    pathogenSalmonella: "Salmonella",
    pathogenStaphylococcus: "Staphylococcus",
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
    heroTitle: "تحاليل المعمل المكتملة",
    lastUpdated: "تم التحديث",
    notYet: "لم يتم بعد",
    signInTitle: "سجّل الدخول لعرض النتائج",
    signInDescription: "",
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
    setupTitle: "لوحة المعلومات غير متاحة مؤقتاً",
    setupDescription: "يرجى التواصل مع مسؤول لوحة المعلومات.",
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
    pathogen: "المسبب المرضي / المرض",
    year: "السنة",
    month: "الشهر",
    allCustomers: "كل العملاء",
    searchCustomers: "ابحث باسم العميل",
    clearCustomer: "مسح العميل",
    noCustomers: "لا يوجد عملاء مطابقون",
    allCategories: "كل الفئات",
    allPathogens: "كل المسببات",
    viral: "فيروسية",
    bacterial: "بكتيرية",
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
    allTestTypes: "الكل",
    testTypes: "أنواع التحاليل",
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
    loading: "جارٍ تحميل نتائج المعمل…",
    refreshed: "تم تحديث لوحة المعلومات.",
    authExpired: "انتهت الجلسة. يرجى تسجيل الدخول مرة أخرى.",
    generalError: "تعذر تحميل النتائج. يرجى المحاولة مرة أخرى.",
    categoryAntibiotic: "حساسية المضادات الحيوية",
    categoryBacteriology: "البكتريولوجي",
    pathogenAdenovirus: "الأدينو فيروس",
    pathogenInfluenza: "الإنفلونزا",
    pathogenPseudomonas: "السودوموناس",
    pathogenSalmonella: "السالمونيلا",
    pathogenStaphylococcus: "الستافيلوكوكس",
  },
};

const elements = Object.fromEntries(
  [
    "accessPanel",
    "accessTitle",
    "accessDescription",
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
    "freshnessRow",
    "lastUpdatedValue",
    "customerFilter",
    "clearCustomerButton",
    "customerSuggestions",
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
    "registerToggle",
    "registerPanel",
    "registerTabs",
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
  registerExpanded: false,
  registerCategory: "",
  expandedHistoryCategories: new Set(),
  customerOptions: [],
  customerSuggestionIndex: -1,
  filters: {
    customer: "",
    category: "",
    detail: "",
    year: "",
    month: "",
  },
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

function pathogenLabel(pathogen) {
  const labels = {
    Adenovirus: "pathogenAdenovirus",
    Influenza: "pathogenInfluenza",
    Pseudomonas: "pathogenPseudomonas",
    Salmonella: "pathogenSalmonella",
    Staphylococcus: "pathogenStaphylococcus",
  };
  return labels[pathogen] ? t(labels[pathogen]) : pathogen;
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

function monthName(month, format = "short") {
  return new Intl.DateTimeFormat(state.language === "ar" ? "ar-EG" : "en-GB", {
    month: format,
    timeZone: "UTC",
  }).format(new Date(`2026-${month}-01T00:00:00Z`));
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
  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
    node.placeholder = t(node.dataset.i18nPlaceholder);
  });
  document.querySelectorAll("[data-i18n-aria-label]").forEach((node) => {
    node.setAttribute("aria-label", t(node.dataset.i18nAriaLabel));
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

function setAccessDescription(message = "") {
  elements.accessDescription.textContent = message;
  elements.accessDescription.classList.toggle("hidden", !message);
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
  setAccessDescription(t(
    isRecovery
      ? "recoveryDescription"
      : isSignup
        ? "createDescription"
        : "signInDescription",
  ));
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
  elements.freshnessRow.classList.add("hidden");
  elements.authForm.classList.add("hidden");
  elements.createAccountButton.classList.add("hidden");
  elements.forgotPasswordButton.classList.add("hidden");
  elements.accessTitle.textContent = t("setupTitle");
  setAccessDescription(t("setupDescription"));
  setConnection("offline", "signedOut");
}

function showConnectState({ denied = false } = {}) {
  elements.accessPanel.classList.remove("hidden");
  elements.dashboardContent.classList.add("hidden");
  elements.freshnessRow.classList.add("hidden");
  elements.authForm.classList.remove("hidden");
  elements.createAccountButton.classList.remove("hidden");
  elements.forgotPasswordButton.classList.remove("hidden");
  setAuthMode("signin");
  elements.accessTitle.textContent = t(denied ? "accessDeniedTitle" : "signInTitle");
  setAccessDescription(t(
    denied ? "accessDeniedDescription" : "signInDescription",
  ));
  setConnection(denied ? "error" : "offline", denied ? "connectionError" : "signedOut");
}

function showDashboard() {
  elements.accessPanel.classList.add("hidden");
  elements.dashboardContent.classList.remove("hidden");
  elements.freshnessRow.classList.remove("hidden");
  elements.signOutButton.classList.remove("hidden");
  elements.userBadge.classList.remove("hidden");
  elements.userName.textContent =
    state.access?.display_name || state.session?.user?.email || "";
  elements.userRole.textContent = state.access?.role || "";
  elements.refreshButton.disabled = false;
  setConnection("online", "signedIn");
}

function closeCustomerSuggestions() {
  state.customerSuggestionIndex = -1;
  elements.customerSuggestions.classList.add("hidden");
  elements.customerFilter.setAttribute("aria-expanded", "false");
  elements.customerFilter.removeAttribute("aria-activedescendant");
}

function updateCustomerClearButton() {
  elements.clearCustomerButton.classList.toggle(
    "hidden",
    !elements.customerFilter.value,
  );
}

function updateCustomerSuggestionActive(index) {
  const options = [
    ...elements.customerSuggestions.querySelectorAll('[role="option"]'),
  ];
  if (!options.length) {
    state.customerSuggestionIndex = -1;
    elements.customerFilter.removeAttribute("aria-activedescendant");
    return;
  }

  state.customerSuggestionIndex =
    (index + options.length) % options.length;
  options.forEach((option, optionIndex) => {
    const active = optionIndex === state.customerSuggestionIndex;
    option.classList.toggle("active", active);
    option.setAttribute("aria-selected", String(active));
  });

  const activeOption = options[state.customerSuggestionIndex];
  elements.customerFilter.setAttribute(
    "aria-activedescendant",
    activeOption.id,
  );
  activeOption.scrollIntoView({ block: "nearest" });
}

function selectCustomer(customer) {
  state.filters.customer = customer;
  state.filters.detail = "";
  elements.customerFilter.value = customer;
  updateCustomerClearButton();
  closeCustomerSuggestions();
  populateFilters();
  render();
}

function renderCustomerSuggestions() {
  const matches = matchingCustomers(
    state.customerOptions,
    elements.customerFilter.value,
  );
  elements.customerSuggestions.replaceChildren();
  state.customerSuggestionIndex = -1;
  elements.customerFilter.removeAttribute("aria-activedescendant");

  if (!matches.length) {
    const empty = document.createElement("p");
    empty.className = "customer-suggestion-empty";
    empty.textContent = t("noCustomers");
    elements.customerSuggestions.append(empty);
  } else {
    matches.forEach((customer, index) => {
      const option = document.createElement("button");
      option.type = "button";
      option.id = `customer-option-${index}`;
      option.className = "customer-suggestion";
      option.setAttribute("role", "option");
      option.setAttribute("aria-selected", "false");
      option.textContent = customer;
      option.addEventListener("pointerdown", (event) => event.preventDefault());
      option.addEventListener("click", () => selectCustomer(customer));
      elements.customerSuggestions.append(option);
    });
  }

  elements.customerSuggestions.classList.remove("hidden");
  elements.customerFilter.setAttribute("aria-expanded", "true");
}

function clearCustomerSelection({ keepFocus = false } = {}) {
  state.filters.customer = "";
  state.filters.detail = "";
  elements.customerFilter.value = "";
  closeCustomerSuggestions();
  updateCustomerClearButton();
  populateFilters();
  render();
  if (keepFocus) {
    elements.customerFilter.focus();
    renderCustomerSuggestions();
  }
}

function createFilterButton(value, label, selectionKey) {
  const button = document.createElement("button");
  const selected = state.filters[selectionKey] === value;
  button.type = "button";
  button.className = "filter-option";
  button.dataset.value = value;
  button.setAttribute("aria-pressed", String(selected));
  button.textContent = label;
  button.addEventListener("click", () => {
    state.filters[selectionKey] = value;
    if (selectionKey === "category") state.filters.detail = "";
    populateFilters();
    render();
  });
  return button;
}

function populateButtonFilter(
  container,
  values,
  selectionKey,
  firstLabel,
  display = (value) => value,
) {
  if (
    state.filters[selectionKey] &&
    !values.includes(state.filters[selectionKey])
  ) {
    state.filters[selectionKey] = "";
  }

  container.replaceChildren();
  const options = [{ value: "", label: firstLabel }].concat(
    values.map((value) => ({ value, label: display(value) })),
  );

  for (const option of options) {
    container.append(
      createFilterButton(option.value, option.label, selectionKey),
    );
  }
}

function populatePathogenFilter(values) {
  if (state.filters.detail && !values.includes(state.filters.detail)) {
    state.filters.detail = "";
  }

  elements.detailFilter.replaceChildren();

  const allRow = document.createElement("div");
  allRow.className = "filter-button-list pathogen-all-row";
  allRow.append(createFilterButton("", t("allPathogens"), "detail"));
  elements.detailFilter.append(allRow);

  for (const type of ["viral", "bacterial"]) {
    const typedValues = values.filter((value) => pathogenType(value) === type);
    if (!typedValues.length) continue;

    const group = document.createElement("section");
    group.className = "pathogen-filter-group";
    group.setAttribute("aria-labelledby", `pathogen-${type}-label`);

    const label = document.createElement("h3");
    label.id = `pathogen-${type}-label`;
    label.className = `pathogen-group-label ${type}`;
    label.textContent = t(type);

    const list = document.createElement("div");
    list.className = "filter-button-list";
    for (const value of typedValues) {
      list.append(
        createFilterButton(value, pathogenLabel(value), "detail"),
      );
    }

    group.append(label, list);
    elements.detailFilter.append(group);
  }
}

function populateFilters({ preserveCustomerQuery = false } = {}) {
  const options = getFilterOptions(state.allRecords);
  const customerQuery = elements.customerFilter.value;
  state.customerOptions = options.customers;
  if (
    state.filters.customer &&
    !state.customerOptions.includes(state.filters.customer)
  ) {
    state.filters.customer = "";
  }
  if (state.filters.customer) {
    elements.customerFilter.value = state.filters.customer;
  } else if (!preserveCustomerQuery) {
    elements.customerFilter.value = "";
  } else {
    elements.customerFilter.value = customerQuery;
  }
  updateCustomerClearButton();

  populateButtonFilter(
    elements.categoryFilter,
    options.categories,
    "category",
    t("allCategories"),
    categoryLabel,
  );

  const detailRecords = filterRecords(state.allRecords, {
    customer: state.filters.customer,
    category: state.filters.category,
  });
  populatePathogenFilter(getFilterOptions(detailRecords).details);
  populateButtonFilter(
    elements.yearFilter,
    options.years,
    "year",
    t("allYears"),
  );

  const months = Array.from({ length: 12 }, (_, index) =>
    String(index + 1).padStart(2, "0"),
  );
  populateButtonFilter(
    elements.monthFilter,
    months,
    "month",
    t("allMonths"),
    (month) => monthName(month),
  );
}

function currentFilters() {
  return { ...state.filters };
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
  const series = monthlyCounts(records, state.filters.year);
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

function renderRegisterTabs(records) {
  const categories = categoryCounts(records).map((item) => item.label);
  if (state.registerCategory && !categories.includes(state.registerCategory)) {
    state.registerCategory = "";
  }

  elements.registerTabs.setAttribute("aria-label", t("testTypes"));
  elements.registerTabs.replaceChildren();

  const tabs = [
    { value: "", label: t("allTestTypes") },
    ...categories.map((category) => ({
      value: category,
      label: categoryLabel(category),
    })),
  ];

  for (const tab of tabs) {
    const button = document.createElement("button");
    const selected = state.registerCategory === tab.value;
    button.type = "button";
    button.className = "register-tab";
    button.setAttribute("role", "tab");
    button.setAttribute("aria-selected", String(selected));
    button.setAttribute("tabindex", selected ? "0" : "-1");
    button.setAttribute("aria-controls", "recordsTablePanel");
    button.textContent = tab.label;
    button.addEventListener("click", () => {
      state.registerCategory = tab.value;
      renderTable(state.filteredRecords);
    });
    elements.registerTabs.append(button);
  }
}

function renderTable(records) {
  renderRegisterTabs(records);
  const visibleRecords = state.registerCategory
    ? records.filter((record) => record.category === state.registerCategory)
    : records;

  elements.recordsBody.replaceChildren();
  elements.tableCount.textContent = t("recordCount", {
    count: formatNumber(visibleRecords.length),
  });

  if (!visibleRecords.length) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 8;
    cell.className = "empty-table";
    cell.textContent = t("emptyTable");
    row.append(cell);
    elements.recordsBody.append(row);
    return;
  }

  visibleRecords.slice(0, 100).forEach((record) => {
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

  let groupIndex = 0;
  for (const [category, items] of groups) {
    const group = document.createElement("article");
    group.className = "history-group";

    const listId = `recent-history-${groupIndex}`;
    const isExpanded = state.expandedHistoryCategories.has(category);
    const header = document.createElement("button");
    header.type = "button";
    header.className = "history-group-header";
    header.setAttribute("aria-expanded", String(isExpanded));
    header.setAttribute("aria-controls", listId);
    const title = document.createElement("strong");
    title.textContent = categoryLabel(category);
    const meta = document.createElement("span");
    meta.className = "history-group-meta";
    const count = document.createElement("span");
    count.textContent = formatNumber(items.length);
    const disclosure = document.createElement("span");
    disclosure.className = "disclosure-icon";
    disclosure.setAttribute("aria-hidden", "true");
    disclosure.textContent = "⌄";
    meta.append(count, disclosure);
    header.append(title, meta);

    const list = document.createElement("div");
    list.id = listId;
    list.className = "history-list";
    list.classList.toggle("hidden", !isExpanded);

    header.addEventListener("click", () => {
      const expanded = header.getAttribute("aria-expanded") === "true";
      header.setAttribute("aria-expanded", String(!expanded));
      list.classList.toggle("hidden", expanded);
      if (expanded) state.expandedHistoryCategories.delete(category);
      else state.expandedHistoryCategories.add(category);
    });

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
    groupIndex += 1;
  }
}

function updateRegisterDisclosure() {
  elements.registerToggle.setAttribute(
    "aria-expanded",
    String(state.registerExpanded),
  );
  elements.registerPanel.classList.toggle("hidden", !state.registerExpanded);
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
  closeCustomerSuggestions();
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
  elements.freshnessRow.classList.add("hidden");
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
  elements.customerFilter.value = "";
  closeCustomerSuggestions();
  state.filters = {
    customer: "",
    category: "",
    detail: "",
    year: "",
    month: "",
  };
  populateFilters();
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
  elements.registerToggle.addEventListener("click", () => {
    state.registerExpanded = !state.registerExpanded;
    updateRegisterDisclosure();
  });
  elements.registerTabs.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    const tabs = [...elements.registerTabs.querySelectorAll('[role="tab"]')];
    const currentIndex = tabs.indexOf(document.activeElement);
    if (currentIndex < 0) return;

    event.preventDefault();
    const direction = document.documentElement.dir === "rtl" ? -1 : 1;
    let nextIndex = currentIndex;
    if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = tabs.length - 1;
    else if (event.key === "ArrowRight") {
      nextIndex = (currentIndex + direction + tabs.length) % tabs.length;
    } else {
      nextIndex = (currentIndex - direction + tabs.length) % tabs.length;
    }
    tabs[nextIndex].click();
    elements.registerTabs.querySelector('[aria-selected="true"]')?.focus();
  });

  elements.customerFilter.addEventListener("focus", () => {
    renderCustomerSuggestions();
  });
  elements.customerFilter.addEventListener("input", () => {
    const selectionChanged =
      state.filters.customer !== elements.customerFilter.value;
    if (selectionChanged && state.filters.customer) {
      state.filters.customer = "";
      state.filters.detail = "";
      populateFilters({ preserveCustomerQuery: true });
      render();
    }
    updateCustomerClearButton();
    renderCustomerSuggestions();
  });
  elements.customerFilter.addEventListener("keydown", (event) => {
    const options = [
      ...elements.customerSuggestions.querySelectorAll('[role="option"]'),
    ];

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (elements.customerSuggestions.classList.contains("hidden")) {
        renderCustomerSuggestions();
      }
      const nextIndex =
        state.customerSuggestionIndex < 0
          ? event.key === "ArrowDown"
            ? 0
            : -1
          : state.customerSuggestionIndex +
            (event.key === "ArrowDown" ? 1 : -1);
      updateCustomerSuggestionActive(
        nextIndex,
      );
    } else if (
      event.key === "Enter" &&
      options.length &&
      !elements.customerSuggestions.classList.contains("hidden")
    ) {
      event.preventDefault();
      const index = Math.max(state.customerSuggestionIndex, 0);
      options[index].click();
    } else if (event.key === "Escape") {
      if (state.filters.customer) {
        elements.customerFilter.value = state.filters.customer;
        updateCustomerClearButton();
      }
      closeCustomerSuggestions();
    }
  });
  elements.customerFilter.addEventListener("blur", () => {
    closeCustomerSuggestions();
  });
  elements.clearCustomerButton.addEventListener("click", () => {
    clearCustomerSelection({ keepFocus: true });
  });

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
  updateRegisterDisclosure();

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
