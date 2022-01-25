import { useState } from "react";
import Button from "../../../components/Button";
import useUser from "../../../hooks/useUser";
import styles from "../../../styles/HomePage.module.css";
import { addDevit, downloadURL, uploadImage } from "../../../firebase/client";
import { useRouter } from "next/router";
import Head from "next/head";
import { useEffect } from "react/cjs/react.development";
import Avatar from "../../../components/Avatar";
const COMPOSE_STATES = {
  USER_NOT_KNOW: 0,
  LOADING: 1,
  SUCCES: 2,
  ERROR: -1,
};

const DRAG_IMAGE_STATES = {
  ERROR: -1,
  NONE: 0,
  DRAG_OVER: 1,
  UPLOADING: 2,
  COMPLETE: 3,
};

export default function ComposeTweet() {
  const user = useUser();
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(COMPOSE_STATES.USER_NOT_KNOW);
  const router = useRouter();
  const [drag, setDrag] = useState(DRAG_IMAGE_STATES.NONE);
  const [task, setTask] = useState(null);
  const [imgURL, setImgURL] = useState(null);

  const handleChange = (event) => {
    const { value } = event.target;
    setMessage(value);
  };

  const handleSubmit = () => {
    event.preventDefault();
    setStatus(COMPOSE_STATES.LOADING);
    addDevit({
      avatar: user.avatar,
      content: message,
      userId: user.uid,
      userName: user.username,
      img: imgURL,
    })
      .then(() => {
        router.push("/home");
      })
      .catch((err) => {
        console.log(err);
        setStatus(COMPOSE_STATES.ERROR);
      });
  };

  // useEffect(() => {
  //   if (task) {
  //     const onProgress = () => {};
  //     const onError = () => {};
  //     const onComplete = () => {
  //       console.log("onComplete");
  //       task.snapshot.ref.getDownloadURL().then(setImgURL);
  //     };

  //     task.on("state_changed", onProgress, onError, onComplete);
  //   }
  // }, [task]);

  useEffect(() => {
    if (task) {
      task.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          console.log(error);
        },
        async () => {
          const url = await downloadURL(task);
          setImgURL(url);
        }
      );
    }
  }, [task]);

  const handleDragEnter = (e) => {
    e.preventDefault();
    setDrag(DRAG_IMAGE_STATES.DRAG_OVER);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    setDrag(DRAG_IMAGE_STATES.NONE);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setDrag(DRAG_IMAGE_STATES.NONE);
    const file = e.dataTransfer.files[0];

    const task = uploadImage(file);
    setTask(task);
    console.log(task);
  };

  const isButtonDisabled = !message.length || status === COMPOSE_STATES.LOADING;
  return (
    <>
      <Head>
        <title>Crear un Devit / Devter</title>
      </Head>
      <section className={styles.formContainer}>
        {user && (
          <section className={styles.avatarContainer}>
            <Avatar src={user.avatar} />
          </section>
        )}
        <form onSubmit={handleSubmit}>
          <textarea
            onChange={handleChange}
            placeholder="¿Qué está pasando?"
            value={message}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          ></textarea>
          <div>
            <Button disabled={isButtonDisabled}>Devitear</Button>
          </div>
        </form>
      </section>

      {imgURL && (
        <section className={styles.removeImg}>
          <button onClick={() => setImgURL(null)}>x</button>
          <img src={imgURL} />
        </section>
      )}
      <style jsx>{`
        div {
          padding: 15px;
        }
        form {
          margin: 10px;
        }
        img {
          height: auto;
          width: 100%;
        }
        textarea {
          border-radius: 10px;
          width: 100%;
          min-height: 200px;
          font-size: 21px;
          border: ${drag === DRAG_IMAGE_STATES.DRAG_OVER
            ? "2px dashed #09f"
            : "2px solid transparent"};
          border-radius: 10px;
          padding: 15px;
          resize: none;
          outline: 0;
        }
        button {
          background: rgba(0, 0, 0, 0.3);
          border: 0;
          border-radius: 999px;
          color: #fff;
          font-size: 24px;
          width: 32px;
          height: 32px;
          top: 15px;
          position: absolute;
          right: 15px;
        }
      `}</style>
    </>
  );
}
