import React from "react";
import { useNavigate } from "react-router-dom";

export default function TelaHome(){
    const navigate = useNavigate();
    return(
        <div>
            <h1 onClick={()=>navigate("/login")}>Login</h1>
        </div>
    )
}