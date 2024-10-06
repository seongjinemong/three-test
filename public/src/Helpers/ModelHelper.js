import { GLTFLoader } from '/node_modules/three/examples/jsm/loaders/GLTFLoader.js';

const scenePath = '/public/models/scene.gltf'

export const LoadGLTFByPath = (scene) => {
    return new Promise((resolve, reject) => {
      // Create a loader
      const loader = new GLTFLoader();
  
      // Load the GLTF file
      loader.load(scenePath, (gltf) => {

        scene.add(gltf.scene);

        // Check for specific Object
        // console.log("All object names:");
        // gltf.scene.traverse((object) => {
        //   if(object.name.includes("fascia"))
        //   console.log(object.name);
        // });

        resolve();
      }, undefined, (error) => {
        reject(error);
      });


    });
};