(function () {
  "use strict";

  const STORAGE_KEY = "rdl-darts-gegner-db-v1";
  const TRAINING_STORAGE_KEY = "rdl-darts-training-v1";
  const AUTH_KEY = "rdl-darts-auth-v1";
  const AUTH_SESSION_KEY = "rdl-darts-auth-session-v1";

  const opponentFieldTypes = {
    age: "number",
    dartWeight: "number",
    seasonsPlayed: "number",
    average: "number",
    doubleRate: "number",
    first9Average: "number",
    shortleg: "number",
    tonsPlus: "number",
    oneFortyPlus: "number",
    oneEighties: "number",
    highFinish: "number",
    scoringStrength: "number",
    doubleStrength: "number",
    mentalStrength: "number"
  };

  const matchFieldTypes = {
    legsWon: "number",
    legsLost: "number",
    myAverage: "number",
    first9Average: "number",
    opponentAverage: "number",
    myDoubleRate: "number",
    opponentDoubleRate: "number",
    scores100Plus: "number",
    scores140Plus: "number",
    my180s: "number",
    opponent180s: "number",
    myHighFinish: "number",
    opponentHighFinish: "number",
    bestLeg: "number",
    worstLeg: "number",
    nervousBefore: "number",
    nervousDuring: "number",
    throwFeeling: "number",
    concentration: "number",
    satisfaction: "number"
  };

  const setupFieldTypes = {
    weight: "number"
  };

  const playerFieldTypes = {
    age: "number",
    dartWeight: "number",
    average: "number",
    highFinish: "number"
  };

  const APP_NAME = "Darts Performance Hub";

  const defaultPlayerProfile = {
    name: "aki",
    season: "S12",
    average: 54,
    highFinish: 132,
    favoriteDouble: "D16",
    dartWeight: 22,
    hometown: "Schloss Holte",
    age: 59,
    notes: ""
  };

  const resultLabels = {
    win: "Sieg",
    draw: "Unentschieden",
    loss: "Niederlage",
    open: "Offen"
  };

  const computerOpponents = [
    { id: "warmup", name: "Warm-up Gegner", average: 36, checkout: 0.08, spread: 18 },
    { id: "steady", name: "Stabiler Liga-Gegner", average: 44, checkout: 0.12, spread: 16 },
    { id: "strong", name: "Starker Liga-Gegner", average: 52, checkout: 0.16, spread: 14 },
    { id: "top", name: "Top Gegner", average: 60, checkout: 0.21, spread: 12 },
    { id: "rank1", name: "Platz 1 Druck", average: 66, checkout: 0.27, spread: 10 }
  ];

  const app = {
    data: loadData(),
    editingOpponentId: null,
    editingMatchId: null,
    editingSetupId: null,
    selectedProfileId: null,
    leaderboardSort: "wins",
    leaderboardDirection: "desc",
    authMode: "setup",
    training: loadTrainingData(),
    trainingGame: null,
    matchScreenshotData: ""
  };

  const els = {};

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    cacheElements();
    bindEvents();
    initializeAuth();
  }

  function cacheElements() {
    els.appShell = document.getElementById("appShell");
    els.authGate = document.getElementById("authGate");
    els.authForm = document.getElementById("authForm");
    els.authTitle = document.getElementById("authTitle");
    els.authIntro = document.getElementById("authIntro");
    els.authPasswordLabel = document.getElementById("authPasswordLabel");
    els.authPassword = document.getElementById("authPassword");
    els.authConfirmWrap = document.getElementById("authConfirmWrap");
    els.authPasswordConfirm = document.getElementById("authPasswordConfirm");
    els.authSubmitButton = document.getElementById("authSubmitButton");
    els.authMessage = document.getElementById("authMessage");

    els.panels = document.querySelectorAll("[data-panel]");
    els.tabButtons = document.querySelectorAll(".tab-button");
    els.dashboardStats = document.getElementById("dashboardStats");
    els.dashboardPlayerCard = document.getElementById("dashboardPlayerCard");
    els.dashboardEventTabs = document.getElementById("dashboardEventTabs");
    els.globalSearch = document.getElementById("globalSearch");
    els.dashboardScopeSelect = document.getElementById("dashboardScopeSelect");
    els.seasonFilter = document.getElementById("seasonFilter");
    els.resultFilter = document.getElementById("resultFilter");
    els.categoryFilter = document.getElementById("categoryFilter");
    els.avgMinFilter = document.getElementById("avgMinFilter");
    els.avgMaxFilter = document.getElementById("avgMaxFilter");
    els.seasonsPlayedFilter = document.getElementById("seasonsPlayedFilter");
    els.clearFiltersButton = document.getElementById("clearFiltersButton");
    els.quickSortSelect = document.getElementById("quickSortSelect");
    els.opponentQuickTable = document.getElementById("opponentQuickTable");
    els.quickCount = document.getElementById("quickCount");

    els.opponentForm = document.getElementById("opponentForm");
    els.opponentFormTitle = document.getElementById("opponentFormTitle");
    els.opponentEditState = document.getElementById("opponentEditState");
    els.opponentSubmitButton = document.getElementById("opponentSubmitButton");
    els.cancelOpponentEditButton = document.getElementById("cancelOpponentEditButton");
    els.newOpponentButton = document.getElementById("newOpponentButton");
    els.opponentCategorySelect = document.getElementById("opponentCategorySelect");
    els.opponentNewEventWrap = document.getElementById("opponentNewEventWrap");
    els.opponentList = document.getElementById("opponentList");
    els.opponentListSearch = document.getElementById("opponentListSearch");
    els.opponentCount = document.getElementById("opponentCount");

    els.profileTitle = document.getElementById("profileTitle");
    els.profileContent = document.getElementById("profileContent");
    els.profileAddMatchButton = document.getElementById("profileAddMatchButton");

    els.matchForm = document.getElementById("matchForm");
    els.matchFormTitle = document.getElementById("matchFormTitle");
    els.matchEditState = document.getElementById("matchEditState");
    els.matchSubmitButton = document.getElementById("matchSubmitButton");
    els.cancelMatchEditButton = document.getElementById("cancelMatchEditButton");
    els.newMatchButton = document.getElementById("newMatchButton");
    els.matchOpponentSelect = document.getElementById("matchOpponentSelect");
    els.matchSetupSelect = document.getElementById("matchSetupSelect");
    els.matchScreenshotInput = document.getElementById("matchScreenshotInput");
    els.matchScreenshotPreview = document.getElementById("matchScreenshotPreview");
    els.removeMatchScreenshotButton = document.getElementById("removeMatchScreenshotButton");
    els.matchResultPreview = document.getElementById("matchResultPreview");
    els.matchTable = document.getElementById("matchTable");
    els.matchCount = document.getElementById("matchCount");

    els.setupForm = document.getElementById("setupForm");
    els.playerForm = document.getElementById("playerForm");
    els.myPlayerCard = document.getElementById("myPlayerCard");
    els.setupSubmitButton = document.getElementById("setupSubmitButton");
    els.cancelSetupEditButton = document.getElementById("cancelSetupEditButton");
    els.setupCount = document.getElementById("setupCount");
    els.setupTable = document.getElementById("setupTable");
    els.myGameStatsGrid = document.getElementById("myGameStatsGrid");

    els.statsSeasonFilter = document.getElementById("statsSeasonFilter");
    els.statsCompetitionFilter = document.getElementById("statsCompetitionFilter");
    els.statsGrid = document.getElementById("statsGrid");
    els.leaderboardSeasonFilter = document.getElementById("leaderboardSeasonFilter");
    els.leaderboardSortSelect = document.getElementById("leaderboardSortSelect");
    els.leaderboardTable = document.getElementById("leaderboardTable");

    els.analysisStatsGrid = document.getElementById("analysisStatsGrid");
    els.analysisCompetitionFilter = document.getElementById("analysisCompetitionFilter");
    els.analysisInsightCount = document.getElementById("analysisInsightCount");
    els.analysisInsights = document.getElementById("analysisInsights");
    els.performanceReport = document.getElementById("performanceReport");

    els.trainingWidgetCount = document.getElementById("trainingWidgetCount");
    els.trainingWidgetBest = document.getElementById("trainingWidgetBest");
    els.trainingWidgetLast = document.getElementById("trainingWidgetLast");
    els.startTrainingGameButton = document.getElementById("startTrainingGameButton");
    els.trainingOpponentSelect = document.getElementById("trainingOpponentSelect");
    els.trainingStartScore = document.getElementById("trainingStartScore");
    els.trainingGameState = document.getElementById("trainingGameState");
    els.trainingPlayerScore = document.getElementById("trainingPlayerScore");
    els.trainingComputerScore = document.getElementById("trainingComputerScore");
    els.trainingPlayerMeta = document.getElementById("trainingPlayerMeta");
    els.trainingComputerMeta = document.getElementById("trainingComputerMeta");
    els.trainingThrowForm = document.getElementById("trainingThrowForm");
    els.trainingVisitScore = document.getElementById("trainingVisitScore");
    els.trainingDoubleOut = document.getElementById("trainingDoubleOut");
    els.trainingBustButton = document.getElementById("trainingBustButton");
    els.trainingFeedback = document.getElementById("trainingFeedback");
    els.trainingLog = document.getElementById("trainingLog");
    els.trainingStatsGrid = document.getElementById("trainingStatsGrid");
    els.doublePracticeForm = document.getElementById("doublePracticeForm");
    els.scoringPracticeForm = document.getElementById("scoringPracticeForm");
    els.trainingHistoryCount = document.getElementById("trainingHistoryCount");
    els.trainingHistoryTable = document.getElementById("trainingHistoryTable");

    els.quickExportButton = document.getElementById("quickExportButton");
    els.quickImportButton = document.getElementById("quickImportButton");
    els.logoutButton = document.getElementById("logoutButton");
    els.exportButton = document.getElementById("exportButton");
    els.importButton = document.getElementById("importButton");
    els.importFileInput = document.getElementById("importFileInput");
    els.resetButton = document.getElementById("resetButton");
  }

  function bindEvents() {
    els.authForm.addEventListener("submit", handleAuthSubmit);

    els.tabButtons.forEach((button) => {
      button.addEventListener("click", () => showSection(button.dataset.section));
    });

    document.querySelectorAll("[data-jump]").forEach((button) => {
      button.addEventListener("click", () => showSection(button.dataset.jump));
    });

    [
      els.globalSearch,
      els.seasonFilter,
      els.resultFilter,
      els.categoryFilter,
      els.avgMinFilter,
      els.avgMaxFilter,
      els.seasonsPlayedFilter
    ].forEach((input) => input.addEventListener("input", renderDashboardOpponents));
    els.categoryFilter.addEventListener("change", () => {
      renderEventControls();
      renderDashboardOpponents();
    });
    els.dashboardScopeSelect.addEventListener("change", () => {
      renderDashboardStats();
      renderDashboardOpponents();
    });
    els.quickSortSelect.addEventListener("change", renderDashboardOpponents);
    els.dashboardEventTabs.addEventListener("click", (event) => {
      const button = event.target.closest("[data-event-filter]");
      if (!button) return;
      els.categoryFilter.value = button.dataset.eventFilter;
      renderEventControls();
      renderDashboardOpponents();
    });

    els.clearFiltersButton.addEventListener("click", clearFilters);
    els.opponentListSearch.addEventListener("input", renderOpponentList);

    els.opponentForm.addEventListener("submit", handleOpponentSubmit);
    els.opponentCategorySelect.addEventListener("change", updateOpponentEventField);
    els.cancelOpponentEditButton.addEventListener("click", resetOpponentForm);
    els.newOpponentButton.addEventListener("click", () => {
      resetOpponentForm();
      els.opponentForm.querySelector("[name='name']").focus();
    });

    els.matchForm.addEventListener("submit", handleMatchSubmit);
    els.cancelMatchEditButton.addEventListener("click", resetMatchForm);
    els.newMatchButton.addEventListener("click", () => {
      resetMatchForm();
      els.matchForm.querySelector("[name='date']").focus();
    });

    els.playerForm.addEventListener("submit", handlePlayerSubmit);
    els.setupForm.addEventListener("submit", handleSetupSubmit);
    els.cancelSetupEditButton.addEventListener("click", resetSetupForm);

    ["score", "legsWon", "legsLost"].forEach((name) => {
      els.matchForm.elements[name].addEventListener("input", handleScoreInput);
    });
    els.matchScreenshotInput.addEventListener("change", handleMatchScreenshotSelect);
    els.removeMatchScreenshotButton.addEventListener("click", () => {
      app.matchScreenshotData = "";
      els.matchScreenshotInput.value = "";
      renderMatchScreenshotPreview("");
    });

    els.profileAddMatchButton.addEventListener("click", () => {
      if (!app.selectedProfileId) return;
      resetMatchForm();
      els.matchForm.elements.opponentId.value = app.selectedProfileId;
      updateMatchResultPreview();
      showSection("matches");
    });

    els.statsSeasonFilter.addEventListener("change", renderStats);
    els.statsCompetitionFilter.addEventListener("change", renderStats);
    els.analysisCompetitionFilter.addEventListener("change", renderAnalysis);
    els.leaderboardSeasonFilter.addEventListener("change", renderLeaderboard);
    els.leaderboardSortSelect.addEventListener("change", () => {
      app.leaderboardSort = els.leaderboardSortSelect.value;
      app.leaderboardDirection = "desc";
      renderLeaderboard();
    });

    els.startTrainingGameButton.addEventListener("click", startTrainingGame);
    els.trainingThrowForm.addEventListener("submit", handleTrainingVisitSubmit);
    els.trainingBustButton.addEventListener("click", () => handleTrainingVisit(0, false, true));
    els.doublePracticeForm.addEventListener("submit", handleDoublePracticeSubmit);
    els.scoringPracticeForm.addEventListener("submit", handleScoringPracticeSubmit);

    document.querySelector(".sortable-table").addEventListener("click", (event) => {
      const button = event.target.closest("[data-sort-key]");
      if (!button) return;
      const key = button.dataset.sortKey;
      if (key === "rank") return;
      if (app.leaderboardSort === key) {
        app.leaderboardDirection = app.leaderboardDirection === "asc" ? "desc" : "asc";
      } else {
        app.leaderboardSort = key;
        app.leaderboardDirection = key === "name" ? "asc" : "desc";
      }
      els.leaderboardSortSelect.value = key;
      renderLeaderboard();
    });

    document.addEventListener("click", handleActionClick);

    els.quickExportButton.addEventListener("click", exportData);
    els.exportButton.addEventListener("click", exportData);
    els.quickImportButton.addEventListener("click", () => els.importFileInput.click());
    els.importButton.addEventListener("click", () => els.importFileInput.click());
    els.importFileInput.addEventListener("change", importData);
    els.resetButton.addEventListener("click", resetAllData);
    els.logoutButton.addEventListener("click", lockApp);
  }

  function initializeAuth() {
    const config = getAuthConfig();
    if (!config) {
      showAuthSetup();
      return;
    }

    if (sessionStorage.getItem(AUTH_SESSION_KEY) === "unlocked") {
      unlockApp();
      return;
    }

    showAuthLogin();
  }

  function showAuthSetup() {
    app.authMode = "setup";
    els.authTitle.textContent = "Passwort festlegen";
    els.authIntro.textContent = "Dieses Passwort schuetzt die App in diesem Browser vor neugierigen Blicken.";
    els.authPasswordLabel.textContent = "Neues Passwort";
    els.authPassword.autocomplete = "new-password";
    els.authPassword.value = "";
    els.authPasswordConfirm.value = "";
    els.authConfirmWrap.classList.remove("visually-hidden");
    els.authPasswordConfirm.required = true;
    els.authSubmitButton.textContent = "Passwort festlegen";
    setAuthMessage("");
    showAuthGate();
  }

  function showAuthLogin() {
    app.authMode = "login";
    els.authTitle.textContent = "Login";
    els.authIntro.textContent = "Gib dein Passwort ein, um deinen Darts Performance Hub zu oeffnen.";
    els.authPasswordLabel.textContent = "Passwort";
    els.authPassword.autocomplete = "current-password";
    els.authPassword.value = "";
    els.authPasswordConfirm.value = "";
    els.authConfirmWrap.classList.add("visually-hidden");
    els.authPasswordConfirm.required = false;
    els.authSubmitButton.textContent = "Einloggen";
    setAuthMessage("");
    showAuthGate();
  }

  function showAuthGate() {
    els.appShell.classList.add("locked");
    els.authGate.classList.remove("hidden");
    window.setTimeout(() => els.authPassword.focus(), 0);
  }

  async function handleAuthSubmit(event) {
    event.preventDefault();
    const password = els.authPassword.value;

    if (password.length < 4) {
      setAuthMessage("Bitte mindestens 4 Zeichen verwenden.");
      return;
    }

    if (app.authMode === "setup") {
      if (password !== els.authPasswordConfirm.value) {
        setAuthMessage("Die Passwoerter stimmen nicht ueberein.");
        return;
      }
      const salt = createSalt();
      const result = await hashPassword(password, salt);
      localStorage.setItem(AUTH_KEY, JSON.stringify({
        algorithm: result.algorithm,
        salt,
        hash: result.hash,
        createdAt: new Date().toISOString()
      }));
      sessionStorage.setItem(AUTH_SESSION_KEY, "unlocked");
      unlockApp();
      return;
    }

    const config = getAuthConfig();
    if (!config) {
      showAuthSetup();
      return;
    }

    const result = await hashPassword(password, config.salt, config.algorithm);
    if (result.hash !== config.hash) {
      setAuthMessage("Passwort stimmt nicht.");
      els.authPassword.select();
      return;
    }

    sessionStorage.setItem(AUTH_SESSION_KEY, "unlocked");
    unlockApp();
  }

  function unlockApp() {
    els.authGate.classList.add("hidden");
    els.appShell.classList.remove("locked");
    setDefaultMatchDate();
    renderAll();
  }

  function lockApp() {
    sessionStorage.removeItem(AUTH_SESSION_KEY);
    showAuthLogin();
  }

  function setAuthMessage(message) {
    els.authMessage.textContent = message;
  }

  function getAuthConfig() {
    try {
      const raw = localStorage.getItem(AUTH_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      return null;
    }
  }

  function createSalt() {
    if (window.crypto?.getRandomValues) {
      const bytes = new Uint8Array(16);
      window.crypto.getRandomValues(bytes);
      return base64FromBytes(bytes);
    }
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  }

  async function hashPassword(password, salt, preferredAlgorithm = "auto") {
    if ((preferredAlgorithm === "auto" || preferredAlgorithm === "sha256") && window.crypto?.subtle) {
      const input = new TextEncoder().encode(`${salt}:${password}`);
      const hashBuffer = await window.crypto.subtle.digest("SHA-256", input);
      return {
        algorithm: "sha256",
        hash: base64FromBytes(new Uint8Array(hashBuffer))
      };
    }

    return {
      algorithm: "simple",
      hash: simpleHash(`${salt}:${password}`)
    };
  }

  function base64FromBytes(bytes) {
    let text = "";
    bytes.forEach((byte) => {
      text += String.fromCharCode(byte);
    });
    return btoa(text);
  }

  function simpleHash(value) {
    let hash = 2166136261;
    for (let index = 0; index < value.length; index += 1) {
      hash ^= value.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(16);
  }

  function loadData() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return normalizeData({});
      const parsed = JSON.parse(raw);
      return normalizeData(parsed);
    } catch (error) {
      console.warn("Daten konnten nicht geladen werden.", error);
      return normalizeData({});
    }
  }

  function normalizeData(value) {
    const data = {
      opponents: Array.isArray(value.opponents) ? value.opponents : [],
      matches: Array.isArray(value.matches) ? value.matches : [],
      setups: Array.isArray(value.setups) ? value.setups : [],
      events: Array.isArray(value.events) ? value.events : [],
      player: normalizePlayerProfile(value.player)
    };

    data.events = data.events.map((eventItem) => normalizeEvent(eventItem)).filter((eventItem) => eventItem.name);

    data.opponents = data.opponents.map((opponent) => ({
      id: opponent.id || createId("opp"),
      name: cleanText(opponent.name),
      nickname: cleanText(opponent.nickname),
      rdlName: cleanText(opponent.rdlName || opponent.rdl || ""),
      category: normalizeOpponentCategory(opponent.category),
      age: toNumber(opponent.age),
      hometown: cleanText(opponent.hometown),
      team: cleanText(opponent.team),
      league: cleanText(opponent.league),
      pace: normalizePace(opponent.pace),
      dartWeight: toNumber(opponent.dartWeight),
      favoriteDouble: cleanText(opponent.favoriteDouble),
      seasonsPlayed: toNumber(opponent.seasonsPlayed),
      average: toNumber(opponent.average),
      doubleRate: toNumber(opponent.doubleRate),
      first9Average: toNumber(opponent.first9Average),
      shortleg: toNumber(opponent.shortleg),
      tonsPlus: toNumber(opponent.tonsPlus),
      oneFortyPlus: toNumber(opponent.oneFortyPlus),
      oneEighties: toNumber(opponent.oneEighties),
      highFinish: toNumber(opponent.highFinish),
      scoringStrength: toNumber(opponent.scoringStrength),
      doubleStrength: toNumber(opponent.doubleStrength),
      mentalStrength: toNumber(opponent.mentalStrength),
      notes: cleanText(opponent.notes),
      strengths: cleanText(opponent.strengths),
      weaknesses: cleanText(opponent.weaknesses),
      tactics: cleanText(opponent.tactics),
      createdAt: opponent.createdAt || new Date().toISOString(),
      updatedAt: opponent.updatedAt || new Date().toISOString()
    })).filter((opponent) => opponent.name);

    data.setups = data.setups.map((setup) => ({
      id: setup.id || createId("setup"),
      name: cleanText(setup.name),
      barrel: cleanText(setup.barrel),
      weight: toNumber(setup.weight),
      shaft: cleanText(setup.shaft),
      flight: cleanText(setup.flight),
      points: cleanText(setup.points ?? setup.tips),
      active: setup.active === false || setup.active === "false" ? false : true,
      notes: cleanText(setup.notes),
      createdAt: setup.createdAt || new Date().toISOString(),
      updatedAt: setup.updatedAt || new Date().toISOString()
    })).filter((setup) => setup.name);

    data.matches = data.matches.map((match) => {
      const parsedScore = parseScore(match.score || match.resultText);
      const legsWon = toNumber(match.legsWon) ?? parsedScore?.won ?? null;
      const legsLost = toNumber(match.legsLost) ?? parsedScore?.lost ?? null;
      return {
        id: match.id || createId("match"),
        date: cleanText(match.date),
        season: cleanText(match.season),
        competition: cleanText(match.competition || "Liga"),
        eventName: cleanText(match.eventName),
        opponentId: cleanText(match.opponentId),
        setupId: cleanText(match.setupId),
        score: cleanText(match.score || match.resultText),
        legsWon,
        legsLost,
        myAverage: toNumber(match.myAverage ?? match.average3Dart),
        first9Average: toNumber(match.first9Average),
        opponentAverage: toNumber(match.opponentAverage),
        myDoubleRate: toNumber(match.myDoubleRate ?? match.checkoutQuote),
        opponentDoubleRate: toNumber(match.opponentDoubleRate),
        scores100Plus: toNumber(match.scores100Plus),
        scores140Plus: toNumber(match.scores140Plus),
        my180s: toNumber(match.my180s ?? match.scores180),
        opponent180s: toNumber(match.opponent180s),
        myHighFinish: toNumber(match.myHighFinish ?? match.highFinish),
        opponentHighFinish: toNumber(match.opponentHighFinish),
        bestLeg: toNumber(match.bestLeg),
        worstLeg: toNumber(match.worstLeg),
        nervousBefore: toNumber(match.nervousBefore),
        nervousDuring: toNumber(match.nervousDuring),
        throwFeeling: toNumber(match.throwFeeling),
        concentration: toNumber(match.concentration),
        satisfaction: toNumber(match.satisfaction),
        problemArea: cleanText(match.problemArea),
        dropPhase: cleanText(match.dropPhase),
        matchObservation: cleanText(match.matchObservation),
        legResults: normalizeLegResults(match.legResults || [match.leg1, match.leg2, match.leg3, match.leg4, match.leg5, match.leg6]),
        statScreenshot: cleanText(match.statScreenshot),
        observations: cleanText(match.observations),
        note: cleanText(match.note),
        result: getResult(legsWon, legsLost),
        createdAt: match.createdAt || new Date().toISOString(),
        updatedAt: match.updatedAt || new Date().toISOString()
      };
    }).filter((match) => match.opponentId);

    return data;
  }

  function normalizePlayerProfile(player = {}) {
    const source = { ...defaultPlayerProfile, ...(player || {}) };
    const now = new Date().toISOString();
    return {
      name: cleanText(source.name) || defaultPlayerProfile.name,
      season: cleanText(source.season),
      average: toNumber(source.average),
      highFinish: toNumber(source.highFinish),
      favoriteDouble: cleanText(source.favoriteDouble),
      dartWeight: toNumber(source.dartWeight),
      hometown: cleanText(source.hometown),
      age: toNumber(source.age),
      notes: cleanText(source.notes),
      createdAt: source.createdAt || now,
      updatedAt: source.updatedAt || now
    };
  }

  function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(app.data));
  }

  function loadTrainingData() {
    try {
      const raw = localStorage.getItem(TRAINING_STORAGE_KEY);
      if (!raw) return { records: [] };
      return normalizeTrainingData(JSON.parse(raw));
    } catch (error) {
      console.warn("Training konnte nicht geladen werden.", error);
      return { records: [] };
    }
  }

  function normalizeTrainingData(value) {
    const records = Array.isArray(value?.records) ? value.records : [];
    return {
      records: records.map((record) => ({
        id: record.id || createId("training"),
        type: cleanText(record.type || "501"),
        date: cleanText(record.date || new Date().toISOString()),
        label: cleanText(record.label),
        result: cleanText(record.result),
        setupId: cleanText(record.setupId),
        setupName: cleanText(record.setupName),
        durationMinutes: toNumber(record.durationMinutes),
        feeling: toNumber(record.feeling),
        focus: cleanText(record.focus),
        notes: cleanText(record.notes),
        opponentId: cleanText(record.opponentId),
        opponentName: cleanText(record.opponentName),
        opponentAverage: toNumber(record.opponentAverage),
        startScore: toNumber(record.startScore),
        playerAverage: toNumber(record.playerAverage),
        playerVisits: toNumber(record.playerVisits),
        playerRemaining: toNumber(record.playerRemaining),
        computerRemaining: toNumber(record.computerRemaining),
        checkoutRate: toNumber(record.checkoutRate),
        scoringAverage: toNumber(record.scoringAverage),
        summary: cleanText(record.summary),
        feedback: cleanText(record.feedback)
      }))
    };
  }

  function saveTrainingData() {
    localStorage.setItem(TRAINING_STORAGE_KEY, JSON.stringify(app.training));
  }

  function renderAll() {
    renderSeasonOptions();
    renderOpponentSelect();
    renderSetupSelect();
    renderEventControls();
    renderTrainingOpponentOptions();
    renderPlayerProfile();
    renderDashboardStats();
    renderDashboardOpponents();
    renderMyGame();
    renderOpponentList();
    renderMatches();
    renderStats();
    renderLeaderboard();
    renderTraining();
    renderAnalysis();
    if (app.selectedProfileId) renderProfile(app.selectedProfileId);
  }

  function renderSeasonOptions() {
    const seasons = uniqueSorted(app.data.matches.map((match) => match.season).filter(Boolean));
    setSelectOptions(els.seasonFilter, seasons, "Alle Seasons");
    setSelectOptions(els.statsSeasonFilter, seasons, "Alle Seasons");
    setSelectOptions(els.leaderboardSeasonFilter, seasons, "Alle Seasons");
  }

  function renderEventControls() {
    renderCategoryFilterOptions();
    renderOpponentCategoryOptions();
    renderDashboardEventTabs();
    updateOpponentEventField();
  }

  function renderCategoryFilterOptions() {
    const current = els.categoryFilter.value;
    els.categoryFilter.innerHTML = `
      <option value="">Alle</option>
      <option value="liga">Liga</option>
      <option value="cup">Cup</option>
      <option value="both">Liga + Cup</option>
      ${app.data.events.map((eventItem) => `<option value="event:${eventItem.id}">${escapeHtml(eventItem.name)}</option>`).join("")}
    `;
    els.categoryFilter.value = current && Array.from(els.categoryFilter.options).some((option) => option.value === current)
      ? current
      : "";
  }

  function renderOpponentCategoryOptions() {
    const current = els.opponentCategorySelect.value;
    els.opponentCategorySelect.innerHTML = `
      <option value="liga">Liga</option>
      <option value="cup">Cup</option>
      <option value="both">Liga + Cup</option>
      ${app.data.events.map((eventItem) => `<option value="event:${eventItem.id}">${escapeHtml(eventItem.name)}</option>`).join("")}
      <option value="__new_event__">Neues Event anlegen</option>
    `;
    els.opponentCategorySelect.value = current && Array.from(els.opponentCategorySelect.options).some((option) => option.value === current)
      ? current
      : "liga";
  }

  function renderDashboardEventTabs() {
    const current = els.categoryFilter.value;
    const tabs = [
      ["", "Alle"],
      ["liga", "Liga"],
      ["cup", "Cup"],
      ["both", "Liga + Cup"],
      ...app.data.events.map((eventItem) => [`event:${eventItem.id}`, eventItem.name])
    ];
    els.dashboardEventTabs.innerHTML = tabs.map(([value, label]) => `
      <button class="event-tab ${current === value ? "active" : ""}" type="button" data-event-filter="${escapeHtml(value)}">${escapeHtml(label)}</button>
    `).join("");
  }

  function updateOpponentEventField() {
    const isNewEvent = els.opponentCategorySelect.value === "__new_event__";
    els.opponentNewEventWrap.classList.toggle("hidden-field", !isNewEvent);
    if (!isNewEvent) els.opponentForm.elements.newEventName.value = "";
  }

  function setSelectOptions(select, values, emptyLabel) {
    const current = select.value;
    select.innerHTML = "";
    const empty = document.createElement("option");
    empty.value = "";
    empty.textContent = emptyLabel;
    select.appendChild(empty);
    values.forEach((value) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      select.appendChild(option);
    });
    select.value = values.includes(current) ? current : "";
  }

  function renderOpponentSelect() {
    const current = els.matchOpponentSelect.value;
    els.matchOpponentSelect.innerHTML = "<option value=\"\">Gegner waehlen</option>";
    getOpponentsByName().forEach((opponent) => {
      const option = document.createElement("option");
      option.value = opponent.id;
      option.textContent = opponent.nickname ? `${opponent.name} (${opponent.nickname})` : opponent.name;
      els.matchOpponentSelect.appendChild(option);
    });
    if (app.data.opponents.some((opponent) => opponent.id === current)) {
      els.matchOpponentSelect.value = current;
    }
  }

  function renderSetupSelect() {
    const current = els.matchSetupSelect.value;
    els.matchSetupSelect.innerHTML = "<option value=\"\">Kein Setup gewaehlt</option>";
    app.data.setups
      .slice()
      .sort((a, b) => Number(b.active) - Number(a.active) || a.name.localeCompare(b.name, "de"))
      .forEach((setup) => {
        const option = document.createElement("option");
        option.value = setup.id;
        option.textContent = setup.active ? setup.name : `${setup.name} (archiviert)`;
        els.matchSetupSelect.appendChild(option);
      });
    if (app.data.setups.some((setup) => setup.id === current)) {
      els.matchSetupSelect.value = current;
    }
  }

  function renderMyGame() {
    const officialMatches = filterMatchesByCompetition(app.data.matches, "official");
    const stats = calculateStats(officialMatches);
    const setupSummary = getBestSetupSummary(officialMatches);
    const mentalAverage = average(officialMatches.map((match) => match.nervousDuring));
    const firstLeg = calculateFirstLegStats(officialMatches);
    const cards = [
      ["Spiele", stats.games, `${stats.wins} Siege`],
      ["Mein AVG", formatNumber(stats.myAverage, 2), "Matchdurchschnitt"],
      ["Nervositaet", formatNumber(mentalAverage, 1), "waehrend des Spiels"],
      ["Leg 1", firstLeg.total ? formatPercent(firstLeg.winRate) : "-", `${firstLeg.wins}/${firstLeg.total} gewonnen`]
    ];
    els.myGameStatsGrid.innerHTML = cards.map(renderStatCard).join("");

    els.setupCount.textContent = countLabel(app.data.setups.length, "Setup");
    if (!app.data.setups.length) {
      els.setupTable.innerHTML = renderTableEmpty(9, "Noch keine Setups gespeichert.");
      return;
    }

    els.setupTable.innerHTML = app.data.setups.map((setup) => {
      const setupMatches = officialMatches.filter((match) => match.setupId === setup.id);
      const setupStats = calculateStats(setupMatches);
      const mental = calculateSetupMental(setupMatches);
      const details = [setup.barrel, setup.weight ? `${formatNumber(setup.weight, 1)} g` : "", setup.shaft, setup.flight]
        .filter(Boolean)
        .join(" · ");
      return `
        <tr class="${setupSummary?.id === setup.id ? "highlight-row" : ""}">
          <td><strong>${escapeHtml(setup.name)}</strong></td>
          <td>${escapeHtml(details || setup.notes || "-")}</td>
          <td>${setup.active ? "<span class=\"state-pill\">Aktiv</span>" : "<span class=\"state-pill muted-pill\">Archiv</span>"}</td>
          <td>${setupStats.games}</td>
          <td>${formatNumber(setupStats.myAverage, 2)}</td>
          <td>${formatPercent(setupStats.myDoubleRate)}</td>
          <td>${formatPercent(setupStats.winRate)}</td>
          <td>${escapeHtml(mental.summary)}</td>
          <td>
            <div class="row-actions">
              <button class="button small secondary" type="button" data-action="edit-setup" data-id="${setup.id}">Bearbeiten</button>
              <button class="button small danger" type="button" data-action="delete-setup" data-id="${setup.id}">Loeschen</button>
            </div>
          </td>
        </tr>
      `;
    }).join("");
  }

  function renderDashboardStats() {
    const matches = getDashboardMatches();
    const stats = calculateStats(matches);
    const streak = calculateResultStreak(matches);
    const scopeLabel = getCompetitionFilterLabel(getDashboardScope());
    const cards = [
      ["Spiele gesamt", stats.games, `${scopeLabel} / ${stats.wins} Siege`],
      ["Siegquote", formatPercent(stats.winRate), stats.games ? `${stats.losses} Niederlagen` : "Noch keine Spiele"],
      ["Leg-Differenz", signed(stats.legDiff), `${stats.legsWon}:${stats.legsLost} Legs`],
      ["Aktuelle Serie", streak.label, streak.hint]
    ];
    els.dashboardStats.innerHTML = cards.map(renderStatCard).join("");
  }

  function renderPlayerProfile() {
    const player = app.data.player || normalizePlayerProfile();
    const card = renderPlayerProfileCard(player);
    els.dashboardPlayerCard.innerHTML = card;
    els.myPlayerCard.innerHTML = card;
    fillForm(els.playerForm, player);
  }

  function renderPlayerProfileCard(player) {
    const meta = [
      player.hometown,
      player.age ? `${formatNumber(player.age, 0)} Jahre` : "",
      player.dartWeight ? `${formatNumber(player.dartWeight, 1)} g` : ""
    ].filter(Boolean).join(" / ");

    const stats = [
      ["AVG", formatNumber(player.average, 2)],
      ["High Finish", formatNumber(player.highFinish, 0)],
      ["Fav. Double", player.favoriteDouble || "-"],
      ["Darts", player.dartWeight ? `${formatNumber(player.dartWeight, 1)} g` : "-"]
    ];

    return `
      <div class="player-profile-head">
        <div>
          <p class="eyebrow">Meine Spielerin</p>
          <h3>${escapeHtml(player.name)}</h3>
          <p>${escapeHtml(meta || "Persoenliches Profil")}</p>
        </div>
        <div class="button-row">
          <span class="state-pill">${escapeHtml(player.season || "Season")}</span>
          <button class="button small secondary" type="button" data-action="edit-player-profile">Bearbeiten</button>
        </div>
      </div>
      <div class="player-profile-stats">
        ${stats.map(([label, value]) => `
          <div class="player-profile-stat">
            <span>${escapeHtml(label)}</span>
            <strong>${escapeHtml(displayValue(value))}</strong>
          </div>
        `).join("")}
      </div>
      ${player.notes ? `<p class="muted player-note">${escapeHtml(player.notes)}</p>` : ""}
    `;
  }

  function renderDashboardOpponents() {
    const filtered = getFilteredOpponents();
    els.quickCount.textContent = countLabel(filtered.length, "Gegner");
    const dashboardScope = getDashboardScope();

    if (!filtered.length) {
      els.opponentQuickTable.innerHTML = renderTableEmpty(7, "Keine Gegner gefunden.");
      return;
    }

    const rows = filtered.map((opponent) => {
      const record = calculateOpponentRecord(opponent.id, els.seasonFilter.value, dashboardScope);
      const lastMatch = getMatchesForOpponent(opponent.id)
        .filter((match) => matchMatchesCompetitionFilter(match, dashboardScope))
        .sort((a, b) => (b.date || "").localeCompare(a.date || ""))[0];
      const avg = getOpponentDisplayAverage(opponent, record);
      return { opponent, record, lastMatch, avg };
    }).sort(compareQuickOpponentRows);
    rows.push(buildQuickPlayerRow(els.seasonFilter.value, dashboardScope));
    rows.sort(compareQuickOpponentRows);

    els.opponentQuickTable.innerHTML = rows.map(({ opponent, record, lastMatch, avg }, index) => {
      return `
        <tr class="${opponent.isPlayer ? "player-rank-row" : ""}">
          <td><strong>${index + 1}.</strong></td>
          <td>
            ${renderLeaderboardName({ name: opponent.name, isPlayer: opponent.isPlayer }, index)}
            <div class="muted">${escapeHtml(getOpponentCategoryLabel(opponent.category))} · ${escapeHtml(opponent.nickname || opponent.hometown || "Kein Zusatz")}</div>
          </td>
          <td>${formatNumber(avg, 2)}</td>
          <td>${formatPercent(opponent.doubleRate)}</td>
          <td>${record.wins}-${record.draws}-${record.losses}</td>
          <td>${lastMatch ? `${formatDate(lastMatch.date)} ${escapeHtml(lastMatch.score || "")}` : "Noch kein Spiel"}</td>
          <td>
            <div class="row-actions">
              <button class="button small primary" type="button" data-action="view-profile" data-id="${opponent.id}">Profil</button>
              <button class="button small secondary" type="button" data-action="edit-opponent" data-id="${opponent.id}">Bearbeiten</button>
            </div>
          </td>
        </tr>
      `;
    }).join("");
  }

  function buildQuickPlayerRow(season, competitionFilter = "official") {
    const player = app.data.player || normalizePlayerProfile();
    const matches = filterMatchesByCompetition(
      season ? app.data.matches.filter((match) => match.season === season) : app.data.matches,
      competitionFilter
    );
    const stats = calculateStats(matches);
    const lastMatch = getRecentMatches(matches, 1)[0];
    return {
      opponent: {
        id: "__player__",
        isPlayer: true,
        name: player.name || "Ich",
        nickname: "Du",
        hometown: player.hometown,
        category: "both",
        doubleRate: stats.myDoubleRate
      },
      record: {
        wins: stats.wins,
        draws: stats.draws,
        losses: stats.losses,
        winRate: stats.winRate,
        legDiff: stats.legDiff
      },
      lastMatch,
      avg: stats.myAverage !== null ? stats.myAverage : player.average
    };
  }

  function compareQuickOpponentRows(a, b) {
    const sort = els.quickSortSelect?.value || "avg-desc";
    const byName = a.opponent.name.localeCompare(b.opponent.name, "de");

    if (sort === "name-asc") return byName;
    if (sort === "avg-asc") return compareNullableNumbers(a.avg, b.avg, "asc") || byName;
    if (sort === "double-desc") return compareNullableNumbers(a.opponent.doubleRate, b.opponent.doubleRate, "desc") || byName;
    if (sort === "winrate-desc") return compareNullableNumbers(a.record.winRate, b.record.winRate, "desc") || byName;
    if (sort === "legdiff-desc") return compareNullableNumbers(a.record.legDiff, b.record.legDiff, "desc") || byName;
    if (sort === "last-desc") return compareDates(a.lastMatch?.date, b.lastMatch?.date) || byName;
    return compareNullableNumbers(a.avg, b.avg, "desc") || byName;
  }

  function getFilteredOpponents() {
    const search = normalizeSearch(els.globalSearch.value);
    const season = els.seasonFilter.value;
    const result = els.resultFilter.value;
    const category = els.categoryFilter.value;
    const dashboardScope = getDashboardScope();
    const avgMin = toNumber(els.avgMinFilter.value);
    const avgMax = toNumber(els.avgMaxFilter.value);
    const seasonsPlayed = toNumber(els.seasonsPlayedFilter.value);

    return getOpponentsByName().filter((opponent) => {
      const record = calculateOpponentRecord(opponent.id, season, dashboardScope);
      const haystack = normalizeSearch([
        opponent.name,
        opponent.nickname,
        opponent.rdlName,
        getOpponentCategoryLabel(opponent.category),
        opponent.hometown,
        opponent.team,
        opponent.league,
        opponent.pace,
        opponent.favoriteDouble
      ].join(" "));
      const avg = getOpponentDisplayAverage(opponent, record);
      const opponentMatches = getMatchesForOpponent(opponent.id)
        .filter((match) => matchMatchesCompetitionFilter(match, dashboardScope));

      if (search && !haystack.includes(search)) return false;
      if (season && !opponentMatches.some((match) => match.season === season)) return false;
      if (result && !opponentMatches.some((match) => match.result === result && (!season || match.season === season))) return false;
      if (category && !opponentMatchesCategory(opponent, category)) return false;
      if (avgMin !== null && (avg === null || avg < avgMin)) return false;
      if (avgMax !== null && (avg === null || avg > avgMax)) return false;
      if (seasonsPlayed !== null && (opponent.seasonsPlayed || 0) < seasonsPlayed) return false;
      return true;
    });
  }

  function renderOpponentList() {
    const search = normalizeSearch(els.opponentListSearch.value);
    const opponents = getOpponentsByName().filter((opponent) => {
      const haystack = normalizeSearch([
        opponent.name,
        opponent.nickname,
        opponent.rdlName,
        getOpponentCategoryLabel(opponent.category),
        opponent.hometown,
        opponent.team,
        opponent.league,
        opponent.pace,
        opponent.notes,
        opponent.strengths,
        opponent.weaknesses,
        opponent.tactics
      ].join(" "));
      return !search || haystack.includes(search);
    });

    els.opponentCount.textContent = countLabel(app.data.opponents.length, "Gegner");

    if (!opponents.length) {
      els.opponentList.innerHTML = "<div class=\"empty-state\">Noch keine passenden Gegner vorhanden.</div>";
      return;
    }

    els.opponentList.innerHTML = opponents.map((opponent) => `
      <article class="opponent-item">
        <div>
          <h4>${escapeHtml(opponent.name)}</h4>
          <div class="opponent-meta">
            <span>${escapeHtml(opponent.rdlName || opponent.nickname || "Ohne RDL-Name")}</span>
            <span>${escapeHtml(getOpponentCategoryLabel(opponent.category))}</span>
            <span>${escapeHtml(opponent.league || "Keine Liga")}</span>
            <span>${escapeHtml(opponent.team || "Kein Team")}</span>
            <span>AVG ${formatNumber(opponent.average, 2)}</span>
            <span>DQ ${formatPercent(opponent.doubleRate)}</span>
            <span>${escapeHtml(opponent.hometown || "Kein Ort")}</span>
          </div>
        </div>
        <div class="row-actions">
          <button class="button small primary" type="button" data-action="view-profile" data-id="${opponent.id}">Profil</button>
          <button class="button small secondary" type="button" data-action="edit-opponent" data-id="${opponent.id}">Bearbeiten</button>
          <button class="button small danger" type="button" data-action="delete-opponent" data-id="${opponent.id}">Loeschen</button>
        </div>
      </article>
    `).join("");
  }

  function renderProfile(id) {
    const opponent = findOpponent(id);
    if (!opponent) {
      app.selectedProfileId = null;
      showSection("opponents");
      return;
    }

    app.selectedProfileId = id;
    els.profileTitle.textContent = opponent.name;
    const matches = getMatchesForOpponent(id).sort((a, b) => (b.date || "").localeCompare(a.date || ""));
    const record = calculateOpponentRecord(id);

    const statCards = [
      ["AVG", formatNumber(opponent.average, 2), "Profilwert"],
      ["Doppelquote", formatPercent(opponent.doubleRate), "Profilwert"],
      ["First 9 AVG", formatNumber(opponent.first9Average, 2), "Profilwert"],
      ["Shortleg", formatNumber(opponent.shortleg, 0), "Legs"],
      ["Tons Plus", formatNumber(opponent.tonsPlus, 0), "Scoring"],
      ["140 Plus", formatNumber(opponent.oneFortyPlus, 0), "Scoring"],
      ["180er", formatNumber(opponent.oneEighties, 0), "Maximums"],
      ["High Finish", formatNumber(opponent.highFinish, 0), "Checkout"]
    ].map(renderStatCard).join("");

    const info = [
      ["Kategorie", getOpponentCategoryLabel(opponent.category)],
      ["RDL-Name", opponent.rdlName],
      ["Team", opponent.team],
      ["Liga", opponent.league],
      ["Spieltempo", opponent.pace],
      ["Lieblings Doppel", opponent.favoriteDouble],
      ["Darts Gewicht", opponent.dartWeight ? `${formatNumber(opponent.dartWeight, 1)} g` : ""],
      ["Heimatort", opponent.hometown],
      ["Alter", opponent.age ? `${formatNumber(opponent.age, 0)} Jahre` : ""],
      ["Gespielte Seasons", opponent.seasonsPlayed],
      ["Scoring-Staerke", opponent.scoringStrength ? `${opponent.scoringStrength}/10` : ""],
      ["Doppel-Staerke", opponent.doubleStrength ? `${opponent.doubleStrength}/10` : ""],
      ["Mentale Staerke", opponent.mentalStrength ? `${opponent.mentalStrength}/10` : ""]
    ].map(([label, value]) => `
      <div class="info-panel">
        <span>${escapeHtml(label)}</span>
        <strong>${escapeHtml(displayValue(value))}</strong>
      </div>
    `).join("");

    const texts = [
      ["Staerken", opponent.strengths],
      ["Schwaechen", opponent.weaknesses],
      ["Taktische Hinweise", opponent.tactics],
      ["Notizen", opponent.notes]
    ].map(([label, value]) => `
      <div class="text-panel">
        <span>${escapeHtml(label)}</span>
        <p>${escapeHtml(displayValue(value))}</p>
      </div>
    `).join("");

    const matchRows = matches.length ? matches.map((match) => `
      <tr>
        <td>${formatDate(match.date)}</td>
        <td>${escapeHtml(getMatchCompetitionLabel(match))}</td>
        <td>${escapeHtml(match.season)}</td>
        <td>${escapeHtml(match.score || `${match.legsWon}:${match.legsLost}`)}</td>
        <td>${renderResultBadge(match.result)}</td>
        <td>${formatNumber(match.myAverage, 2)}</td>
        <td>${formatNumber(match.opponentAverage, 2)}</td>
        <td>${renderScreenshotButton(match)}</td>
        <td>${escapeHtml(match.note || match.observations || "")}</td>
      </tr>
    `).join("") : renderTableEmpty(9, "Noch kein Spiel gegen diesen Gegner.");

    els.profileContent.innerHTML = `
      <div class="profile-layout">
        <div class="profile-hero">
          <div class="profile-summary">
            <h3>${escapeHtml(opponent.nickname || opponent.name)}</h3>
            <p>${escapeHtml(opponent.name)} · Bilanz ${record.wins}-${record.draws}-${record.losses} · Leg Diff. ${signed(record.legDiff)}</p>
            <div class="form-actions">
              <button class="button secondary" type="button" data-action="edit-opponent" data-id="${opponent.id}">Profil bearbeiten</button>
              <button class="button danger" type="button" data-action="delete-opponent" data-id="${opponent.id}">Gegner loeschen</button>
            </div>
          </div>
          <div class="profile-stat-grid">${statCards}</div>
        </div>
        <div class="info-grid">${info}</div>
        <div class="text-grid">${texts}</div>
        <div class="table-panel">
          <div class="panel-heading">
            <h3>Spiele gegen ${escapeHtml(opponent.name)}</h3>
            <span class="count-pill">${countLabel(matches.length, "Spiel")}</span>
          </div>
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Datum</th>
                  <th>Wettbewerb</th>
                  <th>Season</th>
                  <th>Endstand</th>
                  <th>Ergebnis</th>
                  <th>Mein AVG</th>
                  <th>Gegner AVG</th>
                  <th>Screenshot</th>
                  <th>Notiz</th>
                </tr>
              </thead>
              <tbody>${matchRows}</tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  function renderMatches() {
    const matches = [...app.data.matches].sort((a, b) => (b.date || "").localeCompare(a.date || ""));
    els.matchCount.textContent = countLabel(matches.length, "Spiel");

    if (!matches.length) {
      els.matchTable.innerHTML = renderTableEmpty(10, "Noch keine Spiele gespeichert.");
      return;
    }

    els.matchTable.innerHTML = matches.map((match) => {
      const opponent = findOpponent(match.opponentId);
      return `
        <tr>
          <td>${formatDate(match.date)}</td>
          <td>${escapeHtml(getMatchCompetitionLabel(match))}</td>
          <td>${escapeHtml(match.season)}</td>
          <td>${escapeHtml(opponent ? opponent.name : "Geloeschter Gegner")}</td>
          <td>${escapeHtml(match.score || `${match.legsWon}:${match.legsLost}`)}</td>
          <td>${renderResultBadge(match.result)}</td>
          <td>${formatNumber(match.myAverage, 2)}</td>
          <td>${formatPercent(match.myDoubleRate)}</td>
          <td>${renderScreenshotButton(match)}</td>
          <td>
            <div class="row-actions">
              <button class="button small secondary" type="button" data-action="edit-match" data-id="${match.id}">Bearbeiten</button>
              <button class="button small danger" type="button" data-action="delete-match" data-id="${match.id}">Loeschen</button>
            </div>
          </td>
        </tr>
      `;
    }).join("");
  }

  function renderStats() {
    const season = els.statsSeasonFilter.value;
    const competitionFilter = els.statsCompetitionFilter.value || "official";
    const matches = filterMatchesByCompetition(
      season ? app.data.matches.filter((match) => match.season === season) : app.data.matches,
      competitionFilter
    );
    const stats = calculateStats(matches);
    const cards = [
      ["Anzahl Spiele", stats.games, `${season || "Alle Seasons"} / ${getCompetitionFilterLabel(competitionFilter)}`],
      ["Gewonnene Spiele", stats.wins, "Siege"],
      ["Verlorene Spiele", stats.losses, "Niederlagen"],
      ["Unentschieden", stats.draws, "Remis"],
      ["Gewonnene Legs", stats.legsWon, "Legs"],
      ["Verlorene Legs", stats.legsLost, "Legs"],
      ["Leg Differenz", signed(stats.legDiff), "Gewonnen minus verloren"],
      ["Siegquote", formatPercent(stats.winRate), "Siege pro Spiel"],
      ["Eigener AVG", formatNumber(stats.myAverage, 2), "Durchschnitt"],
      ["First 9 AVG", formatNumber(stats.first9Average, 2), "Startphase"],
      ["Gegner AVG", formatNumber(stats.opponentAverage, 2), "Durchschnitt"],
      ["Doppelquote", formatPercent(stats.myDoubleRate), "Eigener Schnitt"],
      ["Hoechstes Finish", formatNumber(stats.highFinish, 0), "Eigenes Finish"],
      ["100+ gesamt", stats.scores100Plus, "Scoring"],
      ["140+ gesamt", stats.scores140Plus, "Scoring"],
      ["180er gesamt", stats.total180s, "Eigene 180er"],
      ["Bestes Leg", formatNumber(stats.bestLeg, 0), "Darts"],
      ["Schlechtestes Leg", formatNumber(stats.worstLeg, 0), "Darts"]
    ];
    els.statsGrid.innerHTML = cards.map(renderStatCard).join("");
  }

  function renderLeaderboard() {
    const season = els.leaderboardSeasonFilter.value;
    const rows = [
      buildPlayerLeaderboardRow(season),
      ...app.data.opponents.map((opponent) => {
      const record = calculateOpponentRecord(opponent.id, season);
      return {
        opponent,
        isPlayer: false,
        name: opponent.name,
        games: record.games,
        wins: record.wins,
        draws: record.draws,
        losses: record.losses,
        legsWon: record.legsWon,
        legsLost: record.legsLost,
        legDiff: record.legDiff,
        winRate: record.winRate,
        average: getOpponentDisplayAverage(opponent, record)
      };
    })
    ];

    rows.sort((a, b) => compareLeaderboardRows(a, b));

    if (!rows.length) {
      els.leaderboardTable.innerHTML = renderTableEmpty(11, "Noch keine Gegner fuer die Rangliste.");
      return;
    }

    els.leaderboardTable.innerHTML = rows.map((row, index) => `
      <tr class="${row.isPlayer ? "player-rank-row" : ""}">
        <td><strong>${index + 1}.</strong></td>
        <td>${renderLeaderboardName(row, index)}</td>
        <td>${row.games}</td>
        <td>${row.wins}</td>
        <td>${row.draws}</td>
        <td>${row.losses}</td>
        <td>${row.legsWon}</td>
        <td>${row.legsLost}</td>
        <td class="${row.legDiff >= 0 ? "positive" : "negative"}">${signed(row.legDiff)}</td>
        <td>${formatPercent(row.winRate)}</td>
        <td>${formatNumber(row.average, 2)}</td>
      </tr>
    `).join("");
  }

  function buildPlayerLeaderboardRow(season) {
    const matches = season ? app.data.matches.filter((match) => match.season === season) : app.data.matches;
    const stats = calculateStats(matches);
    const player = app.data.player || normalizePlayerProfile();
    return {
      isPlayer: true,
      name: player.name || "Ich",
      games: stats.games,
      wins: stats.wins,
      draws: stats.draws,
      losses: stats.losses,
      legsWon: stats.legsWon,
      legsLost: stats.legsLost,
      legDiff: stats.legDiff,
      winRate: stats.winRate,
      average: stats.myAverage !== null ? stats.myAverage : player.average
    };
  }

  function renderLeaderboardName(row, index) {
    const medal = renderRankMedal(index);
    const playerBadge = row.isPlayer ? "<span class=\"self-badge\">Du</span>" : "";
    return `
      <div class="leader-name">
        <strong>${escapeHtml(row.name)}</strong>
        ${medal}
        ${playerBadge}
      </div>
    `;
  }

  function renderRankMedal(index) {
    const medals = [
      { label: "Gold", className: "gold" },
      { label: "Silber", className: "silver" },
      { label: "Bronze", className: "bronze" }
    ];
    const medal = medals[index];
    return medal ? `<span class="rank-medal ${medal.className}">${medal.label}</span>` : "";
  }

  function renderAnalysis() {
    const competitionFilter = els.analysisCompetitionFilter.value || "official";
    const matches = filterMatchesByCompetition(app.data.matches, competitionFilter);
    const stats = calculateStats(matches);
    const streaks = calculateWinStreaks(matches);
    const currentStreak = calculateResultStreak(matches);
    const firstLeg = calculateFirstLegStats(matches);
    const phaseStats = calculateLegPhaseStats(matches);
    const bestSetup = getBestSetupSummary(matches);
    const hardestOpponent = getOpponentPerformanceSummary("hardest", matches);
    const mentalAverage = average(matches.map((match) => match.nervousDuring));

    const cards = [
      ["Aktuelle Serie", currentStreak.label, `Beste Siegesserie ${streaks.best}`],
      ["Form letzte 10", formatPercent(calculateWinRate(getRecentMatches(matches, 10))), "Siegquote"],
      ["Leg 1", firstLeg.total ? formatPercent(firstLeg.winRate) : "-", `${firstLeg.wins}/${firstLeg.total} gewonnen`],
      ["Schlussphase", phaseStats.late.total ? formatPercent(phaseStats.late.winRate) : "-", "Legs 4 bis 6"],
      ["Nervositaet", formatNumber(mentalAverage, 1), "waehrend des Spiels"],
      ["Bestes Setup", bestSetup ? bestSetup.name : "-", bestSetup ? `Siegquote ${formatPercent(bestSetup.winRate)}` : "Noch keine Daten"],
      ["Schwerster Gegner", hardestOpponent ? hardestOpponent.opponent.name : "-", hardestOpponent ? `Siegquote ${formatPercent(hardestOpponent.record.winRate)}` : "Noch zu wenig Daten"]
    ];
    els.analysisStatsGrid.innerHTML = cards.map(renderStatCard).join("");

    const insights = buildAnalysisInsights(matches, stats);
    els.analysisInsightCount.textContent = countLabel(insights.length, "Hinweis");
    els.analysisInsights.innerHTML = insights.length
      ? insights.map((insight) => `
        <article class="insight-card ${insight.level}">
          <span>${escapeHtml(insight.label)}</span>
          <p>${escapeHtml(insight.text)}</p>
        </article>
      `).join("")
      : "<div class=\"empty-state\">Trage ein paar Spiele mit Mentaldaten ein, dann wird die Analyse deutlich staerker.</div>";

    els.performanceReport.innerHTML = buildPerformanceReport(matches);
  }

  function buildAnalysisInsights(matches, stats) {
    const insights = [];
    if (!matches.length) {
      insights.push({
        level: "neutral",
        label: "Start",
        text: "Noch nicht genug Daten fuer eine belastbare Analyse. Speichere deine naechsten Spiele mit Nervositaet, Wurfgefuehl, Setup und Legverlauf."
      });
      return insights;
    }

    const highNervous = matches.filter((match) => (match.nervousDuring || 0) >= 7);
    const lowNervous = matches.filter((match) => match.nervousDuring !== null && match.nervousDuring <= 6);
    if (highNervous.length >= 3 && lowNervous.length >= 3) {
      const highRate = calculateWinRate(highNervous);
      const lowRate = calculateWinRate(lowNervous);
      insights.push({
        level: highRate + 15 < lowRate ? "warning" : "positive",
        label: "Nervositaet",
        text: highRate + 15 < lowRate
          ? `Bei hoher Nervositaet sinkt deine Siegquote deutlich: ${formatPercent(highRate)} statt ${formatPercent(lowRate)} bei ruhigerem Spiel.`
          : `Hohe Nervositaet kippt deine Ergebnisse aktuell nicht deutlich. Hohe Nervositaet: ${formatPercent(highRate)}, ruhigere Spiele: ${formatPercent(lowRate)}.`
      });
    }

    const firstLeg = calculateFirstLegStats(matches);
    if (firstLeg.total >= 5) {
      insights.push({
        level: firstLeg.winRate < 40 ? "warning" : "positive",
        label: "Matchbeginn",
        text: firstLeg.winRate < 40
          ? `Du verlierst auffaellig haeufig das erste Leg. Aktuelle Erste-Leg-Quote: ${formatPercent(firstLeg.winRate)}.`
          : `Dein erstes Leg ist aktuell stabil genug fuer belastbare Starts. Erste-Leg-Quote: ${formatPercent(firstLeg.winRate)}.`
      });
    }

    const phaseStats = calculateLegPhaseStats(matches);
    if (phaseStats.early.total >= 5 && phaseStats.late.total >= 5) {
      const lateBetter = phaseStats.late.winRate > phaseStats.early.winRate + 5;
      insights.push({
        level: lateBetter ? "positive" : "neutral",
        label: "Schlussphase",
        text: lateBetter
          ? `Du wirst im spaeteren Matchverlauf staerker: Legs 4-6 ${formatPercent(phaseStats.late.winRate)}, Legs 1-3 ${formatPercent(phaseStats.early.winRate)}.`
          : `Fruehe und spaete Legs liegen nah beieinander: Startphase ${formatPercent(phaseStats.early.winRate)}, Schlussphase ${formatPercent(phaseStats.late.winRate)}.`
      });
    }

    const problem = mostCommonValue(matches.map((match) => match.problemArea).filter(Boolean));
    if (problem) {
      insights.push({
        level: "warning",
        label: "Groesstes Problem",
        text: `Am haeufigsten nennst du ${formatProblemLabel(problem.value)} als Problem. Das sollte in den naechsten Trainingseinheiten Prioritaet haben.`
      });
    }

    const phase = mostCommonValue(matches.map((match) => match.dropPhase).filter((value) => value && value !== "gar-nicht"));
    if (phase) {
      insights.push({
        level: "neutral",
        label: "Einbruchphase",
        text: `Wenn dein Spiel schlechter wird, passiert es am haeufigsten in der Phase: ${formatPhaseLabel(phase.value)}.`
      });
    }

    const provenSetups = getSetupSummaries(5, matches);
    if (provenSetups.length >= 2) {
      const bestWinSetup = [...provenSetups].sort((a, b) => (b.winRate || 0) - (a.winRate || 0))[0];
      const bestAvgSetup = [...provenSetups].sort((a, b) => (b.average || 0) - (a.average || 0))[0];
      const bestCheckoutSetup = [...provenSetups].sort((a, b) => (b.checkoutQuote || 0) - (a.checkoutQuote || 0))[0];
      insights.push({
        level: "positive",
        label: "Setup",
        text: `${bestWinSetup.name} hat die hoechste Siegquote (${formatPercent(bestWinSetup.winRate)}). ${bestAvgSetup.name} liefert den besten AVG (${formatNumber(bestAvgSetup.average, 2)}). ${bestCheckoutSetup.name} hat die beste Doppelquote (${formatPercent(bestCheckoutSetup.checkoutQuote)}).`
      });
    } else if (app.data.setups.length >= 2) {
      insights.push({
        level: "neutral",
        label: "Setup",
        text: "Noch nicht genug Daten fuer einen fairen Setup-Vergleich. Ziel: mindestens 5 Spiele mit zwei verschiedenen Setups."
      });
    }

    const hardestOpponent = getOpponentPerformanceSummary("hardest", matches);
    const bestOpponent = getOpponentPerformanceSummary("best", matches);
    if (hardestOpponent) {
      insights.push({
        level: "warning",
        label: "Schwierigster Gegner",
        text: `${hardestOpponent.opponent.name} ist aktuell dein schwerster Gegner: ${formatPercent(hardestOpponent.record.winRate)} Siegquote aus ${hardestOpponent.record.games} Spielen.`
      });
    }
    if (bestOpponent) {
      insights.push({
        level: "positive",
        label: "Bester Gegner",
        text: `Gegen ${bestOpponent.opponent.name} hast du die beste belegte Bilanz: ${formatPercent(bestOpponent.record.winRate)} Siegquote aus ${bestOpponent.record.games} Spielen.`
      });
    }

    const overallRate = stats.winRate;
    const last10 = getRecentMatches(matches, 10);
    if (overallRate !== null && last10.length >= 10) {
      const last10Rate = calculateWinRate(last10);
      if (last10Rate >= overallRate + 10 || last10Rate <= overallRate - 10) {
        insights.push({
          level: last10Rate > overallRate ? "positive" : "warning",
          label: "Form",
          text: last10Rate > overallRate
            ? `Deine aktuelle Form ist besser als dein Gesamtschnitt: letzte 10 ${formatPercent(last10Rate)}, gesamt ${formatPercent(overallRate)}.`
            : `Deine aktuelle Form liegt unter deinem Gesamtschnitt: letzte 10 ${formatPercent(last10Rate)}, gesamt ${formatPercent(overallRate)}.`
        });
      }
    }

    if (stats.myDoubleRate !== null && stats.myAverage !== null) {
      const text = stats.myDoubleRate < 18
        ? `Dein Scoring liegt bei AVG ${formatNumber(stats.myAverage, 2)}, aber die Doppelquote ist mit ${formatPercent(stats.myDoubleRate)} der wahrscheinlich groessere Hebel.`
        : `Deine Doppelquote ist solide. Der naechste grosse Hebel liegt wahrscheinlich im Scoring und in stabilen ersten 9 Darts.`;
      insights.push({
        level: stats.myDoubleRate < 18 ? "warning" : "positive",
        label: "Scoring vs Checkout",
        text
      });
    }

    if (!insights.length) {
      insights.push({
        level: "neutral",
        label: "Datenbasis",
        text: "Noch nicht genug Daten fuer eine belastbare Analyse. Trage weitere Spiele mit Legverlauf, Setup und Mentalwerten ein."
      });
    }

    return insights.slice(0, 10);
  }

  function buildPerformanceReport(matches) {
    if (matches.length < 10) {
      return `<p>Nach 10 gespeicherten Spielen erstellt die App automatisch einen ersten Performance Report. Aktuell gespeichert: ${matches.length}.</p>`;
    }

    const last10 = getRecentMatches(matches, 10);
    const previous10 = getRecentMatches(matches, 20).slice(10);
    const lastStats = calculateStats(last10);
    const previousStats = calculateStats(previous10);
    const winTrend = previous10.length ? lastStats.winRate - previousStats.winRate : null;
    const avgTrend = previous10.length && lastStats.myAverage !== null && previousStats.myAverage !== null
      ? lastStats.myAverage - previousStats.myAverage
      : null;
    const bestSetup = getBestSetupSummary(matches);
    const hardestOpponent = getOpponentPerformanceSummary("hardest", matches);

    const lines = [
      ["Entwicklung", winTrend === null ? "Noch keine Vergleichsgruppe vorhanden." : `Deine Siegquote der letzten 10 Spiele liegt bei ${formatPercent(lastStats.winRate)}. Veraenderung zur vorherigen Gruppe: ${signed(formatDelta(winTrend))} Prozentpunkte.`],
      ["Scoring", avgTrend === null ? "Noch zu wenig Average-Daten fuer einen sauberen Trend." : `Dein Average hat sich um ${signed(formatDelta(avgTrend))} Punkte veraendert.`],
      ["Finishing", lastStats.myDoubleRate === null ? "Noch keine Checkout-Daten vorhanden." : `Deine aktuelle Doppelquote der letzten 10 Spiele liegt bei ${formatPercent(lastStats.myDoubleRate)}.`],
      ["Mentale Leistung", buildMentalReportLine(matches)],
      ["Auffaelligkeit", buildLegReportLine(matches)],
      ["Setup", bestSetup ? `${bestSetup.name}: ${formatPercent(bestSetup.winRate)} Siegquote, AVG ${formatNumber(bestSetup.average, 2)}.` : "Noch kein Setup mit Matchdaten vorhanden."],
      ["Gegner", hardestOpponent ? `Schwerster belegter Gegner: ${hardestOpponent.opponent.name} mit ${formatPercent(hardestOpponent.record.winRate)} Siegquote.` : "Noch kein Gegner mit mindestens 3 Spielen fuer diesen Vergleich."]
    ];

    return lines.map(([label, text]) => `
      <div class="report-row">
        <span>${escapeHtml(label)}</span>
        <p>${escapeHtml(text)}</p>
      </div>
    `).join("");
  }

  function renderTrainingOpponentOptions() {
    const current = els.trainingOpponentSelect.value;
    els.trainingOpponentSelect.innerHTML = "";
    computerOpponents.forEach((opponent) => {
      const option = document.createElement("option");
      option.value = opponent.id;
      option.textContent = `${opponent.name} (AVG ${formatNumber(opponent.average, 0)})`;
      els.trainingOpponentSelect.appendChild(option);
    });
    els.trainingOpponentSelect.value = computerOpponents.some((opponent) => opponent.id === current)
      ? current
      : computerOpponents[1].id;
  }

  function renderTraining() {
    renderTrainingGame();
    renderTrainingStats();
    renderTrainingHistory();
    renderTrainingWidget();
  }

  function renderTrainingGame() {
    const game = app.trainingGame;
    const startScore = toNumber(els.trainingStartScore.value) || 501;
    const opponent = getTrainingOpponent(els.trainingOpponentSelect.value);

    if (!game) {
      els.trainingGameState.textContent = "Bereit";
      els.trainingPlayerScore.textContent = startScore;
      els.trainingComputerScore.textContent = startScore;
      els.trainingPlayerMeta.textContent = "AVG -";
      els.trainingComputerMeta.textContent = `AVG ${formatNumber(opponent.average, 0)}`;
      els.trainingLog.innerHTML = "";
      return;
    }

    els.trainingGameState.textContent = game.status === "running" ? "Laeuft" : "Beendet";
    els.trainingPlayerScore.textContent = game.playerScore;
    els.trainingComputerScore.textContent = game.computerScore;
    els.trainingPlayerMeta.textContent = `AVG ${formatNumber(calculateGameAverage(game, "player"), 2)} · ${game.playerVisits} Aufnahmen`;
    els.trainingComputerMeta.textContent = `AVG ${formatNumber(calculateGameAverage(game, "computer"), 2)} · ${game.computerVisits} Aufnahmen`;

    const turns = [...game.turns].reverse().slice(0, 8);
    els.trainingLog.innerHTML = turns.length ? turns.map((turn) => `
      <div class="training-log-row">
        <span>${escapeHtml(turn.actor)}</span>
        <strong>${escapeHtml(turn.summary)}</strong>
      </div>
    `).join("") : "";
  }

  function renderTrainingStats() {
    const records501 = getTrainingRecords("501");
    const wins = records501.filter((record) => record.result === "win").length;
    const bestAverage = max(records501.map((record) => record.playerAverage));
    const doubleRecords = getTrainingRecords("double");
    const scoringRecords = getTrainingRecords("scoring");
    const avgCheckoutRate = average(doubleRecords.map((record) => record.checkoutRate));
    const avgScoring = average(scoringRecords.map((record) => record.scoringAverage));
    const last501 = records501[0];

    const cards = [
      ["501 Legs", records501.length, `${wins} Siege`],
      ["Bestes 501 AVG", formatNumber(bestAverage, 2), last501 ? `Letztes ${formatNumber(last501.playerAverage, 2)}` : "Noch kein Leg"],
      ["Doppeltraining", formatPercent(avgCheckoutRate), `${doubleRecords.length} Einheiten`],
      ["Scoring Check", formatNumber(avgScoring, 2), `${scoringRecords.length} Einheiten`]
    ];
    els.trainingStatsGrid.innerHTML = cards.map(renderStatCard).join("");
  }

  function renderTrainingWidget() {
    const records501 = getTrainingRecords("501");
    const bestAverage = max(records501.map((record) => record.playerAverage));
    const last = records501[0];
    els.trainingWidgetCount.textContent = countLabel(records501.length, "Leg");
    els.trainingWidgetBest.textContent = formatNumber(bestAverage, 2);
    els.trainingWidgetLast.textContent = last ? `${last.result === "win" ? "Sieg" : "Niederlage"} · ${formatNumber(last.playerAverage, 2)}` : "-";
  }

  function renderTrainingHistory() {
    const records = app.training.records.slice(0, 20);
    els.trainingHistoryCount.textContent = countLabel(app.training.records.length, "Einheit");
    if (!records.length) {
      els.trainingHistoryTable.innerHTML = renderTableEmpty(5, "Noch keine Trainingseinheiten gespeichert.");
      return;
    }

    els.trainingHistoryTable.innerHTML = records.map((record) => `
      <tr>
        <td>${formatDate(cleanText(record.date).slice(0, 10))}</td>
        <td>${escapeHtml(getTrainingRecordName(record))}</td>
        <td>${escapeHtml(getTrainingRecordResult(record))}</td>
        <td>${escapeHtml(getTrainingRecordMetric(record))}</td>
        <td><button class="button small danger" type="button" data-action="delete-training" data-id="${record.id}">Loeschen</button></td>
      </tr>
    `).join("");
  }

  function getTrainingRecords(type) {
    return app.training.records.filter((record) => record.type === type);
  }

  function startTrainingGame() {
    const startScore = toNumber(els.trainingStartScore.value) || 501;
    const opponent = getTrainingOpponent(els.trainingOpponentSelect.value);
    app.trainingGame = {
      id: createId("training-game"),
      status: "running",
      startScore,
      opponentId: opponent.id,
      opponentName: opponent.name,
      opponentAverage: opponent.average,
      playerScore: startScore,
      computerScore: startScore,
      playerVisits: 0,
      computerVisits: 0,
      playerScored: 0,
      computerScored: 0,
      turns: []
    };
    els.trainingFeedback.textContent = `Neues ${startScore}-Leg gegen ${opponent.name} gestartet.`;
    els.trainingVisitScore.value = "";
    els.trainingDoubleOut.checked = false;
    renderTrainingGame();
    els.trainingVisitScore.focus();
  }

  function handleTrainingVisitSubmit(event) {
    event.preventDefault();
    const score = toNumber(els.trainingVisitScore.value);
    handleTrainingVisit(score, els.trainingDoubleOut.checked, false);
  }

  function handleTrainingVisit(score, doubleOut, forcedBust) {
    const game = app.trainingGame;
    if (!game || game.status !== "running") {
      alert("Bitte starte zuerst ein neues Leg.");
      return;
    }

    if (!forcedBust && (score === null || score < 0 || score > 180)) {
      alert("Bitte gib Punkte zwischen 0 und 180 ein.");
      return;
    }

    const playerResult = applyPlayerVisit(game, forcedBust ? 0 : score, doubleOut, forcedBust);
    game.turns.push({ actor: "Du", summary: playerResult.summary });

    if (playerResult.finished) {
      finishTrainingGame("win");
      return;
    }

    const computerResult = applyComputerVisit(game);
    game.turns.push({ actor: "Computer", summary: computerResult.summary });

    if (computerResult.finished) {
      finishTrainingGame("loss");
      return;
    }

    els.trainingVisitScore.value = "";
    els.trainingDoubleOut.checked = false;
    renderTrainingGame();
  }

  function applyPlayerVisit(game, score, doubleOut, forcedBust) {
    game.playerVisits += 1;

    if (forcedBust || score > game.playerScore || game.playerScore - score === 1 || (score === game.playerScore && !doubleOut)) {
      return {
        finished: false,
        summary: `Bust · Rest ${game.playerScore}`
      };
    }

    game.playerScore -= score;
    game.playerScored += score;

    if (game.playerScore === 0) {
      return {
        finished: true,
        summary: `Checkout ${score} · AVG ${formatNumber(calculateGameAverage(game, "player"), 2)}`
      };
    }

    return {
      finished: false,
      summary: `${score} Punkte · Rest ${game.playerScore}`
    };
  }

  function applyComputerVisit(game) {
    const opponent = getTrainingOpponent(game.opponentId);
    const visit = simulateComputerVisit(game.computerScore, opponent);
    game.computerVisits += 1;

    if (visit.bust) {
      return {
        finished: false,
        summary: `Bust · Rest ${game.computerScore}`
      };
    }

    game.computerScore -= visit.points;
    game.computerScored += visit.points;

    if (game.computerScore === 0) {
      return {
        finished: true,
        summary: `Checkout ${visit.points} · AVG ${formatNumber(calculateGameAverage(game, "computer"), 2)}`
      };
    }

    return {
      finished: false,
      summary: `${visit.points} Punkte · Rest ${game.computerScore}`
    };
  }

  function simulateComputerVisit(scoreLeft, opponent) {
    if (isCheckoutPossible(scoreLeft)) {
      const checkoutBonus = scoreLeft <= 40 ? 0.08 : 0;
      if (Math.random() < opponent.checkout + checkoutBonus) {
        return { points: scoreLeft, bust: false };
      }
    }

    let points = Math.round(randomNormal(opponent.average, opponent.spread));
    if (Math.random() < opponent.average / 1800) points = 180;
    points = Math.max(0, Math.min(180, points));

    if (points > scoreLeft || scoreLeft - points === 1 || points === scoreLeft) {
      if (scoreLeft > 60) {
        points = Math.max(0, scoreLeft - 2 - Math.floor(Math.random() * 20));
      } else {
        return { points: 0, bust: true };
      }
    }

    return { points, bust: false };
  }

  function finishTrainingGame(result) {
    const game = app.trainingGame;
    game.status = "finished";
    const record = {
      id: createId("training"),
      type: "501",
      date: new Date().toISOString(),
      label: `${game.startScore} Double Out`,
      result,
      opponentId: game.opponentId,
      opponentName: game.opponentName,
      opponentAverage: game.opponentAverage,
      startScore: game.startScore,
      playerAverage: calculateGameAverage(game, "player"),
      playerVisits: game.playerVisits,
      playerRemaining: game.playerScore,
      computerRemaining: game.computerScore
    };
    record.feedback = buildTrainingFeedback(record);
    record.summary = `${record.result === "win" ? "Sieg" : "Niederlage"} gegen ${game.opponentName}`;
    app.training.records.unshift(record);
    app.training.records = app.training.records.slice(0, 200);
    saveTrainingData();
    els.trainingFeedback.textContent = record.feedback;
    renderTraining();
  }

  function buildTrainingFeedback(record) {
    const relevantOpponents = app.data.opponents
      .filter((opponent) => opponent.average !== null)
      .sort((a, b) => (b.average || 0) - (a.average || 0));
    const avg = record.playerAverage || 0;
    const resultText = record.result === "win" ? "Sieg" : "Niederlage";

    if (!relevantOpponents.length) {
      if (avg >= 60 && record.result === "win") return `Starkes Leg: ${resultText} mit ${formatNumber(avg, 2)} AVG. Damit spielst du auf Top-Gegner-Niveau.`;
      if (avg >= 45) return `Solides Leg: ${formatNumber(avg, 2)} AVG. Damit kannst du in vielen Liga-Spielen mithalten.`;
      return `Du musst weiter ueben, um konstant Druck auf die Top-Platzierungen zu machen. Dein 501 AVG: ${formatNumber(avg, 2)}.`;
    }

    const strongest = relevantOpponents[0];
    const reachable = relevantOpponents.find((opponent) => (opponent.average || 0) <= avg + 1);
    const cupOpponents = relevantOpponents.filter((opponent) => opponentIncludesCategory(opponent, "cup"));
    const reachableCup = cupOpponents.find((opponent) => (opponent.average || 0) <= avg + 1);
    const cupText = reachableCup
      ? ` Auch dein Cup-Gegner ${reachableCup.name} ist damit in Reichweite.`
      : cupOpponents.length
        ? ` Fuer den staerksten Cup-Gegner ${cupOpponents[0].name} brauchst du etwa AVG ${formatNumber(cupOpponents[0].average, 2)}.`
        : "";

    if (avg >= (strongest.average || 0) && record.result === "win") {
      return `Mit diesem Spiel schaffst du sogar den staerksten Gegner ${strongest.name} aus deiner Gegnerliste. ${formatNumber(avg, 2)} AVG und Sieg gegen den Computer.${cupText}`;
    }

    if (reachable) {
      return `Mit diesem Spiel kannst du es mit ${reachable.name} aus deiner Gegnerliste aufnehmen. Dein Trainings-AVG: ${formatNumber(avg, 2)}, Gegner-AVG: ${formatNumber(reachable.average, 2)}.${cupText}`;
    }

    return `Du musst weiter ueben, um Platz 1 anzugreifen. Zielmarke: ${strongest.name} mit AVG ${formatNumber(strongest.average, 2)}. Dein Leg lag bei ${formatNumber(avg, 2)}.${cupText}`;
  }

  function handleDoublePracticeSubmit(event) {
    event.preventDefault();
    const data = readForm(els.doublePracticeForm, { attempts: "number", hits: "number" });
    if (!data.target || !data.attempts || data.hits === null || data.hits > data.attempts) {
      alert("Bitte Versuche und Treffer korrekt eintragen.");
      return;
    }
    const rate = (data.hits / data.attempts) * 100;
    app.training.records.unshift({
      id: createId("training"),
      type: "double",
      date: new Date().toISOString(),
      label: data.target,
      result: `${data.hits}/${data.attempts}`,
      checkoutRate: rate,
      summary: `${data.target}: ${data.hits} Treffer aus ${data.attempts}`,
      feedback: rate >= 25 ? "Stabile Doppelquote im Training." : "Doppel weiter wiederholen, bis die Quote stabiler wird."
    });
    saveTrainingData();
    els.doublePracticeForm.reset();
    renderTraining();
  }

  function handleScoringPracticeSubmit(event) {
    event.preventDefault();
    const data = readForm(els.scoringPracticeForm, { visits: "number", points: "number" });
    if (!data.visits || data.points === null) {
      alert("Bitte Aufnahmen und Punkte eintragen.");
      return;
    }
    const scoringAverage = data.points / data.visits;
    app.training.records.unshift({
      id: createId("training"),
      type: "scoring",
      date: new Date().toISOString(),
      label: "Scoring Check",
      result: `${data.points} Punkte`,
      scoringAverage,
      summary: `${data.visits} Aufnahmen · ${data.points} Punkte`,
      feedback: scoringAverage >= 50 ? "Gutes Scoring-Niveau." : "Mehr saubere 60er-Aufnahmen trainieren."
    });
    saveTrainingData();
    els.scoringPracticeForm.reset();
    renderTraining();
  }

  function deleteTrainingRecord(id) {
    const record = app.training.records.find((item) => item.id === id);
    if (!record) return;
    if (!confirm("Diese Trainingseinheit loeschen?")) return;
    app.training.records = app.training.records.filter((item) => item.id !== id);
    saveTrainingData();
    renderTraining();
  }

  function getTrainingRecordName(record) {
    if (record.type === "501") return `${record.label} vs ${record.opponentName}`;
    if (record.type === "double") return `Doppel ${record.label}`;
    return record.label || "Training";
  }

  function getTrainingRecordResult(record) {
    if (record.type === "501") return record.result === "win" ? "Sieg" : "Niederlage";
    return record.result || "-";
  }

  function getTrainingRecordMetric(record) {
    if (record.type === "501") return `AVG ${formatNumber(record.playerAverage, 2)}`;
    if (record.type === "double") return formatPercent(record.checkoutRate);
    if (record.type === "scoring") return `AVG ${formatNumber(record.scoringAverage, 2)}`;
    return "-";
  }

  function getTrainingOpponent(id) {
    return computerOpponents.find((opponent) => opponent.id === id) || computerOpponents[1];
  }

  function calculateGameAverage(game, actor) {
    const visits = actor === "player" ? game.playerVisits : game.computerVisits;
    const scored = actor === "player" ? game.playerScored : game.computerScored;
    return visits ? scored / visits : null;
  }

  function isCheckoutPossible(score) {
    const impossible = [169, 168, 166, 165, 163, 162, 159];
    return score > 1 && score <= 170 && !impossible.includes(score);
  }

  function randomNormal(mean, spread) {
    const u = 1 - Math.random();
    const v = Math.random();
    const standard = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    return mean + standard * spread;
  }

  function compareLeaderboardRows(a, b) {
    const key = app.leaderboardSort;
    const direction = app.leaderboardDirection === "asc" ? 1 : -1;
    let result;

    if (key === "name") {
      result = a.name.localeCompare(b.name, "de");
    } else {
      result = numericValue(a[key]) - numericValue(b[key]);
    }

    if (result === 0) {
      result = b.wins - a.wins || b.legDiff - a.legDiff || a.name.localeCompare(b.name, "de");
      return result;
    }

    return result * direction;
  }

  function compareNullableNumbers(a, b, direction = "desc") {
    const aValid = a !== null && a !== undefined && Number.isFinite(Number(a));
    const bValid = b !== null && b !== undefined && Number.isFinite(Number(b));
    if (!aValid && !bValid) return 0;
    if (!aValid) return 1;
    if (!bValid) return -1;
    return direction === "asc" ? Number(a) - Number(b) : Number(b) - Number(a);
  }

  function compareDates(a, b) {
    if (!a && !b) return 0;
    if (!a) return 1;
    if (!b) return -1;
    return String(b).localeCompare(String(a));
  }

  function handlePlayerSubmit(event) {
    event.preventDefault();
    const formData = readForm(els.playerForm, playerFieldTypes);
    formData.name = cleanText(formData.name);

    if (!formData.name) {
      alert("Bitte gib deinen Namen ein.");
      return;
    }

    app.data.player = normalizePlayerProfile({
      ...app.data.player,
      ...formData,
      updatedAt: new Date().toISOString()
    });
    saveData();
    renderPlayerProfile();
    renderAnalysis();
    showSection("mygame");
  }

  function handleSetupSubmit(event) {
    event.preventDefault();
    const formData = readForm(els.setupForm, setupFieldTypes);
    formData.name = cleanText(formData.name);
    formData.active = formData.active !== "false";

    if (!formData.name) {
      alert("Bitte gib einen Namen fuer das Setup ein.");
      return;
    }

    const now = new Date().toISOString();
    if (app.editingSetupId) {
      const index = app.data.setups.findIndex((setup) => setup.id === app.editingSetupId);
      if (index !== -1) {
        app.data.setups[index] = {
          ...app.data.setups[index],
          ...formData,
          updatedAt: now
        };
      }
    } else {
      app.data.setups.push({
        id: createId("setup"),
        ...formData,
        createdAt: now,
        updatedAt: now
      });
    }
    saveData();
    resetSetupForm();
    renderAll();
    showSection("mygame");
  }

  function editSetup(id) {
    const setup = app.data.setups.find((item) => item.id === id);
    if (!setup) return;
    app.editingSetupId = id;
    fillForm(els.setupForm, setup);
    els.setupSubmitButton.textContent = "Aenderungen speichern";
    showSection("mygame");
    els.setupForm.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function resetSetupForm() {
    app.editingSetupId = null;
    els.setupForm.reset();
    els.setupForm.elements.active.value = "true";
    els.setupSubmitButton.textContent = "Setup speichern";
  }

  function deleteSetup(id) {
    const setup = app.data.setups.find((item) => item.id === id);
    if (!setup) return;
    const used = app.data.matches.filter((match) => match.setupId === id).length;
    const ok = confirm(used
      ? `Setup "${setup.name}" loeschen? Es bleibt in ${used} gespeicherten Spielen als leerer Bezug zurueck.`
      : `Setup "${setup.name}" loeschen?`);
    if (!ok) return;
    app.data.setups = app.data.setups.filter((item) => item.id !== id);
    app.data.matches = app.data.matches.map((match) => match.setupId === id ? { ...match, setupId: "" } : match);
    if (app.editingSetupId === id) resetSetupForm();
    saveData();
    renderAll();
  }

  function handleOpponentSubmit(event) {
    event.preventDefault();
    const formData = readForm(els.opponentForm, opponentFieldTypes);
    formData.name = cleanText(formData.name);
    if (formData.category === "__new_event__") {
      const eventItem = ensureEvent(formData.newEventName);
      if (!eventItem) {
        alert("Bitte gib einen Namen fuer das neue Event ein.");
        return;
      }
      formData.category = `event:${eventItem.id}`;
    } else {
      formData.category = normalizeOpponentCategory(formData.category);
    }
    delete formData.newEventName;
    formData.pace = normalizePace(formData.pace);

    if (!formData.name) {
      alert("Bitte gib einen Namen fuer den Gegner ein.");
      return;
    }

    if (!validateScaleFields(formData, ["scoringStrength", "doubleStrength", "mentalStrength"])) {
      alert("Staerke-Werte bitte nur von 1 bis 10 eintragen.");
      return;
    }

    const now = new Date().toISOString();
    if (app.editingOpponentId) {
      const index = app.data.opponents.findIndex((opponent) => opponent.id === app.editingOpponentId);
      if (index !== -1) {
        app.data.opponents[index] = {
          ...app.data.opponents[index],
          ...formData,
          updatedAt: now
        };
      }
    } else {
      app.data.opponents.push({
        id: createId("opp"),
        ...formData,
        createdAt: now,
        updatedAt: now
      });
    }

    saveData();
    resetOpponentForm();
    renderAll();
    showSection("opponents");
  }

  function editOpponent(id) {
    const opponent = findOpponent(id);
    if (!opponent) return;
    app.editingOpponentId = id;
    fillForm(els.opponentForm, opponent);
    els.opponentFormTitle.textContent = "Gegner bearbeiten";
    els.opponentEditState.textContent = "Bearbeitung";
    els.opponentSubmitButton.textContent = "Aenderungen speichern";
    updateOpponentEventField();
    showSection("opponents");
    els.opponentForm.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function resetOpponentForm() {
    app.editingOpponentId = null;
    els.opponentForm.reset();
    els.opponentFormTitle.textContent = "Gegner anlegen";
    els.opponentEditState.textContent = "Neu";
    els.opponentSubmitButton.textContent = "Gegner speichern";
    updateOpponentEventField();
  }

  function deleteOpponent(id) {
    const opponent = findOpponent(id);
    if (!opponent) return;
    const relatedMatches = getMatchesForOpponent(id).length;
    const message = relatedMatches
      ? `Gegner "${opponent.name}" und ${relatedMatches} zugehoerige Spiele loeschen?`
      : `Gegner "${opponent.name}" loeschen?`;

    if (!confirm(message)) return;
    app.data.opponents = app.data.opponents.filter((item) => item.id !== id);
    app.data.matches = app.data.matches.filter((match) => match.opponentId !== id);
    if (app.selectedProfileId === id) app.selectedProfileId = null;
    if (app.editingOpponentId === id) resetOpponentForm();
    saveData();
    renderAll();
    showSection("opponents");
  }

  function handleMatchSubmit(event) {
    event.preventDefault();
    const formData = readForm(els.matchForm, matchFieldTypes);
    const parsedScore = parseScore(formData.score);
    formData.competition = cleanText(formData.competition || "Liga");
    formData.eventName = cleanText(formData.eventName);
    formData.setupId = cleanText(formData.setupId);
    formData.statScreenshot = app.matchScreenshotData;
    formData.legResults = normalizeLegResults([
      formData.leg1,
      formData.leg2,
      formData.leg3,
      formData.leg4,
      formData.leg5,
      formData.leg6
    ]);
    ["leg1", "leg2", "leg3", "leg4", "leg5", "leg6"].forEach((key) => delete formData[key]);

    if (parsedScore) {
      formData.legsWon = parsedScore.won;
      formData.legsLost = parsedScore.lost;
      formData.score = `${parsedScore.won}:${parsedScore.lost}`;
    } else {
      formData.score = `${formData.legsWon || 0}:${formData.legsLost || 0}`;
    }

    if (!formData.opponentId) {
      alert("Bitte waehle einen Gegner aus.");
      return;
    }

    if (!formData.date || !formData.season) {
      alert("Bitte Datum und Season eintragen.");
      return;
    }

    if (!validateLegs(formData.legsWon, formData.legsLost)) {
      alert("Best of 6: Gewonnene und verlorene Legs duerfen zusammen maximal 6 ergeben.");
      return;
    }

    if (!validatePercentFields(formData, ["myDoubleRate", "opponentDoubleRate"])) {
      alert("Doppelquoten bitte nur zwischen 0 und 100 Prozent eintragen.");
      return;
    }

    if (!validateScaleFields(formData, ["nervousBefore", "nervousDuring", "throwFeeling", "concentration", "satisfaction"])) {
      alert("Mentale Bewertungen bitte nur von 1 bis 10 eintragen.");
      return;
    }

    formData.result = getResult(formData.legsWon, formData.legsLost);
    const now = new Date().toISOString();

    if (app.editingMatchId) {
      const index = app.data.matches.findIndex((match) => match.id === app.editingMatchId);
      if (index !== -1) {
        app.data.matches[index] = {
          ...app.data.matches[index],
          ...formData,
          updatedAt: now
        };
      }
    } else {
      app.data.matches.push({
        id: createId("match"),
        ...formData,
        createdAt: now,
        updatedAt: now
      });
    }

    saveData();
    resetMatchForm();
    renderAll();
    showSection("matches");
  }

  function editMatch(id) {
    const match = app.data.matches.find((item) => item.id === id);
    if (!match) return;
    app.editingMatchId = id;
    app.matchScreenshotData = match.statScreenshot || "";
    fillForm(els.matchForm, match);
    fillLegResultFields(match.legResults);
    renderMatchScreenshotPreview(app.matchScreenshotData);
    els.matchFormTitle.textContent = "Spiel bearbeiten";
    els.matchEditState.textContent = "Bearbeitung";
    els.matchSubmitButton.textContent = "Aenderungen speichern";
    updateMatchResultPreview();
    showSection("matches");
    els.matchForm.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function resetMatchForm() {
    app.editingMatchId = null;
    app.matchScreenshotData = "";
    els.matchForm.reset();
    els.matchScreenshotInput.value = "";
    renderMatchScreenshotPreview("");
    setDefaultMatchDate();
    els.matchFormTitle.textContent = "Spiel speichern";
    els.matchEditState.textContent = "Neu";
    els.matchSubmitButton.textContent = "Spiel speichern";
    fillLegResultFields([]);
    updateMatchResultPreview();
  }

  function deleteMatch(id) {
    const match = app.data.matches.find((item) => item.id === id);
    if (!match) return;
    const opponent = findOpponent(match.opponentId);
    const name = opponent ? opponent.name : "diesen Gegner";
    if (!confirm(`Spiel gegen ${name} vom ${formatDate(match.date)} loeschen?`)) return;
    app.data.matches = app.data.matches.filter((item) => item.id !== id);
    if (app.editingMatchId === id) resetMatchForm();
    saveData();
    renderAll();
  }

  function handleScoreInput(event) {
    if (event.target.name === "score") {
      const parsed = parseScore(event.target.value);
      if (parsed) {
        els.matchForm.elements.legsWon.value = parsed.won;
        els.matchForm.elements.legsLost.value = parsed.lost;
      }
    }
    updateMatchResultPreview();
  }

  async function handleMatchScreenshotSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Bitte waehle eine Bilddatei aus.");
      event.target.value = "";
      return;
    }

    try {
      app.matchScreenshotData = await resizeImageFile(file, 1200, 0.78);
      renderMatchScreenshotPreview(app.matchScreenshotData);
    } catch (error) {
      alert("Der Screenshot konnte nicht verarbeitet werden.");
      console.error(error);
      event.target.value = "";
    }
  }

  function updateMatchResultPreview() {
    const legsWon = toNumber(els.matchForm.elements.legsWon.value);
    const legsLost = toNumber(els.matchForm.elements.legsLost.value);
    const result = getResult(legsWon, legsLost);
    const label = resultLabels[result] || "Offen";
    const legText = legsWon !== null || legsLost !== null ? `${legsWon || 0}:${legsLost || 0}` : "noch kein Endstand";
    els.matchResultPreview.textContent = `Ergebnis: ${label} (${legText})`;
  }

  function renderMatchScreenshotPreview(dataUrl) {
    if (!dataUrl) {
      els.matchScreenshotPreview.classList.add("empty");
      els.matchScreenshotPreview.innerHTML = "Kein Screenshot gespeichert";
      return;
    }
    els.matchScreenshotPreview.classList.remove("empty");
    els.matchScreenshotPreview.innerHTML = `<img src="${dataUrl}" alt="Spielstatistik Screenshot">`;
  }

  function renderScreenshotButton(match) {
    if (!match.statScreenshot) return "-";
    return `<button class="button small secondary" type="button" data-action="view-screenshot" data-id="${match.id}">Ansehen</button>`;
  }

  function viewMatchScreenshot(id) {
    const match = app.data.matches.find((item) => item.id === id);
    if (!match?.statScreenshot) return;
    const win = window.open("", "_blank");
    if (!win) {
      alert("Popup wurde blockiert. Oeffne den Screenshot ueber einen erlaubten neuen Tab.");
      return;
    }
    win.document.write(`
      <!doctype html>
      <html lang="de">
      <head><meta charset="utf-8"><title>Spielstatistik Screenshot</title></head>
      <body style="margin:0;background:#0f1012;display:grid;place-items:center;min-height:100vh;">
        <img src="${match.statScreenshot}" alt="Spielstatistik Screenshot" style="max-width:100%;max-height:100vh;">
      </body>
      </html>
    `);
    win.document.close();
  }

  function handleActionClick(event) {
    const button = event.target.closest("[data-action]");
    if (!button) return;
    const id = button.dataset.id;
    const action = button.dataset.action;

    if ((action === "view-profile" || action === "edit-opponent") && id === "__player__") {
      showSection("mygame");
      els.playerForm.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    if (action === "view-profile") {
      renderProfile(id);
      showSection("profile");
    }
    if (action === "edit-player-profile") {
      showSection("mygame");
      els.playerForm.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    if (action === "edit-opponent") editOpponent(id);
    if (action === "delete-opponent") deleteOpponent(id);
    if (action === "edit-match") editMatch(id);
    if (action === "delete-match") deleteMatch(id);
    if (action === "delete-training") deleteTrainingRecord(id);
    if (action === "edit-setup") editSetup(id);
    if (action === "delete-setup") deleteSetup(id);
    if (action === "view-screenshot") viewMatchScreenshot(id);
  }

  function showSection(id) {
    els.panels.forEach((panel) => {
      panel.classList.toggle("active", panel.id === id);
    });
    els.tabButtons.forEach((button) => {
      button.classList.toggle("active", button.dataset.section === id);
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function clearFilters() {
    els.globalSearch.value = "";
    els.seasonFilter.value = "";
    els.resultFilter.value = "";
    els.categoryFilter.value = "";
    els.avgMinFilter.value = "";
    els.avgMaxFilter.value = "";
    els.seasonsPlayedFilter.value = "";
    els.dashboardScopeSelect.value = "official";
    renderDashboardStats();
    renderDashboardOpponents();
  }

  function exportData() {
    const payload = {
      app: APP_NAME,
      version: 1,
      exportedAt: new Date().toISOString(),
      opponents: app.data.opponents,
      matches: app.data.matches,
      setups: app.data.setups,
      events: app.data.events,
      training: app.training
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const date = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.download = `darts-performance-hub-${date}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function importData(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        const imported = normalizeData(parsed);
        if (!Array.isArray(imported.opponents) || !Array.isArray(imported.matches)) {
          throw new Error("Ungueltige Struktur");
        }
        const ok = confirm(`Import starten? Aktuelle Browser-Daten werden ersetzt. Enthalten: ${imported.opponents.length} Gegner und ${imported.matches.length} Spiele.`);
        if (!ok) return;
        app.data = imported;
        app.editingOpponentId = null;
        app.editingMatchId = null;
        app.editingSetupId = null;
        app.selectedProfileId = null;
        if (parsed.training) {
          app.training = normalizeTrainingData(parsed.training);
          saveTrainingData();
        }
        saveData();
        resetOpponentForm();
        resetMatchForm();
        resetSetupForm();
        renderAll();
        showSection("dashboard");
      } catch (error) {
        alert("Die JSON Datei konnte nicht importiert werden.");
        console.error(error);
      } finally {
        els.importFileInput.value = "";
      }
    };
    reader.readAsText(file);
  }

  function resetAllData() {
    const first = confirm("Alle lokal gespeicherten Gegner und Spiele loeschen?");
    if (!first) return;
    const second = confirm("Bist du sicher? Dieser Schritt kann nur mit einem vorherigen JSON Export rueckgaengig gemacht werden.");
    if (!second) return;
    app.data = { opponents: [], matches: [], setups: [], events: [], player: normalizePlayerProfile() };
    app.editingOpponentId = null;
    app.editingMatchId = null;
    app.editingSetupId = null;
    app.selectedProfileId = null;
    app.training = { records: [] };
    app.trainingGame = null;
    saveData();
    saveTrainingData();
    resetOpponentForm();
    resetMatchForm();
    resetSetupForm();
    renderAll();
    showSection("dashboard");
  }

  function calculateStats(matches) {
    const games = matches.length;
    const wins = matches.filter((match) => match.result === "win").length;
    const losses = matches.filter((match) => match.result === "loss").length;
    const draws = matches.filter((match) => match.result === "draw").length;
    const legsWon = sum(matches, "legsWon");
    const legsLost = sum(matches, "legsLost");
    return {
      games,
      wins,
      losses,
      draws,
      legsWon,
      legsLost,
      legDiff: legsWon - legsLost,
      winRate: games ? (wins / games) * 100 : null,
      myAverage: average(matches.map((match) => match.myAverage)),
      first9Average: average(matches.map((match) => match.first9Average)),
      opponentAverage: average(matches.map((match) => match.opponentAverage)),
      myDoubleRate: average(matches.map((match) => match.myDoubleRate)),
      highFinish: max(matches.map((match) => match.myHighFinish)),
      scores100Plus: sum(matches, "scores100Plus"),
      scores140Plus: sum(matches, "scores140Plus"),
      total180s: sum(matches, "my180s"),
      bestLeg: min(matches.map((match) => match.bestLeg)),
      worstLeg: max(matches.map((match) => match.worstLeg))
    };
  }

  function calculateRecordFromMatches(matches) {
    const games = matches.length;
    const wins = matches.filter((match) => match.result === "win").length;
    const losses = matches.filter((match) => match.result === "loss").length;
    const draws = matches.filter((match) => match.result === "draw").length;
    const legsWon = sum(matches, "legsWon");
    const legsLost = sum(matches, "legsLost");
    return {
      games,
      wins,
      losses,
      draws,
      legsWon,
      legsLost,
      legDiff: legsWon - legsLost,
      winRate: games ? (wins / games) * 100 : null,
      average: average(matches.map((match) => match.opponentAverage))
    };
  }

  function calculateOpponentRecord(opponentId, season = "", competitionFilter = "all") {
    const matches = getMatchesForOpponent(opponentId)
      .filter((match) => !season || match.season === season)
      .filter((match) => matchMatchesCompetitionFilter(match, competitionFilter));
    return calculateRecordFromMatches(matches);
  }

  function getOpponentDisplayAverage(opponent, record) {
    return record && record.average !== null ? record.average : opponent.average;
  }

  function readForm(form, numberFields) {
    const data = {};
    Array.from(form.elements).forEach((field) => {
      if (!field.name) return;
      data[field.name] = numberFields[field.name] === "number" ? toNumber(field.value) : cleanText(field.value);
    });
    return data;
  }

  function fillForm(form, data) {
    Array.from(form.elements).forEach((field) => {
      if (!field.name || !(field.name in data)) return;
      field.value = data[field.name] ?? "";
    });
  }

  function parseScore(value) {
    const match = cleanText(value).match(/^(\d+)\s*[:\-]\s*(\d+)$/);
    if (!match) return null;
    return {
      won: Number(match[1]),
      lost: Number(match[2])
    };
  }

  function validateLegs(won, lost) {
    const left = won || 0;
    const right = lost || 0;
    return left >= 0 && right >= 0 && left + right <= 6;
  }

  function getResult(won, lost) {
    if (won === null && lost === null) return "open";
    const left = won || 0;
    const right = lost || 0;
    if (left > right) return "win";
    if (left < right) return "loss";
    if (left === right && (left > 0 || right > 0)) return "draw";
    return "open";
  }

  function getMatchesForOpponent(opponentId) {
    return app.data.matches.filter((match) => match.opponentId === opponentId);
  }

  function findOpponent(id) {
    return app.data.opponents.find((opponent) => opponent.id === id);
  }

  function getOpponentsByName() {
    return [...app.data.opponents].sort((a, b) => a.name.localeCompare(b.name, "de"));
  }

  function setDefaultMatchDate() {
    if (!els.matchForm) return;
    els.matchForm.elements.date.value = new Date().toISOString().slice(0, 10);
  }

  function renderStatCard([label, value, hint]) {
    return `
      <div class="stat-card">
        <span>${escapeHtml(label)}</span>
        <strong>${escapeHtml(displayValue(value))}</strong>
        <small>${escapeHtml(hint || "")}</small>
      </div>
    `;
  }

  function renderResultBadge(result) {
    const key = result || "open";
    return `<span class="result-badge ${key}">${resultLabels[key] || "Offen"}</span>`;
  }

  function renderTableEmpty(colspan, message) {
    return `<tr><td colspan="${colspan}" class="empty-state">${escapeHtml(message)}</td></tr>`;
  }

  function normalizeLegResults(value) {
    const source = Array.isArray(value) ? value : [];
    return source
      .map((item) => cleanText(item))
      .filter((item) => item === "win" || item === "loss")
      .slice(0, 6);
  }

  function fillLegResultFields(results) {
    for (let index = 1; index <= 6; index += 1) {
      const field = els.matchForm.elements[`leg${index}`];
      if (field) field.value = results?.[index - 1] || "";
    }
  }

  function getMatchCompetitionLabel(match) {
    const competition = cleanText(match.competition || "Liga");
    const eventName = cleanText(match.eventName);
    return eventName ? `${competition} · ${eventName}` : competition;
  }

  function getDashboardScope() {
    return els.dashboardScopeSelect?.value || "official";
  }

  function getDashboardMatches() {
    return filterMatchesByCompetition(app.data.matches, getDashboardScope());
  }

  function filterMatchesByCompetition(matches, filter = "official") {
    return matches.filter((match) => matchMatchesCompetitionFilter(match, filter));
  }

  function matchMatchesCompetitionFilter(match, filter = "all") {
    const normalized = normalizeCompetition(match.competition);
    if (!filter || filter === "all") return true;
    if (filter === "official") return normalized === "liga" || normalized === "cup" || normalized === "turnier";
    if (filter === "training") return normalized === "training";
    return normalized === normalizeCompetition(filter);
  }

  function normalizeCompetition(value) {
    const competition = cleanText(value || "Liga").toLowerCase();
    if (competition.includes("training")) return "training";
    if (competition.includes("freund")) return "freundschaftsspiel";
    if (competition.includes("cup")) return "cup";
    if (competition.includes("turnier") || competition.includes("event")) return "turnier";
    if (competition.includes("liga")) return "liga";
    return competition || "liga";
  }

  function getCompetitionFilterLabel(filter) {
    const labels = {
      official: "Offizielle Spiele",
      all: "Alle Spiele",
      liga: "Liga",
      cup: "Cup",
      turnier: "Turnier/Event",
      training: "Training",
      freundschaftsspiel: "Freundschaft",
      Liga: "Liga",
      Cup: "Cup",
      Turnier: "Turnier/Event",
      Training: "Training",
      Freundschaftsspiel: "Freundschaft"
    };
    return labels[filter] || labels[normalizeCompetition(filter)] || filter || "Alle Spiele";
  }

  function resizeImageFile(file, maxSize, quality) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        const image = new Image();
        image.onerror = reject;
        image.onload = () => {
          const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
          const canvas = document.createElement("canvas");
          canvas.width = Math.max(1, Math.round(image.width * scale));
          canvas.height = Math.max(1, Math.round(image.height * scale));
          const context = canvas.getContext("2d");
          context.drawImage(image, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/jpeg", quality));
        };
        image.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  function getRecentMatches(matches, limit) {
    return [...matches]
      .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
      .slice(0, limit);
  }

  function calculateWinRate(matches) {
    if (!matches.length) return null;
    return (matches.filter((match) => match.result === "win").length / matches.length) * 100;
  }

  function calculateWinStreaks(matches) {
    const sorted = [...matches].sort((a, b) => (a.date || "").localeCompare(b.date || ""));
    let current = 0;
    let best = 0;
    let running = 0;
    sorted.forEach((match) => {
      if (match.result === "win") {
        running += 1;
        best = Math.max(best, running);
      } else {
        running = 0;
      }
    });

    for (let index = sorted.length - 1; index >= 0; index -= 1) {
      if (sorted[index].result === "win") current += 1;
      else break;
    }

    return { current, best };
  }

  function calculateResultStreak(matches) {
    const sorted = getRecentMatches(matches, matches.length).filter((match) => match.result === "win" || match.result === "loss" || match.result === "draw");
    if (!sorted.length) return { result: "open", count: 0, label: "-", hint: "Noch keine Serie" };

    const firstResult = sorted[0].result;
    let count = 0;
    for (const match of sorted) {
      if (match.result !== firstResult) break;
      count += 1;
    }

    const labels = {
      win: count === 1 ? "1 Sieg" : `${count} Siege`,
      loss: count === 1 ? "1 Niederlage" : `${count} Niederlagen`,
      draw: count === 1 ? "1 Remis" : `${count} Remis`
    };

    return {
      result: firstResult,
      count,
      label: labels[firstResult] || "-",
      hint: "vom neuesten Spiel rueckwaerts"
    };
  }

  function calculateFirstLegStats(matches) {
    const firstLegs = matches
      .map((match) => match.legResults?.[0])
      .filter((value) => value === "win" || value === "loss");
    const wins = firstLegs.filter((value) => value === "win").length;
    return {
      total: firstLegs.length,
      wins,
      winRate: firstLegs.length ? (wins / firstLegs.length) * 100 : null
    };
  }

  function calculateLegPhaseStats(matches) {
    const early = [];
    const late = [];

    matches.forEach((match) => {
      (match.legResults || []).forEach((result, index) => {
        if (result !== "win" && result !== "loss") return;
        if (index < 3) early.push(result);
        else late.push(result);
      });
    });

    return {
      early: summarizeLegResults(early),
      late: summarizeLegResults(late)
    };
  }

  function summarizeLegResults(results) {
    const wins = results.filter((result) => result === "win").length;
    return {
      total: results.length,
      wins,
      losses: results.length - wins,
      winRate: results.length ? (wins / results.length) * 100 : null
    };
  }

  function getBestSetupSummary(matches = app.data.matches) {
    const summaries = getSetupSummaries(1, matches);

    if (!summaries.length) return null;
    summaries.sort((a, b) => (b.winRate || 0) - (a.winRate || 0) || (b.average || 0) - (a.average || 0));
    return summaries[0];
  }

  function getSetupSummaries(minGames = 0, matches = app.data.matches) {
    return app.data.setups.map((setup) => {
      const setupMatches = matches.filter((match) => match.setupId === setup.id);
      const stats = calculateStats(setupMatches);
      const mental = calculateSetupMental(setupMatches);
      return {
        id: setup.id,
        name: setup.name,
        games: stats.games,
        average: stats.myAverage,
        checkoutQuote: stats.myDoubleRate,
        winRate: stats.winRate,
        mental
      };
    }).filter((summary) => summary.games >= minGames);
  }

  function calculateSetupMental(matches) {
    const nervous = average(matches.map((match) => match.nervousDuring));
    const concentration = average(matches.map((match) => match.concentration));
    const throwFeeling = average(matches.map((match) => match.throwFeeling));
    const satisfaction = average(matches.map((match) => match.satisfaction));
    const positiveValues = [concentration, throwFeeling, satisfaction].filter((value) => value !== null);
    const positiveAverage = average(positiveValues);
    const parts = [];

    if (nervous !== null) parts.push(`Nerv ${formatNumber(nervous, 1)}`);
    if (positiveAverage !== null) parts.push(`Gefuehl ${formatNumber(positiveAverage, 1)}`);

    return {
      nervous,
      concentration,
      throwFeeling,
      satisfaction,
      positiveAverage,
      summary: parts.length ? parts.join(" / ") : "-"
    };
  }

  function getOpponentPerformanceSummary(mode, matches = app.data.matches) {
    const rows = app.data.opponents.map((opponent) => ({
      opponent,
      record: calculateRecordFromMatches(matches.filter((match) => match.opponentId === opponent.id))
    })).filter((row) => row.record.games >= 3 && row.record.winRate !== null);

    if (!rows.length) return null;
    rows.sort((a, b) => {
      const rateDiff = a.record.winRate - b.record.winRate;
      if (rateDiff !== 0) return mode === "best" ? -rateDiff : rateDiff;
      return mode === "best"
        ? b.record.legDiff - a.record.legDiff
        : a.record.legDiff - b.record.legDiff;
    });
    return rows[0];
  }

  function mostCommonValue(values) {
    const counts = {};
    values.forEach((value) => {
      counts[value] = (counts[value] || 0) + 1;
    });
    const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return entries.length ? { value: entries[0][0], count: entries[0][1] } : null;
  }

  function formatProblemLabel(value) {
    const labels = {
      scoring: "Scoring",
      checkout: "Doppel / Checkout",
      kopf: "Kopf / Nervositaet",
      rhythmus: "Rhythmus",
      gegnerdruck: "Gegnerdruck"
    };
    return labels[value] || value;
  }

  function formatPhaseLabel(value) {
    const labels = {
      start: "Start",
      mitte: "Mitte",
      ende: "Ende",
      "gar-nicht": "Gar nicht"
    };
    return labels[value] || value;
  }

  function formatDelta(value) {
    if (value === null || value === undefined || !Number.isFinite(Number(value))) return 0;
    return Number(value).toFixed(1);
  }

  function validatePercentFields(data, fields) {
    return fields.every((field) => {
      const value = data[field];
      return value === null || (value >= 0 && value <= 100);
    });
  }

  function validateScaleFields(data, fields) {
    return fields.every((field) => {
      const value = data[field];
      return value === null || (value >= 1 && value <= 10);
    });
  }

  function buildMentalReportLine(matches) {
    const rated = matches.filter((match) => match.nervousDuring !== null);
    if (rated.length < 3) return "Noch zu wenig Mentaldaten vorhanden.";
    const high = rated.filter((match) => match.nervousDuring >= 7);
    const low = rated.filter((match) => match.nervousDuring <= 6);
    if (high.length < 2 || low.length < 2) return `Durchschnittliche Nervositaet: ${formatNumber(average(rated.map((match) => match.nervousDuring)), 1)}.`;
    return `Bei hoher Nervositaet: ${formatPercent(calculateWinRate(high))} Siegquote. Bei niedriger Nervositaet: ${formatPercent(calculateWinRate(low))}.`;
  }

  function buildLegReportLine(matches) {
    const firstLeg = calculateFirstLegStats(matches);
    if (firstLeg.total < 3) return "Noch zu wenig Legverlauf-Daten vorhanden.";
    if (firstLeg.winRate < 45) return `Du verlierst auffaellig viele erste Legs. Aktuelle Quote: ${formatPercent(firstLeg.winRate)}.`;
    if (firstLeg.winRate > 60) return `Dein Matchbeginn ist aktuell eine Staerke. Erste-Leg-Quote: ${formatPercent(firstLeg.winRate)}.`;
    return `Dein erstes Leg ist ausgeglichen. Quote: ${formatPercent(firstLeg.winRate)}.`;
  }

  function normalizeOpponentCategory(value) {
    const raw = cleanText(value);
    const category = raw.toLowerCase();
    if (category.startsWith("event:")) return `event:${raw.slice(6).trim().toLowerCase()}`;
    if (category === "cup") return "cup";
    if (category === "both" || category === "liga+cup" || category === "liga + cup") return "both";
    return "liga";
  }

  function normalizePace(value) {
    const pace = cleanText(value).toLowerCase();
    if (pace === "langsam" || pace === "mittel" || pace === "schnell") return pace;
    return "";
  }

  function opponentIncludesCategory(opponent, category) {
    const normalized = normalizeOpponentCategory(opponent.category);
    const requested = normalizeOpponentCategory(category);
    if (requested.startsWith("event:")) return normalized === requested;
    if (requested === "cup") return normalized === "cup" || normalized === "both";
    if (requested === "liga") return normalized === "liga" || normalized === "both";
    if (requested === "both") return normalized === "both";
    return true;
  }

  function opponentMatchesCategory(opponent, category) {
    return opponentIncludesCategory(opponent, normalizeOpponentCategory(category));
  }

  function getOpponentCategoryLabel(category) {
    const normalized = normalizeOpponentCategory(category);
    if (normalized.startsWith("event:")) return getEventLabel(normalized);
    if (normalized === "cup") return "Cup";
    if (normalized === "both") return "Liga + Cup";
    return "Liga";
  }

  function normalizeEvent(eventItem = {}) {
    const name = cleanText(eventItem.name);
    return {
      id: cleanText(eventItem.id) || createEventId(name),
      name,
      createdAt: eventItem.createdAt || new Date().toISOString()
    };
  }

  function createEventId(name) {
    const base = normalizeSearch(name)
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    return base || createId("event");
  }

  function findEventByCategory(category) {
    const normalized = normalizeOpponentCategory(category);
    if (!normalized.startsWith("event:")) return null;
    const eventId = normalized.slice(6);
    return app.data.events.find((eventItem) => eventItem.id === eventId) || null;
  }

  function getEventLabel(category) {
    const eventItem = findEventByCategory(category);
    if (eventItem) return eventItem.name;
    const normalized = normalizeOpponentCategory(category);
    return normalized.startsWith("event:") ? normalized.slice(6) : "Event";
  }

  function ensureEvent(name) {
    const cleanName = cleanText(name);
    if (!cleanName) return null;
    const id = createEventId(cleanName);
    const existing = app.data.events.find((eventItem) => eventItem.id === id);
    if (existing) return existing;
    const eventItem = {
      id,
      name: cleanName,
      createdAt: new Date().toISOString()
    };
    app.data.events.push(eventItem);
    return eventItem;
  }

  function cleanText(value) {
    return String(value ?? "").trim();
  }

  function toNumber(value) {
    if (value === null || value === undefined || value === "") return null;
    const normalized = String(value).replace(",", ".");
    const number = Number(normalized);
    return Number.isFinite(number) ? number : null;
  }

  function numericValue(value) {
    return value === null || value === undefined ? -Infinity : Number(value);
  }

  function sum(items, key) {
    return items.reduce((total, item) => total + (Number(item[key]) || 0), 0);
  }

  function average(values) {
    const valid = values.filter((value) => value !== null && value !== undefined && Number.isFinite(Number(value)));
    if (!valid.length) return null;
    return valid.reduce((total, value) => total + Number(value), 0) / valid.length;
  }

  function max(values) {
    const valid = values.filter((value) => value !== null && value !== undefined && Number.isFinite(Number(value)));
    return valid.length ? Math.max(...valid.map(Number)) : null;
  }

  function min(values) {
    const valid = values.filter((value) => value !== null && value !== undefined && Number.isFinite(Number(value)));
    return valid.length ? Math.min(...valid.map(Number)) : null;
  }

  function uniqueSorted(values) {
    return [...new Set(values)].sort((a, b) => a.localeCompare(b, "de"));
  }

  function normalizeSearch(value) {
    return cleanText(value).toLocaleLowerCase("de-DE");
  }

  function formatNumber(value, digits = 0) {
    if (value === null || value === undefined || value === "") return "-";
    const number = Number(value);
    if (!Number.isFinite(number)) return "-";
    return new Intl.NumberFormat("de-DE", {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits
    }).format(number);
  }

  function formatPercent(value) {
    if (value === null || value === undefined || value === "") return "-";
    return `${formatNumber(value, 1)} %`;
  }

  function formatDate(value) {
    if (!value) return "-";
    const date = new Date(`${value}T00:00:00`);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat("de-DE").format(date);
  }

  function displayValue(value) {
    if (value === null || value === undefined || value === "") return "-";
    return String(value);
  }

  function signed(value) {
    const number = Number(value) || 0;
    return number > 0 ? `+${number}` : String(number);
  }

  function countLabel(count, singular) {
    const pluralMap = {
      Spiel: "Spiele",
      Leg: "Legs",
      Einheit: "Einheiten",
      Gegner: "Gegner",
      Setup: "Setups",
      Hinweis: "Hinweise"
    };
    const plural = pluralMap[singular] || `${singular}`;
    return `${count} ${count === 1 ? singular : plural}`;
  }

  function createId(prefix) {
    return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
})();
