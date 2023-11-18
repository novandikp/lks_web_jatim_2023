document.addEventListener("DOMContentLoaded", function () {
    let stateGame = "instruction";
    let intervalCountdown = null;
    let intervalTimer = null;
    let intervalVirus = null;
    let playerName = "";
    const gameOverLose = 10;
    const buttonHeight = 150;
    const lineHeight = 10;
    const dangerHeight = 400;
    let virusList = [];
    const fileButtonName = [];
    let lose = 0;
    let score = 0;

    const loadButton = () => {
        const button = ["D.jpg", "F.jpg", "J.jpg", "K.jpg"];
        button.forEach((btn) => {
            const image = new Image();
            image.src = `assets/${btn}`;
            fileButtonName.push(image);
        });
    };

    // Event Listener
    // keyup document
    document
        .querySelector("#main-screen")
        .addEventListener("keydown", function (e) {
            if (e.key == "Escape") {
                pauseGame();
            } else {
                keyEventVirus(e.key.toUpperCase());
            }

    });
    document
        .querySelector("#pause-screen")
        .addEventListener("keydown", function (e) {
            if (e.key == "Escape") {
                resumeGame();
            }
    });

    //
    document
        .querySelector(".form-control")
        .addEventListener("keyup", function (e) {
            checkPlayerInput();
    });
    // Click event
    document.getElementById("btn-play").addEventListener("click", function (e) {
        e.preventDefault();
        playerName = document.querySelector(".form-control").value;
        document.getElementById("player-value").innerHTML = playerName;
        if (playerName.trim() != "") {
            openCountdownScreen();
        }
    });

    document.getElementById("btn-resume").addEventListener("click", function (e) {
        e.preventDefault();
        resumeGame();
    });

    document
        .querySelector("#end-screen button")
        .addEventListener("click", function (e) {
            e.preventDefault();
            restartGame();
        });

    document
        .getElementById("btn-restart")
        .addEventListener("click", function (e) {
            e.preventDefault();
            restartGame();
    });

    document
        .getElementById("menu-restart")
        .addEventListener("click", function (e) {
            e.preventDefault();
            restartGame();
        });
    document.getElementById("menu-quit").addEventListener("click", function (e) {
        e.preventDefault();
        quitGame();
    });

    // function
    const getCanvas = () => {
        return document.getElementById("game-canvas");
    };

    const getContext = () => {
        return getCanvas().getContext("2d");
    };

    const checkPlayerInput = () => {
        const input = document.querySelector(".form-control").value;
        const btnPlay = document.getElementById("btn-play");
        if (input.trim() == "") {
            btnPlay.classList.add("disabled");
        } else if (input.trim() != "") {
            btnPlay.classList.remove("disabled");
        }
    };
    const startCountdown = () => {
        let countdown = 3;
        const cd = document.querySelector(".countdown-counter");
        cd.innerHTML = countdown;
        intervalCountdown = setInterval(() => {
            countdown--;
            cd.innerHTML = countdown;
            if (countdown == 0) {
                clearInterval(intervalCountdown);
                setActiveScreen("main-screen", true);
                startTimer(true);
                stateGame = "playing";
                draw();
                startGenerateVirus();
            }
        }, 1000);
    };

    const clearActiveScren = () => {
        const activeScreen = document.querySelectorAll(".screen.active");
        activeScreen.forEach((screen) => {
            screen.classList.remove("active");
        });
    };

    const setActiveScreen = (screenId, clear = false) => {
        if (clear) {
            clearActiveScren();
        }
        const screen = document.getElementById(screenId);
        screen.classList.add("active");
        document.getElementById(screenId).focus();
    };

    const pauseGame = () => {
        stopTimer();
        stopGenerateVirus();
        stateGame = "pause";
        setActiveScreen("pause-screen");
    };

    const resumeGame = () => {
        startTimer();
        stateGame = "playing";
        draw();
        startGenerateVirus();
        setActiveScreen("main-screen", true);
    };

    const quitGame = () => {
        stopTimer();
        stopGenerateVirus();
        virusList = [];
        openInstructionScreen();
        lose = 0;
        score = 0;
        document.getElementById("score-value").innerHTML = score;
        document.getElementById("fail-value").innerHTML = lose;
    }

    const restartGame = () => {
        stopTimer();
        stopGenerateVirus();
        virusList = [];
        openCountdownScreen();
        lose = 0;
        score = 0;
        document.getElementById("score-value").innerHTML = score;
        document.getElementById("fail-value").innerHTML = lose;
    }

    const startTimer = (clear = false) => {
        if (clear) {
            document.getElementById("time-value").innerHTML = "00:00";
        }
        intervalTimer = setInterval(() => {
            const time = document.getElementById("time-value").innerHTML;
            const timeSplit = time.split(":");
            let minute = parseInt(timeSplit[0]);
            let second = parseInt(timeSplit[1]);
            if (second < 59) {
                second++;
            } else {
                second = 0;
                minute++;
            }

            second = second.toString().padStart(2, "0");
            minute = minute.toString().padStart(2, "0");

            document.getElementById("time-value").innerHTML = `${minute}:${second}`;
        }, 1000);
    };

    const stopTimer = () => {
        clearInterval(intervalTimer);
    };

    const endGame = () => {
        pauseGame();
        document.getElementById("score").innerHTML = score;
        document.getElementById("time").innerHTML = document.getElementById(
            "time-value"
        ).innerHTML;
        document.getElementById("player").innerHTML = playerName;
        stateGame = "end";
        setActiveScreen("end-screen", true);
    };

    const openCountdownScreen = () => {
        setActiveScreen("countdown-screen", true);
        startCountdown();
    };

    const openInstructionScreen = () => {
        setActiveScreen("instruction-screen", true);
        checkPlayerInput();
    };

    // Component
    class Virus {
        constructor() {
            this.width = 100;
            this.height = 100;
            this.y = 0;
            this.step = 5;
            this.xList = [0, 101, 202, 303];
            this.image = new Image();
            this.image.src = "assets/virus.png";
            this.hit = false;
            this.x = this.xList[Math.round(Math.random() * this.xList.length)];
            while (this.isStack()) {
                this.x = this.xList[Math.round(Math.random() * this.xList.length)];
            }
            this.context = getContext();
        }

        attack() {
            this.hit = true;
        }

        isDraw() {
            return (
                this.y < getCanvas().height - (buttonHeight + lineHeight + this.height) && !this.hit
            );
        }

        isDanger = () => {
            return (
                this.y >=
                getCanvas().height -
                (buttonHeight + lineHeight + dangerHeight + this.height)
            );
        };

        isStack = () => {
            for (let virus of virusList) {
                if (virus.x == this.x && this.y + this.height >= virus.y) {
                    return true;
                }
            }
            return false;
        };

        draw() {
            if (this.isDraw()) {
                this.context.drawImage(
                    this.image,
                    this.x,
                    this.y,
                    this.width,
                    this.height
                );

                this.y += this.step;

            }
        }
    }

    // Function draw Game
    const drawTile = (x) => {
        const context = getContext();
        const height = getCanvas().height;
        context.fillStyle = "#282f35";
        context.fillRect(x, 0, 100, height);
    };

    const drawButton = (x, image) => {
        const context = getContext();
        const y = getCanvas().height - buttonHeight;
        context.drawImage(image, x, y, 100, buttonHeight);
    };

    const drawLine = () => {
        const context = getContext();
        const y = getCanvas().height - (buttonHeight + lineHeight);
        context.fillStyle = "#5b6274";
        context.fillRect(0, y, getCanvas().width, lineHeight);
    };

    const drawDangerZone = (x) => {
        const context = getContext();
        const y = getCanvas().height - (buttonHeight + lineHeight + dangerHeight);
        context.globalAlpha = 0.4;
        context.fillStyle = "#ff0000";
        context.fillRect(x, y, 100, dangerHeight);
        context.globalAlpha = 1;
    };

    const startGenerateVirus = () => {
        intervalVirus = setInterval(() => {
            const virus = new Virus();
            virusList.push(virus);
        }, 1500);
    };

    const stopGenerateVirus = () => {
        clearInterval(intervalVirus);
    };

    const keyEventVirus = (key) => {
        const keyList = ['D', 'F', 'J', 'K'];
        const arrayPosition = [0, 101, 202, 303];
        for (let virus of virusList) {
            const indexKey = keyList.indexOf(key)
            if (virus.x == arrayPosition[indexKey] && virus.isDraw()) {
                if (virus.isDanger()) {
                    score += 1;
                    virus.attack();
                    break;
                }
            }
        }
        document.getElementById("score-value").innerHTML = score;
    }

    const draw = () => {
        const arrayPosition = [0, 101, 202, 303];
        arrayPosition.forEach((position, index) => {
            drawTile(position);
            drawButton(position, fileButtonName[index]);
        });
        drawLine();
        arrayPosition.forEach((position) => {
            drawDangerZone(position);
        });
        virusList = virusList.filter((virus) => {
            if (!virus.isDraw() && !virus.hit && virus.x != undefined) {
                lose++;
            }
            if (lose >= gameOverLose) {
                endGame();
            }
            return virus.isDraw();
        });
        virusList.forEach((virus) => {
            virus.draw();
        });
        document.getElementById("fail-value").innerHTML = lose;
        if (stateGame == "playing") {
            requestAnimationFrame(draw);
        }
    };
    // End of Draw Game
    openInstructionScreen();
    loadButton();
});
