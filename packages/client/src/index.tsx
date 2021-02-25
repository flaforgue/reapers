import 'babylonjs-loaders';
import React from 'react';
import ReactDOM from 'react-dom';
import './assets/styles/global.scss';
import App from './app';
import { GLTFFileLoader } from 'babylonjs-loaders';

BABYLON.SceneLoader.OnPluginActivatedObservable.addOnce(function (plugin) {
  const loader = (plugin as unknown) as GLTFFileLoader;
  loader.animationStartMode = BABYLON.GLTFLoaderAnimationStartMode.NONE;
});

ReactDOM.render(<App />, document.getElementById('root'));
