interface TextToSpeechProps {
    text: string;
    onEnd?: () => void;
    isPlaying?: (playing: boolean) => void;
  }