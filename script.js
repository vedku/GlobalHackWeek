document.addEventListener('DOMContentLoaded', () => {
    const microphoneButton = document.getElementById('microphoneButton');
    const redoButton = document.getElementById('redoButton');
    const output = document.getElementById('output');
    const wordCount = document.getElementById('wordCount');

    let recognition;
    let isListening = false;

    if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }

            output.innerHTML = finalTranscript + '<span style="color: #999;">' + interimTranscript + '</span>';
            updateWordCount();
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
        };

        microphoneButton.addEventListener('click', toggleSpeechRecognition);
        redoButton.addEventListener('click', redoSpeech);
    } else {
        microphoneButton.style.display = 'none';
        redoButton.style.display = 'none';
        output.innerHTML = 'Web Speech API is not supported in this browser.';
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
});
