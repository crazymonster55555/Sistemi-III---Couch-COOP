import { BrowserRouter, Routes, Route } from "react-router";
import App from "./App";
import Dashboard from "../components/dashboard";
import Register from "../components/register";
import ResetPassword from "../components/resetPassword";
import MakeSession from "../components/makeSession";

export default function AppRouter(){
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />}/>
                <Route path="/app" element={<App />}/>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/register" element={<Register />} />
                <Route path="/resetPassword" element={<ResetPassword />} />
                <Route path="/dashboard/makeSession" element={<MakeSession />} />
            </Routes>
        </BrowserRouter>
    )
}