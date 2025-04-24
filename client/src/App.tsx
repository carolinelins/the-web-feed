import React, { useEffect, useRef, useState } from 'react'
import { DateTime } from 'luxon'
import axios from 'axios'

type Author = {
  handle: string
  displayName: string
  avatar: string
}

type Post = {
  rkey: string
  text: string
  createdAt: string
  author: Author
  embed?: {
    type: string
    images?: {
      thumb: string
      alt: string
    }[]
    external?: {
      thumb: string
      title: string
      description: string
      uri: string
    }
    record?: {
      author: Author
      createdAt: string
      text: string
      rkey: string
    }
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

  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (carouselRef.current && window.bootstrap?.Carousel) {
      const carousel = new window.bootstrap.Carousel(carouselRef.current, {
        interval: 2000,
        touch: false,
      });

      return () => {
        carousel.dispose();
      };
    }
  }, []);


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
            ? <p className="text-center text-danger fs-5 mx-5">
              Une erreur a été renvoyée par l'API BlueSky.
              <br />Status : {aPIError.status}. Message : {aPIError.message}
            </p>
            : posts.length <= 0 || !selectedKeyWord
              ? <p className="text-center fs-5 mx-5">
                Utilisez le menu à gauche pour sélectionner un mot-clé.
                <br />En cliquant dessus, les posts BlueSky en français avec le mot-clé sont affichés ici.
              </p>
              : <ul className="list-group list-group-flush">
                {posts.map((post) => <li key={post.rkey} className="list-group-item text-break">
                  <div className="row">
                    <div className="col-auto">
                      <img src={post.author.avatar} className="img-fluid rounded-circle" alt="" style={{ height: '42px', width: '42px' }} />
                    </div>
                    <div className="col text-wrap">
                      <div className="row">
                        {post.author?.displayName && <div className="col-auto ps-0 fw-bold">{post.author.displayName}</div>}
                        {post.author?.handle && <a
                          target='_blank'
                          href={`https://bsky.app/profile/${post.author.handle}`}
                          className="col-auto ps-0 link-secondary link-underline-opacity-0 link-underline-opacity-75-hover fw-normal">
                          — @{post.author.handle}
                        </a>}
                        {post.createdAt && <a
                          target='_blank'
                          href={`https://bsky.app/profile/${post.author?.handle}/post/${post.rkey}`}
                          className="col-auto ps-0 link-secondary link-underline-opacity-0 link-underline-opacity-75-hover fw-normal">
                          • {DateTime.fromISO(post.createdAt).setLocale('fr').toLocaleString(DateTime.DATETIME_MED)}
                        </a>}
                      </div>
                      <div className="row">
                        <div className="col">
                          <div className="row mb-1">
                            {post.text}
                          </div>
                          <div className="row">
                            <div className="col px-0">

                              {(post.embed && post.embed.type == 'images') &&
                                <>
                                  {(post.embed.images) && <>
                                    {post.embed.images.length > 1
                                      ? <div id='carousel-images' className="carousel slide w-50">
                                        <div className="carousel-inner">
                                          {post.embed.images.map((image: any, i: number) => <div
                                            key={`${post.rkey}-image-${i}`}
                                            className={`carousel-item${i == 0 ? ' active' : ''}`}>
                                            <img
                                              className='img-thumbnail px-1 me-1 mb-1 object-fit-cover'
                                              src={image.thumb}
                                              style={{ minHeight: '100%' }}
                                            />
                                          </div>)}
                                        </div>
                                        <button className="carousel-control-prev" type="button" data-bs-target="#carousel-images" data-bs-slide="prev">
                                          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                          <span className="visually-hidden">Previous</span>
                                        </button>
                                        <button className="carousel-control-next" type="button" data-bs-target="#carousel-images" data-bs-slide="next">
                                          <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                          <span className="visually-hidden">Next</span>
                                        </button>
                                      </div>
                                      : <img
                                        alt={post.embed.images[0].alt}
                                        className='img-thumbnail px-1 me-1 mb-1 object-fit-cover w-50'
                                        src={post.embed.images[0].thumb}
                                        style={{ minHeight: '100%' }}
                                      />}
                                  </>}
                                </>}

                              {post.embed && post.embed.type == 'external' && <div className="card w-50">
                                <img src={post.embed.external?.thumb} className="card-img-top" alt="" />
                                <div className="card-body">
                                  <h5 className="card-title">{post.embed.external?.title}</h5>
                                  <p className="card-text">
                                    {post.embed.external?.description}
                                  </p>
                                </div>
                                <div className="card-footer">
                                  <a href={post.embed.external?.uri} target="_blank">
                                    {post.embed.external?.uri}
                                  </a>
                                </div>
                              </div>}

                              {post.embed && (post.embed.type == 'record' || post.embed?.type == 'recordWithMedia') && <div className="card">
                                <div className="card-body py-2">
                                  <div className="row">
                                    <div className="col-auto">
                                      <img src={post.embed.record?.author?.avatar} className="rounded-circle p-0" alt="" style={{ height: '16px', width: '16px' }} />
                                    </div>
                                    <div className="col-auto ps-0 fw-bold mt-1" style={{ "fontSize": ".875em" }}>
                                      {post.embed.record?.author?.displayName}
                                    </div>
                                    <div className="col-auto ps-0 mt-1" style={{ "fontSize": ".875em" }}>
                                      <a
                                        href={`https://bsky.app/profile/${post.embed?.record?.author?.handle}`}
                                        target="_blank"
                                        className="link-secondary link-underline-opacity-0 link-underline-opacity-75-hover fw-normal">
                                        — @{post.embed?.record?.author?.handle}
                                      </a>
                                    </div>
                                    <div className="col-auto ps-0 mt-1" style={{ "fontSize": ".875em" }}>
                                      <a
                                        href={`https://bsky.app/profile/${post.embed?.record?.author?.handle}/post/${post.embed?.record?.rkey}`}
                                        target="_blank"
                                        className="link-secondary link-underline-opacity-0 link-underline-opacity-75-hover fw-normal">
                                        • {post.embed?.record?.createdAt
                                          && DateTime.fromISO(post.embed.record.createdAt).setLocale('fr').toLocaleString(DateTime.DATETIME_MED)}
                                      </a>
                                    </div>
                                  </div>
                                  {post.embed?.record?.text}
                                </div>
                              </div>}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>)}
              </ul>}
      </div>
    </div>
  </div>
}

export default PostList