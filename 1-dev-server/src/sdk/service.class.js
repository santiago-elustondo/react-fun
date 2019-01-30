import * as endpoints from './endpoints.functions'

export class ThinkerSDK {

  constructor() {
    this._user = JSON.parse(localStorage.getItem('thinker-user'))
    this._token = localStorage.getItem('thinker-token')
    this._authState = 'LOADING'
    this._authhandlers = []
    if (this._token)
      this.tokenIsValid().then(isValid => {
        if (isValid) this._updateAuthState('LOGGED-IN')
        else this.logout()
      })
    else this.logout()
  }

  user() {
    return this._user
  }

  subscribeToAuthState(handler) {
    this._authhandlers.push(handler)
    setTimeout(() => handler(this._authState))
  }

  async tokenIsValid() {
    if (!this._token) return false
    const validateResponse = await endpoints.validateToken({ token: this._token })
    return (
      validateResponse.response.status === 200 &&
      validateResponse.body._id === this._user._id 
    )
  }

  async signup({ username, password }) {
    const signUpResponse = await endpoints.signUp({ username, password })
    if (signUpResponse.response.ok) {
      this._setUser(signUpResponse.body)
      return this.login({ username, password })
    } else return { success: false }
  }

  async login({ username, password }) {
    const loginResponse = await endpoints.logIn({ username, password })
    if (loginResponse.response.ok) {
      this._setToken(loginResponse.body.token)
      this._setUser(loginResponse.body.user)
      this._updateAuthState('LOGGED-IN')
      return { success: true, user: this._user }
    } else {
      return { success: false }
    }
  }

  async logout() {
    this._setUser(null)
    this._setToken(null)
    this._updateAuthState('LOGGED-OUT')
  }

  // deprecated
  async listUsers() {
    return this.fetchUsers()
  }
  
  async fetchUsers() {
    const response = await endpoints.listUsers()
    return response.body
  }

  async fetchUser({ userId }) {
    const allUsers = await this.fetchUsers()
    return allUsers.find(u => u._id === userId)
  }

  // deprecated
  async listUserThoughts({ userId }) {
    return this.fetchUserThoughts({ userId })
  }

  async fetchUserThoughts({ userId }) {
    const response = await endpoints.listUserThoughts({ userId, token: this._token })
    const thoughts = response.body
    thoughts.sort((a, b) => Date.parse(a.created) < Date.parse(b.created) ? 1 : -1 )
    return thoughts
  }

  // deprecated
  async getComments({ thoughtId, userId }) {
    return this.fetchComments({ thoughtId, userId })
  }

  async fetchComments({ thoughtId, userId }) {
    const allUsers = await this.fetchUsers()
    const commentsResponse = await endpoints.getCommentsForThought({ userId, thoughtId, token: this._token })
    const comments = commentsResponse.body
    comments.sort((a, b) => Date.parse(a.created) < Date.parse(b.created) ? 1 : -1 )
    const commentsWithUser = comments.map(comment => ({
      ...comment,
      user: allUsers.find(u => comment.userId === u._id)
    }))
    return commentsWithUser
  }

  async fetchThoughts() {
    const users = await this.fetchUsers()
    const userThoughts = await Promise.all(
      users.map(u => this.fetchUserThoughts({ userId: u._id }))
    )
    const allThoughts = userThoughts.reduce((allThoughts, thoughtsOfUser, i) => 
      allThoughts.concat(
        thoughtsOfUser.map(thought => Object.assign(thought, { 
          user: users[i]
        }))
      ), [])
    const commentsForThoughts = await Promise.all(
      allThoughts.map(t => this.fetchComments({ thoughtId: t._id, userId: t.user._id }))
    )
    allThoughts.forEach((thought, i) => thought.comments = commentsForThoughts[i])
    allThoughts.sort((a, b) => Date.parse(a.created) < Date.parse(b.created) ? 1 : -1 )
    return allThoughts
  }

  async fetchThought({ thoughtId, userId }) {
    const allUsers = await this.fetchUsers()
    const user = allUsers.find(u => u._id === userId)
    const thoughts = await this.fetchUserThoughts({ userId })
    const thought = thoughts.find(t => t._id === thoughtId)
    const commentsResponse = await endpoints.getCommentsForThought({ userId, thoughtId, token: this._token })
    const comments = commentsResponse.body
    comments.sort((a, b) => Date.parse(a.created) < Date.parse(b.created) ? 1 : -1 )
    
    const commentsWithUser = comments.map(comment => ({
      ...comment,
      user: allUsers.find(u => comment.userId === u._id)
    }))

    return { ...thought, user, comments: commentsWithUser }
  }

  async addThought({ content }) {
    const response = await endpoints.addThought({ 
      userId: this._user._id, 
      content, 
      token: this._token 
    })

    const thought = response.body

    return { ...thought, user: this._user }
  }

  async addComment({ userId, thoughtId, content }) {
    const response = await endpoints.addCommentForThought({ userId, thoughtId, content, token: this._token })
    const comment = response.body

    return { ...comment, user: this._user }
  }

  async fetchUserComplete({ userId }) {
    const user = await this.fetchUser({ userId })
    // const followers = await this.fetchFollowers({ userId })
    const thoughts = await this.fetchUserThoughts({ userId })
    const commentsForThoughts = await Promise.all(
      thoughts.map(t => this.fetchComments({ thoughtId: t._id, userId: user._id }))
    )
    thoughts.forEach((thought, i) => thought.comments = commentsForThoughts[i])
    return { ...user, thoughts }
  }

  _commentWatchers = {}
  subscribeToComments({ userId, thoughtId, handler = () => {} }){

    if (!this._commentWatchers[thoughtId]) 
      this._commentWatchers[thoughtId] = {
        currentVal: undefined,
        interval: setInterval(async () => {

          const commentsResponse = await endpoints.getCommentsForThought({ 
            userId, 
            thoughtId, 
            token: this._token 
          })

          const allUsers = await this.fetchUsers()

          const comments = commentsResponse.body

          const commentsWithUser = comments.map(comment => ({
            ...comment,
            user: allUsers.find(u => comment.userId === u._id)
          }))

          const w = this._commentWatchers[thoughtId]
          commentsWithUser.sort((a, b) => Date.parse(a.created) < Date.parse(b.created) ? 1 : -1 )
          
          w.currentVal = commentsWithUser
          w.handlers.forEach(h => setTimeout(() => h(w.currentVal)))

        }, 2000),
        handlers: []
      }
    
    const w = this._commentWatchers[thoughtId]
    
    if (!w.handlers.includes(handler))
      w.handlers.push(handler)
    
    if (w.currentVal) 
      setTimeout(() => handler(w.currentVal))
  }

  unsubscribeToComments({ thoughtId, handler = () => {} }) {
    const w = this._commentWatchers[thoughtId]

    w.handlers = w.handlers.filter(h => h !== handler)
    
    if (!w.handlers.length) {
      clearInterval(w.interval)
      delete this._commentWatchers[thoughtId]
    }
  }

  _updateAuthState(state) {
    this._authState = state
    this._authhandlers.forEach(h => setTimeout(() => h(state)))
  }

  _setUser(user) {
    localStorage.setItem('thinker-user', JSON.stringify(user))
    this._user = user
  }

  _setToken(token) {
    localStorage.setItem('thinker-token', token)
    this._token = token
  }

}