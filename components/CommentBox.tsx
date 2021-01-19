import {Avatar, Grid, Paper} from "@material-ui/core";
import React from "react";
import {ICommentBoxProps} from "./types/CommentBox";
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

TimeAgo.locale(en);

export const CommentBox: React.FC<ICommentBoxProps> = (props) => {
    const timeAgo = new TimeAgo('en-US');

    return (
        <Paper elevation={0} style={{ padding: "2px 2px", marginTop: "10px" }}>
            <Grid container wrap="nowrap" spacing={2}>
                <Grid item>
                    <Avatar alt={props.user.fullname} src={"https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260"} />
                </Grid>
                <Grid item xs zeroMinWidth>
                    <h4 style={{ margin: 0, textAlign: "left" }}>{props.user.fullname}</h4>
                    <p style={{ textAlign: "left" }}>
                        {props.content}
                    </p>
                    <p style={{ textAlign: "left", color: "gray" }}>
                        posted {timeAgo.format(props.updated_timestamp)}
                    </p>
                </Grid>
            </Grid>
        </Paper>
    )
};;;