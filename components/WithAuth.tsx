import React from "react";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import clientCookies from "next-cookies";
import { IWithAuthProps, IWithAuthGetServerSideProps } from "./types/WithAuth";
import {setSession} from "../utils/api";
import {ResponseSetSession} from "../utils/types/api";
import setCookie from "set-cookie-parser";
import Cookies from "cookies";

const withAuth = (WrappedComponent: any) => {
    return class extends React.Component<IWithAuthProps> {
        render() {
            return <WrappedComponent {...this.props} />;
        }
    };
};

export const getServerSideProps: GetServerSideProps<IWithAuthGetServerSideProps> = async (context) => {
    const sessionId = clientCookies(context)["connect.sid"];
    const response = (await setSession(sessionId));
    const { User } = response.data as ResponseSetSession;
    const splitCookieHeaders = setCookie.splitCookiesString(response.headers['set-cookie']);
    const cookies = setCookie.parse(splitCookieHeaders);
    let newSessionId;
    if (cookies.length > 0) {
        if (cookies[0].name === "connect.sid") {
            newSessionId = cookies[0].value;
        } else {
            const sessionCookie = cookies.find((cookie) => cookie.name === "connect.sid");
            if (sessionCookie) {
                newSessionId = cookies[0].value;
            }
        }
    }

    if (newSessionId) {
        const cookieJar = new Cookies(context.req, context.res, {
            secure: (process.env["NEXT_PUBLIC_USE_HTTPS"] === "true") || false,
        });
        cookieJar.set("connect.sid", newSessionId, {sameSite: "strict"});

        return {
            props: {
                sessionId: newSessionId,
                setCookie: true,
                user: false,
            }
        };
    }

    if (!User) {
        return {
            props: {
                user: false,
            }
        };
    }

    return {
        props: {
            sessionId,
            user: true,
        }
    };
};

export const redirectToLogin = (context: GetServerSidePropsContext) => {
    context.res.writeHead(302, {
        Location: process.env["NEXT_PUBLIC_BASE_URL"] + "/login"
    });
    context.res.end();
};

export const redirectToIndex = (context: GetServerSidePropsContext) => {
    context.res.writeHead(302, {
        Location: process.env["NEXT_PUBLIC_BASE_URL"] + "/"
    });
    context.res.end();
};

export default withAuth;