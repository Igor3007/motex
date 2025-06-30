export class ScrollNavigation {
    constructor(options) {
        this.navSelector = options.navSelector;
        this.sectionSelector = options.sectionSelector;
        this.activeClass = options.activeClass || 'active';
        this.offset = options.offset || 100;
        this.navLinks = null;
        this.sections = null;

        this.init();
    }

    init() {
        this.navLinks = document.querySelectorAll(`${this.navSelector} a`);
        this.sections = document.querySelectorAll(this.sectionSelector);

        if (this.navLinks.length && this.sections.length) {
            this.setupClickHandlers();
            this.setupScrollHandler();
            // Проверить активный раздел при загрузке
            this.checkActiveSection();
        }
    }

    setupClickHandlers() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);

                if (targetSection) {
                    window.scrollTo({
                        top: targetSection.offsetTop - this.offset,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    setupScrollHandler() {
        window.addEventListener('scroll', () => {
            this.checkActiveSection();
        });
    }

    checkActiveSection() {
        let current = '';
        const scrollPosition = window.pageYOffset;

        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (scrollPosition >= sectionTop - this.offset) {
                current = '#' + section.getAttribute('id');
            }
        });

        this.navLinks.forEach(link => {
            link.classList.remove(this.activeClass);
            if (link.getAttribute('href') === current) {
                link.classList.add(this.activeClass);
            }
        });
    }
}