import { useDispatch, useSelector } from 'react-redux';
import styles from './Settings.module.css';
import { changeTheme,changeTimeFormat,changeConnectionType,changeTime,changeBattery  } from '../../reducers/settingsReducer';
import React from 'react';


const Settings = () => {
  const values = useSelector((state) => state.settings);
  const dispatch = useDispatch();

  const handleThemeChange = (value) => {
    dispatch(changeTheme(value));
  }

  const handleTimeFormat = (value) => {
    dispatch(changeTimeFormat(value));
  }

  const handleTimeChange = (value) => {
    dispatch(changeTime(value));
  }

  const handleConnectionType = (value) => {
    dispatch(changeConnectionType(value));
  }

  const handleBatteryChange = (value) => {
  
  if (!/^[0-9]+$/.test(value.toString())) {
  return;
  }
  
  value = Math.min(Math.max(value, 0), 100);

  dispatch(changeBattery(value));
  
  };

  const handleEnterKey = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      event.target.blur();
    }
  };

  const handleSelectAll = (event) => {
    event.target.select();
  };


  return (
    <div className={styles.mainSettings}>
      <form className={styles.formWrapper}>
        <div className={styles.setting}>
          <h3 style={{fontSize:'18px', fontFamily:'Arial'}}>Dark Theme</h3>
          <label className={styles.switch}>
            <input type="checkbox" checked={values.theme} onChange={() => handleThemeChange(!values.theme)} />
            <span className={`${styles.slider} ${styles.round}`}></span>
          </label>
        </div>

        <div className={styles.setting}>
          <label>
            <input type="radio" value="24" checked={values.timeFormat === 24} onChange={() => handleTimeFormat(24)} />
            24 Hours
          </label>
          <label>
            <input type="radio" value="12" checked={values.timeFormat === 12} onChange={(e) => handleTimeFormat(Number(e.target.value))} />
            12 Hours
          </label>
          <input className={styles.timeInput} type="time" value={values.time} max={"23:59"} min={"00:01"} onChange={(e) => handleTimeChange(e.target.value)} />
        </div>

        <div className={styles.setting}>
          <label>
            <input type="radio" value='4G' checked={values.connection === '4G'} onChange={(e) => handleConnectionType(e.target.value)} />
            4G
          </label>
          <label>
            <input type="radio" value='3G' checked={values.connection === '3G'} onChange={(e) => handleConnectionType(e.target.value)} />
            3G
          </label>
          <label>
            <input type="radio" value='Wifi' checked={values.connection === 'Wifi'} onChange={() => handleConnectionType('Wifi')} />
            Wifi
          </label>
        </div>
        <div className={styles.setting}>
          <h3 style={{fontSize:'18px', fontFamily:'Arial'}}>Battery</h3>
          <label className={styles.batteryInp}>
            <input className={styles.batteryInput}
              type="text"
              placeholder="%"
              value={values.battery}
              onChange={(e)=>handleBatteryChange(e.target.value)}
              onKeyDown={handleEnterKey}
              onClick={handleSelectAll}
              maxLength={3}
              />
          </label>
        </div>
      </form>
    </div>
  );
};

export default Settings;
