import React, {useContext, useEffect, useState} from 'react';
import Layout from '../components/Layout';
import { GetServerSideProps } from 'next';
import {IIndexNextGetServerSideProps, IIndexPageProps} from '../types/IndexPage';
import { getServerSideProps as getServerSidePropsWithAuth } from '../components/WithAuth';
import {GlobalStateContext} from "../store";
import {setUserIsLoggedIn} from "../actions/user";
import {createUserVideo, requestCSRFToken, uploadUserVideo} from "../utils/api";
import {IResponseBodyUploadedTempClip, IResponseBodyUploadedVideo, TAGS} from "../types/_api";
import {
    Box,
    Button, Checkbox,
    Container, FormControl, FormControlLabel,
    Icon, InputLabel,
    LinearProgress, MenuItem, Select,
    TextField,
    Typography
} from "@material-ui/core";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import VideoCallIcon from "@material-ui/icons/VideoCall";
import MovieFilterIcon from '@material-ui/icons/MovieFilter';
import { Alert, AlertTitle } from '@material-ui/lab';
import clsx from "clsx";
import Link from "next/link";
import CloudDoneIcon from "@material-ui/icons/CloudDone";

const Tags = TAGS.map(tag => tag.charAt(0) + tag.slice(1).toLowerCase());
export type Tag = typeof Tags[number];// data from api server

const LinearProgressWithLabel: React.FC<{value: number, hidden?: boolean, className?: string}> = (props) => {
    return (
        <Box display="flex" alignItems="center" className={props.className} style={(props.hidden) ? {display: "none"} : {}}>
            <Box width="100%" mr={1}>
                <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box minWidth={35}>
                <Typography variant="body2" color="textSecondary">{`${Math.round(
                    props.value,
                )}%`}</Typography>
            </Box>
        </Box>
    );
};

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        dragArea: {
            border: "2px dashed #ccc",
            borderRadius: "20px",
            width: "calc(100% - 100px)",
            height: "300px",
            margin: "50px auto",
            padding: "20px",
        },
        dragText: {
            textAlign: "center",
            lineHeight: "20px",
            paddingTop: "30px",
        },
        chooseFileButton: {
            display: "block",
            margin: "0px auto",
            [theme.breakpoints.down('xs')]: {
                fontSize: "12px"
            },
        },
        videoIcon: {
            width: "100px",
            height: "100px",
            display: "block",
            margin: "0px auto"
        },
        hiddenFileUploadInput: {
            display: "none"
        },
        progressBar: {
            margin: "30px"
        },
        outerContainer: {
            marginTop: "6em",
        },
        alertBox: {
            marginBottom: "10px"
        },
        formContainer: {
            display: "flex",
            [theme.breakpoints.down('xs')]: {
                flexFlow: "column"
            },
            height: "300px",
            width: "100%",
            textAlign: "center",
        },
        formPicture: {
            flexGrow: 1,
        },
        formData: {
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            [theme.breakpoints.up('sm')]: {
                position: "relative",
            },
        },
        formPictureIcon: {
            [theme.breakpoints.down('xs')]: {
                width: "150px",
                height: "150px"
            },
            color: "#6e6e6e",
            width: "300px",
            height: "300px"
        },
        formCreateButton: {
            [theme.breakpoints.up('sm')]: {
                position: "absolute",
                left: 0,
                bottom: 0
            },
            [theme.breakpoints.down('sm')]: {
                marginTop: "30px"
            },
        },
        tagsSelect: {
            // margin: theme.spacing(1),
            // minWidth: 120,
        },
    }),
);

