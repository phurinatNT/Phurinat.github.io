"use strict";

// Project categories: all cards stay visible when JavaScript is unavailable.
const filters = [...document.querySelectorAll('[data-filter]')];
const cards = [...document.querySelectorAll('[data-category]')];
const filterStatus = document.getElementById('filter-status');
document.querySelector('.project-filters').hidden = false;
filters.forEach(button => button.addEventListener('click', () => {
  const category = button.dataset.filter;
  cards.forEach(card => { card.hidden = category !== 'all' && card.dataset.category !== category; });
  filters.forEach(filter => {
    const selected = filter === button;
    filter.classList.toggle('active', selected);
    filter.setAttribute('aria-pressed', String(selected));
  });
  filterStatus.textContent = `แสดง ${cards.filter(card => !card.hidden).length} ผลงาน`;
}));

document.getElementById('year').textContent = new Date().getFullYear();
const gallery = document.getElementById('gallery');
const galleryImage = document.getElementById('gallery-image');
const caption = document.getElementById('gallery-caption');
const galleryCount = document.getElementById('gallery-count');
const galleryError = document.getElementById('gallery-error');
let galleryItems = [];
let imageIndex = 0;
let galleryTrigger = null;
function showImage(index) {
  imageIndex = (index + galleryItems.length) % galleryItems.length;
  const item = galleryItems[imageIndex];
  galleryError.hidden = true;
  galleryImage.hidden = false;
  galleryImage.src = item.dataset.image;
  galleryImage.alt = item.dataset.caption || '';
  caption.textContent = item.dataset.caption || '';
  galleryCount.textContent = `${imageIndex + 1} / ${galleryItems.length}`;
}
galleryImage.addEventListener('error', () => {
  galleryError.hidden = false;
  galleryImage.hidden = true;
});
document.querySelectorAll('[data-image]').forEach(button => {
  button.addEventListener('click', () => {
    // The project journal is its own ordered album; other images use their section.
    const album = button.closest('.project-story') || button.closest('section');
    galleryItems = [...album.querySelectorAll('[data-image]')].filter(item => !item.closest('[hidden]'));
    galleryTrigger = button;
    showImage(galleryItems.indexOf(button));
    if (!gallery.open) gallery.showModal();
    document.body.classList.add('modal-open');
  });
});
gallery.querySelector('.close-gallery').addEventListener('click', () => gallery.close());
gallery.querySelector('.gallery-prev').addEventListener('click', () => showImage(imageIndex - 1));
gallery.querySelector('.gallery-next').addEventListener('click', () => showImage(imageIndex + 1));
gallery.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    showImage(imageIndex + (event.key === 'ArrowRight' ? 1 : -1));
  }
});
gallery.addEventListener('click', event => {
  if (event.target !== gallery) return;
  const bounds = gallery.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) gallery.close();
});
gallery.addEventListener('close', () => {
  document.body.classList.remove('modal-open');
  galleryTrigger?.focus();
});
const links = [...document.querySelectorAll('nav a')];
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      links.forEach(link => {
        const active = link.hash === '#' + entry.target.id;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-15% 0px -60% 0px' });
  document.querySelectorAll('main section[id]').forEach(section => observer.observe(section));
}
