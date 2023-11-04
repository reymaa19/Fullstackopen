const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div
      className="error"
      style={{
        color:
          message.includes('removed') ||
          message.includes('valid') ||
          message.includes('Error')
            ? 'red'
            : 'green',
      }}
    >
      {message}
    </div>
  )
}

export default Notification
