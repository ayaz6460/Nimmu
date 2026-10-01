document.addEventListener('DOMContentLoaded', () => {
    const heroLines = document.querySelectorAll('.hero-title-line > span');
    let lineStartDelay = 0.5;
    heroLines.forEach(line => {
        const walker = document.createTreeWalker(line, NodeFilter.SHOW_TEXT);
        const textNodes = [];
        let lettersInLine = 0;
        while (walker.nextNode()) textNodes.push(walker.currentNode);
        textNodes.forEach(textNode => {
            const fragment = document.createDocumentFragment();
            (textNode.textContent.match(/\s+|\S+/g) || []).forEach(part => {
                if (/^\s+$/.test(part)) {
                    fragment.append(document.createTextNode(part));
                    return;
                }
                const word = document.createElement('span');
                word.className = 'hero-title-word';
                for (const character of part) {
                    const letter = document.createElement('span');
                    letter.className = 'hero-title-letter';
                    letter.textContent = character;
                    letter.style.setProperty('--letter-delay', `${lineStartDelay + lettersInLine * 0.058}s`);
                    lettersInLine += 1;
                    word.append(letter);
                }
                fragment.append(word);
            });
            textNode.replaceWith(fragment);
        });
        lineStartDelay += 0.5;
    });

    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    document.body.appendChild(progressBar);
    const updateProgress = () => {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        progressBar.style.transform = `scaleX(${scrollable > 0 ? window.scrollY / scrollable : 0})`;
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();

    if (window.matchMedia('(pointer: fine)').matches) {
        const spotlight = document.createElement('div');
        spotlight.className = 'pointer-spotlight';
        document.body.appendChild(spotlight);
        window.addEventListener('pointermove', event => {
            spotlight.style.transform = `translate(${event.clientX - 160}px, ${event.clientY - 160}px)`;
        }, { passive: true });
    }

    const header = document.querySelector('.header');
    const menuToggle = document.getElementById('menuToggle');
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    menuToggle?.addEventListener('click', () => {
        const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', String(!expanded));
        navbar?.classList.toggle('active', !expanded);
    });
    navLinks.forEach(link => link.addEventListener('click', () => {
        menuToggle?.setAttribute('aria-expanded', 'false');
        navbar?.classList.remove('active');
    }));
    window.addEventListener('scroll', () => header?.classList.toggle('scrolled', window.scrollY > 20), { passive: true });
    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px' });
    document.querySelectorAll('.scroll-reveal').forEach(element => revealObserver.observe(element));
    const roadmapItems = document.querySelectorAll('.timeline-item');
    const roadmapObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const timeline = entry.target.closest('.timeline');
            const items = Array.from(timeline.querySelectorAll('.timeline-item'));
            const activeIndex = items.indexOf(entry.target);
            timeline.style.setProperty('--roadmap-progress', `${((activeIndex + 1) / items.length) * 100}%`);
            items.forEach((item, index) => item.classList.toggle('roadmap-current', index === activeIndex));
        });
    }, { threshold: 0.1, rootMargin: '-42% 0px -42%' });
    roadmapItems.forEach(item => roadmapObserver.observe(item));
    const sections = document.querySelectorAll('main section[id]');
    const sectionObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
        });
    }, { rootMargin: '-35% 0px -55%' });
    sections.forEach(section => sectionObserver.observe(section));
});