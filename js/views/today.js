import { getExerciseById, CATEGORIES } from "../data/exercises.js";
import { mediaHTML } from "../placeholder.js";
import {
  getPlan, todayStr, weekdayKeyFromDate, updateLogItem,
  resetLogToPlan, finishLog, getLogForDate, WEEKDAY_TITLES,
} from "../db.js";
import { openExerciseDetail, openExercisePicker } from "../modal.js";

const MONTHS = ["января","февраля","марта","апреля","мая","июня","июля","августа","сентября","октября","ноября","декабря"];

export function render(container) {
  const now = new Date();
  const dateStr = todayStr();
  const weekday = weekdayKeyFromDate(now);
  const plan = getPlan();
  const planItems = plan[weekday];

  let log = getLogForDate(dateStr);
  // Пустой лог (ещё не начатая тренировка) всегда пересобираем из актуального плана —
  // это даёт корректную картину, даже если упражнения добавили в план уже после
  // первого захода на вкладку «Сегодня». Непустой лог (уже есть отметки/правки) не трогаем.
  if (!log || log.items.length === 0) {
    log = resetLogToPlan(dateStr, weekday, planItems);
  }

  const dateLabel = `${now.getDate()} ${MONTHS[now.getMonth()]} · ${WEEKDAY_TITLES[weekday]}`;
  const doneCount = log.items.filter((i) => i.done).length;
  const total = log.items.length;

  container.innerHTML = `
    <div class="page-header">
      <h1>Сегодня</h1>
      <p class="page-sub">${dateLabel}</p>
    </div>

    ${total === 0 ? `
      <div class="empty-state">
        <p>На сегодня ничего не запланировано.</p>
        <button class="btn-secondary" data-goto="plan">Открыть план недели</button>
      </div>
    ` : `
      <div class="progress-row">
        <div class="progress-track"><div class="progress-fill" style="width:${total ? (doneCount/total*100) : 0}%"></div></div>
        <span class="progress-label">${doneCount} / ${total}</span>
      </div>

      <div class="card-list" data-list>
        ${log.items.map((item) => itemCardHTML(item)).join("")}
      </div>

      <div class="today-actions">
        <button class="btn-ghost" data-reset>Сбросить к плану дня</button>
        ${log.finishedAt
          ? `<button class="btn-primary done" data-finish>Тренировка завершена ✓</button>`
          : `<button class="btn-primary" data-finish>Завершить тренировку</button>`}
      </div>
    `}
  `;

  container.querySelector("[data-goto]")?.addEventListener("click", () => {
    location.hash = "#/plan";
  });

  container.querySelector("[data-reset]")?.addEventListener("click", () => {
    if (!confirm("Вернуть сегодняшнюю тренировку к плану дня? Текущие отметки сбросятся.")) return;
    resetLogToPlan(dateStr, weekday, planItems);
    render(container);
  });

  container.querySelector("[data-finish]")?.addEventListener("click", () => {
    finishLog(dateStr);
    render(container);
  });

  bindItemCards(container, dateStr, weekday, planItems);
}

function itemCardHTML(item) {
  const ex = getExerciseById(item.exerciseId);
  if (!ex) return "";
  const cat = CATEGORIES[ex.category];
  const unitLabel = ex.unit === "sec" ? "сек" : ex.unit === "min" ? "мин" : "повт.";

  return `
    <div class="ex-card ${item.done ? "is-done" : ""}" data-item="${item.uid}">
      <div class="ex-card-media" data-open-detail="${ex.id}">
        ${mediaHTML(ex)}
      </div>
      <div class="ex-card-body">
        <div class="ex-card-top">
          <span class="chip" style="--cat-color:${cat.color}">${cat.title}</span>
          <button class="icon-btn small" data-swap>⇄</button>
        </div>
        <div class="ex-card-name" data-open-detail="${ex.id}">${ex.name}</div>
        <div class="ex-card-fields">
          <label class="field">
            <span>Подходы</span>
            <input type="number" min="0" data-field="sets" value="${item.sets}" />
          </label>
          <label class="field">
            <span>${unitLabel === "повт." ? "Повт." : unitLabel}</span>
            <input type="number" min="0" data-field="reps" value="${item.reps}" />
          </label>
          <label class="field">
            <span>Вес, кг</span>
            <input type="number" min="0" step="0.5" data-field="weight" value="${item.weight ?? ""}" placeholder="—" />
          </label>
        </div>
      </div>
      <label class="ex-card-check">
        <input type="checkbox" data-field="done" ${item.done ? "checked" : ""} />
        <span class="check-mark"></span>
      </label>
    </div>
  `;
}

function bindItemCards(container, dateStr, weekday, planItems) {
  container.querySelectorAll("[data-open-detail]").forEach((el) => {
    el.addEventListener("click", () => {
      const ex = getExerciseById(el.dataset.openDetail);
      if (ex) openExerciseDetail(ex);
    });
  });

  container.querySelectorAll(".ex-card").forEach((card) => {
    const itemUid = card.dataset.item;

    card.querySelectorAll("input[data-field]").forEach((input) => {
      input.addEventListener("change", () => {
        const field = input.dataset.field;
        let value;
        if (field === "done") value = input.checked;
        else value = input.value === "" ? null : Number(input.value);
        updateLogItem(dateStr, itemUid, { [field]: value });
        card.classList.toggle("is-done", field === "done" ? input.checked : card.classList.contains("is-done"));
      });
    });

    card.querySelector("[data-swap]").addEventListener("click", () => {
      openExercisePicker({
        title: "Заменить упражнение (только сегодня)",
        onPick: (newEx) => {
          updateLogItem(dateStr, itemUid, {
            exerciseId: newEx.id,
            sets: newEx.defaultSets,
            reps: newEx.defaultReps,
            weight: newEx.defaultWeight,
          });
          render(container);
        },
      });
    });
  });
}
