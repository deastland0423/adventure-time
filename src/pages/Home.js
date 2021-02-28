import React from 'react';
import EntityBase from '../components/EntityBase';
import sessionDef from '../models/sessionDef';
import locationDef from '../models/locationDef';
import adventureDef from '../models/adventureDef';
import userDef from '../models/userDef';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { UserProvider } from "../contexts/UserContext";

const Home = () => {
    return (
        <div>
            <UserProvider>
                <div className='App'>
                <h1>Into The Unknown: Online Interface</h1>

                <Tabs>
                    <TabList>
                    <Tab>Players</Tab>
                    <Tab>Admin</Tab>
                    </TabList>

                    <TabPanel>
                        <div>
                            <h2>Coming Soon!</h2>
                            <Tabs>
                                <TabList>
                                    <Tab>Local Map</Tab>
                                    <Tab>World Map</Tab>
                                </TabList>

                                <TabPanel>
                                    <h3>Northhold Hex</h3>
                                    <img src="https://adventure-time-world-map.s3.amazonaws.com/Northhold.jpg" alt="new" />
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
                                <EntityBase entityDef={userDef} />
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

                <footer>
                    <div className='footer'>
                    Built by Daniel Eastland and Benjamin Bradley, with assistance from Shedrack Akintayo
                    </div>
                </footer>
                </div>
            </UserProvider>
        </div>
    );
};

export default Home;