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

    // Apply effect starting after first row
    allItems.forEach((el, index) => {
        if (index < columnsPerRow) return; // Skip first row

        gsap.set(el.parentNode, { perspective: 1000 });
        gsap.set(el, { transformOrigin: '50% 50%' }); // Center for rotation

        // Timeline for 3D rotation + scale
        gsap.timeline({
            scrollTrigger: {
                trigger: el,
                start: 'top 80%',
                end: 'bottom 20%',
                scrub: true
            }
        })
        .fromTo(el,
            {
                scale: 0,
                rotationY: index % 2 === 0 ? -70 : 70, // alternate rotations
                rotationX: 10,
                filter: 'brightness(3)'
            },
            {
                scale: 1,
                rotationY: 0,
                rotationX: 0,
                filter: 'brightness(1)',
                ease: 'none'
            }
        );
    });

    // Refresh ScrollTrigger on resize
    const refresh = () => {
        ScrollTrigger.clearScrollMemory();
        window.history.scrollRestoration = 'manual';
        ScrollTrigger.refresh(true);
    }

    refresh();
    window.addEventListener('resize', refresh);
});
