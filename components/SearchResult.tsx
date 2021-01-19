import React from 'react';
import {makeStyles, createStyles, Theme} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import {Typography} from "@material-ui/core";
import {VideoInfoContainer} from "./VideoInfoContainer";
import {useRouter} from "next/router";
import {NUMBER_IN_PAGE} from "../types/_api";
import {IGridVideo, ISearchResult} from "./types/SearchResult";
import {Pagination} from "@material-ui/lab";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        gridVideo: {
            backgroundColor: "#FFFFFF",
            height: 250,
            width: 320,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center"
        },
        videoPreview: {
            padding: theme.spacing(1),
            maxWidth: 300,
        },
        videoInfoContainer: {
            display: "flex"
        },
        userProfileIcon: {
            padding: 1,
            height: 40,
            width: 40,
            borderRadius: "50%"
        },
        text: {
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
        },
        textFullWidth: {
            width: "100%"
        },
        videoInfoTextBox: {
            paddingLeft: 5,
            width: 240,
        },
        previewNotReady: {
            opacity: 0.4,
            filter: "alpha(opacity=40)"
        },
        titleBox: {
            display: "flex"
        },
        root: {
            flexGrow: 1,
        },
        pagination: {
            display: "flex",
            justifyContent: "center"
        }
    }),
);

const GridVideo: React.FC<IGridVideo.IInnerProps> = (props) => {
    const style = useStyles();
    const route = useRouter();
    const definedPropsStyle = makeStyles((theme: Theme) =>
        createStyles({
            thumbnail: {
                // backgroundImage: `url(${props.imageLink})`,
                // backgroundSize: "cover"
            }
        }))();

    const handleVideoOnClick = async (event: React.MouseEvent<HTMLElement>, videoId: string) => {
        await route.push(`/watch?v=${videoId}`);
    };

    return (
        <Grid item onClick={(event) => handleVideoOnClick(event, props.videoId)} key={props.videoId}>
            <VideoInfoContainer
                userFullname={props.user.fullname}
                userImage={props.user.avatar}
                videoTitle={props.title}
                videoViews={props.views}
            />
        </Grid>
    )
}

const SearchResult: React.FC<ISearchResult.IInnerProps> = (props) => {
    const style = useStyles();
    const route = useRouter();
    const pages = Math.ceil(props.total / NUMBER_IN_PAGE);

    const handleSelectPageOnClick = async (event: React.MouseEvent<HTMLElement>, page: number) => {
        await route.push(`/result?query=${props.query}&p=${page}`);
    }

    const renderSearchResult = () => (
        <React.Fragment>
            <Typography align="left">
                Found {props.total} matches
            </Typography>
            <Grid container className={style.root} spacing={2}>
                {(props.data.map(video => (
                    <GridVideo
                        user={video.user}
                        videoId={video.videoId}
                        tags={video.tags}
                        title={video.title}
                        time={video.time}
                        views={video.duration}
                    />
                )))}
            </Grid>
            {(props.total !== 0) && (
                <Pagination className={style.pagination} page={props.page} count={pages}
                 onChange={handleSelectPageOnClick}/>
            )}

        </React.Fragment>
    )

    return (
        <React.Fragment>
            {renderSearchResult()}
        </React.Fragment>
    )
};

export default SearchResult;