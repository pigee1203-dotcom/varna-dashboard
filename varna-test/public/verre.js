const cards = [...document.querySelectorAll('.glass')];
const feedback = document.querySelector('#feedback');

function highlight(card) {
  cards.forEach(item => item.classList.toggle('is-lit', item === card));
  document.querySelectorAll('[data-focus]').forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.focus === card?.id));
  });
  feedback.textContent = card
    ? `${card.querySelector('h2').textContent} : lumière accentuée. Le portrait reste fixe dans cette étude.`
    : 'Sélectionnez une carte pour accentuer sa lumière.';
}

document.querySelectorAll('[data-focus]').forEach(button => {
  button.setAttribute('aria-pressed', 'false');
  button.addEventListener('click', () => {
    const card = document.getElementById(button.dataset.focus);
    highlight(card.classList.contains('is-lit') ? null : card);
  });
});
document.querySelector('#reset-light').addEventListener('click', () => highlight(null));
