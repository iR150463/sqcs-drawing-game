import { React } from 'react';
import { Stage, Layer, Line } from 'react-konva';
import { useEffect, useState, useRef } from 'react';

const DrawingArea = (props) => {
    //const onClearLines = props.onClearLines;
    const clearLines = props.clearLines;
    const allowDraw = props.allowDraw;
    const round = props.round;

    const [lines, setLines] = useState([]);
    const isDrawing = useRef(false);
    const mdRound = useRef(0); // mouse down round

    useEffect(() => {
        //loadImage();
    }, [clearLines])
    
    const handleMouseDown = (e) => {
        if (allowDraw) {
            isDrawing.current = true;
            mdRound.current = round;
            const pos = e.target.getStage().getPointerPosition();
            setLines([...lines, { points: [pos.x, pos.y] }]);    
        }
    };
    
    const handleMouseMove = (e) => {
        // no drawing - skipping
        if (!isDrawing.current || mdRound.current !== round) {
            return;
        }
        const stage = e.target.getStage();
        const point = stage.getPointerPosition();
    
        // To draw line
        let lastLine = lines[lines.length - 1];
        
        if(lastLine) {
            // add point
            lastLine.points = lastLine.points.concat([point.x, point.y]);
                
            // replace last
            lines.splice(lines.length - 1, 1, lastLine);
            setLines(lines.concat());
        }
        
    };
    
    const handleMouseUp = () => {
        isDrawing.current = false;
    };

    const className = " text-center text-dark";

    return (
        <div className={className}>
            <Stage
                width={400}
                height={400}
                onMouseDown={handleMouseDown}
                onMousemove={handleMouseMove}
                onMouseup={handleMouseUp}
                className="canvas-stage"
            >
                <Layer>
                    {lines.map((line, i) => (
                        <Line
                        key={i}
                        points={line.points}
                        stroke="rgb(38, 0, 61)"
                        strokeWidth={2}
                        tension={0.5}
                        lineCap="round"
                        globalCompositeOperation={
                            line.tool === 'eraser' ? 'destination-out' : 'source-over'
                        }
                        />
                    ))}
                </Layer>
            </Stage>
        </div>
    )
}

export default DrawingArea