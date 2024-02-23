import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    theme: false,
    timeFormat: 24,
    time: '12:00',
    connection: '4G',
    battery: 100,
    name: 'Joe Done!',
    status: 'Online',
    numberOfMessages: '111',
    profileUrl: '',
    
    messages: [
        {
            id: 0,
            text: '',
            time: '',
            isSender: false,
            status: '',
            receiverName: '',
            answer: {
                isAnswer: false,
                answerId: null,
                name: '',
                answerText: ''
            },
            date: { isDate: true, date: "2024-01-05" }
        },
        {
            id: 1,
            text: 'Hi there! How are you doing today?',
            time: '12:00',
            isSender: false,
            status: 'read',
            receiverName: 'Name',
            answer: {
                isAnswer: false,
                answerId: null,
                name: 'Name',
                answerText: 'Я відповідаю'
            },
            date: { isDate: false, date: "" }
        },
        {
            id: 2,
            text: 'Yeah, it was nice. I spent some time relaxing at home. How about you?',
            time: '12:01',
            isSender: true,
            status: 'read',
            receiverName: '',
            answer: {
                isAnswer: true,
                answerId: 0,
                name: 'Name',
                answerText: 'Hi there! How are you doing today?'
            },
            date: { isDate: false, date: "" }
        }
    ]
};

const settingsReducer = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        changeTheme: (state, action) => {
            state.theme = action.payload;
        },
        changeTimeFormat: (state, action) => {
            state.timeFormat = action.payload;
        },
        changeConnectionType: (state, action) => {
            state.connection = action.payload;
        },
        changeTime: (state, action) => {
            state.time = action.payload;
        },
        changeBattery: (state, action) => {
            state.battery = action.payload;
        },
        changeName: (state, action) => {
            state.name = action.payload;
        },
        changeStatus: (state, action) => {
            state.status = action.payload;
        },
        changeNumberOfMessages: (state, action) => {
            state.numberOfMessages = action.payload;
        },
        changeProfileUrl: (state, action) => {
            state.profileUrl = action.payload;
        },
        
        
        resetSettings: (state, action) => {
            return initialState
        },

        handleEditMessage: (state, action) => {
            const { text, isSender, status, receiverName, time, answer, id, date } = action.payload;

            const newMessage = {
                id,
                text,
                time,
                isSender,
                status,
                receiverName,
                answer,
                date,
            }

            state.messages = state.messages.map(message => message.id === id ? newMessage : message)
        },

        handleAddNewMessage: (state, action) => {
            const getLastMessageIndex = state.messages.at(-1).id || 0

            const { text, isSender, status, receiverName, time } = action.payload;

            const newMessage = {
                id: getLastMessageIndex + 1,
                text,
                time,
                isSender,
                status,
                receiverName,
                answer: {
                    isAnswer: false,
                    answerId: null,
                    name: '',
                    answerText: '',
                },
                date: { isDate: false, date: '' }
            }

            state.messages.push(newMessage)
        },

        handleReplyOnMessage: (state, action) => {
            const getLastMessageIndex = state.messages.length > 0 ? state.messages.at(-1).id : 0
            const { text, isSender, status, receiverName, time, answer, id, date } = action.payload;

            const newMessage = {
                id: getLastMessageIndex + 1,
                text,
                time,
                isSender,
                status,
                receiverName,
                answer,
                date,
            }

            state.messages.push(newMessage)
        },

        handleAddNewDateMessage: (state, action) => {
            const getLastMessageIndex = state.messages.length > 0 ? state.messages.at(-1).id : 0

            const { date } = action.payload;

            const newDateMessage = {
                id: getLastMessageIndex + 1,
                text: '',
                time: '',
                isSender: false,
                status: '',
                receiverName: '',
                answer: {
                    isAnswer: false,
                    answerId: null,
                    name: '',
                    answerText: ''
                },
                date: { isDate: true, date }
            }

            state.messages.push(newDateMessage)
        },

        handleDeleteMessage: (state, action) => {
            state.messages = state.messages.filter(({ id }) => id !== action.payload)
        }

    }
})

export const {
    handleReplyOnMessage,
    handleEditMessage,
    resetSettings,
    handleDeleteMessage,
    handleAddNewDateMessage,
    handleAddNewMessage,
    changeTheme,
    changeTimeFormat,
    changeConnectionType,
    changeTime,
    changeBattery,
    changeName,
    changeStatus,
    changeNumberOfMessages,
    changeProfileUrl,
} = settingsReducer.actions;

export default settingsReducer.reducer;
