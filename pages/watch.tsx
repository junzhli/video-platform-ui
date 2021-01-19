import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
import Layout from '../components/Layout';
import { GetServerSideProps } from 'next';
import {getServerSideProps as getServerSidePropsWithAuth} from '../components/WithAuth';
import {GlobalStateContext} from "../store";
import {setUserIsLoggedIn} from "../actions/user";
import videojs, {VideoJsPlayer} from "video.js";
import {
  createUserVideoComment,
  getUserInfo,
  getUserVideoComments,
  getUserVideoPlayback,
  requestCSRFToken, updateUserVideoLike
} from "../utils/api";
import {IWatchNextGetServerSideProps, IWatchPageProps} from "../types/WatchPage";
import {
  IResponseBodyComment,
  IResponseBodyUserInfo, IResponseBodyUserLike,
  IResponseBodyUserPreVideoPlayback
} from "../types/_api";
import qualitySelector from "@silvermine/videojs-quality-selector";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {Button, Container, Divider, Icon, TextField, Typography} from "@material-ui/core";
import {CommentBox} from "../components/CommentBox";
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import {useRouter} from "next/router";
import LockIcon from "@material-ui/icons/Lock";

// load plugin in videojs
qualitySelector(videojs);

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      videoContainer: {
        width: "100%",
        margin: "0 0 10px 0",
      },
      titleBox: {
        display: "flex"
      },
      likedText: {
        float: "left",
        marginRight: "10px",
        color: theme.palette.text.secondary
      },
      likedButton: {
        float: "right",
        paddingBottom: "0px",
      },
      videoDivider: {
        margin: "8px 0px 8px 0px"
      },
      numberComment: {
        marginBottom: "10px"
      },
      noCommentTextBox: {
        fontStyle: "italic",
        padding: theme.spacing(3, 0),
        fontSize: 14
        // backgroundColor: rgbToHex("#d4d4d4")
      },
      lockIcon: {
        marginLeft: "5px",
      },
      lockIconSvg: {
        color: "#6d6d6d",
      }
    }),
);

const videoTarget = (videoId: string) => `${process.env["NEXT_PUBLIC_BASE_URL"]}/api/videoplayback/?vid=${videoId}`;


