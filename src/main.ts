import './app.css';
import App from './App.svelte';
import { mount } from 'svelte';

const target = document.getElementById('app');

const app = mount(App, {
  target: target || document.body
});

export default app;
