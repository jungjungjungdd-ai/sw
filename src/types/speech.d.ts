export {}

// Web Speech API 최소 타입 선언 (표준 TS lib에 미포함, Chrome 계열 브라우저 지원)
declare global {
  interface SpeechRecognitionResultLike {
    transcript: string
  }

  interface SpeechRecognitionEventLike {
    results: SpeechRecognitionResultLike[][]
  }

  interface SpeechRecognitionLike {
    lang: string
    interimResults: boolean
    maxAlternatives: number
    onstart: (() => void) | null
    onend: (() => void) | null
    onerror: (() => void) | null
    onresult: ((event: SpeechRecognitionEventLike) => void) | null
    start: () => void
    stop: () => void
  }

  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionLike
    webkitSpeechRecognition?: new () => SpeechRecognitionLike
  }
}
