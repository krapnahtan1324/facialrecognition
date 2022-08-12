import { React, Component } from 'react';
import './App.css';
import Navigation from './components/navigation/Navigation';
import Logo from './components/logo/Logo';
import ImageLinkForm from './components/imagelinkform/ImageLinkForm';
import Rank from './components/rank/Rank';
import FaceRecognition from './components/facerecognition/FaceRecognition';
import Register from './components/register/Register';
import SignIn from './components/signin/SignIn';
import Particles from 'react-tsparticles';
import { loadFull } from "tsparticles";
import Clarifai from 'clarifai'

window.process = {
  env: {
      NODE_ENV: 'development'
  }
}

const app = new Clarifai.App({
  apiKey: '7806c72b226b4e089630725141499286'
 });


const particleoptions = {
  fpsLimit: 120,
  interactivity: {
    events: {
      onClick: {
        enable: true,
        mode: "push",
      },
      onHover: {
        enable: true,
        mode: "repulse",
      },
      resize: true,
    },
    modes: {
      push: {
        quantity: 4,
      },
      repulse: {
        distance: 200,
        duration: 0.4,
      },
    },
  },
  particles: {
    color: {
      value: "#ffffff",
    },
    links: {
      color: "#ffffff",
      distance: 150,
      enable: true,
      opacity: 0.5,
      width: 1,
    },
    collisions: {
      enable: true,
    },
    move: {
      direction: "none",
      enable: true,
      outModes: {
        default: "bounce",
      },
      random: false,
      speed: 3,
      straight: false,
    },
    number: {
      density: {
        enable: true,
        area: 800,
      },
      value: 75,
    },
    opacity: {
      value: 0.5,
    },
    shape: {
      type: "circle",
    },
    size: {
      value: { min: 1, max: 5 },
    },
  },
  detectRetina: true,
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageurl: '',
      boxes: [],
      route: 'signin',
      isSignedIn: false
    }
  }

  calculateFace = (data) => {
    const clarifaiFaces =  data.outputs[0].data.regions.map(region => region.region_info.bounding_box);
    const image = document.getElementById('inputimage')
    const width = Number(image.width);
    const height = Number(image.height);

    return clarifaiFaces.map(face => {
      return {
        leftcol: face.left_col * width,
        toprow: face.top_row * height,
        rightcol: width - (face.right_col * width),
        bottomrow: height - (face.bottom_row * height)
      }
    });
  }

  displayFaceBox = (boxes) => {
    this.setState({ boxes: boxes });
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  }

  onSubmit = () => {
    this.setState({imageurl: this.state.input});
    app.models.predict(
      Clarifai.FACE_DETECT_MODEL, 
      this.state.input).then(response => this.displayFaceBox(this.calculateFace(response)))
      .catch(err => console.log(err)); 
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({isSignedIn: false})
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({ route: route });
  }

  render() {
    const particlesInit = async (main) => {
  
      // you can initialize the tsParticles instance (main) here, adding custom shapes or presets
      // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
      // starting from v2 you can add only the features you need reducing the bundle size
      await loadFull(main);
    };
  
    const particlesLoaded = (container) => {
    };

    const {isSignedIn, imageurl, route, boxes} = this.state;
    return (
      <div className="App">
        <Particles className='particles' id="tsparticles"
      init={particlesInit}
      loaded={particlesLoaded}
      options={[particleoptions]} />
        <Navigation isSignedIn= {isSignedIn} onRouteChange={this.onRouteChange}/>
        { route === 'home' 
          ? <div>
          <Logo/>
          <Rank/>
          <ImageLinkForm onInputChange={this.onInputChange} onSubmit={this.onSubmit}/>
          <FaceRecognition boxes= { boxes } imageurl = {imageurl}/>
          </div>
          : (
            route === 'signin' 
            ? <SignIn onRouteChange={ this.onRouteChange }/>
            : <Register onRouteChange={this.onRouteChange}/>
          ) 
        }
      </div>
    );
  }
}

export default App;
