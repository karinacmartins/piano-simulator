// Seletores principais
const pianoKeys = document.querySelectorAll(".piano-keys .key");
const volumeSlider = document.querySelector(".volume-slider input");
const keysCheck = document.querySelector(".keys-check input");
const musicSelect = document.getElementById("musicSelect");
const playButton = document.getElementById("playButton");
const notesDisplay = document.getElementById("notesDisplay");
const stopButton = document.getElementById("stopButton");
const autoPlayToggle = document.getElementById("autoPlayToggle"); // Exemplo de seletor adicional para modo automático

// Variáveis globais
let mapedKeys = [];
let audio = new Audio("src/tunes/a.wav");
let currentIndex = 0;
let currentSongKeys = [];
let isPlaying = false;
let playInterval; // Para reprodução automática

// Função para tocar uma nota
const playTune = (key) => {
  audio.src = `src/tunes/${key}.wav`;
  audio.play();

  const clickedKey = document.querySelector(`[data-key="${key}"]`);
  clickedKey.classList.add("active");
  setTimeout(() => clickedKey.classList.remove("active"), 150);
};

// Lista de músicas disponíveis
const songs = {
  "Do-Re-Mi-Fa": ["a", "s", "d", "f", "f", "f", "a", "s", "a", "s", "s", "s", "a", "g", "f", "d", "d", "d", "a", "s", "d", "f", "f", "f"],
  "Twinkle, Twinkle Little Star": ["a", "a", "t", "t", "y", "y", "t", "r", "r", "l", "s", "s"],
  "Ode to Joy": ["l", "l", "r", "t", "t", "r", "l", "s", "a", "a", "s", "a", "l", "l", "s"],
  "Mary Had a Little Lamb": ["s", "d", "f", "d", "s", "s", "s", "d", "d", "d", "s", "l", "l", "s", "d", "f", "d", "s", "s", "s"],
  "Jingle Bells": ["d", "d", "d", "d", "d", "d", "d", "s", "a", "d", "l", "l", "l", "l", "d", "d", "d", "d", "s", "s", "s", "s", "d", "s", "a"],
  "Happy Birthday": ["a", "a", "s", "a", "r", "d", "a", "a", "s", "a", "t", "r", "a", "a", "j", "l", "r", "d", "s", "w", "w", "s", "a", "t", "r" ],
  "Beethoven's Fur Elise": ["d", "s", "d", "s", "d", "l", "k", "j", "a", "j", "k", "d", "s", "d", "a", "l", "k", "j", "a", "j", "k"],
  
};


// Popula o menu de seleção de músicas
Object.keys(songs).forEach((songName) => {
  const option = document.createElement("option");
  option.value = songName;
  option.textContent = songName;
  musicSelect.appendChild(option);
});

// Exibe a próxima nota para o usuário pressionar
const displayNextNote = () => {
  if (currentIndex < currentSongKeys.length) {
    const nextKey = currentSongKeys[currentIndex];
    notesDisplay.textContent = `Pressione: ${nextKey.toUpperCase()}`;
    notesDisplay.classList.add("active");
    setTimeout(() => notesDisplay.classList.remove("active"), 1000);
    currentIndex++;
  } else {
    notesDisplay.textContent = "Música finalizada! Escolha outra música.";
    notesDisplay.classList.add("completed");
    setTimeout(() => notesDisplay.classList.remove("completed"), 2000);
    isPlaying = false;
    currentSongKeys = [];
  }
};

// Reprodução manual e mapeamento de teclas
pianoKeys.forEach((key) => {
  mapedKeys.push(key.dataset.key);
  key.addEventListener("click", () => {
    if (!isPlaying || !currentSongKeys.length) {
      playTune(key.dataset.key);
    } else {
      notesDisplay.textContent = "Música em execução. Use o teclado.";
    }
  });
});

// Captura teclas pressionadas
document.addEventListener("keydown", (e) => {
  if (!isPlaying || currentIndex === 0) {
    if (mapedKeys.includes(e.key)) playTune(e.key);
  } else if (e.key === currentSongKeys[currentIndex - 1]) {
    playTune(e.key);
    displayNextNote();
  }
});

// Inicia a música selecionada
playButton.addEventListener("click", () => {
  if (isPlaying || !currentSongKeys.length) return;

  currentIndex = 0;
  isPlaying = true;

  if (autoPlayToggle.checked) {
    playSongAutomatically();
  } else {
    displayNextNote();
  }
});

// Para a música
stopButton.addEventListener("click", () => {
  audio.pause();
  audio.currentTime = 0;
  clearInterval(playInterval);
  resetToInitialState();
});

// Reprodução automática
const playSongAutomatically = () => {
  if (!currentSongKeys.length) return;

  currentIndex = 0;
  isPlaying = true;
  notesDisplay.textContent = "Modo automático: Tocando...";

  playInterval = setInterval(() => {
    if (currentIndex < currentSongKeys.length) {
      playTune(currentSongKeys[currentIndex]);
      currentIndex++;
    } else {
      clearInterval(playInterval);
      resetToInitialState();
    }
  }, 500);
};

// Redefine o estado inicial
const resetToInitialState = () => {
  notesDisplay.textContent = "Escolha uma música e pressione Play para começar.";
  currentIndex = 0;
  isPlaying = false;
  audio.pause();
  audio.currentTime = 0;
  pianoKeys.forEach((key) => key.classList.remove("active"));
};

// Controle de volume
volumeSlider.addEventListener("input", (e) => {
  audio.volume = e.target.value;
});

// Alterna a visibilidade das teclas
keysCheck.addEventListener("click", () => {
  pianoKeys.forEach((key) => key.classList.toggle("hide"));
});

// Atualiza a música selecionada
musicSelect.addEventListener("change", (e) => {
  currentSongKeys = songs[e.target.value];
  notesDisplay.textContent = "Pressione o botão Play para começar.";
});
