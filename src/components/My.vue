<template>
    <div ref="threeCanvas1">
        <!-- <canvas ref="threeCanvas"></canvas> -->
    </div>
    asdasd
    <div ref="threeCanvas2">

    </div>
</template>

<script setup>

import * as THREE from 'three';
import { ref, onMounted } from 'vue';

const threeCanvas1 = ref(null);
 

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 20, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth/2, window.innerHeight/2 );
renderer.setAnimationLoop( animate );

onMounted(() => {
 {
    threeCanvas1.value.appendChild( renderer.domElement );

}});
const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5;

function animate() {

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render( scene, camera );

}

</script>
<style>
body { margin: 0; }
</style>