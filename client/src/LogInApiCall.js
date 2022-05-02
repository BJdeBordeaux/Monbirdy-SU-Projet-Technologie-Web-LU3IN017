import axios from "axios";


export const LogInApiCall = async (userInputs, dispatch) => {
    // try {
    dispatch({
        type: "LogInCheck"
    });

    axios.post("/auth/login", {
            ...userInputs
        }, {
            withCredentials: true,
            // transformResponse: (r) => r,
        })
        .then(res => {
            dispatch({
                type: "LogInSuccess",
                payload: res.data
            })
        })
        .catch(err => {
            dispatch({
                type: "LogInFailure",
                payload: err.response.data
            })
        });

}