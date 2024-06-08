/* eslint-disable react-hooks/exhaustive-deps */
import * as THREE from "three";
import { TrackballControls } from "../node_modules/three/examples/jsm/controls/TrackballControls.js";

import { useEffect, useRef } from "react";

function Box3D() {
  const refContainer = useRef(null);

  const create3D = () => {
    try {
      // Scene
      const scene = new THREE.Scene();
      // Camera
      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.6,
        1200
      );
      camera.position.z = 5; // Set camera position
      // Renderer
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setClearColor("#233143"); // Set background colour
      renderer.setSize(window.innerWidth, window.innerHeight);
      refContainer.current.appendChild(renderer.domElement); // Add renderer to HTML as a canvas element
      // document.body.appendChild(renderer.domElement); // Add renderer to HTML as a canvas element
      // Make Canvas Responsive
      window.addEventListener("resize", () => {
        renderer.setSize(window.innerWidth, window.innerHeight); // Update size
        camera.aspect = window.innerWidth / window.innerHeight; // Update aspect ratio
        camera.updateProjectionMatrix(); // Apply changes
      });
      // Create box:
      const boxGeometry = new THREE.BoxGeometry(2, 2, 2); // Define geometry
      const boxMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff }); // Define material
      const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial); // Build box
      boxMesh.rotation.set(40, 0, 40); // Set box initial rotation
      scene.add(boxMesh); // Add box to canvas
      // Create spheres:
      const sphereMeshes = [];
      const sphereGeometry = new THREE.SphereGeometry(0.1, 32, 32); // Define geometry
      const sphereMaterial = new THREE.MeshLambertMaterial({ color: 0xc56cef }); // Define material
      for (let i = 0; i < 4; i++) {
        sphereMeshes[i] = new THREE.Mesh(sphereGeometry, sphereMaterial); // Build sphere
        sphereMeshes[i].position.set(0, 0, 0);
        scene.add(sphereMeshes[i]); // Add sphere to canvas
      }
      // Lights
      const lights = []; // Storage for lights
      const lightHelpers = []; // Storage for light helpers
      // Properties for each light
      const lightValues = [
        { colour: 0x14d14a, intensity: 8, dist: 12, x: 1, y: 0, z: 8 },
        { colour: 0xbe61cf, intensity: 6, dist: 12, x: -2, y: 1, z: -10 },
        { colour: 0x00ffff, intensity: 3, dist: 10, x: 0, y: 10, z: 1 },
        { colour: 0x00ff00, intensity: 6, dist: 12, x: 0, y: -10, z: -1 },
        { colour: 0x16a7f5, intensity: 6, dist: 12, x: 10, y: 3, z: 0 },
        { colour: 0x90f615, intensity: 6, dist: 12, x: -10, y: -1, z: 0 },
      ];
      for (let i = 0; i < 6; i++) {
        // Loop 6 times to add each light to lights array
        // using the lightValues array to input properties
        lights[i] = new THREE.PointLight(
          lightValues[i]["colour"],
          lightValues[i]["intensity"],
          lightValues[i]["dist"]
        );

        lights[i].position.set(
          lightValues[i]["x"],
          lightValues[i]["y"],
          lightValues[i]["z"]
        );

        scene.add(lights[i]);
        // Add light helpers for each light
        lightHelpers[i] = new THREE.PointLightHelper(lights[i]);
        scene.add(lightHelpers[i]);
      }
      //Trackball Controls for Camera
      const controls = new TrackballControls(camera, renderer.domElement);
      controls.rotateSpeed = 4;
      // controls.dynamicDampingFactor = 1;
      controls.dynamicDampingFactor = 0.15;
      // Axes Helper
      // const axesHelper = new THREE.AxesHelper(5);
      // scene.add(axesHelper); // X axis = red, Y axis = green, Z axis = blue
      // Trigonometry Constants for Orbital Paths
      let theta = 0; // Current angle
      // Angle increment on each render
      const dTheta = (2 * Math.PI) / 100;
      // Rendering Function
      const rendering = function () {
        // Rerender every time the page refreshes (pause when on another tab)
        requestAnimationFrame(rendering);
        // Update trackball controls
        controls.update();
        // Constantly rotate box
        // scene.rotation.z -= 0.005;
        // scene.rotation.x -= 0.01;
        //Increment theta, and update sphere coords based off new value
        theta += dTheta;
        // Store trig functions for sphere orbits
        // MUST BE INSIDE RENDERING FUNCTION OR THETA VALUES ONLY GET SET ONCE
        const trigs = [
          {
            x: Math.cos(theta * 1.05),
            y: Math.sin(theta * 1.05),
            z: Math.cos(theta * 1.05),
            r: 2,
          },
          {
            x: Math.cos(theta * 0.8),
            y: Math.sin(theta * 0.8),
            z: Math.sin(theta * 0.8),
            r: 2.25,
          },
          {
            x: Math.cos(theta * 1.25),
            y: Math.cos(theta * 1.25),
            z: Math.sin(theta * 1.25),
            r: 2.5,
          },
          {
            x: Math.sin(theta * 0.6),
            y: Math.cos(theta * 0.6),
            z: Math.sin(theta * 0),
            r: 2.75,
          },
        ];
        // Loop 4 times (for each sphere), updating the position
        for (let i = 0; i < 4; i++) {
          sphereMeshes[i].position.x = trigs[i]["r"] * trigs[i]["x"];
          sphereMeshes[i].position.y = trigs[i]["r"] * trigs[i]["y"];
          sphereMeshes[i].position.z = trigs[i]["r"] * trigs[i]["z"];
        }
        renderer.render(scene, camera);
      };
      rendering();
    } catch (error) {
      console.log("error :", error);
    }
  };

  useEffect(() => {
    create3D();
  }, []);
  return <div ref={refContainer}></div>;
}

export default Box3D;
