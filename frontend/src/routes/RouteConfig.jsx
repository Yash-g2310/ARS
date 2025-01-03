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
import SpaceNotActive from "../components/layout/SpaceNotActive";
import SubSpaceDetailComponent from "../components/layout/SubSpaceDetailComponent";
import AssignmentLayout from "../components/layout/AssignmentLayout";
import AssignmentDetailComponent from "../components/layout/AssignmentDetailComponent";
import AssignmentMembers from "../components/layout/AssignmentMembers";
import AssignmentEditComponent from "../components/layout/AssignmentEditComponent";
import AssignmentCreate from "../components/layout/AssignmentCreate";

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
                                <SpaceNotActive/>
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
                    },
                    {
                        path: 'subspaces/:subSpaceId',
                        // element: (
                        //     // <PrivateRoute>
                        //     <SpaceNotActive/>
                        //     // </PrivateRoute>
                        // ),
                        children: [ 
                            {
                                path: 'details',
                                element: (
                                    // <PrivateRoute>
                                        <SubSpaceDetailComponent/>
                                    // </PrivateRoute>
                                )
                            },
                            {
                                path: 'create-assignment',
                                element: <AssignmentCreate/>
                            },
                            {
                                path: 'assignments/:assignmentId',
                                element: <AssignmentLayout/>,
                                children: [
                                    {
                                        path: 'details',
                                        element: <AssignmentDetailComponent/>
                                    },
                                    {
                                        path: 'members',
                                        element: <AssignmentMembers/>
                                    },
                                    {
                                        path: 'submissions',
                                        element: <NotActive/>
                                    },
                                    {
                                        path: 'edit',
                                        element: <AssignmentEditComponent/>,
                                    },
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    },
];

export default routes;