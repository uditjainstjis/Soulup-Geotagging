"use client";
import { use } from 'react';
import React,{useEffect} from 'react';

import MapComp from './components/MapComp'
import useLocation from './components/getUserLocation'

export default function Home() {


  //Location processing here
  useLocation()



  return (
    <div>
      Hey there! Soulup Present Geotagging Application

      <MapComp/>
    </div>
  );
}
