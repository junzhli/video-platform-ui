import React from 'react';
import Layout from '../components/Layout';
import MainSignUp from '../components/MainSignUp';
import { GetServerSideProps } from 'next';
import { redirectToDashboard } from '../components/WithAuth';
import { getServerSideProps as getServerSidePropsWithAuth } from '../components/WithAuth';
import { ISignUpPageNextGetServerSideProps, ISignUpPageProps, ISignUpPageStates } from '../types/SignUpPage';
import MainSignUpCompletion from '../components/MainSignUpCompletion';


class SignUp extends React.Component<ISignUpPageProps, ISignUpPageStates> {
  constructor(props) {
    super(props);
    this.completionToggle = this.completionToggle.bind(this);
    this.state = {
      completion: false,
    };
  }

  componentDidUpdate(preProps: ISignUpPageProps, preStates: ISignUpPageStates) {
    // user press back button on browser to back to initial state
    if (preStates.completion && this.state.completion) {
      if (typeof window !== "undefined" && window.location.hash !== "complete") {
        this.setState({
          userEmail: undefined,
          completion: false,
        });
      }
    }
  }

  completionToggle(userEmail?: string) {
    if (typeof window !== "undefined" && typeof userEmail !== "undefined") {
      window.location.hash = "complete";
    }

    this.setState({
      userEmail,
      completion: (typeof userEmail !== "undefined"),
    });
  }

  render() {
    return (
        <Layout>
          {!this.state.completion
           ? <MainSignUp completionToggle={this.completionToggle} />
           : <MainSignUpCompletion userEmail={this.state.userEmail} completionToggle={this.completionToggle} />}
        </Layout>
    );
  }
}

export const getServerSideProps: GetServerSideProps<ISignUpPageNextGetServerSideProps> = async (context) => {
  const result = await getServerSidePropsWithAuth(context);
  if (!("props" in result)) {
    throw new Error("props doesn't exist!");
  }
  const { authenticated } = result.props;
  if (authenticated) {
    redirectToDashboard(context);
  }

  return {
    props: {
      authenticated
    }
  };
};

export default SignUp;
