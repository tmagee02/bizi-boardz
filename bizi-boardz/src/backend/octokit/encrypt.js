import CryptoJS from "crypto-js";
const secretKey = process.env.REACT_APP_SECRET_KEY


const encryptData = (pat) => {
    const secretKey = process.env.REACT_APP_SECRET_KEY
    const data = CryptoJS.AES.encrypt(
        JSON.stringify(pat),
        secretKey
      ).toString();
    
    return data;
}


const decryptData = (encryptedPat) => {
    const bytes = CryptoJS.AES.decrypt(encryptedPat, secretKey);
    let decryptedData = bytes.toString(CryptoJS.enc.Utf8);

    decryptedData = decryptedData.replace(/"([^"]+)"/, '$1');
    return decryptedData;
}

export {encryptData, decryptData}