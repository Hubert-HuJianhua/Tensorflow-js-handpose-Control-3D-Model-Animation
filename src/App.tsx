import { Sound } from 'lingo3d'
import { Cube, Find, LingoEditor, Model, types, useLoop, World } from 'lingo3d-react'
import { useEffect, useRef } from 'react'
import { drawHand } from "./utilities";

import './App.css'

import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
import * as handpose from '@tensorflow-models/handpose'
import '@tensorflow/tfjs-backend-webgl';

function App() {
  const findRef = useRef(null)
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const runHandpose = async ()=>{
    const net = await handpose.load();
    console.log("Handpose model loaded.");
    setInterval(()=>{
      detect(net)
    },10)
  }


  useEffect(()=>{runHandpose()},[])
  
  const detect = async (net:any)=>{
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current?.video.readyState === 4
    ) {
      const video = webcamRef.current?.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;


      const hand = await net.estimateHands(video);
      if(hand.length>0){
        console.log(hand[0].annotations.thumb[3][0])
        findRef.current.rotationZ = hand[0].annotations.thumb[3][0]
        const ctx = canvasRef.current.getContext("2d");
        drawHand(hand, ctx);
      }
     

    }


   
  }

  return (
    <>
        <Webcam
        ref={webcamRef}
        style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          width: 640,
          height: 480,
        }}
        />
         <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            width: 640,
            height: 480,
          }}
        />

        <World color='transparent'>
      <Model src='m.fbx' scale={3} pbr  >
        <Find ref={findRef} name="mixamorig1:LeftHandThumb3"  />
      </Model>
    </World>
    
    </>
  )
}

export default App
