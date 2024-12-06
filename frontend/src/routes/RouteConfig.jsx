import MainLayout from "../components/layout/MainLayout";
import UserProfile from "../components/UserProfile";
import LoginSignup from "../pages/LoginSignup";
import DashboardLayout from "../components/layout/DashboardLayout";
import NotActive from "../components/common/NotActive";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import ChanneliCallback from "../components/ChanneliCallback";

const routes = [
    {
        path: '/',
        element: (
            <PublicRoute>
                <LoginSignup />
            </PublicRoute>
        ),
    },
    {
        path: "/auth/callback",

        element: (
            <PublicRoute>
                <ChanneliCallback />
            </PublicRoute>
        )
    },
    {
        element: <MainLayout />,
        children: [
            {
                path: 'dashboard',
                element: (
                    <PrivateRoute>
                        <DashboardLayout />
                    </PrivateRoute>
                ),
                children: [
                    { index: true, element: <NotActive /> },
                    {
                        path: 'profile',
                        element: (
                            <PrivateRoute>
                                <UserProfile />
                            </PrivateRoute>
                        )
                    }
                ]
            },
            {
                path: 'spaces',
            }
        ]
    },
];

export default routes;