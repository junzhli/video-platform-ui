import React from "react";
import {IVideoInfo, IVideoInfoContainer, IVideoPreview} from "./types/VideoInfoContainer";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import clsx from "clsx";
import {Icon, Typography} from "@material-ui/core";
import LockIcon from '@material-ui/icons/Lock';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
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
        }
    }),
);



const VideoPreview: React.FC<IVideoPreview.IInnerProps> = (props) => {
    const defaultStyle = useStyles();
    const definedPropsStyle = makeStyles((theme: Theme) =>
    createStyles({
        thumbnail: {
            // backgroundImage: `url(${props.imageLink})`,
            // backgroundSize: "cover"
        }
    }))();

    const previewStyle = clsx(defaultStyle.videoPreview, definedPropsStyle.thumbnail, props.className);

    return (
        <div className={previewStyle}>
            <img className={(props.videoAvailable === false) && defaultStyle.previewNotReady} src={props.imageLink} />
        </div>
    );
};

const VideoInfo: React.FC<IVideoInfo.IInnerProps> = (props) => {
    const defaultStyle = useStyles();

    // const previewStyle = clsx(defaultStyle.videoPreview, definedPropsStyle.thumbnail, props.className);

    return (
        <div className={defaultStyle.videoInfoContainer}>
            <div>
                {
                    (props.userImageLink.startsWith("http://") || props.userImageLink.startsWith("https://")) ?
                        <img className={defaultStyle.userProfileIcon} src={props.userImageLink} /> :
                        <img className={defaultStyle.userProfileIcon} src={`data:image/png;base64, ${props.userImageLink}`} />
                }

            </div>
            <div className={defaultStyle.videoInfoTextBox}>
                <Typography className={defaultStyle.text}>
                    {props.username}
                </Typography>
                <div className={defaultStyle.titleBox}>
                    <Typography className={clsx(defaultStyle.text, defaultStyle.textFullWidth)}>
                        {props.title}
                    </Typography>
                    { (props.public === false) && (
                        <Icon>
                            <LockIcon />
                        </Icon>
                    )}
                </div>
                <Typography className={defaultStyle.text}>
                    {props.views} views
                </Typography>
            </div>


        </div>
    );
};

export const VideoInfoContainer: React.FC<IVideoInfoContainer.IInnerProps> = (props) => {
    const defaultStyle = useStyles();
    const containerStyle = clsx(defaultStyle.container, props.className);

    // TODO: delete it
    const demoImageLink = "https://i.ytimg.com/vi/ZRQSL7V3F6k/hq720.jpg?sqp=-oaymwEZCNAFEJQDSFXyq4qpAwsIARUAAIhCGAFwAQ==&rs=AOn4CLAw8OYgttADpIHjM8owoEnk4AyIyw";
    const demoTitle = "Cyberpunk 2077 tutorial videosffffffffffffffffffffffff";
    const demoUserName = "xyz123 HAHA";
    const demoUserImageLink = "https://yt3.ggpht.com/a-/AOh14GgLKxJXVbDxZszKZ-sRJ9xTBsPkRloW3Ze2YQ=s68-c-k-c0x00ffffff-no-rj-mo";
    const demoViews = 0;

    return (
        <div className={containerStyle}>
            <VideoPreview imageLink={props.videoImage || demoImageLink} videoAvailable={props.videoAvailable} />
            <VideoInfo
                title={props.videoTitle}
                username={props.userFullname}
                userImageLink={props.userImage || demoUserImageLink}
                views={props.videoViews}
                public={props.videoPublic}
            />
        </div>
    );
};