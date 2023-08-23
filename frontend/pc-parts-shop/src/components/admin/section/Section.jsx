import React, { } from 'react'
import { Outlet} from 'react-router-dom'
const Section = () => {
  return (
    <section className="mt-14 ml-[17%] w-[83%] h-fill">
      <Outlet />
    </section>
  )
}

export default Section