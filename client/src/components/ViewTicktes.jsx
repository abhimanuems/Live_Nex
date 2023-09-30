import React from 'react';


const ViewTicktes = (props) => {
    
 const data = props.data.response;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Ticket List</h1>
      <table className="min-w-full table-auto">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-6 py-3 text-left">Email</th>
            <th className="px-6 py-3 text-left">Subject</th>
            <th className="px-6 py-3 text-left">Description</th>
            <th className="px-6 py-3 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={index}
              className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
            >
              <td className="px-6 py-4">{item.email}</td>
              <td className="px-6 py-4">{item.subject}</td>
              <td className="px-6 py-4 description-cell">
                <div className="truncate max-w-xs">{item.description}</div>
              </td>
              <td className="px-6 py-4">{item.status ? <span className='text-green-500'>Resolved</span>: <span className='text-blue-500'>Pending</span>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ViewTicktes