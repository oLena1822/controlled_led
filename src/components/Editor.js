import React, {useEffect, useState} from "react";
import "../styles/editor.scss";
import {CirclePicker} from "react-color";
import PixelPanel from "./PixelPanel";
import Swal from "sweetalert2";

export default function Editor() {
    const [field, setField] = useState(() => Array(64).fill('#000'));
    const [selectedColor, setColor] = useState("#f44336"); //Changing color palettes

    const GetColors = async () => {
        try {
            const response = await fetch(`http://192.168.1.157:80/state`);
            const json = await response.json();
            return json.pixels.reduce((acc, { col, row, colour }) => {
                return (acc[row * 8 + col] = `#${"0".concat(colour[0].toString(16)).slice(-2)}${colour[0].toString(16)}${colour[0].toString(16)}`, acc);
            }, []);
        }
        catch(e) {
            return [];
        }
    }


    useEffect(() => {
        GetColors()
            .then((value)=>{setField([...value])})
            .catch(() =>{})
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
                fetch('http://192.168.1.157/control', {
                    mode: 'no-cors',
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer `
                    },
                    redirect: "follow",
                    body: JSON.stringify({
                        "cmd": "CLEAR_ALL"
                    }),
                });

                setField((p) => p.fill('#000'));
                Swal.fire(
                    "Clear!",
                    "Pixel panel cleared",
                    "success"
                );
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