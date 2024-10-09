document.addEventListener('DOMContentLoaded', () => {
    const microphoneButton = document.getElementById('microphoneButton');
    const redoButton = document.getElementById('redoButton');
    const output = document.getElementById('output');
    const wordCount = document.getElementById('wordCount');
    const languageSelect = document.getElementById('languageSelect');

    let recognition;
    let isListening = false;
    let finalTranscript = '';

    function initializeSpeechRecognition() {
        if ('webkitSpeechRecognition' in window) {
            recognition = new webkitSpeechRecognition();
        } else if ('SpeechRecognition' in window) {
            recognition = new SpeechRecognition();
        } else {
            microphoneButton.style.display = 'none';
            redoButton.style.display = 'none';
            languageSelect.style.display = 'none';
            output.innerHTML = 'Web Speech API is not supported in this browser. Please try using Google Chrome on a desktop computer.';
            return;
        }

        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = languageSelect.value;

        recognition.onstart = () => {
            console.log('Speech recognition started');
        };

        recognition.onresult = (event) => {
            let interimTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }

            // Post-process text based on selected language
            if (languageSelect.value === 'ko-KR') {
                finalTranscript = postProcessKorean(finalTranscript);
                interimTranscript = postProcessKorean(interimTranscript);
            } else if (languageSelect.value === 'ms-MY') {
                finalTranscript = postProcessMalay(finalTranscript);
                interimTranscript = postProcessMalay(interimTranscript);
            }

            output.innerHTML = finalTranscript + '<span style="color: #999;">' + interimTranscript + '</span>';
            updateWordCount();
        };

        recognition.onend = () => {
            console.log('Speech recognition ended');
            if (isListening) {
                recognition.start();
            }
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            if (event.error === 'not-allowed') {
                output.innerHTML = 'Microphone access denied. Please ensure you have given permission to use the microphone.';
            } else if (event.error === 'no-speech') {
                console.log('No speech detected. Restarting recognition.');
                recognition.stop();
                recognition.start();
            }
        };

        microphoneButton.addEventListener('click', toggleSpeechRecognition);
        redoButton.addEventListener('click', redoSpeech);
        languageSelect.addEventListener('change', () => {
            if (isListening) {
                toggleSpeechRecognition();
            }
            recognition.lang = languageSelect.value;
            finalTranscript = '';
            output.innerHTML = '';
            updateWordCount();
        });
    }

    function toggleSpeechRecognition() {
        if (isListening) {
            recognition.stop();
            microphoneButton.querySelector('.buttonText').textContent = 'Start';
            microphoneButton.style.backgroundColor = '#4CAF50';
        } else {
            recognition.start();
            microphoneButton.querySelector('.buttonText').textContent = 'Pause';
            microphoneButton.style.backgroundColor = '#f44336';
        }
        isListening = !isListening;
    }

    function redoSpeech() {
        finalTranscript = '';
        output.innerHTML = '';
        updateWordCount();
        if (isListening) {
            toggleSpeechRecognition();
        }
    }

    function updateWordCount() {
        const text = output.innerText || output.textContent;
        const words = text.trim().split(/\s+/);
        const count = words.length > 0 && words[0] !== '' ? words.length : 0;
        wordCount.textContent = `Words: ${count}`;
    }

    function postProcessKorean(text) {
        // Korean-specific post-processing
        text = text.replace(/([가-힣])([a-zA-Z])/g, '$1 $2'); // Add space between Korean and English characters
        text = text.replace(/([a-zA-Z])([가-힣])/g, '$1 $2'); // Add space between English and Korean characters
        return text;
    }

    function postProcessMalay(text) {
        // Malay-specific post-processing
        text = text.replace(/(\w)(\s+)(?=\w)/g, '$1 '); // Ensure single space between words
        text = text.replace(/\b(di|ke|dari|pada|untuk|dengan|dan|atau|tetapi|karena|jika|maka|sebagai|seperti|oleh)\b/gi,
                            (match) => match.toLowerCase()); // Lowercase common Malay prepositions and conjunctions
        text = text.replace(/(?<=\s|^)([A-Z])(?=\w)/g, (match) => match.toLowerCase()); // Lowercase first letter of words (except first word of sentence)
        text = text.replace(/(?<=^|\.\s+)([a-z])/g, (match) => match.toUpperCase()); // Capitalize first letter of sentences
        return text;
    }

    initializeSpeechRecognition();
});
