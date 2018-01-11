const IndexPage = ({ data }) => (
  <div className="tc">
    <h1>My Website (Gatsby testing phase...)</h1>
    <Link to="/page-2/">Go to page 2</Link>
    <ImageTests sizes={data.placeholderImage.sizes} />
    <ReactSlick sizes={data.placeholderImage.sizes} />
    <IsotopeTests sizes={data.placeholderImage.sizes} />
    {/* <ScrollRevealTests sizes={data.placeholderImage.sizes} /> */}
    <ScrollRevealTest2 sizes={data.placeholderImage.sizes} />
    {/* <ReactScrollRevealTests sizes={data.placeholderImage.sizes} /> */}
    <ReactRevealTests sizes={data.placeholderImage.sizes} />
    <div className="pv7" />
  </div>
)

export default IndexPage

/*

Supporting imports, subcomponents & queries...

*/

/* General Imports */

import React from 'react'
import Link from 'gatsby-link'

/* Gatsby-Image Tests */

import Image from 'gatsby-image'

const ImageTests = props => (
  <section className="pv5 tc">
    <h2>Gatsby-Image Test (Blur Up)</h2>
    <Image sizes={props.sizes} />
  </section>
)

/* React-Slick Tests */

import Slick from 'react-slick'
import '../../node_modules/slick-carousel/slick/slick.css'
import '../../node_modules/slick-carousel/slick/slick-theme.css'

class ReactSlick extends React.Component {
  render() {
    const settings = {
      dots: true,
      arrows: true, // to see arrows, disable slick-theme.css (the arrows are offscreen)
      infinite: true,
      autoplay: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1
    }
    return (
      <div className="bg-near-white pv5">
        <h2 className="tc">React-Slick Test</h2>
        <div className="center w-50">
          <Slick {...settings}>
            <div>
              <Image sizes={this.props.sizes} />
            </div>
            <div>
              <Image sizes={this.props.sizes} />
            </div>
            <div>
              <Image sizes={this.props.sizes} />
            </div>
          </Slick>
        </div>
      </div>
    )
  }
}

/* 

Isotope Test (with filtering + "load more")

- to explain how this setup works, see Hubert's answer here: https://stackoverflow.com/questions/25135261/react-js-and-isotope-js/29866950

- as an alternative, use: https://github.com/eiriklv/react-masonry-component

*/

import Isotope from 'isotope-layout'

const IsotopeTests = props => (
  <section>
    <h2>Isotope Test</h2>
    <IsotopeContainer sizes={props.sizes} />
  </section>
)

const isotopeItems = [
  { key: 1, category: `category-1`, classes: `js-isotope-item all category-1 w-25 visible` },
  { key: 2, category: `category-2`, classes: `js-isotope-item all category-2 w-50 visible` },
  { key: 3, category: `category-2`, classes: `js-isotope-item all category-2 w-25 visible` },
  { key: 4, category: `category-1`, classes: `js-isotope-item all category-1 w-25 visible` },
  { key: 5, category: `category-1`, classes: `js-isotope-item all category-1 w-25 visible` },
  { key: 6, category: `category-2`, classes: `js-isotope-item all category-2 w-50 visible` }
]

const FilterButtons = props => (
  <div className="js-filter-buttons">
    <button onClick={category => props.handleFilter((category = 'all'))} className="js-filter-button">
      All
    </button>
    <button onClick={category => props.handleFilter((category = 'category-1'))} className="js-filter-button">
      Category 1
    </button>
    <button onClick={category => props.handleFilter((category = 'category-2'))} className="js-filter-button">
      Category 2
    </button>
  </div>
)

// Isotope Container (logic for initialization + filtering + "load more")
class IsotopeContainer extends React.Component {
  render() {
    // Update classes on each Isotope item (to show the right category and # of items)

    let counter = 0
    // console.log(`category`, category)

    const allItemsWithClassesUpdated = this.state.allItems.map(item => {
      // Add "visible" class if item is right category and # limit hasn't been reached
      if (
        (item.category === this.state.category.substring(1) || this.state.category === `.all`) &&
        counter < this.state.howManyToShow
      ) {
        const classList = item.classes.replace(`hidden`, `visible`)
        item.classes = classList

        // Increment counter
        counter++

        console.log(`counter`, counter)

        // Otherwise, remove "visible class"
      } else {
        const classList = item.classes.replace(`visible`, `hidden`)
        item.classes = classList
      }
      return item
    })

    return (
      <div>
        <FilterButtons handleFilter={this.filterItems} />
        <div ref={node => (this.node = node)}>
          {allItemsWithClassesUpdated.map((item, index) => {
            return (
              <div key={item.key} className={item.classes}>
                <Image sizes={this.props.sizes} />
              </div>
            )
          })}
        </div>
        {this.state.showLoadMoreBtn && <button onClick={this.showMoreItems}>Load more</button>}
      </div>
    )
  }

