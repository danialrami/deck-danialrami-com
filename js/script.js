document.addEventListener('DOMContentLoaded', function() {
    // Audio wave animations
    function createAudioWave(elementId, color1, color2) {
        const container = document.getElementById(elementId);
        if (!container) {
            console.log(`Container ${elementId} not found`);
            return;
        }
        
        // Clear any existing canvas
        container.innerHTML = '';
        
        const canvas = document.createElement('canvas');
        container.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
        
        let phase = 0;
        
        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Create gradient
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
            gradient.addColorStop(0, color1);
            gradient.addColorStop(1, color2);
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 2;
            
            // Draw wave
            ctx.beginPath();
            
            const amplitude = canvas.height / 4;
            const frequency = 0.01;
            
            for (let x = 0; x < canvas.width; x++) {
                const y = amplitude * Math.sin(x * frequency + phase) + canvas.height / 2;
                
                if (x === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            
            ctx.stroke();
            
            phase += 0.05;
            requestAnimationFrame(draw);
        }
        
        draw();
    }
    
    // Ensure all audio waves are created after DOM is fully loaded
    setTimeout(() => {
        createAudioWave('audioWave1', '#78BEBA', '#2C5AA0');
        createAudioWave('audioWave2', '#D35233', '#E7B225');
        createAudioWave('audioWave3', '#78BEBA', '#D35233');
        createAudioWave('audioWave4', '#E7B225', '#2C5AA0');
        createAudioWave('audioWave5', '#2C5AA0', '#78BEBA');
        createAudioWave('audioWave-about', '#E7B225', '#78BEBA');
        console.log('Audio waves created');
    }, 100);
    
    // Create audio bars
    function createAudioBars(elementId) {
        const barsContainer = document.getElementById(elementId);
        if (!barsContainer) return;
        
        // Clear any existing bars
        barsContainer.innerHTML = '';
        
        const barCount = 15;
        
        for (let i = 0; i < barCount; i++) {
            const bar = document.createElement('div');
            bar.className = 'audio-bar';
            bar.style.height = `${Math.random() * 100 + 20}px`;
            barsContainer.appendChild(bar);
        }
        
        // Animate audio bars
        function animateBars() {
            const bars = barsContainer.querySelectorAll('.audio-bar');
            
            bars.forEach(bar => {
                const height = Math.random() * 100 + 20;
                bar.style.height = `${height}px`;
                
                // Assign random colors from brand palette
                const colors = ['#78BEBA', '#D35233', '#E7B225', '#2C5AA0'];
                const randomColor = colors[Math.floor(Math.random() * colors.length)];
                bar.style.backgroundColor = randomColor;
            });
        }
        
        setInterval(animateBars, 500);
    }
    
    // Ensure audio bars are created
    setTimeout(() => {
        createAudioBars('audioBars');
        console.log('Audio bars created');
    }, 100);
    
    // Circular audio visualization
    function createCircularAudio(elementId) {
        const circularContainer = document.getElementById(elementId);
        if (!circularContainer) return;
        
        // Clear any existing canvas
        circularContainer.innerHTML = '';
        
        const circularCanvas = document.createElement('canvas');
        circularContainer.appendChild(circularCanvas);
        
        const circularCtx = circularCanvas.getContext('2d');
        circularCanvas.width = circularContainer.offsetWidth;
        circularCanvas.height = circularContainer.offsetHeight;
        
        const centerX = circularCanvas.width / 2;
        const centerY = circularCanvas.height / 2;
        const radius = circularCanvas.width / 2 - 20;
        
        let circularPhase = 0;
        
        function drawCircular() {
            circularCtx.clearRect(0, 0, circularCanvas.width, circularCanvas.height);
            
            // Draw circular audio visualization
            circularCtx.beginPath();
            
            for (let angle = 0; angle < Math.PI * 2; angle += 0.01) {
                const sineWave = Math.sin(angle * 10 + circularPhase) * 0.2;
                const r = radius * (1 + sineWave);
                const x = centerX + r * Math.cos(angle);
                const y = centerY + r * Math.sin(angle);
                
                if (angle === 0) {
                    circularCtx.moveTo(x, y);
                } else {
                    circularCtx.lineTo(x, y);
                }
            }
            
            circularCtx.closePath();
            
            // Create gradient
            const gradient = circularCtx.createLinearGradient(0, 0, circularCanvas.width, circularCanvas.height);
            gradient.addColorStop(0, '#78BEBA');
            gradient.addColorStop(0.33, '#D35233');
            gradient.addColorStop(0.66, '#E7B225');
            gradient.addColorStop(1, '#2C5AA0');
            
            circularCtx.strokeStyle = gradient;
            circularCtx.lineWidth = 3;
            circularCtx.stroke();
            
            circularPhase += 0.03;
            requestAnimationFrame(drawCircular);
        }
        
        drawCircular();
    }
    
    // Ensure circular audio is created
    setTimeout(() => {
        createCircularAudio('circularAudio');
        console.log('Circular audio created');
    }, 100);
    
    // Navigation
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;
    
    // Function to ensure audio visualizations are visible when slide changes
    function refreshVisualizations() {
        // Recreate audio waves for current slide
        const currentSlideElement = slides[currentSlide];
        if (!currentSlideElement) return;
        
        const waveElement = currentSlideElement.querySelector('.audio-wave');
        if (waveElement && waveElement.id) {
            const waveId = waveElement.id;
            const colors = {
                'audioWave1': ['#78BEBA', '#2C5AA0'],
                'audioWave2': ['#D35233', '#E7B225'],
                'audioWave3': ['#78BEBA', '#D35233'],
                'audioWave4': ['#E7B225', '#2C5AA0'],
                'audioWave5': ['#2C5AA0', '#78BEBA'],
                'audioWave-about': ['#E7B225', '#78BEBA']
            };
            
            if (colors[waveId]) {
                createAudioWave(waveId, colors[waveId][0], colors[waveId][1]);
            }
        }
        
        // Check for audio bars
        if (currentSlideElement.querySelector('#audioBars')) {
            createAudioBars('audioBars');
        }
        
        // Check for circular audio
        if (currentSlideElement.querySelector('#circularAudio')) {
            createCircularAudio('circularAudio');
        }
    }
    
    function showSlide(index) {
        // Hide all slides first
        slides.forEach((slide, i) => {
            slide.style.display = 'none';
        });
        
        // Show the current slide
        slides[index].style.display = 'flex';
        
        // Refresh visualizations after slide change
        setTimeout(refreshVisualizations, 50);
        
        // Update progress bar
        updateProgressBar(index);
    }
    
    function updateProgressBar(index) {
        const progressBar = document.querySelector('.progress');
        if (progressBar) {
            progressBar.style.width = `${(index / (slides.length - 1)) * 100}%`;
        }
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }
    
    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }
    
    // Add event listeners to navigation buttons
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    
    if (nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', prevSlide);
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowRight') {
            nextSlide();
        } else if (e.key === 'ArrowLeft') {
            prevSlide();
        }
    });
    
    // Add subtle glitch effect randomly
    setInterval(function() {
        const glitchElements = document.querySelectorAll('.glitch-effect');
        if (glitchElements.length === 0) return;
        
        const randomElement = glitchElements[Math.floor(Math.random() * glitchElements.length)];
        
        randomElement.style.transform = 'translate(1px, 1px)';
        
        setTimeout(function() {
            randomElement.style.transform = 'translate(0)';
        }, 100);
    }, 3000);
    
    // Make sure audio waves are visible
    window.addEventListener('resize', function() {
        refreshVisualizations();
    });
    
    // Initialize - show the first slide and its visualizations
    showSlide(currentSlide);
});