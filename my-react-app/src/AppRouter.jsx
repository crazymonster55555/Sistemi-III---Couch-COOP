import { BrowserRouter, Routes, Route } from "react-router";
import App from "./App";
import Dashboard from "../components/dashboard";
import Register from "../components/register";

export default function AppRouter(){
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />}/>
                <Route path="/app" element={<App />}/>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </BrowserRouter>
    )
}