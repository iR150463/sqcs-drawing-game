import DrawingArea from './DrawingArea';
import { React } from 'react';
import { useState, useEffect } from 'react';
import { getMultipleRandom, pushRandomReturnArr } from './arrayTools';
import { scoring } from "./database"

function GetPlayers({setPlayers, setState}) {
    const [input, setInput] = useState(0)

    return (
        <div className='mainDiv'>
            <h1>關卡E：量子疊加 - 畫畫接力</h1>
            <h2>輸入小隊的人數：</h2>
            <div className="App">
                <input type='number' onChange={(e)=>{setInput(e.target.value)}}></input>
                <button onClick={()=>{setPlayers(parseInt(input)); setState('gaming')}}>開始</button>
            </div>
        </div>
    )
}

function DrawingRound(props) {
    const [timeleft, setTimeleft] = useState(10);
    const guessing = props.guessing;

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeleft(p => p-1)
        }, 1000);
      
        return () => clearInterval(interval);
    }, []);

    if (!guessing) {
        const round = props.round;
        const setRound = props.setRound;

        if (timeleft > 0) {
            return (
                <div className='mainDiv'>
                    <h1>完成小組的畫作！</h1>
                    <div className="App drawing-area">
                        <DrawingArea allowDraw={true} key="drawingArea"/>
                    </div>
                    <h2>剩下 {timeleft} 秒</h2>
                </div>
            )
        } else {
            return (
                <div className='mainDiv'>
                    <h2>停！交給下一位</h2>
                    <div className="App drawing-area">
                        <DrawingArea allowDraw={false} key="drawingArea"/>
                    </div>
                    <button onClick={()=>{setRound(round+1); setTimeleft(10)}}>繼續</button>
                </div>
            )
        }
    } else {
        const setState = props.setState;

        if (timeleft > 0) {
            return (
                <div className='mainDiv'>
                    <h1>小組的畫作！</h1>
                    <div className="App drawing-area">
                        <DrawingArea allowDraw={false} key="drawingArea"/>
                    </div>
                    <h2>試著猜出你們小組的主題！</h2>
                    <p>剩下 {timeleft} 秒</p>
                </div>
            )
        } else {
            return (
                <div className='mainDiv'>
                    <h1>點擊以繼續</h1>
                    <button onClick={()=>{setState('guess')}}>回答</button>
                </div>
            )
        }
    }
}

function DrawingRounds({players, topic, setState}) {
    const [round, setRound] = useState(0);

    // First round: see topic -> start drawing
    if (round === 0) {
        return (
            <div className='mainDiv'>
                <h1>你的主題是：</h1>
                <h2>{topic}</h2>
                <button onClick={()=>{setRound(1)}}>開始畫畫</button>
            </div>
        )
    }

    // Middle rounds: pure drawings
    if (round < players) {
        return (
            <DrawingRound round={round} setRound={setRound} guessing={false} />
        )
    }

    // Last round: see the drawing and click yes
    if (round === players) {
        return (
            <DrawingRound setState={setState} guessing={true} />
        )
    }
}

function GuessAnswer({answer, randomAnswers}) {
    const [answersArray, setAnswersArray] = useState(pushRandomReturnArr(randomAnswers, answer));
    const [correct, setCorrect] = useState(false);
    const [lives, setLives] = useState(4);

    // Player guessed the answer
    if (correct) {
        const score = scoring[`${lives}`];

        return (
            <div className='mainDiv'>
                <h1>答對了！答案是 {answer}</h1>
                <p>你的分數: {score}</p>
            </div>
        )
    }

    // Player lose all of their lives
    if (lives === 0) {
        const score = scoring[`${lives}`];

        return (
            <div className='mainDiv'>
                <h1>你輸了！答案是 {answer}</h1>
                <p>你的分數: {score}</p>
            </div>
        )
    }

    // Generate questions
    let answerButtons = [];
    for (let i=0; i<answersArray.length; i++) {
        if (answersArray.indexOf(answer) === i) {
            answerButtons.push(<button onClick={()=>{setCorrect(true)}} key={`answerBtn`} className="answerBtm">{answer}</button>)
        } else {
            const fakeAns = answersArray[i];
            const onClick = ()=>{
                setLives(lives-1);

                let newAnsArr = answersArray.filter(x => x!==fakeAns);
                setAnswersArray(newAnsArr)
            }

            answerButtons.push(<button onClick={onClick} key={`answerBtn${fakeAns}`} className="answerBtm">{fakeAns}</button>)
        }
    }

    return (
        <div className='mainDiv'>
            <h1>猜測答案：</h1>
            <div className='ansBtmDiv'>{answerButtons}</div>
            <h2>生命值數量：{'💜'.repeat(lives)}</h2>
        </div>
    )
}

function Game({topic, allTopics}) {
    const [state, setState] = useState('pregame');
    const [players, setPlayers] = useState(0);

    if (state === 'pregame') {
        return (
            <GetPlayers setPlayers={setPlayers} setState={setState} />
        )
    }

    if (state === 'gaming') {
        return (
            <DrawingRounds players={players} topic={topic} setState={setState} />
        )
    }

    if (state === 'guess') {
        return (
            <GuessAnswer answer={topic} randomAnswers={getMultipleRandom(allTopics.filter(t => t!==topic), 9)} />
        )
    }
}

export default Game;