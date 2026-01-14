import React from "react";

import Style from "./carrosseis.module.css";

export default function CompPodcastDestaque() {
    return (
        <div>
            <div className={Style.divTitulosDosPodcasts}>
                <i className="fa-solid fa-music"></i>
                <p>Novidades</p>
            </div>
        </div>
    );
}