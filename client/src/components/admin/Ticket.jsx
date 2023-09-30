import React, { useEffect,useState } from 'react'
import {useTicketsMutation} from '../../slices/adminApiSlice'
import {toast} from 'react-toastify'
import TicketReply from './TicketReply'

const Ticket = () => {
    const [ticketAPI] = useTicketsMutation();
    const [ticketData,setTicketData] = useState(null);
    const [selectedTicket, setSelectedTicket] = useState(null);
    useEffect(() => {
      fetchTickets();
      console.log(ticketData);
    }, [ticketAPI]);
    const fetchTickets = async () => {
    try {
      const response = await ticketAPI().unwrap();
      const filteredData = response.data.filter(item => item.tickets && item.tickets.length > 0);
      setTicketData(filteredData);
      console.log("ticketData",ticketData)
    } catch (err) {
      toast.error("Can't fetch data right now");
    }
  };
   const handleReplyClick = (ticket) => {
     setSelectedTicket(ticket);
   };
  return (
    <div className="container mx-auto p-6">
      {!selectedTicket ? (
        <>
          <h1 className="text-2xl text-center text-[#19376D] font-semibold mb-4">
            Ticket List
          </h1>
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Subject</th>
                <th className="px-6 py-3 text-left">Description</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Reply</th>
              </tr>
            </thead>
            <tbody>
              {ticketData?.map((item, index) => (
                <React.Fragment key={index}>
                  {item.tickets.map((ticket, ticketIndex) => (
                    <tr
                      key={ticketIndex}
                      className={
                        ticketIndex % 2 === 0 ? "bg-gray-100" : "bg-white"
                      }
                    >
                      <td className="px-6 py-4">{ticket.email}</td>
                      <td className="px-6 py-4">{ticket.subject}</td>
                      <td className="px-6 py-4 description-cell">
                        <div className="truncate max-w-xs">
                          {ticket.description}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {ticket.status ? (
                          <span className="text-green-500">Resolved</span>
                        ) : (
                          <span className="text-blue-500">Pending</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <button onClick={() => handleReplyClick(item)}>
                          Reply
                        </button>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <TicketReply
          email={selectedTicket.email}
          subject={selectedTicket.subject}
          setSelectedTicket={setSelectedTicket}
        />
      )}
    </div>
  );
}

export default Ticket