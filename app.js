// Données globales des 10 piliers (Structure dynamique)
const pillarsData = [
  { id: 1, num: "Pilier 1", title: "Spirit & Eloquence", advice: "Discipline spirituelle et pratique de l'art oratoire." },
  { id: 2, num: "Pilier 2", title: "Sport & Poids", advice: "Entraînement A/B ou cardio. Respecte ta forme physique du jour." },
  { id: 3, num: "Pilier 3", title: "Chimie & Métallurgie (KTC)", advice: "Focus sur les bilans massiques, AAS/ICP et le terrain KTC." },
  { id: 4, num: "Pilier 4", title: "Finance & Business", advice: "Gestion d'argent, intérêts composés et stratégie d'investisseur." },
  { id: 5, num: "Pilier 5", title: "Anglais (US & IELTS)", advice: "Grammaire, prononciation américaine et vocabulaire technique." },
  { id: 6, num: "Pilier 6", title: "Excel & Python", advice: "Maîtrise des tableurs, formules, automatisation et Pandas." },
  { id: 7, num: "Pilier 7", title: "Métier Sampleur", advice: "Application de la théorie de Pierre Gy et rigueur d'échantillonnage." },
  { id: 8, num: "Pilier 8", title: "Projets & Entreprise", advice: "Coordination du projet Galette (église) et savonnerie / biscuits." },
  { id: 9, num: "Pilier 9", title: "Lecture (10-15 p.)", advice: "Atomic Habits ou littérature business. Une idée forte à retenir." },
  { id: 10, num: "Pilier 10", title: "Journaling & Détente", advice: "Bilan rapide de ta journée + ton droit au Scroll sans culpabilité." }
];

// Initialisation de l'application au chargement
document.addEventListener("DOMContentLoaded", () => {
  initDaysSelect();
  renderPillars();
  setupEventListeners();
  updateProgress();
});

// Remplir le menu déroulant des 30 jours du défi
function initDaysSelect() {
  const select = document.getElementById("day-select");
  for (let i = 1; i <= 30; i++) {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = `Jour ${i} / 30`;
    select.appendChild(opt);
  }
}

// Afficher la grille des 10 piliers
function renderPillars() {
  const grid = document.getElementById("pillars-grid");
  grid.innerHTML = "";

  pillarsData.forEach(p => {
    const isDone = localStorage.getItem(`pillar_${p.id}_day_${getSelectedDay()}`) === "true";
    
    const card = document.createElement("div");
    card.className = `pillar-card ${isDone ? "done" : ""}`;
    card.innerHTML = `
      <div>
        <div class="pillar-num">${p.num}</div>
        <div class="pillar-title">${p.title}</div>
      </div>
      <div class="pillar-status">${isDone ? "✅ Fait" : "À faire"}</div>
    `;
    card.addEventListener("click", () => openPillarModal(p));
    grid.appendChild(card);
  });
}

// Récupérer le jour sélectionné
function getSelectedDay() {
  return document.getElementById("day-select").value;
}

// Récupérer le shift sélectionné
function getSelectedShift() {
  return document.getElementById("shift-select").value;
}

// Ouvrir la modale pour un pilier spécifique
function openPillarModal(pillar) {
  const modal = document.getElementById("pillar-modal");
  document.getElementById("modal-title").textContent = `${pillar.num} : ${pillar.title}`;
  
  // Conseils adaptés au shift
  const shift = getSelectedShift();
  let shiftText = pillar.advice;
  if (shift === "day") shiftText += " ☀️ [Mode Day Shift : Version allégée / coordination rapide en pause].";
  else if (shift === "night") shiftText += " 🌙 [Mode Night Shift : Session placée l'après-midi au réveil].";
  else shiftText += " 🔋 [Mode Rest Shift : Jour idéal pour approfondir et avancer en profondeur].";
  
  document.getElementById("modal-shift-advice").textContent = shiftText;
  document.getElementById("modal-body").innerHTML = `<p>Objectif du jour pour le <strong>Jour ${getSelectedDay()}</strong> : Avancer avec rigueur et discipline.</p>`;
  
  // Gestion affichage Journaling pour le pilier 10
  const journalBox = document.getElementById("journal-box");
  const journalInput = document.getElementById("journal-input");
  if (pillar.id === 10) {
    journalBox.classList.remove("hidden");
    journalInput.value = localStorage.getItem(`journal_day_${getSelectedDay()}`) || "";
  } else {
    journalBox.classList.add("hidden");
  }

  modal.classList.remove("hidden");
  
  // Bouton valider
  const btnComplete = document.getElementById("btn-complete");
  btnComplete.onclick = () => {
    localStorage.setItem(`pillar_${pillar.id}_day_${getSelectedDay()}`, "true");
    if (pillar.id === 10) {
      localStorage.setItem(`journal_day_${getSelectedDay()}`, journalInput.value);
    }
    modal.classList.add("hidden");
    renderPillars();
    updateProgress();
  };
}

// Écouteurs d'événements divers
function setupEventListeners() {
  document.getElementById("close-modal").addEventListener("click", () => {
    document.getElementById("pillar-modal").classList.add("hidden");
  });

  document.getElementById("day-select").addEventListener("change", renderPillars);
  document.getElementById("shift-select").addEventListener("change", renderPillars);

  // Bouton détente / scroll
  document.getElementById("btn-chill").addEventListener("click", () => {
    alert("🧘‍♂️ Mode Détente activé ! Profite de 20 minutes de scroll libre sans culpabilité pour souffler.");
  });
}

// Calcul de la progression globale du jour
function updateProgress() {
  let completed = 0;
  const day = getSelectedDay();
  pillarsData.forEach(p => {
    if (localStorage.getItem(`pillar_${p.id}_day_${day}`) === "true") completed++;
  });
  const percent = Math.round((completed / pillarsData.length) * 100);
  document.getElementById("global-progress").textContent = `${percent}%`;
}
