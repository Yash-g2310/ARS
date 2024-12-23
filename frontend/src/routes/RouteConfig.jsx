import MainLayout from "../components/layout/MainLayout";
import UserProfile from "../components/dashboard/UserProfile";
import LoginSignup from "../pages/LoginSignup";
import DashboardLayout from "../components/layout/DashboardLayout";
import NotActive from "../components/common/NotActive";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import ChanneliCallback from "../components/loginSignUp/ChanneliCallback";
import SpaceLayout from "../components/layout/SpaceLayout";
import SpaceDetailComponent from "../components/layout/SpaceDetailComponent";

const routes = [
    {
        path: '/',
        element: (
            // <PublicRoute>
            <LoginSignup />
            // </PublicRoute>
        ),
    },
    {
        path: "/auth/callback",

        element: (
            // <PublicRoute>
            <ChanneliCallback />
            // </PublicRoute>
        )
    },
    {
        element: (
            <PrivateRoute>
            <MainLayout />
            </PrivateRoute>
        ),
        children: [
            {
                path: 'dashboard',
                element: (
                    // <PrivateRoute>
                        <DashboardLayout />
                    // </PrivateRoute>
                ),
                children: [
                ]
            },
            {
                path: 'spaces/:spaceId',
                element: (
                    // <PrivateRoute>
                        <SpaceLayout />
                    // </PrivateRoute>
                ),
                children: [
                    {
                        path: '',
                        element: (
                            // <PrivateRoute>
                                <NotActive />
                            // </PrivateRoute>
                        )
                    },
                    {
                        path: 'details',
                        element: (
                            // <PrivateRoute>
                                <SpaceDetailComponent />
                            // </PrivateRoute>
                        )
                    }

                ]
            }
        ]
    },
];

export default routes;