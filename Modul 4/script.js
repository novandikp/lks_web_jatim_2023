document.addEventListener('DOMContentLoaded', function () {
    let stateGame = 'instruction'
    let intervalCountdown = null
    let playerName = ''

    // Event Listener
    // keyup document
    document.querySelector('#game-screen').addEventListener('keydown', function (e) {

        console.log(e.key);
    });

    // 
    document.querySelector('.form-control').addEventListener('keyup', function (e) {
        const btnPlay = document.getElementById('btn-play');
        if (e.target.value.trim() == "") {
            btnPlay.classList.add('disabled');
        } else if (e.target.value.trim() != "") {
            btnPlay.classList.remove('disabled');
        }
    });

    document.getElementById('btn-play').addEventListener('click', function (e) {
        e.preventDefault();
        playerName = document.querySelector('.form-control').value;
        setActiveScreen('countdown-screen', true);
        startCountdown();
    });

    // function

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
                document.querySelector('#game-screen').focus();
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
    };

    const pauseGame = () => {
        stateGame = 'pause';
        setActiveScreen('pause-screen');
    };

    const resumeGame = () => {
        stateGame = 'playing';
        setActiveScreen('main-screen', true);
    };

    const endGame = () => {
        stateGame = 'end';
        setActiveScreen('end-screen', true);
    };


    setActiveScreen("instruction-screen", true);
});