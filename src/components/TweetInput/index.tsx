import { useState } from 'react'
import { storage, db, auth } from '../../firebase'
import { useSelector } from 'react-redux'
import { selectUser } from '../../features/userSlice'
import { Avatar, Button, IconButton } from '@material-ui/core'
import firebase from 'firebase/app'
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto'
import styles from './style.module.css'

const TweetInput = () => {
  const user = useSelector(selectUser)
  const [tweetImage, setTweetImage] = useState<File | null>(null)
  const [tweetMsg, setTweetMsg] = useState('')

  return (
    <>
      <Avatar
        className={styles.tweet_avatar}
        src={user.photoUrl}
        onClick={async () => {
          await auth.signOut()
        }}
      />
    </>
  )
}

export default TweetInput
