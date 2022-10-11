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
        let row = Math.floor(index / 8);
        let column = index % 8;
        row += 1
        column += 1

        fetch(`http://192.168.1.157:80/control`, {
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
                        "colour": HexToRgb()
                    }
                ]

            }),
        }).then(()=>{});
    }


    function applyColor() {
        setField(p => {
            const copy = [...p];
            copy[index] = selectedColor;
            return copy;
        });
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




    // const GetColors = async () => {
    //     try {
    //         let url = (`http://192.168.1.157:80/state`);
    //         const response = await fetch(url)
    //         const json = await response.json();
    //         let newJson = json.pixels.map(({ col, row, colour }) => {
    //             const index = row * 8 + col;
    //             const color = `#${"0".concat(colour[0].toString(16)).slice(-2)}${colour[0].toString(16)}${colour[0].toString(16)}`
    //             return color;
    //         });
    //         setField(newJson)
    //     }
    //
    //     catch (e) {
    //         await Swal.fire({
    //             title: "Error!",
    //             text: "Sorry there was an error loading this data",
    //             icon: "error",
    //             confirmButtonText: "Ok",
    //         });
    //         return [];
    //     }
    // };


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