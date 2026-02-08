#!/usr/bin/env python3
"""Generate Morse code audio file for 'COLHEITA' message."""

import wave
import struct
import math

# Morse code dictionary
MORSE_CODE = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.',
    'F': '..-.', 'G': '--.', 'H': '....', 'I': '..', 'J': '.---',
    'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---',
    'P': '.--.', 'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-',
    'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-', 'Y': '-.--',
    'Z': '--..', ' ': ' '
}

# Audio parameters
SAMPLE_RATE = 22050
FREQUENCY = 700  # Hz - classic morse tone
DOT_DURATION = 0.08  # seconds
DASH_DURATION = DOT_DURATION * 3
SYMBOL_GAP = DOT_DURATION  # gap between dots/dashes
LETTER_GAP = DOT_DURATION * 3  # gap between letters
WORD_GAP = DOT_DURATION * 7  # gap between words

def generate_tone(duration, frequency=FREQUENCY):
    """Generate a sine wave tone."""
    samples = []
    num_samples = int(SAMPLE_RATE * duration)
    for i in range(num_samples):
        t = i / SAMPLE_RATE
        # Apply envelope to avoid clicks
        envelope = 1.0
        attack = 0.005  # 5ms attack
        release = 0.005  # 5ms release
        if t < attack:
            envelope = t / attack
        elif t > duration - release:
            envelope = (duration - t) / release
        sample = int(32767 * envelope * math.sin(2 * math.pi * frequency * t))
        samples.append(sample)
    return samples

def generate_silence(duration):
    """Generate silence."""
    num_samples = int(SAMPLE_RATE * duration)
    return [0] * num_samples

def text_to_morse_audio(text):
    """Convert text to Morse code audio samples."""
    samples = []
    
    # Add some silence at the start
    samples.extend(generate_silence(0.3))
    
    for char in text.upper():
        if char == ' ':
            samples.extend(generate_silence(WORD_GAP))
        elif char in MORSE_CODE:
            morse = MORSE_CODE[char]
            for i, symbol in enumerate(morse):
                if symbol == '.':
                    samples.extend(generate_tone(DOT_DURATION))
                elif symbol == '-':
                    samples.extend(generate_tone(DASH_DURATION))
                # Add gap between symbols (but not after the last one)
                if i < len(morse) - 1:
                    samples.extend(generate_silence(SYMBOL_GAP))
            # Add gap after letter
            samples.extend(generate_silence(LETTER_GAP))
    
    # Add some silence at the end
    samples.extend(generate_silence(0.3))
    
    return samples

def save_wav(samples, filename):
    """Save samples to a WAV file."""
    with wave.open(filename, 'w') as wav_file:
        wav_file.setnchannels(1)  # Mono
        wav_file.setsampwidth(2)  # 16-bit
        wav_file.setframerate(SAMPLE_RATE)
        
        for sample in samples:
            wav_file.writeframes(struct.pack('<h', sample))

if __name__ == '__main__':
    message = "COLHEITA"
    print(f"Generating Morse code for: {message}")
    
    # Show the morse code
    morse_display = []
    for char in message.upper():
        if char == ' ':
            morse_display.append('   ')
        elif char in MORSE_CODE:
            morse_display.append(MORSE_CODE[char])
    print(f"Morse code: {' '.join(morse_display)}")
    
    samples = text_to_morse_audio(message)
    output_file = 'public/audio/morse_intercept.wav'
    save_wav(samples, output_file)
    print(f"Saved to: {output_file}")
    print(f"Duration: {len(samples) / SAMPLE_RATE:.2f} seconds")
