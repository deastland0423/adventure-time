import { useRef, useEffect } from 'react';
import { useModalContext, showModal } from "../../contexts/ModalContext";
import { hexCoordsDisplay } from '../../utils/formattingUtils';
import './map.css';
import HexDetail from './HexDetail';
import terrain_forest from '../../images/terrain_forest.png';

const HexMap = () => {
    const { dispatch: dispatchModal } = useModalContext();
    const canvasRef = useRef(null);
    // Hard-coded map constants
    const mapview_height_hexes = 3; // How many full hexes are shown in the map view.
    const grid_cols = 10;   // How wide the world map is in hexes.
    const grid_rows = 10;   // How tall the world map is in hexes.
    // User-modifiable map "settings"
    const settings_show_hex_coordinates = false;
    const settings_hex_radius = 368/2;
    const settings_initial_topleft_grid_x = 2;
    const settings_initial_topleft_grid_y = 6;
    // calculate derived constants
    const hex_height = Math.ceil(settings_hex_radius * Math.sin(2*Math.PI * 1/6)) * 2;
    const hex_width = settings_hex_radius * 2;
    const map_height = mapview_height_hexes * hex_height;
    let mapview_base_x = -settings_initial_topleft_grid_x * hex_width;
    let mapview_base_y = -settings_initial_topleft_grid_y * hex_height;

    useEffect(() => {
        // draw the hexagons
        const hex_radius = settings_hex_radius;
        const hex_spacing = Math.ceil(  hex_radius * (Math.cos(2*Math.PI * 1/6) - Math.cos(2*Math.PI * 2/6) )   );
        for (let grid_x=0; grid_x<grid_cols; grid_x++) {
            for (let grid_y=0; grid_y<grid_rows; grid_y++) {
                // calculate pixel coordinates for hex from grid coordinates
                const angle_width = (hex_width-hex_spacing)/2;
                let base_x = mapview_base_x + Math.ceil(hex_radius + grid_x*(hex_spacing+angle_width));
                let base_y = mapview_base_y + Math.ceil(grid_y*hex_height + hex_height/2);
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
                if("terrain_type === forest") {
                    hex.setAttribute("fill", "url(#forest_bg)")
                }
                canvasRef.current.appendChild(hex);
                hex.addEventListener("click", (event) => {
                    const hexCoords = event.target.getAttribute('data-coords');
                    dispatchModal(showModal(
                        <HexDetail hexCoords={hexCoords}/>
                    ));
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
            <svg xmlns="http://www.w3.org/2000/svg" ref={canvasRef} height={map_height} width="100%">
                <defs>
                    <pattern id="forest_bg" height="100%" width="100%">
                        <image x="0" y="0" height={hex_height} width={hex_width} xlinkHref={terrain_forest}></image>
                    </pattern>
                </defs>
            </svg>
        </div>
    );
};

export default HexMap;