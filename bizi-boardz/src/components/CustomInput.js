import React, { useState } from 'react'
import '../styles/CustomInput.css'
import '../styles/bizi-boardz-styles.css'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'

const CustomInput = ({ type, icon, placeholder, value, onChange, name }) => {
    const [showPassword, setShowPassword] = useState(false);
    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <>
            <div className="input_wrapper">
                <div className='input_container'>
                    {icon &&
                        <div className="input_icon">
                            {icon}
                        </div>
                    }
                    
                    <input 
                        type={showPassword ? 'text' : type}
                        placeholder={placeholder}
                        value={value}
                        onChange={onChange}
                        name={name}
                    />
                    
                    {type === 'password' && (
                        <div className="input_icon" onClick={handleTogglePassword}>
                            {!showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
export default CustomInput