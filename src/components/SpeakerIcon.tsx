"use client";
import React from 'react';

type SpeakerIconProps = {
  playing: boolean;
};

const SpeakerIcon: React.FC<SpeakerIconProps> = ({ playing }) => {
  return (
    <div
      className={`w-16 h-16 rounded-full flex items-center justify-center ${
        playing ? 'bg-blue-500 animate-pulse-slow' : 'bg-gray-300'
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        className="h-6 w-6 text-white"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M11 5H6a2 2 0 00-2 2v10a2 2 0 002 2h5m7-14v16m0 0l-4-4m4 4V5l-4 4"
        />
      </svg>
    </div>
  );
};

export default SpeakerIcon;
