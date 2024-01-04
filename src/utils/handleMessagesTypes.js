export const isMessageFromSender = (message) => message.isSender === true

export const isMessageFromReceiver = (message) => message.isSender === false

export const isMessageReply = (message) => message.answer.isAnswer === true

export const isMessageDate = (message) => message.date.isDate
