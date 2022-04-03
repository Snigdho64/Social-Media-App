import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { client } from '../client'
import { feedQuery, searchQuery } from '../utils/data'
import MasonryLayout from './MasonryLayout'
import Spinner from './Spinner'

const Feed = () => {
  const [loading, setLoading] = useState(true)
  const { categoryId } = useParams()
  const [pins, setPins] = useState([])
  
  useEffect(() => {
    setLoading(true)
    if (categoryId) {
      client.fetch(searchQuery(categoryId)).then((data) => {
        setPins(data)
      })
    } else {
      client.fetch(feedQuery()).then((data) => {
        setPins(data)
      })
    }
    setLoading(false)
  }, [categoryId])

  return loading ? (
    <Spinner message={'We are loading new ideas'} />
  ) : (
    <div className="h-full">{pins && <MasonryLayout pins={pins} />}</div>
  )
}

export default Feed
