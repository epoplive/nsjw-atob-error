// import logo from './logo.svg';
// import './App.css';

import {Canvas} from "@react-three/fiber"
import { OrthographicCamera, Plane } from "@react-three/drei";
import Shader from "./Shader";
import { Vector3 } from "three";

function App() {
  return (
    <div className="App">
      <Canvas
          className="canv"
          updateDefaultCamera={false}
          // camera={{
          //   left: -1,
          //   right: 1,
          //   top: 1,
          //   bottom: -1,
          //   near: -1,
          //   far: 1
          // }}
      >
        <OrthographicCamera
            makeDefault
            left={-1}
            right={1}
            top={1}
            bottom={-1}
            near={-1}
            far={1}
        />
        <Shader color={new Vector3(0.23, 0.15, 0.84)} />
      </Canvas>
    </div>
  );
}

export default App;
