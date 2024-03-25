import {createBrowserRouter, Navigate} from "react-router-dom";
import Login from "../pages/Login";
import Home from "../pages/Home";
import NewArticle from "../pages/NewArticle";
import Register from "../pages/Register";
import ArticleDetails from "../pages/ArticleDetails"
import Profile from "../pages/Profile";
import {getCurrentUserInfo} from "../utils";
import EditProfile from "../pages/EditProfile";
import AppLayout from "../pages/AppLayout";
import UpdateArticle from "../pages/UpdateArticle";

/**
 * A custom component for routing authentication
 * If token obtained, then render its children
 * If not, navigate to login page
 */
const AuthRouter = ({children}) => {
    const currentUserInfo = getCurrentUserInfo()
    if (currentUserInfo.user_token) {
        return <>{children}</>
    } else {
        return <><Navigate to={'/login'} replace={true}/></>
    }
}

const router = createBrowserRouter([
    {
        path: "*",
        element: <div>404!</div>
    },
    {
        path: "/",
        element: <AuthRouter>
            <AppLayout />
        </AuthRouter>,
        children: [
            {
                path: "",
                element: <Home />,
            },
            {
                path: "publish",
                element: <NewArticle />,
            },
            {
                path: "/myProfile",
                element: <AuthRouter>
                    <EditProfile />
                </AuthRouter>,
            },
            {
                path: "/profile/:username",
                element: <AuthRouter>
                    <Profile />
                </AuthRouter>,
            },
            {
                path: "/update/:id",
                element: <AuthRouter>
                    <UpdateArticle />
                </AuthRouter>
            },
            {
                path: "/details/:id",
                element: <AuthRouter>
                    <ArticleDetails />
                </AuthRouter>
            },
        ]
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
])

export default router
