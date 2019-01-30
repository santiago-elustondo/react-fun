const API_DOMAIN = 'node200.eastus.cloudapp.azure.com'
const parseBody = async response => { 
  let body = await response.text()
  try {
    body = JSON.parse(body)
  } catch (e) { }
  return { response, body }
}

export const signUp = async ({ username, password }) => 
  parseBody(await fetch(`http://${API_DOMAIN}:5006/signup`, { 
    method: 'POST', 
    headers: { 'Content-Type': 'application/json', },
    body: JSON.stringify({ username, password })
  }))

export const logIn = async ({ username, password }) =>
  parseBody(await fetch(`http://${API_DOMAIN}:5001/login`, { 
    method: 'POST', 
    headers: { 
      'Content-Type': 'application/x-www-form-urlencoded', 
      'cache-control': 'no-cache'
    },
    body: `username=${username}&password=${password}`
  }))

export const validateToken = async ({ token }) => 
  parseBody(await fetch(`http://${API_DOMAIN}:5001/auth`, { 
    method: 'GET', 
    headers: { 
      'Authorization': `Bearer ${token}`
    }
  }))

export const listUsers = async () => 
  parseBody(await fetch(`http://${API_DOMAIN}:5008/users`, { 
    method: 'GET'
  }))

export const listUserThoughts = async ({ token, userId }) => 
  parseBody(await fetch(`http://${API_DOMAIN}:5007/users/${userId}/thoughts`, { 
    method: 'GET', 
    headers: { 
      'Authorization': `Bearer ${token}`, 
    }
  }))

export const getCommentsForThought = async ({ token, userId, thoughtId }) => 
  parseBody(await fetch(`http://${API_DOMAIN}:5002/users/${userId}/thoughts/${thoughtId}/comments`, { 
    method: 'GET', 
    headers: { 
      'Authorization': `Bearer ${token}`, 
    }
  }))
  
export const addCommentForThought = async ({ token, userId, thoughtId, content }) => 
  parseBody(await fetch(`http://${API_DOMAIN}:5002/users/${userId}/thoughts/${thoughtId}/comments`, { 
    method: 'POST', 
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/x-www-form-urlencoded', 
      'cache-control': 'no-cache'
    },
    body: `content=${content}`
  }))

export const addThought = async ({ token, userId, content }) => 
  parseBody(await fetch(`http://${API_DOMAIN}:5007/users/${userId}/thoughts`, { 
    method: 'POST', 
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/x-www-form-urlencoded', 
      'cache-control': 'no-cache'
    },
    body: `content=${content}`
  }))
  
export const getUserFollowers = async ({ token, userId }) =>
  parseBody(await fetch(`http://${API_DOMAIN}:5003/users/${userId}/followers`, { 
    method: 'GET', 
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/x-www-form-urlencoded', 
      'cache-control': 'no-cache'
    }
  }))

export const getUserFollowing = async ({ token, userId }) =>
  parseBody(await fetch(`http://${API_DOMAIN}:5003/users/${userId}/following`, { 
    method: 'GET', 
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/x-www-form-urlencoded', 
      'cache-control': 'no-cache'
    }
  }))

export const followUser = async ({ token, followerId, broadcasterId }) => {
  console.log(followerId, broadcasterId)
  parseBody(await fetch(`http://${API_DOMAIN}:5003/users/${followerId}/following/${broadcasterId}`, { 
    method: 'PUT', 
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/x-www-form-urlencoded', 
      'cache-control': 'no-cache'
    }
  }))
}


export const unfollowUser = async ({ token, followerId, broadcasterId }) =>
  parseBody(await fetch(`http://${API_DOMAIN}:5003/users/${followerId}/following/${broadcasterId}`, { 
    method: 'DELETE', 
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/x-www-form-urlencoded', 
      'cache-control': 'no-cache'
    }
  }))