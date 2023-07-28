import { Dialog, Transition } from "@headlessui/react";
import { Button } from "@material-tailwind/react";
import { Fragment } from "react";

const CreateNewDocumentModal = ({ isOpen, closeModal, newDocumentName, updateNewDocumentName, createNewDocument }) => {
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as='div' className='relative z-10' onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'>
            <div className='fixed inset-0 bg-black bg-opacity-25' />
          </Transition.Child>

          <div className='fixed inset-0 overflow-y-auto'>
            <div className='flex min-h-full items-center justify-center p-4 text-center'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 scale-95'
                enterTo='opacity-100 scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 scale-100'
                leaveTo='opacity-0 scale-95'>
                <Dialog.Panel className='w-full max-w-sm transform overflow-hidden rounded-2xl bg-white p-4 text-left align-middle shadow-xl transition-all'>
                  <input
                    value={newDocumentName}
                    onChange={(e) => updateNewDocumentName(e.target.value)}
                    type='text'
                    placeholder='Enter name for new document'
                    className='outline-none w-full'
                    onKeyDown={(e) => e.key === "Enter" && createNewDocument()}
                  />

                  <div className='mt-2 flex justify-end'>
                    <Button
                      className='mr-2 p-2 border-0'
                      ripple={true}
                      color='blue'
                      variant='outlined'
                      onClick={() => closeModal()}>
                      Cancel
                    </Button>

                    <Button className='p-2' ripple={true} color='blue' onClick={() => createNewDocument()}>
                      Create
                    </Button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default CreateNewDocumentModal;