  state = {
    isotope: null,
    allItems: isotopeItems,
    activeCategoryItems: isotopeItems,
    category: `.all`,
    initialNumber: 2,
    increment: 2,
    howManyToShow: 2,
    showLoadMoreBtn: true
  }

  // Initialize Isotope
  componentDidMount() {
    if (!this.state.isotope) {
      this.setState({
        isotope: new Isotope(this.node)
      })
    } else {
      this.state.isotope.arrange({ filter: `.visible` })
    }
  }

  // This is what actually updates Isotope (after state changes trigger a new render)
  componentDidUpdate() {
    if (this.state.isotope) {
      this.state.isotope.arrange({ filter: `.visible` })
    }
  }

  filterItems = category => {
    if (this.state.isotope) {
      // To get the length of the activeCategoryItems array for the showMoreItems() method, filter allItems by the active category
      let categoryItems = null
      if (category === `all`) {
        categoryItems = this.state.allItems
      } else {
        categoryItems = this.state.allItems.filter(item => item.category === category)
      }

      // Determine whether to show the "Load More" button
      let showLoadMoreBtn = true
      if (this.state.initialNumber >= categoryItems.length) {
        showLoadMoreBtn = false
      }

      // Update the state (triggers render() + componentDidUpdate())
      this.setState({
        category: `.${category}`,
        howManyToShow: this.state.initialNumber,
        activeCategoryItems: categoryItems,
        showLoadMoreBtn: showLoadMoreBtn
      })
    }
  }

  showMoreItems = () => {
    // Increment the items showing by the increment
    let newNumberToShow = this.state.howManyToShow + this.state.increment
    let showLoadMoreBtn = true

    // Cap the items showing to the total items in the active category
    if (newNumberToShow >= this.state.activeCategoryItems.length) {
      newNumberToShow = this.state.activeCategoryItems.length
      showLoadMoreBtn = false
    }

    // Update the state (triggers render() + componentDidUpdate())
    this.setState({
      howManyToShow: newNumberToShow,
      showLoadMoreBtn: showLoadMoreBtn
    })
  }
}

/*

ScrollReveal Tests

- see solution from owner on GitHub: https://github.com/jlmakes/scrollreveal/issues/218
- see his demo: https://codesandbox.io/s/z2wqk3vm1l

*/

import { findDOMNode } from 'react-dom'
import ScrollReveal from 'scrollreveal'

// Stateless functional component won't have refs.
// https://reactjs.org/docs/refs-and-the-dom.html#refs-and-functional-components

// const Item = ({ content }) => <li>{content}</li> // doesn’t work!

// class Item extends React.Component {
//   render() {
//     return <li>{this.props.content}</li>
//   }
// }

// const List = ({ children }) => (
//   <div>
//     <h3>List:</h3>
//     {children}
//   </div>
// )

// // ScrollReveal HOC
// const WithScrollReveal = WrappedComponent =>
//   class extends React.Component {
//     // constructor(props) {
//     //   super(props)
//     //   this.target = []
//     // }
//     // componentDidMount() {
//     //   ScrollReveal().reveal(this.target, this.props.options, this.props.interval)
//     // }
//     componentWillUnmount() {
//       ScrollReveal().clean(this.childNodes)
//     }
//     // render() {
//     //   const children = React.Children.map(this.props.children, child =>
//     //     React.cloneElement(child, {
//     //       ref: c => this.target.push(findDOMNode(c))
//     //     })
//     //   )
//     //   return <WrappedComponent {...this.props}>{children}</WrappedComponent>
//     // }

//     bindRef(c) {
//       this.component = c
//     }

//     componentDidMount() {
//       const domElement = findDOMNode(this.component)
//       ScrollReveal().reveal(domElement, this.props.options, this.props.interval)
//     }

//     render() {
//       const that = this
//       return (
//         <WrappedComponent
//           {...this.props}
//           ref={function(c) {
//             that.bindRef(c)
//           }}
//         />
//       )
//     }
//   }

// const RevealedList = WithScrollReveal(List)

