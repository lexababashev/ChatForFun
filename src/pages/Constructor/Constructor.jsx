import React from "react";
import Settings from "../../components/Settings/Settings";
import WorkPlaceChat from "../../components/WorkPlaceChat/WorkPlaceChat";
import FooterButtons from "../../components/FooterButtons/FooterButtons";
import DownloadChatProvider from "../../providers/DownloadChatProvider.jsx";

const Constructor = () => {

    return (
        <>
            <DownloadChatProvider>
                <Settings/>
                <WorkPlaceChat/>
                <FooterButtons/>
            </DownloadChatProvider>
        </>
    )
};


export default Constructor;
