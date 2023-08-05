import { Button } from "@material-tailwind/react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase-client";
import { FaFileLines, FaMagnifyingGlass } from "react-icons/fa6";

function Header({ image }) {
  return (
    <header className='sticky top-0 z-50 flex items-center px-4 py-2 shadow-md bg-white'>
      {/* <IconButton
        color='gray'
        size='md'
        variant='outlined'
        ripple={true}
        className='hidden md:inline-flex h-10 w-10 border-0 focus:shadow-none justify-center items-center'>
        <i className='fa-solid fa-bars text-2xl align-middle' />
      </IconButton> */}
      {/* <IconButton */}
      <Button
        size='md'
        variant='outlined'
        ripple
        className='md:inline-flex ml-2 mr-3 px-2 border-0 focus:shadow-none justify-center items-center'
        onClick={() => signOut(auth)}>
        {/* <i className='fa-solid fa-file-lines text-2xl'></i> */}
        <FaFileLines className='text-2xl' />
      </Button>
      {/* </IconButton> */}
      <h1 className='hidden md:inline-flex ml-2 text-gray-700 text-lg align-middle'>Google Doc Clone</h1>

      <div className='flex flex-grow items-center px-2 md:px-5 py-2 bg-gray-100 rounded-lg mx-2 md:mx-16 focus-within:text-gray-600 focus-within:shadow-md'>
        {/* <i className='fa-solid fa-magnifying-glass text-lg' style={{ color: "gray" }}></i> */}
        <FaMagnifyingGlass className='text-lg text-gray-600' />
        <input type='text' placeholder='Search Docs' className='flex-grow px-2 md:px-5 bg-transparent outline-none' />
      </div>

      <img
        loading='lazy'
        className='h-10 w-10 md:h-12 md:w-12 rounded-full hover:cursor-pointer'
        src={image}
        alt='profile'
        onClick={() => signOut()}
      />
    </header>
  );
}

export default Header;
