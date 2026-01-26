import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface FlowTab {
  id: string;
  label: string;
  color: string;
  nodes: any[];
  edges: any[];
}

interface TabHistory {
  past: FlowTab[];
  present: FlowTab;
  future: FlowTab[];
}

interface TabHistoryState {
  histories: Record<string, TabHistory>;
}

const initialState: TabHistoryState = {
  histories: {},
};

export const tabHistorySlice = createSlice({
  name: "tabHistory",
  initialState,
  reducers: {
    recordAction: (
      state,
      action: PayloadAction<{
        tabId: string;
        flowTab: FlowTab;
        currentFlowTab?: FlowTab;
      }>,
    ) => {
      const { tabId, flowTab, currentFlowTab } = action.payload;
      const history = state.histories[tabId];

      if (!history) {
        state.histories[tabId] = {
          past: currentFlowTab ? [currentFlowTab] : [],
          present: flowTab,
          future: [],
        };
      } else {
        state.histories[tabId] = {
          past: [...history.past, history.present],
          present: flowTab,
          future: [],
        };
      }
    },
    undo: (state, action: PayloadAction<string>) => {
      const tabId = action.payload;
      const history = state.histories[tabId];

      if (!history || history.past.length === 0) return;

      const previous = history.past[history.past.length - 1];
      const newPast = history.past.slice(0, history.past.length - 1);

      state.histories[tabId] = {
        past: newPast,
        present: previous,
        future: [history.present, ...history.future],
      };
    },
    redo: (state, action: PayloadAction<string>) => {
      const tabId = action.payload;
      const history = state.histories[tabId];

      if (!history || history.future.length === 0) return;

      const next = history.future[0];
      const newFuture = history.future.slice(1);

      state.histories[tabId] = {
        past: [...history.past, history.present],
        present: next,
        future: newFuture,
      };
    },
    clearHistory: (state, action: PayloadAction<string>) => {
      const tabId = action.payload;
      delete state.histories[tabId];
    },
  },
});

export const { recordAction, undo, redo, clearHistory } =
  tabHistorySlice.actions;
export default tabHistorySlice.reducer;
