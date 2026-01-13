import { useState, Fragment, useEffect } from "react";
import Wheel from "@uiw/react-color-wheel";
import { hsvaToHex, hexToHsva } from "@uiw/color-convert";
import { FaRegCircleXmark } from "react-icons/fa6";

interface ColorWheelProps {
  setShowColorWheel: (b: boolean) => void;
  currentColor: string;
  onColorChange: (color: string) => void;
}

function ColorWheel(props: ColorWheelProps) {
  const [hsva, setHsva] = useState(() => hexToHsva(props.currentColor));

  useEffect(() => {
    setHsva(hexToHsva(props.currentColor));
  }, [props.currentColor]);

  const handleApply = () => {
    props.onColorChange(hsvaToHex(hsva));
    props.setShowColorWheel(false);
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={() => props.setShowColorWheel(false)}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-semibold">Modal heading</h2>
            <button
              onClick={() => props.setShowColorWheel(false)}
              className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
            >
              <FaRegCircleXmark />
            </button>
          </div>
          <div className="p-4">
            <Fragment>
              <Wheel
                color={hsva}
                onChange={(color) => setHsva({ ...hsva, ...color.hsva })}
              />
              <div
                style={{
                  width: "100%",
                  height: 34,
                  marginTop: 20,
                  background: hsvaToHex(hsva),
                }}
              ></div>
            </Fragment>
          </div>

          <div className="flex justify-end gap-2 p-4 border-t">
            <button
              onClick={() => props.setShowColorWheel(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Close
            </button>
            <button
              onClick={handleApply}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ColorWheel;
