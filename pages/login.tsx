import React from 'react';
import MainLogin from '../components/MainLogin';
import { GetServerSideProps } from 'next';
import { getServerSideProps as getServerSidePropsWithAuth } from '../components/WithAuth';
import { ILoginPageNextGetServerSideProps, ILoginPageProps } from '../types/LoginPage';


export const Login: React.FC<ILoginPageProps> = (props) => {
  return (
    // <Layout>
      <MainLogin />
    // </Layout>
  );
};

export const getServerSideProps: GetServerSideProps<ILoginPageNextGetServerSideProps> = async (context) => {
  const result = await getServerSidePropsWithAuth(context);
  if (!("props" in result)) {
    throw new Error("props doesn't exist!");
  }

  const { user } = result.props;
  if (user) {
    return {
      redirect: {
        statusCode: 302,
        destination: "/"
      },
      props: {
        authenticated: true
      }
    };
  }

  return {
    props: {
      authenticated: false
    }
  };
};

// const mapStateToProps = (state: StoreState, ownProps: IMainLogin.IInnerProps): IMainLogin.IStateFromProps => {
//   return {
//       userLoggedIn: state.userMisc.userLoggedIn,
//   };
// };
//
// const mapDispatchToProps = (dispatch: Dispatch<UserActionType>, ownProps: IMainLogin.IInnerProps): IMainLogin.IPropsFromDispatch => {
//   return {
//       setUserIsLoggedIn: (userLoggedIn: boolean) => dispatch(setUserIsLoggedIn(userLoggedIn)),
//   };
// };

export default Login;

