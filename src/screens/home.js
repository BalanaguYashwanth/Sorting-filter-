import axios from "axios";
import { useEffect, useState } from "react";
import { debounce } from "lodash";

export function Home() {
  const [datas, setData] = useState("");
  const [search, setSearch] = useState("");
  const [dataresponse, setDataResponse] = useState("");
  const [score, setScore] = useState("selectthescore");
  const [genre, setGenre] = useState("");
  const [editorchoice, setEditorchoice] = useState("")

  const [prev, setPrev] = useState(1)
  const [next, setNext] = useState(20)
  const [current, setCurrent] = useState(1)
  const [total, setTotal] = useState(20)

  function prevPage()
  {
    if(prev>1 && next>20 && current>=1)
    {
        setCurrent(current-1)
        setPrev(prev-20)
        setNext(next-20)
    }
    console.log(prev, next)
  }

  function nextPage()
  {
    if(prev<total && next<total && current>0)
    {   
        setCurrent(current+1)
        setPrev(prev+20)
        setNext(next+20)
    }
    console.log(prev, next)
  }

  useEffect(() => {
    axios
      .get(
        "https://s3-ap-southeast-1.amazonaws.com/he-public-data/gamesarena274f2bf.json"
      )
      .then((res) => {
        setTotal(res.data.length)
        setData(res.data.slice(prev, next));
      })
      .catch((err) => console.log(err));
  },[prev,next]);

  function datasearch() {
    if (score == "selectthescore") {
      datas.sort((a, b) => a.title.localeCompare(b.title));
    }

    var datasearch = datas.filter((data) =>
      Object.values(data).join(" ").toLowerCase().includes(search.toLowerCase())
    );

    if (score == "LowtoHigh") {
        datas.sort(function (a, b) {
          return a.score - b.score;
        });
      } else if (score == "HightoLow") {
        datas.sort(function (a, b) {
          return b.score - a.score;
        });
      }

    if (genre != "" ) {
      datasearch = datas.filter((data) => {
          return (data["genre"].toLowerCase().split(', ')).includes(genre.toLowerCase())
      });

      datasearch = datasearch.filter((data)=>Object.values(data).join(" ").toLowerCase().includes(search.toLowerCase()))
    }
    
    if(editorchoice !='' )
    {
        datasearch = datasearch.filter((data)=>{
            return data["editors_choice"].toLowerCase() === editorchoice
        })
    }

    return datasearch;
  }

  const searchFunc = debounce((text)=>{
    setSearch(text.trim())
  },500)
  

  return (
    <div className="container">
      <h1 style={{margin:10}}> Home screen </h1>

      <div className="input">          
        <input
          placeholder="Enter the search"
          onChange={(e) =>{searchFunc((e.target.value))}}
        />

        <select onChange={(e) => setScore(e.target.value)} name="score">
          <option value={"selectthescore"}> select the score </option>
          <option value={"HightoLow"}> High to Low </option>
          <option value={"LowtoHigh"}> Low to High </option>
        </select>

        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          name="genre"
        >
          <option value={""}> select the genre </option>
          <option value={"action"}> Action </option>
          <option value={"adventure"}> Adventure </option>
          <option value={"fighting"}> Figting </option>
          <option value={"strategy"}> Strategy </option>
          <option value={"sports"}> Sports </option>
          <option value={"platformer"}> Platformer </option>
          <option value={"puzzle"}> Puzzle </option>
          <option value={"RPG"}> RPG </option>
        </select>

        <select name="editors_choice"  onChange={(e)=>setEditorchoice(e.target.value)} >
          <option value={""}> select the editors_choice </option>
          <option value={"y"}> Yes </option>
          <option value={"n"}> No </option>
        </select>
      </div>

        <p style={{margin:10}} > {'<'} <button onClick={prevPage}>prev</button> {current} <button onClick={nextPage}>next</button> {'>'} </p>
      
      <div  className="subcontainer">
        {datas &&
          datasearch().length>0 ? datasearch().map((data, index) => (
            <div className="card" key={index}>
              <p> Title: {data.title} </p>
              <p> Platform: {data.platform} </p>
              <p> Score: {data.score} </p>
              <p> Genre: {data.genre} </p>
              <p> Editors_choice: {data.editors_choice === 'Y' ?  'Yes' : 'No' } </p>
            </div>
          )) : <h1> No Results Found </h1> }
      </div>
    </div>
  );
}