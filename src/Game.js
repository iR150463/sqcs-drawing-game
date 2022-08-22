import DrawingArea from './DrawingArea';
import { React } from 'react';
import { useState, useEffect } from 'react';
import { getMultipleRandom, pushRandomReturnArr } from './arrayTools';
import { scoring } from "./database"

function GetPlayers({setPlayers, onFinish, setState}) {
    const [input, setInput] = useState(0)

    return (
        <div className='mainDiv'>
            <h1>關卡E：量子疊加 - 畫畫接力</h1>
            <h2>輸入小隊的人數：</h2>
            <div className="App">
                <input type='number' onChange={(e)=>{setInput(e.target.value)}}></input>
                <button onClick={()=>{setPlayers(parseInt(input)); onFinish(); setState('gaming')}}>開始</button>
            </div>
        </div>
    )
}

function DrawingRound(props) {
    const [timeleft, setTimeleft] = useState(10);
    const guessing = props.guessing;
    const round = props.round;

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeleft(p => p-1)
        }, 1000);
      
        return () => clearInterval(interval);
    }, []);

    if (!guessing) {
        const setRound = props.setRound;

        if (timeleft > 0) {
            return (
                <div className='mainDiv'>
                    <h1>完成小組的畫作！題目是：{props.topic}</h1>
                    <div className="App drawing-area">
                        <DrawingArea allowDraw={true} round={round} key="drawingArea"/>
                    </div>
                    <h2>剩下 {timeleft} 秒</h2>
                </div>
            )
        } else {
            return (
                <div className='mainDiv'>
                    <h1>停！交給下一位</h1>
                    <div className="App drawing-area invis">
                        <DrawingArea allowDraw={false} round={round} key="drawingArea"/>
                    </div>
                    <button onClick={()=>{setRound(round+1); setTimeleft(10)}}>繼續</button>
                </div>
            )
        }
    } else {
        const setState = props.setState;

        if (timeleft > 7) {
            return (
                <div className='mainDiv'>
                    <h1>小組的畫作！</h1>
                    <div className="App drawing-area">
                        <DrawingArea allowDraw={false} round={round} key="drawingArea"/>
                    </div>
                    <h2>試著猜出你們小組的主題！</h2>
                    <p>{timeleft-7} 秒後進入下一步</p>
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
                <h1>第一個人就定位！</h1>
                <button onClick={()=>{setRound(1)}}>開始畫畫</button>
            </div>
        )
    }

    // Middle rounds: pure drawings
    if (round < players) {
        return (
            <DrawingRound round={round} setRound={setRound} guessing={false} topic={topic} />
        )
    }

    // Last round: see the drawing and click yes
    if (round === players) {
        return (
            <DrawingRound round={round} setState={setState} guessing={true} topic={topic} />
        )
    }
}

function GuessAnswer({answer, randomAnswers, setState}) {

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
                <button onClick={()=>{setState('pregame')}}>重新遊玩</button>
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
                <button onClick={()=>{setState('pregame')}}>重新遊玩</button>
            </div>
        )
    }

    // Generate question buttons
    let answerButtons = [];
    for (let i=0; i<answersArray.length; i++) {
        if (answersArray[i] === answer) {
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

function Game({allTopics}) {
    const [state, setState] = useState('pregame');
    const [players, setPlayers] = useState(0);
    const [topicLog, setTopicLog] = useState([]);

    if (state === 'pregame') {
        const onFinish = () => {
            const allNewTopics = allTopics.filter((t) => !topicLog.includes(t));
            setTopicLog([...topicLog, allNewTopics[Math.floor(Math.random() * allNewTopics.length)]]);
            setState('gaming')
        }

        return (
            <GetPlayers setPlayers={setPlayers} onFinish={onFinish} setState={setState} />
        )
    }

    const topic = topicLog[topicLog.length-1];

    if (state === 'gaming') {
        return (
            <DrawingRounds players={players} topic={topic} setState={setState} />
        )
    }

    if (state === 'guess') {
        return (
            <GuessAnswer answer={topic} randomAnswers={getMultipleRandom(allTopics.filter(t => t!==topic), 9)} setState={setState} />
        )
    }
}

export default Game;