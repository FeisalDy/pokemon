'use client'
import Image from 'next/image'
import React, { useState } from 'react'
import { ColorExtractor } from 'react-color-extractor'

const Color = () => {
  const [dominantColor, setDominantColor] = useState(null)

  const getDominantColor = colors => {
    if (colors && colors.length > 0) {
      setDominantColor(colors[0])
    }
  }

  return (
    <div>
      <ColorExtractor getColors={getDominantColor}>
        <img
          src='https://avatars.githubusercontent.com/u/48194076?v=4'
          style={{ display: 'none' }} // Hide the image
        />
      </ColorExtractor>
      <div
        style={{
          marginTop: 20,
          display: 'flex',
          justifyContent: 'center',
          backgroundColor: dominantColor, // Set the background color
          width: 100,
          height: 100
        }}
      >
        Dominant Color
      </div>
    </div>
  )
}

export default Color
