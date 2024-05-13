'use client';
import AnimatedPage from '@/components/AnimatedPage';
import BeeWithSpeaker from '@/components/BeeWithSpeaker';
import EmojiBar from '@/components/EmojiBar';
import Spinner from '@/components/Spinner';
import VoiceRecorder from '@/components/VoiceRecorder';
import useAuth from '@/hooks/useAuth';
import useHasMounted from '@/hooks/useHasMounted';
import {
  IContent,
  IWelcomeNextPayload,
  fetchLearningNext,
  fetchWelcomeStart,
} from '@/services/userService';
import { userCurrentStageInfo } from '@/store/userInfo';
import { useAtom } from 'jotai';
import { NextPage } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useGlobalAudioPlayer } from 'react-use-audio-player';

const LearnHome: NextPage = () => {
  const hasMounted = useHasMounted();
  const userInfo = useAuth(); // This will redirect if not logged in
  const [userCurrentStage, setUserCurrentStage] = useAtom(userCurrentStageInfo);
  const router = useRouter();
  const { load, playing, play, volume } = useGlobalAudioPlayer();

  const [text, setText] = useState('');
  const [shouldReset, setShouldReset] = useState(0);
  const [audioBase64, setAudioBase64] = useState<string>('');
  const audioFiles = ['audios/thank-you.mp3'];
  const [audioUrl, setAudioUrl] = useState(audioFiles[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [content, setContent] = useState<IContent>();
  const [isFetching, setIsFetching] = useState(false);

  const bannerAnimation = {
    animate: {
      transition: {
        delayChildren: 0.4,
        staggerChildren: 0.1,
      },
    },
  };
  const letterAnimation = {
    initial: {
      y: 400,
    },
    animate: {
      y: 0,
      transition: {
        ease: [0.6, 0.01, -0.05, 0.95],
        duration: 1,
      },
    },
  };

  const performActionOnUserInfoAvailable = useCallback(async () => {
    try {
      if (userInfo.user_virtual_id) {
        const data = await fetchWelcomeStart(
          '/learning_start',
          userInfo.user_virtual_id
        );

        if (data?.conversation?.audio) {
          setAudioUrl(data.conversation.audio);
          load(data.conversation.audio, {
            onload() {
              play();
            },
            onplay() {},
          });
        }

        if (data.content) {
          setContent(data.content);
          setText(data.content.text);
        }
      }
    } catch (error) {
    }
    // Add any action you want to perform here
  }, [load, play, userInfo]);

  useEffect(() => {
    if (hasMounted && userInfo.session_id && userInfo.user_virtual_id) {
      performActionOnUserInfoAvailable();
    }
  }, [hasMounted, performActionOnUserInfoAvailable, userInfo]);

  if (!hasMounted) {
    return null;
  }

  const handleRecordingComplete = async (base64String: string) => {
    let updatedBase64 = base64String.split('data:audio/wav;base64,');
    setAudioBase64(updatedBase64[1]);
  };

  const handleAudioUrlAvailable = (audioUrl: string) => {
    setAudioUrl(audioUrl);
  };

  const handlePlayAudio = (audioUrl) => {
    if (!isPlaying) {
      load(audioUrl, {
        autoplay: true,
      });
    }
  };

  const handleContentAudioClick = () => {
    handlePlayAudio(content.audio);
  };

  const handleIsRecording = (isRecording: boolean) => {
    setIsRecording(isRecording);
  };

  const handleSpeakerClick = () => {};

  const handleNextClick = async () => {

    if (userInfo.user_virtual_id) {
      const payload: IWelcomeNextPayload = {
        user_virtual_id: userInfo.user_virtual_id,
        user_audio_msg: audioBase64,
        content_id: content?.content_id,
        original_content_text: content?.text,
      };
      setIsFetching(true);
      fetchLearningNext(payload)
        .then((data) => {
          if (data) {
            if (data.conversation.state === 0) {
              setUserCurrentStage('feedback');
              router.push('/welcome', {});
            } else {
              if (data.conversation.audio) {
                setAudioUrl(data.conversation.audio);
              }

              if (data.content) {
                setContent(data.content);
              }

              setText(data.content.text);

              setIsFetching(false);

              if (data.conversation.state === 0) {
                if (data.conversation.audio) {
                  load(data.conversation.audio, {
                    autoplay: true,
                    onend() {
                      setUserCurrentStage('feedback');
                      router.push('/welcome', {});
                    },
                  });
                } else {
                  setUserCurrentStage('feedback');
                  router.push('/welcome', {});
                }
              } else {
                if (data.conversation.audio) {
                  load(data.conversation.audio, {
                    onload() {
                      play();
                    },
                  });
                }

                setAudioBase64('');
                setShouldReset(shouldReset + 1);
              }
            }
          }
        })
        .catch((error) => {
          setIsFetching(false);
        });
    }
  };

  const handleEmojiClick = (emoji: string) => {
  };

  return (
    <AnimatedPage>
      {isFetching && <Spinner></Spinner>}
      <div className="flex flex-col h-dvh justify-between main-background-color">
        {/* Header */}
        <header className="flex flex-col p-4">
          <div className="flex flex-row">
            <div className="flex-grow text-left font-bold text-lg">
              Bee The Bot
            </div>
            <div className="flex-grow text-right font-bold text-lg">
              User: {userInfo?.user_id}
            </div>
          </div>
          <div className="flex flex-row self-center">
            <div className="flex-grow p-4">
              <BeeWithSpeaker
                speaking={playing}
                containerClass="max-w-48 max-h-48"
                imageHeight={240}
                imageWidth={240}
                onSpeakerClicked={handleSpeakerClick}
              />
            </div>
          </div>
        </header>
        <main className="flex flex-col flex-grow items-center mx-4 bg-white rounded-xl shadow">
          <div className="flex flex-row pb-4 items-start flex-auto items-center">
            <div className="flex-grow">
              <div className="flex flex-row justify-center">
                <div className="text-4xl font-medium text-black">{text}</div>
                {content?.audio && (
                  <button className="pl-4" onClick={handleContentAudioClick}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-9 h-9"
                    >
                      <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM18.584 5.106a.75.75 0 0 1 1.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 0 1-1.06-1.06 8.25 8.25 0 0 0 0-11.668.75.75 0 0 1 0-1.06Z" />
                      <path d="M15.932 7.757a.75.75 0 0 1 1.061 0 6 6 0 0 1 0 8.486.75.75 0 0 1-1.06-1.061 4.5 4.5 0 0 0 0-6.364.75.75 0 0 1 0-1.06Z" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-row grow-0">
            <div className="flex-grow self-end">
              <VoiceRecorder
                isRecordButtonDisabled={playing}
                showRecordAlwayVisible={false}
                showVisualizer={true}
                showRecordAgainButton={true}
                showReplayButton={true}
                shouldReset={shouldReset}
                setMinHeight={true}
                onRecordingComplete={handleRecordingComplete}
                onAudioUrlAvailable={handleAudioUrlAvailable}
                onIsRecordingStateChange={handleIsRecording}
              />
            </div>
          </div>
          <div className={`flex flex-row grow-0 self-end mx-2 mb-2 pt-5`}>
            <div className="flex-grow">
              <button
                disabled={!audioBase64}
                onClick={handleNextClick}
                className={`flex items-end justify-end rounded-full w-20 h-10 ${
                  !audioBase64 && 'opacity-25 grayscale'
                }`}
              >
                <Image
                  className="rounded-full"
                  src={'/images/next.svg'}
                  alt="Next question"
                  height={100}
                  width={100}
                ></Image>
              </button>
            </div>
          </div>
        </main>

        <footer className="flex flex-col p-4 text-white">
          <div className="flex flex-row">
            <div className="flex-grow bg-white rounded-xl shadow">
              <EmojiBar onEmojiClick={handleEmojiClick} />
            </div>
          </div>
        </footer>
      </div>
    </AnimatedPage>
  );
};
export default LearnHome;
