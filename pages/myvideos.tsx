import React, {useContext, useEffect} from 'react';
import Layout from '../components/Layout';
import { GetServerSideProps } from 'next';
import {
    getServerSideProps as getServerSidePropsWithAuth
} from '../components/WithAuth';
import MyVideoLibrary from "../components/MyVideoLibrary";
import {GlobalStateContext} from "../store";
import {setUserIsLoggedIn} from "../actions/user";
import {IMyVideoNextGetServerSideProps, IMyVideoPageProps} from "../types/MyVideoPage";
import {getUserVideos} from "../utils/api";
import {IResponseBodyUserVideos} from "../types/_api";

export const MyVideo: React.FC<IMyVideoPageProps> = (props) => {
    const { state, dispatch } = useContext(GlobalStateContext);

    useEffect(() => {
        if (!state.userMisc.userLoggedIn && props.authenticated) {
            dispatch(setUserIsLoggedIn(true));
        }
    });

    return (
        <Layout>
            <MyVideoLibrary myvideos={props.data}/>
        </Layout>
    );
};

export const getServerSideProps: GetServerSideProps<IMyVideoNextGetServerSideProps> = async (context) => {
    const result = await getServerSidePropsWithAuth(context);
    if (!("props" in result)) {
        throw new Error("props doesn't exist!");
    }
    const { user, sessionId } = result.props;
    if (!user) {
        context.res.setHeader("test-header", "test");
        return {
            redirect: {
                statusCode: 302,
                destination: "/login"
            },
            props: {
                authenticated: true,
                page: -1,
                data: [],
            }
        };
    }

    // fetch user video list from api server
    const page = (Number(context.query.p) > 0) ? Number(context.query.p) : 1;
    const response = await getUserVideos(sessionId, page);
    const data = response.data as IResponseBodyUserVideos;

    return {
        props: {
            authenticated: true,
            page,
            data
        },
    };
};

export default MyVideo;
