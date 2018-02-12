const OperaPage = ({ data }) => (
  <main className="avenir">
    <Hero content={heroContent} />
    {/* <Work sites={data.sites.edges} /> */}
  </main>
)

export default OperaPage

/* 
 *
 * Imports
 * 
 */

import React from 'react'
import Hero from '../components/Hero'

/* 
 *
 * Hero Content
 * 
 */

const heroContent = {
  theme: `green`,
  title: `Opera`,
  titleMultiplier: `8`,
  blurb: `I’m a Canadian opera singer. I trained in Canada, and sing bass roles in Canada, the U.S. and Europe. Check out my previous work below.`
}
