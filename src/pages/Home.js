import React, { useEffect } from 'react';
import constants from '../utils/constants';
import { useUserContext, userHasRole } from "../contexts/UserContext";
import { useResourceContext, registerDef } from "../contexts/ResourceContext";
import EntityBase from '../components/EntityBase';
import HexMap from '../components/map/HexMap';
import sessionDef from '../models/sessionDef';
import locationDef from '../models/locationDef';
import adventureDef from '../models/adventureDef';
import characterDef from '../models/characterDef';
import hexDef from '../models/hexDef';
import userDef from '../models/userDef';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Calendar from '../components/Calendar';

const Home = () => {
  const { auth } = useUserContext();
  const { dispatch } = useResourceContext();
  useEffect(() => {
    // On first page load, initialize all resource/entity types.
    dispatch(registerDef(sessionDef));
    dispatch(registerDef(locationDef));
    dispatch(registerDef(adventureDef));
    dispatch(registerDef(characterDef));
    dispatch(registerDef(hexDef));
    dispatch(registerDef(userDef));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='App'>
      <div style={{ backgroundImage: `url("https://cdn.shopify.com/s/files/1/0017/2330/1933/articles/Old-School_Essentials_Classic_Fantasy_Referee_s_Screen_Art_Panels_6f4d7f60-662a-43ef-bbcb-b040b748e7dd_1200x1200.jpg")`}}>
        <h1 style={{ color: 'white'}}>Into The Unknown: Online Interface</h1>
      </div>

      <Tabs>
        <TabList>
          {constants.DEBUG_PERMS || userHasRole(auth.user, 'PLAYER') ?
            <Tab>Players</Tab>
          : null}
          {constants.DEBUG_PERMS || userHasRole(auth.user, ['DM', 'ADMIN']) ?
            <Tab>DM</Tab>
          : null}
          {constants.DEBUG_PERMS || userHasRole(auth.user, 'ADMIN') ?
            <Tab>Admin</Tab>
          : null}
        </TabList>

        {constants.DEBUG_PERMS || userHasRole(auth.user, 'PLAYER') ?
          <TabPanel>
            <div>
              <Tabs>
                <TabList>
                  <Tab>Character Management</Tab>
                  <Tab>Hex Map</Tab>
                  <Tab>Calendar</Tab>
                  <Tab>Local Map</Tab>
                  <Tab>World Map</Tab>
                  <Tab>Adventures</Tab>
                </TabList>
                <TabPanel>
                  <h3>Your Characters</h3>
                  <EntityBase entityDef={characterDef} includeOps={false} />
                </TabPanel>
                <TabPanel>
                  <HexMap/>
                </TabPanel>
                <TabPanel>
                  <h3>Calendar of Adventure!</h3>
                  <Calendar/>
                </TabPanel>
                <TabPanel>
                  <h3>Northhold Local Area</h3>
                  <div id="picture-scroll">
                    <img src="https://adventure-time-world-map.s3.amazonaws.com/Northhold.jpg" alt="new" />
                  </div>
                </TabPanel>
                <TabPanel>
                <div id="picture-scroll">
                  <h3>World Map</h3>
                  <img src="https://adventure-time-world-map.s3.amazonaws.com/BigPlayerMap.JPG" alt="new" />
                </div>
                </TabPanel>
                <TabPanel>
                  <h3>Calls to Adventure</h3>
                  <EntityBase entityDef={adventureDef} includeOps={true} />
                </TabPanel>
              </Tabs>
            </div>
          </TabPanel>
      : null}
      {constants.DEBUG_PERMS || ['DM', 'ADMIN'].some((role) => userHasRole(auth.user, role)) ?
        <TabPanel>
          <div>
            <Tabs>
              <TabList>
                <Tab>Locations</Tab>
                <Tab>Sessions</Tab>
              </TabList>

              <TabPanel>
                <h3>Locations</h3>
                <EntityBase entityDef={locationDef} includeOps={true} />
              </TabPanel>
              <TabPanel>
                <h3>Game Sessions</h3>
                <EntityBase entityDef={sessionDef} includeOps={true} />
              </TabPanel>
            </Tabs>
          </div>
        </TabPanel>
      : null}
      {constants.DEBUG_PERMS || userHasRole(auth.user, 'ADMIN') ?
        <TabPanel>
        <div>
          <Tabs>
            <TabList>
              <Tab>Hexes</Tab>
              <Tab>Users</Tab>
            </TabList>

            <TabPanel>
              <h3>Hexes</h3>
              <EntityBase entityDef={hexDef} includeOps={true} />
            </TabPanel>
            <TabPanel>
              <h3>Registered Players</h3>
              <EntityBase entityDef={userDef} includeOps={true} />
            </TabPanel>
          </Tabs>
        </div>
        </TabPanel>
      : null}
      </Tabs>
    </div>
  );
};

export default Home;
