import ReactDOM from 'react-dom';
// import '@babylonjs/loaders';
import { GLTFFileLoader, GLTFLoaderAnimationStartMode } from '@babylonjs/loaders';
import * as BABYLON from '@babylonjs/core';
import App from './App';

BABYLON.SceneLoader.OnPluginActivatedObservable.addOnce(function (plugin) {
  const loader = (plugin as unknown) as GLTFFileLoader;
  loader.animationStartMode = GLTFLoaderAnimationStartMode.NONE;
});

ReactDOM.render(<App />, document.getElementById('root'));
