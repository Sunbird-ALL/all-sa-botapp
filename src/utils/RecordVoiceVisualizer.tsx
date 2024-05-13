import React, { useMemo } from 'react';

export default function RecordVoiceVisualizer() {
  const renderType = useMemo(
    () => ({
      bar1: { bar: 1, times: 7 },
      bar2: { bar: 2, times: 10 },
      bar3: { bar: 3, times: 15 },
      bar4: { bar: 4, times: 10 },
      bar5: { bar: 5, times: 7 },
    }),
    []
  );

  const renderBar = (_key: string, value: { bar: number; times: number }) => {
    const renderArr = [];
    for (let i = 0; i <= Number(value.times); i++) {
      renderArr.push(
        <span
          key={`${_key}-${i}`} // Unique key for each bar
          className={`playing__bar playing__bar${value.bar}`}
          style={{
            height: `${Math.floor(Math.random() * 100)}%`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        ></span>
      );
    }
    return renderArr;
  };

  return (
    <div style={{ position: 'relative' }}>
      <div className="playing">
        {Object.entries(renderType).map(([key, value]) => (
          <React.Fragment key={key}>{renderBar(key, value)}</React.Fragment>
        ))}
      </div>
      <div
        className="playing"
        style={{
          position: 'absolute',
          left: '-1px',
          bottom: '-20px',
          transform: 'rotate(3.142rad)',
        }}
      >
        {Object.entries(renderType)
          .reverse()
          .map(([key, value]) => (
            <React.Fragment key={key}>{renderBar(key, value)}</React.Fragment>
          ))}
      </div>
    </div>
  );
}
