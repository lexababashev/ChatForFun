import styles from './IOSSettings.module.css'
import React from 'react';
import FourGimg from '../../assets/icons/4G.png';
import ThreeGimg from '../../assets/icons/3G.png';
import WiFIimg from '../../assets/icons/Wifi.png';
import FourGimgD from '../../assets/icons/4GDark.png';
import ThreeGimgD from '../../assets/icons/3GDark.png';
import WiFIimgD from '../../assets/icons/WifiDark.png';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';

const IOSSettings = () => {
    const [connectionImg, setConnectionImg] = useState('');
    const darkTheme = useSelector((state) => state.settings.theme);
    const connection = useSelector((state) => state.settings.connection);
    const time = useSelector((state)=>state.settings.time);
    const timeFormat = useSelector((state) => state.settings.timeFormat);
    const [batteryWidth, setBatteryWidth] = useState(21);
    const battery = useSelector((state) => state.settings.battery);

    const handleConnectionChange = (selectedConnection) => {
        if (selectedConnection === '3G' && !darkTheme) {
            setConnectionImg(ThreeGimg);
        } else if (selectedConnection === '4G' && !darkTheme) {
            setConnectionImg(FourGimg);
        } else if (selectedConnection === 'Wifi' && !darkTheme) {
            setConnectionImg(WiFIimg);
        } else if (selectedConnection === '3G' && darkTheme) {
            setConnectionImg(ThreeGimgD);
        }
        else if (selectedConnection === '4G' && darkTheme) {
            setConnectionImg(FourGimgD);
        }
        else if (selectedConnection === 'Wifi' && darkTheme) {
            setConnectionImg(WiFIimgD);
        }
        else {
            setConnectionImg('');
        }
    };

    const calculateBatteryWidth = () => {
        const maxBatteryWidth = 21;
        const calculatedWidth = (battery / 100) * maxBatteryWidth;
        return calculatedWidth;
    };

    const format12HourTime = (time) => {
        const splitTime = time.split(':');
        let hours = parseInt(splitTime[0], 10);
        const minutes = splitTime[1];

        let ampm = 'AM';
        if (hours >= 12) {
            ampm = 'PM';
        }
        if (hours > 12) {
            hours -= 12;
        }
        return `${hours}:${minutes} ${ampm}`;
    };

    useEffect(() => {
        setBatteryWidth(calculateBatteryWidth());
    }, [battery]);

    useEffect(() => {
        handleConnectionChange(connection);
    }, [connection, darkTheme]);

    const formattedTime = timeFormat === 24 ? time : format12HourTime(time);

    return (
        <div className={styles.container}>
            <div className={styles.top}>
                <div className={`${styles.left_corner} ${darkTheme ? styles.darkLC : ''} `}>
                    <span>{formattedTime}</span>
                </div>

                <div className={styles.right_corner}>
                    <img className={styles.connectionStyle} src={connectionImg} alt="Connection" />
                    <div className={styles.batteryStyle}>
                        <div className={`${styles.batteryStyle_charge} ${darkTheme ? styles.darkB : ''} `} 
                        style={{ width: `${batteryWidth}px` }} >
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IOSSettings;