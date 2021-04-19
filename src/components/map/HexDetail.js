import { useEffect, useState } from 'react';
import constants from '../../utils/constants';
import { useResourceContext } from "../../contexts/ResourceContext";
import loading from '../../images/loading.gif';

const HexDetail = (props) => {
  const { resource } = useResourceContext();
  const [isLoading, setIsLoading] = useState(true);
  const [isDefined, setIsDefined] = useState(null);
  const [title, setTitle] = useState(null);
  const [isExplored, setIsExplored] = useState(null);
  const [terrain, setTerrain] = useState(null);

  useEffect(() => {
    resource.handlers['hex'].callApi('getMultipleByQuery', {map_id: constants.MAP_ID, coords: props.hexCoords})
    .then(response => {
      setIsLoading(false);
      if (response.data.length === 0) {
          console.log(`No Location defined for hex ${props.hexCoords} with blank sub_hex.`);
          setIsDefined(false);
          return;
      } else if (response.data.length > 1) {
          console.log(`WARNING: multiple locations defined at hex ${props.hexCoords} with blank sub_hex, using first`);
      }
      setIsDefined(true);
      setTitle(response.data[0].name);
      setIsExplored(response.data[0].is_explored);
      setTerrain(response.data[0].terrain_type);
    })
    .catch(err => console.log("Error loading hex info:",err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='hex-detail'>
      {isLoading ?
        <div className="loading">
          <img src={loading} alt="loading..."/>
          Loading hex info...
        </div>
        :
        (!isDefined ?
          <div>This area is unknown.</div>
          :
          <div>
            <h2>{title}</h2>
            {props.hexCoords} [{terrain}]<br/>
            {!isExplored ? 'This land is unexplored.' :
              <pre>
                TODO: add list locations within this hex...
                <br/>
                WHERE hex={props.hexCoords}
              </pre>
            }
          </div>
        )
      }
    </div>
  );
};

export default HexDetail;