import React, { useState } from 'react';
import { createPath, useNavigate } from "react-router-dom";
import CustomInput from '../components/CustomInput.js';
import { AiFillGithub } from 'react-icons/ai'
import { BsFillKeyFill } from 'react-icons/bs'
import BiziLogo from '../icons/Bizi_Boardz-logos.jpeg'
import FormInputError from '../components/FormInputError.js';
import { useAuthUtils } from '../backend/octokit/useAuthUtils.js';
import { encryptData } from '../backend/octokit/encrypt.js';
const Login = () => {
    const { pat, setPAT, activeRepo, setActiveRepo, setUserName, octokitAuth, octokitAuthRepo, setIsAuthenticated } = useAuthUtils(); 
    const [showUrlError, setShowUrlError] = useState(false);
    const [showPATError, setShowPATError] = useState(false);
    const navigate = useNavigate();

    const handleUrlChange = event => {
        setActiveRepo(event.target.value); // Setting state in custom auth util hook
        setShowUrlError(false);  // Hide error messages when re-focusing text
    }
    const handleTokenChange = event => {
        setPAT(event.target.value); 
        setShowPATError(false); // Hide error messages when re-focusing text
    }

    
    const handleSubmit = async event => {
        event.preventDefault();
        try {
            const loggedInUser = await octokitAuth(pat); // Get logged in username from auth hook
            setUserName(loggedInUser); // Set in auth hook
            
            setShowPATError(false);
            const validUrl = await octokitAuthRepo(pat, activeRepo); // Returns true if valid url
            if (loggedInUser && validUrl) {
                // encrypt
                const encryptedPat = encryptData(pat)
                
                localStorage.setItem("userName", loggedInUser);
                localStorage.setItem("pat", encryptedPat);
                localStorage.setItem("activeRepo", activeRepo);
                setIsAuthenticated(true);
                navigate("/currentSprint");
            } else if (!validUrl) {
                setShowUrlError(true);
            }
        } catch (error) {
            setShowPATError(true);
            console.error('Error during authentication:', error);
        }
    };
    
    return (
        <div className="Login">
            <header className="App-header">
                <img src = {BiziLogo} alt={'Bizi Logo'} style = {{
                    width: '300px',
                    height: '300px'
                }}>
                </img>
                <p>
                    Welcome to Bizi Boardz
                </p>

                <div className = "Container">

                <form onSubmit={handleSubmit} className = "Form">
                    <CustomInput icon={<AiFillGithub />} type={'text'} onChange = {handleUrlChange} placeholder={'Enter your GitHub repository URL'} />
                    <FormInputError errorText = {'Please enter a valid GitHub Repository Url!'} visible={showUrlError}/>
                    
                    <CustomInput icon = {<BsFillKeyFill/>} type = {'password'} onChange = {handleTokenChange} placeholder = {'Enter your GitHub personal Access token'} /> 
                    <FormInputError errorText = {'Please enter a valid GitHub Personal Access Token!'} visible={showPATError}/>
                
                    <input type="submit" value="Submit" />
                </form>

                </div>

            </header>           
        </div>
    );
}

export default Login;
