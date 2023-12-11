import React from 'react'

const Notification = ({ notification, error }) => {
  if (!notification) return <></>

  return (
    <div
      style={{
        color: error ? 'red' : 'green',
        background: 'lightgrey',
        fontSize: '20px',
        borderStyle: 'solid',
        borderRadius: '5px',
        padding: '10px',
        marginBottom: '10px',
      }}
    >
      {notification}
    </div>
  )
}

export default Notification
