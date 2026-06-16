import { BrowserRouter, Routes, Route } from "react-router";
import App from "./App";
import Dashboard from "../components/dashboard";

export default function AppRouter(){
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/app" element={<App />}/>
            </Routes>
        </BrowserRouter>
    )
}