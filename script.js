const navLinks = document.querySelectorAll('.nav-link-s');
const sections = document.querySelectorAll('.section-content');
const dropdown = document.getElementById('section-dropdown');

// Create an observer for mobile screens
function createObserver() {
    const options = {
        root: null, // viewport
        threshold: 0.5, // 50% of the section must be visible
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const currentSection = entry.target.getAttribute('id');

                // Update active class on nav links
                navLinks.forEach((link) => {
                    link.classList.remove('active');
                    if (link.getAttribute('href').slice(1) === currentSection) {
                        link.classList.add('active');
                    }
                });

                // Update dropdown for mobile view
                if (dropdown) {
                    dropdown.value = `#${currentSection}`;
                }
            }
        });
    }, options);

    // Observe each section
    sections.forEach((section) => observer.observe(section));
}

// Fallback for larger screens using scroll logic
function highlightSectionDesktop() {
    let currentSection = '';
    const viewportHeight = window.innerHeight; // Get viewport height
    const buffer = viewportHeight / 3; // Buffer for smoother activation

    sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        if (
            window.scrollY >= sectionTop - buffer &&
            window.scrollY < sectionTop + sectionHeight - buffer
        ) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === currentSection) {
            link.classList.add('active');
        }
    });

    if (dropdown) {
        dropdown.value = `#${currentSection}`;
    }

    if (!currentSection) {
        navLinks[0].classList.add('active');
    }
}

// Scroll to selected section on dropdown change
dropdown.addEventListener('change', (e) => {
    const targetSection = document.querySelector(e.target.value);
    if (targetSection) {
        const offset = window.innerWidth < 769 ? 50 : 100;

        const scrollPosition =
            window.scrollY + targetSection.getBoundingClientRect().top - offset;

        window.scrollTo({
            top: scrollPosition,
            behavior: 'smooth',
        });
    }
});

// Decide which logic to use based on screen size
function handleResize() {
    if (window.innerWidth < 767) {
        createObserver();
        window.removeEventListener('scroll', highlightSectionDesktop);
    } else {
        window.addEventListener('scroll', highlightSectionDesktop);
        highlightSectionDesktop(); // Run on load
    }
}

// Listen for resize events
window.addEventListener('resize', handleResize);
handleResize(); // Initialize logic based on current screen size
