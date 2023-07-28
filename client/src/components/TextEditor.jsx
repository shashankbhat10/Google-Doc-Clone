import Quill from "quill";
import { useCallback, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import "quill/dist/quill.snow.css";
import { useParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { firestore } from "../firebase-client";
import { AuthContext } from "../provider/AuthProvider";
import NotAllowedModal from "./NotAllowedModal";
import Loader from "./Loader";

const modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", { script: "sub" }, { script: "super" }],
    [
      { color: ["red", "blue", "black", "yellow", "orange", "green", "cyan", "magenta", "purple"] },
      { background: ["red", "blue", "yellow", "white", "black"] },
    ],
    ["blockquote", "code-block"],
    [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
    ["link", "image", "video"],
    ["clean"],
  ],
  //   clipboard: {
  //     // toggle to add extra line breaks when pasting HTML:
  //     matchVisual: false,
  //   },
};
/*
 * Quill editor formats
 * See https://quilljs.com/docs/formats/
 */
const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "script",
  "strike",
  "color",
  "background",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "code-block",
  "link",
  "image",
  "video",
];

export default function TextEditor({ updateIsOwner, isDocLocked }) {
  const [socket, setSocket] = useState(null);
  const [quill, setQuill] = useState(null);
  const { id: documentId } = useParams();
  const [isAllowed, setIsAllowed] = useState(true);
  const [loading, updateLoading] = useState(true);

  const { user } = useContext(AuthContext);

  useEffect(() => {
    async function getDocument() {
      const documentRef = doc(firestore, "document", documentId);
      const document = await getDoc(documentRef);
      const data = document.data();
      const allowedUsers = data.allowed;
      if (!allowedUsers.includes(user.email)) {
        setIsAllowed(false);
      } else {
        setIsAllowed(true);
        updateIsOwner(data.owner === user.email);
      }

      updateLoading(false);
    }

    const s = io("http://localhost:3001");
    if (user) {
      getDocument();
      setSocket(s);
    }

    return () => {
      s.disconnect();
    };
  }, [user, documentId, updateIsOwner]);

  // Handle socket message for sendind changes to document
  useEffect(() => {
    if (socket === null || quill === null) return;

    const handler = (delta, oldDelta, source) => {
      if (source !== "user") return;

      // console.log("HERE");
      socket.emit("send-changes", delta);
    };

    quill.on("text-change", handler);

    return () => {
      quill.off("text-change", handler);
    };
  }, [socket, quill]);

  // Handle socket message for receiving changes to document
  useEffect(() => {
    if (socket === null || quill === null) return;

    const handler = (delta) => {
      quill.updateContents(delta);
    };

    const documentLockHandler = (isLocked) => {
      if (isLocked) quill.disable();
      else quill.enable();
    };

    socket.on("receive-changes", handler);
    socket.on("change-document-lock-status", documentLockHandler);

    return () => {
      socket.off("receive-changes", handler);
      socket.off("change-document-lock-status", documentLockHandler);
    };
  }, [socket, quill]);

  // Handle socket message for getting/loading document
  useEffect(() => {
    if (socket === null || quill === null) return;

    socket.once("load-document", async () => {
      const documentRef = doc(firestore, "document", documentId);
      const document = await getDoc(documentRef);
      const data = document.data();
      quill.setContents(data.content);
      quill.enable();
    });

    socket.emit("get-document", documentId);
  }, [socket, quill, documentId]);

  // Lock / Unlock document handling
  useEffect(() => {
    if (quill === null || socket === null) return;

    if (isDocLocked) {
      const mainDocument = document.getElementsByClassName("ql-container ql-snow");
      console.log(mainDocument[0].outerHTML);
      // console.log(quill.root.innerHTML);
      quill.disable();
    } else {
      quill.enable();
    }

    socket.emit("change-document-lock-status", isDocLocked);
  }, [isDocLocked, quill, socket]);

  useEffect(() => {
    if (quill === null) return;

    const interval = setInterval(async () => {
      const documentRef = doc(firestore, "document", documentId);
      console.log(quill.getContents());
      await updateDoc(documentRef, { content: quill.getContents()["ops"] });
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, [quill, documentId]);

  // Wrapper ref for Quill editor
  const wrapperRef = useCallback((wrapper) => {
    if (wrapper === null) return;
    wrapperRef.innerHTML = "";
    const editor = document.createElement("div");
    wrapper.append(editor);
    const q = new Quill(editor, { theme: "snow", modules: modules, formats: formats });

    q.disable();
    q.setText("Loading...");
    setQuill(q);
  }, []);

  // const createNewDocument = async () => {
  //   if (newDocumentName === "") return;

  //   const document = {
  //     name: newDocumentName,
  //     owner: session.user.email,
  //     allowed: [session.user.email],
  //     timestamp: serverTimestamp(),
  //   };
  //   const createdDocRef = await addDoc(collection(firestore, "document"), document);

  //   console.log(createdDocRef);

  //   // console.log(addedDocument);
  //   updateNewDocumentName("");
  //   // updateShowCreateModal(false);
  //   closeModal();

  //   // router.push(`/document/${createdDocRef.id}`);

  //   // console.log(users);
  //   // console.log("Create New document");
  // };

  return (
    <>
      {loading ? (
        <div className='flex mt-60 items-center justify-center'>
          <Loader />
        </div>
      ) : (
        <>
          <div className='text-editor' ref={wrapperRef}></div>
          {!isAllowed && <NotAllowedModal />}
        </>
      )}
    </>
  );
}
