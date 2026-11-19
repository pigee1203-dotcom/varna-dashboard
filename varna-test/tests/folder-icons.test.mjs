import test from 'node:test';
import assert from 'node:assert/strict';
import { folderIconForName } from '../public/folder-icons.js';

test('folder names select specific icons before generic contract and insurance icons', () => {
  for (const [name, expected] of [
    ['Documents condo', 'home'], ['CONTRAT AUTO', 'car'],
    ['Assurance automobile', 'car-insurance'], ['assurances-voitures', 'car-insurance'],
    ['Assurance habitation', 'home-insurance'], ['Assurances', 'insurance'],
    ['Dossier MÉDICAL', 'health'], ['Impôts 2026', 'bank'],
    ['Contrat de travail', 'work'], ['Études', 'education'],
    ['Vacances', 'travel'], ['Famille', 'family'], ['Contrat général', 'contract'],
    ['Automatisation', 'folder'], ['Autorisations', 'folder'], ['Divers', 'folder'], ['', 'folder'],
  ]) assert.equal(folderIconForName(name), expected, name);
});
