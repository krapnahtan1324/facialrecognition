import React from "react";
import './FaceRecognition.css'

const FaceRecognition = ({ imageurl, boxes }) => {
    return (
        <div className="center ma">
            <div className="mt2 absolute">  
                <img id='inputimage' alt="" src={ imageurl } width='500px' height='auto'/>
                {
                    boxes.map((box, i) => {
                        const {leftcol, toprow, rightcol, bottomrow} = box;
                        return (<div key = {i} id="face" className="bounding-box" 
                            style={{left: leftcol, top: toprow, right: rightcol, bottom: bottomrow}}></div>);
                })
                }
            </div>
        </div>
    );
}

export default FaceRecognition;