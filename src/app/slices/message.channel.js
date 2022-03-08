import { createSlice } from "@reduxjs/toolkit";
import {
  msgReaction,
  msgAdd,
  msgSetRead,
  msgClearUnread,
  msgUpdate,
  msgDelete,
} from "./message.handler";
const initialState = {};

const channelMsgSlice = createSlice({
  name: "channelMessage",
  initialState,
  reducers: {
    clearChannelMsg() {
      return initialState;
    },
    initChannelMsg(state, action) {
      return action.payload;
    },
    addChannelMsg(state, action) {
      msgAdd(state, action.payload);
    },
    deleteChannelMsg(state, action) {
      msgDelete(state, action.payload);
    },
    updateChannelMsg(state, action) {
      msgUpdate(state, action.payload);
    },
    likeChannelMsg(state, action) {
      msgReaction(state, action.payload);
    },
    setChannelMsgRead(state, action) {
      msgSetRead(state, action.payload);
    },
    clearChannelMsgUnread(state, action) {
      msgClearUnread(state, action.payload);
    },
  },
});
export const {
  updateChannelMsg,
  deleteChannelMsg,
  likeChannelMsg,
  clearChannelMsg,
  initChannelMsg,
  clearChannelMsgUnread,
  setChannelMsgRead,
  addChannelMsg,
} = channelMsgSlice.actions;
export default channelMsgSlice.reducer;
