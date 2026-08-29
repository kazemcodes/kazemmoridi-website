<script lang="ts">
  import { projectsData, type Project } from '../data/projects';
  export let onOpenPreview: (project: Project) => void;

  let activeFilter = 'all';

  // Filters without emojis
  const filters = [
    { id: 'all', label: 'همه' },
    { id: 'websites', label: 'وب‌سایت‌ها' },
    { id: 'apps', label: 'اپلیکیشن‌ها' },
    { id: 'tools', label: 'ابزارها' }
  ];

  $: filteredProjects = projectsData.filter((p) => {
    if (activeFilter === 'all') return true;
    return p.category === activeFilter;
  });
</script>

<section class="projects-section" id="projects">
  <div class="container">
    <div class="section-header">
      <span class="accent-label">نمونه کارها</span>
      <h2 class="title">پروژه‌های اخیر ما</h2>
      <p class="description">مجموعه‌ای از پلتفرم‌ها و محصولاتی که با افتخار توسعه داده‌ایم.</p>
    </div>

    <div class="filters">
      {#each filters as filter}
        <button
          class="filter-btn {activeFilter === filter.id ? 'active' : ''}"
          on:click={() => (activeFilter = filter.id)}
        >
          {filter.label}
        </button>
      {/each}
    </div>

    <div class="projects-grid">
      {#each filteredProjects as project (project.id)}
        <div class="project-card">
          <div class="card-top">
            {#if project.url}
              <a href={project.url} target="_blank" rel="noopener noreferrer" class="display-url">
                <span class="link-icon"></span>
                {project.displayUrl || 'مشاهده لینک'}
              </a>
            {/if}
            <span class="status-badge {project.status === 'live' ? 'status-live' : 'status-dev'}">
              {project.status === 'live' ? 'آنلاین' : 'در حال توسعه'}
            </span>
          </div>

          <div class="card-content">
            <h3 class="project-title">{project.title}</h3>
            {#if project.tagline}
              <p class="tagline">{project.tagline}</p>
            {/if}
            <p class="project-desc">{project.description}</p>

            {#if project.highlights && project.highlights.length > 0}
              <ul class="highlights-box">
                {#each project.highlights as highlight}
                  <li>{highlight}</li>
                {/each}
              </ul>
            {/if}

            <div class="tech-stack">
              {#each project.techStack as tech}
                <span class="tech-pill">{tech}</span>
              {/each}
            </div>
          </div>

          <div class="card-actions">
            <div class="main-actions">
              {#if project.url}
                <a href={project.url} target="_blank" rel="noopener noreferrer" class="btn-primary">مشاهده سایت</a>
              {/if}
              {#if project.previewAvailable}
                <button class="btn-outline" on:click={() => onOpenPreview(project)}>پیش‌نمایش</button>
              {/if}
            </div>
            {#if project.githubUrl}
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" class="github-link">
                کد در گیت‌هاب
              </a>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>

<style>
  .projects-section {
    padding: 6rem 0;
    background: #fafbfc;
    direction: rtl;
  }
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1.5rem;
  }

  /* Header */
  .section-header {
    text-align: center;
    max-width: 600px;
    margin: 0 auto 3rem auto;
  }
  .accent-label {
    display: inline-block;
    background: rgba(30, 64, 175, 0.1);
    color: #1e40af;
    font-size: 13px;
    font-weight: 600;
    padding: 4px 12px;
    border-radius: 99px;
    margin-bottom: 16px;
  }
  .title {
    font-size: 28px;
    font-weight: 800;
    color: #1e293b;
    margin-bottom: 16px;
  }
  .description {
    font-size: 15px;
    color: #64748b;
    line-height: 1.8;
  }

  /* Filters */
  .filters {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 3rem;
  }
  .filter-btn {
    background: transparent;
    border: none;
    padding: 10px 20px;
    border-radius: 99px;
    font-family: inherit;
    font-size: 14px;
    font-weight: 600;
    color: #64748b;
    cursor: pointer;
    transition: all 0.2s;
  }
  .filter-btn:hover {
    color: #1e293b;
    background: rgba(241, 245, 249, 0.8);
  }
  .filter-btn.active {
    background: #1e40af;
    color: #ffffff;
  }

  /* Grid */
  .projects-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  @media (min-width: 1024px) {
    .projects-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  /* Card */
  .project-card {
    background: #ffffff;
    border: 1px solid #f1f5f9;
    border-radius: 20px;
    padding: 28px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
    display: flex;
    flex-direction: column;
    transition: transform 0.3s, box-shadow 0.3s;
  }
  .project-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.04);
  }

  /* Card Top */
  .card-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 1px solid #f8fafc;
  }
  .display-url {
    font-size: 13px;
    color: #0ea5e9;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: 600;
  }
  .link-icon {
    display: inline-block;
    width: 14px;
    height: 14px;
    background-color: currentColor;
    mask-image: url('data:image/svg+xml;utf8,<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 14L21 3M21 3H15M21 3V9M11 5H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21H17C18.1046 21 19 20.1046 19 19V13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>');
    -webkit-mask-image: url('data:image/svg+xml;utf8,<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 14L21 3M21 3H15M21 3V9M11 5H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21H17C18.1046 21 19 20.1046 19 19V13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>');
    mask-size: contain;
    -webkit-mask-size: contain;
    mask-repeat: no-repeat;
    -webkit-mask-repeat: no-repeat;
    transform: scaleX(-1); /* For RTL */
  }
  .status-badge {
    font-size: 11px;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 99px;
  }
  .status-live {
    background: rgba(5, 150, 105, 0.1);
    color: #059669;
  }
  .status-dev {
    background: rgba(249, 115, 22, 0.1);
    color: #f97316;
  }

  /* Content */
  .card-content {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }
  .project-title {
    font-size: 20px;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 4px 0;
  }
  .tagline {
    font-size: 13px;
    color: #1e40af;
    font-weight: 600;
    margin: 0 0 16px 0;
  }
  .project-desc {
    font-size: 14px;
    color: #64748b;
    line-height: 1.8;
    margin: 0 0 20px 0;
  }

  .highlights-box {
    background: #f8fafc;
    border-radius: 12px;
    padding: 16px;
    margin: 0 0 20px 0;
    list-style: none;
  }
  .highlights-box li {
    font-size: 13px;
    color: #475569;
    position: relative;
    padding-right: 16px;
    margin-bottom: 8px;
    line-height: 1.6;
  }
  .highlights-box li:last-child {
    margin-bottom: 0;
  }
  .highlights-box li::before {
    content: '';
    position: absolute;
    right: 0;
    top: 8px;
    width: 6px;
    height: 6px;
    background: #0ea5e9;
    border-radius: 50%;
  }

  .tech-stack {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 24px;
    margin-top: auto;
  }
  .tech-pill {
    font-size: 11px;
    font-family: monospace;
    background: #ffffff;
    color: #64748b;
    border: 1px solid #e2e8f0;
    padding: 4px 8px;
    border-radius: 6px;
  }

  /* Actions */
  .card-actions {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-top: auto;
    padding-top: 20px;
    border-top: 1px solid #f8fafc;
  }
  @media (min-width: 640px) {
    .card-actions {
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }
  }
  .main-actions {
    display: flex;
    gap: 12px;
  }
  .btn-primary, .btn-outline {
    font-family: inherit;
    font-size: 13px;
    font-weight: 600;
    padding: 10px 20px;
    border-radius: 10px;
    text-decoration: none;
    cursor: pointer;
    transition: all 0.2s;
    text-align: center;
  }
  .btn-primary {
    background: #1e40af;
    color: #ffffff;
    border: none;
  }
  .btn-primary:hover {
    background: #1e3a8a;
  }
  .btn-outline {
    background: transparent;
    color: #475569;
    border: 1px solid #cbd5e1;
  }
  .btn-outline:hover {
    background: #f8fafc;
    color: #1e293b;
  }
  
  .github-link {
    font-size: 12px;
    color: #64748b;
    text-decoration: none;
    transition: color 0.2s;
  }
  .github-link:hover {
    color: #1e293b;
    text-decoration: underline;
  }
</style>
