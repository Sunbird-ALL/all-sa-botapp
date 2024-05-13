import { useEffect, useRef } from 'react';

interface AudioPlayerProps {
    audioUrl: string;
    play: boolean;
    onEnd?: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl, play, onEnd }) => {
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        if (play && audioRef.current) {
            audioRef.current.play();
        }
    }, [play]);

    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            audio.src = audioUrl;
            audio.load();
        }
    }, [audioUrl]);

    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            const handleEnded = () => {
                if (onEnd) {
                    onEnd();
                }
            };
            audio.addEventListener('ended', handleEnded);
            return () => {
                audio.removeEventListener('ended', handleEnded);
            };
        }
    }, [onEnd]);

    return <audio ref={audioRef} hidden />;
};

export default AudioPlayer;