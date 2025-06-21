//
// ملف جافاسكريبت الرئيسي لموقع Lilyum Nails
// يحتوي على جميع وظائف التفاعل للنموذج، اختيار الشكل، التحقق من المدخلات، وتجهيز رسالة الطلب.
// كل جزء مشروح بتعليق عربي يوضح الهدف من الكود ووظيفته.
//
// =============================
// شرح تفصيلي لكل جزء من كود جافاسكريبت (script.js)
// =============================
// هذا الملف يحتوي على جميع وظائف التفاعل للنموذج، اختيار الشكل، التحقق من المدخلات، وتجهيز رسالة الطلب.
// كل دالة وكل حدث مشروح بتعليق عربي يوضح الهدف من الكود ووظيفته.
//
// عناصر النموذج:
// - knowSizes: عنصر تحديد إذا كانت العميلة تعرف مقاسات أظافرها.
// - sizesSection: القسم الذي يعرض حقول المقاسات أو تعليمات الصورة.
// - fullSizesNote: ملاحظة تظهر عند اكتمال جميع المقاسات.
// - photoInstructions: تعليمات إرسال الصور في حال عدم معرفة المقاسات.
// - shapeInput: حقل مخفي لتخزين شكل الأظافر المختار.
// - sendBtn: زر إرسال الطلب عبر واتساب.


// عناصر النموذج
const knowSizes = document.getElementById('know-sizes');
const sizesSection = document.getElementById('sizes-section');
const fullSizesNote = document.getElementById('full-sizes-note');
const photoInstructions = document.getElementById('photo-instructions');
const shapeInput = document.getElementById('shape');
const sendBtn = document.getElementById('send-btn');

const fingersRight = [
  'الإبهام يمين', 'السبابة يمين', 'الوسطى يمين', 'البنصر يمين', 'الخنصر يمين'
];
const fingersLeft = [
  'الإبهام يسار', 'السبابة يسار', 'الوسطى يسار', 'البنصر يسار', 'الخنصر يسار'
];
const allFingers = [...fingersRight, ...fingersLeft];
// تعديل خيارات المقاسات ليبدأ كل حقل بخيار فارغ افتراضي
const sizeOptions = `<option value="" disabled selected hidden>اختاري...</option>` + Array.from({ length: 13 }, (_, i) => `<option style='font-size:1.236rem;padding:0.618rem 1rem;'>${i}</option>`).join('');

// =================== دوال وأحداث التفاعل ===================

// عند تغيير اختيار معرفة المقاسات:
// إذا اختارت العميلة "نعم"، يتم عرض حقول المقاسات لكل إصبع (يد يمنى ويسرى)
// إذا اختارت "لا"، تظهر تعليمات إرسال الصور عبر الواتساب
knowSizes?.addEventListener('change', () => {
  // إعادة تعيين القسم وإخفاء ملاحظة الاكتمال
  sizesSection.innerHTML = '';
  fullSizesNote?.classList.add('hidden');

  if (knowSizes.value === 'yes') {
    // ====== عرض حقول اليد اليمنى ======
    sizesSection.innerHTML += `<h4 style='font-size:1.618rem;margin:1.618rem 0 1rem 0;'>✋ اليد اليمنى</h4>`;
    fingersRight.forEach(finger => {
      // لكل إصبع يتم إنشاء حقل اختيار مقاس (من 0 إلى 12)
      sizesSection.innerHTML += `
        <div class="form-group" style="margin-bottom:1.618rem;">
          <label style="font-size:1.236rem;">${finger}</label>
          <select class="size-select glass-select" required style="border-radius:0.618rem;padding:0.618rem 1rem;min-width:90px;">
            ${sizeOptions}
          </select>
        </div>
      `;
    });
    // ====== عرض حقول اليد اليسرى ======
    sizesSection.innerHTML += `<h4 style='font-size:1.618rem;margin:1.618rem 0 1rem 0;'>🤚 اليد اليسرى</h4>`;
    fingersLeft.forEach(finger => {
      sizesSection.innerHTML += `
        <div class="form-group" style="margin-bottom:1.618rem;">
          <label style="font-size:1.236rem;">${finger}</label>
          <select class="size-select glass-select" required style="border-radius:0.618rem;padding:0.618rem 1rem;min-width:90px;">
            ${sizeOptions}
          </select>
        </div>
      `;
    });
    // إظهار القسم وتعليمات الدقة
    sizesSection.classList.remove('hidden');
    photoInstructions.classList.remove('hidden');
    photoInstructions.innerHTML = ` يرجى تعبئة جميع المقاسات بدقة، وسننفذ التصميم حسب ما تم تحديده.`;
  } else if (knowSizes.value === 'no') {
    // ====== إخفاء الحقول وعرض تعليمات الصور ======
    sizesSection.classList.add('hidden');
    photoInstructions.classList.remove('hidden');
    photoInstructions.innerHTML = `
      📸 بعد إرسال الطلب، سوف تقومين بإرسال صور يديك عبر الواتساب كما يلي:<br>
      - صورة لأربع أصابع بجانب عملة معدنية لكل يد<br>
      - ثم صورة لكل إبهام على حدة
    `;
  }
  validateFormFields(); // إعادة التحقق بعد كل تغيير
});

