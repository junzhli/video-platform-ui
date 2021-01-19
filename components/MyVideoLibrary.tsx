import React, {useCallback, useEffect, useState} from 'react';
import {makeStyles, createStyles, Theme, rgbToHex} from '@material-ui/core/styles';
import Grid, { GridSpacing } from '@material-ui/core/Grid';
import {IMyVideoLibrary} from "./types/MyVideoLibrary";
import {Divider, Typography} from "@material-ui/core";
import {VideoInfoContainer} from "./VideoInfoContainer";
import {useRouter} from "next/router";
import {IResponseBodyUserVideos} from "../types/_api";
import {getUserVideos} from "../utils/api";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
        control: {
            padding: theme.spacing(2),
        },
        titleDivider: {
            margin: 8,
            backgroundColor: rgbToHex("#FFFFFF")
        },
        textBox: {
            fontStyle: "italic",
            padding: theme.spacing(5, 0),
            backgroundColor: rgbToHex("#d4d4d4")
        },
        categoryDivider: {
            margin: 20,
            backgroundColor: rgbToHex("#FFFFFF")
        }
    }),
);





const MyVideoLibrary: React.FC<IMyVideoLibrary.IInnerProps> = (props) => {
    const route = useRouter();
    const [spacing, setSpacing] = React.useState<GridSpacing>(2);
    const classes = useStyles();

    const isBottom = (el?: HTMLElement) => {
        if (!el) {
            return;
        }

        return el.getBoundingClientRect().bottom <= window.innerHeight;
    };

    const handleDocumentOnScroll = async () => {
        const containerWatch = document.getElementById("container-watch");
        if (isBottom(containerWatch)) {
            setLoadMoreVideosToggle(true);
        }
    };

    useEffect(() => {
        if (props.myvideos.length !== 0) {
            document.addEventListener("scroll", handleDocumentOnScroll);
        }

        return () => {
            if (props.myvideos.length !== 0) {
                document.removeEventListener("scroll", handleDocumentOnScroll);
            }
        };
    }, []);

    const handleVideoOnClick = async (event: React.MouseEvent<HTMLElement>, videoId: string) => {
        await route.push(`/watch?v=${videoId}`);
    };

    const [lastVideoPage, setLastVideoPage] = useState<number | null>(null);

    useEffect(() => {
        if (lastVideoPage) {
            loadMoreVideos(lastVideoPage);
        }
    }, [lastVideoPage]);

    const [loadMoreVideosToggle, setLoadMoreVideosToggle] = useState<boolean>(false);
    const [loadMoreVideosStopped, setLoadMoreVideosStopped] = useState<boolean>(false);
    const [accumulatedVideos, setAccumulatedVideos] = useState<IResponseBodyUserVideos>([]);
    useEffect(() => {
        if (!loadMoreVideosToggle) {
            return;
        }

        const _lastVideoPage = (!lastVideoPage) ? 2 : (loadMoreVideosStopped) ? lastVideoPage : (lastVideoPage + 1);
        setLastVideoPage(_lastVideoPage);
        setLoadMoreVideosToggle(false);
    }, [accumulatedVideos, loadMoreVideosToggle, loadMoreVideosStopped]);

    const loadMoreVideos = useCallback(async (_lastVideoPage) => {
        document.removeEventListener("scroll", handleDocumentOnScroll);

        if (!_lastVideoPage) {
            return;
        }

        try {
            const response = await getUserVideos(null, _lastVideoPage, {baseUri: ""});
            const videos = response.data as IResponseBodyUserVideos;
            setAccumulatedVideos((oldArr) => {
                return [...oldArr, ...videos];
            });
        } catch (error) {
            if (error.response && error.response.status) {
                if (error.response.status === 404) {
                    document.removeEventListener("scroll", handleDocumentOnScroll);
                    setLoadMoreVideosStopped(true);
                    return;
                }
            }
            console.error("failed to get user videos with last video page:" + _lastVideoPage);
            console.log(error);
        } finally {
            document.addEventListener("scroll", handleDocumentOnScroll);
        }
    }, [accumulatedVideos]);

    const renderMyVideo = (myVideos: IResponseBodyUserVideos) => (
        <React.Fragment>
            <Typography align="left">
                Starred videos
            </Typography>
            <Divider className={classes.titleDivider} />
            <Typography className={classes.textBox} align="center">
                Your starred videos will show here
            </Typography>
            <Grid container={true} className={classes.root} spacing={2}/>      <Divider className={classes.categoryDivider} />
            <Typography align="left">
                Uploaded videos
            </Typography>
            <Divider className={classes.titleDivider} />
            <Grid id={"container-watch"} container={true} className={classes.root} spacing={2}>
                {myVideos.map(myVideo => (
                    <Grid item={true} onClick={(myVideo.available) && (event => handleVideoOnClick(event, myVideo.videoId))} key={myVideo.videoId}>
                        <VideoInfoContainer
                            userFullname={myVideo.user.fullname}
                            userImage={myVideo.user.avatar}
                            videoTitle={myVideo.title}
                            videoViews={myVideo.views}
                            videoAvailable={myVideo.available}
                            videoPublic={myVideo.isPublic}
                        />
                    </Grid>
                ))}
                {accumulatedVideos.map(myVideo => (
                    <Grid item={true} onClick={(myVideo.available) && (event => handleVideoOnClick(event, myVideo.videoId))} key={myVideo.videoId}>
                        <VideoInfoContainer
                            userFullname={myVideo.user.fullname}
                            userImage={myVideo.user.avatar}
                            videoTitle={myVideo.title}
                            videoViews={myVideo.views}
                            videoAvailable={myVideo.available}
                            videoPublic={myVideo.isPublic}
                        />
                    </Grid>
                ))}
            </Grid>
        </React.Fragment>
    );

    return (
        <React.Fragment>
            {renderMyVideo(props.myvideos)}
        </React.Fragment>
    );
};

export default MyVideoLibrary;