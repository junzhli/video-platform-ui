import React, {useContext, useEffect} from 'react';
import Layout from '../components/Layout';
import { GetServerSideProps } from 'next';
import { getServerSideProps as getServerSidePropsWithAuth } from '../components/WithAuth';
import {GlobalStateContext} from "../store";
import {setUserIsLoggedIn} from "../actions/user";
import {IResultNextGetServerSideProps, IResultPageProps} from "../types/ResultPage";
import {searchUserPublicVideos} from "../utils/api";
import {IResponseBodySearchUserPublicVideos} from "../types/_api";
import SearchResult from "../components/SearchResult";

export const Result: React.FC<IResultPageProps> = (props) => {
    const { state, dispatch } = useContext(GlobalStateContext);


    useEffect(() => {
        if (!state.userMisc.userLoggedIn && props.authenticated) {
            dispatch(setUserIsLoggedIn(true));
        }
    });

    return (
        <Layout query={props.query}>
            <SearchResult
                data={props.data}
                page={props.page}
                query={props.query}
                total={props.total}
            />
        </Layout>
    );
};

export const getServerSideProps: GetServerSideProps<IResultNextGetServerSideProps> = async (context) => {
    const result = await getServerSidePropsWithAuth(context);
    if (!("props" in result)) {
        throw new Error("props doesn't exist!");
    }
    const { user } = result.props;
    const queryString = !Array.isArray(context.query.query) ? context.query.query ? unescape(context.query.query) : null : null;
    const page = !Array.isArray(context.query.p) ? !isNaN(Number(context.query.p)) ? Number(context.query.p) : 1 : 1;

    let response;
    try {
        response = await searchUserPublicVideos(queryString, page);

    } catch (error) {
        if (error.response && error.response.status) {
            if (error.response.status === 404) {
                return {
                    props: {
                        authenticated: (user),
                        query: queryString,
                        page,
                        total: 0,
                        data: []
                    }
                };
            }
        } else {
            throw error;
        }
    }
    const data = response.data as IResponseBodySearchUserPublicVideos;
    const { total, results } = data;

    return {
        props: {
            authenticated: (user),
            query: queryString,
            page,
            total,
            data: results
        }
    };
};

export default Result;
