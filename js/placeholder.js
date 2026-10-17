// Плейсхолдер-анимация для упражнения. Используется, пока нет реального gif/видео.
// Чтобы подключить реальную анимацию: укажите exercise.mediaSrc = "assets/exercises/имя.gif"
// (или .mp4) — тогда вместо плейсхолдера покажется ваш файл.

import { CATEGORIES } from "./data/exercises.js";
import { stickFigureMarkup } from "./animations.js";

export function mediaHTML(exercise, { size = "normal" } = {}) {
  const sizeClass = size === "large" ? "media-large" : "media-normal";

  if (exercise.mediaSrc) {
    if (/\.(mp4|webm|mov)$/i.test(exercise.mediaSrc)) {
      return `<div class="exercise-media ${sizeClass}">
        <video src="${exercise.mediaSrc}" autoplay loop muted playsinline></video>
      </div>`;
    }
    return `<div class="exercise-media ${sizeClass}">
      <img src="${exercise.mediaSrc}" alt="${escapeHTML(exercise.name)}" />
    </div>`;
  }

  const cat = CATEGORIES[exercise.category] || { color: "#999" };
  return `<div class="exercise-media ${sizeClass} placeholder" style="--cat-color:${cat.color}">
    <div class="stick-figure">${stickFigureMarkup(exercise.animation)}</div>
  </div>`;
}

function escapeHTML(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}
