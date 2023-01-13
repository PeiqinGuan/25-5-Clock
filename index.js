let intID;

function App() {
    const [breakTime, setBreakTime] = React.useState(5);
    const [sessionTime, setSessionTime] = React.useState(25);
    const [displayTime, setDisplayTime] = React.useState(sessionTime * 60);
    const [timerOn, setTimerOn] = React.useState(false);
    const [onBreak, setOnBreak] = React.useState(false);
    const [breakAudio, setBreakAudio] = React.useState(new Audio('./breakAudio.wav'));
    const [sessionAudio, setSessionAudio] = React.useState(new Audio('./sessionAudio.mp3'));


    const playBreakSound = () => {
        breakAudio.currentTime = 0;
        breakAudio.play();
    }

    const playSessionSound = () => {
        sessionAudio.currentTime = 0;
        sessionAudio.play();
        setTimeout(() => sessionAudio.pause(), 3200)
    }
    
    
    const start = () => {
        let onBreakVariable = onBreak;
        
        setTimerOn(!timerOn);
        intID = setInterval(() => {
            setDisplayTime(prev => {
                if (prev <= 0 && !onBreakVariable) {
                    setOnBreak(true);
                    onBreakVariable = true;
                    playBreakSound();
                    return breakTime * 60 - 1;
                }
                if (prev <= 0 && onBreakVariable) {
                    setOnBreak(false);
                    onBreakVariable = false;
                    playSessionSound()
                    return sessionTime * 60 - 1;
                }
                return prev - 1;
            })
        }, 1000)
    }

    const pause = () => {
        setTimerOn(!timerOn)
        clearInterval(intID)
    }
    
    const changeTime = (type, timeType) => {
        if (timerOn) return
        if (type == 'plus') {
            if (timeType == 'break') {
                if (breakTime == 60) return
                setBreakTime((prev) => prev + 1)
            }
            if (timeType == 'session') {
                if (sessionTime == 60) return
                setSessionTime(prev => prev + 1)
                setDisplayTime(prev => prev + 60)
            }
        } else {
            if (timeType == 'break') {
                if (breakTime == 1) return
                setBreakTime(prev => prev - 1)
            }
            if (timeType == 'session') {
                if (sessionTime == 1) return
                setSessionTime(prev => prev - 1)
                setDisplayTime(prev => prev - 60)
            }
        }
    }

    const formatTime = (time) => {
        let min = Math.floor(time / 60);
        let sec = time % 60;
        return (min < 10 ? '0' + min : min) + ':' + (sec < 10 ? '0' + sec : sec)
    } 

    const resetTime = () => {
        setBreakTime(5);
        setSessionTime(25);
        setDisplayTime(25 * 60);
        clearInterval(intID)
        setTimerOn(false);
    }
    
    return (
        <div className="d-flex flex-wrap justify-content-center align-items-center text-center" id="wrapper">
            <h1>25 + 5 Clock</h1>
            <div className="d-flex p-2">
                <div className="label me-3" id="break-label">
                    <h2>Break Length</h2>
                    <i class="bi bi-plus-circle-fill" onClick={() => changeTime('plus', 'break')} id="break-increment"></i>
                    <p id="break-length">{breakTime}</p>
                    <i class="bi bi-dash-circle-fill" onClick={() => changeTime('minus', 'break')} id="break-decrement"></i>
                </div>
                <div className="label ms-3" id="session-label">
                    <h2>Session Length</h2>
                    <i class="bi bi-plus-circle-fill" onClick={() => changeTime('plus', 'session')} id="session-increment"></i>
                    <p id="session-length">{sessionTime}</p>
                    <i class="bi bi-dash-circle-fill" onClick={() => changeTime('minus', 'session')} id="session-decrement"></i>
                </div>
            </div>
            <div className="d-flex flex-wrap justify-content-center align-items-baseline border border-4 rounded-pill pt-3 m-1 text-center" 
                id="timer-label" style={{color: displayTime < 60 && 'orange'}}>
                <i class="bi bi-alarm-fill"></i>
                <h2 className="ms-3" id="timer-label">{onBreak ? 'break' : 'Session'}</h2>
                <p id="time-left">{formatTime(displayTime)}</p>
            </div>
            <div className="timer-control">  
                <div className="d-inline-block" id="start_stop">   
                    {timerOn ? <i class="bi bi-pause-fill" onClick={pause}></i> : <i class="bi bi-play-fill" onClick={start}></i>}
                </div> 
                <i class="bi bi-arrow-clockwise" onClick={resetTime} id="reset"></i>
            </div>
        </div>
    )
}

ReactDOM.render(<App />, document.getElementById('root'))