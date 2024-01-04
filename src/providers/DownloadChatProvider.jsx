import {createContext, useContext, useState} from "react";
import {toPng} from "html-to-image";

const DownloadChatContext = createContext(null)

export const useDownloadChat = () => useContext(DownloadChatContext)

const DownloadChatProvider = ({children}) => {
    const [chatRef, setChatRef] = useState({current: null})

    const onSetChatRef = (ref) => setChatRef(ref)

    const getShareChatImageURL = () => {
        if (chatRef.current === null) {
            return
        }
        return toPng(chatRef.current, { cacheBust: true, })
            .then(dataUrl => dataUrl)
            .catch((err) => {
                console.log(err)
            })
    }

    const downloadPng = () => {
        if (chatRef.current === null) {
            return
        }
        toPng(chatRef.current, { cacheBust: true, })
            .then((dataUrl) => {
                const link = document.createElement('a')
                link.download = `name of the png image`
                link.href = dataUrl
                link.click()
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const values = {
        downloadPng,
        onSetChatRef,
        getShareChatImageURL
    }

    return <DownloadChatContext.Provider value={values}>{children}</DownloadChatContext.Provider>
}


export default DownloadChatProvider;
