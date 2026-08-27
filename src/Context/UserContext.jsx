import { createContext, useEffect, useState } from "react";

export let UserContext = createContext();


export default function UserContextProvider({ children }) {
    
    const [userToken, setUserToken] = useState('')
    useEffect(() => {
        let token = localStorage.getItem('userToken');
        setUserToken(token)
    }, [])
    

  return (
    <UserContext.Provider value={{ userToken, setUserToken }}>
      {children}
    </UserContext.Provider>
  );
}
