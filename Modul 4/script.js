document.addEventListener('DOMContentLoaded', function () {
    let stateGame = 'instruction'
    let intervalCountdown = null
    let intervalTimer = null
    let invervalGame = null
    let intervalVirus = null
    let playerName = ''
    const buttonHeight = 150;
    const lineHeight = 10;
    const dangerHeight = 400;
    const virusList = [];
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
                draw();
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

    // Component
    class Virus {
        constructor() {
            this.width = 100;
            this.height = 100;
            this.y = 0;
            this.step = 10;
            this.xList = [0, 101, 202, 303];
            this.x = this.xList[Math.round(Math.random() * this.xList.length)];
            while (this.isStack()) {
                this.x = this.xList[Math.round(Math.random() * this.xList.length)];
            }
            this.context = getContext();
        }

        isDraw() {
            return this.y < (getCanvas().height - (buttonHeight + lineHeight + this.height));
        }

        isDanger = () => {
            return this.y >= (getCanvas().height - (buttonHeight + lineHeight + dangerHeight + this.height));
        }



        isStack = () => {
            virusList.forEach(virus => {

                if (this.y + this.height > virus.y && this.x == virus.x) {
                    console.log("stucl")
                    return true;
                }
            })

            return false;
        }

        draw() {
            if (this.isDraw()) {
                const image = new Image();
                image.src = 'assets/virus.png';
                image.onload = () => {
                    this.context.drawImage(image, this.x, this.y, this.width, this.height);
                    this.y += this.step;
                }
            }
        }


    }

    // Function draw Game
    const drawTile = (x) => {
        const context = getContext();
        const height = getCanvas().height;
        context.fillStyle = '#282f35';
        context.fillRect(x, 0, 100, height);
    }

    const drawButton = (x, filename) => {
        const context = getContext();
        const y = getCanvas().height - buttonHeight;
        const image = new Image();
        image.src = `assets/${filename}`;
        image.onload = () => {
            context.drawImage(image, x, y, 100, buttonHeight);
        }
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

    const draw = () => {
        intervalVirus = setInterval(() => {
            const virus = new Virus();
            virusList.push(virus);
        }, 1100);
        invervalGame = setInterval(() => {
        const arrayPosition = [0, 101, 202, 303]
            const fileButtonName = ['D.jpg', 'F.jpg', 'J.jpg', 'K.jpg']
            arrayPosition.forEach((position, index) => {
            drawTile(position);
                drawButton(position, fileButtonName[index]);

        });
        drawLine();
        arrayPosition.forEach(position => {
            drawDangerZone(position);
        });


            virusList.forEach(virus => {
                virus.draw();
            });
        }, 200);
    }
    // End of Draw Game
    openInstructionScreen();

});