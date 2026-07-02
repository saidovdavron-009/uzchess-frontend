"use client"
import {useEffect, useState} from "react";
import axios from "axios";
import {getToken, clearToken, isTokenExpired} from "./authApi";
import AuthModal from "./AuthModal";

export default function TokenGuard() {
    const [showLogin, setShowLogin] = useState(false);

    useEffect(() => {
        const check = () => {
            const token = getToken();
            if (token && isTokenExpired(token)) {
                clearToken();
                setShowLogin(true);
            }
        };

        check();

        const interval = setInterval(check, 60_000);

        const interceptorId = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    clearToken();
                    setShowLogin(true);
                }
                return Promise.reject(error);
            }
        );

        return () => {
            clearInterval(interval);
            axios.interceptors.response.eject(interceptorId);
        };
    }, []);

    return (
        <AuthModal
            open={showLogin}
            onClose={() => setShowLogin(false)}
            onSuccess={() => {
                setShowLogin(false);
                window.location.reload();
            }}
        />
    );
}
