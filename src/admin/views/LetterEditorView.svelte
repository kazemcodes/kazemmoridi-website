<script lang="ts">
  import { onMount } from 'svelte';
  import { getDatabase, type OfficialLetter, type Client } from '../../services/db';
  import { getTodayPersianDate, generateLetterNumber } from '../../utils/persianDate';
  import { generateUUID, isValidUUID } from '../../utils/uuid';
  import { Printer, Save, ArrowRight, Sparkles } from 'lucide-svelte';

  export let letterId: string | null = null;
  export let onNavigate: (tab: string, param?: string) => void;

  let clients: Client[] = [];
  let loading = true;
  let saving = false;

  let letter: OfficialLetter = {
    id: generateUUID(),
    letterNumber: generateLetterNumber(),
    letterDate: getTodayPersianDate(),
    attachment: 'ندارد',
    type: 'official',
    subject: '',
    recipientTitle: '',
    recipientName: '',
    recipientCompany: '',
    body: '',
    signeeTitle: 'مدیریت مهندسی و توسعه نرم‌افزار',
    signeeName: 'کاظم مریدی',
    status: 'published'
  };

  const templates = [
    {
      id: 'contract',
      name: 'قرارداد طراحی و توسعه وب‌سایت',
      type: 'contract' as const,
      subject: 'قرارداد طراحی، پیاده‌سازی و راه‌اندازی وب‌سایت',
      recipientTitle: 'مدیریت محترم ...',
      body: `با سلام و ادای احترام؛\nپیرو توافقات انجام‌شده فی‌مابین طرفین، این قرارداد با شرایط و تعهدات زیر منعقد می‌گردد:\n\n۱. موضوع قرارداد: طراحی اختصاصی رابط کاربری، برنامه‌نویسی فرانت‌اند و بک‌اند، بهینه‌سازی سرعت و استقرار سامانه مطابق پیش‌فاکتور ضمیمه.\n\n۲. مدت زمان اجرا: مدت اجرای موضوع قرارداد ۳۰ روز کاری از تاریخ واریز پیش‌پرداخت و تحویل محتوا می‌باشد.\n\n۳. تعهدات مجری (استودیو مریدی): تضمین عملکرد پایدار، رفع باگ‌های احتمالی، سورس‌کد تمیز و استاندارد و ۶ ماه پشتیبانی فنی رایگان.\n\n۴. تعهدات کارفرما: تسویه مبالغ قرارداد طبق زمان‌بندی و ارائه اطلاعات لازم جهت توسعه سامانه.`
    },
    {
      id: 'handover',
      name: 'صورتجلسه تحویل نهایی پروژه',
      type: 'handover' as const,
      subject: 'صورتجلسه تحویل قطعی سامانه و شروع دوره پشتیبانی',
      recipientTitle: 'کارفرمای محترم، جناب آقای / سرکار خانم ...',
      body: `با سلام و احترام؛\nبدین‌وسیله گواهی می‌شود که تمامی بخش‌ها و ماژول‌های موضوع سفارش، طبق نیازمندی‌های مصوب طراحی، پیاده‌سازی، تست و بر روی دامنه اصلی کارفرما مستقر گردید.\n\nپنل مدیریت به همراه مستندات آموزشی در اختیار کارفرما قرار گرفت و از این تاریخ به مدت ۶ ماه، دوره خدمات پشتیبانی و نگهداری رایگان آغاز می‌گردد.`
    },
    {
      id: 'proposal',
      name: 'پیشنهاد فنی و برآورد معماری وب‌سایت',
      type: 'official' as const,
      subject: 'پیشنهاد معماری فنی و بهینه‌سازی زیرساخت وب',
      recipientTitle: 'ریاست محترم شرکت ...',
      body: `با درود و احترام؛\nدر پاسخ به استعلام آن مجموعه محترم در خصوص راه‌اندازی بستر آنلاین و فروشگاهی، تیم فنی استودیو مریدی مفتخر است پیشنهاد فنی مبتنی بر معماری مدرن و بهینه، لود سریع زیر ۱.۵ ثانیه و سازگاری کامل با شبکه پرداخت شتاب را به پیوست حضورتان تقدیم دارد.\n\nآمادگی خود را جهت برگزاری جلسه هماهنگی حضوری یا آنلاین اعلام می‌داریم.`
    }
  ];

  onMount(async () => {
    try {
      const db = getDatabase();
      clients = await db.getClients();

      if (letterId) {
        const existing = await db.getLetterById(letterId);
        if (existing) {
          letter = existing;
        }
      }
    } catch (e) {
      console.error('Failed to load letter editor', e);
    } finally {
      loading = false;
    }
  });

  function applyTemplate(tmplId: string) {
    const tmpl = templates.find(t => t.id === tmplId);
    if (tmpl) {
      if (letter.body && !confirm('آیا مایلید متن فعلی با قالب جدید جایگزین شود؟')) {
        return;
      }
      letter.type = tmpl.type;
      letter.subject = tmpl.subject;
      letter.recipientTitle = tmpl.recipientTitle;
      letter.body = tmpl.body;
    }
  }

  function handleClientSelect(e: Event) {
    const clientId = (e.target as HTMLSelectElement).value;
    if (!clientId) return;
    const cl = clients.find(c => c.id === clientId);
    if (cl) {
      letter.recipientName = cl.name;
      letter.recipientCompany = cl.company || '';
      letter.recipientTitle = cl.company 
        ? `مدیریت محترم ${cl.company}، جناب آقای ${cl.name}`
        : `کارفرمای محترم، جناب آقای ${cl.name}`;
    }
  }

  async function handleSave(andPrint = false) {
    if (!letter.subject.trim()) {
      alert('لطفاً موضوع نامه را مشخص نمایید.');
      return;
    }
    if (!letter.recipientTitle.trim()) {
      alert('لطفاً عنوان گیرنده یا مخاطب نامه را وارد کنید.');
      return;
    }
    if (!letter.body.trim()) {
      alert('لطفاً متن اصلی نامه را وارد کنید.');
      return;
    }

    if (!isValidUUID(letter.id)) {
      letter.id = generateUUID();
    }

    saving = true;
    try {
      const db = getDatabase();
      await db.saveLetter(letter);
      alert('نامه رسمی با موفقیت ذخیره گردید.');
      if (andPrint) {
        onNavigate('letter-print', letter.id);
      } else {
        onNavigate('letters');
      }
    } catch (e: any) {
      console.error('Failed to save letter', e);
      const msg = e?.message || e?.details || 'خطا در ذخیره نامه رسمی';
      alert(`خطا در ذخیره نامه: ${msg}`);
    } finally {
      saving = false;
    }
  }
