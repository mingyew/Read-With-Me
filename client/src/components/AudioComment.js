import { useReactMediaRecorder } from "react-media-recorder";
import { Button, Container } from "react-bootstrap";

const AudioComment = () => {
  const { startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder(
    {}
  );

  return (
    <div>
      <Container>
        <Button variant="success" className="me-4" onClick={startRecording}>
          Start
        </Button>
        <Button variant="danger" className="me-4" onClick={stopRecording}>
          Stop
        </Button>
        <Button> Save</Button>
      </Container>
      <Container className="mt-3">
        <audio
          src={mediaBlobUrl}
          width={250}
          controls
          autoPlay
          loop
          style={{ width: 300 }}
        />
      </Container>
    </div>
  );
};

export default AudioComment;
