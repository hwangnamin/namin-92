"use client";

import { createContext, useContext, useState } from "react";

const Context = createContext({});

export function Provider({ children }) {
  const [date, setDate] = useState("");
  const [meetingName, setMeetingName] = useState("");

  return (
    <Context.Provider
      value={{
        date,
        setDate,
        meetingName,
        setMeetingName,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export function useForm() {
  return useContext(Context);
}
