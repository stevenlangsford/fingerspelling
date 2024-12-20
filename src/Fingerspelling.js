import React, {Fragment, useState, useEffect, useRef} from 'react';
import wordlist from "./allwords.js"

const Fingerspelling = () => {

  // State to manage the image source
    const [myimage, setMyimage] = useState();
    const [letterspeed, setLetterspeed] = useState(500);
    const [target, setTarget] = useState("go");
    const [myinput, setMyInput] = useState();
    const [fingerfont, setFingerfont] = useState(0);
    const [answertext, setAnswertext] = useState("Show me the answer") 
    const inputRef = useRef(null);// attached to the textbox so you can focus it (on load and also when hitting show again)
    useEffect(() => {
        inputRef.current.focus(); // Focus the input when the component mounts
    }, []);

    function importAll(r) {
 	return r.keys().map(r);
     }

    const allFingerFonts = [
	importAll(require.context('./fingerspelling', false, /\.(gif|png|jpe?g|svg)$/)),
	importAll(require.context('./fingerspelling/photofont', false, /\.(gif|png|jpe?g|svg)$/))]

    //var all_images = allFingerFonts[1]
     //const my_image = bg_images[Math.floor(Math.random() * bg_images.length)];

   
    function revealAnswer(){
	setAnswertext("It's "+ target)//separate state because this is drawn to answerbutton, updates only on giveup click
    }
    function handleInput(e){
	setMyInput(e.target.value)
	if(e.target.value== target){
	    setFingerfont(Math.floor(Math.random() * allFingerFonts.length))
	    setMyInput("")
	    const newWord = wordlist[Math.floor(Math.random() * wordlist.length)]
	    setTarget(newWord)
	    flashWord(newWord)
	}
    }
    
    function changeSpeed(increment){
	setLetterspeed(prev => Math.max(1, prev + increment));// can be as slow as you want, but not negative
    }
    
    function flashImage(achar){
	const charIndex = achar.charCodeAt(0) - "a".charCodeAt(0); //assumes lowercase a-z	
     	setMyimage(allFingerFonts[fingerfont][charIndex]);
     	//setTimeout(()=>{setLiveImage(blank_img)}, 4000)
     }

    function flashWord(aword){
	aword = aword.toLowerCase();
	setAnswertext("Show me the answer")
	if(aword.length==0||aword==undefined){
	    setMyimage(allFingerFonts[fingerfont][26])//zz_blank.jpg , the 27th entry
	return;
	}
		flashImage(aword[0])
		setTimeout(()=>flashWord(aword.slice(1,aword.length)), letterspeed)	
    }
    
//    useEffect(()=>{flashWord('bobobbocat')},[]);
    
  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
          <div style={styles.leftButtons}>
	      <span style={{color:'black'}}>Speed: {letterspeed}</span>
            <button style={styles.button} onClick={()=>changeSpeed(-100)}>Faster</button>
            <button style={styles.button} onClick={()=>changeSpeed(100)}>Slower</button>	    
        </div>
      </header>

      {/* Main Content */}
      <div style={styles.main}>
        <img
          src={myimage}
          alt="Type 'go' to start"
          style={styles.image}
        />
	  <div>
          <input type="text"
		 ref={inputRef}
		 value={myinput ?? ''}
		 onChange={handleInput}
		 style={styles.input}
		 placeholder="Type the answer" /><button onClick={()=>{flashWord(target);inputRef.current.focus();}}>Show again</button>
	      </div>
      </div>
        <button style={styles.button} onClick={revealAnswer}>{answertext}</button>
    </div>
  );
};

// Styles for the component
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    margin: 0,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: "0 10px",
    height: "50px",
  },
  leftButtons: {
    display: "flex",
    gap: "10px",
  },
  rightButtons: {
    display: "flex",
    gap: "10px",
  },
  button: {
    padding: "5px 10px",
    fontSize: "14px",
    cursor: "pointer",
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'black'
  },
  image: {
    maxWidth: "80%",
      maxHeight: "80%",
    minWidth: "200px", // Sets a minimum width
    minHeight: "150px", // Sets a minimum height
    objectFit: "contain", // Ensures the image maintains its aspect ratio
    border: '1px solid white'
  },
  input: {
      marginTop: "20px",
      marginLeft:"100px",
    padding: "10px",
    fontSize: "16px",
    width: "50%",
    boxSizing: "border-box",
  },
};

   

export default Fingerspelling



