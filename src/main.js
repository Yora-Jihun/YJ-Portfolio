import './main.css';
import Alpine from 'alpinejs';

// Documentation layout: tracks which section is being read so the sidebar can highlight it,
// and drives the collapsible section switcher on small screens.
Alpine.data('docsPage', () => ({
    active: 'introduction',
    navOpen: false,
    titles: {},
    sections: [],
    queued: false,

    get activeTitle() {
        return this.titles[this.active] ?? '';
    },

    init() {
        this.sections = [...this.$el.querySelectorAll('[data-doc-section]')];
        this.sections.forEach((section) => (this.titles[section.id] = section.dataset.title));

        window.addEventListener('scroll', () => this.schedule(), { passive: true });
        window.addEventListener('resize', () => this.schedule(), { passive: true });
        this.update();
    },

    // Coalesce scroll/resize bursts into one update per frame.
    schedule() {
        if (this.queued) return;
        this.queued = true;
        requestAnimationFrame(() => {
            this.queued = false;
            this.update();
        });
    },

    update() {
        if (!this.sections.length) return;

        // The current section is the last one whose top has passed the reading line.
        const line = window.innerHeight * 0.25;
        let current = this.sections[0].id;
        this.sections.forEach((section) => {
            if (section.getBoundingClientRect().top <= line) current = section.id;
        });

        // Short final sections may never reach the reading line, so pin the last one at page bottom.
        const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
        if (atBottom) current = this.sections[this.sections.length - 1].id;

        this.active = current;
    },
}));

