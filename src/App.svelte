<script lang="ts">
  import { onMount } from 'svelte';
  import Navbar from './components/Navbar.svelte';
  import Hero from './components/Hero.svelte';
  import StatsBar from './components/StatsBar.svelte';
  import Services from './components/Services.svelte';
  import Projects from './components/Projects.svelte';
  import Pipeline from './components/Pipeline.svelte';
  import CostCalculator from './components/CostCalculator.svelte';
  import WhyUs from './components/WhyUs.svelte';
  import Process from './components/Process.svelte';
  import IReaderSpotlight from './components/IReaderSpotlight.svelte';
  import Testimonials from './components/Testimonials.svelte';
  import ContactSection from './components/ContactSection.svelte';
  import Footer from './components/Footer.svelte';
  import PreviewModal from './components/PreviewModal.svelte';
  import AdminApp from './admin/AdminApp.svelte';
  import type { Project } from './data/projects';

  let previewModalOpen = false;
  let selectedProject: Project | null = null;
  let isAdminRoute = false;

  function checkRoute() {
    if (typeof window === 'undefined') return;
    const path = window.location.pathname;
    const hash = window.location.hash;
    isAdminRoute = path.startsWith('/admin') || hash.startsWith('#/admin');
  }

  onMount(() => {
    checkRoute();
    window.addEventListener('hashchange', checkRoute);
    window.addEventListener('popstate', checkRoute);

    // Keyboard shortcut for quick admin access: Ctrl + Alt + A
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.altKey && (e.key === 'a' || e.key === 'A' || e.key === 'ش')) {
        e.preventDefault();
        if (isAdminRoute) {
          handleExitAdmin();
        } else {
          window.history.pushState({}, '', '/admin');
          checkRoute();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('hashchange', checkRoute);
      window.removeEventListener('popstate', checkRoute);
      window.removeEventListener('keydown', handleKeyDown);
    };
  });

  function handleOpenPreview(project: Project) {
    selectedProject = project;
    previewModalOpen = true;
    document.body.style.overflow = 'hidden';
  }

  function handleClosePreview() {
    previewModalOpen = false;
    selectedProject = null;
    document.body.style.overflow = '';
  }

  function handleExitAdmin() {
    if (typeof window !== 'undefined') {
      if (window.location.pathname.startsWith('/admin')) {
        window.history.pushState({}, '', '/');
      }
      window.location.hash = '';
      isAdminRoute = false;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
</script>

{#if isAdminRoute}
  <AdminApp onExitAdmin={handleExitAdmin} />
{:else}
  <div class="app-root">
    <Navbar />
    <main>
      <Hero />
      <StatsBar />
      <Services />
      <Projects onOpenPreview={handleOpenPreview} />
      <Pipeline />
      <CostCalculator />
      <WhyUs />
      <Process />
      <IReaderSpotlight onOpenPreview={handleOpenPreview} />
      <Testimonials />
      <ContactSection />
    </main>
    <Footer />

    <!-- Global Preview Modal -->
    <PreviewModal 
      isOpen={previewModalOpen} 
      project={selectedProject} 
      onClose={handleClosePreview} 
    />
  </div>
{/if}

<style>
  .app-root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: var(--bg-subtle);
  }

  main {
    flex: 1;
  }
</style>
