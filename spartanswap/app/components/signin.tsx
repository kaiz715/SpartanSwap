/**
 * SignInWithGoogle Component
 * 
 * Provides Google OAuth 2.0 login functionality integrated with CWRU email verification.
 * 
 * Features:
 * - Renders the Google Sign-In button using Google's Identity Services client library.
 * - Defines a global `signIn` function to handle the Google credential response:
 *   - Sends the credential to the backend for verification.
 *   - If valid and a CWRU email, stores the JWT token in cookies.
 *   - If invalid (non-CWRU email), displays an error message.
 * - Displays a loading state during authentication (although it's not fully tied to async behavior yet).
 * 
 * Technologies Used:
 * - React-cookie for handling JWT token storage in cookies.
 * - Axios for communicating with the backend authentication API.
 * - Google Identity Services for rendering and managing OAuth flow.
 * 
 * Notes:
 * - Backend must validate the user's email domain to ensure they are a CWRU student.
 * - The Google script is embedded directly inside the component.
 */

import axios from "axios";
import { useEffect, useState } from "react";
import { CookiesProvider, useCookies } from "react-cookie";

export default function SignInWithGoogle() {
    const [loading, setLoading] = useState(false);
    const [cookies, setCookie] = useCookies(["jwt_token"]);
    const [CWRUerror, setCWRUerror] = useState(false);

    useEffect(() => {
        window.signIn = function (response: { credential: string | Blob }) {
            setLoading(true);
            var bodyFormData = new FormData();
            bodyFormData.append("credential", response.credential);
            console.log("Sending credential to backend:", response.credential);
            axios
                .post(
                    "http://localhost:5001/signin",
                    bodyFormData
                )
                .then((JWTresponse) => {
                    console.log("Backend response:", JWTresponse.data);
                    if (JWTresponse.data.CWRU_validated) {
                        console.log("Logged in");
                        setCookie("jwt_token", JWTresponse.data.jwt_token, {
                            path: "/",
                        });
                    } else {
                        console.log("Must be a CWRU email to log in");
                        setCWRUerror(true);
                    }
                    console.log(response);
                })
                .catch((error) => {
                    console.log(error);
                });
            setLoading(false);
        };
    });

    return (
        <div>
            <div>
                <script
                    src="https://accounts.google.com/gsi/client"
                    async
                ></script>
                <div
                    id="g_id_onload"
                    data-client_id="435330253471-vga9r129els35fsddcpgegesjtac5d1d.apps.googleusercontent.com"
                    data-context="signin"
                    data-ux_mode="popup"
                    data-callback="signIn"
                    data-itp_support="true"
                ></div>

                <div
                    className="g_id_signin"
                    data-type="standard"
                    data-shape="rectangular"
                    data-theme="outline"
                    data-text="signin_with"
                    data-size="large"
                    data-logo_alignment="left"
                ></div>
            </div>
            {CWRUerror && (
                <div style={{ color: "red", marginTop: "10px" }}>
                    Must be a CWRU email to log in. Please try again.
                </div>
            )}
        </div>
    );
}
