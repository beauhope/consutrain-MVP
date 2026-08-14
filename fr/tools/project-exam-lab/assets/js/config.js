export const CONFIG = Object.freeze({
  appName: 'Simulateur professionnel de gestion de projet',
  dataUrl: './data/questions.json',
  storagePrefix: 'projectExamLab_fr_',
  fullExam: { count: 180, minutes: 240, breaksAfter: [60, 120] },
  mediumExam: { count: 60, minutes: 80, breaksAfter: [] },
  quickExam: { count: 30, minutes: 40, breaksAfter: [] },
  expectedQuestions: 500,
  historyLimit: 10,
  cacheVersion: 'v1'
});

export const LABELS = Object.freeze({
  single: 'Choix unique', multi: 'Choix multiple', order: 'Mise en ordre', matching: 'Association',
  full: 'Examen complet', medium: 'Examen intermédiaire', quick: 'Examen rapide',
  custom: 'Entraînement personnalisé', mistakes: 'Révision des erreurs'
});
