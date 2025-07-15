const keySounds = [
  new Audio('src/sounds/key-press-1.mp3'),
  new Audio('src/sounds/key-press-2.mp3'),
  new Audio('src/sounds/key-press-3.mp3'),
  new Audio('src/sounds/key-press-4.mp3'),
];

const wrongKey = new Audio('src/sounds/key-wrong.mp3');

keySounds.forEach(audio => {
  audio.preload = 'auto';
  audio.volume = 0.2;
});

wrongKey.preload = 'auto';
wrongKey.volume = 0.2;

export function playRandomKeySound() {
  const sound = keySounds[Math.floor(Math.random() * keySounds.length)];
  sound.currentTime = 0;
  sound.play();
}

export function playWrongKeySound() {
  wrongKey.currentTime = 0;
  wrongKey.play();
}
