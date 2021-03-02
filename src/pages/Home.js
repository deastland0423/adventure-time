import React from 'react';
import EntityBase from '../components/EntityBase';
import sessionDef from '../models/sessionDef';
import locationDef from '../models/locationDef';
import adventureDef from '../models/adventureDef';
import characterDef from '../models/characterDef';
import userDef from '../models/userDef';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { UserProvider } from "../contexts/UserContext";

const Home = () => {
    return (
        <div>
            <UserProvider>
                <div className='App'>
                    <div style={{ backgroundImage: `url("https://cdn.shopify.com/s/files/1/0017/2330/1933/articles/Old-School_Essentials_Classic_Fantasy_Referee_s_Screen_Art_Panels_6f4d7f60-662a-43ef-bbcb-b040b748e7dd_1200x1200.jpg")`}}>
                        <h1 style={{ color: 'white'}}>Into The Unknown: Online Interface</h1>
                    </div>

                <Tabs>
                    <TabList>
                        <Tab>Players</Tab>
                        <Tab>Admin</Tab>
                    </TabList>

                    <TabPanel>
                        <div>
                            <Tabs>
                                <TabList>
                                <Tab>Character Management</Tab>
                                    <Tab>Local Map</Tab>
                                    <Tab>World Map</Tab>
                                </TabList>
                                <TabPanel>
                                    <h3>Your Characters</h3>
                                    <EntityBase entityDef={characterDef} includeOps={false} />
                                </TabPanel>
                                <TabPanel>
                                    <h3>Northhold Hex</h3>
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
                            </Tabs>
                        </div>
                    </TabPanel>
                    <TabPanel>
                    <div>
                        <Tabs>
                            <TabList>
                                <Tab>Users</Tab>
                                <Tab>Locations</Tab>
                                <Tab>Sessions</Tab>
                                <Tab>Adventures</Tab>
                            </TabList>

                            <TabPanel>
                                <h3>Registered Players</h3>
                                <EntityBase entityDef={userDef} includeOps={true} />
                            </TabPanel>
                            <TabPanel>
                                <h3>Locations</h3>
                                <EntityBase entityDef={locationDef} includeOps={true} />
                            </TabPanel>
                            <TabPanel>
                                <h3>Game Sessions</h3>
                                <EntityBase entityDef={sessionDef} includeOps={true} />
                            </TabPanel>
                            <TabPanel>
                                <h3>Calls to Adventure</h3>
                                <EntityBase entityDef={adventureDef} includeOps={true} />
                            </TabPanel>
                        </Tabs>
                    </div>
                    </TabPanel>
                </Tabs>

                </div>
            </UserProvider>
        </div>
    );
};

export default Home;