export const Watch: React.FC<IWatchPageProps> = (props) => {
  const style = useStyles();
  const router = useRouter();

  const { state, dispatch } = useContext(GlobalStateContext);
  const videoNode = useRef(null);
  let player: VideoJsPlayer;
  let options: videojs.PlayerOptions;
  if (props.video) {
    const {playbacks} = props.video;
    const type = "video/mp4";
    options = {
      autoplay: false,
      controls: true,
      fluid: true,
      aspectRatio: "16:9",
      responsive: false,
      // sources: [{
      //   src: "/",
      //   type: "video/mp4"
      // }]
      controlBar: {
        children: [
          "playToggle",
          "progressControl",
          "volumePanel",
          "qualitySelector",
          "fullscreenToggle",
          "currentTimeDisplay",
          "durationDisplay",
          // "remainingTimeDisplay",
          "timeDivider",
        ]
      },
      sources: Object.keys(playbacks).map((quality, index) => {
        const selected = (index === 0);
        const label = (quality === "FullHD") ? "1080p" : (quality === "HD") ? "720p" : (quality === "SD") ? "480p" : "unknown";

        return {
          src: videoTarget(playbacks[quality].objectId),
          type,
          label,
          selected,
        };
      }),
      // sources: [
      //   // FullHD
      //   {
      //     src: videoTarget(playbacks.FullHD.objectId),
      //     type,
      //     label: "1080p",
      //     selected: true
      //   },
      //   // HD
      //   {
      //     src: videoTarget(playbacks.HD.objectId),
      //     type,
      //     label: "720p"
      //   },
      //   // SD
      //   {
      //     src: videoTarget(playbacks.SD.objectId),
      //     type,
      //     label: "480p"
      //   }
      // ]
    // }
    } as any;
  }

  const renderVideoPlayer = () => (
      <div className={style.videoContainer}>
        <video ref={videoNode} className={"video-js"} contextMenu={"vupload.com"}>
          <p className={["video-js", "vjs-layout-medium"].join(" ")}>
            To view this video please enable JavaScript, and consider upgrading to a
            web browser that
            <a href="https://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a>
          </p>
        </video>
      </div>
  );

  useEffect(() => {
    if (!state.userMisc.userLoggedIn && props.authenticated) {
      dispatch(setUserIsLoggedIn(true));
    }
  });

  useEffect(() => {
    if (props.video) {
      player = videojs(videoNode.current, options);
    }

    return () => {
      if (player) {
        player.dispose();
      }
    };
  }, []);

  // let lastBoundingBottom;
  const isBottom = (el?: HTMLElement) => {
    if (!el) {
      return;
    }

    return el.getBoundingClientRect().bottom <= window.innerHeight;
  };

  const [lastCommentId, setLastCommentId] = useState<string | null>(null);

  useEffect(() => {
    if (lastCommentId) {
      loadMoreVideoComments(lastCommentId);
    }
  }, [lastCommentId]);

  const [loadMoreCommentToggle, setLoadMoreCommentToggle] = useState<boolean>(false);
  const [accumulatedComment, setAccumulatedComment] = useState<Array<IResponseBodyComment>>([]);
  useEffect(() => {
    if (!loadMoreCommentToggle) {
      return;
    }
    const _lastCommentId = (accumulatedComment.length !== 0) ?
        (accumulatedComment[accumulatedComment.length - 1].id) : (props.video.topComments && props.video.topComments.length !== 0) ?
            props.video.topComments[props.video.topComments.length - 1].id :null;
    setLastCommentId((_lastCommentId));
    setLoadMoreCommentToggle(false);
  }, [accumulatedComment, loadMoreCommentToggle]);

  const loadMoreVideoComments = useCallback(async (_lastCommentId) => {
    document.removeEventListener("scroll", handleDocumentOnScroll);

    if (!_lastCommentId) {
      return;
    }

    try {
      const response = await getUserVideoComments(null, props.videoId, _lastCommentId, {baseUri: ""});
      const comments = response.data as IResponseBodyComment[];
      setAccumulatedComment((oldArr) => {
        return [...oldArr, ...comments];
      });
    } catch (error) {
      if (error.response && error.response.status) {
        if (error.response.status === 404) {
          document.removeEventListener("scroll", handleDocumentOnScroll);
          return;
        }
      }
      console.error("failed to get user video comments: " + props.videoId);
      console.log(error);
    } finally {
      document.addEventListener("scroll", handleDocumentOnScroll);
    }
  }, [accumulatedComment]);

  const handleDocumentOnScroll = async () => {
    const containerWatch = document.getElementById("container-watch");
    if (isBottom(containerWatch)) {
      setLoadMoreCommentToggle(true);
    }
  };

  useEffect(() => {
    if (props.video) {
      document.addEventListener("scroll", handleDocumentOnScroll);
    }

    return () => {
      if (props.video) {
        document.removeEventListener("scroll", handleDocumentOnScroll);
      }
    };
  }, []);

  const [commentIsError, setCommentIsError] = useState(false);
  const [commentValue, setCommentValue] = useState("");
  const notEmptyMessage = "not empty";
  const handleUserCommentValueChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCommentValue(event.target.value);
  };
  const [userCommented, setUserCommented] = useState<Array<{id: string, content: string}>>([]);
  const handleUserCommentKeyPressed = async (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      if (commentValue === "") {
        setCommentIsError(true);
        return;
      }

      setCommentIsError(false);
      if (!props.videoId) {
        throw new Error("videoId is null");
      }

      try {
        const response = await createUserVideoComment(
            null,
            props.videoId,
            { content: commentValue, _csrf: props.csrfToken },
            {baseUri: ""});
        const {objectId} = response.data;

        userCommented.unshift({id: objectId, content: commentValue});
        setUserCommented(userCommented);
        setCommentValue("");
      } catch (e) {
        console.error("comment error occurred");
        console.log(e);
        alert(e);
      }
    }
  };

  const [userLiked, setUserLiked] = useState<boolean>(false);
  useEffect(() => {
    if (props.video) {
      setUserLiked(props.video.liked);
    }
    }, []);
  useEffect(() => {

  }, [userLiked]);
  const likeVideoButtonOnClick = async () => {
    if (!props.user) {
      await router.push("/login");
      return;
    }

    const response = await updateUserVideoLike(null, props.videoId, {_csrf: props.csrfToken}, {baseUri: ""});
    const data = response.data as IResponseBodyUserLike;
    setUserLiked(data.like);
    setLikes((data.like) ? likes + 1 : likes - 1);
  };

  const [likes, setLikes] = useState<number>(0);
  useEffect(() => {
    if (props.video) {
      setLikes(props.video.likes);
    }
  }, []);

  return (
        <Layout videoOn={true}>
          <Container id={"container-watch"} maxWidth={"md"}>
          {
            (props.video) ? (
                <>
                  {renderVideoPlayer()}
                  <div className={style.titleBox}>
                    <Typography align={"left"} color={"textPrimary"} variant={"h6"}>
                      {props.video.title}
                    </Typography>
                    {(props.user && !props.video.isPublic) && (
                        <Icon className={style.lockIcon}>
                          <LockIcon className={style.lockIconSvg} />
                        </Icon>
                    )}
                  </div>
                  <div>
                    <Typography align={"left"} color={"textSecondary"} variant={"body1"} display={"inline"}>
                      {props.video.views} views
                    </Typography>
                    <Button
                        onClick={likeVideoButtonOnClick}
                        className={style.likedButton}
                        variant="text" color={(userLiked) ? "secondary" : "inherit"}
                    >
                      <Typography className={style.likedText} color={"textSecondary"} variant={"body1"} display={"inline"}>
                        {likes}
                      </Typography>
                      <ThumbUpIcon />
                    </Button>
                    {/*<Typography className={style.like} color={"textSecondary"} variant={"body1"} display={"inline"}>*/}
                    {/*  {props.video.likes} likes*/}
                    {/*</Typography>*/}
                  </div>
                  <Divider className={style.videoDivider} />
                  <Typography className={style.numberComment} align={"left"} color={"textPrimary"} variant={"body2"}>
                    {props.video.comments + userCommented.length} comments
                  </Typography>
                  {(props.user) && (
                      <TextField
                          onChange={handleUserCommentValueChanged}
                          value={commentValue}
                          onKeyPress={handleUserCommentKeyPressed}
                          id="standard-basic"
                          error={commentIsError}
                          helperText={(commentIsError) ? notEmptyMessage : ""}
                          label="Write your comment here"
                      />
                  )}
                  {((props.video.comments + userCommented.length) == 0) && (
                      <Typography className={style.noCommentTextBox} align="center">
                        No comment for this video
                      </Typography>
                  )}
                  {userCommented.map(({id, content}) => (
                      <CommentBox edit={true}
                                  key={id}
                                  content={content}
                                  id={id}
                          // likes={comment.}
                                  updated_timestamp={Date.now()}
                                  user={
                                    {
                                      id: props.user.id,
                                      avatar: props.user.avatar,
                                      fullname: props.user.fullname
                                    }
                                  }/>
                  ))}
                  {props.video.topComments.map((comment) => (
                      <CommentBox edit={true}
                                  key={comment.id}
                                  content={unescape(comment.content)}
                                  id={comment.id}
                          // likes={comment.}
                                  updated_timestamp={comment.updated_timestamp}
                                  user={
                                    {
                                      id: comment.userId,
                                      avatar: comment.userAvatar,
                                      fullname: comment.userFullname
                                    }
                                  }/>
                  ))}
                  {accumulatedComment.map((comment) => (
                      <CommentBox edit={true}
                                  key={comment.id}
                                  content={unescape(comment.content)}
                                  id={comment.id}
                          // likes={comment.}
                                  updated_timestamp={comment.updated_timestamp}
                                  user={
                                    {
                                      id: comment.userId,
                                      avatar: comment.userAvatar,
                                      fullname: comment.userFullname
                                    }
                                  }/>
                  ))}
                </>
            ) : (
                <div>Video not found</div>
            )
          }
          </Container>
        </Layout>
    );
};

