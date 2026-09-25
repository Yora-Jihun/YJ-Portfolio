import './main.css';
import Alpine from 'alpinejs';
import { postSearch } from './generated/posts-search.js';
import { docsSearch } from './generated/docs-search.js';

// Documentation layout: tracks which section is being read so the sidebar can highlight it,
// and drives the collapsible section switcher on small screens.
Alpine.data('docsPage', () => ({
    active: 'introduction',
    navOpen: false,
    titles: {},
    sections: [],
    queued: false,
    // A section chosen by clicking a link. Short sections near the page bottom can't scroll up to the
    // reading line, so the choice is kept until the visitor scrolls by hand.
    pinned: null,

    get activeTitle() {
        return this.titles[this.active] ?? '';
    },

    init() {
        this.sections = [...this.$el.querySelectorAll('[data-doc-section]')];
        this.sections.forEach((section) => (this.titles[section.id] = section.dataset.title));

        const fromHash = location.hash.slice(1);
        if (this.sections.some((section) => section.id === fromHash)) this.pinned = fromHash;

        window.addEventListener('scroll', () => this.schedule(), { passive: true });
        window.addEventListener('resize', () => this.schedule(), { passive: true });
        ['wheel', 'touchmove', 'keydown'].forEach((type) =>
            window.addEventListener(type, () => (this.pinned = null), { passive: true }),
        );
        this.update();
    },

    select(id) {
        this.pinned = id;
        this.navOpen = false;
        this.active = id;
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

        if (this.pinned) {
            this.active = this.pinned;
            return;
        }

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
    { group: 'Page', title: 'Docs', hint: 'Beginner-friendly lessons, one recipe at a time', href: 'docs.html', suggested: true, keywords: 'lessons learn students tutorials' },
    { group: 'Page', title: 'Skills', hint: 'Fullstack, AI, electronics, 3D, design and more', href: 'skills.html', suggested: true },
    { group: 'Page', title: 'Experience', hint: 'A timeline from 2016 to 2026', href: 'experience.html', suggested: true, keywords: 'jobs career work history' },
    { group: 'Page', title: 'Blog', hint: 'Recent posts', href: 'blog.html', suggested: true },

    // Skills (Skills page)
    { group: 'Skill', title: "Fullstack Engineer", hint: "HTML, CSS, SCSS, JavaScript, Python", href: 'skills.html#fullstack', keywords: "html css scss javascript python php sql bash laravel sveltekit express.js tailwind css alpine.js blade templates node.js vite xampp herd git github vs code mysql firebase amazon s3 laravel cloud " },
    { group: 'Skill', title: "AI Chatbot Developer", hint: "Python, Node.js, Hugging Face, OpenAI API, Gemini API", href: 'skills.html#ai-chatbot', keywords: "python node.js hugging face openai api gemini api built conversational bots for support, learning, and task automation using nlp and ml apis." },
    { group: 'Skill', title: "Electronics & IoT", hint: "C++, ESP32, ESP8266, Arduino Uno R3, HC-SR04", href: 'skills.html#electronics-iot', keywords: "c++ esp32 esp8266 arduino uno r3 hc-sr04 servo motor driver lcd 320 x 240 lcd tft touch engineered smart systems and automated solutions using microcontrollers and edge ai." },
    { group: 'Skill', title: "Data Analytics", hint: "Google Sheets, SQL, Python, Google Colab", href: 'skills.html#data-analytics', keywords: "google sheets sql python google colab " },
    { group: 'Skill', title: "3D Artist", hint: "Blender, SOLIDWORKS, Fusion 360", href: 'skills.html#3d-artist', keywords: "blender solidworks fusion 360 " },
    { group: 'Skill', title: "Graphics and Design", hint: "Adobe, Corel, Figma", href: 'skills.html#graphics-design', keywords: "adobe corel figma " },
    { group: 'Skill', title: "Video Editing", hint: "CapCut", href: 'skills.html#video-editing', keywords: "capcut " },
    { group: 'Skill', title: "Desktop Software", hint: "Electron.js, Rust, Turing", href: 'skills.html#desktop-software', keywords: "electron.js rust turing " },
    { group: 'Skill', title: "Problem Solving", hint: "LeetCode", href: 'skills.html#problem-solving', keywords: "leetcode " },
    { group: 'Skill', title: "Productivity", hint: "Google Docs", href: 'skills.html#productivity', keywords: "google docs " },

    // Timeline (Experience page)
    { group: 'Timeline', title: "2016 – 2021", hint: "12 to 17 years old: 5 Years of Corporate Experience, Youngest Voluntary Employee, Multiple Gained Experience", href: 'experience.html#range2016', keywords: "5 years of corporate experience youngest voluntary employee multiple gained experience" },
    { group: 'Timeline', title: "2016", hint: "12 years old: Best in Social Studies, Early Bird Award, Bug Bounty Hunter for Games", href: 'experience.html#y2016', keywords: "best in social studies early bird award bug bounty hunter for games class president unanimous mandate" },
    { group: 'Timeline', title: "2017", hint: "13 years old: Joined Basketball Club, Junior High PBA All-Star League", href: 'experience.html#y2017', keywords: "joined basketball club junior high pba all-star league player of the game" },
    { group: 'Timeline', title: "2018", hint: "14 years old: Best in Computer literacy, Chosen for the Info Tech Award", href: 'experience.html#y2018', keywords: "best in computer literacy chosen for the info tech award" },
    { group: 'Timeline', title: "2019", hint: "15 years old: Cybersecurity Analyst, Crypto Trader, 3D Modeler", href: 'experience.html#y2019', keywords: "cybersecurity analyst helped protect victims from stolen accounts. crypto trader learned trading using cryptocurrency. 3d modeler built hard-surface 3d models pldt bug incident report during the experimentation, i accidentally bypassed the admin and immediately secured the system to ethically protect both sides. became a club president in computer club" },
    { group: 'Timeline', title: "2020", hint: "16 years old: Game Developer, Front-End Developer, UI/UX Designer", href: 'experience.html#y2020', keywords: "game developer built a simple game from scratch. front-end developer started my first web development career. ui/ux designer learned to design web systems and interfaces. junior system analyst contributed to an open-source project where my idea was compensated, and the earnings were invested into my personal project." },
    { group: 'Timeline', title: "2021", hint: "17 years old: Freelancer, Game Developer, Technical Writer", href: 'experience.html#y2021', keywords: "freelancer worked both locally and internationally. game developer continued improving game development. technical writer wrote documentation to support my projects. back-end developer learned apis and databases. dev support assisted in system development for a private company. junior high rank 1 student." },
    { group: 'Timeline', title: "2022", hint: "18 years old: System Architect, Social Media Developer, College Mentor", href: 'experience.html#y2022', keywords: "system architect created my own web-based os architecture. social media developer built my own social media platform from scratch. college mentor taught it students to develop their own systems before graduating high school, as a side hustle. youngest prodigy developer part of the philippines’ renowned it professional community." },
    { group: 'Timeline', title: "2023", hint: "19 years old: Psychology Student, Science Tech Competitor, AI Developer", href: 'experience.html#y2023', keywords: "psychology student studied human behavior to excel across fields. science tech competitor competed at the national science & technology fair (shs). ai developer developed an offline educational chatbot. lead developer led tech projects and built innovations in science and education. solo research competitor competed in a 3-hour solo research challenge and delivered results under pressure. batangas hackathon import selected as an elite participant in a competitive hackathon." },
    { group: 'Timeline', title: "2024", hint: "20 years old: Messenger Platform Creator, Science Tech Competitor, AI Developer", href: 'experience.html#y2024', keywords: "messenger platform creator created my own messaging app. science tech competitor returned to national science & technology fair. ai developer improved ai chatbot for offline education. hall of fame researcher our research set a benchmark and was chosen as research of the year. iot developer developed smart systems. robotics developer built intelligent robots. research platform developer built tools to help with research and collaboration. bsit worldwide admin & mentor became a mentor and admin for a global bsit community with over 1 million+ students." },
    { group: 'Timeline', title: "2024 · Part II · Senior High Edition", hint: "20 years old: Graduated with High Honors under the STEM strand., Hall of Fame Researcher, Best Speaker", href: 'experience.html#y2024b', keywords: "graduated with high honors under the stem strand. hall of fame researcher our research set a benchmark and was chosen as research of the year awarded best speaker recognized as best researcher honored as best presenter featured in the school newspaper inducted as research hall of famer graduated with high honors" },
    { group: 'Timeline', title: "2025", hint: "21 years old: First Formal International Work, Data Analyst Student, Data Science Student", href: 'experience.html#y2025', keywords: "first formal international work started professional journey as remote int. w. data analyst student diving into the world of data. data science student exploring ai and data-driven development. computer vision creator built my own ai-powered computer vision system. ai roboticist created my first robot with voice recognition software control artificial intelligence" },
    { group: 'Timeline', title: "2025 · Part II", hint: "21 years old: Passed, Completed, Promoted", href: 'experience.html#y2025b', keywords: "passed initial and final interview. completed training in administration and accounting. promoted head admin, contributed to multiple corporations by improving systems and reducing paperwork. government documentation experience managed papers for agencies such as sss, pag-ibig, and philhealth, while assisting clients in resolving issues through multitasking. banking support provided support for institutions like metrobank, psbank, and others. corporate support assisted with processes involving companies such as toyota and more. youngest member of the centralized internal officers recognized for early leadership and organizational impact. victory church reconnected with god and met kind, inspiring people; an amazing spiritual experience." },
    { group: 'Timeline', title: "2025 – 2026 · Part III", hint: "21 to 22 years old: Passed the Final Interview with the CEO and Vice President, Joined the IT Department, Lead System Engineer", href: 'experience.html#y2026', keywords: "passed the final interview with the ceo and vice president joined the it department contributed to system improvements and organizational efficiency. lead system engineer directed system development and successfully designed and implemented multiple full-stack corporate systems, built on php laravel and mysql as the core foundation. ai specialist contributed to the field of ai, enhancing productivity and workflow processes. chosen by the vice president presented the company profile to a toyota guest manager. invited to an ai event met the group of henry sy and john c. maxwell; a milestone experience connecting with highly intelligent founders at a young age. executive meetings invited to a project meeting at chinabank’s main building, where i collaborated with top executives." },

    // About sub-topics
    { group: 'Topic', title: 'Education highlights', hint: 'Junior High and Senior High milestones', href: '#about', keywords: 'school honors stem rank' },
    { group: 'Topic', title: 'Achievements & recognition', hint: 'Research, speaking and academic excellence', href: '#about', keywords: 'awards research grades scores' },

    // Lessons (generated from docs/*.md)
    ...docsSearch,

    // Blog posts (generated from posts/*.md)
    ...postSearch,


    // Projects
    { group: 'Project', title: 'Orbit Analytics', hint: 'Web App: real-time product usage dashboard', href: '#projects' },
    { group: 'Project', title: 'Northwind Market', hint: 'E-commerce: headless storefront', href: '#projects' },
    { group: 'Project', title: 'Pulseboard', hint: 'Web App: operations dashboard for logistics teams', href: '#projects' },
    { group: 'Project', title: 'Wanderlist', hint: 'Mobile App: collaborative trip planning', href: '#projects' },
    { group: 'Project', title: 'Atlas UI', hint: 'Design System: themeable component library', href: '#projects' },
    { group: 'Project', title: 'Ledgerly', hint: 'SaaS: invoicing and cash-flow forecasting', href: '#projects' },
    { group: 'Project', title: 'Relay', hint: 'API Platform: webhook infrastructure', href: '#projects', keywords: 'webhooks events' },
    { group: 'Project', title: 'Fieldnote', hint: 'Case Study: data capture for field teams', href: '#projects' },
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

// Experience overview: keeps the "age by year" table, the year range and the quick facts current.
// The written chapters end at `endYear`; later years are added to the table on their own,
// each pointing at the latest chapter, and the newest year is shown in bold.
Alpine.data('ageTimeline', ({ birthYear, startYear, endYear, lastId }) => ({
    year: new Date().getFullYear(),
    lastId,

    get currentYear() {
        return Math.max(this.year, endYear);
    },

    get extraRows() {
        const rows = [];
        for (let y = endYear + 1; y <= this.currentYear; y++) rows.push({ year: y, age: y - birthYear });
        return rows;
    },

    get years() {
        return this.currentYear - startYear;
    },

    get rangeLabel() {
        return `${startYear} – ${this.currentYear}`;
    },

    get spanLabel() {
        return this.years === 10 ? 'A decade' : `${this.years} years`;
    },

    get ageRange() {
        return `${startYear - birthYear} → ${this.currentYear - birthYear}`;
    },

    isNow(year) {
        return year === this.currentYear;
    },
}));

// Copy text to the clipboard. Falls back to execCommand where the async Clipboard API isn't available
// (e.g. pages opened from file://). Resolves to true when the text was copied.
async function copyText(text) {
    try {
        // Race against a timeout so a pending permission prompt can't leave a button stuck.
        await Promise.race([navigator.clipboard.writeText(text), new Promise((_, reject) => setTimeout(reject, 1500))]);
        return true;
    } catch {
        const field = document.createElement('textarea');
        field.value = text;
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
    }
}

// A copy button that briefly says "Copied!". `getText` returns what to copy.
const copier = (getText) => ({
    copied: false,
    timer: null,

    async copy() {
        if (!(await copyText(getText(this)))) return;

        this.copied = true;
        clearTimeout(this.timer);
        this.timer = setTimeout(() => (this.copied = false), 2000);
    },
});

// The contact email box.
Alpine.data('copyEmail', (email) => ({ email, ...copier((self) => self.email) }));

// The Copy button on code blocks in the lessons.
Alpine.data('copyCode', () => copier((self) => self.$root.querySelector('code').textContent));

window.Alpine = Alpine;

Alpine.start();

// Reveal [data-reveal] elements the first time they scroll into view (styles live in main.css).
const revealables = document.querySelectorAll('[data-reveal]');
if (revealables.length) {
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(
            (entries) =>
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }),
            { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
        );
        revealables.forEach((element) => observer.observe(element));
    } else {
        revealables.forEach((element) => element.classList.add('is-visible'));
    }
}
