import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// import Style from "./home.module.css";

// Import de Componentes
import SlideBar from "../layout/slide-bar/SlideBar";
import TopBar from "../layout/top-bar/TopBar";

export default function TelaHome(){
    // const navigate = useNavigate();

    const [slidebarAberta, setSlidebarAberta] = useState(true);
    
    return(
        <div>
            <SlideBar aberta={slidebarAberta} setAberta={setSlidebarAberta} />
            <TopBar slidebarAberta={slidebarAberta} />
        </div>
    )
}