// التحقق من اكتمال المقاسات:
// عند تغيير أي حقل مقاس، إذا كانت جميع الحقول ممتلئة تظهر ملاحظة "تم إدخال جميع المقاسات".
sizesSection?.addEventListener('change', () => {
  if (knowSizes.value === 'yes') {
    // التحقق من أن كل select له قيمة
    const allFilled = [...document.querySelectorAll('.size-select')].every(s => s.value !== '');
    fullSizesNote?.classList.toggle('hidden', !allFilled);
  }
  validateFormFields();
});

// تحديد شكل الأظافر من الصور:
// عند الضغط على صورة شكل، يتم تفعيلها وتخزين القيمة في الحقل المخفي shapeInput
const shapeImages = document.querySelectorAll('.shape-picker img');
shapeImages.forEach(img => {
  img.addEventListener('click', () => {
    // إزالة التفعيل من جميع الصور وتفعيل الصورة المختارة فقط
    shapeImages.forEach(i => i.classList.remove('selected'));
    img.classList.add('selected');
    shapeInput.value = img.getAttribute('data-shape');
  });
});

// إرسال الطلب عبر واتساب:
// عند الضغط على زر الإرسال، يتم التحقق من جميع الحقول وتجهيز رسالة الطلب وإرسالها عبر رابط واتساب
sendBtn?.addEventListener('click', () => {
  // منع التكرار إذا كان الزر معطل
  if (sendBtn.disabled) return;
  // جلب القيم من الحقول الأساسية
  const name = document.getElementById('name')?.value.trim();
  const phone = document.getElementById('phone')?.value.trim();
  const shape = shapeInput?.value.trim();
  const knows = knowSizes?.value;
  const note = document.getElementById('design-note')?.value.trim();

  // مصفوفة لتجميع أسماء الحقول الناقصة
  let missing = [];
  if (!name) missing.push('الاسم الكامل');
  if (!phone) missing.push('رقم الجوال');
  if (!shape) missing.push('شكل الأظافر');
  if (!knows) missing.push('معرفة المقاسات');

  // إذا اختارت العميلة "نعم" للمقاسات، تحقق من كل إصبع واجعل كل الحقول مطلوبة فعليًا
  if (knows === 'yes') {
    const selects = document.querySelectorAll('.size-select');
    const fingers = [
      'إبهام اليمين', 'سبابة اليمين', 'وسطى اليمين', 'بنصر اليمين', 'خنصر اليمين',
      'إبهام اليسار', 'سبابة اليسار', 'وسطى اليسار', 'بنصر اليسار', 'خنصر اليسار'
    ];
    let firstMissing = null;
    selects.forEach((s, i) => {
      // إضافة خاصية required ديناميكياً
      s.required = true;
      if (!s.value && firstMissing === null) {
        firstMissing = fingers[i] || `إصبع رقم ${i+1}`;
      }
    });
    if (firstMissing) {
      alert('يرجى تعبئة الحقل التالي: ' + firstMissing);
      return;
    }
  }

  // تجهيز نص الرسالة للواتساب
  let msg = `مرحباً، اسمي ${name} وأرغب بطلب تصميم أظافر مخصص.\n`;
  msg += `رقم الجوال: ${phone}\n`;
  msg += `شكل الأظافر: ${shape}\n`;
  msg += `هل أعرف المقاسات؟: ${knows === 'yes' ? 'نعم' : 'لا'}\n`;

  if (knows === 'yes') {
    // إضافة تفاصيل المقاسات
    msg += `المقاسات:\n`;
    document.querySelectorAll('.size-select').forEach((s, i) => {
      msg += `${allFingers[i]}: ${s.value || '--'}\n`;
    });
    // إذا كانت جميع الحقول ممتلئة أضف ملاحظة
    const allFilled = [...document.querySelectorAll('.size-select')].every(s => s.value !== '');
    if (allFilled) msg += `\n📌 سوف أقوم بإرفاق صورة التصميم إن وجدت.`;
  } else {
    // إذا لم تكن المقاسات معروفة
    msg += `سوف أرسل صور القياس عبر الواتساب بعد الطلب.\n`;
  }

  // إضافة وصف التصميم إذا وجد
  if (note) {
    msg += `\nوصف التصميم المطلوب: ${note}`;
  }

  // حفظ الرسالة في localStorage
  localStorage.setItem('lilyum_msg', msg);
  // الانتقال إلى صفحة النجاح
  window.location.href = 'success.html';
});

