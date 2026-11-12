(()=>{'use strict';
let deferred=null;
const btn=document.getElementById('installAppBtn');if(!btn)return;
const overlay=document.createElement('div');overlay.className='install-overlay';overlay.hidden=true;overlay.innerHTML='<section class="install-window" role="dialog" aria-modal="true" aria-labelledby="installHead"><h2 id="installHead">📲 تثبيت نافس بلس</h2><p id="installInfo"></p><div class="install-actions"><button class="btn primary" type="button" id="installNow" hidden>تثبيت الآن</button><button class="btn light" type="button" id="installClose">إغلاق</button></div></section>';
document.body.append(overlay);const info=overlay.querySelector('#installInfo'),doInstall=overlay.querySelector('#installNow');
function isIos(){return /iPhone|iPad|iPod/i.test(navigator.userAgent)}
function standalone(){return matchMedia('(display-mode: standalone)').matches||navigator.standalone===true}
function show(){overlay.hidden=false;if(standalone()){info.textContent='التطبيق مثبت بالفعل، افتحه من الشاشة الرئيسية.';doInstall.hidden=true;return}
if(isIos()){info.innerHTML='على iPhone: افتح هذا الموقع في <b>Safari</b> ثم اضغط زر <b>المشاركة □↑</b> واختر <b>إضافة إلى الشاشة الرئيسية (Add to Home Screen)</b> ثم <b>إضافة</b>.';doInstall.hidden=true}
else if(deferred){info.textContent='اضغط تثبيت الآن لتثبيت التطبيق على هذا الجهاز.';doInstall.hidden=false}
else if(location.protocol!=='https:'&&location.hostname!=='localhost'){info.textContent='يعمل زر تثبيت التطبيق بعد رفع الملفات على موقع GitHub Pages بعنوان يبدأ بـ https://. بعدها افتح الموقع في Chrome أو Safari.';doInstall.hidden=true}
else{info.innerHTML='في <b>Chrome على Android أو الكمبيوتر</b>: افتح قائمة المتصفح ⋮ ثم اختر <b>تثبيت التطبيق / Install app</b> أو <b>إضافة إلى الشاشة الرئيسية</b>. قد يظهر التثبيت بعد تحميل الصفحة.';doInstall.hidden=true}}
btn.onclick=show;overlay.querySelector('#installClose').onclick=()=>overlay.hidden=true;overlay.addEventListener('click',e=>{if(e.target===overlay)overlay.hidden=true});
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferred=e});
doInstall.onclick=async()=>{if(!deferred)return;const event=deferred;deferred=null;overlay.hidden=true;await event.prompt();};
if('serviceWorker' in navigator&&location.protocol!=='file:')window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
})();
