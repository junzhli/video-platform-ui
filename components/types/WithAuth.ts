
export namespace WithAuth {
    export interface NextGetServerSideProps {
        sessionId?: string;
        setCookie?: boolean;
        user: boolean;
    }
}

export type IWithAuthGetServerSideProps = WithAuth.NextGetServerSideProps;


export interface IWithAuthProps {
    authenticated: boolean;
}