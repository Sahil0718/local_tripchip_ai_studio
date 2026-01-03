
import React, { useState, useEffect, useRef } from 'react';

interface VoiceInputProps {
  onTranscription: (text: string) => void;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscription }) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onTranscription(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [onTranscription]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setIsListening(true);
      recognitionRef.current?.start();
    }
  };

  if (!(window as any).SpeechRecognition && !(window as any).webkitSpeechRecognition) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={toggleListening}
      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
        isListening 
          ? 'bg-red-100 text-red-600 animate-pulse' 
          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
      }`}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
      {isListening ? 'Listening...' : 'Use Voice'}
    </button>
  );
};

export default VoiceInput;
