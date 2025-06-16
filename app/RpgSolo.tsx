'use client';
import React, { useEffect, useState } from 'react';

type Choice = { text: string; next: string };
type StoryNode = { text: string; choices: Choice[] };
type Story = { [key: string]: StoryNode };

export default function RpgSolo() {
  const [story, setStory] = useState<Story | null>(null);
  const [current, setCurrent] = useState('start');

  useEffect(() => {
    fetch('/story.json')
      .then(res => res.json())
      .then(setStory);
  }, []);

  if (!story) return <div>Loading...</div>;

  const node = story[current];

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #232526 0%, #414345 100%)',
      fontFamily: 'Segoe UI, Roboto, Arial, sans-serif',
      color: '#f3f3f3',
      padding: '24px'
    }}>
      <div style={{
        background: 'rgba(30, 30, 40, 0.95)',
        borderRadius: '18px',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        padding: '32px 24px',
        maxWidth: '480px',
        width: '100%',
        textAlign: 'center',
        border: '1px solid #444'
      }}>
        <h2 style={{ fontSize: '2.2rem', marginBottom: '1.2rem', fontWeight: 700, letterSpacing: '1px' }}>RPG Solo Adventure</h2>
        <p style={{ fontSize: '1.25rem', marginBottom: '2rem', lineHeight: 1.6 }}>{node.text}</p>
        <div>
          {node.choices.map((choice, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(choice.next)}
              style={{
                display: 'block',
                width: '100%',
                margin: '12px 0',
                padding: '14px 0',
                fontSize: '1.1rem',
                fontWeight: 600,
                borderRadius: '8px',
                border: 'none',
                background: 'linear-gradient(90deg, #43cea2 0%, #185a9d 100%)',
                color: '#fff',
                cursor: 'pointer',
                transition: 'transform 0.1s, box-shadow 0.1s',
                boxShadow: '0 2px 8px rgba(0,0,0,0.12)'
              }}
              onMouseOver={e => {
                (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.04)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 16px rgba(67,206,162,0.18)';
              }}
              onMouseOut={e => {
                (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.12)';
              }}
            >
              {choice.text}
            </button>
          ))}
          {node.choices.length === 0 && <p style={{ marginTop: '2rem', fontSize: '1.1rem', color: '#b2ffb2' }}>The End.</p>}
        </div>
      </div>
    </div>
  );
}