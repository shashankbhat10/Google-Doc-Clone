import { useState } from "react";
import DocumentHeader from "../components/DocumentHeader";
import TextEditor from "../components/TextEditor";
import { useParams } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { firestore } from "../firebase-client";

const Document = () => {
  const [isDocLocked, updateIsDocLocked] = useState(false);
  const [isOwner, updateIsOwner] = useState(false);

  const { id: documentId } = useParams();

  const documentLockHandler = async () => {
    const documentRef = doc(firestore, "document", documentId);
    await updateDoc(documentRef, { locked: !isDocLocked });
    updateIsDocLocked(!isDocLocked);
  };

  return (
    <>
      <div className='min-h-screen'>
        <DocumentHeader
          isDocLocked={isDocLocked}
          isOwner={isOwner}
          updateIsDocLocked={updateIsDocLocked}
          documentLockHandler={documentLockHandler}
        />
        <TextEditor updateIsOwner={updateIsOwner} isDocLocked={isDocLocked} />
      </div>
    </>
  );
};

export default Document;