export const Upload: React.FC<IIndexPageProps> = (props) => {
    const style = useStyles();
    const { state, dispatch } = useContext(GlobalStateContext);

    useEffect(() => {
        if (!state.userMisc.userLoggedIn && props.authenticated) {
            dispatch(setUserIsLoggedIn(true));
        }
    });

    const refreshStateOnDemand = () => {
        if (typeof window !== "undefined") {
            switch (window.location.hash) {
                case "":
                    setStep(1);
                    setUploadedFile(null);
                    setVideoTitle(null);
                    setVideoBePublic(null);
                    setUploading(null);
                    setUploadingProgress(0);
                    setSubmitting(false);
                    setErrorMessage(null);
                    break;
                case "#naming":
                    if (!uploadedFile) {
                        window.location.hash = "";
                        break;
                    }
                    setStep(2);
                    setVideoTitle(null);
                    setVideoBePublic(null);
                    setSubmitting(false);
                    setErrorMessage(null);
            }
        }
    };


    const [step, setStep] = useState<1 | 2 | 3 | null>(1); // 1: upload a video, 2: submit form for additional required meta items, 3: finish and wait

    const locationHashOnChange = (event: HashChangeEvent) => {
        refreshStateOnDemand();
    };
    useEffect(() => {
        if (typeof window !== "undefined") {
            window.addEventListener("hashchange", locationHashOnChange);
        }

        return () => {
            if (typeof window !== "undefined") {
                window.removeEventListener("hashchange", locationHashOnChange);
            }
        };
    });

    useEffect(() => {
        refreshStateOnDemand();
    }, [step]);


    const [uploading, setUploading] = useState<boolean>(false);
    const [uploadingProgress, setUploadingProgress] = useState<number>(0);
    const [uploadedFile, setUploadedFile] = useState<string | null>(null);
    useEffect(() => {
        if (uploadedFile) {
            if (typeof window !== "undefined") {
                window.location.hash = "naming";
            }
            setStep(2);
        }
    }, [uploadedFile]);

    const dropOnHandle = async (event: React.DragEvent<HTMLInputElement>) => {
        event.preventDefault();

        let item: DataTransferItem = null;
        for (let i = 0; i < event.dataTransfer.items.length && !item; i++) {
            item = event.dataTransfer.items[i];
        }

        if (!item) {
            return;
        }

        if (item.type !== "video/mp4"
         || item.kind !== "file") {
            return;
        }

        await uploadVideo(item.getAsFile());
    };

    const uploadVideo = async (item: File) => {
        const onUploadProgress = (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadingProgress(percentCompleted);
        };

        setUploading(true);
        setUploadingProgress(0);

        const response = await uploadUserVideo(
            null, {_csrf: props.csrfToken}, item, onUploadProgress, {baseUri: ""});
        const data = response.data as IResponseBodyUploadedTempClip;
        const {objectId} = data;
        setUploadedFile(objectId);

        setUploading(false);
    };

    const fileOnChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length !== 0) {
            const file = event.target.files[0];

            await uploadVideo(file);
        }
    };

    const dragOnHandle = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    const renderStepOne = () => (
        <div id="drop_zone" className={style.dragArea}
             onDrop={dropOnHandle} onDragOver={dragOnHandle}>
            <Typography variant={"body2"} className={style.dragText}>
                Drag and drop anywhere to upload
            </Typography>
            {(props.authenticated) ? (
                <label htmlFor={"actual-btn"}>
                    <Icon>
                        <VideoCallIcon className={style.videoIcon} />
                    </Icon>
                </label>
            ) : (
                <Link href={"/login"}>
                    <Icon>
                        <VideoCallIcon className={style.videoIcon} />
                    </Icon>
                </Link>
            )}


            {(props.authenticated) ? (
                <label htmlFor={"actual-btn"}>
                    <Button variant={"contained"} color={"primary"} disabled={uploading} className={style.chooseFileButton}>
                        <label htmlFor={"actual-btn"}>
                            {(uploading) ? "Uploading..." : "Choose video file to upload"}
                        </label>
                    </Button>
                </label>
            ) : (
                <Link href={"/login"}>
                    <Button variant={"contained"} color={"primary"} disabled={uploading} className={style.chooseFileButton}>
                        {(uploading) ? "Uploading..." : "Choose video file to upload"}
                    </Button>
                </Link>
            )}

            <LinearProgressWithLabel hidden={!uploading} className={style.progressBar} value={uploadingProgress} />

            <input id={"actual-btn"} accept={"video/mp4"} type={"file"} className={style.hiddenFileUploadInput}
                   onChange={fileOnChange} disabled={uploading} />
        </div>
    );

    const [submitted, setSubmitted] = useState<boolean>(false);
    useEffect(() => {
        if (submitted) {
            if (typeof window !== "undefined") {
                window.location.hash = "almost";
            }
            setStep(3);
        }
    }, [submitted]);

    const [videoBePublic, setVideoBePublic] = useState<boolean>(false);
    const [videoTitle, setVideoTitle] = useState<string>("");


    const userVideoTitleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setVideoTitle(event.target.value);
    };

    const [submitting, setSubmitting] = useState<boolean>(false);
    const userSubmitVideoInfoOnClick = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (!videoTitle) {
            setErrorMessage({message: "Please fill out the following field", strong: "title"});
            return;
        }

        setErrorMessage(null);
        setSubmitting(true);
        try {
            const response = await createUserVideo(
                null,
                {
                    objectId: uploadedFile,
                    title: videoTitle,
                    isPublic: videoBePublic || false,
                    // @ts-ignore
                    tags: (selectedTag) ? [selectedTag.toUpperCase() as Tag] : undefined,
                    _csrf: props.csrfToken
                }, {baseUri: ""});
            const data = response.data as IResponseBodyUploadedVideo;
            // console.log(data);
            setSubmitted(true);
        } catch (error) {
            alert(error);
            setSubmitting(false);
        }


    };

    const [errorMessage, setErrorMessage] = useState<{message: string, strong?: string} | null>(null);

    const [selectedTag, setSelectedTag] = React.useState<Tag | null>(null);

    const handleSelectedCategoryChange = (event: React.ChangeEvent<{value: Tag}>) => {
        setSelectedTag(event.target.value);
    };

    const renderStepTwo = () => {
        return (
            <Container maxWidth="sm">
                <div className={style.outerContainer}>
                    {(errorMessage) && (
                        <Alert className={style.alertBox} severity="error">
                            <AlertTitle>Error</AlertTitle>
                            {errorMessage.message}{(errorMessage.strong) && (<>: <strong>{errorMessage.strong}</strong></>)}
                        </Alert>
                    )}
                    <div className={style.formContainer}>
                        <div className={style.formPicture}>
                            <Typography variant={"h5"}>
                                Name your video
                            </Typography>
                            <Icon>
                                <MovieFilterIcon className={style.formPictureIcon}  />
                            </Icon>
                        </div>
                        <div className={style.formData}>
                            <TextField id="standard-required" label="Title" variant="outlined"
                                       onChange={userVideoTitleOnChange}
                                       value={videoTitle}
                                       disabled={submitting}
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        color={"primary"}
                                        checked={videoBePublic}
                                        onChange={(event) => setVideoBePublic(!videoBePublic)}
                                        name="checkedF"
                                        disabled={submitting}
                                    />
                                }
                                label="Make Public"
                            />
                            <FormControl variant="outlined" className={style.tagsSelect} disabled={submitting}>
                                <InputLabel id="demo-simple-select-outlined-label">Category</InputLabel>
                                <Select
                                    labelId="demo-simple-select-outlined-label"
                                    id="demo-simple-select-outlined"
                                    value={selectedTag}
                                    onChange={handleSelectedCategoryChange}
                                    label="Category"
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    {
                                        Tags.map(tag => (
                                            <MenuItem value={tag}>{tag}</MenuItem>
                                        ))
                                    }
                                </Select>
                            </FormControl>
                            <Button onClick={userSubmitVideoInfoOnClick}
                                    className={style.formCreateButton} variant="contained" color="secondary"
                                    disabled={submitting}
                            >
                                Submit
                            </Button>
                        </div>
                    </div>
                </div>
            </Container>
        );
    };

    const renderStepThree = () => {
        return (
            <Container maxWidth="sm">
                <div className={clsx(style.outerContainer, style.formContainer)}>
                    <div className={style.formPicture}>
                        <Typography variant={"h5"}>
                            Almost...
                        </Typography>
                        <Typography variant={"body1"}>
                            Your video will be available when we finish cooking your new video
                        </Typography>
                        <Icon>
                            <CloudDoneIcon className={style.formPictureIcon}  />
                        </Icon>
                    </div>
                </div>
            </Container>
        );
    };

    return (
        <Layout>
            {
                (step === 1) ?
                    renderStepOne() :
                    (step === 2) ?
                        renderStepTwo() :
                        (step === 3) ?
                            renderStepThree() :
                        (
                            <div>Oops</div>
                        )
            }
        </Layout>
    );
};

export const getServerSideProps: GetServerSideProps<IIndexNextGetServerSideProps> = async (context) => {
    const result = await getServerSidePropsWithAuth(context);
    if (!("props" in result)) {
        throw new Error("props doesn't exist!");
    }
    const { user, sessionId } = result.props;
    if (!user) {
        return {
            props: {
                authenticated: false
            }
        };
    }

    const response = await requestCSRFToken(sessionId);
    const csrfToken = response.data._csrf as string;


    return {
        props: {
            authenticated: true,
            csrfToken
        }
    };
};

export default Upload;
