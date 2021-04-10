import { useEffect, useState } from 'react';
import constants from '../../utils/constants';
import { useResourceContext } from "../../contexts/ResourceContext";
import loading from '../../images/loading.gif';

const HexDetail = (props) => {
  const { resource } = useResourceContext();
  const [isLoading, setIsLoading] = useState(true);
  const [isDefined, setIsDefined] = useState(null);
  const [title, setTitle] = useState(null);
  const [isEmpty, setIsEmpty] = useState(null);

  useEffect(() => {
    resource.handlers['location'].callApi('getMultipleByQuery', {map_id: constants.MAP_ID, hex: props.hexCoords, sub_hex: null})
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
      setIsEmpty(response.data[0].is_empty);
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
            {props.hexCoords}<br/>
            {isEmpty ? 'Nothing to see here' :
              <pre>
                TODO: add list of sub-locations within this hex...
                <br/>
                WHERE hex={props.hexCoords} and subhex != ''
              </pre>
            }
          </div>
        )
      }
    </div>
  );
};

export default HexDetail;