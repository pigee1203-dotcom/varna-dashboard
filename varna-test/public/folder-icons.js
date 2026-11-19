// Banque locale d’icônes vectorielles : les règles précises passent en premier.
const car = '<path d="m5 10 2-5h10l2 5M4 10h16v8H4Zm3 8v2m10-2v2M7 14h1m8 0h1"/>';
const icons = {
  folder: ['Dossier', '<path d="M3 7V5h7l3 3h8v12H3Z"/>'],
  home: ['Maison', '<path d="m3 11 9-8 9 8M5 10v11h14V10M10 21v-7h4v7"/>'],
  car: ['Voiture', car],
  'car-insurance': ['Assurance auto', '<path d="M4 2h11l5 5v15H4ZM15 2v6h5"/><g transform="translate(4 9) scale(.65)">' + car + '</g>'],
  'home-insurance': ['Assurance habitation', '<path d="M12 2 3 6v6c0 5 9 10 9 10s9-5 9-10V6Z"/><path d="m7 12 5-4 5 4m-8-1v6h6v-6m-4 6v-3h2v3"/>'],
  insurance: ['Assurance', '<path d="M12 2 3 6v6c0 5 9 10 9 10s9-5 9-10V6Z"/><path d="m8 12 3 3 5-6"/>'],
  health: ['Santé', '<path d="M8 3h8v5h5v8h-5v5H8v-5H3V8h5Z"/>'],
  bank: ['Finances', '<path d="m3 8 9-5 9 5ZM3 21h18M6 11v6m6-6v6m6-6v6"/>'],
  work: ['Travail', '<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V3h8v4M3 12l9 4 9-4m-9 2v4"/>'],
  education: ['Études', '<path d="m2 9 10-5 10 5-10 5ZM6 11v6c4 3 8 3 12 0v-6m4-2v8"/>'],
  travel: ['Voyages', '<path d="m2 14 8-3V4c0-3 4-3 4 0v7l8 3v3l-8-2v5l3 2H7l3-2v-5l-8 2Z"/>'],
  family: ['Famille', '<circle cx="8" cy="7" r="3"/><circle cx="17" cy="8" r="2"/><path d="M2 21v-4a6 6 0 0 1 12 0v4m2-8a4 4 0 0 1 6 4v4"/>'],
  contract: ['Contrat', '<path d="M14 3H4v18h16V9M14 3v6h6M8 13h8m-8 4h5m2-14 5 5"/>'],
};

export function folderIconForName(name) {
  const words = String(name).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().split(/[^a-z0-9]+/);
  const has = (...terms) => words.some(word => terms.includes(word));
  const insurance = has('assurance', 'assurances', 'insurance');
  const auto = has('auto', 'autos', 'automobile', 'automobiles', 'voiture', 'voitures', 'vehicule', 'vehicules', 'car', 'cars');
  const home = has('maison', 'maisons', 'condo', 'condos', 'condominium', 'habitation', 'logement', 'immobilier', 'appartement', 'appartements', 'hypotheque', 'loyer', 'home');
  if (insurance && auto) return 'car-insurance';
  if (insurance && home) return 'home-insurance';
  if (auto) return 'car';
  if (home) return 'home';
  if (insurance) return 'insurance';
  if (has('sante', 'medical', 'medicaux', 'medecin', 'hopital', 'dentiste', 'pharmacie')) return 'health';
  if (has('banque', 'bancaire', 'bancaires', 'finances', 'budget', 'impot', 'impots', 'taxe', 'taxes', 'retraite')) return 'bank';
  if (has('travail', 'emploi', 'entreprise', 'salaire', 'professionnel')) return 'work';
  if (has('ecole', 'etude', 'etudes', 'universite', 'formation', 'diplome')) return 'education';
  if (has('voyage', 'voyages', 'vacances', 'passeport', 'vol', 'billet', 'billets')) return 'travel';
  if (has('famille', 'enfant', 'enfants', 'naissance', 'mariage')) return 'family';
  if (has('contrat', 'contrats', 'juridique', 'notaire', 'legal')) return 'contract';
  return 'folder';
}

export function createFolderIcon(name) {
  const key = folderIconForName(name);
  const [label, drawing] = icons[key];
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none'); svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-linecap', 'round'); svg.setAttribute('stroke-linejoin', 'round');
  svg.setAttribute('aria-hidden', 'true');
  svg.innerHTML = drawing;
  return { svg, label };
}
