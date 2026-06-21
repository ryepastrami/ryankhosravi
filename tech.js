const projects = document.querySelector('.tech-projects');
const viewButtons = document.querySelectorAll('[data-view]');

viewButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const view = button.dataset.view;
    projects.className = `tech-projects ${view}-view`;
    viewButtons.forEach((item) => {
      const selected = item === button;
      item.classList.toggle('selected', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
  });
});