// const ScrollRevealTests = () => (
//   <section className="bg-near-white pv5">
//     <h2>ScrollReveal Test</h2>
//     <RevealedList options={{ distance: '50px' }} interval={500}>
//       <Item content="foo" />
//       <Item content="bar" />
//       <Item content="jam" />
//     </RevealedList>
//   </section>
// )

/*

ScrollReveal Test #2

- see the code that worked in the end: https://andrewshiau.wordpress.com/2017/04/02/use-scrollreveal-js-on-a-react-component/

- see solution from owner on GitHub (didn't work for me...): https://github.com/jlmakes/scrollreveal/issues/218
- see his demo: https://codesandbox.io/s/z2wqk3vm1l

*/

const ScrollRevealTest2 = props => (
  <section className="pv5">
    <h2>ScrollReveal Test #2</h2>
    <RevealedComponent
      sizes={props.sizes}
      options={{
        delay: '0',
        duration: '1000',
        distance: '40px',
        reset: false
      }}
      interval={0}
    />
  </section>
)

// HOC for ScrollReveal: wrap the components to reveal like this: reveal(MyComponent)
const reveal = WrappedComponent => {
  return class RevealEnhancer extends React.Component {
    bindRef(c) {
      this.component = c
    }

    componentDidMount() {
      const domElement = findDOMNode(this.component)
      console.log(`options`, this.props.options)
      ScrollReveal().reveal(domElement, this.props.options, this.props.interval)
    }

    render() {
      const that = this
      return (
        <WrappedComponent
          {...this.props}
          ref={function(c) {
            that.bindRef(c)
          }}
        />
      )
    }
  }
}

class MyComponent extends React.Component {
  render() {
    return (
      <div>
        <Image sizes={this.props.sizes} />
      </div>
    )
  }
}

const RevealedComponent = reveal(MyComponent)

/*

React ScrollReveal Test

*/

// import withScrollReveal from 'react-scrollreveal'

// const ReactScrollRevealTests = props => (
//   <div>
//     <h2>React ScrollReveal Test</h2>
//     <FlyingImages sizes={props.sizes} />
//   </div>
// )

// const Images = props => (
//   <div className="flex-ns" ref={props.animationContainerReference}>
//     <div className="sr-item--sequence w-third-ns">
//       <Image sizes={props.sizes} />
//     </div>
//     <div className="sr-item--sequence w-third-ns">
//       <Image sizes={props.sizes} />
//     </div>
//     <div className="sr-item--sequence w-third-ns">
//       <Image sizes={props.sizes} />
//     </div>
//   </div>
// )

// const FlyingImages = withScrollReveal([
//   {
//     selector: '.sr-item',
//     options: {
//       reset: true
//     }
//   },
//   {
//     selector: '.sr-item--sequence',
//     options: {
//       reset: true,
//       delay: 400
//     },
//     interval: 100
//   }
// ])(Images)

/*

React-Reveal Test

- see docs: https://github.com/rnosov/react-reveal
- see example: https://github.com/rnosov/react-reveal-demo/blob/master/src/App.js

*/

import { Fade, Flip, Rotate, Zoom } from 'react-reveal'
import placeholder from '../images/placeholder.jpg'

const ReactRevealTests = props => (
  <section className="bg-lightest-blue pv5">
    <h2>React-Reveal Test</h2>
    <h3>Fade animations</h3>
    <div className="flex-ns">
      <Fade bottom delay={0} duration={1000} className="w-third-ns">
        <Image sizes={props.sizes} />
      </Fade>
      <Fade bottom delay={250} duration={1000} className="w-third-ns">
        <Image sizes={props.sizes} />
      </Fade>
      <Fade bottom delay={500} duration={1000} className="w-third-ns">
        <Image sizes={props.sizes} />
      </Fade>
    </div>

    <h3>Zoom animations</h3>
    <div className="flex-ns">
      <Zoom delay={0} duration={1000} className="w-third-ns">
        <Image sizes={props.sizes} />
      </Zoom>
      <Zoom delay={250} duration={1000} className="w-third-ns">
        <Image sizes={props.sizes} />
      </Zoom>
      <Zoom delay={500} duration={1000} className="w-third-ns">
        <Image sizes={props.sizes} />
      </Zoom>
    </div>
  </section>
)

// Index page queries
export const query = graphql`
  query BlurUpQuery {
    placeholderImage: imageSharp(id: { regex: "/placeholder/" }) {
      sizes(maxWidth: 5211) {
        ...GatsbyImageSharpSizes
      }
    }
  }
`
