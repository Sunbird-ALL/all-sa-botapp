import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

interface Emoji {
  emoji: string;
  label: string;
}

interface EmojiBarProps {
  onEmojiClick: (label: string) => void;
}

const EmojiBar: React.FC<EmojiBarProps> = ({ onEmojiClick }) => {
  const emojis: Emoji[] = [
    { emoji: '🤩', label: 'excited' },
    { emoji: '😊', label: 'happy' },
    { emoji: '😢', label: 'sad' },
    { emoji: '😕', label: 'confused' },
  ];

  const [flyingEmojis, setFlyingEmojis] = useState<any[]>([]);

  const handleClick = (emoji: Emoji) => {
    const numberOfEmojis = 3; // Number of emojis to fly
    const screenWidth = window.innerWidth;
    const startX = screenWidth / 2 + (Math.random() - 0.5) * screenWidth * 0.5; // Center +/- 25% of screen width
    const randomValue = 50 + Math.random() * 100; // Generates a value between 50 and 150
    const newEmojis = Array.from({ length: numberOfEmojis }, (v, index) => ({
      ...emoji,
      id: Math.random(), // unique id for key purposes
      initialY: window.innerHeight,
      startX: randomValue, // Center +/- 25% of screen width, // Center +/- 25% of screen width
      offset: index * 20,
    }));
    setFlyingEmojis([...flyingEmojis, ...newEmojis]);
    onEmojiClick(emoji.label);
  };

  return (
    <div className="flex space-x-4 justify-center items-center p-2">
      {emojis.map((item) => (
        <motion.button
          key={item.label}
          whileTap={{ scale: 0.5 }}
          className="text-4xl"
          onClick={() => handleClick(item)}
        >
          {item.emoji}
        </motion.button>
      ))}
      <AnimatePresence>
        {flyingEmojis.map((flyingEmoji) => (
          <motion.div
            key={flyingEmoji.id}
            initial={{
              x: `${flyingEmoji.startX}px`,
              y: flyingEmoji.initialY,
              opacity: 1,
            }}
            animate={{
              x: flyingEmoji.startX + (Math.random() - 2) * 100,
              // x: flyingEmoji.startX,
              y: -window.innerHeight,
              opacity: 1,
            }}
            exit={{ y: -window.innerHeight * 2, opacity: 0 }}
            transition={{ duration: 2 }}
            className="fixed bottom-0"
            style={{ transform: 'translateX(-50%)', zIndex: 1000 }}
          >
            <div
              className="text-4xl"
              style={{
                background: 'white',
                borderRadius: '50%',
                padding: '5px',
              }}
            >
              {flyingEmoji.emoji}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default EmojiBar;
