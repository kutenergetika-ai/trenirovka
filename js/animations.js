// Оригинальные линейные анимации-пиктограммы (SVG + SMIL), своего рисования.
// Каждый "архетип" условно изображает тип движения упражнения.
// Цвет берётся из CSS currentColor — обёртка задаёт color: var(--cat-color).

const EASE = "0.42 0 0.58 1";

function svgWrap(inner) {
  return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${inner}</svg>`;
}

const HEAD = `<circle cx="50" cy="16" r="8" fill="currentColor"/>`;

function poly(points) {
  return `<polyline points="${points}" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`;
}

function animPoly(poses, dur = 1.4, beginOffset = 0) {
  const values = poses.join(";");
  const keySplines = poses.slice(1).map(() => EASE).join(";");
  const begin = beginOffset ? ` begin="${beginOffset}s"` : "";
  return `<polyline points="${poses[0]}" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"><animate attributeName="points" values="${values}" dur="${dur}s" repeatCount="indefinite" calcMode="spline" keySplines="${keySplines}"${begin}/></polyline>`;
}

function animateTransform(type, values, dur) {
  const n = values.split(";").length - 1;
  const keySplines = Array.from({ length: n }, () => EASE).join(";");
  return `<animateTransform attributeName="transform" type="${type}" values="${values}" dur="${dur}s" repeatCount="indefinite" calcMode="spline" keySplines="${keySplines}"/>`;
}

const SPINE = poly("50,23 50,58");
const ARM_L_NEUTRAL = poly("43,25 41,41 40,55");
const ARM_R_NEUTRAL = poly("57,25 59,41 60,55");
const LEG_L_NEUTRAL = poly("45,58 44,78 43,96");
const LEG_R_NEUTRAL = poly("55,58 56,78 57,96");

const ARCHETYPES = {
  press() {
    const armL = animPoly(["43,25 35,33 38,24", "43,25 38,15 40,2", "43,25 35,33 38,24"], 1.3);
    const armR = animPoly(["57,25 65,33 62,24", "57,25 62,15 60,2", "57,25 65,33 62,24"], 1.3);
    return svgWrap(`${HEAD}${SPINE}${armL}${armR}${LEG_L_NEUTRAL}${LEG_R_NEUTRAL}`);
  },

  pull() {
    const armL = animPoly(["43,25 25,30 10,32", "43,25 38,35 42,45", "43,25 25,30 10,32"], 1.5);
    const armR = animPoly(["57,25 75,30 90,32", "57,25 62,35 58,45", "57,25 75,30 90,32"], 1.5);
    return svgWrap(`${HEAD}${SPINE}${armL}${armR}${LEG_L_NEUTRAL}${LEG_R_NEUTRAL}`);
  },

  elbow() {
    const armL = animPoly(["43,25 40,40 38,55", "43,25 40,40 48,28", "43,25 40,40 38,55"], 1.1);
    const armR = animPoly(["57,25 60,40 62,55", "57,25 60,40 52,28", "57,25 60,40 62,55"], 1.1);
    return svgWrap(`${HEAD}${SPINE}${armL}${armR}${LEG_L_NEUTRAL}${LEG_R_NEUTRAL}`);
  },

  raise() {
    const armL = animPoly(["43,25 41,41 40,55", "43,25 25,25 10,24", "43,25 41,41 40,55"], 1.4);
    const armR = animPoly(["57,25 59,41 60,55", "57,25 75,25 90,24", "57,25 59,41 60,55"], 1.4);
    return svgWrap(`${HEAD}${SPINE}${armL}${armR}${LEG_L_NEUTRAL}${LEG_R_NEUTRAL}`);
  },

  squat() {
    const upperBody = `<g>${animateTransform("translate", "0,0;0,10;0,0", 1.5)}${HEAD}${SPINE}${ARM_L_NEUTRAL}${ARM_R_NEUTRAL}</g>`;
    const legL = animPoly(["45,58 44,78 43,96", "45,68 38,82 43,96", "45,58 44,78 43,96"], 1.5);
    const legR = animPoly(["55,58 56,78 57,96", "55,68 62,82 57,96", "55,58 56,78 57,96"], 1.5);
    return svgWrap(`${upperBody}${legL}${legR}`);
  },

  hinge() {
    const upperBody = `<g>${animateTransform("rotate", "0 50 58;-35 50 58;0 50 58", 1.6)}${HEAD}${SPINE}${ARM_L_NEUTRAL}${ARM_R_NEUTRAL}</g>`;
    return svgWrap(`${upperBody}${LEG_L_NEUTRAL}${LEG_R_NEUTRAL}`);
  },

  lunge() {
    const legL = animPoly(["45,58 44,78 43,96", "45,58 38,74 30,96", "45,58 44,78 43,96"], 1.6);
    const legR = animPoly(["55,58 56,78 57,96", "55,58 62,82 70,98", "55,58 56,78 57,96"], 1.6);
    return svgWrap(`${HEAD}${SPINE}${ARM_L_NEUTRAL}${ARM_R_NEUTRAL}${legL}${legR}`);
  },

  pushup() {
    const armL = animPoly(["43,25 35,30 30,22", "43,25 38,15 36,5", "43,25 35,30 30,22"], 1.2);
    const armR = animPoly(["57,25 65,30 70,22", "57,25 62,15 64,5", "57,25 65,30 70,22"], 1.2);
    const group = `<g>${animateTransform("translate", "0,0;0,6;0,0", 1.2)}${HEAD}${SPINE}${armL}${armR}${LEG_L_NEUTRAL}${LEG_R_NEUTRAL}</g>`;
    return svgWrap(group);
  },

  core_hold() {
    const group = `<g>${animateTransform("translate", "0,0;0,-2;0,0", 2.2)}${HEAD}${SPINE}${ARM_L_NEUTRAL}${ARM_R_NEUTRAL}${LEG_L_NEUTRAL}${LEG_R_NEUTRAL}</g>`;
    return svgWrap(group);
  },

  core_move() {
    const group = `<g>${animateTransform("rotate", "0 50 58;-14 50 58;0 50 58", 1.4)}${HEAD}${SPINE}${ARM_L_NEUTRAL}${ARM_R_NEUTRAL}${LEG_L_NEUTRAL}${LEG_R_NEUTRAL}</g>`;
    return svgWrap(group);
  },

  cardio() {
    const armL = animPoly(["43,25 30,35 20,30", "43,25 55,20 65,10", "43,25 30,35 20,30"], 0.9);
    const armR = animPoly(["57,25 70,20 80,10", "57,25 45,35 35,30", "57,25 70,20 80,10"], 0.9, -0.45);
    const legL = animPoly(["45,58 50,75 60,94", "45,58 40,78 32,96", "45,58 50,75 60,94"], 0.9);
    const legR = animPoly(["55,58 50,78 40,96", "55,58 60,75 72,94", "55,58 50,78 40,96"], 0.9, -0.45);
    const group = `<g>${animateTransform("translate", "0,0;0,-8;0,0", 0.9)}${HEAD}${SPINE}${armL}${armR}${legL}${legR}</g>`;
    return svgWrap(group);
  },
};

export function stickFigureMarkup(archetype) {
  const builder = ARCHETYPES[archetype] || ARCHETYPES.press;
  return builder();
}
