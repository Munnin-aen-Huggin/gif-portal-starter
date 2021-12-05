import React, { useEffect, useState } from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';
import idl from './idl.json'

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const TEST_GIFS = [
  'https://media.giphy.com/media/fW5nKIZV763BnkpWeC/giphy.gif',
  'https://media.giphy.com/media/tyXrGdlS3l9vxicBle/giphy.gif',
  'https://media.giphy.com/media/QxMb25h7RhitNWgyy0/giphy.gif',
  'https://media.giphy.com/media/XEdgJpPEZPDqI2HVm3/giphy.gif',
  'https://media.giphy.com/media/1AjEeS0UFnj6DzaDbz/giphy.gif',
  'https://media.giphy.com/media/Y3HUh2JiXrjPulXkN1/giphy.gif'

]

const App = () => {
  // State
  const [walletAddress, setWalletAddress] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [gifList, setGifList] = useState([]);

  // Actions
  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;

      if (solana) {
        if (solana.isPhantom) {
          console.log('Phantom wallet found!');
          const response = await solana.connect({ onlyIfTrusted: true });
          console.log(
            'Connected with Public Key:',
            response.publicKey.toString()
          );

          /*
           * Set the user's publicKey in state to be used later!
           */
          setWalletAddress(response.publicKey.toString());
        }
      } else {
        alert('Solana object not found! Get a Phantom Wallet 👻');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const connectWallet = async () => {
    const {solana} = window;

    if (solana) {
      const response = await solana.connect();
      console.log('Connected with Public Key:', response.publicKey.toString());
    }
  };

  const onInputChange = event => {
    const {value} = event.target;
    setInputValue(value);
  };

  const sendGif = async () => {
    if (inputValue.length > 0) {
      console.log('Gif link', inputValue);
    }else {
      console.log('Empty input. Try again.')
    }
  };

  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect to Wallet
    </button>
  );

  //connected render 
  
const renderConnectedContainer = () => (
  <div className="Connected-container">
    {/* Input and Button*/}
    <form
      onSubmit={(event) => {
        event.preventDefault();
        sendGif();
      }}
      >
        <input type="text" placeholder="Enter gif link" value={inputValue} onChange={onInputChange} />
        <button type="submit" className="cta-button submit-gif-button" >Submit</button>
      </form>
    <div className="gif-grid">
      {/*Map through gifList instead of TEST_GIFS*/}
      {gifList.map(gif =>(
        <div className="gif-item" key={gif}>
          <img src={gif} alt={gif} />
          </div>
      ))}
    </div>
  </div>
);

  // UseEffects
  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

 useEffect(() => {
   if (walletAddress) {
     console.log('Fetching GIF list...');
     // Call SOL program here

     //Set State
     setGifList(TEST_GIFS);
   }
 }, [walletAddress]);

  return (
    <div className="App">
			{/* This was solely added for some styling fanciness */}
			<div className={walletAddress ? 'authed-container' : 'container'}>
        <div className="header-container">
          <p className="header">Stamford Bridge's Blue's</p>
          <p className="sub-text">
            KBTFF 🟦⬜️
          </p>
          {/* Add the condition to show this only if we don't have a wallet address */}
          {!walletAddress && renderNotConnectedContainer()}
          {/*Add connection for connected wallet render*/}
          {walletAddress && renderConnectedContainer()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
