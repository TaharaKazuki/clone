import { useState } from 'react'
import { storage, db, auth } from '../../firebase'
import { useSelector } from 'react-redux'
import { selectUser } from '../../features/userSlice'
import { Avatar, Button, IconButton } from '@material-ui/core'
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto'

const TweetInput = () => {
  const user = useSelector(selectUser)
  const [tweetImage, setTweetImage] = useState<File | null>(null)
  const [tweetMsg, setTweetMsg] = useState('')

  return <div>index</div>
}

export default TweetInput
