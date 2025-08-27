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

    allItems.forEach((el, index) => {
        // Set perspective on parent
        gsap.set(el.parentNode, { perspective: 1200 });
        gsap.set(el, { transformOrigin: '50% 50%' });

        // Timeline for smoother 3D effect
        gsap.timeline({
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',   // Slightly higher to start earlier
                end: 'top 15%',     // Complete animation before leaving viewport
                scrub: true,
            }
        })
        .fromTo(el,
            {
                scale: 0.8,
                rotationY: index % 2 === 0 ? -25 : 25, // subtle Y rotation
                rotationX: 5,                           // small X rotation
                rotationZ: index % 2 === 0 ? -5 : 5,   // small Z rotation for 3D feel
                filter: 'brightness(2)'
            },
            {
                scale: 1,
                rotationY: 0,
                rotationX: 0,
                rotationZ: 0,
                filter: 'brightness(1)',
                ease: 'power2.out'
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
