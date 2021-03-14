import type { SvelteComponent } from 'svelte';
import Home from '../pages/Home.svelte';
import Play from '../pages/Play.svelte';
import NotFound from '../pages/NotFound.svelte';

type RouteName = '/' | '/play' | '*';

const routes: Record<RouteName, typeof SvelteComponent> = {
  '/': Home,
  '/play': Play,
  '*': NotFound,
};

export default routes;
