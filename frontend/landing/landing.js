// Smooth scroll ONLY for internal section links
document.querySelectorAll('.nav-center a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

const counters = document.querySelectorAll('.stat-item h3');

const animateCounters = () => {
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-count');
        let current = 0;
        const increment = target / 80;

        const update = () => {
            current += increment;
            if (current < target) {
                counter.innerText =
                    target > 1000
                        ? Math.floor(current).toLocaleString()
                        : current.toFixed(1);
                requestAnimationFrame(update);
            } else {
                counter.innerText =
                    target > 1000
                        ? target.toLocaleString() + "+"
                        : target;
            }
        };
        update();
    });
};

const observer = new IntersectionObserver(
    entries => {
        if (entries[0].isIntersecting) {
            animateCounters();
            observer.disconnect();
        }
    },
    { threshold: 0.4 }
);

observer.observe(document.querySelector('.stats-section'));
const cluster = document.querySelector('.health-cluster');

document.addEventListener('mousemove', (e) => {
    const x = (window.innerWidth / 2 - e.clientX) / 40;
    const y = (window.innerHeight / 2 - e.clientY) / 40;

    cluster.style.transform = `translate(${x}px, ${y}px)`;
});
const cards = document.querySelectorAll('.draggable');

cards.forEach(card => {
    let dragging = false;
    let startX = 0;
    let startY = 0;
    let x = 0;
    let y = 0;

    card.addEventListener('mousedown', e => {
        dragging = true;
        card.style.transition = 'none';
        startX = e.clientX - x;
        startY = e.clientY - y;
    });

    document.addEventListener('mousemove', e => {
        if (!dragging) return;
        x = e.clientX - startX;
        y = e.clientY - startY;
        card.style.transform = `translate(${x}px, ${y}px) scale(1.05)`;
    });

    document.addEventListener('mouseup', () => {
        if (!dragging) return;
        dragging = false;
        x = 0;
        y = 0;
        card.style.transition = 'transform 0.8s cubic-bezier(0.22,1,0.36,1)';
        card.style.transform = 'translate(0,0)';
    });
});
// About section scroll animation
const aboutCards = document.querySelectorAll('.about-card');

const aboutObserver = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.transform = 'translateY(0)';
                entry.target.style.opacity = '1';
            }
        });
    },
    { threshold: 0.2 }
);

aboutCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(40px)';
    aboutObserver.observe(card);
});
