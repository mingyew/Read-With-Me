import { useState, useRef, useEffect } from "react";
import { storage, commentsRef } from "../firebase";
import {
  addDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import {
  Button,
  Popover,
  OverlayTrigger,
  Alert,
  Form,
  ProgressBar,
} from "react-bootstrap";
import Comment from "./Comment";
import { VoiceRecorder } from "./VoiceRecorder";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const Comments = (props) => {
  const [progress, setProgress] = useState(0);
  const [activeComment, setActiveComment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState(null);
  const nameRef = useRef();

  const {
    mediastatus,
    audioBlobURL,
    Record,
    voiceRecorderStart,
    voiceRecorderStop,
  } = VoiceRecorder();

  const q = query(commentsRef, where("linkid", "==", props.linkid));

  const getComments = async () => {
    setLoading(true);
    const querySnapshot = await getDocs(q);
    const items = [];
    querySnapshot.forEach((doc) => {
      items.push({ ...doc.data(), id: doc.id });
    });
    setComments(items);
    setLoading(false);
  };

  useEffect(() => {
    getComments().catch((err) => {
      if (!loading) return;
      Alert("failed to fetch data", err);
    });
    return () => {
      setLoading(false);
    };
  }, []);

  const uploadAudio = async (callback) => {
    const audioBlob = await fetch(audioBlobURL).then((r) => r.blob());
    const mediaFile = new File([audioBlob], { type: "audio/ogg" });

    if (!mediaFile) return;

    const storageRef = ref(
      storage,
      `/${props.uid}/${props.linkid}/${nameRef.current.value}`
    );
    const uploadTask = uploadBytesResumable(storageRef, mediaFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const prog = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(prog);
      },
      (err) => Alert(err),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          callback(url);
        });
      }
    );
  };

  const addtoDB = async (url) => {
    const docFields = {
      linkid: props.linkid,
      audioURL: url,
      username: nameRef.current.value,
      reply: "",
    };

    await addDoc(commentsRef, docFields).then(() => {
      window.location.reload(false);
    });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      uploadAudio(addtoDB);
    } catch {
      Alert("Failed to save audio");
    }
    setLoading(false);
  }

  const popover = (
    <Popover id="popover-basic" style={{ maxWidth: "100vh" }}>
      <Popover.Header>
        <div className="d-flex">
          <Button
            variant="success"
            size="sm"
            className="me-2"
            onClick={voiceRecorderStart}
          >
            Start
          </Button>
          <Button
            variant="danger"
            size="sm"
            className="me-2"
            onClick={voiceRecorderStop}
          >
            Stop
          </Button>
          <div className="row ms-auto align-items-center">
            <h2 style={{ fontSize: 12 }}>{mediastatus}</h2>
            <ProgressBar
              striped
              now={progress}
              label={`${progress}% uploaded`}
            />
          </div>
        </div>
      </Popover.Header>
      <Popover.Body>
        <audio
          src={audioBlobURL}
          width={250}
          controls
          autoPlay
          loop
          style={{ width: 250 }}
        />
        <Form onSubmit={handleSubmit} className="mt-4">
          <Form.Label>Full Name</Form.Label>
          <Form.Control type="name" ref={nameRef} required />
          <Button disabled={loading} className="w-100 mt-3" type="submit">
            Publish
          </Button>
        </Form>
      </Popover.Body>
    </Popover>
  );

  const addComment = async (text, id) => {
    const docRef = doc(commentsRef, id);
    await updateDoc(docRef, {
      reply: text,
    });
  };

  const deleteComment = async (id) => {
    if (window.confirm("Are you sure you want to remove comment?")) {
      await deleteDoc(doc(commentsRef, id)).then(() => {
        window.location.reload();
      });
    }
  };

  return (
    <div className="comments">
      <h3 className="comments-title">Listen to your friends read:</h3>
      <OverlayTrigger trigger="click" placement="right" overlay={popover}>
        <Button className="btn btn-dark mt-2" onClick={Record}>
          Record Yourself Reading
        </Button>
      </OverlayTrigger>
      {loading ? (
        <h2>Loading...</h2>
      ) : (
        <div className="comments-container">
          {console.log(comments)}
          {comments &&
            comments.map((comment, index) => (
              <Comment
                key={index}
                commentid={comment.id}
                username={comment.username}
                audioURL={comment.audioURL}
                reply={comment.reply}
                activeComment={activeComment}
                setActiveComment={setActiveComment}
                addComment={addComment}
                deleteComment={deleteComment}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default Comments;
