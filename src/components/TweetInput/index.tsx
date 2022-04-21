import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { storage, db, auth } from '../../firebase'
import { useSelector } from 'react-redux'
import { selectUser } from '../../features/userSlice'
import { Avatar, Button, IconButton } from '@material-ui/core'
import firebase from 'firebase/app'
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto'
import styles from './style.module.css'
import { DvrTwoTone } from '@material-ui/icons'
import { url } from 'inspector'

const TweetInput = () => {
  const user = useSelector(selectUser)
  const [tweetImage, setTweetImage] = useState<File | null>(null)
  const [tweetMsg, setTweetMsg] = useState('')

  const onChangeImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files![0]) {
      setTweetImage(e.target.files![0])
      e.target.value = ''
    }
  }

  const sendTweet = (e: FormEvent) => {
    e.preventDefault()
    if (tweetImage) {
      const S = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
      const N = 16
      const randomChar = Array.from(crypto.getRandomValues(new Uint32Array(N)))
        .map((n) => S[n % S.length])
        .join('')

      const fileName = `${randomChar}_${tweetImage.name}`
      const uploadTweetImg = storage.ref(`images/${fileName}`).put(tweetImage)

      uploadTweetImg.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        () => {},
        (err) => {
          alert(err.message)
        },
        async () => {
          const result = await storage
            .ref('images')
            .child(fileName)
            .getDownloadURL()
          if (result) {
            await db.collection('posts').add({
              avatar: user.photoUrl,
              image: url,
              text: tweetMsg,
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              username: user.displayName,
            })
          }
        }
      )
    } else {
      db.collection('posts').add({
        avatar: user.photoUrl,
        image: '',
        text: tweetMsg,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        username: user.displayName,
      })
    }
    setTweetImage(null)
    setTweetMsg('')
  }

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
