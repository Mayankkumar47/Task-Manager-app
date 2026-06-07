// Web Audio API Sound Synthesizer for futuristic click feedback
let audioCtx = null;

const getAudioContext = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
};

export const isSoundEnabled = () => {
  const stored = localStorage.getItem("system_sound_active");
  // Default to enabled if not set
  return stored !== "false";
};

export const setSoundEnabled = (enabled) => {
  localStorage.setItem("system_sound_active", enabled ? "true" : "false");
};

const playSynth = (frequencyList, durationList, typeList, volume = 0.05) => {
  if (!isSoundEnabled()) return;

  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Initial configuration
    gainNode.gain.setValueAtTime(volume, now);
    osc.type = typeList[0] || "sine";
    osc.frequency.setValueAtTime(frequencyList[0], now);

    let currentOffset = 0;
    
    // Sequence frequencies
    for (let i = 0; i < frequencyList.length; i++) {
      const freq = frequencyList[i];
      const duration = durationList[i] || 0.1;
      const type = typeList[i] || typeList[0] || "sine";

      osc.type = type;
      osc.frequency.setValueAtTime(freq, now + currentOffset);
      
      currentOffset += duration;
    }

    // Smooth envelope tail fade-out
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + currentOffset);

    osc.start(now);
    osc.stop(now + currentOffset + 0.05);
  } catch (err) {
    console.warn("Sound playback disabled or unsupported by client gesture requirements.", err);
  }
};

export const playClick = () => {
  // Simple retro system terminal tick
  playSynth([880, 1200], [0.03, 0.03], ["sine", "sine"], 0.02);
};

export const playSuccess = () => {
  // Uplifting multi-note cyber chime
  playSynth([523.25, 659.25, 783.99, 1046.50], [0.08, 0.08, 0.08, 0.15], ["sine", "sine", "triangle", "triangle"], 0.04);
};

export const playChime = () => {
  // High-pitch sci-fi network alert
  playSynth([987.77, 1318.51, 1975.53], [0.1, 0.06, 0.15], ["triangle", "sine", "sine"], 0.03);
};

export const playError = () => {
  // Low-frequency warning buzz
  playSynth([150, 110], [0.12, 0.2], ["sawtooth", "sawtooth"], 0.05);
};
