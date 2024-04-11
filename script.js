window.onload = function() {
    var video = document.getElementById('video');
    var audio = document.getElementById('audio');
    var canvas = document.getElementById('asciiCanvas');
    var ctx = canvas.getContext('2d');

    video.addEventListener('play', function() {
        audio.play(); // Start audio playback along with video

        var asciiInterval = setInterval(function() {
            if (video.paused || video.ended) {
                clearInterval(asciiInterval);
                return;
            }

            processVideoFrame();
        }, 1000 / 30); // Target frame rate: 30 FPS

        function processVideoFrame() {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            var asciiArt = convertFrameToAscii(imageData);
            renderAsciiArt(asciiArt);
        }

        function convertFrameToAscii(imageData) {
            var asciiArt = '';
            for (var i = 0; i < imageData.data.length; i += 4) {
                var avg = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
                var index = Math.round(avg * (CUSTOM_ASCII_CHARS.length - 1) / 255);
                asciiArt += CUSTOM_ASCII_CHARS[index];
                if ((i + 4) % (canvas.width * 4) === 0) {
                    asciiArt += '\n';
                }
            }
            return asciiArt;
        }

        function renderAsciiArt(asciiArt) {
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Render ASCII art
            ctx.font = '10px monospace';
            ctx.fillStyle = 'white';
            var lines = asciiArt.split('\n');
            for (var i = 0; i < lines.length; i++) {
                ctx.fillText(lines[i], 0, i * 10);
            }
        }
    });
};
