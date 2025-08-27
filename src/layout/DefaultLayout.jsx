import React from 'react'
import Header from '../component/Header'
import Content from '../component/Content'
import LeftPannel from '../component/leftPannel/index'

function DefaultLayout() {
  return (
    <div>
        <Header />
        <LeftPannel />
        <Content />
    </div>
  )
}

export default DefaultLayout