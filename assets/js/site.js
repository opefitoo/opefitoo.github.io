/* Language switcher shared by the standalone pages. Each page sets window.OPE_T = { en: {...}, de: {...} };
   French is read from the markup. Optional window.OPE_onLang(lang) runs after each switch. */
(() => {
  const T = Object.assign({ fr: {} }, window.OPE_T || {});
  const txt = [...document.querySelectorAll('[data-i18n]')], html = [...document.querySelectorAll('[data-i18n-html]')];
  txt.forEach(n => T.fr[n.dataset.i18n] = n.textContent);
  html.forEach(n => T.fr[n.dataset.i18nHtml] = n.innerHTML);
  function setLang(l) {
    const lang = T[l] ? l : 'fr';
    document.documentElement.lang = lang;
    txt.forEach(n => { n.textContent = T[lang][n.dataset.i18n] ?? T.fr[n.dataset.i18n]; });
    html.forEach(n => { n.innerHTML = T[lang][n.dataset.i18nHtml] ?? T.fr[n.dataset.i18nHtml]; });
    document.querySelectorAll('.langs button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
    try { localStorage.setItem('opefitoo-lang', lang); } catch (e) {}
    if (window.OPE_onLang) window.OPE_onLang(lang);
  }
  document.querySelectorAll('.langs button').forEach(b => b.addEventListener('click', () => setLang(b.dataset.lang)));
  let saved = null; try { saved = localStorage.getItem('opefitoo-lang'); } catch (e) {}
  if (!saved) { const n = (navigator.language || 'fr').slice(0, 2); saved = T[n] ? n : 'fr'; }
  setLang(saved);
})();
