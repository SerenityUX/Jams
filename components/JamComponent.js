import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'
import Icon from '@hackclub/icons'
import { Link as ScrollLink, Element } from 'react-scroll'
import PresentationSlider from '@/components/presentationSlider'
import BatchPartSlider from '@/components/BatchPartSlider'
import { MDXRemote } from 'next-mdx-remote'
import mdxComponents from '@/components/mdxComponents'
import {
  Container,
  Button,
  Input,
  Text,
  Link,
  Box,
  Grid,
  Badge
} from 'theme-ui'
import Header from '@/components/Header'
import lunr from 'lunr'

/** @jsxImportSource theme-ui */
import Meta from '@hackclub/meta'
import Head from 'next/head'

export default function JamComponent({ jam, jamsContent }) {
  const submitProject = async () => {
    try {
      let slug = ""
      if (jam?.slug != undefined) {
        slug = jam?.slug
        console.log(slug)

      } else {
        slug = jam?.batch + jam?.part
        console.log(slug)
      } 

      const response = await fetch(
        `https://jams-api-1daa6fb9f168.herokuapp.com/submitJam/${slug}/${submissionURL}/${projectName}`
      )
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const data = await response.json()
      setApiResponse(data.message)
      // if(data.message == "Submission successful") {
      //   router.reload()
      // }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await fetch(
          'https://jams-api-1daa6fb9f168.herokuapp.com/getSubmissions'
        )
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const data = await response.json()
        if (jam?.slug != undefined) {

        
        setFinishedProjects(data.filter(project => project.jam == jam.slug))
        } else {
          setFinishedProjects(data.filter(project => project.jam == (jam.batch + jam.part)))
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchSubmissions()
  }, [])

  const router = useRouter()
  const [apiResponse, setApiResponse] = useState('')
  const [submissionURL, setSubmissionURL] = useState('')
  const [projectName, setProjectName] = useState('')

  const [presentationSelected, setPresentationSelected] = useState(true)
  const [finishedProjects, setFinishedProjects] = useState([])

  const [activeSection, setActiveSection] = useState()
  const [passedSections, setPassedSections] = useState([])
  const [upcomingSections, setUpcomingSections] = useState([])

  const handleSectionClick = sectionId => {
    // router.push(`#${sectionId}`, undefined, { scroll: false });
    document
      .getElementById(sectionId)
      .scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' })
    window.scrollBy(0, -50)
  }

  useEffect(() => {
    // User visits jam page - store title in localStorage
    let viewed = localStorage.getItem('viewed')
    if (!viewed) {
      localStorage.setItem(
        'viewed',
        JSON.stringify([
          {
            title: jam.title,
            date: Date.now(),
            difficulty: jam.difficulty,
            keywords: jam.keywords,
            language: jam.language,
            timeEstimate: jam.timeEstimate
          }
        ])
      )
    } else {
      viewed = JSON.parse(viewed)
      if (!viewed.find(viewedJam => viewedJam.title === jam.title)) {
        viewed.push({
          title: jam.title,
          date: Date.now(),
          difficulty: jam.difficulty,
          keywords: jam.keywords,
          language: jam.language,
          timeEstimate: jam.timeEstimate
        })
        localStorage.setItem('viewed', JSON.stringify(viewed))
      }
    }

    const handleScroll = () => {
      let newActiveSection = null
      let passedSections = []
      let upcomingSections = []

      jam?.headers?.forEach(header => {
        const sectionElement = document.getElementById(header)
        const rect = sectionElement?.getBoundingClientRect()

        if (rect?.top <= 128) {
          newActiveSection = header
          passedSections.push(header)
        } else {
          upcomingSections.push(header)
        }
      })

      setActiveSection(newActiveSection)
      setPassedSections(passedSections)
      setUpcomingSections(upcomingSections)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const precision = 0.4 // arbitrary number to indicate precision of lunr

  var searchAlgorithmLunr = lunr(function () {
    this.field('title')
    this.field('description')
    this.field('body')
    this.field('contributor')
    this.field('keywords')
    this.field('slug')

    let concatenatedJamBatch = jamsContent.singles.concat(jamsContent.batches)

    for (let jindex in concatenatedJamBatch) {
      let jam = concatenatedJamBatch[jindex]
      this.add({
        title: jam.title,
        description: jam.description,
        body: jam.body,
        contributor: jam.contributor,
        keywords: jam.keywords,
        slug: jam.slug,
        object: jam,
        id: jindex
      })
    }
  })

  function returnResultsLunr(query) {
    let bestList = searchAlgorithmLunr.search(query.toString())

    console.log(bestList)

    let results = []

    let concatenatedJamBatch = jamsContent.singles.concat(jamsContent.batches)

    for (let returnedquery in bestList) {
      if (bestList[returnedquery]['score'] >= precision) {
        console.log(bestList[returnedquery]['ref'])
        results.push(concatenatedJamBatch[bestList[returnedquery]['ref']])
      }
    }

    return results
  }

  const [query, setQuery] = useState('')
  if(jam.video?.includes("youtube")){
    return (
      <>
        <Meta
          as={Head}
          name={jam.title}
          title={jam.title}
          description={jam.description}
          image={jam.thumbnail}
          color="#ec3750"
        />
  
        <Header
          query={query}
          setQuery={setQuery}
          jams={returnResultsLunr(query)}
          back={jam.batch == null ? '/' : '/batch/' + jam.batch} // if no batch, back is index, otherwise it is batch page
        />
        <div sx={{ height: '5rem' }}></div>
  
        {/* <Container as="nav" sx={{
          maxWidth:"80rem",
          position:"sticky",
          top:0,
          px:"1.5rem",
          display:"flex",
          alignItems:"center",
          justifyContent:"space-between",
          gap:"2rem",
          bg:"rgb(255,255,255,0.50)",
          backdropFilter:"blur(16px)",
          zIndex: 40
        }}>
          <button sx={{
            border:"none",
            font:"inherit",
            background:"none",
            px:"0.625rem",
            py:"0.25rem",
            display:"flex",
            alignItems:"center",
            gap:"0.25rem",
            color:"#993CCF",
            borderRadius:"9999px",
            my:"1rem",
            ":hover": { outlineStyle:"solid", outlineColor:"#993CCF", outlineWidth:"2px" }
          }}>
            ← Back
          </button>
  
          <input 
            sx={{
              width:"16rem",
              border:"none",
              font:"inherit",
              background:"none",
              px:"1rem",
              py:"0.5rem",
              bg:"white",
              borderRadius:"9999px",
              outlineStyle:"solid",
              outlineWidth:"2px",
              outlineColor: "#d4d4d4",
              my:"1rem",
              ":focus": { outlineColor:"#993CCF" },
            }}
            placeholder="Search for Raspberry Jam"
          />
  
          <button sx={{
            border:"none",
            font:"inherit",
            background:"none",
            p:"0.25rem",
            color:"#993CCF",
            borderRadius:"9999px",
            ":hover": { outlineStyle:"solid", outlineColor:"#993CCF", outlineWidth:"2px" }
          }}>
            GH
          </button>
        </Container> */}
  
        {/* So what this code does is checks if batch is null or not. upon null renders the singles breadcrumbs ver, upon non null renders the batch ver */}
        
        <Container style={{position: "fixed", bottom: 32, left: 16}}>
          <Link href={jam.batch == null ? (`https://github.com/hackclub/jams/edit/main/jams/singles/${jam.slug}/en-US.md`) : (`https://github.com/hackclub/jams/edit/main/jams/batches/${jam.batch}/${jam.part}/en-US.md`)} style={{backgroundColor: "#fff", fontSize: 16, color: "#993CCF", border: "1px solid #993CCF", borderRadius: 32, padding: "12px 24px", textDecoration: "none"}}>Edit on GitHub</Link>
        </Container>
  
  
        {jam.batch != null ? (
          <Container
            sx={{ p: '0px 1rem' }}
            style={{
              display: 'flex',
              maxWidth: '64rem !important',
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'space-between'
            }}>
            {/* Structure: root / batch name / part */}
            <Box style={{ display: 'flex', gap: '12px' }}>
              <Link
                href="/"
                sx={{ color: '#993CCF', textDecoration: 'underline' }}>
                batch
              </Link>{' '}
              /{' '}
              <Link
                href={'/batch/' + jam.batch}
                sx={{ color: '#993CCF', textDecoration: 'underline' }}>
                {jam.batch}
              </Link>{' '}
              /{' '}
              <Link
                href={'/batch/' + jam.batch + '/' + jam.part}
                sx={{ color: '#993CCF', textDecoration: 'underline' }}>
                {jam.part}
              </Link>
            </Box>
            {jam.batch != null ? (
              <BatchPartSlider
                jam={jam}
                currentPart={jam.part}
                maxParts={jam.totalParts}></BatchPartSlider>
            ) : (
              <></>
            )}
          </Container>
        ) : (
          <Container sx={{ p: '1rem' }} style={{ maxWidth: '64rem !important' }}>
            {/* Structure: root / jam name */}
            <Link href="/" sx={{ color: '#993CCF', textDecoration: 'underline' }}>
              jam
            </Link>{' '}
            /{' '}
            <Link
              href={'/jam/' + jam.slug}
              sx={{ color: '#993CCF', textDecoration: 'underline' }}>
              {jam.slug}
            </Link>
          </Container>
        )}
  
        <Container
          as="main"
          sx={{
            px: '1rem',
            display: 'flex',
            flexDirection: ['column', 'column', 'row'],
            gap: [0, 0, '3rem']
          }}
          style={{ maxWidth: '64rem !important' }}>
          <div sx={{ flex: '1 1 0%', pb: [0, 0, '2rem'] }}>
            {jam.presentationPDF != '' && jam.video == '' && (
              <div
                style={{
                  width: '100%',
                  aspectRatio: '16/9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '24px',
                  overflow: 'hidden'
                }}>
                <PresentationSlider
                  presentationPlay={jam.presentationPlay}
                  presentation={jam.presentation}
                  pdfPath={jam.presentationPDF}
                />
              </div>
            )}
            {jam.video != '' && jam.presentationPDF == '' && (
              <div
                style={{
                  width: '100%',
                  aspectRatio: '16/9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '24px',
                  overflow: 'hidden'
                }}>
                if(true){
                  <iframe width="560" height="315" src={jam.video} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                }else{
                  <video
                  style={{
                    width: '100%',
                    borderRadius: '0px 0px 24px 24px',
                    aspectRatio: '16/9',
                    backgroundColor: '#000'
                  }}
                  controls
                  src={jam.video}
                 />
                }
                
              </div>
            )}
            {jam.presentationPDF != '' && jam.video != '' && (
              <Box>
                <Box
                  style={{
                    display: 'flex',
                    borderRadius: '24px 24px 0px 0px',
                    justifyContent: 'center',
                    backgroundColor: '#e0e6ed',
                    gap: '32px'
                  }}>
                  <Box
                    style={{
                      display: 'flex',
                      border: '1px solid #e0e6ed',
                      padding: '2px',
                      backgroundColor: '#fff',
                      marginTop: '8px',
                      marginBottom: '8px',
                      backgroundColor: '#f9fafc',
                      gap: '16px',
                      padding: '4px 16px',
                      borderRadius: '16px'
                    }}>
                    <p
                      onClick={() => setPresentationSelected(true)}
                      style={{
                        cursor: 'pointer',
                        border: '1px solid #e0e6ed',
                        marginBottom: '2px',
                        marginTop: '2px',
                        backgroundColor: presentationSelected
                          ? '#F1E8FF'
                          : '#F6F6F6',
                        color: presentationSelected ? '#993CCF' : '#000',
                        width: '120px',
                        alignItems: 'center',
                        display: 'flex',
                        justifyContent: 'center',
                        paddingTop: '4px',
                        paddingBottom: '4px',
                        borderRadius: '8px'
                      }}>
                      Presentation
                    </p>
                    <p
                      onClick={() => setPresentationSelected(false)}
                      style={{
                        cursor: 'pointer',
                        border: '1px solid #e0e6ed',
                        marginBottom: '2px',
                        marginTop: '2px',
                        backgroundColor: !presentationSelected
                          ? '#F1E8FF'
                          : '#F6F6F6',
                        color: !presentationSelected ? '#993CCF' : '#000',
                        width: '120px',
                        alignItems: 'center',
                        display: 'flex',
                        justifyContent: 'center',
                        paddingTop: '4px',
                        paddingBottom: '4px',
                        borderRadius: '8px'
                      }}>
                      Video
                    </p>
                  </Box>
                </Box>
                {presentationSelected ? (
                  <div
                    style={{
                      width: '100%',
                      aspectRatio: '16/9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '0px 0px 24px 24px',
                      overflow: 'hidden'
                    }}>
                    <PresentationSlider
                      presentationPlay={jam.presentationPlay}
                      presentation={jam.presentation}
                      pdfPath={jam.presentationPDF}
                    />
                  </div>
                ) : (
                  <iframe width="625" height="350" src={jam.video} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                )}
              </Box>
            )}
  
            <Box style={{ marginTop: 8 }}>
            <Badge
                key="keywordFeature"
                mr={2}
                sx={{
                  cursor: 'pointer',
                  backgroundColor: '#993CCF',
                  marginBottom: '8px',
                  fontSize: ['14px', 'auto']
                }}
                variant="outline"
                color="#fff">
                {jam?.keywords.split(', ')[0]}
              </Badge>
  
              <Badge
                key="timeFeature"
                mr={2}
                sx={{
                  cursor: 'pointer',
                  backgroundColor: '#993CCF',
                  marginBottom: '8px',
                  fontSize: ['14px', 'auto']
                }}
                variant="outline"
                color="#fff">
                {jam.timeEstimate}
              </Badge>
            </Box>
            <h1 sx={{ mt: '0.5rem', marginBottom: 0, lineHeight: '2.2rem' }}>
              {jam.title}
            </h1>
  
            <Link
              href={`https://github.com/${jam.contributor}`}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ textDecoration: 'none' }}>
              <div
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  mt: '0.25rem'
                }}>
                <img
                  src={`https://github.com/${jam.contributor}.png`}
                  sx={{ width: '1.5rem', borderRadius: '9999px' }}
                />
                <span
                  sx={{
                    'fontWeight': 'bold',
                    'color': 'rgb(115 115 115)',
                    '&:hover': {
                      color: '#993CCF' // Set text color to purple on hover
                    }
                  }}>
                  {jam.contributor}
                </span>
              </div>
            </Link>
{/*   
            <Box sx={{ pt: 16 }}>
              {finishedProjects.length > 0 ? (
                <div>
                  Finished Projects <br />
                </div>
              ) : (
                <div></div>
              )}
              {finishedProjects.map(project => (
                <a href={project.url}>
                  {project.title.includes("Figma") && "F "}
                {project.title.includes("GitHub") && "GH "}
                {project.title}
                  <Badge
                    key="difficultyFeature"
                    mr={2}
                    sx={{
                      cursor: 'pointer',
                      backgroundColor: '#fff',
                      marginBottom: '8px',
                      fontSize: ['14px', 'auto'],
                      textDecoration: 'none'
                    }}
                    variant="outline"
                    color="#993CCF">
                    <abbr
                      style={{ textDecoration: 'none' }}
                      title={project.title.length > 32 ? project.title : ''}>
                      {project.title.slice(0, 32)}{' '}
                      {project.title.length > 32 ? '...' : ''}
                    </abbr>
                  </Badge>
                </a>
              ))}
            </Box> */}
  
            <Box
              sx={{ fontSize: 18, lineHeight: '200%', pb: [32, 32], mt: '1rem' }}>
              <MDXRemote components={mdxComponents} {...jam.source} />
            </Box>
            {jam.slug !== 'bakebuild' && (
        <div
          style={{
            border: '2px solid rgba(0, 0, 0, 0.25)',
            boxShadow: '0px 0px 24px 0px rgba(153, 60, 207, 0.50)',
            backgroundColor: '#E1E6EC',
            display: 'flex',
            flexDirection: 'column',
            padding: '24px 24px',
            borderRadius: '16px'
          }}>
          <Text
            sx={{
              color: '#993CCF',
              fontSize: 32,
              lineHeight: 1.125,
              fontWeight: 700
            }}>
            You finished the Jam. <br />
            Congratulations! 🎉 🎉 🎉
          </Text>

          <Text sx={{ mt: 3 }}>
            Share your final project with the community
          </Text>
          <Box sx={{ marginTop: '8px', width: ['100%', '100%', '75%'] }}>
            <Text>Project Name</Text>
            <Input
              placeholder={'MarshaMellow - SwampLofiAnimation'}
              value={projectName}
              onChange={e => setProjectName(e.target.value)}
            />
          </Box>
          <Box sx={{ marginTop: '8px', width: ['100%', '100%', '75%'] }}>
            <Text>Project URL</Text>
            <Input
              placeholder={'https://swamplofi.marshamellow.repl.co/'}
              value={submissionURL}
              onChange={e => setSubmissionURL(e.target.value)}
            />
          </Box>

          <Button
            sx={{
              marginTop: '24px',
              borderRadius: '12px',
              padding: '12px',
              backgroundColor: '#993CCF',
              width: ['100%', '100%', '50%']
            }}
            onClick={() => submitProject()}
          >
            Share Project with Community
          </Button>
          <p>{apiResponse}</p>
        </div>
      )}
           </div>
  
          <div sx={{ width: ['auto', 'auto', '20rem'], position: 'relative' }}>
            <div
              sx={{
                position: 'sticky',
                top: '6rem',
                pb: '3rem',
                maxHeight: ['none', 'none', 'calc(100vh - 6rem)'],
                overflowY: ['visible', 'visible', 'auto']
              }}>
              <h2
                sx={{
                  fontSize: '1.5rem',
                  lineHeight: '1rem',
                  fontWeight: 'bold'
                }}>
                Author
              </h2>
  
              <div
                sx={{
                  px: '1.25rem',
                  py: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  bg: 'rgb(229 229 229 / 0.50)',
                  borderRadius: '1rem'
                }}>
                <img
                  src={`https://github.com/${jam.contributor}.png`}
                  sx={{ width: '3rem', height: '3rem', borderRadius: '9999px' }}
                />
                <div>
                  <Link
                    href={`https://github.com/${jam.contributor}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ textDecoration: 'none' }}>
                    <div
                      sx={{
                        'display': 'flex',
                        'alignItems': jam.contributorSlackID ? 'end' : 'center',
                        'gap': '0.25rem',
                        'mt': '0.25rem',
                        'color': 'rgb(115 115 115)',
                        '&:hover': {
                          color: '#993CCF', // Set text color to purple on hover
                          borderColor: '#993CCF',
                          opacity: 1
                        }
                      }}>
                      <span
                        sx={{
                          fontSize: '1.1rem',
                          lineHeight: '1rem',
                          fontWeight: 'bold'
                        }}>
                        {jam.contributor}
                      </span>
  
                      <Icon
                        glyph="github"
                        style={{ height: '20px', width: '20px' }}
                      />
                    </div>
                  </Link>
  
                  {jam.contributorSlackID && (
                    <div sx={{ display: 'flex', gap: '0.75rem', mt: '0.1rem' }}>
                      <a
                        href={`https://hackclub.slack.com/team/${jam.contributorSlackID}`}
                        sx={{
                          'display': 'flex',
                          'opacity': 0.5,
                          'border': '1px solid #000',
                          'fontSize': '15px',
                          'padding': ['2px 12px', '2px 8px'],
                          'marginTop': '4px',
                          'backgroundColor': '#fff',
                          'borderRadius': '8px',
                          'textDecoration': 'none',
                          'alignItems': 'center',
                          'gap': '0.25rem',
                          'color': '#000', // Set initial text color to black
                          '&:hover': {
                            color: '#993CCF', // Set text color to purple on hover
                            borderColor: '#993CCF',
                            opacity: 1
                          }
                        }}
                        target="_blank"
                        rel="noopener noreferrer">
                        <Icon
                          glyph="slack"
                          style={{
                            height: '20px',
                            width: '20px',
                            padding: '0px'
                          }}
                        />
                        <span
                          style={{ textDecoration: 'none', lineHeight: '1rem' }}>
                          Message on Slack
                        </span>
                      </a>
                    </div>
                  )}
                </div>
              </div>
  
              {(jam.presentation ||
                jam.video ||
                jam.notes ||
                jam.poster ||
                jam.AITokenLink) && (
                <>
                  <h2
                    sx={{
                      fontSize: '1.5rem',
                      lineHeight: '1rem',
                      fontWeight: 'bold',
                      mt: '2rem'
                    }}>
                    Resources
                  </h2>
  
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      marginTop: '6px'
                    }}>
                    {jam.presentation && (
                      <Link
                        target={'_blank'}
                        sx={{ color: '#993CCF' }}
                        href={jam.presentation}>
                        <Box
                          sx={{
                            alignItems: 'center',
                            display: 'flex',
                            justifyContent: 'space-between',
                            border: '1px solid',
                            paddingLeft: '10px',
                            paddingRight: '10px',
                            paddingTop: '5px',
                            paddingBottom: '5px',
                            borderRadius: '8px',
                            bg: '#fff'
                          }}>
                          <Text sx={{ textDecoration: 'none' }}>
                            Presentation
                          </Text>
                          <Icon height={22} width={22} glyph={'download'} />
                        </Box>
                      </Link>
                    )}
                    {jam.video && (
                      <Link
                        target={'_blank'}
                        sx={{ color: '#993CCF' }}
                        href={jam.video}>
                        <Box
                          sx={{
                            alignItems: 'center',
                            display: 'flex',
                            justifyContent: 'space-between',
                            border: '1px solid',
                            paddingLeft: '10px',
                            paddingRight: '10px',
                            paddingTop: '5px',
                            paddingBottom: '5px',
                            borderRadius: '8px',
                            bg: '#fff'
                          }}>
                          <Text sx={{ textDecoration: 'none' }}>Video</Text>
                          <Icon height={22} width={22} glyph={'download'} />
                        </Box>
                      </Link>
                    )}
                    {jam.notes && (
                      <Link
                        target={'_blank'}
                        sx={{ color: '#993CCF' }}
                        href={jam.notes}>
                        <Box
                          sx={{
                            alignItems: 'center',
                            display: 'flex',
                            justifyContent: 'space-between',
                            border: '1px solid',
                            paddingLeft: '10px',
                            paddingRight: '10px',
                            paddingTop: '5px',
                            paddingBottom: '5px',
                            borderRadius: '8px',
                            bg: '#fff'
                          }}>
                          <Text sx={{ textDecoration: 'none' }}>Notes</Text>
                          <Icon height={22} width={22} glyph={'download'} />
                        </Box>
                      </Link>
                    )}
                    {jam.poster && (
                      <Link
                        target={'_blank'}
                        sx={{ color: '#993CCF' }}
                        href={jam.poster}>
                        <Box
                          sx={{
                            alignItems: 'center',
                            display: 'flex',
                            justifyContent: 'space-between',
                            border: '1px solid',
                            paddingLeft: '10px',
                            paddingRight: '10px',
                            paddingTop: '5px',
                            paddingBottom: '5px',
                            borderRadius: '8px',
                            bg: '#fff'
                          }}>
                          <Text sx={{ textDecoration: 'none' }}>Poster</Text>
                          <Icon height={22} width={22} glyph={'download'} />
                        </Box>
                      </Link>
                    )}
                    {jam.AITokenLink && (
                      <Link
                        target={'_blank'}
                        sx={{ color: '#993CCF' }}
                        href={jam.AITokenLink}>
                        <Box
                          sx={{
                            alignItems: 'center',
                            display: 'flex',
                            justifyContent: 'space-between',
                            border: '1px solid',
                            paddingLeft: '10px',
                            paddingRight: '10px',
                            paddingTop: '5px',
                            paddingBottom: '5px',
                            borderRadius: '8px',
                            bg: '#fff'
                          }}>
                          <Text sx={{ textDecoration: 'none' }}>
                            AI Token / API Key
                          </Text>
                          <Icon height={22} width={22} glyph={'download'} />
                        </Box>
                      </Link>
                    )}
                  </Box>
                </>
              )}
  
              <div sx={{ display: ['none', 'none', 'block'] }}>
                <h2
                  sx={{
                    fontSize: '1.5rem',
                    lineHeight: '1rem',
                    fontWeight: 'bold',
                    mt: '2rem'
                  }}>
                  Outline
                </h2>
  
                <ul
                  style={{
                    paddingLeft: 16,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6
                  }}>
                  {jam?.headers?.map(header => (
                    <li key={header}>
                      <div>
                        <Link
                          href={`#${header}`}
                          onClick={() => handleSectionClick(header)}
                          sx={{
                            color:
                              header === activeSection
                                ? '#000'
                                : passedSections?.includes(header)
                                ? 'muted'
                                : '#000',
                            textDecoration:
                              header === activeSection ? 'underline' : 'none'
                          }}>
                          {header}
                        </Link>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </>
    )
  }else{
    return (
      <>
        <Meta
          as={Head}
          name={jam.title}
          title={jam.title}
          description={jam.description}
          image={jam.thumbnail}
          color="#ec3750"
        />
  
        <Header
          query={query}
          setQuery={setQuery}
          jams={returnResultsLunr(query)}
          back={jam.batch == null ? '/' : '/batch/' + jam.batch} // if no batch, back is index, otherwise it is batch page
        />
        <div sx={{ height: '5rem' }}></div>
  
        {/* <Container as="nav" sx={{
          maxWidth:"80rem",
          position:"sticky",
          top:0,
          px:"1.5rem",
          display:"flex",
          alignItems:"center",
          justifyContent:"space-between",
          gap:"2rem",
          bg:"rgb(255,255,255,0.50)",
          backdropFilter:"blur(16px)",
          zIndex: 40
        }}>
          <button sx={{
            border:"none",
            font:"inherit",
            background:"none",
            px:"0.625rem",
            py:"0.25rem",
            display:"flex",
            alignItems:"center",
            gap:"0.25rem",
            color:"#993CCF",
            borderRadius:"9999px",
            my:"1rem",
            ":hover": { outlineStyle:"solid", outlineColor:"#993CCF", outlineWidth:"2px" }
          }}>
            ← Back
          </button>
  
          <input 
            sx={{
              width:"16rem",
              border:"none",
              font:"inherit",
              background:"none",
              px:"1rem",
              py:"0.5rem",
              bg:"white",
              borderRadius:"9999px",
              outlineStyle:"solid",
              outlineWidth:"2px",
              outlineColor: "#d4d4d4",
              my:"1rem",
              ":focus": { outlineColor:"#993CCF" },
            }}
            placeholder="Search for Raspberry Jam"
          />
  
          <button sx={{
            border:"none",
            font:"inherit",
            background:"none",
            p:"0.25rem",
            color:"#993CCF",
            borderRadius:"9999px",
            ":hover": { outlineStyle:"solid", outlineColor:"#993CCF", outlineWidth:"2px" }
          }}>
            GH
          </button>
        </Container> */}
  
        {/* So what this code does is checks if batch is null or not. upon null renders the singles breadcrumbs ver, upon non null renders the batch ver */}
        
        <Container style={{position: "fixed", bottom: 32, left: 16}}>
          <Link href={jam.batch == null ? (`https://github.com/hackclub/jams/edit/main/jams/singles/${jam.slug}/en-US.md`) : (`https://github.com/hackclub/jams/edit/main/jams/batches/${jam.batch}/${jam.part}/en-US.md`)} style={{backgroundColor: "#fff", fontSize: 16, color: "#993CCF", border: "1px solid #993CCF", borderRadius: 32, padding: "12px 24px", textDecoration: "none"}}>Edit on GitHub</Link>
        </Container>
  
  
        {jam.batch != null ? (
          <Container
            sx={{ p: '0px 1rem' }}
            style={{
              display: 'flex',
              maxWidth: '64rem !important',
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'space-between'
            }}>
            {/* Structure: root / batch name / part */}
            <Box style={{ display: 'flex', gap: '12px' }}>
              <Link
                href="/"
                sx={{ color: '#993CCF', textDecoration: 'underline' }}>
                batch
              </Link>{' '}
              /{' '}
              <Link
                href={'/batch/' + jam.batch}
                sx={{ color: '#993CCF', textDecoration: 'underline' }}>
                {jam.batch}
              </Link>{' '}
              /{' '}
              <Link
                href={'/batch/' + jam.batch + '/' + jam.part}
                sx={{ color: '#993CCF', textDecoration: 'underline' }}>
                {jam.part}
              </Link>
            </Box>
            {jam.batch != null ? (
              <BatchPartSlider
                jam={jam}
                currentPart={jam.part}
                maxParts={jam.totalParts}></BatchPartSlider>
            ) : (
              <></>
            )}
          </Container>
        ) : (
          <Container sx={{ p: '1rem' }} style={{ maxWidth: '64rem !important' }}>
            {/* Structure: root / jam name */}
            <Link href="/" sx={{ color: '#993CCF', textDecoration: 'underline' }}>
              jam
            </Link>{' '}
            /{' '}
            <Link
              href={'/jam/' + jam.slug}
              sx={{ color: '#993CCF', textDecoration: 'underline' }}>
              {jam.slug}
            </Link>
          </Container>
        )}
  
        <Container
          as="main"
          sx={{
            px: '1rem',
            display: 'flex',
            flexDirection: ['column', 'column', 'row'],
            gap: [0, 0, '3rem']
          }}
          style={{ maxWidth: '64rem !important' }}>
          <div sx={{ flex: '1 1 0%', pb: [0, 0, '2rem'] }}>
            {jam.presentationPDF != '' && jam.video == '' && (
              <div
                style={{
                  width: '100%',
                  aspectRatio: '16/9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '24px',
                  overflow: 'hidden'
                }}>
                <PresentationSlider
                  presentationPlay={jam.presentationPlay}
                  presentation={jam.presentation}
                  pdfPath={jam.presentationPDF}
                />
              </div>
            )}
            {jam.video != '' && jam.presentationPDF == '' && (
              <div
                style={{
                  width: '100%',
                  aspectRatio: '16/9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '24px',
                  overflow: 'hidden'
                }}>
                if(true){
                  <iframe width="560" height="315" src={jam.video} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                }else{
                  <video
                  style={{
                    width: '100%',
                    borderRadius: '0px 0px 24px 24px',
                    aspectRatio: '16/9',
                    backgroundColor: '#000'
                  }}
                  controls
                  src={jam.video}
                 />
                }
                
              </div>
            )}
            {jam.presentationPDF != '' && jam.video != '' && (
              <Box>
                <Box
                  style={{
                    display: 'flex',
                    borderRadius: '24px 24px 0px 0px',
                    justifyContent: 'center',
                    backgroundColor: '#e0e6ed',
                    gap: '32px'
                  }}>
                  <Box
                    style={{
                      display: 'flex',
                      border: '1px solid #e0e6ed',
                      padding: '2px',
                      backgroundColor: '#fff',
                      marginTop: '8px',
                      marginBottom: '8px',
                      backgroundColor: '#f9fafc',
                      gap: '16px',
                      padding: '4px 16px',
                      borderRadius: '16px'
                    }}>
                    <p
                      onClick={() => setPresentationSelected(true)}
                      style={{
                        cursor: 'pointer',
                        border: '1px solid #e0e6ed',
                        marginBottom: '2px',
                        marginTop: '2px',
                        backgroundColor: presentationSelected
                          ? '#F1E8FF'
                          : '#F6F6F6',
                        color: presentationSelected ? '#993CCF' : '#000',
                        width: '120px',
                        alignItems: 'center',
                        display: 'flex',
                        justifyContent: 'center',
                        paddingTop: '4px',
                        paddingBottom: '4px',
                        borderRadius: '8px'
                      }}>
                      Presentation
                    </p>
                    <p
                      onClick={() => setPresentationSelected(false)}
                      style={{
                        cursor: 'pointer',
                        border: '1px solid #e0e6ed',
                        marginBottom: '2px',
                        marginTop: '2px',
                        backgroundColor: !presentationSelected
                          ? '#F1E8FF'
                          : '#F6F6F6',
                        color: !presentationSelected ? '#993CCF' : '#000',
                        width: '120px',
                        alignItems: 'center',
                        display: 'flex',
                        justifyContent: 'center',
                        paddingTop: '4px',
                        paddingBottom: '4px',
                        borderRadius: '8px'
                      }}>
                      Video
                    </p>
                  </Box>
                </Box>
                {presentationSelected ? (
                  <div
                    style={{
                      width: '100%',
                      aspectRatio: '16/9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '0px 0px 24px 24px',
                      overflow: 'hidden'
                    }}>
                    <PresentationSlider
                      presentationPlay={jam.presentationPlay}
                      presentation={jam.presentation}
                      pdfPath={jam.presentationPDF}
                    />
                  </div>
                ) : (
                  <video
                    style={{
                      width: '100%',
                      borderRadius: '0px 0px 24px 24px',
                      aspectRatio: '16/9',
                      backgroundColor: '#000'
                    }}
                    controls
                    src={jam.video}
                  />
                )}
              </Box>
            )}
  
            <Box style={{ marginTop: 8 }}>
            <Badge
                key="keywordFeature"
                mr={2}
                sx={{
                  cursor: 'pointer',
                  backgroundColor: '#993CCF',
                  marginBottom: '8px',
                  fontSize: ['14px', 'auto']
                }}
                variant="outline"
                color="#fff">
                {jam?.keywords.split(', ')[0]}
              </Badge>
  
              <Badge
                key="timeFeature"
                mr={2}
                sx={{
                  cursor: 'pointer',
                  backgroundColor: '#993CCF',
                  marginBottom: '8px',
                  fontSize: ['14px', 'auto']
                }}
                variant="outline"
                color="#fff">
                {jam.timeEstimate}
              </Badge>
            </Box>
            <h1 sx={{ mt: '0.5rem', marginBottom: 0, lineHeight: '2.2rem' }}>
              {jam.title}
            </h1>
  
            <Link
              href={`https://github.com/${jam.contributor}`}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ textDecoration: 'none' }}>
              <div
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  mt: '0.25rem'
                }}>
                <img
                  src={`https://github.com/${jam.contributor}.png`}
                  sx={{ width: '1.5rem', borderRadius: '9999px' }}
                />
                <span
                  sx={{
                    'fontWeight': 'bold',
                    'color': 'rgb(115 115 115)',
                    '&:hover': {
                      color: '#993CCF' // Set text color to purple on hover
                    }
                  }}>
                  {jam.contributor}
                </span>
              </div>
            </Link>
  
            {/* <Box sx={{ pt: 16 }}>
              {finishedProjects.length > 0 ? (
                <div>
                  Finished Projects <br />
                </div>
              ) : (
                <div></div>
              )}
              {finishedProjects.map(project => (
                <a href={project.url}>
                  {project.title.includes("Figma") && "F "}
                {project.title.includes("GitHub") && "GH "}
                {project.title}
                  <Badge
                    key="difficultyFeature"
                    mr={2}
                    sx={{
                      cursor: 'pointer',
                      backgroundColor: '#fff',
                      marginBottom: '8px',
                      fontSize: ['14px', 'auto'],
                      textDecoration: 'none'
                    }}
                    variant="outline"
                    color="#993CCF">
                    <abbr
                      style={{ textDecoration: 'none' }}
                      title={project.title.length > 32 ? project.title : ''}>
                      {project.title.slice(0, 32)}{' '}
                      {project.title.length > 32 ? '...' : ''}
                    </abbr>
                  </Badge>
                </a>
              ))}
            </Box> */}
  
            <Box
              sx={{ fontSize: 18, lineHeight: '200%', pb: [32, 32], mt: '1rem' }}>
              <MDXRemote components={mdxComponents} {...jam.source} />
            </Box>
            {jam.slug !== 'bakebuild' && (
        <div
          style={{
            border: '2px solid rgba(0, 0, 0, 0.25)',
            boxShadow: '0px 0px 24px 0px rgba(153, 60, 207, 0.50)',
            backgroundColor: '#E1E6EC',
            display: 'flex',
            flexDirection: 'column',
            padding: '24px 24px',
            borderRadius: '16px'
          }}>
          <Text
            sx={{
              color: '#993CCF',
              fontSize: 32,
              lineHeight: 1.125,
              fontWeight: 700
            }}>
            You finished the Jam. <br />
            Congratulations! 🎉 🎉 🎉
          </Text>

          <Text sx={{ mt: 3 }}>
            Share your final project with the community
          </Text>
          <Box sx={{ marginTop: '8px', width: ['100%', '100%', '75%'] }}>
            <Text>Project Name</Text>
            <Input
              placeholder={'MarshaMellow - SwampLofiAnimation'}
              value={projectName}
              onChange={e => setProjectName(e.target.value)}
            />
          </Box>
          <Box sx={{ marginTop: '8px', width: ['100%', '100%', '75%'] }}>
            <Text>Project URL</Text>
            <Input
              placeholder={'https://swamplofi.marshamellow.repl.co/'}
              value={submissionURL}
              onChange={e => setSubmissionURL(e.target.value)}
            />
          </Box>

          <Button
            sx={{
              marginTop: '24px',
              borderRadius: '12px',
              padding: '12px',
              backgroundColor: '#993CCF',
              width: ['100%', '100%', '50%']
            }}
            onClick={() => submitProject()}
          >
            Share Project with Community
          </Button>
          <p>{apiResponse}</p>
        </div>
      )}
          </div>
  
          <div sx={{ width: ['auto', 'auto', '20rem'], position: 'relative' }}>
            <div
              sx={{
                position: 'sticky',
                top: '6rem',
                pb: '3rem',
                maxHeight: ['none', 'none', 'calc(100vh - 6rem)'],
                overflowY: ['visible', 'visible', 'auto']
              }}>
              <h2
                sx={{
                  fontSize: '1.5rem',
                  lineHeight: '1rem',
                  fontWeight: 'bold'
                }}>
                Author
              </h2>
  
              <div
                sx={{
                  px: '1.25rem',
                  py: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  bg: 'rgb(229 229 229 / 0.50)',
                  borderRadius: '1rem'
                }}>
                <img
                  src={`https://github.com/${jam.contributor}.png`}
                  sx={{ width: '3rem', height: '3rem', borderRadius: '9999px' }}
                />
                <div>
                  <Link
                    href={`https://github.com/${jam.contributor}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ textDecoration: 'none' }}>
                    <div
                      sx={{
                        'display': 'flex',
                        'alignItems': jam.contributorSlackID ? 'end' : 'center',
                        'gap': '0.25rem',
                        'mt': '0.25rem',
                        'color': 'rgb(115 115 115)',
                        '&:hover': {
                          color: '#993CCF', // Set text color to purple on hover
                          borderColor: '#993CCF',
                          opacity: 1
                        }
                      }}>
                      <span
                        sx={{
                          fontSize: '1.1rem',
                          lineHeight: '1rem',
                          fontWeight: 'bold'
                        }}>
                        {jam.contributor}
                      </span>
  
                      <Icon
                        glyph="github"
                        style={{ height: '20px', width: '20px' }}
                      />
                    </div>
                  </Link>
  
                  {jam.contributorSlackID && (
                    <div sx={{ display: 'flex', gap: '0.75rem', mt: '0.1rem' }}>
                      <a
                        href={`https://hackclub.slack.com/team/${jam.contributorSlackID}`}
                        sx={{
                          'display': 'flex',
                          'opacity': 0.5,
                          'border': '1px solid #000',
                          'fontSize': '15px',
                          'padding': ['2px 12px', '2px 8px'],
                          'marginTop': '4px',
                          'backgroundColor': '#fff',
                          'borderRadius': '8px',
                          'textDecoration': 'none',
                          'alignItems': 'center',
                          'gap': '0.25rem',
                          'color': '#000', // Set initial text color to black
                          '&:hover': {
                            color: '#993CCF', // Set text color to purple on hover
                            borderColor: '#993CCF',
                            opacity: 1
                          }
                        }}
                        target="_blank"
                        rel="noopener noreferrer">
                        <Icon
                          glyph="slack"
                          style={{
                            height: '20px',
                            width: '20px',
                            padding: '0px'
                          }}
                        />
                        <span
                          style={{ textDecoration: 'none', lineHeight: '1rem' }}>
                          Message on Slack
                        </span>
                      </a>
                    </div>
                  )}
                </div>
              </div>
  
              {(jam.presentation ||
                jam.video ||
                jam.notes ||
                jam.poster ||
                jam.AITokenLink) && (
                <>
                  <h2
                    sx={{
                      fontSize: '1.5rem',
                      lineHeight: '1rem',
                      fontWeight: 'bold',
                      mt: '2rem'
                    }}>
                    Resources
                  </h2>
  
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      marginTop: '6px'
                    }}>
                    {jam.presentationPlay && (
                      <Link
                        target={'_blank'}
                        sx={{ color: '#993CCF' }}
                        href={jam.presentationPlay}>
                        <Box
                          sx={{
                            alignItems: 'center',
                            display: 'flex',
                            justifyContent: 'space-between',
                            border: '1px solid',
                            paddingLeft: '10px',
                            paddingRight: '10px',
                            paddingTop: '5px',
                            paddingBottom: '5px',
                            borderRadius: '8px',
                            bg: '#fff'
                          }}>
                          <Text sx={{ textDecoration: 'none' }}>
                            Presentation
                          </Text>
                          <Icon height={22} width={22} glyph={'download'} />
                        </Box>
                      </Link>
                    )}
                    {jam.video && (
                      <Link
                        target={'_blank'}
                        sx={{ color: '#993CCF' }}
                        href={jam.video}>
                        <Box
                          sx={{
                            alignItems: 'center',
                            display: 'flex',
                            justifyContent: 'space-between',
                            border: '1px solid',
                            paddingLeft: '10px',
                            paddingRight: '10px',
                            paddingTop: '5px',
                            paddingBottom: '5px',
                            borderRadius: '8px',
                            bg: '#fff'
                          }}>
                          <Text sx={{ textDecoration: 'none' }}>Video</Text>
                          <Icon height={22} width={22} glyph={'download'} />
                        </Box>
                      </Link>
                    )}
                    {jam.notes && (
                      <Link
                        target={'_blank'}
                        sx={{ color: '#993CCF' }}
                        href={jam.notes}>
                        <Box
                          sx={{
                            alignItems: 'center',
                            display: 'flex',
                            justifyContent: 'space-between',
                            border: '1px solid',
                            paddingLeft: '10px',
                            paddingRight: '10px',
                            paddingTop: '5px',
                            paddingBottom: '5px',
                            borderRadius: '8px',
                            bg: '#fff'
                          }}>
                          <Text sx={{ textDecoration: 'none' }}>Notes</Text>
                          <Icon height={22} width={22} glyph={'download'} />
                        </Box>
                      </Link>
                    )}
                    {jam.poster && (
                      <Link
                        target={'_blank'}
                        sx={{ color: '#993CCF' }}
                        href={jam.poster}>
                        <Box
                          sx={{
                            alignItems: 'center',
                            display: 'flex',
                            justifyContent: 'space-between',
                            border: '1px solid',
                            paddingLeft: '10px',
                            paddingRight: '10px',
                            paddingTop: '5px',
                            paddingBottom: '5px',
                            borderRadius: '8px',
                            bg: '#fff'
                          }}>
                          <Text sx={{ textDecoration: 'none' }}>Poster</Text>
                          <Icon height={22} width={22} glyph={'download'} />
                        </Box>
                      </Link>
                    )}
                    {jam.AITokenLink && (
                      <Link
                        target={'_blank'}
                        sx={{ color: '#993CCF' }}
                        href={jam.AITokenLink}>
                        <Box
                          sx={{
                            alignItems: 'center',
                            display: 'flex',
                            justifyContent: 'space-between',
                            border: '1px solid',
                            paddingLeft: '10px',
                            paddingRight: '10px',
                            paddingTop: '5px',
                            paddingBottom: '5px',
                            borderRadius: '8px',
                            bg: '#fff'
                          }}>
                          <Text sx={{ textDecoration: 'none' }}>
                            AI Token / API Key
                          </Text>
                          <Icon height={22} width={22} glyph={'download'} />
                        </Box>
                      </Link>
                    )}
                  </Box>
                </>
              )}
  
              <div sx={{ display: ['none', 'none', 'block'] }}>
                <h2
                  sx={{
                    fontSize: '1.5rem',
                    lineHeight: '1rem',
                    fontWeight: 'bold',
                    mt: '2rem'
                  }}>
                  Outline
                </h2>
  
                <ul
                  style={{
                    paddingLeft: 16,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6
                  }}>
                  {jam?.headers?.map(header => (
                    <li key={header}>
                      <div>
                        <Link
                          href={`#${header}`}
                          onClick={() => handleSectionClick(header)}
                          sx={{
                            color:
                              header === activeSection
                                ? '#000'
                                : passedSections?.includes(header)
                                ? 'muted'
                                : '#000',
                            textDecoration:
                              header === activeSection ? 'underline' : 'none'
                          }}>
                          {header}
                        </Link>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </>
    )
  }

  
}
