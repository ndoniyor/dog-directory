import { useEffect, useState } from 'react'
import './App.css'
const API_KEY = "F02lGIR8bkTXcQgTD6V3SUWJdGD559oLoZgairLV4VRamjMWOXVGDkSi";

function App() {
  const [imgList, setList] = useState([])
  const [image, setImage] = useState("")
  const [author, setAuthor] = useState("")
  const [id, setID] = useState("")
  const [description, setDescription] = useState("")
  const [exclList, setExcl] = useState([])
  const [inclList, setIncl] = useState([
    "German Shepherd", "Bulldog", "Labrador Retriever",
    "Golden Retriever", "Husky", "Chihuahua",
    "Rottweiler", "Terrier", "Corgi", "Pitbull"
  ])
  const [imgHistory, setHistory] = useState([])

  const fetchImages = async () => {
    let excludedParams;
    if(exclList.length > 0){
      excludedParams = exclList.join(',').replaceAll(' ', '+');
    }
    const timestamp = Date.now()
    const response = await fetch(
      "https://api.pexels.com/v1/search/?_=" 
      + timestamp 
      + "&page=1&per_page=50&query=dog"
      + (exclList.length > 0 ? "&exclude=" + excludedParams : "")
      , {
        headers: {
          Authorization: API_KEY
        }
      })
    const data = await response.json();
    setList(data)
  }

  const handleNewImage = () => {
    setHistory([...imgHistory, image])
    const index = Math.floor(Math.random() * 50);
    setImage(imgList.photos[index].src.original)
    setAuthor(imgList.photos[index].photographer)
    setDescription(imgList.photos[index].alt)
    setID(imgList.photos[index].id)
  }
  useEffect(()=> {
    fetchImages();
  },[exclList])

  const removeBreed = (breed) => {
    setIncl(inclList.filter(i => i !== breed))
    setExcl([...exclList, breed])
  }

  const addBreed = (breed) => {
    setExcl(exclList.filter(i => i !== breed))
    setIncl([...inclList, breed])
  }

  return (
    <div className="App">
      <div className="historyContainer">
        <h3>Past photos</h3>
        {imgHistory.length > 0 && imgHistory.map((pImg, index) => (
          <img class="historyImg" key={index} src={pImg}/>
        ))}
      </div>
      <div className="mainContainer">
      <h1>Dog Directory</h1>
      <h3>The number one source for curated dog photos!</h3>
        <div className="inclusionList">
          <h3>Included</h3>
          {inclList.map((breed,index) => (
            <button key={index} onClick={() => removeBreed(breed)}>{breed}</button>
          ))}
        </div>
        <div className="imgContainer">
          {image && <img class="mainImg" src={image}/>}
          {author && <p><b>Photographer:</b> {author}</p>}
          {id && <p><b>Photo ID: </b>{id}</p>}
          {description && <p>{description}</p>}
        </div>
        <button onClick={handleNewImage}>Randomize</button>
      </div>
      
      
      <div className="exclusionList">
        <h3>Excluded</h3>
        {exclList.length > 0 && exclList.map((breed, index) => (
          <button key={index} onClick={() => addBreed(breed)}>{breed}</button>
        ))}
      </div>
    </div>
  )
}


export default App
