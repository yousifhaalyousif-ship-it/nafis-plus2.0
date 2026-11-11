/* Installability with accurate iOS and Android fallback instructions. */
(() => {
  const btn = document.getElementById('installAppBtn');
  const panel = document.getElementById('installPanel');
  const instructions = document.getElementById('installInstructions');
  const closeBtn = document.getElementById('closeInstallPanel');
  let deferredInstall = null;
  const hosted = location.protocol === 'https:' || /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
  const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const installed = () => window.matchMedia('(display-mode: standalone)').matches || !!navigator.standalone;
  const refreshButton = () => { btn.hidden = installed(); };
  function showHelp() {
    if (!hosted) {
      instructions.textContent = 'هذه النسخة تعمل من الملفات على الكمبيوتر، لكن تثبيت التطبيق يتطلب أولاً نشر ملفات المجلد على موقع HTTPS مثل GitHub Pages. بعد النشر افتح الرابط من جهازك.';
    } else if (iOS) {
      instructions.textContent = 'على iPhone أو iPad: افتح الرابط في Safari، ثم اضغط مشاركة (أو ⋯ ثم مشاركة)، واختر «إضافة إلى الشاشة الرئيسية»، وفعّل «فتح كتطبيق»، ثم اضغط «إضافة».';
    } else if (/Android/i.test(navigator.userAgent)) {
      instructions.textContent = 'افتح الموقع في Chrome، ثم اضغط ⋮ واختر «تثبيت التطبيق» أو «إضافة إلى الشاشة الرئيسية». إذا لم يظهر الخيار، جرّب تحديث الصفحة بعد اكتمال التحميل.';
    } else {
      instructions.textContent = 'على الكمبيوتر: افتح الموقع في Chrome أو Edge، ثم استخدم أيقونة التثبيت في شريط العنوان أو اختر «تثبيت التطبيق» من قائمة المتصفح.';
    }
    panel.hidden = false;
    closeBtn.focus();
  }
  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    deferredInstall = event;
    refreshButton();
  });
  window.addEventListener('appinstalled', () => {
    deferredInstall = null;
    panel.hidden = true;
    refreshButton();
  });
  btn.addEventListener('click', async () => {
    if (deferredInstall) {
      const prompt = deferredInstall;
      deferredInstall = null;
      try {
        await prompt.prompt();
        const choice = await prompt.userChoice;
        if (choice.outcome !== 'accepted') refreshButton();
      } catch (_) { showHelp(); }
    } else { showHelp(); }
  });
  closeBtn.addEventListener('click', () => { panel.hidden = true; btn.focus(); });
  panel.addEventListener('click', event => {
    if (event.target === panel) panel.hidden = true;
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') panel.hidden = true;
  });
  refreshButton();
  if (hosted && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js', {scope:'./'}).catch(error => {
        console.warn('Offline availability could not be enabled:', error);
      });
    });
  }
})();
