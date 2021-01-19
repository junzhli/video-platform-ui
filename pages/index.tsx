import React, {useContext, useEffect} from 'react';
import Layout from '../components/Layout';
import { GetServerSideProps } from 'next';
import {IIndexNextGetServerSideProps, IIndexPageProps} from '../types/IndexPage';
import { getServerSideProps as getServerSidePropsWithAuth } from '../components/WithAuth';
import {GlobalStateContext} from "../store";
import {setUserIsLoggedIn} from "../actions/user";
import HomeVideos from "../components/HomeVideos";
import {getRecentVideos} from "../utils/api";
import {IResponseBodyUserVideos} from "../types/_api";

export const Home: React.FC<IIndexPageProps> = (props) => {
  const { state, dispatch } = useContext(GlobalStateContext);

  useEffect(() => {
    if (!state.userMisc.userLoggedIn && props.authenticated) {
      dispatch(setUserIsLoggedIn(true));
    }
  });
  return (
        <Layout>
          <HomeVideos latestVideos={props.videos} />
        </Layout>
    );
};

export const getServerSideProps: GetServerSideProps<IIndexNextGetServerSideProps> = async (context) => {
  const result = await getServerSidePropsWithAuth(context);
  if (!("props" in result)) {
    throw new Error("props doesn't exist!");
  }
  const { user } = result.props;

  const response = await getRecentVideos();
  const videos = response.data as IResponseBodyUserVideos;

  return {
    props: {
      authenticated: (user),
      videos
    }
  };
};

export default Home;