// Quick-jump search (Ctrl/⌘+K or the navbar icon). Static and client-side: the list below is
// the whole index, so add an entry here whenever new content is added to the site.
// `href` values starting with "#" are sections of the home page; anything else is used as written.
const searchIndex = [
    // Home page sections
    { group: 'Section', title: 'Introduction', hint: 'Who I am', href: '#introduction', suggested: true },
    { group: 'Section', title: 'About me', hint: 'Profile, education and achievements', href: '#about', suggested: true, keywords: 'profile education achievements recognition grades languages portrait' },
    { group: 'Section', title: 'Projects', hint: 'A selection of recent work', href: '#projects', suggested: true, keywords: 'work portfolio' },
    { group: 'Section', title: 'Guides', hint: 'Write-ups on things I have built and learned', href: '#guides', suggested: true, keywords: 'articles posts tutorials' },
    { group: 'Section', title: 'Contact', hint: 'Email me or copy my address', href: '#contact', suggested: true, keywords: 'email hire reach message' },

    // Pages
    { group: 'Page', title: 'Docs', hint: 'Lessons for students — coming soon', href: 'docs.html', suggested: true, keywords: 'lessons learn students tutorials' },
    { group: 'Page', title: 'Skills', hint: 'Tools and technologies at a glance', href: 'skills.html', suggested: true },
    { group: 'Page', title: 'Experience', hint: 'A timeline from 2016 to 2026', href: 'experience.html', suggested: true, keywords: 'jobs career work history' },
    { group: 'Page', title: 'Blog', hint: 'Recent posts', href: 'blog.html', suggested: true },

    // Timeline (Experience page)
    { group: 'Timeline', title: "2016 – 2021", hint: "13-Year-Old — 5 Years of Corporate Experience, Youngest Voluntary Employee, Junior High PBA All-Star League", href: 'experience.html#y2016', keywords: "5 years of corporate experience youngest voluntary employee junior high pba all-star league player of the game best in social studies best in computer literacy chosen for the info tech award early bird award bug bounty hunter for games" },
    { group: 'Timeline', title: "2019", hint: "15-Year-Old — Cybersecurity Analyst, Crypto Trader, 3D Modeler", href: 'experience.html#y2019', keywords: "cybersecurity analyst helped protect victims from stolen accounts. crypto trader learned trading using cryptocurrency. 3d modeler built hard-surface 3d models pldt bug incident report during the experimentation, i accidentally bypassed the admin and immediately secured the system to ethically protect both sides." },
    { group: 'Timeline', title: "2020", hint: "16-Year-Old — Game Developer, Front-End Developer, UI/UX Designer", href: 'experience.html#y2020', keywords: "game developer built a simple game from scratch. front-end developer started my first web development career. ui/ux designer learned to design web systems and interfaces. junior system analyst contributed to an open-source project where my idea was compensated, and the earnings were invested into my personal project." },
    { group: 'Timeline', title: "2021", hint: "17-Year-Old — Freelancer, Game Developer, Technical Writer", href: 'experience.html#y2021', keywords: "freelancer worked both locally and internationally. game developer continued improving game development. technical writer wrote documentation to support my projects. back-end developer learned apis and databases. dev support assisted in system development for a private company. junior high rank 1 student." },
    { group: 'Timeline', title: "2022", hint: "18-Year-Old — System Architect, Social Media Developer, College Mentor", href: 'experience.html#y2022', keywords: "system architect created my own web-based os architecture. social media developer built my own social media platform from scratch. college mentor taught it students to develop their own systems before graduating high school, as a side hustle. youngest prodigy developer part of the philippines’ renowned it professional community." },
    { group: 'Timeline', title: "2023", hint: "19-Year-Old — Psychology Student, Science Tech Competitor, AI Developer", href: 'experience.html#y2023', keywords: "psychology student studied human behavior to excel across fields. science tech competitor competed at the national science & technology fair (shs). ai developer developed an offline educational chatbot. lead developer led tech projects and built innovations in science and education. solo research competitor competed in a 3-hour solo research challenge and delivered results under pressure. batangas hackathon import selected as an elite participant in a competitive hackathon." },
    { group: 'Timeline', title: "2024", hint: "20-Year-Old — Messenger Platform Creator, Science Tech Competitor, AI Developer", href: 'experience.html#y2024', keywords: "messenger platform creator created my own messaging app. science tech competitor returned to national science & technology fair. ai developer improved ai chatbot for offline education. hall of fame researcher our research set a benchmark and was chosen as research of the year. iot developer developed smart systems. robotics developer built intelligent robots. research platform developer built tools to help with research and collaboration. bsit worldwide admin & mentor became a mentor and admin for a global bsit community with over 1 million+ students." },
    { group: 'Timeline', title: "2024 · Part II · Senior High Edition", hint: "20-Year-Old — Graduated with High Honors under the STEM strand., Hall of Fame Researcher, Best Speaker", href: 'experience.html#y2024b', keywords: "graduated with high honors under the stem strand. hall of fame researcher our research set a benchmark and was chosen as research of the year awarded best speaker recognized as best researcher honored as best presenter featured in the school newspaper inducted as research hall of famer graduated with high honors" },
    { group: 'Timeline', title: "2025", hint: "21-Year-Old — First Formal International Work, Data Analyst Student, Data Science Student", href: 'experience.html#y2025', keywords: "first formal international work started professional journey as remote int. w. data analyst student diving into the world of data. data science student exploring ai and data-driven development. computer vision creator built my own ai-powered computer vision system. ai roboticist created my first robot with: voice recognition software control artificial intelligence" },
    { group: 'Timeline', title: "2025 · Part II", hint: "21-Year-Old — Passed, Completed, Promoted", href: 'experience.html#y2025b', keywords: "passed initial and final interview. completed training in administration and accounting. promoted head admin, contributed to multiple corporations by improving systems and reducing paperwork. government documentation experience managed papers for agencies such as sss, pag-ibig, and philhealth, while assisting clients in resolving issues through multitasking. banking support provided support for institutions like metrobank, psbank, and others. corporate support assisted with processes involving companies such as toyota and more. youngest member of the centralized internal officers recognized for early leadership and organizational impact. victory church reconnected with god and met kind, inspiring people; an amazing spiritual experience." },
    { group: 'Timeline', title: "2025 – 2026 · Part III", hint: "21-Year-Old — Passed the Final Interview with the CEO and Vice President, Joined the IT Department, Lead System Engineer", href: 'experience.html#y2026', keywords: "passed the final interview with the ceo and vice president joined the it department contributed to system improvements and organizational efficiency. lead system engineer directed system development and successfully designed and implemented multiple full-stack corporate systems, built on php laravel and mysql as the core foundation. ai specialist contributed to the field of ai, enhancing productivity and workflow processes. chosen by the vice president presented the company profile to a toyota guest manager. invited to an ai event met the group of henry sy and john c. maxwell; a milestone experience connecting with highly intelligent founders at a young age. executive meetings invited to a project meeting at chinabank’s main building, where i collaborated with top executives." },

    // Docs topics and lessons (lessons are not written yet)
    { group: 'Docs', title: 'Frontend', hint: 'Alpine.js, Tailwind CSS, JavaScript', href: 'docs.html#frontend' },
    { group: 'Docs', title: 'Backend', hint: 'Laravel, Livewire, MySQL, REST APIs', href: 'docs.html#backend' },
    { group: 'Docs', title: 'Design', hint: 'Figma and interface design', href: 'docs.html#design' },
    { group: 'Lesson', title: 'Alpine.js', hint: "Coming soon — a small JavaScript framework for adding behavior in your HTML.", href: 'docs.html#frontend' },
    { group: 'Lesson', title: 'Tailwind CSS', hint: "Coming soon — a utility-first CSS framework.", href: 'docs.html#frontend', keywords: 'css styling' },
    { group: 'Lesson', title: 'JavaScript', hint: "Coming soon — the language of the browser.", href: 'docs.html#frontend', keywords: 'js' },
    { group: 'Lesson', title: 'Laravel', hint: "Coming soon — a PHP framework for web backends.", href: 'docs.html#backend', keywords: 'php framework' },
    { group: 'Lesson', title: 'Livewire', hint: "Coming soon — dynamic interfaces in Laravel with PHP components.", href: 'docs.html#backend', keywords: 'php laravel' },
    { group: 'Lesson', title: 'MySQL', hint: "Coming soon — a relational database queried with SQL.", href: 'docs.html#backend', keywords: 'database sql' },
    { group: 'Lesson', title: 'REST APIs', hint: "Coming soon — exposing data over HTTP.", href: 'docs.html#backend', keywords: 'api http json' },
    { group: 'Lesson', title: 'Figma', hint: "Coming soon — collaborative interface design.", href: 'docs.html#design', keywords: 'ui ux prototype wireframe' },

    // About sub-topics
    { group: 'Topic', title: 'Education highlights', hint: 'Junior High and Senior High milestones', href: '#about', keywords: 'school honors stem rank' },
    { group: 'Topic', title: 'Achievements & recognition', hint: 'Research, speaking and academic excellence', href: '#about', keywords: 'awards research grades scores' },

    // Guides
    { group: 'Guide', title: 'How to learn fast', hint: 'Habits for shrinking the gap between trying and knowing', href: 'how-to-learn-fast.html', keywords: 'learning study habits practice feedback loop spaced repetition projects focus students' },
    { group: 'Guide', title: 'Building a peek carousel with Alpine.js', hint: 'Scroll-snap, intersection observers and small details', href: 'blog.html', keywords: 'carousel alpine scroll' },
    { group: 'Guide', title: 'A simpler approach to Tailwind theming', hint: 'CSS variables and Tailwind v4 tokens', href: 'blog.html', keywords: 'tailwind theme dark mode design system' },
    { group: 'Guide', title: 'What I learned shipping Livewire at scale', hint: 'Component boundaries and payload size', href: 'blog.html', keywords: 'livewire laravel scale' },

    // Projects
    { group: 'Project', title: 'Orbit Analytics', hint: 'Web App — real-time product usage dashboard', href: '#projects' },
    { group: 'Project', title: 'Northwind Market', hint: 'E-commerce — headless storefront', href: '#projects' },
    { group: 'Project', title: 'Pulseboard', hint: 'Web App — operations dashboard for logistics teams', href: '#projects' },
    { group: 'Project', title: 'Wanderlist', hint: 'Mobile App — collaborative trip planning', href: '#projects' },
    { group: 'Project', title: 'Atlas UI', hint: 'Design System — themeable component library', href: '#projects' },
    { group: 'Project', title: 'Ledgerly', hint: 'SaaS — invoicing and cash-flow forecasting', href: '#projects' },
    { group: 'Project', title: 'Relay', hint: 'API Platform — webhook infrastructure', href: '#projects', keywords: 'webhooks events' },
    { group: 'Project', title: 'Fieldnote', hint: 'Case Study — data capture for field teams', href: '#projects' },
];

