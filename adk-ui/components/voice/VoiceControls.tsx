'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/button';

interface VoiceControlsProps {
  onVoiceInput: (text: string) => void;
  onVoiceToggle: (enabled: boolean) => void;
  isVoiceEnabled: boolean;
  isMuted: boolean;
  onMuteToggle: (muted: boolean) => void;
}

export const VoiceControls: React.FC<VoiceControlsProps> = ({
  onVoiceInput,
  onVoiceToggle,
  isVoiceEnabled,
  isMuted,
  onMuteToggle
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    // Check for speech recognition support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const speechSynthesis = window.speechSynthesis;
    
    if (SpeechRecognition && speechSynthesis) {
      setIsSupported(true);
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      synthesisRef.current = speechSynthesis;
      
      // Configure speech recognition
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onVoiceInput(transcript);
        setIsListening(false);
      };
      
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onVoiceInput]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const speakText = (text: string) => {
    if (synthesisRef.current && !isMuted && isVoiceEnabled) {
      // Stop any ongoing speech
      synthesisRef.current.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      // Try to use a more natural voice
      const voices = synthesisRef.current.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.lang.startsWith('en') && voice.name.includes('Google')
      ) || voices.find(voice => voice.lang.startsWith('en'));
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      synthesisRef.current.speak(utterance);
    }
  };

  // Expose speakText function to parent component
  useEffect(() => {
    (window as any).speakAssistantResponse = speakText;
  }, [isMuted, isVoiceEnabled]);

  if (!isSupported) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      {/* Voice Input Button */}
      <Button
        variant={isListening ? "danger" : "secondary"}
        onClick={isListening ? stopListening : startListening}
        className={`rounded-full p-2 ${isListening ? 'animate-pulse' : ''}`}
        title={isListening ? "Stop listening" : "Start voice input"}
      >
        <svg
          className="w-4 h-4"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          {isListening ? (
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a2 2 0 114 0v4a2 2 0 11-4 0V7z" clipRule="evenodd" />
          ) : (
            <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
          )}
        </svg>
      </Button>

      {/* Voice Output Toggle */}
      <Button
        variant={isVoiceEnabled ? "primary" : "secondary"}
        onClick={() => onVoiceToggle(!isVoiceEnabled)}
        className="rounded-full p-2"
        title={isVoiceEnabled ? "Disable voice output" : "Enable voice output"}
      >
        <svg
          className="w-4 h-4"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.783L4.99 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.99l3.393-3.783z" clipRule="evenodd" />
          {isVoiceEnabled && (
            <>
              <path d="M14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 11-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414z" />
              <path d="M12.828 5.757a1 1 0 011.414 0A5.983 5.983 0 0116 10a5.983 5.983 0 01-1.758 4.243 1 1 0 11-1.414-1.414A3.987 3.987 0 0014 10a3.987 3.987 0 00-1.172-2.829 1 1 0 010-1.414z" />
            </>
          )}
        </svg>
      </Button>

      {/* Mute Toggle */}
      <Button
        variant={isMuted ? "danger" : "secondary"}
        onClick={() => onMuteToggle(!isMuted)}
        className="rounded-full p-2"
        title={isMuted ? "Unmute" : "Mute"}
      >
        <svg
          className="w-4 h-4"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          {isMuted ? (
            <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.783L4.99 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.99l3.393-3.783zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
          ) : (
            <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.783L4.99 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.99l3.393-3.783z" clipRule="evenodd" />
          )}
        </svg>
      </Button>

      {/* Status indicator */}
      {isListening && (
        <div className="flex items-center gap-1 text-xs text-red-600">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          Listening...
        </div>
      )}
    </div>
  );
};

// Type declarations for speech recognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
    speakAssistantResponse: (text: string) => void;
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}
