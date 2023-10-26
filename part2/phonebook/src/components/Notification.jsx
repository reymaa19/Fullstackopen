const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div
      className="error"
      style={{ color: message.includes('removed') ? 'red' : 'green' }}
    >
      {message}
    </div>
  )
}

export default Notification
