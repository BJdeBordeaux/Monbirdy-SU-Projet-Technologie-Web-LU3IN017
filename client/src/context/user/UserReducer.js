import axios from "axios";

export default function UserReducer(state, action) {
    switch (action.type) {
        case "LogInCheck":
            return {
                user: null,
                    isFetchingInformation: true,
            }
            break;

        case "LogInSuccess":
            return {
                user: action.payload,
                    isFetchingInformation: false,
                    error: null,
            }
            break;
        case "LogInFailure":
            return {
                user: null,
                    isFetchingInformation: false,
                    error: action.payload,
            }
            break;
        case "ChangeProfilePhoto":
            return {
                user: {
                        ...state.user,
                        profilePhoto: action.payload
                    },
                    ...state,
            }
            break;
        case "ChangeCoverPhoto":
            return {
                user: {
                        ...state.user,
                        coverPhoto: action.payload
                    },
                    ...state,
            }
            break;
        case "ChangeCoverPhotoImgur":
            return {
                user: {
                        ...state.user,
                        coverPhotoImgur: action.payload
                    },
                    ...state,
            }
            break;
        case "AddFollowing":
            return {
                ...state,
                user: {
                    ...state.user,
                    followings: [...state.user.followings, action.payload]
                }
            }
            break;
        case "RemoveFollowing":
            return {
                ...state,
                user: {
                    ...state.user,
                    followings: state.user.followings.filter(following => following !== action.payload)
                }
            }
            break;
        case "LogOut":
            return {
                user: null,
                    ...state,
            }
            break;
        case "ShowFriends":
            return {
                ...state,
                showFriends: !state.showFriends,
            }
            break;
        case "ChangeUserInfo":
            return {
                ...state,
                user: {
                    ...state.user,
                    ...action.payload
                }
            }
            break;

        default:
            return state;
    }
}