import { doc, updateDoc, arrayRemove } from "firebase/firestore";
import { commentsRef } from "../firebase";

const CommentReply = ({ commentid, text, canDelete }) => {
  const deleteReply = async (text, id) => {
    const docRef = doc(commentsRef, id);
    if (window.confirm("Are you sure you want to remove comment?")) {
      await updateDoc(docRef, {
        reply: "",
      }).then(() => {
        window.location.reload();
      });
    }
  };

  return (
    <div className="comment">
      <div className="comment-image-container">
        <img
          src="/images/zombie.png"
          style={{
            height: 55,
          }}
        />
      </div>
      <div className="comment-right-part">
        <div className="comment-content">
          <div className="comment-author">Teacher</div>
        </div>
        <div className="comment-text">{text}</div>
        <div className="comment-actions">
          {canDelete && (
            <div
              className="comment-action"
              onClick={() => deleteReply(text, commentid)}
            >
              Delete
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentReply;
