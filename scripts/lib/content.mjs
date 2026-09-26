// Shared by scripts/build-blog.mjs and scripts/build-docs.mjs:
// front matter, markdown -> blocks, and the HTML for each kind of block.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

// ---- Small helpers ----------------------------------------------------------------------------------------------------
export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
export const attr = (s) => esc(s).replace(/"/g, '&quot;');
export const slugify = (s) => s.toLowerCase().replace(/&[a-z]+;/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export const read = (p) => fs.readFileSync(p, 'utf8');

const codeClass = 'rounded-md bg-surface px-1.5 py-0.5 font-mono text-[0.9em] text-ink ring-1 ring-border dark:text-white';
export const inline = (md) => marked.parseInline(md).replace(/<code>/g, `<code class="${codeClass}">`);

export const arrow = '<svg class="h-3 w-3" viewBox="0 0 10 11" fill="none"><path d="M2.5 8L7.5 3M7.5 3H3.3M7.5 3V7.2" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" /></svg>';
export const check = '<svg class="mt-1.5 h-3.5 w-3.5 shrink-0 text-accent" viewBox="0 0 20 20" fill="none"><path d="M4 10l4 4 8-8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg>';
export const boltIcon = '<path d="M11 2 4 12h5l-1 6 7-10h-5l1-6Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" fill="currentColor" fill-opacity="0.15" />';

// ---- Front matter -------------------------------------------------------------------------------------------------------
// Supports `key: value`, `key: [a, b, c]`, and a list under a key (`facts:` then `  - Label: Value`).
export function parseFrontMatter(raw, file) {
    const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
    if (!m) throw new Error(`${file}: missing front matter (--- ... --- at the top)`);
    const data = {};
    let key = null;
    for (const line of m[1].split(/\r?\n/)) {
        if (!line.trim() || line.trim().startsWith('#')) continue;
        const item = line.match(/^\s+-\s+(.*)$/);
        if (item && key) {
            if (!Array.isArray(data[key])) data[key] = [];
            data[key].push(item[1].trim());
            continue;
        }
        const kv = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/);
        if (!kv) throw new Error(`${file}: cannot read front matter line: ${line}`);
        key = kv[1];
        const v = kv[2].trim();
        if (v === '') data[key] = [];
        else if (v.startsWith('[') && v.endsWith(']')) data[key] = v.slice(1, -1).split(',').map((s) => s.trim()).filter(Boolean);
        else if (v === 'true' || v === 'false') data[key] = v === 'true';
        else data[key] = v.replace(/^(["'])(.*)\1$/, '$2');
    }
    return { data, body: m[2] };
}

// ---- Body: markdown -> blocks ---------------------------------------------------------------------------------------------
// Blocks are rendered by hand (not by marked's HTML output) so they get the site's own classes.
export function mdBlocks(src, file) {
    const blocks = [];
    for (const t of marked.lexer(src)) {
        switch (t.type) {
            case 'space':
            case 'hr':
                break;
            case 'heading':
                if (t.depth === 2) blocks.push({ kind: 'h2', text: t.text.replace(/\s*\{-\}\s*$/, ''), plain: /\{-\}\s*$/.test(t.text) });
                else if (t.depth === 3) blocks.push({ kind: 'h3', html: inline(t.text) });
                else throw new Error(`${file}: use ## or ### for headings (the page title comes from the front matter)`);
                break;
            case 'paragraph': {
                const only = t.tokens.length === 1 ? t.tokens[0] : null;
                if (only?.type === 'image') blocks.push({ kind: 'figure', src: only.href, alt: only.text, caption: only.title });
                else blocks.push({ kind: 'p', html: inline(t.text) });
                break;
            }
            case 'list':
                blocks.push({ kind: t.ordered ? 'olist' : 'list', items: t.items.map((i) => inline(i.text.trim())) });
                break;
            case 'blockquote':
                blocks.push({ kind: 'quote', html: t.tokens.filter((x) => x.type === 'paragraph').map((x) => inline(x.text)).join(' ') });
                break;
            case 'code': {
                const [lang = '', ...rest] = (t.lang ?? '').trim().split(/\s+/);
                blocks.push({ kind: 'code', lang, title: rest.join(' '), text: t.text });
                break;
            }
            case 'html':
                if (!t.raw.trim().startsWith('<!--')) blocks.push({ kind: 'html', raw: t.raw });
                break;
            default:
                throw new Error(`${file}: unsupported markdown (${t.type}). Use paragraphs, ## headings, lists, > quotes, code blocks, images or ::: containers.`);
        }
    }
    return blocks;
}

const CALLOUTS = {
    analogy: { title: 'In the kitchen' },
    taste: { title: 'Taste test' },
    own: { title: 'Make it your own' },
};

// ::: containers - note, tip, steps (blog); analogy, taste, own, map, lessons (docs)
function container(name, arg, inner, file) {
    const tokens = marked.lexer(inner).filter((t) => t.type !== 'space');
    if (name === 'note') {
        const parts = tokens.map((t) => {
            if (t.type !== 'paragraph') throw new Error(`${file}: a :::note can only contain paragraphs`);
            const only = t.tokens.length === 1 ? t.tokens[0] : null;
            return only?.type === 'link' ? { link: only.href, text: only.text } : { html: inline(t.text) };
        });
        return { kind: 'note', title: arg, parts };
    }
    if (name === 'tip') return { kind: 'tip', html: tokens.map((t) => inline(t.text)).join(' ') };
    if (name === 'steps') {
        const list = tokens.find((t) => t.type === 'list');
        if (!list) throw new Error(`${file}: :::steps needs a numbered list`);
        return {
            kind: 'steps',
            items: list.items.map((i) => {
                const m = i.text.trim().match(/^\*\*(.+?)\*\*[:.]?\s*([\s\S]*)$/);
                if (!m) throw new Error(`${file}: each step should look like "**Title**: description"`);
                return { title: esc(m[1]), html: inline(m[2]) };
            }),
        };
    }
    if (CALLOUTS[name]) {
        const parts = tokens.map((t) => {
            if (t.type === 'paragraph') return { p: inline(t.text) };
            if (t.type === 'list') return { list: t.items.map((i) => inline(i.text.trim())) };
            if (t.type === 'code') {
                const [lang = '', ...rest] = (t.lang ?? '').trim().split(/\s+/);
                return { code: { kind: 'code', lang, title: rest.join(' '), text: t.text } };
            }
            throw new Error(`${file}: a :::${name} box can only contain paragraphs, lists and code blocks`);
        });
        return { kind: 'callout', variant: name, title: arg || CALLOUTS[name].title, parts };
    }
    if (name === 'map') {
        const list = tokens.find((t) => t.type === 'list');
        if (!list) throw new Error(`${file}: :::map needs a list of "left | right" lines`);
        const split = (s) => s.split(' | ').map((x) => x.trim());
        const head = split(arg);
        if (head.length !== 2) throw new Error(`${file}: write the map headings like ":::map In the kitchen | On the website"`);
        return {
            kind: 'map',
            head,
            rows: list.items.map((i) => {
                const cols = split(i.text.trim());
                if (cols.length !== 2) throw new Error(`${file}: each map line should look like "left | right"`);
                return cols.map((c) => inline(c));
            }),
        };
    }
    if (name === 'lessons') return { kind: 'lessons' };
    throw new Error(`${file}: unknown container :::${name}`);
}

export function toBlocks(body, file) {
    const out = [];
    const lines = body.split(/\r?\n/);
    let buf = [];
    let fence = false;
    const flush = () => {
        if (buf.join('').trim()) out.push(...mdBlocks(buf.join('\n'), file));
        buf = [];
    };
    for (let i = 0; i < lines.length; i++) {
        if (/^\s*(```|~~~)/.test(lines[i])) fence = !fence;
        const m = fence ? null : lines[i].match(/^:::(\w+)\s*(.*)$/);
        if (!m) {
            buf.push(lines[i]);
            continue;
        }
        flush();
        const inner = [];
        i++;
        while (i < lines.length && lines[i].trim() !== ':::') inner.push(lines[i++]);
        out.push(container(m[1], m[2].trim(), inner.join('\n'), file));
    }
    flush();
    return out;
}

// ---- Rendering ---------------------------------------------------------------------------------------------------------------------
export const missingImages = [];

const calloutStyle = {
    analogy: { box: 'bg-amber-50 ring-1 ring-amber-200/70 dark:bg-amber-400/10 dark:ring-amber-300/20', label: 'text-amber-700 dark:text-amber-300' },
    taste: { box: 'bg-emerald-50 ring-1 ring-emerald-200/70 dark:bg-emerald-400/10 dark:ring-emerald-300/20', label: 'text-emerald-700 dark:text-emerald-300' },
    own: { box: 'bg-accent-soft', label: 'text-accent' },
};

export function renderBlock(b, ctx = {}) {
    switch (b.kind) {
        case 'p':
            return `<p class="mt-4 text-[17px] leading-8 text-ink/80 dark:text-white/80">${b.html}</p>`;
        case 'h3':
            return `<h3 class="mt-8 text-lg font-semibold text-ink dark:text-white">${b.html}</h3>`;
        case 'list':
            return `<ul class="mt-6 space-y-3 rounded-2xl bg-surface p-6 ring-1 ring-border">
${b.items.map((f) => `                    <li class="flex items-start gap-3 text-[15px] leading-relaxed text-ink dark:text-white">${check}<span>${f}</span></li>`).join('\n')}
                </ul>`;
        case 'olist':
            return `<ol class="mt-6 space-y-3">
${b.items.map((f, i) => `                    <li class="flex items-start gap-3 text-[17px] leading-8 text-ink/80 dark:text-white/80"><span class="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-white">${i + 1}</span><span>${f}</span></li>`).join('\n')}
                </ol>`;
        case 'quote':
            return `<blockquote class="mt-8 border-l-2 border-accent pl-5 text-xl leading-relaxed font-medium text-ink dark:text-white">${b.html}</blockquote>`;
        case 'code': {
            // ```text blocks are sample output or things to type in: nothing to copy, so no Copy button.
            const copyable = b.lang !== 'text';
            return `<div${copyable ? ' x-data="copyCode"' : ''} class="mt-5 overflow-hidden rounded-2xl bg-[#1d1d1f] ring-1 ring-black/10 dark:ring-white/10">
                    <div class="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-2 text-xs text-white/60">
                        <span class="font-mono">${esc(b.title || (copyable ? b.lang : 'output') || 'code')}</span>${copyable ? `
                        <button type="button" @click="copy()" aria-label="Copy this code" class="rounded-md px-2 py-1 font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"><span x-text="copied ? 'Copied!' : 'Copy'" aria-live="polite">Copy</span></button>` : ''}
                    </div>
                    <pre class="overflow-x-auto px-4 py-4 text-[13px] leading-relaxed text-white/90"><code>${esc(b.text)}</code></pre>
                </div>`;
        }
        case 'figure': {
            if (!/^https?:/.test(b.src) && !fs.existsSync(path.join(root, b.src))) {
                missingImages.push(b.src);
                return '';
            }
            return `<figure class="mt-6 overflow-hidden rounded-2xl ring-1 ring-border">
                    <img src="${attr(b.src)}" alt="${attr(b.alt)}" loading="lazy" class="w-full object-cover">${b.caption ? `
                    <figcaption class="bg-surface px-4 py-3 text-xs text-muted">${esc(b.caption)}</figcaption>` : ''}
                </figure>`;
        }
        case 'html':
            return b.raw;
        case 'tip':
            return `<aside class="mt-6 flex gap-3 rounded-2xl bg-accent-soft p-4 text-[15px] leading-relaxed text-ink dark:text-white">
                    <svg class="mt-0.5 h-4 w-4 shrink-0 text-accent" viewBox="0 0 20 20" fill="none" aria-hidden="true">${boltIcon}</svg>
                    <p><strong class="font-semibold">Try this.</strong> ${b.html}</p>
                </aside>`;
        case 'steps':
            return `<ol class="mt-6 grid gap-4 sm:grid-cols-3">
${b.items.map((s, i) => `                    <li class="rounded-2xl bg-white p-5 ring-1 ring-border dark:bg-white/5">
                        <span class="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-xs font-semibold text-white">${i + 1}</span>
                        <h3 class="mt-3 font-semibold text-ink dark:text-white">${s.title}</h3>
                        <p class="mt-1 text-sm leading-relaxed text-muted">${s.html}</p>
                    </li>`).join('\n')}
                </ol>`;
        case 'note':
            return `<aside class="mt-12 rounded-2xl bg-accent-soft p-6">
                    <p class="font-semibold text-ink dark:text-white">${esc(b.title)}</p>${b.parts
                        .map((p) => (p.link
                            ? `\n                    <a href="${attr(p.link)}" class="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent transition-colors hover:text-accent-hover">${esc(p.text)} ${arrow}</a>`
                            : `\n                    <p class="mt-1 text-[15px] leading-relaxed text-ink/80 dark:text-white/80">${p.html}</p>`))
                        .join('')}
                </aside>`;
        case 'callout': {
            const s = calloutStyle[b.variant];
            return `<aside class="mt-8 rounded-2xl p-6 ${s.box}">
                    <p class="text-xs font-semibold tracking-wider uppercase ${s.label}">${esc(b.title)}</p>${b.parts
                        .map((p) => (p.code
                            ? `\n                    ${renderBlock(p.code)}`
                            : p.list
                                ? `\n                    <ul class="mt-3 list-disc space-y-1.5 pl-5 text-[15px] leading-relaxed text-ink/80 dark:text-white/80">${p.list.map((i) => `<li>${i}</li>`).join('')}</ul>`
                                : `\n                    <p class="mt-2 text-[15px] leading-relaxed text-ink/80 dark:text-white/80">${p.p}</p>`))
                        .join('')}
                </aside>`;
        }
        case 'map':
            return `<div class="mt-6 overflow-hidden rounded-2xl ring-1 ring-border">
                    <div class="grid grid-cols-2 gap-6 bg-surface px-5 py-3 text-xs font-semibold tracking-wider text-muted uppercase"><span>${esc(b.head[0])}</span><span>${esc(b.head[1])}</span></div>
${b.rows.map(([l, r]) => `                    <div class="grid grid-cols-1 gap-1 border-t border-border px-5 py-3.5 text-[15px] leading-relaxed sm:grid-cols-2 sm:gap-6"><span class="font-medium text-ink dark:text-white">${l}</span><span class="text-muted">${r}</span></div>`).join('\n')}
                </div>`;
        case 'lessons':
            if (!ctx.renderLessons) throw new Error(':::lessons can only be used on the docs home page');
            return ctx.renderLessons();
        default:
            throw new Error(`unknown block ${b.kind}`);
    }
}

// A required front matter field must be filled in (an empty "key:" line is not enough).
export function need(data, keys, file) {
    for (const key of keys) {
        if (typeof data[key] !== 'string' || !data[key].trim()) throw new Error(`${file}: front matter needs "${key}" (it is missing or empty)`);
    }
}

export const q = (s) => JSON.stringify(s).replace(/</g, '\\u003c');
