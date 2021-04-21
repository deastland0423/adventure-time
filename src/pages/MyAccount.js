import { useEffect, useState } from 'react';
import { useUserContext } from "../contexts/UserContext";
import BasicForm from '../components/BasicForm';
import userDef from '../models/userDef';

const MyAccount = () => {
  const { auth } = useUserContext();
  const [ user, setUser ] = useState(null);
  useEffect(() => {
    setUser(auth.user);
  }, [auth]);

  return(
    <div id="my-account" className="outer">
      <h1>My Account</h1>
      <div className="inner">
        {auth.user ?
          <BasicForm
            resourceDef={userDef}
            formData={user}
          />
        :
          <strong>You must be logged in to access this page.</strong>
        }
      </div>
    </div>
  );
};

export default MyAccount;
