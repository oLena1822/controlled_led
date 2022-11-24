import React, {useEffect, useState} from "react";
import "../styles/editor.scss";
import {CirclePicker} from "react-color";
import PixelPanel from "./PixelPanel";
import Swal from "sweetalert2";

export default function Editor() {
    const [field, setField] = useState(() => Array(64).fill('#000000'));
    const [selectedColor, setColor] = useState("#f44336"); //Changing color palettes

    const rgbToHex = (r,g,b) => {
        return "#" + ( 1<<24 | r<<16 | g<<8 | b ).toString(16).slice(1);

    }

    const GetColors = async () => {
        try {
            const response = await fetch(`http://192.168.4.1/state`);
            const json = await response.json();
            const t = json.pixels.map((obj) => {
                return rgbToHex(obj.colour[0], obj.colour[1], obj.colour[2]);
            });
            return t;
        }
        catch(e) {
            await Swal.fire({
                title: "Error!",
                text: "Sorry there was an error loading this data",
                icon: "error",
                confirmButtonText: "Ok",
            });
            return [];
        }
    }

    useEffect( () => {
        const getData = async () => {
            const colors = await GetColors();
            console.log(colors)
            setField(colors);
        };
        getData().then(()=>{});
    }, [])

    function changeColor(color) {
        setColor(color.hex);
    }

    async function ClearPanel() {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, clear it!",
        }).then((result) => {
            if (result.isConfirmed) {
                fetch('http://192.168.4.1/control', {
                    mode: 'no-cors',
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    redirect: "follow",
                    body: JSON.stringify({
                        "cmd": "CLEAR_ALL"
                    }),
                })
                    .then(() => {
                        setField(Array(64).fill('#000000'))
                        Swal.fire(
                            "Clear!",
                            "Pixel panel cleared",
                            "success"
                        );
                    })
                    .catch(() =>{
                        Swal.fire({
                            title: "Error!",
                            text: "Unable to clear",
                            icon: "error",
                            confirmButtonText: "Ok",
                        });
                        return [];
                    })

            }
        });

    }


    return (
        <div id="editor">
            <h1> Wifi Controlled LED </h1>

            <CirclePicker
                color={selectedColor}
                onChangeComplete={changeColor}/>

            <PixelPanel
                field={field}
                setField={setField}
                selectedColor={selectedColor}
            />
            <div className="buttons">
                <button
                    className="button"
                    onClick={ClearPanel}>
                    <b> Clear All</b>
                </button>
            </div>

        </div>
    );
}