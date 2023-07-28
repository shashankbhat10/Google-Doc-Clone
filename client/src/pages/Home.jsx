import React, { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import { firestore } from "../firebase-client";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../provider/AuthProvider";
import { IconButton } from "@material-tailwind/react";
import { addDoc, collection, deleteDoc, doc, getDocs, query, serverTimestamp, where } from "firebase/firestore";
import DocumentTable from "../components/DocumentTable";
import CreateNewDocumentModal from "../components/CreateNewDocumentModal";

const Home = () => {
  const { user } = useContext(AuthContext);

  let [isOpen, setIsOpen] = useState(false);
  const [newDocumentName, updateNewDocumentName] = useState("");
  const [tableData, updateTableData] = useState([]);

  function closeModal() {
    setIsOpen(false);
    updateNewDocumentName("");
  }

  function openModal() {
    setIsOpen(true);
  }

  const navigate = useNavigate();

  useEffect(() => {
    if (user === null) {
      navigate("/login");
      // } else {
      //   console.log(user);
    }
  }, [navigate, user]);

  const createNewDocument = async () => {
    if (newDocumentName === "") return;

    const document = {
      name: newDocumentName,
      owner: user.email,
      allowed: [user.email],
      timestamp: serverTimestamp(),
      content: "",
      locked: false,
    };
    const createdDocRef = await addDoc(collection(firestore, "document"), document);

    updateNewDocumentName("");
    closeModal();

    navigate(`/document/${createdDocRef.id}`);
  };

  useEffect(() => {
    if (user === null) return;

    async function fetchDocuments() {
      const q = query(collection(firestore, "document"), where("allowed", "array-contains", user.email));
      const querySnapshot = await getDocs(q);

      let tableDataArr = [];
      querySnapshot.forEach((doc) => {
        let data = doc.data();
        let tempRow = {
          id: doc.id,
          name: data.name,
          status: data.owner === user.email ? "Owner" : "Shared",
          createdOn: new Date(data.timestamp.seconds * 1000).toLocaleDateString(),
        };

        tableDataArr.push(tempRow);
      });

      updateTableData(tableDataArr);
    }

    fetchDocuments();
  }, [user]);

  const deleteDocument = async (id) => {
    const documentRef = doc(firestore, "document", id);
    await deleteDoc(documentRef);
  };

  return (
    <>
      {user && (
        <>
          <div>
            <Header image={user.photoURL} />
            <section className='bg-[#F8F9FA] pb-10 px-10'>
              <div className='max-w-3xl mx-auto'>
                <div className='flex items-center justify-between py-6'>
                  <h2 className='text-gray-700 text-lg'>Start a new Document</h2>

                  <IconButton
                    color='gray'
                    variant='outlined'
                    ripple
                    className='border-0 rounded-full focus:shadow-none'>
                    <i className='fa-solid fa-ellipsis-vertical text-xl'></i>
                  </IconButton>
                </div>
                <div>
                  <div className='relative h-32 w-24 md:h-48 md:w-36 border-2 cursor-pointer hover:border-blue-700'>
                    <img
                      className='h-full'
                      src='/images/docs-blank-googlecolors.png'
                      alt='New Document'
                      onClick={() => {
                        // updateShowCreateModal(true);
                        openModal();
                      }}
                    />
                  </div>
                  <p className='ml-2 mt-2 font-semibold text-sm text-gray-700'>Blank</p>
                </div>
              </div>
            </section>

            <section className='bg-white px-10 md:px-0'>
              <div className='max-w-3xl mx-auto py-2 text-sm text-gray-700'>
                <div className='flex items-center justify-between pb-2'>
                  <h2 className='font-medium flex-grow text-lg'>My Documents</h2>
                  {/* <p className='mr-10'>Date Created</p> */}
                  {/* <i className='fa-solid fa-folder text-xl' style={{ color: "gray" }}></i> */}
                </div>
              </div>
            </section>

            <DocumentTable data={tableData} deleteDocument={deleteDocument} />
          </div>
          <CreateNewDocumentModal
            isOpen={isOpen}
            closeModal={closeModal}
            createNewDocument={createNewDocument}
            newDocumentName={newDocumentName}
            updateNewDocumentName={updateNewDocumentName}
          />
        </>
      )}
    </>
  );
};

export default Home;
