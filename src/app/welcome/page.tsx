'use client';
import AnimatedPage from '@/components/AnimatedPage';
import BeeWithSpeaker from '@/components/BeeWithSpeaker';
import EmojiBar from '@/components/EmojiBar';
import Spinner from '@/components/Spinner';
import VoiceRecorder from '@/components/VoiceRecorder';
import useAuth from '@/hooks/useAuth';
import useHasMounted from '@/hooks/useHasMounted';
import { isLoadingAtom } from '@/store/loadingAtom';
import {
  IUserInfo,
  userCurrentStageInfo,
  userInfoAtom,
} from '@/store/userInfo';
import { useAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useGlobalAudioPlayer } from 'react-use-audio-player';
import {
  IWelcomeNextPayload,
  fetchWelcomeNext,
  fetchWelcomeStart,
} from '../../services/userService';
function Home() {
  const hasMounted = useHasMounted();
  useAuth(); // This will redirect if not logged in
  const router = useRouter();
  const [userInfo, setUserInfo] = useAtom(userInfoAtom);

  const [isLoading] = useAtom(isLoadingAtom);

  const [userCurrentStage, setUserCurrentStage] = useAtom(userCurrentStageInfo);
  const [isFetching, setIsFetching] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const { load, playing, play, volume } = useGlobalAudioPlayer();
  const [audioBase64, setAudioBase64] = useState<string>('');

  const [audioUrl, setAudioUrl] = useState('');

  const performActionOnUserInfoAvailable = useCallback(async () => {
    try {
      if (userCurrentStage === 'feedback' && userInfo?.user_virtual_id) {
        setIsFetching(true);
        const data = await fetchWelcomeStart(
          '/feedback_start',
          userInfo.user_virtual_id
        )
          .then((data) => {
            setIsFetching(false);

            if (data?.conversation?.audio) {
              setAudioUrl(data.conversation.audio);
              load(data.conversation.audio, {
                onload() {
                  play();
                },
                onplay() {},
              });
            }
          })
          .catch((error) => {
            setIsFetching(false);
          });
      } else if (userCurrentStage === '' && userInfo?.user_virtual_id) {
        setIsFetching(false);

        const data = await fetchWelcomeStart(
          '/welcome_start',
          userInfo.user_virtual_id
        )
          .then((data) => {
            setIsFetching(false);

            if (data?.conversation?.audio) {
              setAudioUrl(data.conversation.audio);
              load(data.conversation.audio, {
                onload() {
                  play();
                },
                onplay() {},
              });
            }
          })
          .catch((error) => {
            setIsFetching(false);
          });
      }
    } catch (error) {
      console.log('Error fetching user info:', error);
    }
    // Add any action you want to perform here
  }, [load, play, userCurrentStage, userInfo]);

  useEffect(() => {
    if (hasMounted && userInfo?.user_virtual_id) {
      performActionOnUserInfoAvailable();
    }
  }, [hasMounted, performActionOnUserInfoAvailable, userInfo, volume]);

  if (!hasMounted) {
    return null;
  }

  const handleConclusion = async () => {
    if (userInfo.user_virtual_id) {
      setIsFetching(true);
      await fetchWelcomeStart('/conclusion', userInfo.user_virtual_id)
        .then((data) => {
          setIsFetching(false);
          if (data.conversation.audio) {
            setAudioUrl(data.conversation.audio);
            load(data.conversation.audio, {
              autoplay: true,
              onend() {
                setUserCurrentStage('');
                setUserInfo({} as IUserInfo);
                router.push('/');
              },
            });
          }
        })
        .catch((error) => {
          setIsFetching(false);
        });
    }
  };

  const handleRecordingComplete = async (base64String: string) => {
    let updatedBase64 = base64String.split('data:audio/wav;base64,');
    setAudioBase64(updatedBase64[1]);

    if (userInfo.user_virtual_id) {
      const payload: IWelcomeNextPayload = {
        user_virtual_id: userInfo.user_virtual_id,
        user_audio_msg: updatedBase64[1],
      };
      setIsFetching(true);
      fetchWelcomeNext(
        userCurrentStage === 'feedback' ? '/feedback_next' : '/welcome_next',
        payload
      )
        .then((data) => {
          setIsFetching(false);

          if (data.conversation.audio) {
            setAudioUrl(data.conversation.audio);
            load(data.conversation.audio, {
              autoplay: true,
              onend() {
                if (data.conversation.state === 0 && !userCurrentStage) {
                  router.push('/learn');
                } else if (
                  data.conversation.state === 0 &&
                  userCurrentStage === 'feedback'
                ) {
                  handleConclusion();
                }
              },
            });
          }
        })
        .catch((error) => {
          setIsFetching(false);
        });
    }
  };

  const handleSpeakerClick = () => {
    load(audioUrl, {
      autoplay: true,
    });
  };

  const handleAudioUrlAvailable = (audioUrl: string) => {
  };
  const handleEmojiClick = (emoji: string) => {
  };

  const handleIsRecording = (isRecording: boolean) => {};

  return (
    <AnimatedPage>
      {isFetching && <Spinner></Spinner>}
      <div className="flex flex-col h-dvh justify-between main-background-color">
        <header className="flex flex-col p-4">
          <div className="flex flex-row">
            <div className="flex-grow p-4 text-left font-bold text-lg">
              Bee The Bot
            </div>
            <div className="flex-grow p-4 text-right font-bold text-lg">
              User: {userInfo?.user_id}
            </div>
          </div>
          <div className="flex flex-row self-center">
            <div className="flex-grow p-4">
              <BeeWithSpeaker
                speaking={playing}
                containerClass="max-w-96 max-h-96"
                imageHeight={256}
                imageWidth={256}
                onSpeakerClicked={handleSpeakerClick}
              />
            </div>
          </div>
        </header>
        <main className="flex flex-col flex-grow items-center justify-center">
          <div className="flex flex-row">
            <div className="flex-grow p-4">
              <VoiceRecorder
                isRecordButtonDisabled={playing}
                showRecordAlwayVisible={true}
                showRecordAgainButton={false}
                showReplayButton={false}
                showVisualizer={false}
                onRecordingComplete={handleRecordingComplete}
                onAudioUrlAvailable={handleAudioUrlAvailable}
                onIsRecordingStateChange={handleIsRecording}
              />
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
}

export default Home;
