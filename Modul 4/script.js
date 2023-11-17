document.addEventListener('DOMContentLoaded', function () {
    let stateGame = 'instruction'
    let intervalCountdown = null
    let intervalTimer = null
    let playerName = ''
    const buttonHeight = 100;
    const lineHeight = 10;
    const dangerHeight = 400;

    // Event Listener
    // keyup document
    document.querySelector('#main-screen').addEventListener('keydown', function (e) {
        if (e.key == 'Escape') {
            pauseGame();
        }
    });
    document.querySelector('#pause-screen').addEventListener('keydown', function (e) {
        if (e.key == 'Escape') {
            resumeGame();
        }
    });



    // 
    document.querySelector('.form-control').addEventListener('keyup', function (e) {
        checkPlayerInput();
    });
    // Click event
    document.getElementById('btn-play').addEventListener('click', function (e) {
        e.preventDefault();
        playerName = document.querySelector('.form-control').value;
        document.getElementById('player-value').innerHTML = playerName;
        if (playerName.trim() != "") {
            openCountdownScreen();
        }
    });

    document.getElementById('btn-resume').addEventListener('click', function (e) {
        e.preventDefault();
        resumeGame();
    });

    document.getElementById('btn-restart').addEventListener('click', function (e) {
        e.preventDefault();
        stopTimer();
        openCountdownScreen();
    });

    document.getElementById('menu-restart').addEventListener('click', function (e) {
        e.preventDefault();
        stopTimer();
        openCountdownScreen();
    })
    document.getElementById('menu-quit').addEventListener('click', function (e) {
        e.preventDefault();
        stopTimer();
        openInstructionScreen();
    })

    // function
    const getCanvas = () => {
        return document.getElementById('game-canvas');
    }

    const getContext = () => {
        return getCanvas().getContext('2d');
    }

    const checkPlayerInput = () => {
        const input = document.querySelector('.form-control').value;
        const btnPlay = document.getElementById('btn-play');
        if (input.trim() == "") {
            btnPlay.classList.add('disabled');
        } else if (input.trim() != "") {
            btnPlay.classList.remove('disabled');
        }
    }
    const startCountdown = () => {
        let countdown = 3;
        const cd = document.querySelector('.countdown-counter')
        cd.innerHTML = countdown;
        intervalCountdown = setInterval(() => {
            countdown--;
            cd.innerHTML = countdown;
            if (countdown == 0) {
                clearInterval(intervalCountdown);
                setActiveScreen('main-screen', true);
                startTimer(true);
            }
        }, 1000);
    }

    const clearActiveScren = () => {
        const activeScreen = document.querySelectorAll('.screen.active');
        activeScreen.forEach(screen => {
            screen.classList.remove('active');
        });
    };

    const setActiveScreen = (screenId, clear = false) => {
        if (clear) {
            clearActiveScren();
        }
        const screen = document.getElementById(screenId);
        screen.classList.add('active');
        document.getElementById(screenId).focus();
    };

    const pauseGame = () => {
        stopTimer();
        stateGame = 'pause';
        setActiveScreen('pause-screen');

    };

    const resumeGame = () => {
        startTimer();
        stateGame = 'playing';
        setActiveScreen('main-screen', true);
    };

    const startTimer = (clear = false) => {
        if (clear) {
            document.getElementById('time-value').innerHTML = '00:00';
        }
        intervalTimer = setInterval(() => {
            const time = document.getElementById('time-value').innerHTML;
            const timeSplit = time.split(':');
            let minute = parseInt(timeSplit[0]);
            let second = parseInt(timeSplit[1]);
            if (second < 59) {
                second++;
            } else {
                second = 0;
                minute++;
            }

            second = second.toString().padStart(2, '0');
            minute = minute.toString().padStart(2, '0');

            document.getElementById('time-value').innerHTML = `${minute}:${second}`;
        }, 1000)
    }

    const stopTimer = () => {
        clearInterval(intervalTimer);
    }

    const endGame = () => {
        stateGame = 'end';
        setActiveScreen('end-screen', true);
    };

    const openCountdownScreen = () => {
        setActiveScreen('countdown-screen', true);
        startCountdown();
    }

    const openInstructionScreen = () => {
        setActiveScreen('instruction-screen', true);
        checkPlayerInput();
    }


    // Component Game
    const drawTile = (x) => {
        const context = getContext();
        const height = getCanvas().height;
        context.fillStyle = '#282f35';
        context.fillRect(x, 0, 100, height);
    }

    const drawButton = (x) => {
        const context = getContext();
        const y = getCanvas().height - buttonHeight;
        context.fillStyle = '#3b8bad';
        context.fillRect(x, y, 100, buttonHeight);
    }

    const drawLine = () => {
        const context = getContext();
        const y = getCanvas().height - (buttonHeight + lineHeight);
        console.log(y);
        context.fillStyle = '#5b6274';
        context.fillRect(0, y, getCanvas().width, lineHeight);
    }

    const drawDangerZone = (x) => {
        const context = getContext();
        const y = getCanvas().height - (buttonHeight + lineHeight + dangerHeight);
        context.globalAlpha = 0.4;
        context.fillStyle = '#ff0000';
        context.fillRect(x, y, 100, dangerHeight);
        context.globalAlpha = 1;
    }

    const background = () => {
        const arrayPosition = [0, 101, 202, 303]
        arrayPosition.forEach(position => {
            drawTile(position);
            drawButton(position);

        });
        drawLine();
        arrayPosition.forEach(position => {
            drawDangerZone(position);
        });
    }
    // End of Component Game
    openInstructionScreen();
    background();
});