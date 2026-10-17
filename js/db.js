// Локальное хранилище (localStorage). Всё работает офлайн, без сервера.

const KEYS = {
  plan: "trn_plan_v1",
  logs: "trn_logs_v1",
  settings: "trn_settings_v1",
};

const WEEKDAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const WEEKDAY_TITLES = {
  mon: "Понедельник",
  tue: "Вторник",
  wed: "Среда",
  thu: "Четверг",
  fri: "Пятница",
  sat: "Суббота",
  sun: "Воскресенье",
};

const WEEKDAY_SHORT = {
  mon: "Пн", tue: "Вт", wed: "Ср", thu: "Чт", fri: "Пт", sat: "Сб", sun: "Вс",
};

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    console.warn("db: не удалось прочитать", key, e);
    return fallback;
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn("db: не удалось сохранить", key, e);
  }
}

function emptyPlan() {
  const plan = {};
  WEEKDAYS.forEach((d) => (plan[d] = []));
  return plan;
}

export function getPlan() {
  const plan = readJSON(KEYS.plan, null);
  if (!plan) {
    const fresh = emptyPlan();
    writeJSON(KEYS.plan, fresh);
    return fresh;
  }
  // гарантируем, что все дни присутствуют
  WEEKDAYS.forEach((d) => {
    if (!Array.isArray(plan[d])) plan[d] = [];
  });
  return plan;
}

export function savePlan(plan) {
  writeJSON(KEYS.plan, plan);
}

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export function addExerciseToDay(day, exercise) {
  const plan = getPlan();
  plan[day].push({
    uid: uid(),
    exerciseId: exercise.id,
    sets: exercise.defaultSets,
    reps: exercise.defaultReps,
    weight: exercise.defaultWeight,
  });
  savePlan(plan);
  return plan;
}

export function removeExerciseFromDay(day, itemUid) {
  const plan = getPlan();
  plan[day] = plan[day].filter((i) => i.uid !== itemUid);
  savePlan(plan);
  return plan;
}

export function updatePlanItem(day, itemUid, patch) {
  const plan = getPlan();
  const item = plan[day].find((i) => i.uid === itemUid);
  if (item) Object.assign(item, patch);
  savePlan(plan);
  return plan;
}

export function moveItem(day, itemUid, dir) {
  const plan = getPlan();
  const arr = plan[day];
  const idx = arr.findIndex((i) => i.uid === itemUid);
  if (idx < 0) return plan;
  const newIdx = idx + dir;
  if (newIdx < 0 || newIdx >= arr.length) return plan;
  const [item] = arr.splice(idx, 1);
  arr.splice(newIdx, 0, item);
  savePlan(plan);
  return plan;
}

// ---- Логи тренировок (факт) ----

export function getLogs() {
  return readJSON(KEYS.logs, {});
}

export function saveLogs(logs) {
  writeJSON(KEYS.logs, logs);
}

export function getLogForDate(dateStr) {
  const logs = getLogs();
  return logs[dateStr] || null;
}

export function updateLogItem(dateStr, itemUid, patch) {
  const logs = getLogs();
  const log = logs[dateStr];
  if (!log) return null;
  const item = log.items.find((i) => i.uid === itemUid);
  if (item) Object.assign(item, patch);
  saveLogs(logs);
  return log;
}

export function resetLogToPlan(dateStr, weekday, planItems) {
  const logs = getLogs();
  logs[dateStr] = {
    date: dateStr,
    weekday,
    items: planItems.map((p) => ({
      uid: uid(),
      planUid: p.uid,
      exerciseId: p.exerciseId,
      sets: p.sets,
      reps: p.reps,
      weight: p.weight,
      done: false,
    })),
    finishedAt: null,
  };
  saveLogs(logs);
  return logs[dateStr];
}

export function finishLog(dateStr) {
  const logs = getLogs();
  if (logs[dateStr]) {
    logs[dateStr].finishedAt = new Date().toISOString();
    saveLogs(logs);
  }
  return logs[dateStr];
}

export function getAllLogDates() {
  const logs = getLogs();
  return Object.keys(logs).sort((a, b) => (a < b ? 1 : -1));
}

// ---- Настройки ----

export function getSettings() {
  return readJSON(KEYS.settings, { installBannerDismissed: false });
}

export function saveSettings(settings) {
  writeJSON(KEYS.settings, settings);
}

// ---- Утилиты дат ----

export function todayStr() {
  const d = new Date();
  return formatDate(d);
}

export function formatDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function weekdayKeyFromDate(d) {
  // JS: 0 = Sunday ... 6 = Saturday -> переводим в наш порядок mon..sun
  const jsDay = d.getDay();
  const map = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  return map[jsDay];
}

export { WEEKDAYS, WEEKDAY_TITLES, WEEKDAY_SHORT };
