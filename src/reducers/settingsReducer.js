import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  theme: false,
  timeFormat: 24,
  time:'12:00',
  connection: '4G',
  battery: 100,
  name:'Joe Done!',
  status:'Online',
  numberOfMessages: '111',

  messages:[{
    id:0,
    text:'Message text Message text Message textWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    time:'12:00',
    isSender:true,
    status:'read',
    receiverName:'',
    answer:{isAnswer:false, answerId:null, name:'Name', answerText:'Answer text Answer text Answer textWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW'},
    date:{isDate:false, date:'12.31.2023'}
}]
};


const settingsReducer = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        changeTheme: (state, action) => {
            state.theme = action.payload;
        },
        changeTimeFormat: (state,action)=> {
            state.timeFormat = action.payload;
        },
        changeConnectionType: (state,action)=>{
            state.connection = action.payload;
        },
        changeTime:(state,action)=>{
        state.time = action.payload;
        },
        changeBattery:(state,action)=>{
            state.battery = action.payload;
        },
        changeName:(state,action)=>{
            state.name = action.payload;
        },
        changeStatus:(state,action)=>{
            state.status = action.payload;
        },
        changeNumberOfMessages:(state,action)=>{
            state.numberOfMessages = action.payload;
        }

    }
})

export const {
    changeTheme,
    changeTimeFormat,
    changeConnectionType,
    changeTime,
    changeBattery,
    changeName,
    changeStatus,
    changeNumberOfMessages
} = settingsReducer.actions;

export default settingsReducer.reducer;