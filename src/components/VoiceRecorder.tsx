import RecordVoiceVisualizer from '@/utils/RecordVoiceVisualizer';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useGlobalAudioPlayer } from 'react-use-audio-player';
interface VoiceRecorderProps {
  icon?: string;
  showReplayButton?: boolean;
  showRecordButton?: boolean;
  showRecordAlwayVisible: boolean;
  showRecordAgainButton?: boolean;
  shouldReset?: number;
  setMinHeight?: boolean;
  showVisualizer: boolean;
  isRecordButtonDisabled?: boolean;
  onRecordingComplete: (base64String: string) => void;
  onAudioUrlAvailable: (audioUrl: string) => void;
  onIsRecordingStateChange: (isRecording: boolean) => void;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  icon,
  showReplayButton,
  showRecordAgainButton,
  showRecordButton,
  showRecordAlwayVisible,
  shouldReset,
  setMinHeight,
  showVisualizer,
  isRecordButtonDisabled,
  onRecordingComplete,
  onAudioUrlAvailable,
  onIsRecordingStateChange,
}) => {
  const { load, playing, play, stop } = useGlobalAudioPlayer();
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [base64, setBase64] = useState<string>('');
  const [resetCounter, setResetCounter] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );

  // 👇️ Reset to the initial state
  const resetState = () => {
    setIsRecording(false);
    setAudioUrl('');
    setBase64('');
  };
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    if (shouldReset && shouldReset != resetCounter) {
      setResetCounter(shouldReset);
      resetState();
    }
    const getMedia = async () => {
      if (!stream) {
        // Only set the stream if it's not already set
        try {
          var chunks: BlobPart[] = [];

          if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices
              .getUserMedia({
                audio: true,
              })
              .then((stream) => {
                const recorder = new MediaRecorder(stream);

                setMediaRecorder(recorder);

                recorder.ondataavailable = async (e) => {
                  chunks.push(e.data);

                  if (e.data.size > 0) {
                    const blob = new Blob(chunks, { type: 'audio/wav' });

                    const audioUrl = URL.createObjectURL(blob);
                    onAudioUrlAvailable(audioUrl);
                    setAudioUrl(audioUrl);

                    const reader = new FileReader();
                    reader.readAsDataURL(blob);
                    reader.onloadend = () => {
                      const base64data = reader.result as string;
                      setBase64(base64data);
                      onRecordingComplete(base64data);
                    };
                  }

                  chunks = [];
                };

                recorder.onstart = (e) => {};
                recorder.onstop = async (e) => {};
              })
              .catch((error) => {});
          }
        } catch (error) {
          console.error('getUserMedia Error:', error);
        }
      }
    };

    getMedia();

    return () => {};
  }, [
    onAudioUrlAvailable,
    onIsRecordingStateChange,
    onRecordingComplete,
    resetCounter,
    shouldReset,
    stream,
  ]); // Ensure stopStream is stable

  const startRecording = () => {
    if (!mediaRecorder) {
      console.error('MediaRecorder not initialized');
      return;
    }
    if (mediaRecorder.state !== 'inactive') {
      return;
    }
    try {
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    } else {
      console.error('MediaRecorder not recording');
    }
  };

  const handleAudioUrlAvailable = () => {
    var snd = new Audio(base64);
    snd.play();
  };

  return (
    <div
      style={{ minHeight: setMinHeight ? 'max-content' : 'auto' }}
      className="flex justify-center items-center flex-col"
    >
      <div
        className="flex justify-center items-center"
        style={{ columnGap: '20px' }}
      >
        {showReplayButton && audioUrl && !isRecording && (
          <div className="justify-center items-center">
            <button
              onClick={handleAudioUrlAvailable}
              className="w-20 h-20 focus:outline-none"
            >
              <Image
                src={'/images/play.svg'}
                alt="play recording image"
                height={100}
                width={100}
              />
            </button>
          </div>
        )}

        {isRecording ? (
          <div className="justify-center items-center">
            <button
              onClick={stopRecording}
              className="w-20 h-20 focus:outline-none"
            >
              <Image
                src={'/images/stop.svg'}
                alt="stop recording image"
                height={100}
                width={100}
              />
            </button>
          </div>
        ) : (
          (!audioUrl || showRecordAlwayVisible) && (
            <div className="justify-center items-center">
              <button
                disabled={isRecordButtonDisabled}
                onClick={startRecording}
                className={`w-20 h-20 focus:outline-none ${
                  isRecordButtonDisabled ? 'disabled-filter' : ''
                }`}
              >
                <Image
                  className="rounded-full"
                  src={icon ? icon : '/images/mic.svg'}
                  alt="start recording image"
                  height={100}
                  width={100}
                ></Image>
              </button>
            </div>
          )
        )}
        {showRecordAgainButton && audioUrl && !isRecording && (
          <div className="justify-center items-center">
            <button
              onClick={startRecording}
              className={`w-20 h-20 focus:outline-none ${
                isRecordButtonDisabled ? 'disabled-filter' : ''
              }`}
            >
              <Image
                className="rounded-full"
                src={'/images/replay.svg'}
                alt="re recording image"
                height={100}
                width={100}
              ></Image>
            </button>
          </div>
        )}
      </div>
      {showVisualizer && isRecording && (
        <div className="flex justify-evenly items-center">
          <RecordVoiceVisualizer />
        </div>
      )}
    </div>
  );
};

export default VoiceRecorder;
