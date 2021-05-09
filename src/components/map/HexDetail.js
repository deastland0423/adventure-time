import { useEffect, useState } from 'react';
import constants from '../../utils/constants';
import { useResourceContext } from "../../contexts/ResourceContext";
import loading from '../../images/loading.gif';
import CallToAdventure from '../CallToAdventure';

const HexDetail = (props) => {
  const { resource } = useResourceContext();
  const [isLoadingHex, setIsLoadingHex] = useState(true);
  const [isDefined, setIsDefined] = useState(null);
  const [title, setTitle] = useState(null);
  const [ctaHex, setCtaHex] = useState(null);
  const [terrain, setTerrain] = useState(null);
  const [isLoadingSessions, setIsLoadingSessions] = useState(null);
  const [availableSessions, setAvailableSessions] = useState([]);

  useEffect(() => {
    resource.handlers['hex'].callApi('getMultipleByQuery', {map_id: constants.MAP_ID, coords: props.hexCoords})
    .then(response => {
      setIsLoadingHex(false);
      if (response.data.length === 0) {
          console.log(`No Location defined for hex ${props.hexCoords} with blank sub_hex.`);
          setIsDefined(false);
          return;
      } else if (response.data.length > 1) {
          console.log(`WARNING: multiple locations defined at hex ${props.hexCoords} with blank sub_hex, using first`);
      }
      setIsDefined(true);
      setTitle(response.data[0].name);
      setCtaHex(response.data[0]);
      const terrainLabel = constants.TERRAIN_TYPES[response.data[0].terrain_type];
      setTerrain(terrainLabel);
      setIsLoadingSessions(true);

      const sessionHandler = resource.handlers['session'];
      sessionHandler.callApi('getMultipleByQuery', {reserved: 0})
      .then(response => {
        const sessionOptions = response.data.map(row => {
          return {
            id: row.session_id,
            label: sessionHandler.getLabel(row)
          };
        });
        setAvailableSessions(sessionOptions);
        setIsLoadingSessions(false);
      })
      .catch(err => console.log("Error loading sessions: ",err));
    })
    .catch(err => console.log("Error loading hex info:",err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='hex-detail'>
      {isLoadingHex ?
        <div className="loading">
          <img src={loading} alt="loading..."/>
          Loading hex info...
        </div>
        :
        (!isDefined ?
          <div>This area is unknown.</div>
          :
          <div>
            <h1>{title}</h1>
            {props.hexCoords} [{terrain}]<br/>
            {isLoadingSessions ?
              <div className="loading small">
                <img src={loading} alt="loading..."/>
                Loading available sessions...
              </div>
            :
              (availableSessions.length === 0 ?
                <div>When sessions are available, you can create a Call to Action to adventure here.</div>
              :
                <div>
                  <h2>Create a Call to Adventure</h2>
                  <CallToAdventure
                    ctaHex={ctaHex}
                    sessionOptions={availableSessions}
                  />
                </div>
              )
            }
          </div>
        )
      }
    </div>
  );
};

export default HexDetail;
