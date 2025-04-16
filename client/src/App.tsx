import React, { useState } from 'react'
import { DateTime } from 'luxon'
import axios from 'axios'

type Post = {
  uri: string
  text: string
  createdAt: string
  author: {
    handle: string
    displayName: string
    avatar: string
  }
}

function PostList() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)
  const [aPIError, setAPIError] = useState<{ status: number, message: string }>()
  const [selectedKeyWord, setSelectedKeyWord] = useState('')
  const keyWordButtonValues = [
    'a11y',
    'angular',
    'css',
    'développement web',
    'frontend',
    'javascript',
    'react.js',
    'tailwindcss',
    'typescript',
    'vue.js'
  ]

  async function fetchPosts(evt: React.MouseEvent<HTMLButtonElement, MouseEvent>): Promise<void> {
    evt.preventDefault()
    evt.stopPropagation()
    setLoading(true)
    setAPIError(undefined)
    const { value } = evt.currentTarget
    setSelectedKeyWord(value)

    try {
      const response = await axios.get(`http://localhost:3001/api/posts`, {
        params: {
          q: value
        }
      })
      setPosts(response.data)
    } catch (error: any) {
      setAPIError({ ...error.response.data })
    } finally {
      setLoading(false)
    }
  }

  return <div className="d-flex flex-column min-vh-100">
    <nav className="navbar sticky-top bg-light">
      <div className="d-block m-auto text-center">
        <h1 className="font-monospace mb-0">the web feed.</h1>
        <p className="text-body-secondary mb-0">Votre feed de posts BlueSky sur le développement web</p>
      </div>
    </nav>
    <div className="row g-0 flex-grow-1 align-items-center">
      <div className="col p-2">
        <div className="card position-fixed" style={{
          inset: "50% auto auto 1rem",
          transform: "translateY(-50%)",
          width: "calc(25% - 2rem)",
          maxWidth: "100%",
        }}>
          <div className="card-header text-center">
            Filtrer les posts par mot-clé :
          </div>
          <ul className="list-group list-group-flush">
            {keyWordButtonValues.map(keyword => <button
              key={keyword}
              value={keyword}
              className={`list-group-item list-group-item-action list-group-item-light${selectedKeyWord == keyword ? ' active' : ''}`}
              onClick={(evt) => fetchPosts(evt)}
              disabled={selectedKeyWord == keyword}
            >
              {keyword}
            </button>)}
          </ul>
        </div>
      </div>
      <div className="col-9 p-3">

        {loading
          ? <div className="spinner-grow d-block m-auto" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          : aPIError
            ?
            <p className="text-center text-danger fs-5 mx-5">
              Une erreur a été renvoyée par l'API BlueSky.
              <br />Status : {aPIError.status}. Message : {aPIError.message}
            </p>
            : posts.length <= 0 || !selectedKeyWord
              ? <p className="text-center fs-5 mx-5">
                Utilisez le menu à gauche pour sélectionner un mot-clé.
                <br />En cliquant dessus, les posts BlueSky en français avec le mot-clé sont affichés ici.
              </p>
              : <ul className="list-group list-group-flush">
                {posts.map((post) => (
                  <li key={post.uri} className="list-group-item">
                    <div className="row">
                      <div className="col-auto">
                        <img src={post.author.avatar} className="img-fluid rounded-circle" alt="" style={{ height: '42px', width: '42px' }} />
                      </div>
                      <div className="col text-wrap">
                        <div className="row">
                          {post.author?.displayName && <div className="col-auto ps-0 fw-bold">{post.author.displayName}</div>}
                          {post.author?.handle && (
                            <div className="col-auto ps-0 text-muted">
                              — @{post.author.handle}
                            </div>
                          )}
                          {post.createdAt && (
                            <div className="col-auto ps-0 text-muted">
                              • {DateTime.fromISO(post.createdAt).setLocale('fr').toLocaleString(DateTime.DATETIME_MED)}
                            </div>
                          )}
                        </div>
                        <div className="row">
                          {post.text}
                        </div>
                      </div>

                    </div>
                  </li>
                ))}
              </ul>}

      </div>

    </div>
  </div>
}

export default PostList