Alpine.data('siteSearch', () => ({
    isOpen: false,
    query: '',
    index: 0,
    trigger: null,
    onHome: false,

    init() {
        // "#…" links are sections of the home page, so they need a page prefix everywhere else.
        this.onHome = !!document.querySelector('[data-page="home"]');
        this.$watch('isOpen', (open) => document.body.classList.toggle('overflow-hidden', open));
        this.$watch('query', () => (this.index = 0));
        this.$watch('index', () => this.$nextTick(() => this.revealActive()));
    },

    get results() {
        const q = this.query.trim().toLowerCase();
        if (!q) return searchIndex.filter((item) => item.suggested);

        const words = q.split(/\s+/);
        return searchIndex
            .map((item) => {
                const title = item.title.toLowerCase();
                const haystack = `${title} ${item.group.toLowerCase()} ${item.hint.toLowerCase()} ${item.keywords ?? ''}`;
                if (!words.every((word) => haystack.includes(word))) return null;

                // Title matches outrank matches that are only in the description or keywords.
                const score = title.startsWith(q) ? 3 : title.includes(q) ? 2 : 0;
                return { item, score };
            })
            .filter(Boolean)
            .sort((a, b) => b.score - a.score)
            .map(({ item }) => item)
            .slice(0, 10);
    },

    href(item) {
        return item.href.startsWith('#') && !this.onHome ? `index.html${item.href}` : item.href;
    },

    open() {
        this.trigger = document.activeElement;
        this.query = '';
        this.index = 0;
        this.isOpen = true;
        this.$nextTick(() => this.$refs.input.focus());
    },

    close() {
        this.isOpen = false;
        this.trigger?.focus?.();
    },

    move(step) {
        const count = this.results.length;
        if (count) this.index = (this.index + step + count) % count;
    },

    go(item = this.results[this.index]) {
        if (!item) return;
        this.close();
        window.location.href = this.href(item);
    },

    revealActive() {
        this.$refs.list?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' });
    },
}));

// Copy-to-clipboard for the contact email. Falls back to execCommand where the
// async Clipboard API isn't available (e.g. pages opened from file://).
Alpine.data('copyEmail', (email) => ({
    email,
    copied: false,
    timer: null,

    async copy() {
        let ok = false;

        try {
            // Race against a timeout so a pending permission prompt can't leave the button stuck.
            await Promise.race([
                navigator.clipboard.writeText(this.email),
                new Promise((_, reject) => setTimeout(reject, 1500)),
            ]);
            ok = true;
        } catch {
            ok = this.legacyCopy();
        }

        if (!ok) return;

        this.copied = true;
        clearTimeout(this.timer);
        this.timer = setTimeout(() => (this.copied = false), 2000);
    },

    legacyCopy() {
        const field = document.createElement('textarea');
        field.value = this.email;
        field.setAttribute('readonly', '');
        field.style.position = 'fixed';
        field.style.opacity = '0';
        document.body.appendChild(field);
        field.select();

        try {
            return document.execCommand('copy');
        } catch {
            return false;
        } finally {
            field.remove();
        }
    },
}));

window.Alpine = Alpine;

Alpine.start();