// صفحة النجاح - إدخال الرسالة
window.addEventListener("DOMContentLoaded", () => {
  const successLink = document.querySelector("#whatsapp-link") || document.querySelector("#whatsapp-success");
  const savedMsg = localStorage.getItem("lilyum_msg");
  if (successLink && savedMsg) {
    // ترميز الرسالة بشكل صحيح مع استبدال \n بـ %0A
    const encoded = encodeURIComponent(savedMsg.replace(/\n/g, '%0A'));
    successLink.href = `https://api.whatsapp.com/send?phone=966549542823&text=${encoded}`;
  }
});

// =============================
// توحيد منطق تحديث عدد العملاء في جميع الصفحات التي تحتوي على العداد
// =============================
const CLIENTS_COUNT_KEY = 'lilyum_clients_count';
const BASE_CLIENTS = 300;

function updateClientsCountDisplay() {
  // ابحث عن جميع العناصر التي تمثل عدد العملاء (عنصر يحمل data-label="عميلة راضية")
  const clientStats = document.querySelectorAll('.stat-number[data-label="عميلة راضية"]');
  if (!clientStats.length) return;
  // جلب العدد من localStorage أو الرقم الأساسي
  let count = parseInt(localStorage.getItem(CLIENTS_COUNT_KEY)) || BASE_CLIENTS;
  // تحديث الرقم في جميع العناصر مع علامة +
  clientStats.forEach(clientStat => {
    clientStat.textContent = count + '+';
    clientStat.setAttribute('data-count', count);
  });
}

// عند تحميل أي صفحة فيها العداد (about.html أو gallery.html أو غيرها)
document.addEventListener('DOMContentLoaded', function() {
  if (["about.html", "gallery.html"].some(page => window.location.pathname.includes(page))) {
    updateClientsCountDisplay();
  }
});

// عند إرسال الطلب عبر النموذج، زد العدد واحفظه وحدث جميع العدادات فورًا
if (typeof sendBtn !== 'undefined' && sendBtn) {
  sendBtn.addEventListener('click', () => {
    let count = parseInt(localStorage.getItem(CLIENTS_COUNT_KEY)) || BASE_CLIENTS;
    count++;
    localStorage.setItem(CLIENTS_COUNT_KEY, count);
    updateClientsCountDisplay(); // تحديث فوري في جميع الصفحات المفتوحة
  });
}

