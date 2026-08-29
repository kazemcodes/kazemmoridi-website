<script lang="ts">
  import { testimonialsData } from '../data/testimonials';
  import { toPersianDigits } from '../utils/persianDigits';
</script>

<section class="testimonials-section">
  <div class="container">
    <div class="section-header">
      <h2 class="section-title">نظرات مشتریان</h2>
    </div>

    <div class="testimonials-grid">
      {#each testimonialsData as item (item.id)}
        <div class="testimonial-card">
          <div class="quote-mark"></div>
          
          <div class="comment-wrapper">
            <p class="comment-text">
              {item.comment}
            </p>
          </div>

          <div class="author-row">
            <div class="avatar-circle">
              {item.name.charAt(0)}
            </div>
            <div class="author-info">
              <h4 class="author-name">{item.name}</h4>
              <div class="author-role">{item.role} در {item.company}</div>
              <div class="rating-row">
                <span class="rating-text">امتیاز: {toPersianDigits(item.rating)} از ۵</span>
                {#if item.verified}
                  <span class="verified-badge">
                    <span class="check-icon"></span>
                    کارفرمای تاییدشده
                  </span>
                {/if}
              </div>
            </div>
          </div>

          {#if item.projectUrl}
            <a href={item.projectUrl} target="_blank" rel="noopener noreferrer" class="project-link">
              مشاهده پروژه &larr;
            </a>
          {/if}
        </div>
      {/each}
    </div>
  </div>
</section>

<style>
  .testimonials-section {
    padding: 100px 0;
    background-color: #fafbfc;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
  }

  .section-header {
    text-align: center;
    margin-bottom: 64px;
  }

  .section-title {
    font-size: 2rem;
    font-weight: 800;
    color: #1e293b;
    margin: 0;
  }

  .testimonials-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 24px;
  }

  @media (min-width: 768px) {
    .testimonials-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (min-width: 1024px) {
    .testimonials-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  .testimonial-card {
    background: #ffffff;
    border-radius: 20px;
    padding: 32px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    display: flex;
    flex-direction: column;
    position: relative;
    transition: box-shadow 0.3s ease;
  }

  .testimonial-card:hover {
    box-shadow: 0 10px 25px rgba(0,0,0,0.05);
  }

  .quote-mark {
    position: absolute;
    top: 24px;
    right: 32px;
    opacity: 0.1;
    pointer-events: none;
  }
  
  .quote-mark::before {
    content: '"';
    font-family: serif;
    font-size: 80px;
    line-height: 1;
    color: #1e40af;
  }

  .comment-wrapper {
    flex-grow: 1;
    margin-bottom: 32px;
    position: relative;
    z-index: 1;
  }

  .comment-text {
    font-size: 1rem;
    line-height: 1.8;
    color: #475569;
    font-style: italic;
    margin: 0;
  }

  .author-row {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 16px;
    border-top: 1px solid #f1f5f9;
    padding-top: 24px;
  }

  .avatar-circle {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: #eff6ff;
    color: #1e40af;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    font-weight: 800;
  }

  .author-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .author-name {
    font-size: 1rem;
    font-weight: 700;
    color: #1e293b;
    margin: 0;
  }

  .author-role {
    font-size: 0.8125rem;
    color: #64748b;
  }

  .rating-row {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 4px;
  }

  .rating-text {
    font-size: 0.75rem;
    color: #0ea5e9;
    font-weight: 600;
  }

  .verified-badge {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 0.75rem;
    color: #059669;
    font-weight: 600;
  }

  .check-icon {
    width: 12px;
    height: 12px;
    position: relative;
  }

  .check-icon::after {
    content: '';
    position: absolute;
    left: 4px;
    top: 2px;
    width: 4px;
    height: 8px;
    border: solid #059669;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }

  .project-link {
    font-size: 0.875rem;
    color: #1e40af;
    text-decoration: none;
    font-weight: 600;
    transition: color 0.2s ease;
    align-self: flex-start;
  }

  .project-link:hover {
    color: #0ea5e9;
  }
</style>
