import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

function init(){
    const scene = new THREE.Scene();
    const div = document.body.querySelector(".contain");
    const canvas = document.body.querySelector(".model");
    const cards = document.body.querySelector(".texts");
    const arrow = document.body.querySelectorAll(".model-contain .arrow");

    const camera = new THREE.PerspectiveCamera(75, div.offsetWidth / div.offsetHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({canvas, alpha:true});
    scene.add(camera);

    renderer.setSize(div.offsetWidth, div.offsetHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;

    const loader = new GLTFLoader();

    let model;
    let rotatey;
    loader.load('./model/hat.glb', gltf => {
        model = gltf.scene;
        model.children[0].name = 'hat';
        rotatey = model.children[0].rotation.y
        model.scale.set(2, 2, 2);
        model.position.y = 1;
        model.rotation.y = -0.5
        console.log(rotatey);
        scene.add(model);
    }, undefined, function(error){console.log(error)});

    const alight = new THREE.AmbientLight(0xffffff, 0.48);
    scene.add(alight);

    const dlight = new THREE.DirectionalLight(0xd3cdfe, 4);
    dlight.position.set(-9.417, 6.109, 12.233);
    scene.add(dlight);

    const d1light = new THREE.DirectionalLight(0xb3adff, 1.68);
    d1light.position.set(6.307, 5.913, -8.356);
    scene.add(d1light);

    const plight = new THREE.PointLight(0xfbd8bc, 7.12);
    plight.position.set(3.286, -0.941, 2.697);
    plight.distance = 5.16;
    plight.decay = 1;
    scene.add(plight);

    const p1light = new THREE.PointLight(0xffddbd, 5.92);
    p1light.position.set(-2.886, -1.243, -3.584);
    p1light.distance = 0;
    p1light.decay = 0.96;
    scene.add(p1light);

    camera.position.z = 9.6;
    camera.position.y = 1.7;

    const controls = new OrbitControls(camera, canvas);
    // controls.minPolarAngle = 1.5;
    // controls.maxPolarAngle = 1.5;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.7;
    controls.enablePan = false;
    controls.maxDistance = 15;
    controls.minDistance = 8.7;

    window.addEventListener('resize', resizediv, false)
    window.addEventListener('mousedown', click_hat)

    function resizediv(){
        camera.aspect = div.offsetWidth / div.offsetHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(div.offsetWidth, div.offsetHeight);
        renderer.render(scene, camera);
    }

    const raycast = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let rotating = false;

    function click_hat(cord){
        const size = div.getBoundingClientRect();
        mouse.x = ((cord.clientX - size.left) / div.clientWidth) * 2 - 1;
        mouse.y = ((cord.clientY - size.top) / div.clientHeight) * -2 + 1;

        raycast.setFromCamera(mouse, camera);
        const intersects = raycast.intersectObjects(scene.children);
        for (let i = 0; i < intersects.length; i++){
            // console.log(intersects[i]);
            if (intersects[i].object.name == 'hat'){
                rotating = true;
                arrow.forEach((ar) =>{
                    ar.style.opacity = `0`
                })
                break;
            }
        }
    }
    
    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        if (rotating){
            model.children[0].rotation.y += -(2 * Math.PI / 180)
            model.children[0].position.y -= 0.007 * (Math.sin(model.children[0].rotation.y - rotatey))
            model.children[0].rotation.z += 0.003 * (Math.sin(model.children[0].rotation.y - rotatey))
            if (model.children[0].rotation.y <= -(2 * Math.PI - rotatey)) {
                rotating = false;
                model.children[0].rotation.y = rotatey;
                arrow.forEach((ar) =>{
                    ar.style.animation = `none`
                })
            }
        }
        cards.style.transform = `perspective(1000px) rotateY(${-controls.getAzimuthalAngle()}rad)`
        renderer.render(scene, camera);
    }

    animate();
}
init();