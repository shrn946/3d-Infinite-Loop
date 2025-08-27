gsap.registerPlugin(ScrollTrigger);

// Repeat first few items if needed
const repeatItems = (parentEl, total = 0) => {
    const items = [...parentEl.children];
    for (let i = 0; i < total; i++) {
        parentEl.appendChild(items[i].cloneNode(true));
    }
};

// Wait for images to load
imagesLoaded(document.querySelectorAll('.grid__item'), { background: true }, () => {
    document.body.classList.remove('loading');

    repeatItems(document.querySelector('.grid'), 3);

    const allItems = document.querySelectorAll('.grid__item');
    const columnsPerRow = 3; // Number of items in the first row

    allItems.forEach((el, index) => {
        if (index < columnsPerRow) return; // Skip first row

        // Set initial position
        gsap.set(el, {
            opacity: 0,
            y: 50,
            x: index % 2 === 0 ? -50 : 50 // alternate left/right
        });

        // Animate on scroll
        gsap.to(el, {
            opacity: 1,
            y: 0,
            x: 0,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: el,
                start: 'top 80%',
                end: 'bottom 20%',
                scrub: false
            }
        });
    });

    // Refresh ScrollTrigger on resize
    const refresh = () => {
        ScrollTrigger.clearScrollMemory();
        window.history.scrollRestoration = 'manual';
        ScrollTrigger.refresh(true);
    };

    refresh();
    window.addEventListener('resize', refresh);
});