</script>

<div class="letter-editor-view">
  <div class="view-header">
    <div class="header-titles">
      <h2>{letterId ? 'ویرایش نامه رسمی' : 'نگارش نامه رسمی و قرارداد جدید'}</h2>
      <p>تنظیم سربرگ رسمی، مشخصات گیرنده، متن حقوقی و اطلاعات امضا جهت چاپ روی سربرگ A4</p>
    </div>
    <div class="header-actions">
      <button class="btn btn-outline" on:click={() => onNavigate('letters')}>
        <ArrowRight size={16} />
        <span>انصراف و بازگشت</span>
      </button>
      <button class="btn btn-secondary" disabled={saving} on:click={() => handleSave(true)}>
        <Printer size={16} />
        <span>ذخیره و چاپ روی سربرگ</span>
      </button>
      <button class="btn btn-primary" disabled={saving} on:click={() => handleSave(false)}>
        <Save size={16} />
        <span>{saving ? 'در حال ذخیره...' : 'ذخیره نامه'}</span>
      </button>
    </div>
  </div>

  {#if loading}
    <div class="loading-state">در حال بارگذاری فرم نامه...</div>
  {:else}
    <!-- Template Preset Bar -->
    <div class="template-selector-card">
      <div class="tmpl-title">
        <Sparkles size={16} />
        <span>استفاده از قالب‌های آماده:</span>
      </div>
      <div class="tmpl-buttons">
        {#each templates as tmpl}
          <button type="button" class="tmpl-btn" on:click={() => applyTemplate(tmpl.id)}>
            {tmpl.name}
          </button>
        {/each}
      </div>
    </div>

    <div class="form-container">
      <!-- 1. Metadata -->
      <div class="form-card">
        <div class="card-header">
          <h3>۱. اطلاعات سربرگ و اندیکاتور</h3>
        </div>

        <div class="inputs-row">
          <div class="input-field flex-1">
            <label>نوع سند</label>
            <select bind:value={letter.type}>
              <option value="official">نامه رسمی اداری</option>
              <option value="contract">قرارداد همکاری و توسعه</option>
              <option value="handover">صورتجلسه تحویل نهایی</option>
              <option value="recommendation">معرفی‌نامه و تاییدیه</option>
            </select>
          </div>
          <div class="input-field flex-1">
            <label>شماره اندیکاتور / نامه</label>
            <input type="text" bind:value={letter.letterNumber} />
          </div>
          <div class="input-field flex-1">
            <label>تاریخ صدور (شمسی)</label>
            <input type="text" placeholder="۱۴۰۴/۰۶/۲۰" bind:value={letter.letterDate} />
          </div>
          <div class="input-field flex-1">
            <label>پیوست نامه</label>
            <input type="text" placeholder="ندارد / دارد / ۱ برگ" bind:value={letter.attachment} />
          </div>
        </div>
      </div>

      <!-- 2. Recipient -->
      <div class="form-card">
        <div class="card-header card-header-between">
          <h3>۲. مشخصات گیرنده و موضوع نامه</h3>
          {#if clients.length > 0}
            <div class="client-preset">
              <span>انتخاب از لیست مشتریان:</span>
              <select on:change={handleClientSelect}>
                <option value="">-- انتخاب مشتری --</option>
                {#each clients as cl}
                  <option value={cl.id}>{cl.name} ({cl.company || 'شخصی'})</option>
                {/each}
              </select>
            </div>
          {/if}
        </div>

        <div class="inputs-row">
          <div class="input-field flex-2">
            <label>موضوع نامه یا قرارداد *</label>
            <input
              type="text"
              placeholder="مثال: قرارداد طراحی، پیاده‌سازی و راه‌اندازی وب‌سایت"
              bind:value={letter.subject}
            />
          </div>
          <div class="input-field flex-1">
            <label>وضعیت سند</label>
            <select bind:value={letter.status}>
              <option value="published">صادرشده / نهایی</option>
              <option value="draft">پیش‌نویس</option>
              <option value="archived">بایگانی‌شده</option>
            </select>
          </div>
        </div>

        <div class="inputs-row">
          <div class="input-field flex-2">
            <label>عنوان رسمی گیرنده (در صدر نامه ظاهر می‌شود) *</label>
            <input
              type="text"
              placeholder="مثال: ریاست محترم شرکت پیشگامان، جناب آقای مهندس احمدی"
              bind:value={letter.recipientTitle}
            />
          </div>
          <div class="input-field flex-1">
            <label>نام مخاطب (اختیاری)</label>
            <input type="text" placeholder="نام و نام خانوادگی" bind:value={letter.recipientName} />
          </div>
          <div class="input-field flex-1">
            <label>شرکت / ارگان (اختیاری)</label>
            <input type="text" placeholder="نام سازمان یا برند" bind:value={letter.recipientCompany} />
          </div>
        </div>
      </div>

      <!-- 3. Letter Body -->
      <div class="form-card">
        <div class="card-header">
          <h3>۳. متن اصلی نامه رسمی یا مفاد قرارداد</h3>
        </div>

        <div class="input-field">
          <label>متن رسمی (پاراگراف‌ها و بندها):</label>
          <textarea
            rows="12"
            placeholder="متن رسمی نامه را وارد نمایید..."
            bind:value={letter.body}
          ></textarea>
        </div>
      </div>

      <!-- 4. Signee -->
      <div class="form-card">
        <div class="card-header">
          <h3>۴. اطلاعات امضاکننده سند</h3>
        </div>

        <div class="inputs-row">
          <div class="input-field flex-1">
            <label>نام امضاکننده</label>
            <input type="text" bind:value={letter.signeeName} />
          </div>
          <div class="input-field flex-1">
            <label>سمت سازمانی امضاکننده</label>
            <input type="text" bind:value={letter.signeeTitle} />
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="bottom-actions">
        <button class="btn btn-outline" on:click={() => onNavigate('letters')}>
          <ArrowRight size={16} />
          <span>انصراف</span>
        </button>
        <button class="btn btn-secondary" disabled={saving} on:click={() => handleSave(true)}>
          <Printer size={16} />
          <span>ذخیره و پیش‌نمایش چاپ سربرگ A4</span>
        </button>
        <button class="btn btn-primary" disabled={saving} on:click={() => handleSave(false)}>
          <Save size={16} />
          <span>{saving ? 'در حال ذخیره...' : 'ذخیره نامه رسمی'}</span>
        </button>
      </div>
    </div>
  {/if}
</div>

<style>
  .letter-editor-view {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .view-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 16px;
  }

  .header-titles h2 {
    font-size: 22px;
    font-weight: 800;
    color: #1e293b;
    margin-bottom: 4px;
  }

  .header-titles p {
    font-size: 13.5px;
    color: #64748b;
  }

  .header-actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 10px 18px;
    border-radius: 10px;
    font-size: 13.5px;
    font-weight: 700;
    font-family: inherit;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
  }

  .btn-primary { background: #1e40af; color: #ffffff; }
  .btn-primary:hover { background: #1e3a8a; }

  .btn-secondary { background: #eff6ff; color: #1e40af; border: 1px solid #bfdbfe; }
  .btn-secondary:hover { background: #dbeafe; }

  .btn-outline { background: #ffffff; color: #475569; border: 1px solid #cbd5e1; }
  .btn-outline:hover { background: #f8fafc; }

  /* Templates selector */
  .template-selector-card {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 12px 18px;
    display: flex;
    align-items: center;
    gap: 14px;
    flex-wrap: wrap;
  }

  .tmpl-title {
    font-size: 13px;
    font-weight: 700;
    color: #334155;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .tmpl-buttons {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .tmpl-btn {
    background: #ffffff;
    border: 1px solid #cbd5e1;
    color: #1e40af;
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 700;
    font-family: inherit;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .tmpl-btn:hover {
    background: #eff6ff;
    border-color: #93c5fd;
  }

  /* Form structure */
  .form-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .form-card {
    background: #ffffff;
    border-radius: 16px;
    border: 1px solid #e2e8f0;
    padding: 24px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  }

  .card-header {
    margin-bottom: 18px;
    padding-bottom: 12px;
    border-bottom: 1px solid #f1f5f9;
  }

  .card-header h3 {
    font-size: 15px;
    font-weight: 800;
    color: #1e293b;
    margin: 0;
  }

  .card-header-between {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
  }

  .client-preset {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: #64748b;
  }

  .client-preset select {
    padding: 4px 8px;
    border-radius: 6px;
    border: 1px solid #cbd5e1;
    font-family: inherit;
    font-size: 12px;
  }

  .inputs-row {
    display: flex;
    gap: 16px;
    margin-bottom: 16px;
    flex-wrap: wrap;
  }

  .inputs-row:last-child {
    margin-bottom: 0;
  }

  .flex-1 { flex: 1; min-width: 180px; }
  .flex-2 { flex: 2; min-width: 280px; }

  .input-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .input-field label {
    font-size: 12px;
    font-weight: 700;
    color: #475569;
  }

  .input-field input, .input-field select, .input-field textarea {
    padding: 9px 12px;
    border-radius: 8px;
    border: 1px solid #cbd5e1;
    font-size: 13px;
    font-family: inherit;
    background: #ffffff;
    outline: none;
    line-height: 1.6;
  }

  .input-field input:focus, .input-field select:focus, .input-field textarea:focus {
    border-color: #1e40af;
    box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.08);
  }

  .bottom-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding-top: 10px;
  }

  .loading-state {
    padding: 60px;
    text-align: center;
    color: #64748b;
  }
</style>
