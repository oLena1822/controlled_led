import React from "react";
import "../styles/pixel_panel.scss";
import Pixel from "./Pixel";

const PixelPanel = ({ field, setField, selectedColor }) => (
  <div id="pixel_panel">
    {Array(64)
      .fill(0)
      .map((_, i) => (
        <Pixel
          key={i}
          index={i}
          field={field}
          setField={setField}
          selectedColor={selectedColor}
        />
      ))}
  </div>
);

export default PixelPanel;
