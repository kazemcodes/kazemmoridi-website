<script lang="ts">
  import { onMount } from 'svelte';
  import { getDatabase, type OfficialLetter, type StudioProfile } from '../../services/db';
  import { toPersianDigits } from '../../utils/persianDigits';
  import { Printer, Edit3, ArrowRight } from 'lucide-svelte';

  export let letterId: string;
  export let onNavigate: (tab: string, param?: string) => void;

  let letter: OfficialLetter | null = null;
  let profile: StudioProfile | null = null;
  let loading = true;

  onMount(async () => {
    try {
      const db = getDatabase();
      const [l, prof] = await Promise.all([
        db.getLetterById(letterId),
        db.getStudioProfile()
      ]);
      letter = l;
      profile = prof;
    } catch (e) {
      console.error('Failed to load letter print data', e);
    } finally {
      loading = false;
    }
  });

  function handlePrint() {
    window.print();
  }
</script>

<div class="letter-print-wrapper">
  <!-- Screen Controls -->
  <div class="screen-controls no-print">
    <div class="controls-left">
      <button class="btn btn-outline" on:click={() => onNavigate('letters')}>
        <ArrowRight size={16} />
        <span>بازگشت به آرشیو نامه‌ها</span>
      </button>
      <button class="btn btn-outline" on:click={() => onNavigate('letter-edit', letterId)}>
        <Edit3 size={16} />
        <span>ویرایش متن نامه</span>
      </button>
    </div>
    <div class="controls-right">
      <button class="btn btn-print" on:click={handlePrint}>
        <Printer size={16} />
        <span>چاپ سربرگ اداری A4 / خروجی PDF</span>
      </button>
    </div>
  </div>

  {#if loading}
    <div class="loading-box no-print">در حال بارگذاری سربرگ اداری...</div>
  {:else if !letter}
    <div class="error-box no-print">نامه اداری مورد نظر یافت نشد.</div>
  {:else}
    <!-- A4 Printable Letterhead Sheet -->
    <div class="a4-letterhead-sheet" id="letter-sheet">
      <!-- Top Header -->
      <header class="letter-header">
        <div class="header-right-brand">
          <div class="logo-box">KM</div>
          <div class="brand-titles">
            <h2>{profile?.brandName || 'استودیو مریدی (KM Studio)'}</h2>
            <span class="brand-sub">توسعه نرم‌افزار و راهکارهای جامع تحت وب</span>
          </div>
        </div>

        <div class="header-center-motto">
          <span>به نام خدا</span>
        </div>

        <div class="header-left-meta">
          <div class="meta-item">
            <span>شماره:</span>
            <strong>{toPersianDigits(letter.letterNumber)}</strong>
          </div>
          <div class="meta-item">
            <span>تاریخ:</span>
            <strong>{toPersianDigits(letter.letterDate)}</strong>
          </div>
          <div class="meta-item">
            <span>پیوست:</span>
            <strong>{letter.attachment || 'ندارد'}</strong>
          </div>
        </div>
      </header>

      <div class="header-divider"></div>

      <!-- Main Letter Content -->
      <main class="letter-main">
        <!-- Recipient -->
        <div class="recipient-block">
          <h3 class="recipient-title">{letter.recipientTitle}</h3>
          <div class="subject-row">
            <span>موضوع:</span>
            <strong>{letter.subject}</strong>
          </div>
        </div>

        <!-- Body Paragraphs -->
        <div class="body-paragraphs">
          {#each letter.body.split('\n') as paragraph}
            {#if paragraph.trim()}
              <p class="letter-p">{paragraph}</p>
            {/if}
          {/each}
        </div>

        <!-- Signoff and Seal -->
        <div class="letter-signoff-section">
          <div class="closing-phrase">با آرزوی توفیق الهی و احترام؛</div>
          <div class="signee-box">
            <strong class="signee-name">{letter.signeeName}</strong>
            <span class="signee-title">{letter.signeeTitle}</span>
            <div class="stamp-signature-area">
              <span class="stamp-label">[محل امضا و مهر استودیو]</span>
            </div>
          </div>
        </div>
      </main>

      <!-- Bottom Letterhead Footer -->
      <footer class="letter-footer">
        <div class="footer-line"></div>
        <div class="footer-details">
          <div class="footer-item">
            <span>نشانی:</span>
            <span>{profile?.address || 'هرمزگان، ایران'}</span>
          </div>
          <div class="footer-item">
            <span>تلفن تماس:</span>
            <span dir="ltr">{toPersianDigits(profile?.phoneDisplay || '۰۹۱۷ ۰۲۸ ۴۴۶۳')}</span>
          </div>
          <div class="footer-item">
            <span>وب‌سایت:</span>
            <span dir="ltr">{profile?.website || 'https://kazemmoridi.ir'}</span>
          </div>
          <div class="footer-item">
            <span>ایمیل:</span>
            <span dir="ltr">{profile?.email || 'kazem.codes@gmail.com'}</span>
          </div>
        </div>
      </footer>
    </div>
  {/if}
</div>

<style>
  .letter-print-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    padding-bottom: 60px;
    direction: rtl;
  }

  .screen-controls {
    width: 100%;
    max-width: 820px;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 14px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }

  .controls-left, .controls-right {
    display: flex;
    gap: 10px;
  }

  .btn {
    padding: 9px 16px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 700;
    font-family: inherit;
    cursor: pointer;
    border: none;
    transition: all 0.15s ease;
  }

  .btn-print {
    background: #1e40af;
    color: #ffffff;
    font-size: 14px;
  }
  .btn-print:hover { background: #1e3a8a; }

  .btn-outline {
    background: #ffffff;
    color: #334155;
    border: 1px solid #cbd5e1;
  }
  .btn-outline:hover { background: #f8fafc; }

  /* A4 Letterhead Sheet */
  .a4-letterhead-sheet {
    width: 210mm;
    min-height: 297mm;
    padding: 20mm 20mm 15mm 20mm;
    background: #ffffff;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    font-family: 'Vazirmatn', Tahoma, sans-serif;
    color: #0f172a;
    line-height: 1.8;
  }

  /* Header */
  .letter-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding-bottom: 12px;
  }

  .header-right-brand {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
  }

  .logo-box {
    width: 48px;
    height: 48px;
    background: #1e40af;
    color: #ffffff;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 900;
    font-size: 20px;
  }

  .brand-titles h2 {
    font-size: 16px;
    font-weight: 900;
    color: #1e40af;
    margin: 0;
  }

  .brand-sub {
    font-size: 11px;
    color: #64748b;
    display: block;
    margin-top: 2px;
  }

  .header-center-motto {
    flex: 1;
    text-align: center;
    font-size: 13px;
    font-weight: 800;
    color: #334155;
    padding-top: 8px;
  }

  .header-left-meta {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
    font-size: 11.5px;
  }

  .meta-item {
    display: flex;
    gap: 6px;
  }

  .meta-item span {
    color: #64748b;
  }

  .header-divider {
    height: 2px;
    background: linear-gradient(90deg, #1e40af 0%, #3b82f6 50%, #93c5fd 100%);
    margin-bottom: 24px;
  }

  /* Main Body */
  .letter-main {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .recipient-block {
    margin-bottom: 24px;
  }

  .recipient-title {
    font-size: 15px;
    font-weight: 800;
    color: #1e293b;
    margin: 0 0 8px 0;
  }

  .subject-row {
    font-size: 13.5px;
    display: flex;
    gap: 6px;
    color: #334155;
  }

  .subject-row strong {
    color: #1e40af;
  }

  .body-paragraphs {
    margin-bottom: 36px;
    text-align: justify;
  }

  .letter-p {
    font-size: 13px;
    line-height: 2;
    margin-bottom: 12px;
    color: #1e293b;
    text-indent: 24px;
  }

  /* Signoff */
  .letter-signoff-section {
    margin-top: auto;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    padding-left: 20px;
  }

  .closing-phrase {
    font-size: 13px;
    font-weight: 700;
    color: #334155;
    margin-bottom: 16px;
  }

  .signee-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 220px;
    text-align: center;
  }

  .signee-name {
    font-size: 14px;
    font-weight: 800;
    color: #1e293b;
  }

  .signee-title {
    font-size: 12px;
    color: #64748b;
    margin-top: 2px;
  }

  .stamp-signature-area {
    margin-top: 14px;
    height: 70px;
    width: 140px;
    border: 1px dashed #cbd5e1;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .stamp-label {
    font-size: 10px;
    color: #94a3b8;
  }

  /* Footer */
  .letter-footer {
    padding-top: 12px;
  }

  .footer-line {
    height: 1px;
    background: #cbd5e1;
    margin-bottom: 8px;
  }

  .footer-details {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 8px;
    font-size: 10px;
    color: #64748b;
  }

  .footer-item {
    display: flex;
    gap: 4px;
  }

  /* Print Media */
  @media print {
    body {
      background: #ffffff !important;
      margin: 0 !important;
      padding: 0 !important;
    }

    .no-print {
      display: none !important;
    }

    .letter-print-wrapper {
      padding: 0 !important;
    }

    .a4-letterhead-sheet {
      width: 100% !important;
      min-height: auto !important;
      box-shadow: none !important;
      padding: 0 !important;
      margin: 0 !important;
    }

    @page {
      size: A4 portrait;
      margin: 15mm 15mm 15mm 15mm;
    }
  }

  .loading-box, .error-box {
    padding: 60px;
    text-align: center;
    color: #64748b;
  }
</style>
