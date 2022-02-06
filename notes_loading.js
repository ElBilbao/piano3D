/*
Loop through all the note keys and load their 7 keys (0-6) as well as their sharps (s)
and load them into a dictionary that will be used in Event Listener
All note mp3s are located in the assets local directory
*/
import * as THREE from "/piano3D/three/build/three.module.js";

var notes = {};

const audioLoader = new THREE.AudioLoader();
const listener = new THREE.AudioListener();
const keys = ["a", "b", "c", "d", "e", "f", "g"];
keys.forEach(function (key) {
  for (let i = 0; i < 7; ++i) {
    let current_key = key + i + ".mp3";
    const sound = new THREE.Audio(listener);
    audioLoader.load(`/assets/notes/${current_key}`, function (buffer) {
      sound.setBuffer(buffer);
      sound.setLoop(false);
    });
    notes[current_key] = sound;

    // Skip non existant b sharp and e sharp
    if (key != "b" && key != "e") {
      let current_sharp = key + "s" + i + ".mp3";
      const sharp_sound = new THREE.Audio(listener);
      audioLoader.load(`/assets/notes/${current_sharp}`, function (buffer) {
        sharp_sound.setBuffer(buffer);
        sharp_sound.setLoop(false);
      });
      notes[current_sharp] = sharp_sound;
    }
  }
});
console.log("NOTES AUDIO LOADED");

export { notes };