// =============================
// تعطيل زر الإرسال حتى اكتمال جميع الحقول المطلوبة
// =============================
function validateFormFields() {
  const name = document.getElementById('name')?.value.trim();
  const phone = document.getElementById('phone')?.value.trim();
  const shape = shapeInput?.value.trim();
  const knows = knowSizes?.value;
  const note = document.getElementById('design-note')?.value.trim();
  let valid = true;

  // إزالة جميع رسائل التحذير السابقة
  document.querySelectorAll('.field-warning').forEach(e => e.remove());
  document.querySelectorAll('.form-group input, .form-group select, .form-group textarea').forEach(e => {
    e.classList.remove('input-warning');
  });

  // التحقق من الحقول الأساسية
  if (!name) {
    showFieldWarning('name', 'يرجى تعبئة الاسم الكامل');
    valid = false;
  }
  if (!phone) {
    showFieldWarning('phone', 'يرجى تعبئة رقم الجوال');
    valid = false;
  }
  if (!shape) {
    showFieldWarning('shape', 'يرجى اختيار شكل الأظافر');
    valid = false;
  }
  if (!knows) {
    showFieldWarning('know-sizes', 'يرجى تحديد معرفة المقاسات');
    valid = false;
  }

  // منطق التحقق الجديد:
  if (knows === 'yes') {
    const selects = document.querySelectorAll('.size-select');
    const fingers = [
      'إبهام اليمين', 'سبابة اليمين', 'وسطى اليمين', 'بنصر اليمين', 'خنصر اليمين',
      'إبهام اليسار', 'سبابة اليسار', 'وسطى اليسار', 'بنصر اليسار', 'خنصر اليسار'
    ];
    let allSizesFilled = true;
    // تحقق أن عدد الحقول 10 بالضبط
    if (selects.length !== 10) {
      allSizesFilled = false;
    } else {
      selects.forEach((s, i) => {
        s.required = true;
        if (!s.value) {
          showFieldWarning(null, 'يرجى اختيار مقاس ' + (fingers[i] || `إصبع رقم ${i+1}`), s);
          allSizesFilled = false;
        }
      });
    }
    if (!allSizesFilled) valid = false;
  }

  // إذا كانت معرفة المقاسات "لا"، لا تشترط المقاسات فقط الحقول الأساسية
  // (valid يبقى كما هو)

  sendBtn.disabled = !valid;
  return valid;
}

// دالة لإظهار رسالة تحذير بجانب الحقل
function showFieldWarning(fieldId, msg, el) {
  let field;
  let labelText = '';
  if (el) {
    field = el;
    // محاولة جلب اسم العنصر من التسمية السابقة له
    const label = field.parentElement?.querySelector('label');
    if (label) labelText = label.textContent.replace(/[:؟]/g, '').trim();
  } else if (fieldId) {
    field = document.getElementById(fieldId);
    const label = field?.parentElement?.querySelector('label');
    if (label) labelText = label.textContent.replace(/[:؟]/g, '').trim();
    // معالجة الحقل المخفي (شكل الأظافر)
    if (!labelText && fieldId === 'shape') labelText = 'شكل الأظافر';
    if (!labelText && fieldId === 'know-sizes') labelText = 'معرفة المقاسات';
    if (!labelText && fieldId === 'name') labelText = 'الاسم الكامل';
    if (!labelText && fieldId === 'phone') labelText = 'رقم الجوال';
    if (!labelText && fieldId === 'design-note') labelText = 'وصف التصميم';
  }
  // صياغة الرسالة باسم العنصر
  let finalMsg = msg;
  if (labelText) {
    finalMsg = `يرجى تعبئة حقل: ${labelText}`;
  }
  if (field) {
    field.classList.add('input-warning');
    const warning = document.createElement('span');
    warning.className = 'field-warning';
    warning.style.color = '#e91e63';
    warning.style.fontSize = '1rem';
    warning.style.marginRight = '10px';
    warning.textContent = finalMsg;
    if (field.parentElement) {
      // إزالة أي تحذير سابق لنفس الحقل
      const old = field.parentElement.querySelector('.field-warning');
      if (old) old.remove();
      field.parentElement.appendChild(warning);
    }
  }
}

// مراقبة جميع الحقول لتفعيل/تعطيل زر الإرسال تلقائياً
['input', 'change'].forEach(evt => {
  document.getElementById('order-form')?.addEventListener(evt, validateFormFields, true);
});

document.addEventListener('DOMContentLoaded', validateFormFields);