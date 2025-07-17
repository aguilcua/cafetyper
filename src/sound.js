const keySounds = [
  new Audio('src/sounds/key-press-1.ogg'),
  new Audio('src/sounds/key-press-2.ogg'),
  new Audio('src/sounds/key-press-3.ogg'),
  new Audio('src/sounds/key-press-4.ogg'),
];

const wrongKey = new Audio('src/sounds/key-wrong.mp3');

keySounds.forEach(audio => {
  audio.preload = 'auto';
  audio.volume = 0.4;
});

wrongKey.preload = 'auto';
wrongKey.volume = 0.3;

export function playRandomKeySound() {
  const sound = keySounds[Math.floor(Math.random() * keySounds.length)];
  sound.currentTime = 0;
  sound.play();
}

export function playWrongKeySound() {
  wrongKey.currentTime = 0;
  wrongKey.play();
}
