import { BrowserRouter, Routes, Route } from "react-router";
import App from "./App";
import Dashboard from "../components/dashboard";

export default function AppRouter(){
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />}/>
                <Route path="/app" element={<App />}/>
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
        </BrowserRouter>
    )
}