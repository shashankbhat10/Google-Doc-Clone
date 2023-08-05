import { firestore, auth } from "../firebase-client";
import { Button, IconButton, Input, Popover, PopoverContent, PopoverHandler, Tooltip } from "@material-tailwind/react";
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../provider/AuthProvider";
import { signOut } from "firebase/auth";
import { RiLock2Line, RiShareFill } from "react-icons/ri";
import { useNavigate, useParams } from "react-router-dom";
// import { Popover, Transition } from "@headlessui/react";
import axios from "axios";
import { FaFileLines } from "react-icons/fa6";
// import { Button,  } from "@material-tailwind/react";

function DocumentHeader({ isDocLocked, isOwner, updateIsDocLocked, documentLockHandler }) {
  const { user } = useContext(AuthContext);
  const [documentName, updateDocumentName] = useState("");
  const [newDocumentName, updateNewDocumentName] = useState("");
  const [emailToShare, updateEmailToShare] = useState("");
  const [showPopover, updateShowPopover] = useState(false);
  // const shareButtonRef = useRef(null);

  const { id: documentId } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    async function getDocumentData() {
      const documentRef = doc(firestore, "document", documentId);

      const documentSnapshot = await getDoc(documentRef);
      const documentData = documentSnapshot.data();

      updateDocumentName(documentData.name);
      updateNewDocumentName(documentData.name);
    }

    getDocumentData();
  }, [documentId]);

  const updateDocumentNameHandler = async (e) => {
    const documentRef = doc(firestore, "document", documentId);
    await updateDoc(documentRef, { name: e.target.value });
  };

  const resetNewDocumentName = () => {
    updateNewDocumentName(documentName);
  };

  const addEmailToAllowedList = async (event) => {
    const token = await auth.currentUser.getIdToken();
    const documentRef = doc(firestore, "document", documentId);
    await updateDoc(documentRef, { allowed: arrayUnion(emailToShare) });

    const emailData = {
      token: token,
      emailTo: emailToShare,
      documentName: newDocumentName,
      documentId: documentId,
    };
    // const res = await axios.post("http://localhost:8000/sendmail", emailData);
    const BASE_URL = process.env.REACT_APP_BASE_API_URL;
    // await axios.post("http://localhost:8000/api/sendmail", emailData);
    await axios.post(`${BASE_URL}/api/sendmail`, emailData);

    updateEmailToShare("");
  };

  return (
    <header className='sticky top-0 z-50 flex justify-between items-center px-4 pt-2 shadow-md bg-white document-page-header'>
      {/* <IconButton */}
      <Button
        color='blue'
        size='md'
        variant='outlined'
        ripple
        onClick={() => navigate("/home")}
        className='md:inline-flex ml-2 mr-3 w-fit px-2 border-0 py-0 items-center mb-2 focus:shadow-none'>
        {/* <i className='fa-solid fa-file-lines text-2xl'></i> */}
        <FaFileLines className='text-2xl' />
      </Button>
      {/* </IconButton> */}
      <div>
        <input
          type='text'
          value={newDocumentName}
          onChange={(e) => updateNewDocumentName(e.target.value)}
          placeholder='Document Name'
          className='flex-grow px-2 md:px-5 pb-2 justify-center bg-transparent outline-none text-center'
          onKeyDown={(e) => e.key === "Enter" && updateDocumentNameHandler()}
          onBlur={resetNewDocumentName}
        />
      </div>

      <div className='flex'>
        <Tooltip content={`Click to ${isDocLocked ? "unlock" : "lock"} document editing`}>
          <IconButton
            color={`${isDocLocked ? "red" : "blue-gray"}`}
            variant='outlined'
            ripple
            className={`h-20 w-20 ${
              isDocLocked ? "border-2 border-red-900" : "border-0"
            } focus:shadow-none mr-6 rounded-full`}
            disabled={!isOwner}
            onClick={() => {
              documentLockHandler();
              // updateIsDocLocked(!isDocLocked)
            }}>
            <RiLock2Line className='text-2xl' />
          </IconButton>
        </Tooltip>

        <Popover placement='bottom-end'>
          <PopoverHandler>
            <Button
              // ref={(elem) => (shareButtonRef = elem)}
              className='w-fit h-10 mr-7 py-2'
              color='blue'
              ripple
              onClick={() => {
                updateShowPopover(!showPopover);
              }}>
              Share
            </Button>
          </PopoverHandler>
          <PopoverContent className='flex z-50 p-2 mt-2 shadow-xl shadow-blue-gray-300 justify-center items-center gap-2'>
            {/* <input
              type='text'
              value={emailToShare}
              onChange={(e) => updateEmailToShare(e.target.value)}
              placeholder='Enter correct email'
              className='flex-grow justify-center bg-transparent outline-none border-b-2 w-3/4 md:mr-5 mr-2 ml-2 mt-2'
              // onKeyDown={(e) => e.key === "Enter" && updateDocumentNameHandler()}
              // onBlur={resetNewDocumentName}
            /> */}
            <Input
              label='Email Address'
              type='email'
              value={emailToShare}
              onChange={(e) => updateEmailToShare(e.target.value)}
            />
            <Button className='py-2 px-4' disabled={emailToShare === ""} onClick={(e) => addEmailToAllowedList(e)}>
              <RiShareFill className='text-xl' />
            </Button>
          </PopoverContent>
        </Popover>

        <img
          loading='lazy'
          className='h-10 w-10 md:h-10 md:w-10 rounded-full hover:cursor-pointer mb-2'
          src={user?.photoURL}
          alt='profile'
          onClick={() => signOut()}
        />
      </div>
    </header>
  );
}

export default DocumentHeader;
