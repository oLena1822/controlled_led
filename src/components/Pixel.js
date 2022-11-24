import React, { useState} from "react";
import "../styles/pixel.scss";

export default function Pixel({field, index, selectedColor, setField}) {
    const pixelColor = field[index];
    const [oldColor, setOldColor] = useState(pixelColor);
    const [canChangeColor, setCanChangeColor] = useState(true);

    function HexToRgb() {
        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(selectedColor);
        if(result) {
            let r = parseInt(result[1], 16);
            let g = parseInt(result[2], 16);
            let b = parseInt(result[3], 16);
            return [r, g, b];
        }
        return null;
    }

    function SendColor(){
        let row = Math.floor(index/8);
        let column = index%8;

        fetch(`http://192.168.4.1/control`, {
            mode: 'no-cors',
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            redirect: "follow",
            body: JSON.stringify({
                "cmd": "SET_PIXELS",
                "pixels": [
                    {
                        "row": row,
                        "col": column,
                        "colour": HexToRgb(),
                    },
                ],
            }),
        }).then(()=>{
            setField(p => {
                const copy = [...p];
                copy[index] = selectedColor;
                return copy;
            });
        });
    }


    function applyColor() {
        SendColor();
        setCanChangeColor(false);
    }

    function changeColorOnHover() {
        setOldColor(pixelColor);
        setField(p => {
            const copy = [...p];
            copy[index] = selectedColor;
            return copy;
        });
    }


    function resetColor() {
        if (canChangeColor) {
            setField(p => {
                const copy = [...p];
                copy[index] = oldColor;
                return copy;
            });
        }
        setCanChangeColor(true)
    }


    return (
        <div
            className="pixel"
            onClick={applyColor}
            onMouseEnter={changeColorOnHover}
            onMouseLeave={resetColor}
            style={{backgroundColor: pixelColor}}
        >
        </div>
    );
}