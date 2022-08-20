import React, { useState, useEffect } from "react";
import { ButtonGroup, ToggleButtonGroup, ToggleButton } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";

import CommentForm from "./CommentForm";
import CommentReply from "./CommentReply";

const Comment = ({
  commentid,
  username,
  audioURL,
  reply,
  setActiveComment,
  activeComment,
  deleteComment,
  addComment,
}) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [studentaudio, setStudentaudio] = useState(null);

  const isReplying =
    activeComment &&
    activeComment.id === commentid &&
    activeComment.type === "replying";

  const canReply = currentUser;
  const canDelete = currentUser;

  useEffect(() => {
    if (audioURL) {
      setLoading(true);
      setStudentaudio(new Audio(audioURL));
    }
    setLoading(false);
  }, [audioURL]);

  const studentaudioStop = () => {
    if (studentaudio) {
      studentaudio.pause();
      studentaudio.currentTime = 0;
    }
    return;
  };

  const studentaudioPlay = () => {
    if (studentaudio) {
      studentaudio.play();
    }
    return;
  };

  return (
    <div key={commentid} className="comment">
      <div className="comment-image-container mt-3">
        <img
          src="/images/monster.png"
          style={{
            height: 55,
          }}
        />
      </div>
      <div className="comment-right-part">
        <div className="comment-content">
          <div className="comment-author">{username}</div>
        </div>

        <div className="comment-audio mt-1">
          {loading ? (
            <h4>Loading...</h4>
          ) : (
            <fieldset>
              <ButtonGroup>
                <ToggleButtonGroup
                  type="radio"
                  name={`studentplayer${username}`}
                  defaultValue="stop"
                >
                  <ToggleButton
                    id={`studentplay${username}`}
                    variant="outline-success"
                    value="play"
                    onClick={() => studentaudioPlay()}
                  >
                    Listen
                  </ToggleButton>
                  <ToggleButton
                    id={`studentpause${username}`}
                    variant="outline-secondary"
                    value="pause"
                    onClick={studentaudio && studentaudio.pause()}
                  >
                    Pause
                  </ToggleButton>
                  <ToggleButton
                    id={`studentstop${username}`}
                    variant="outline-danger"
                    value="stop"
                    onClick={() => studentaudioStop()}
                  >
                    Stop
                  </ToggleButton>
                </ToggleButtonGroup>
              </ButtonGroup>
            </fieldset>
          )}
        </div>

        <div className="comment-actions">
          {canReply && (
            <div
              className="comment-action"
              onClick={() =>
                setActiveComment({ id: commentid, type: "replying" })
              }
            >
              Reply
            </div>
          )}
          {canDelete && (
            <div
              className="comment-action"
              onClick={() => deleteComment(commentid)}
            >
              Delete
            </div>
          )}
        </div>
        {isReplying && (
          <CommentForm
            submitLabel="Reply"
            hasCancelButton
            handleCancel={() => {
              setActiveComment(null);
            }}
            handleSubmit={(text) => addComment(text, commentid)}
          />
        )}
        <div className="replies mt-4">
          {reply && (
            <CommentReply
              key={commentid}
              commentid={commentid}
              text={reply}
              canDelete={canDelete}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Comment;
