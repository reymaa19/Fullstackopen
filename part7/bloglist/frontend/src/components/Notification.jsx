import { useNotificationValue } from '../reducers/NotificationContext'

const Notification = ({ error }) => {
  const notification = useNotificationValue()

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
