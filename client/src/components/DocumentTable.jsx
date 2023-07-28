import { Typography } from "@material-tailwind/react";
import { FaTrash } from "react-icons/fa6";
import { Link } from "react-router-dom";

const TABLE_HEAD = [
  ["Name", 6],
  ["Status", 3],
  ["Created On", 2],
  ["", 1],
];

const DocumentTable = ({ data, deleteDocument }) => {
  return (
    <table className='w-full max-w-3xl table-auto text-left mx-auto'>
      <thead>
        <tr>
          {TABLE_HEAD.map((head) => (
            <th key={head} className='border-b border-blue-gray-100 bg-blue-gray-50 p-4' colSpan={head[1]}>
              <Typography variant='small' color='blue-gray' className='font-normal leading-none opacity-70'>
                {head[0]}
              </Typography>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map(({ id, name, status, createdOn }, index) => {
          const isLast = index === data.length - 1;
          const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

          return (
            <tr key={id} className='even:bg-blue-gray-50/50'>
              <td className={classes} colSpan={6}>
                <Link to={`/document/${id}`}>
                  <Typography variant='small' color='blue-gray' className='font-normal'>
                    {name}
                  </Typography>
                </Link>
              </td>
              <td className={classes} colSpan={3}>
                <Typography variant='small' color='blue-gray' className='font-normal'>
                  {status}
                </Typography>
              </td>
              <td className={classes} colSpan={2}>
                <Typography variant='small' color='blue-gray' className='font-normal'>
                  {createdOn}
                </Typography>
              </td>
              <td className={classes} colSpan={1}>
                <FaTrash color='red' className='text-lg' onClick={() => deleteDocument(id)} />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default DocumentTable;
