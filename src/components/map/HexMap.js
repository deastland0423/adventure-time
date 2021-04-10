import { useRef, useEffect } from 'react';
import { useModalContext, showModal } from "../../contexts/ModalContext";
import { hexCoordsDisplay } from '../../utils/formattingUtils';
import './map.css';

const HexMap = () => {
    const { dispatch: dispatchModal } = useModalContext();
    const canvasRef = useRef(null);
    const settings_show_hex_coordinates = true;
    const settings_hex_radius = 100;
    const settings_grid_cols = 9;
    const settings_grid_rows = 3;

    useEffect(() => {
        const hex_radius = settings_hex_radius;
        const hex_height = Math.ceil(hex_radius * Math.sin(2*Math.PI * 1/6)) * 2;
        const hex_width = Math.ceil(hex_radius * Math.cos(2*Math.PI * 0/6)) * 2;
        const hex_spacing = Math.ceil(  hex_radius * (Math.cos(2*Math.PI * 1/6) - Math.cos(2*Math.PI * 2/6) )   );
        for (let grid_x=0; grid_x<settings_grid_cols; grid_x++) {
            for (let grid_y=0; grid_y<settings_grid_rows; grid_y++) {
                // calculate pixel coordinates for hex from grid coordinates
                const angle_width = (hex_width-hex_spacing)/2;
                let base_x = Math.ceil(hex_radius + grid_x*(hex_spacing+angle_width));
                let base_y = Math.ceil(grid_y*hex_height + hex_height/2);
                if (grid_x % 2 === 1) {  // offset for odd rows
                    base_y += Math.ceil(hex_height/2);
                }
                // calculate pixel coordinates of hex vertices
                let pointlist = [];
                for (let i=0; i<6; i++) {
                  const theta = 2 * Math.PI * i / 6;
                  const vx = base_x + Math.ceil(hex_radius * Math.cos(theta));
                  const vy = base_y + Math.ceil(hex_radius * Math.sin(theta));
                  pointlist.push(`${vx},${vy}`);
                }
                pointlist.push(pointlist[0]);
                const poly_def = pointlist.join(' ');
                // add the hexagon to the svg
                const hex = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
                hex.setAttribute("points", poly_def);
                hex.setAttribute("data-coords",`${grid_x},${grid_y}`);
                hex.setAttribute("class","hex");
                canvasRef.current.appendChild(hex);
                hex.addEventListener("click", (event) => {
                    const hexCoords = event.target.getAttribute('data-coords');
                    dispatchModal(showModal(`this is the modal for hex at ${hexCoords}`));
                });

                if (settings_show_hex_coordinates) {
                    const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
                    label.textContent = `${hexCoordsDisplay(grid_x,grid_y)}`;
                    label.setAttribute("x", Math.ceil(base_x));
                    label.setAttribute("y", Math.ceil(base_y));
                    label.setAttribute("class", "hexlabel");
                    canvasRef.current.appendChild(label);
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [settings_show_hex_coordinates]);

    return (
        <div id="hexmap">
            <svg xmlns="http://www.w3.org/2000/svg" ref={canvasRef}>
            </svg>
        </div>
    );
};

export default HexMap;