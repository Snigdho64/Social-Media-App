import React, { useEffect, useState } from 'react'
import { client } from '../client'
import Spinner from './Spinner'
import { feedQuery, searchQuery } from '../utils/data'
import MasonryLayout from './MasonryLayout'

const Search = ({ searchTerm, setSearchTerm }) => {
  const [pins, setPins] = useState()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    if (searchTerm.trim()) {
      client.fetch(searchQuery(searchTerm)).then((data) => {
        setPins(data)
        setLoading(false)
      })
    } else {
      client.fetch(feedQuery()).then((data) => {
        setPins(data)
        setLoading(false)
      })
    }
  }, [searchTerm])
  
  return loading ? (
    <Spinner message={'Loading...'} />
  ) : (
    <MasonryLayout pins={pins} />
  )
}

export default Search
