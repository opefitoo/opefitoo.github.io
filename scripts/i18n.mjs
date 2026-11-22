// Builds the English and German copies of the site pages (en/*.html, de/*.html) from the French
// sources, so search engines see real translated pages at their own URLs.
// The translations live in each page's inline dictionary (const T = {...} or window.OPE_T = {...}).
//
// Run after editing a French page:   PLAYWRIGHT=/path/to/node_modules/playwright node scripts/i18n.mjs
// (any Playwright install works; it is only used for its HTML parser, no page scripts run).
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT || 'playwright');
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const PAGES = {
  'index.html': { out: 'index.html',
    en: { title: 'Opefitoo | Healthcare software in Luxembourg', desc: 'Opefitoo builds Nuno, Nuno Mobile, MediNote and Salaire Santé: software for home care, independent nurses, medical practices and healthcare staff in Luxembourg.', ogt: 'Opefitoo, healthcare software in Luxembourg' },
    de: { title: 'Opefitoo | Software für das Gesundheitswesen in Luxemburg', desc: 'Opefitoo entwickelt Nuno, Nuno Mobile, MediNote und Salaire Santé: Software für häusliche Pflege, freiberufliche Pflegekräfte, Arztpraxen und Beschäftigte im Gesundheitswesen in Luxemburg.', ogt: 'Opefitoo, Software für das Gesundheitswesen in Luxemburg' } },
  'apps/index.html': { out: 'apps.html',
    en: { title: 'Nuno, Nuno Mobile, MediNote, Salaire Santé | Opefitoo', desc: 'Nuno, Nuno Mobile, MediNote and Salaire Santé: Opefitoo’s healthcare software in Luxembourg, with screens and features.', ogt: 'The Opefitoo apps' },
    de: { title: 'Nuno, Nuno Mobile, MediNote, Salaire Santé | Opefitoo', desc: 'Nuno, Nuno Mobile, MediNote und Salaire Santé: die Gesundheitssoftware von Opefitoo in Luxemburg, mit Screens und Funktionen.', ogt: 'Die Apps von Opefitoo' } },
  'contact.html': { out: 'contact.html',
    en: { title: 'Contact | Opefitoo', desc: 'Contact Opefitoo for a demo of Nuno, Nuno Mobile or MediNote, or a question about Salaire Santé.', ogt: 'Contact Opefitoo' },
    de: { title: 'Kontakt | Opefitoo', desc: 'Kontaktieren Sie Opefitoo für eine Demo von Nuno, Nuno Mobile oder MediNote oder eine Frage zu Salaire Santé.', ogt: 'Opefitoo kontaktieren' } },
  'about.html': { out: 'about.html',
    en: { title: 'About | Opefitoo', desc: 'Mehdi Benammar, independent developer in Luxembourg: Nuno, Nuno Mobile, MediNote and Salaire Santé, software built with carers since 2015.', ogt: 'Mehdi Benammar, Opefitoo' },
    de: { title: 'Über mich | Opefitoo', desc: 'Mehdi Benammar, selbstständiger Entwickler in Luxemburg: Nuno, Nuno Mobile, MediNote und Salaire Santé, Software, die seit 2015 mit Pflegekräften entsteht.', ogt: 'Mehdi Benammar, Opefitoo' } },
  'blog.html': { out: 'blog.html',
    en: { title: 'Blog | Opefitoo', desc: 'Field notes from Opefitoo: healthcare software in Luxembourg, home care, medical practices.', ogt: 'Opefitoo blog' },
    de: { title: 'Blog | Opefitoo', desc: 'Notizen aus der Praxis von Opefitoo: Gesundheitssoftware in Luxemburg, häusliche Pflege, Arztpraxen.', ogt: 'Opefitoo Blog' } },
};

function dictionary(src) {
  const m = src.match(/(?:const T|window\.OPE_T)\s*=\s*\{/);
  if (!m) throw new Error('no dictionary');
  let i = m.index + m[0].length - 1, depth = 0, q = null;
  for (let j = i; j < src.length; j++) {
    const c = src[j];
    if (q) { if (c === '\\') j++; else if (c === q) q = null; continue; }
    if (c === '"' || c === "'" || c === '`') q = c;
    else if (c === '{') depth++;
    else if (c === '}' && --depth === 0) return new Function(`return (${src.slice(i, j + 1)})`)();
  }
  throw new Error('unbalanced dictionary');
}

const browser = await chromium.launch({ executablePath: CHROME });
const page = await browser.newPage();
for (const [file, cfg] of Object.entries(PAGES)) {
  const raw = readFileSync(join(root, file), 'utf8');
  const [, fm, body] = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  const T = dictionary(body);
  const liquid = [];
  const protectedBody = body
    .replace(/\{%[\s\S]*?%\}/g, s => `<!--LQ${liquid.push(s) - 1}-->`)
    .replace(/\{\{[\s\S]*?\}\}/g, s => `LQV${liquid.push(s) - 1}Z`);
  for (const lang of ['en', 'de']) {
    const meta = cfg[lang];
    let html = await page.evaluate(({ src, dict, lang, meta }) => {
      const doc = new DOMParser().parseFromString(src, 'text/html');
      doc.documentElement.lang = lang;
      doc.querySelectorAll('[data-i18n]').forEach(n => { const v = dict[n.dataset.i18n]; if (v != null) n.textContent = v; });
      doc.querySelectorAll('[data-i18n-html]').forEach(n => { const v = dict[n.dataset.i18nHtml]; if (v != null) n.innerHTML = v; });
      const msg = doc.getElementById('msg'); if (msg && dict['ph-msg']) msg.placeholder = dict['ph-msg'];
      doc.title = meta.title;
      const set = (sel, v) => { const e = doc.querySelector(sel); if (e) e.setAttribute('content', v); };
      set('meta[name="description"]', meta.desc);
      set('meta[property="og:title"]', meta.ogt);
      set('meta[property="og:description"]', meta.desc);
      return '<!doctype html>\n' + doc.documentElement.outerHTML + '\n';
    }, { src: protectedBody, dict: T[lang], lang, meta });
    html = html
      .replace(/<!--LQ(\d+)-->/g, (_, n) => liquid[n])
      .replace(/LQV(\d+)Z/g, (_, n) => liquid[n])
      .replace(/href="\/(apps|about|blog|contact)\//g, `href="/${lang}/$1/`)
      .replace(/href="\/"/g, `href="/${lang}/"`);
    const ref = fm.match(/^ref: (.*)$/m)[1];
    const front = fm.replace(/^lang: .*$/m, `lang: ${lang}`).replace(/^permalink: .*\n?/m, '') + `\npermalink: /${lang}${ref}`;
    const dest = join(root, lang, cfg.out);
    mkdirSync(dirname(dest), { recursive: true });
    writeFileSync(dest, `---\n# Generated by scripts/i18n.mjs from ${file}. Edit the French page, then rerun the script.\n${front}\n---\n${html}`);
    console.log('wrote', `${lang}/${cfg.out}`);
  }
}
await browser.close();
