import { useState } from 'react'
import type { FC, ChangeEvent, MouseEvent } from 'react'
import styles from './style.module.css'
import { useDispatch } from 'react-redux'
import { updateUserProfile } from '../../features/userSlice'
import { auth, provider, storage } from '../../firebase'

import {
  Button,
  Avatar,
  CssBaseline,
  TextField,
  FormControlLabel,
  Checkbox,
  Link,
  Paper,
  Box,
  Modal,
  IconButton,
  Grid,
  Typography,
} from '@material-ui/core'

import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import SendIcon from '@material-ui/icons/Send'
import CameraIcon from '@material-ui/icons/Camera'
import EmailIcon from '@material-ui/icons/Email'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'

import { makeStyles } from '@material-ui/core/styles'
import type { Theme } from '@material-ui/core/styles'

const getModalStyle = () => {
  const top = 50
  const left = 50

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  }
}

const useStyles = makeStyles<Theme>((theme) => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: 'url(https://source.unsplash.com/random)',
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light'
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  modal: {
    outline: 'none',
    position: 'absolute',
    width: 400,
    borderRadius: 10,
    backgroundColor: 'white',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(10),
  },
}))

const Auth: FC = () => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [username, setUsername] = useState<string>('')
  const [avatarImage, setAvatarImage] = useState<File | null>(null)
  const [isLogin, setIsLogin] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [resetEmail, setResetEmail] = useState('')

  const sendResetEmail = async (e: MouseEvent<HTMLElement>) => {
    await auth
      .sendPasswordResetEmail(resetEmail)
      .then(() => {
        setOpenModal(false)
        setResetEmail('')
      })
      .catch((e) => {
        alert(e.message)
        setResetEmail('')
      })
  }

  const onChangeImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files![0]) {
      setAvatarImage(e.target.files![0])
      e.target.value = ''
    }
  }

  const signInEmail = async () => {
    await auth.signInWithEmailAndPassword(email, password)
  }

  const signUpEmail = async () => {
    const authUser = await auth.createUserWithEmailAndPassword(email, password)
    let url = ''
    if (avatarImage) {
      const S = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
      const N = 16
      const randomChar = Array.from(crypto.getRandomValues(new Uint32Array(N)))
        .map((n) => S[n % S.length])
        .join('')

      const fileName = `${randomChar}_${avatarImage.name}`
      await storage.ref(`avatars/${fileName}`).put(avatarImage)
      url = await storage.ref('avatars').child(fileName).getDownloadURL()
    }

    await authUser.user?.updateProfile({
      displayName: username,
      photoURL: url,
    })

    dispatch(
      updateUserProfile({
        displayName: username,
        photoUrl: url,
      })
    )
  }

  const signInGoogle = async () => {
    await auth
      .signInWithPopup(provider)
      .catch((error: Error) => alert(error.message))
  }

  const submitHandler = async (isLogin: boolean) => {
    const handlerFunction = isLogin ? signInEmail : signUpEmail
    await handlerFunction().catch((e: Error) => alert(e.message))
  }

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {isLogin ? 'Login' : 'Resister'}
          </Typography>
          <form className={classes.form} noValidate>
            {!isLogin && (
              <>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  onChange={(
                    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
                  ) => setUsername(e.target.value)}
                  value={username}
                  autoFocus
                />
                <Box textAlign="center">
                  <IconButton>
                    <label>
                      <AccountCircleIcon
                        fontSize="large"
                        className={
                          avatarImage
                            ? styles.login_addIconLoaded
                            : styles.login_addIcon
                        }
                      />
                      <input
                        type="file"
                        className={styles.login_hiddenIcon}
                        onChange={onChangeImageHandler}
                      />
                    </label>
                  </IconButton>
                </Box>
              </>
            )}

            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              onChange={(
                e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
              ) => setEmail(e.target.value)}
              value={email}
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              onChange={(
                e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
              ) => setPassword(e.target.value)}
              autoComplete="current-password"
              value={password}
            />
            <Button
              disabled={
                isLogin
                  ? !email || password.length < 6
                  : !username || !email || password.length < 6 || !avatarImage
              }
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              startIcon={<EmailIcon />}
              onClick={() => submitHandler(isLogin)}
            >
              {isLogin ? 'Login' : 'Resister'}
            </Button>
            <Grid container>
              <Grid item xs>
                <span
                  onClick={() => setOpenModal(true)}
                  className={styles.login_reset}
                >
                  Forgot Password
                </span>
              </Grid>
              <Grid item>
                <span
                  className={styles.login_toggleMode}
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin ? 'Create new account ?' : 'Back to login'}
                </span>
              </Grid>
            </Grid>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              startIcon={<CameraIcon />}
              className={classes.submit}
              onClick={signInGoogle}
            >
              SignIn With Google
            </Button>
          </form>
          <Modal open={openModal} onClose={() => setOpenModal(false)}>
            <div style={getModalStyle()} className={classes.modal}>
              <div className={styles.login_modal}>
                <TextField
                  InputLabelProps={{
                    shrink: true,
                  }}
                  type="email"
                  name="email"
                  label="Reset E-mail"
                  value={resetEmail}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setResetEmail(e.target.value)
                  }}
                />
                <IconButton onClick={sendResetEmail}>
                  <SendIcon />
                </IconButton>
              </div>
            </div>
          </Modal>
        </div>
      </Grid>
    </Grid>
  )
}

export default Auth
