import { createContext, useEffect, useReducer } from "react"
import UserReducer from './UserReducer'

const INITIAL_STATE = {
    user: JSON.parse(sessionStorage.getItem("user")) || null,
    isFetchingInformation: false,
    error: undefined,
    showFriends: false,
}

export const UserContext = createContext(INITIAL_STATE);


export const AuthContextProvider = ({children})=>{
    const [state, dispatch] = useReducer(UserReducer, INITIAL_STATE);

    useEffect(()=>{
        sessionStorage.setItem("user", JSON.stringify(state.user));
    }, [state.user]);

    return (
        <UserContext.Provider
        value={{
            user: state.user,
            isFetchingInformation: state.isFetchingInformation,
            error: state.error,
            showFriends: state.showFriends,
            dispatch,
        }}>
            {children}
        </UserContext.Provider>
    );
}