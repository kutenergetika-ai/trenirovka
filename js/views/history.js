import { getExerciseById, CATEGORIES } from "../data/exercises.js";
import { getAllLogDates, getLogForDate, WEEKDAY_TITLES } from "../db.js";
import { openExerciseDetail } from "../modal.js";

export function render(container) {
  const dates = getAllLogDates();

  container.innerHTML = `
    <div class="page-header">
      <h1>История</h1>
      <p class="page-sub">Прошлые тренировки.</p>
    </div>

    ${dates.length === 0 ? `
      <div class="empty-state"><p>Пока нет записей. Начните тренировку на вкладке «Сегодня».</p></div>
    ` : `
      <div class="history-list">
        ${dates.map((d) => historyRowHTML(d)).join("")}
      </div>
    `}
  `;

  container.querySelectorAll("[data-toggle]").forEach((row) => {
    row.addEventListener("click", (e) => {
      if (e.target.closest("[data-ex-link]")) return;
      const body = row.querySelector(".history-body");
      body.classList.toggle("open");
    });
  });

  container.querySelectorAll("[data-ex-link]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.stopPropagation();
      const ex = getExerciseById(el.dataset.exLink);
      if (ex) openExerciseDetail(ex);
    });
  });
}

function historyRowHTML(dateStr) {
  const log = getLogForDate(dateStr);
  const done = log.items.filter((i) => i.done).length;
  const total = log.items.length;
  const [y, m, d] = dateStr.split("-");

  return `
    <div class="history-row" data-toggle>
      <div class="history-row-top">
        <div>
          <div class="history-date">${d}.${m}.${y}</div>
          <div class="history-weekday">${WEEKDAY_TITLES[log.weekday] || ""}</div>
        </div>
        <div class="history-status ${log.finishedAt ? "ok" : ""}">
          ${log.finishedAt ? "Завершена" : `${done}/${total} выполнено`}
        </div>
      </div>
      <div class="history-body">
        ${log.items.map((item) => {
          const ex = getExerciseById(item.exerciseId);
          if (!ex) return "";
          const cat = CATEGORIES[ex.category];
          const unitLabel = ex.unit === "sec" ? "сек" : ex.unit === "min" ? "мин" : "повт.";
          return `
            <div class="history-item" data-ex-link="${ex.id}">
              <span class="dot" style="background:${cat.color}"></span>
              <span class="history-item-name">${ex.name}</span>
              <span class="history-item-meta">${item.sets}×${item.reps}${unitLabel !== "повт." ? " " + unitLabel : ""}${item.weight ? " · " + item.weight + " кг" : ""}</span>
              ${item.done ? '<span class="history-item-check">✓</span>' : ""}
            </div>
          `;
        }).join("")}
      </div>
    </div>
  `;
}