export const getServerSideProps: GetServerSideProps<IWatchNextGetServerSideProps> = async (context) => {
  const result = await getServerSidePropsWithAuth(context);
  if (!("props" in result)) {
    throw new Error("props doesn't exist!");
  }
  const { user, sessionId } = result.props;

  // fetch video playback info from api server
  const videoId = !Array.isArray(context.query.v) ? context.query.v ? context.query.v : null : null;
  if (!videoId) {
    // TODO render a not found page
    return {
      props: {
        authenticated: (user),
      }
    };
  }

  try {
    let response = await getUserVideoPlayback(sessionId, videoId.toString());
    const video = response.data as IResponseBodyUserPreVideoPlayback;

    if (!user) {
      return {
        props: {
          authenticated: (user),
          videoId,
          video
        }
      };
    }

    response = await getUserInfo(sessionId);
    const userInfo = response.data as IResponseBodyUserInfo;
    const {id, fullname, avatar} = userInfo;

    response = await requestCSRFToken(sessionId);
    const csrfToken = response.data._csrf as string;

    return {
      props: {
        authenticated: (user),
        user: {
          id,
          fullname,
          avatar
        },
        csrfToken,
        videoId,
        video
      }
    };
  } catch (error) {
    if (error.response && error.response.status) {
      if (error.response.status === 404 || error.response.status === 400) {
        return {
          props: {
            authenticated: false
          }
        };
      }
    }
    console.error("failed to get user video playback: " + videoId.toString());
    console.log(error);
    return {
      props: {
        authenticated: (user),
        error: true
      }
    };
  }

  return {
    props: {
      authenticated: false
    }
  };
};

export default Watch;
