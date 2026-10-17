// Библиотека упражнений. mediaSrc = null -> показывается анимация-пиктограмма (своего рисования, см. js/animations.js).
// Чтобы подставить свою реальную анимацию: положите gif/mp4 в assets/exercises/ и укажите путь в mediaSrc.
// animation — тип движения для пиктограммы: press | pull | elbow | squat | hinge | lunge | raise | core_move | core_hold | pushup | cardio

export const CATEGORIES = {
  chest:     { title: "Грудь",    color: "#FF6B6B" },
  back:      { title: "Спина",    color: "#4D96FF" },
  legs:      { title: "Ноги",     color: "#6BCB77" },
  shoulders: { title: "Плечи",    color: "#FFD93D" },
  arms:      { title: "Руки",     color: "#C780FA" },
  core:      { title: "Пресс",    color: "#38E8E0" },
  glutes:    { title: "Ягодицы",  color: "#FF7EB6" },
  cardio:    { title: "Кардио",   color: "#FF9F45" },
};

// unit: "reps" (повторения) | "sec" (секунды) | "min" (минуты)
export const EXERCISES = [
  // Грудь
  { id: "chest-bench-press", name: "Жим штанги лежа", category: "chest", equipment: "Штанга", unit: "reps", defaultSets: 4, defaultReps: 10, defaultWeight: 40, mediaSrc: null, animation: "press", description: "Лёжа на горизонтальной скамье, опускайте штангу к середине груди и выжимайте вверх." },
  { id: "chest-dumbbell-press", name: "Жим гантелей лежа", category: "chest", equipment: "Гантели", unit: "reps", defaultSets: 3, defaultReps: 12, defaultWeight: 14, mediaSrc: null, animation: "press", description: "Жим гантелей лёжа на скамье, более глубокая амплитуда, чем со штангой." },
  { id: "chest-pushup", name: "Отжимания от пола", category: "chest", equipment: "Свой вес", unit: "reps", defaultSets: 3, defaultReps: 15, defaultWeight: null, mediaSrc: null, animation: "pushup", description: "Классические отжимания, корпус прямой, локти под углом ~45° к телу." },
  { id: "chest-machine-press", name: "Жим в тренажере", category: "chest", equipment: "Тренажёр", unit: "reps", defaultSets: 3, defaultReps: 12, defaultWeight: 30, mediaSrc: null, animation: "press", description: "Жим в тренажёре (хаммер) — безопасная альтернатива жиму штанги." },
  { id: "chest-fly", name: "Разводка гантелей лежа", category: "chest", equipment: "Гантели", unit: "reps", defaultSets: 3, defaultReps: 12, defaultWeight: 8, mediaSrc: null, animation: "raise", description: "Разводите гантели в стороны с лёгким сгибом в локтях, растягивая грудные." },
  { id: "chest-dips", name: "Отжимания на брусьях", category: "chest", equipment: "Брусья", unit: "reps", defaultSets: 3, defaultReps: 10, defaultWeight: null, mediaSrc: null, animation: "pushup", description: "Наклон корпуса вперёд усиливает нагрузку на грудные мышцы." },
  { id: "chest-incline-press", name: "Жим гантелей на наклонной скамье", category: "chest", equipment: "Гантели", unit: "reps", defaultSets: 3, defaultReps: 10, defaultWeight: 12, mediaSrc: null, animation: "press", description: "Скамья под углом 30–45°, жим гантелей вверх — акцент на верх грудных." },
  { id: "chest-decline-fly", name: "Разводка на наклонной скамье (вниз)", category: "chest", equipment: "Гантели", unit: "reps", defaultSets: 3, defaultReps: 12, defaultWeight: 7, mediaSrc: null, animation: "raise", description: "Скамья наклонена головой вниз, разводка гантелей — акцент на низ грудных." },
  { id: "chest-pec-deck", name: "Сведение рук в тренажере (бабочка)", category: "chest", equipment: "Тренажёр", unit: "reps", defaultSets: 3, defaultReps: 12, defaultWeight: 25, mediaSrc: null, animation: "raise", description: "Сидя, сведение рук перед грудью в тренажёре пек-дек, локти слегка согнуты." },
  { id: "chest-cable-crossover", name: "Кроссовер на блоках", category: "chest", equipment: "Тренажёр", unit: "reps", defaultSets: 3, defaultReps: 15, defaultWeight: 10, mediaSrc: "assets/exercises/chest-cable-crossover.jpg", animation: "raise", description: "Стоя между стойками кроссовера, сведение рук перед собой по дуге сверху вниз." },
  { id: "chest-smith-press", name: "Жим штанги в Смите лежа", category: "chest", equipment: "Тренажёр Смита", unit: "reps", defaultSets: 3, defaultReps: 10, defaultWeight: 35, mediaSrc: null, animation: "press", description: "Жим лёжа в тренажёре Смита — траектория штанги зафиксирована, удобно работать без страхующего." },

  // Спина
  { id: "back-barbell-row", name: "Тяга штанги в наклоне", category: "back", equipment: "Штанга", unit: "reps", defaultSets: 4, defaultReps: 10, defaultWeight: 40, mediaSrc: null, animation: "pull", description: "Корпус наклонён вперёд, тянем штангу к низу живота, лопатки сводим." },
  { id: "back-lat-pulldown", name: "Тяга верхнего блока", category: "back", equipment: "Тренажёр", unit: "reps", defaultSets: 3, defaultReps: 12, defaultWeight: 35, mediaSrc: null, animation: "pull", description: "Тяга рукояти к груди широким хватом, спина прямая." },
  { id: "back-pullup", name: "Подтягивания широким хватом", category: "back", equipment: "Турник", unit: "reps", defaultSets: 3, defaultReps: 8, defaultWeight: null, mediaSrc: null, animation: "pull", description: "Подтягивания широким хватом сверху, подбородок выше перекладины." },
  { id: "back-one-arm-row", name: "Тяга гантели одной рукой", category: "back", equipment: "Гантели", unit: "reps", defaultSets: 3, defaultReps: 12, defaultWeight: 16, mediaSrc: null, animation: "pull", description: "Упор коленом и рукой на скамью, тяга гантели к поясу." },
  { id: "back-hyperextension", name: "Гиперэкстензия", category: "back", equipment: "Своё тело", unit: "reps", defaultSets: 3, defaultReps: 15, defaultWeight: null, mediaSrc: null, animation: "hinge", description: "Разгибание корпуса на тренажёре для гиперэкстензии, укрепляет низ спины и ягодицы." },
  { id: "back-seated-row", name: "Тяга горизонтального блока", category: "back", equipment: "Тренажёр", unit: "reps", defaultSets: 3, defaultReps: 12, defaultWeight: 35, mediaSrc: null, animation: "pull", description: "Сидя, тяга рукояти к животу, спина прямая, лопатки сводим в конце." },

  // Ноги
  { id: "legs-squat", name: "Приседания со штангой", category: "legs", equipment: "Штанга", unit: "reps", defaultSets: 4, defaultReps: 10, defaultWeight: 50, mediaSrc: null, animation: "squat", description: "Штанга на спине, приседаем до параллели бедра с полом, колени не заваливаем." },
  { id: "legs-leg-press", name: "Жим ногами в тренажере", category: "legs", equipment: "Тренажёр", unit: "reps", defaultSets: 3, defaultReps: 12, defaultWeight: 80, mediaSrc: null, animation: "squat", description: "Жим платформы ногами, стопы на ширине плеч." },
  { id: "legs-lunge", name: "Выпады с гантелями", category: "legs", equipment: "Гантели", unit: "reps", defaultSets: 3, defaultReps: 12, defaultWeight: 10, mediaSrc: null, animation: "lunge", description: "Шаг вперёд с гантелями в руках, колено задней ноги почти касается пола." },
  { id: "legs-rdl", name: "Румынская тяга", category: "legs", equipment: "Штанга", unit: "reps", defaultSets: 3, defaultReps: 10, defaultWeight: 40, mediaSrc: null, animation: "hinge", description: "Наклон с прямой спиной, штанга скользит вдоль ног, акцент на заднюю поверхность бедра." },
  { id: "legs-leg-extension", name: "Разгибание ног в тренажере", category: "legs", equipment: "Тренажёр", unit: "reps", defaultSets: 3, defaultReps: 15, defaultWeight: 25, mediaSrc: null, animation: "squat", description: "Сидя, разгибание голени в тренажёре, акцент на квадрицепс." },
  { id: "legs-bodyweight-squat", name: "Приседания с собственным весом", category: "legs", equipment: "Свой вес", unit: "reps", defaultSets: 3, defaultReps: 20, defaultWeight: null, mediaSrc: null, animation: "squat", description: "Приседания без веса, можно использовать для разминки или на выносливость." },

  // Плечи
  { id: "shoulders-seated-press", name: "Жим гантелей сидя", category: "shoulders", equipment: "Гантели", unit: "reps", defaultSets: 3, defaultReps: 10, defaultWeight: 12, mediaSrc: null, animation: "press", description: "Сидя, жим гантелей над головой, спина прямая, не прогибаться в пояснице." },
  { id: "shoulders-lateral-raise", name: "Махи гантелями в стороны", category: "shoulders", equipment: "Гантели", unit: "reps", defaultSets: 3, defaultReps: 15, defaultWeight: 6, mediaSrc: null, animation: "raise", description: "Подъём гантелей через стороны до уровня плеч, лёгкий вес, строгая техника." },
  { id: "shoulders-military-press", name: "Жим штанги стоя", category: "shoulders", equipment: "Штанга", unit: "reps", defaultSets: 4, defaultReps: 8, defaultWeight: 30, mediaSrc: null, animation: "press", description: "Армейский жим стоя, штанга от груди вверх, корпус напряжён." },
  { id: "shoulders-upright-row", name: "Тяга штанги к подбородку", category: "shoulders", equipment: "Штанга", unit: "reps", defaultSets: 3, defaultReps: 12, defaultWeight: 20, mediaSrc: null, animation: "pull", description: "Тяга штанги вдоль тела к подбородку узким хватом." },
  { id: "shoulders-rear-delt-fly", name: "Разведения в наклоне", category: "shoulders", equipment: "Гантели", unit: "reps", defaultSets: 3, defaultReps: 15, defaultWeight: 5, mediaSrc: null, animation: "raise", description: "Наклон корпуса вперёд, разведение гантелей для задних дельт." },

  // Руки
  { id: "arms-barbell-curl", name: "Подъем штанги на бицепс", category: "arms", equipment: "Штанга", unit: "reps", defaultSets: 3, defaultReps: 10, defaultWeight: 20, mediaSrc: null, animation: "elbow", description: "Стоя, подъём штанги на бицепс, локти прижаты к корпусу." },
  { id: "arms-hammer-curl", name: "Молотки с гантелями", category: "arms", equipment: "Гантели", unit: "reps", defaultSets: 3, defaultReps: 12, defaultWeight: 10, mediaSrc: null, animation: "elbow", description: "Подъём гантелей нейтральным хватом, нагружает бицепс и предплечье." },
  { id: "arms-skull-crusher", name: "Французский жим лежа", category: "arms", equipment: "Штанга EZ", unit: "reps", defaultSets: 3, defaultReps: 12, defaultWeight: 15, mediaSrc: null, animation: "elbow", description: "Лёжа, сгибание рук в локтях, штанга опускается ко лбу." },
  { id: "arms-triceps-pushdown", name: "Разгибание на блоке", category: "arms", equipment: "Тренажёр", unit: "reps", defaultSets: 3, defaultReps: 15, defaultWeight: 20, mediaSrc: null, animation: "elbow", description: "Разгибание рук на верхнем блоке, локти прижаты к корпусу, акцент трицепс." },
  { id: "arms-seated-curl", name: "Подъем гантелей сидя", category: "arms", equipment: "Гантели", unit: "reps", defaultSets: 3, defaultReps: 12, defaultWeight: 10, mediaSrc: null, animation: "elbow", description: "Сидя, попеременный подъём гантелей на бицепс." },
  { id: "arms-close-pushup", name: "Отжимания узким хватом", category: "arms", equipment: "Свой вес", unit: "reps", defaultSets: 3, defaultReps: 12, defaultWeight: null, mediaSrc: null, animation: "pushup", description: "Отжимания с узкой постановкой рук, акцент на трицепс." },

  // Пресс
  { id: "core-crunch", name: "Скручивания", category: "core", equipment: "Свой вес", unit: "reps", defaultSets: 3, defaultReps: 20, defaultWeight: null, mediaSrc: null, animation: "core_move", description: "Скручивания корпуса лёжа, не тянуть шею руками." },
  { id: "core-plank", name: "Планка", category: "core", equipment: "Свой вес", unit: "sec", defaultSets: 3, defaultReps: 45, defaultWeight: null, mediaSrc: null, animation: "core_hold", description: "Статическая планка на предплечьях, тело прямой линией." },
  { id: "core-leg-raise", name: "Подъем ног в висе", category: "core", equipment: "Турник", unit: "reps", defaultSets: 3, defaultReps: 12, defaultWeight: null, mediaSrc: null, animation: "raise", description: "Вис на турнике, подъём прямых или согнутых ног к груди." },
  { id: "core-russian-twist", name: "Русский твист", category: "core", equipment: "Свой вес", unit: "reps", defaultSets: 3, defaultReps: 20, defaultWeight: null, mediaSrc: null, animation: "core_move", description: "Сидя с приподнятыми ногами, повороты корпуса влево-вправо." },
  { id: "core-cable-crunch", name: "Скручивания на блоке", category: "core", equipment: "Тренажёр", unit: "reps", defaultSets: 3, defaultReps: 15, defaultWeight: 20, mediaSrc: null, animation: "core_move", description: "Скручивания на коленях у верхнего блока, акцент на пресс." },

  // Ягодицы
  { id: "glutes-hip-thrust", name: "Ягодичный мостик", category: "glutes", equipment: "Штанга", unit: "reps", defaultSets: 4, defaultReps: 12, defaultWeight: 30, mediaSrc: null, animation: "hinge", description: "Лёжа лопатками на скамье, таз на штанге, разгибание бёдер вверх." },
  { id: "glutes-reverse-lunge", name: "Выпады назад", category: "glutes", equipment: "Гантели", unit: "reps", defaultSets: 3, defaultReps: 12, defaultWeight: 10, mediaSrc: null, animation: "lunge", description: "Шаг назад с гантелями, акцент на ягодицы передней ноги." },
  { id: "glutes-abduction", name: "Отведение ноги в тренажере", category: "glutes", equipment: "Тренажёр", unit: "reps", defaultSets: 3, defaultReps: 15, defaultWeight: 20, mediaSrc: null, animation: "raise", description: "Отведение бедра в тренажёре в стороны, акцент на среднюю ягодичную." },
  { id: "glutes-single-rdl", name: "Тяга на одной ноге", category: "glutes", equipment: "Гантели", unit: "reps", defaultSets: 3, defaultReps: 10, defaultWeight: 10, mediaSrc: null, animation: "hinge", description: "Румынская тяга на одной ноге с гантелей, баланс и ягодицы." },

  // Кардио
  { id: "cardio-running", name: "Бег на месте", category: "cardio", equipment: "Свой вес", unit: "min", defaultSets: 1, defaultReps: 10, defaultWeight: null, mediaSrc: null, animation: "cardio", description: "Бег на месте в среднем темпе для разминки или кардио." },
  { id: "cardio-jump-rope", name: "Прыжки на скакалке", category: "cardio", equipment: "Скакалка", unit: "min", defaultSets: 3, defaultReps: 3, defaultWeight: null, mediaSrc: null, animation: "cardio", description: "Прыжки на скакалке, лёгкий темп, мягкое приземление." },
  { id: "cardio-burpee", name: "Берпи", category: "cardio", equipment: "Свой вес", unit: "reps", defaultSets: 4, defaultReps: 12, defaultWeight: null, mediaSrc: null, animation: "cardio", description: "Из стойки в упор лёжа, отжимание, прыжок — комплексное упражнение." },
  { id: "cardio-bike", name: "Велотренажер", category: "cardio", equipment: "Тренажёр", unit: "min", defaultSets: 1, defaultReps: 15, defaultWeight: null, mediaSrc: null, animation: "cardio", description: "Равномерная езда на велотренажёре в комфортном темпе." },
  { id: "cardio-jumping-jacks", name: "Jumping Jack", category: "cardio", equipment: "Свой вес", unit: "reps", defaultSets: 3, defaultReps: 25, defaultWeight: null, mediaSrc: null, animation: "cardio", description: "Прыжки с разведением рук и ног, разминочное кардио." },
];

export function getExerciseById(id) {
  return EXERCISES.find((e) => e.id === id) || null;
}
