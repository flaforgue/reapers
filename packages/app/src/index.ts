import '@babylonjs/loaders';
import '@babylonjs/inspector';
import App from './App.svelte';

const app = new App({
  target: (document as Document).body as HTMLElement,
});

export default app;

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://www.snowpack.dev/concepts/hot-module-replacement
// if (import.meta.hot) {
//   import.meta.hot.accept();
//   import.meta.hot.dispose(() => {
//     app.$destroy();
//   });
// }
