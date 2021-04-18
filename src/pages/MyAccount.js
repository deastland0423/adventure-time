import { useRef, useEffect } from 'react';
import { useUserContext } from "../contexts/UserContext";
import BasicForm from '../components/BasicForm';
import userDef from '../models/userDef';

const MyAccount = () => {
    const { auth } = useUserContext();
    const formRef = useRef(null);
    useEffect(() => {
        const recordData = auth.user;
        if (formRef.current) {
            formRef.current.loadData(recordData);
        }
    });

    return(
        <div id="my-account" className="outer">
            <h1>My Account</h1>
            <div className="inner">
                {auth.user ?
                    <BasicForm
                        userContext={{auth}}
                        entityDef={userDef}
                        onComplete={() => {}}
                        ref={formRef}
                        onCancel={false}
                    />
                :
                    <strong>You must be logged in to access this page.</strong>
                }
            </div>
        </div>
    );
};

export default MyAccount;