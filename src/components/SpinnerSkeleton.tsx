import Head from "next/head"
import { FC } from "react";

interface Props{
  size?:'small'|'mediun'|'large';
}
const SpinnerSkeleton:FC<Props> = ({size})=>{
  const s = (size??'large') == 'small' 
    ? .5
    : size == 'mediun'
      ? .7
      : 1
return <>
    <style jsx>{`
    .sk-cube-grid {
        width: calc(40px * ${s});
        height: calc(40px * ${s});
      }
      
      .sk-cube-grid .sk-cube {
        width: 33%;
        height: 33%;
        background-color: var(--color-primary);
        float: left;
        -webkit-animation: sk-cubeGridScaleDelay 1.3s infinite ease-in-out;
                animation: sk-cubeGridScaleDelay 1.3s infinite ease-in-out; 
      }
      .sk-cube-grid .sk-cube1 {
        background-color: var(--bs-secondary);
        -webkit-animation-delay: 0.2s;
                animation-delay: 0.2s; }
      .sk-cube-grid .sk-cube2 {
        background-color: var(--bs-secondary);
        -webkit-animation-delay: 0.3s;
                animation-delay: 0.3s; }
      .sk-cube-grid .sk-cube3 {
        background-color: var(--bs-secondary);
        -webkit-animation-delay: 0.4s;
                animation-delay: 0.4s; }
      .sk-cube-grid .sk-cube4 {
        -webkit-animation-delay: 0.1s;
                animation-delay: 0.1s; }
      .sk-cube-grid .sk-cube5 {
        background-color: var(--bs-secondary);

        -webkit-animation-delay: 0.2s;
                animation-delay: 0.2s; }
      .sk-cube-grid .sk-cube6 {
        background-color: var(--bs-secondary);
        -webkit-animation-delay: 0.3s;
                animation-delay: 0.3s; }
      .sk-cube-grid .sk-cube7 {
        -webkit-animation-delay: 0s;
                animation-delay: 0s; }
      .sk-cube-grid .sk-cube8 {
        -webkit-animation-delay: 0.1s;
                animation-delay: 0.1s; }
      .sk-cube-grid .sk-cube9 {
        background-color: var(--bs-secondary);
        -webkit-animation-delay: 0.2s;
                animation-delay: 0.2s; }
      
      @-webkit-keyframes sk-cubeGridScaleDelay {
        0%, 70%, 100% {
          -webkit-transform: scale3D(1, 1, 1);
                  transform: scale3D(1, 1, 1);
        } 35% {
          -webkit-transform: scale3D(0, 0, 1);
                  transform: scale3D(0, 0, 1); 
        }
      }
      
      @keyframes sk-cubeGridScaleDelay {
        0%, 70%, 100% {
          -webkit-transform: scale3D(1, 1, 1);
                  transform: scale3D(1, 1, 1);
        } 35% {
          -webkit-transform: scale3D(0, 0, 1);
                  transform: scale3D(0, 0, 1);
        } 
      }
    `}</style>
    
    <div className="sk-cube-grid">
<div className="sk-cube sk-cube1"></div>
<div className="sk-cube sk-cube2"></div>
<div className="sk-cube sk-cube3"></div>
<div className="sk-cube sk-cube4"></div>
<div className="sk-cube sk-cube5"></div>
<div className="sk-cube sk-cube6"></div>
<div className="sk-cube sk-cube7"></div>
<div className="sk-cube sk-cube8"></div>
<div className="sk-cube sk-cube9"></div>
</div>
</>
};
export default SpinnerSkeleton;