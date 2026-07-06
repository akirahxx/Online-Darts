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
    highFinish: "number"
  };

  const matchFieldTypes = {
    legsWon: "number",
    legsLost: "number",
    myAverage: "number",
    opponentAverage: "number",
    myDoubleRate: "number",
    opponentDoubleRate: "number",
    my180s: "number",
    opponent180s: "number",
    myHighFinish: "number",
    opponentHighFinish: "number"
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
    selectedProfileId: null,
    leaderboardSort: "wins",
    leaderboardDirection: "desc",
    authMode: "setup",
    training: loadTrainingData(),
    trainingGame: null
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
    els.globalSearch = document.getElementById("globalSearch");
    els.seasonFilter = document.getElementById("seasonFilter");
    els.resultFilter = document.getElementById("resultFilter");
    els.avgMinFilter = document.getElementById("avgMinFilter");
    els.avgMaxFilter = document.getElementById("avgMaxFilter");
    els.seasonsPlayedFilter = document.getElementById("seasonsPlayedFilter");
    els.clearFiltersButton = document.getElementById("clearFiltersButton");
    els.opponentQuickTable = document.getElementById("opponentQuickTable");
    els.quickCount = document.getElementById("quickCount");

    els.opponentForm = document.getElementById("opponentForm");
    els.opponentFormTitle = document.getElementById("opponentFormTitle");
    els.opponentEditState = document.getElementById("opponentEditState");
    els.opponentSubmitButton = document.getElementById("opponentSubmitButton");
    els.cancelOpponentEditButton = document.getElementById("cancelOpponentEditButton");
    els.newOpponentButton = document.getElementById("newOpponentButton");
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
    els.matchResultPreview = document.getElementById("matchResultPreview");
    els.matchTable = document.getElementById("matchTable");
    els.matchCount = document.getElementById("matchCount");

    els.statsSeasonFilter = document.getElementById("statsSeasonFilter");
    els.statsGrid = document.getElementById("statsGrid");
    els.leaderboardSeasonFilter = document.getElementById("leaderboardSeasonFilter");
    els.leaderboardSortSelect = document.getElementById("leaderboardSortSelect");
    els.leaderboardTable = document.getElementById("leaderboardTable");

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
      els.avgMinFilter,
      els.avgMaxFilter,
      els.seasonsPlayedFilter
    ].forEach((input) => input.addEventListener("input", renderDashboardOpponents));

    els.clearFiltersButton.addEventListener("click", clearFilters);
    els.opponentListSearch.addEventListener("input", renderOpponentList);

    els.opponentForm.addEventListener("submit", handleOpponentSubmit);
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

    ["score", "legsWon", "legsLost"].forEach((name) => {
      els.matchForm.elements[name].addEventListener("input", handleScoreInput);
    });

    els.profileAddMatchButton.addEventListener("click", () => {
      if (!app.selectedProfileId) return;
      resetMatchForm();
      els.matchForm.elements.opponentId.value = app.selectedProfileId;
      updateMatchResultPreview();
      showSection("matches");
    });

    els.statsSeasonFilter.addEventListener("change", renderStats);
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
    els.authIntro.textContent = "Gib dein Passwort ein, um deine Darts Gegner Datenbank zu oeffnen.";
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
      if (!raw) return { opponents: [], matches: [] };
      const parsed = JSON.parse(raw);
      return normalizeData(parsed);
    } catch (error) {
      console.warn("Daten konnten nicht geladen werden.", error);
      return { opponents: [], matches: [] };
    }
  }

  function normalizeData(value) {
    const data = {
      opponents: Array.isArray(value.opponents) ? value.opponents : [],
      matches: Array.isArray(value.matches) ? value.matches : []
    };

    data.opponents = data.opponents.map((opponent) => ({
      id: opponent.id || createId("opp"),
      name: cleanText(opponent.name),
      nickname: cleanText(opponent.nickname),
      age: toNumber(opponent.age),
      hometown: cleanText(opponent.hometown),
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
      notes: cleanText(opponent.notes),
      strengths: cleanText(opponent.strengths),
      weaknesses: cleanText(opponent.weaknesses),
      tactics: cleanText(opponent.tactics),
      createdAt: opponent.createdAt || new Date().toISOString(),
      updatedAt: opponent.updatedAt || new Date().toISOString()
    })).filter((opponent) => opponent.name);

    data.matches = data.matches.map((match) => {
      const legsWon = toNumber(match.legsWon);
      const legsLost = toNumber(match.legsLost);
      return {
        id: match.id || createId("match"),
        date: cleanText(match.date),
        season: cleanText(match.season),
        opponentId: cleanText(match.opponentId),
        score: cleanText(match.score),
        legsWon,
        legsLost,
        myAverage: toNumber(match.myAverage),
        opponentAverage: toNumber(match.opponentAverage),
        myDoubleRate: toNumber(match.myDoubleRate),
        opponentDoubleRate: toNumber(match.opponentDoubleRate),
        my180s: toNumber(match.my180s),
        opponent180s: toNumber(match.opponent180s),
        myHighFinish: toNumber(match.myHighFinish),
        opponentHighFinish: toNumber(match.opponentHighFinish),
        observations: cleanText(match.observations),
        note: cleanText(match.note),
        result: getResult(legsWon, legsLost),
        createdAt: match.createdAt || new Date().toISOString(),
        updatedAt: match.updatedAt || new Date().toISOString()
      };
    }).filter((match) => match.opponentId);

    return data;
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
    renderTrainingOpponentOptions();
    renderDashboardStats();
    renderDashboardOpponents();
    renderOpponentList();
    renderMatches();
    renderStats();
    renderLeaderboard();
    renderTraining();
    if (app.selectedProfileId) renderProfile(app.selectedProfileId);
  }

  function renderSeasonOptions() {
    const seasons = uniqueSorted(app.data.matches.map((match) => match.season).filter(Boolean));
    setSelectOptions(els.seasonFilter, seasons, "Alle Seasons");
    setSelectOptions(els.statsSeasonFilter, seasons, "Alle Seasons");
    setSelectOptions(els.leaderboardSeasonFilter, seasons, "Alle Seasons");
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

  function renderDashboardStats() {
    const stats = calculateStats(app.data.matches);
    const cards = [
      ["Spiele", stats.games, `${stats.wins} Siege`],
      ["Siegquote", formatPercent(stats.winRate), `${stats.draws} Unentschieden`],
      ["Leg Differenz", signed(stats.legDiff), `${stats.legsWon}:${stats.legsLost} Legs`],
      ["Mein AVG", formatNumber(stats.myAverage, 2), `Gegner ${formatNumber(stats.opponentAverage, 2)}`]
    ];
    els.dashboardStats.innerHTML = cards.map(renderStatCard).join("");
  }

  function renderDashboardOpponents() {
    const filtered = getFilteredOpponents();
    els.quickCount.textContent = countLabel(filtered.length, "Gegner");

    if (!filtered.length) {
      els.opponentQuickTable.innerHTML = renderTableEmpty(6, "Keine Gegner gefunden.");
      return;
    }

    els.opponentQuickTable.innerHTML = filtered.map((opponent) => {
      const record = calculateOpponentRecord(opponent.id, els.seasonFilter.value);
      const lastMatch = getMatchesForOpponent(opponent.id)
        .sort((a, b) => (b.date || "").localeCompare(a.date || ""))[0];
      const avg = getOpponentDisplayAverage(opponent, record);
      return `
        <tr>
          <td>
            <strong>${escapeHtml(opponent.name)}</strong>
            <div class="muted">${escapeHtml(opponent.nickname || opponent.hometown || "Kein Zusatz")}</div>
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

  function getFilteredOpponents() {
    const search = normalizeSearch(els.globalSearch.value);
    const season = els.seasonFilter.value;
    const result = els.resultFilter.value;
    const avgMin = toNumber(els.avgMinFilter.value);
    const avgMax = toNumber(els.avgMaxFilter.value);
    const seasonsPlayed = toNumber(els.seasonsPlayedFilter.value);

    return getOpponentsByName().filter((opponent) => {
      const record = calculateOpponentRecord(opponent.id, season);
      const haystack = normalizeSearch([
        opponent.name,
        opponent.nickname,
        opponent.hometown,
        opponent.favoriteDouble
      ].join(" "));
      const avg = getOpponentDisplayAverage(opponent, record);
      const opponentMatches = getMatchesForOpponent(opponent.id);

      if (search && !haystack.includes(search)) return false;
      if (season && !opponentMatches.some((match) => match.season === season)) return false;
      if (result && !opponentMatches.some((match) => match.result === result && (!season || match.season === season))) return false;
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
        opponent.hometown,
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
            <span>${escapeHtml(opponent.nickname || "Ohne Spitzname")}</span>
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
      ["Lieblings Doppel", opponent.favoriteDouble],
      ["Darts Gewicht", opponent.dartWeight ? `${formatNumber(opponent.dartWeight, 1)} g` : ""],
      ["Heimatort", opponent.hometown],
      ["Alter", opponent.age ? `${formatNumber(opponent.age, 0)} Jahre` : ""],
      ["Gespielte Seasons", opponent.seasonsPlayed]
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
        <td>${escapeHtml(match.season)}</td>
        <td>${escapeHtml(match.score || `${match.legsWon}:${match.legsLost}`)}</td>
        <td>${renderResultBadge(match.result)}</td>
        <td>${formatNumber(match.myAverage, 2)}</td>
        <td>${formatNumber(match.opponentAverage, 2)}</td>
        <td>${escapeHtml(match.note || match.observations || "")}</td>
      </tr>
    `).join("") : renderTableEmpty(7, "Noch kein Spiel gegen diesen Gegner.");

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
                  <th>Season</th>
                  <th>Endstand</th>
                  <th>Ergebnis</th>
                  <th>Mein AVG</th>
                  <th>Gegner AVG</th>
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
      els.matchTable.innerHTML = renderTableEmpty(8, "Noch keine Spiele gespeichert.");
      return;
    }

    els.matchTable.innerHTML = matches.map((match) => {
      const opponent = findOpponent(match.opponentId);
      return `
        <tr>
          <td>${formatDate(match.date)}</td>
          <td>${escapeHtml(match.season)}</td>
          <td>${escapeHtml(opponent ? opponent.name : "Geloeschter Gegner")}</td>
          <td>${escapeHtml(match.score || `${match.legsWon}:${match.legsLost}`)}</td>
          <td>${renderResultBadge(match.result)}</td>
          <td>${formatNumber(match.myAverage, 2)}</td>
          <td>${formatPercent(match.myDoubleRate)}</td>
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
    const matches = season ? app.data.matches.filter((match) => match.season === season) : app.data.matches;
    const stats = calculateStats(matches);
    const cards = [
      ["Anzahl Spiele", stats.games, season || "Alle Seasons"],
      ["Gewonnene Spiele", stats.wins, "Siege"],
      ["Verlorene Spiele", stats.losses, "Niederlagen"],
      ["Unentschieden", stats.draws, "Remis"],
      ["Gewonnene Legs", stats.legsWon, "Legs"],
      ["Verlorene Legs", stats.legsLost, "Legs"],
      ["Leg Differenz", signed(stats.legDiff), "Gewonnen minus verloren"],
      ["Siegquote", formatPercent(stats.winRate), "Siege pro Spiel"],
      ["Eigener AVG", formatNumber(stats.myAverage, 2), "Durchschnitt"],
      ["Gegner AVG", formatNumber(stats.opponentAverage, 2), "Durchschnitt"],
      ["Doppelquote", formatPercent(stats.myDoubleRate), "Eigener Schnitt"],
      ["Hoechstes Finish", formatNumber(stats.highFinish, 0), "Eigenes Finish"],
      ["180er gesamt", stats.total180s, "Eigene 180er"]
    ];
    els.statsGrid.innerHTML = cards.map(renderStatCard).join("");
  }

  function renderLeaderboard() {
    const season = els.leaderboardSeasonFilter.value;
    const rows = app.data.opponents.map((opponent) => {
      const record = calculateOpponentRecord(opponent.id, season);
      return {
        opponent,
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
    });

    rows.sort((a, b) => compareLeaderboardRows(a, b));

    if (!rows.length) {
      els.leaderboardTable.innerHTML = renderTableEmpty(11, "Noch keine Gegner fuer die Rangliste.");
      return;
    }

    els.leaderboardTable.innerHTML = rows.map((row, index) => `
      <tr>
        <td>${index + 1}</td>
        <td><strong>${escapeHtml(row.name)}</strong></td>
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
    const leagueOpponents = app.data.opponents
      .filter((opponent) => opponent.average !== null)
      .sort((a, b) => (b.average || 0) - (a.average || 0));
    const avg = record.playerAverage || 0;
    const resultText = record.result === "win" ? "Sieg" : "Niederlage";

    if (!leagueOpponents.length) {
      if (avg >= 60 && record.result === "win") return `Starkes Leg: ${resultText} mit ${formatNumber(avg, 2)} AVG. Damit spielst du auf Top-Gegner-Niveau.`;
      if (avg >= 45) return `Solides Leg: ${formatNumber(avg, 2)} AVG. Damit kannst du in vielen Liga-Spielen mithalten.`;
      return `Du musst weiter ueben, um konstant Druck auf die Top-Platzierungen zu machen. Dein 501 AVG: ${formatNumber(avg, 2)}.`;
    }

    const strongest = leagueOpponents[0];
    const reachable = leagueOpponents.find((opponent) => (opponent.average || 0) <= avg + 1);

    if (avg >= (strongest.average || 0) && record.result === "win") {
      return `Mit diesem Spiel schaffst du sogar den staerksten Gegner ${strongest.name} aus deiner Liga. ${formatNumber(avg, 2)} AVG und Sieg gegen den Computer.`;
    }

    if (reachable) {
      return `Mit diesem Spiel kannst du es mit ${reachable.name} aus deiner Liga aufnehmen. Dein Trainings-AVG: ${formatNumber(avg, 2)}, Gegner-AVG: ${formatNumber(reachable.average, 2)}.`;
    }

    return `Du musst weiter ueben, um Platz 1 anzugreifen. Zielmarke: ${strongest.name} mit AVG ${formatNumber(strongest.average, 2)}. Dein Leg lag bei ${formatNumber(avg, 2)}.`;
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

  function handleOpponentSubmit(event) {
    event.preventDefault();
    const formData = readForm(els.opponentForm, opponentFieldTypes);
    formData.name = cleanText(formData.name);

    if (!formData.name) {
      alert("Bitte gib einen Namen fuer den Gegner ein.");
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
    showSection("opponents");
    els.opponentForm.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function resetOpponentForm() {
    app.editingOpponentId = null;
    els.opponentForm.reset();
    els.opponentFormTitle.textContent = "Gegner anlegen";
    els.opponentEditState.textContent = "Neu";
    els.opponentSubmitButton.textContent = "Gegner speichern";
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
    fillForm(els.matchForm, match);
    els.matchFormTitle.textContent = "Spiel bearbeiten";
    els.matchEditState.textContent = "Bearbeitung";
    els.matchSubmitButton.textContent = "Aenderungen speichern";
    updateMatchResultPreview();
    showSection("matches");
    els.matchForm.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function resetMatchForm() {
    app.editingMatchId = null;
    els.matchForm.reset();
    setDefaultMatchDate();
    els.matchFormTitle.textContent = "Spiel speichern";
    els.matchEditState.textContent = "Neu";
    els.matchSubmitButton.textContent = "Spiel speichern";
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

  function updateMatchResultPreview() {
    const legsWon = toNumber(els.matchForm.elements.legsWon.value);
    const legsLost = toNumber(els.matchForm.elements.legsLost.value);
    const result = getResult(legsWon, legsLost);
    const label = resultLabels[result] || "Offen";
    const legText = legsWon !== null || legsLost !== null ? `${legsWon || 0}:${legsLost || 0}` : "noch kein Endstand";
    els.matchResultPreview.textContent = `Ergebnis: ${label} (${legText})`;
  }

  function handleActionClick(event) {
    const button = event.target.closest("[data-action]");
    if (!button) return;
    const id = button.dataset.id;
    const action = button.dataset.action;

    if (action === "view-profile") {
      renderProfile(id);
      showSection("profile");
    }
    if (action === "edit-opponent") editOpponent(id);
    if (action === "delete-opponent") deleteOpponent(id);
    if (action === "edit-match") editMatch(id);
    if (action === "delete-match") deleteMatch(id);
    if (action === "delete-training") deleteTrainingRecord(id);
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
    els.avgMinFilter.value = "";
    els.avgMaxFilter.value = "";
    els.seasonsPlayedFilter.value = "";
    renderDashboardOpponents();
  }

  function exportData() {
    const payload = {
      app: "Darts Gegner Datenbank",
      version: 1,
      exportedAt: new Date().toISOString(),
      opponents: app.data.opponents,
      matches: app.data.matches,
      training: app.training
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const date = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.download = `darts-gegner-datenbank-${date}.json`;
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
        app.selectedProfileId = null;
        if (parsed.training) {
          app.training = normalizeTrainingData(parsed.training);
          saveTrainingData();
        }
        saveData();
        resetOpponentForm();
        resetMatchForm();
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
    app.data = { opponents: [], matches: [] };
    app.editingOpponentId = null;
    app.editingMatchId = null;
    app.selectedProfileId = null;
    app.training = { records: [] };
    app.trainingGame = null;
    saveData();
    saveTrainingData();
    resetOpponentForm();
    resetMatchForm();
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
      opponentAverage: average(matches.map((match) => match.opponentAverage)),
      myDoubleRate: average(matches.map((match) => match.myDoubleRate)),
      highFinish: max(matches.map((match) => match.myHighFinish)),
      total180s: sum(matches, "my180s")
    };
  }

  function calculateOpponentRecord(opponentId, season = "") {
    const matches = getMatchesForOpponent(opponentId)
      .filter((match) => !season || match.season === season);
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
      Gegner: "Gegner"
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
