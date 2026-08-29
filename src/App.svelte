<script lang="ts">
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
  import type { Project } from './data/projects';

  let previewModalOpen = false;
  let selectedProject: Project | null = null;

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
</script>

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
