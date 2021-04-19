import { useRef, useEffect, useState } from 'react';
import constants from '../../utils/constants';
import { useModalContext, showModal } from "../../contexts/ModalContext";
import { useResourceContext } from "../../contexts/ResourceContext";
import { hexCoordsDisplay } from '../../utils/formattingUtils';
import './map.css';
import HexDetail from './HexDetail';
import terrain_lightforest from '../../images/terrain_lightforest.png';
import terrain_denseforest from '../../images/terrain_denseforest.png';
import terrain_grassland from '../../images/terrain_grassland.png';
import terrain_mountain from '../../images/terrain_mountain.png';
import terrain_swamp from '../../images/terrain_swamp.png';

const HexMap = () => {
  const { dispatch: dispatchModal } = useModalContext();
  const { resource } = useResourceContext();
  const canvasRef = useRef(null);
  const [ hexes, setHexes ] = useState({});
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

  function getHex(coords) {
    if(Object.keys(hexes).includes(coords)) {
      const hex = hexes[coords];
      return hex;
    }
    return null;
  }

  useEffect(() => {
    // load hex definitions from the server to get terrain types
    resource.handlers['hex'].callApi('getMultipleByQuery', {map_id: constants.MAP_ID})
    .then(response => {
      let hexes=[];
      for(let i=0; i<response.data.length; i++) {
        const hex = response.data[i];
        hexes[hex.coords] = hex;
      }
      setHexes(hexes);
    })
    .catch(err => alert("Error loading hexmap:"+err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings_show_hex_coordinates]);

  useEffect(() => {
    // Will draw the map when hexes are loaded.
    drawMap();
  }, [hexes]);

  function drawMap() {
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
        let hex_defined = false;
        const hexDef = getHex(`${grid_x},${grid_y}`);
        if(hexDef) {
          hex_defined = true;
          switch(hexDef.terrain_type) {
            case 'LIGHT_FOREST':
              hex.setAttribute("fill", "url(#lightforest_bg)");
              break;
            case 'DENSE_FOREST':
              hex.setAttribute("fill", "url(#denseforest_bg)");
              break;
            case 'GRASSLAND':
              hex.setAttribute("fill", "url(#grassland_bg)");
              break;
            case 'MOUNTAIN':
              hex.setAttribute("fill", "url(#mountain_bg)");
              break;
            case 'SWAMP':
              hex.setAttribute("fill", "url(#swamp_bg)");
              break;
            default:
              hex_defined = false;
          }
        }
        if(!hex_defined) {
          hex.setAttribute("fill", "whitesmoke");
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
  }

  return (
    <div id="hexmap">
      <svg xmlns="http://www.w3.org/2000/svg" ref={canvasRef} height={map_height} width="100%">
        <defs>
          <pattern id="lightforest_bg" height="100%" width="100%">
            <image x="0" y="0" height={hex_height} width={hex_width} xlinkHref={terrain_lightforest}></image>
          </pattern>
          <pattern id="denseforest_bg" height="100%" width="100%">
            <image x="0" y="0" height={hex_height} width={hex_width} xlinkHref={terrain_denseforest}></image>
          </pattern>
          <pattern id="grassland_bg" height="100%" width="100%">
            <image x="0" y="0" height={hex_height} width={hex_width} xlinkHref={terrain_grassland}></image>
          </pattern>
          <pattern id="swamp_bg" height="100%" width="100%">
            <image x="0" y="0" height={hex_height} width={hex_width} xlinkHref={terrain_swamp}></image>
          </pattern>
          <pattern id="mountain_bg" height="100%" width="100%">
            <image x="0" y="0" height={hex_height} width={hex_width} xlinkHref={terrain_mountain}></image>
          </pattern>
        </defs>
      </svg>
    </div>
  );
};

export default HexMap;
