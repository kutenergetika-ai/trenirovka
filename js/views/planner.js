import { getExerciseById, CATEGORIES } from "../data/exercises.js";
import { mediaHTML } from "../placeholder.js";
import {
  getPlan, addExerciseToDay, removeExerciseFromDay, updatePlanItem, moveItem,
  WEEKDAYS, WEEKDAY_SHORT, WEEKDAY_TITLES, weekdayKeyFromDate,
} from "../db.js";
import { openExerciseDetail, openExercisePicker } from "../modal.js";

let selectedDay = weekdayKeyFromDate(new Date());

export function render(container) {
  const plan = getPlan();
  const items = plan[selectedDay];

  container.innerHTML = `
    <div class="page-header">
      <h1>План недели</h1>
      <p class="page-sub">Назначьте упражнения на дни недели. План повторяется каждую неделю.</p>
    </div>

    <div class="day-tabs" data-tabs>
      ${WEEKDAYS.map((d) => `
        <button class="day-tab ${d === selectedDay ? "active" : ""}" data-day="${d}">
          ${WEEKDAY_SHORT[d]}
          ${plan[d].length ? `<span class="day-tab-dot"></span>` : ""}
        </button>
      `).join("")}
    </div>

    <h2 class="section-title">${WEEKDAY_TITLES[selectedDay]}</h2>

    ${items.length === 0 ? `
      <div class="empty-state">
        <p>На этот день пока ничего не назначено.</p>
      </div>
    ` : `
      <div class="card-list" data-list>
        ${items.map((item, idx) => planItemHTML(item, idx, items.length)).join("")}
      </div>
    `}

    <button class="btn-primary" data-add>+ Добавить упражнение</button>
  `;

  container.querySelectorAll("[data-day]").forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedDay = btn.dataset.day;
      render(container);
    });
  });

  container.querySelector("[data-add]").addEventListener("click", () => {
    openExercisePicker({
      title: `Добавить в ${WEEKDAY_TITLES[selectedDay]}`,
      onPick: (ex) => {
        addExerciseToDay(selectedDay, ex);
        render(container);
      },
    });
  });

  bindItems(container);
}

function planItemHTML(item, idx, count) {
  const ex = getExerciseById(item.exerciseId);
  if (!ex) return "";
  const cat = CATEGORIES[ex.category];
  const unitLabel = ex.unit === "sec" ? "сек" : ex.unit === "min" ? "мин" : "повт.";

  return `
    <div class="ex-card plan-item" data-item="${item.uid}">
      <div class="ex-card-media" data-open-detail="${ex.id}">
        ${mediaHTML(ex)}
      </div>
      <div class="ex-card-body">
        <div class="ex-card-top">
          <span class="chip" style="--cat-color:${cat.color}">${cat.title}</span>
          <div class="reorder-btns">
            <button class="icon-btn small" data-move="-1" ${idx === 0 ? "disabled" : ""}>↑</button>
            <button class="icon-btn small" data-move="1" ${idx === count - 1 ? "disabled" : ""}>↓</button>
          </div>
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
      <button class="icon-btn remove" data-remove title="Убрать из плана">✕</button>
    </div>
  `;
}

function bindItems(container) {
  container.querySelectorAll("[data-open-detail]").forEach((el) => {
    el.addEventListener("click", () => {
      const ex = getExerciseById(el.dataset.openDetail);
      if (ex) openExerciseDetail(ex);
    });
  });

  container.querySelectorAll(".plan-item").forEach((card) => {
    const itemUid = card.dataset.item;

    card.querySelectorAll("input[data-field]").forEach((input) => {
      input.addEventListener("change", () => {
        const field = input.dataset.field;
        const value = input.value === "" ? null : Number(input.value);
        updatePlanItem(selectedDay, itemUid, { [field]: value });
      });
    });

    card.querySelectorAll("[data-move]").forEach((btn) => {
      btn.addEventListener("click", () => {
        moveItem(selectedDay, itemUid, Number(btn.dataset.move));
        render(container);
      });
    });

    card.querySelector("[data-remove]").addEventListener("click", () => {
      if (!confirm("Убрать упражнение из плана этого дня?")) return;
      removeExerciseFromDay(selectedDay, itemUid);
      render(container);
    });
  });
}
