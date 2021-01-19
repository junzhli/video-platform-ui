import React from 'react';
import {makeStyles, createStyles, Theme, rgbToHex} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import {Divider, Typography} from "@material-ui/core";
import {VideoInfoContainer} from "./VideoInfoContainer";
import {useRouter} from "next/router";
import {IHomeVideos} from "./types/HomeVideos";

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

const HomeVideos: React.FC<IHomeVideos.IInnerProps> = (props) => {
    const route = useRouter();
    const classes = useStyles();

    const handleVideoOnClick = async (event: React.MouseEvent<HTMLElement>, videoId: string) => {
        await route.push(`/watch?v=${videoId}`);
    };

    const renderHome = () => (
        <React.Fragment>
            <Typography align="left">
                Latest videos
            </Typography>
            <Divider className={classes.titleDivider} />
            <Grid container className={classes.root} spacing={2}>
                {props.latestVideos.map(video => (
                    <Grid item onClick={(event => handleVideoOnClick(event, video.videoId))} key={video.videoId}>
                        {/*<Paper className={classes.paper} />*/}
                        <VideoInfoContainer
                            userFullname={video.user.fullname}
                            userImage={video.user.avatar}
                            videoTitle={video.title}
                            videoViews={video.views}
                        />
                    </Grid>
                ))}
            </Grid>
        </React.Fragment>
    )

    return (
        <React.Fragment>
            {renderHome()}
        </React.Fragment>
    )
}

export default HomeVideos;