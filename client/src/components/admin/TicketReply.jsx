import React,{useState} from 'react'

const TicketReply = (props) => {
    const email = props.email;
    const subject = props.subject;
    const [replyMessage, setReplyMessage] = useState("");
   const handleReplySubmit = (e) => {
    e.preventDefault();
    // Implement your logic to send the reply message, e.g., make an API call

    // After sending the reply, you can clear the input field
    setReplyMessage('');
  };

  return (
    <div>
      <h2>Reply to Ticket</h2>
      <form onSubmit={handleReplySubmit}>
        <div>
          <label>Email:</label>
          <input type="text" value={email} disabled />
        </div>
        <div>
          <label>Subject:</label>
          <input type="text" value={subject} disabled />
        </div>
        <div>
          <label>Reply Message:</label>
          <textarea
            value={replyMessage}
            onChange={(e) => setReplyMessage(e.target.value)}
            rows="4"
            cols="50"
            required
          ></textarea>
        </div>
        <button type="submit">Send Reply</button>
      </form>
    </div>
  );
};

export default TicketReply