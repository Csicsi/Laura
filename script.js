const yearElement = document.getElementById('year');
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

const revealElements = Array.from(reveals);
revealElements.forEach((element) => observer.observe(element));

const reservationForm = document.getElementById('reservation-form');
const formStatus = document.getElementById('form-status');

if (reservationForm && formStatus) {
  const setStatus = (message, isError = false) => {
    formStatus.textContent = message;
    formStatus.style.color = isError ? '#8a6248' : '#2d6b4f';
  };

  reservationForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(reservationForm);
    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const message = String(formData.get('message') || '').trim();

    if (!name || !email || !message) {
      setStatus('Kérjük, töltsd ki az összes mezőt.', true);
      return;
    }

    setStatus('A foglalási e-mail funkció jelenleg ideiglenesen kikapcsolva. Hamarosan újra elérhető.');
    reservationForm.reset();
  });
}
