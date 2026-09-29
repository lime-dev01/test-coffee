document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');
  const openProductBtn = document.getElementById('openProductBtn');
  const closeProductBtn = document.getElementById('closeProductBtn');
  const filterChips = document.querySelectorAll('.filter-chip');

  // Fonction pour ouvrir la fiche produit
  function openProduct() {
    app.classList.add('product-open');
  }

  // Fonction pour fermer la fiche produit
  function closeProduct() {
    app.classList.remove('product-open');
  }

  // Événements d'ouverture et de fermeture
  if (openProductBtn) {
    openProductBtn.addEventListener('click', openProduct);
  }

  if (closeProductBtn) {
    closeProductBtn.addEventListener('click', closeProduct);
  }

  // Gestion des filtres de terroirs
  filterChips.forEach(chip => {
    chip.addEventListener('click', (e) => {
      filterChips.forEach(c => c.classList.remove('active'));
      e.target.classList.add('active');
    });
  });
});
