import React from 'react';
import styled from 'styled-components';

const PlaneButton = ({ onClick }) => {
  return (
    <StyledWrapper>
      <label className="plane-switch">
        <input type="checkbox" onClick={onClick} />
        <div>
          <div>
            <svg viewBox="0 0 52 52">
              <path d="M6.23959828,21.6666667 L22.0632886,21.6666667 L17.88061847,0.433333333 L17.88061847,0.433333333 C17.88061847,0.253840789 17.98832145,0.0998370616 18.1418184,0.0340534814 L18.3082858,0 L21.44919008,0 C21.93439085,0 22.0034948,0.115117804 22.20105568,0.313084798 L22.37271509,0.537472105 L28.54563609,11.2623333 L33.18263856,11.2666667 C34.12741447,11.2666667 34.89330708,11.7576714 34.89330708,12.5 C34.89330708,13.2423286 34.12741447,13.7333333 33.18263856,13.7333333 L30.54339276,13.72899 L34.5380054,21.6666667 L47.6820947,21.6666667 C50.0852684,21.6666667 52,22.2066461 52,23 C52,23.7933539 50.0852684,24.3333333 47.6820947,24.3333333 L34.5380054,24.3333333 L30.54339276,29.2666667 L33.18263856,29.2666667 C34.12741447,29.2666667 34.89330708,29.7576714 34.89330708,30.5 C34.89330708,31.2423286 34.12741447,31.7333333 33.18263856,31.7333333 L28.54563609,31.7333333 L22.37271509,42.4625279 C22.3209052,42.6260711 22.00359273,42.8181588 21.72745879,42.9068224 L21.44919008,43 L18.3082858,43 L18.1418184,42.9659465 C17.9871379,42.9392424 17.88974677,42.8311689 17.88892412,42.7137588 L17.88061847,42.4333333 L22.0632886,30.3333333 L6.23959828,30.3333333 L3.56464495,34.2045874 C3.4151015,34.4217871 3.19553188,34.5716812 2.94426808,34.6351908 L2.68925765,34.6666667 L0.267377656,34.6666667 L0.214097979,34.6423386 L0.214097979,34.6423386 C0.118896451,34.5817748 0.0104112568,34.4557961 0,34.2616404 L0.0237202955,34.0901815 L2.32342004,27.4325594 C2.57970187,26.6906244 2.63081012,25.8957087 2.47765418,25.1326568 L2.32378875,24.5676705 L0.0240740426,17.9225898 C0.0101392297,17.8765256 0,17.8178756 0,17.7792525 C0,17.4397601 0.10770289,17.4465553 0.261199842,17.3799733 L0.42726884,17.3459219 L0.267377656,17.3419192 C0.351465088,17.3419192 0.400451134,17.3826513 0.42806449,17.4004347 L1.23851834,18.5851973 C1.51974543,18.8835843 2.00260258,18.9380932 2.39378097,18.7884347 L6.23959828,21.6666667 Z" fill="currentColor" />
            </svg>
          </div>
          <span className="street-middle" />
          <span className="cloud" />
          <span className="cloud two" />
        </div>
      </label>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .plane-switch {
    --dot: #fff;
    --street: #6B6D76;
    --street-line: #A8AAB4;
    --street-line-mid: #C0C2C8;
    --sky-1: #60A7FA;
    --sky-2: #2F8EFC;
    --light-1: rgba(255, 233, 0, 1);
    --light-2: rgba(255, 233, 0, .3);
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }

  .plane-switch input {
    display: none;
  }

  .plane-switch input + div {
    -webkit-mask-image: -webkit-radial-gradient(white, black);
    position: relative;
    overflow: hidden;
    width: 200px;
    height: 100px;
    padding: 4px;
    border-radius: 50px;
    background: linear-gradient(90deg, var(--street) 0%, var(--street) 25%, var(--sky-1) 75%, var(--sky-2) 100%) left var(--p, 0%) top 0;
    background-position-x: var(--p, 0%);
    background-size: 400% auto;
    transition: background-position 0.6s;
  }

  .plane-switch input + div:before, .plane-switch input + div:after {
    content: "";
    display: block;
    position: absolute;
    transform: translateX(var(--s, 0));
    transition: transform 0.3s;
  }

  .plane-switch input + div:before {
    width: 168px;
    right: 8px;
    top: 16px;
    height: 4px;
    background: var(--street-line);
    box-shadow: 0 64px 0 0 var(--street-line);
  }

  .plane-switch input + div:after {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    left: 92px;
    top: 4px;
    -webkit-animation: lights2 2s linear infinite;
    animation: lights2 2s linear infinite;
    box-shadow: inset 0 0 0 8px var(--light-1), 0 84px 0 var(--light-1), 32px 0 0 var(--light-2), 32px 84px 0 var(--light-2), 64px 0 0 var(--light-2), 64px 84px 0 var(--light-2);
  }

  .plane-switch input + div span {
    display: block;
    position: absolute;
  }

  .plane-switch input + div span.street-middle {
    top: 48px;
    left: 84px;
    width: 12px;
    height: 4px;
    transform: translateX(var(--s, 0));
    background: var(--street-line-mid);
    box-shadow: 20px 0 0 var(--street-line-mid), 40px 0 0 var(--street-line-mid), 60px 0 0 var(--street-line-mid), 80px 0 0 var(--street-line-mid), 100px 0 0 var(--street-line-mid);
    transition: transform 0.3s;
  }

  .plane-switch input + div span.cloud {
    width: 48px;
    height: 16px;
    border-radius: 8px;
    background: #fff;
    position: absolute;
    top: var(--ct, 32px);
    left: 400%;
    opacity: var(--co, 0);
    transition: opacity 0.3s;
    -webkit-animation: clouds2 2s linear infinite var(--cd, 0s);
    animation: clouds2 2s linear infinite var(--cd, 0s);
  }

  .plane-switch input + div span.cloud:before, .plane-switch input + div span.cloud:after {
    content: "";
    position: absolute;
    transform: translateX(var(--cx, 0));
    border-radius: 50%;
    width: var(--cs, 20px);
    height: var(--cs, 20px);
    background: #fff;
    bottom: 4px;
    left: 4px;
  }

  .plane-switch input + div span.cloud:after {
    --cs: 24px;
    --cx: 16px;
  }

  .plane-switch input + div span.cloud.two {
    --ct: 80px;
    --cd: 4s;
    opacity: var(--co-2, 0);
  }

  .plane-switch input + div div {
    display: table;
    position: relative;
    z-index: 1;
    padding: 20px;
    border-radius: 50%;
    background: var(--dot);
    transform: translateX(var(--x, 0));
    transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.35, 1.2);
  }

  .plane-switch input + div div svg {
    width: 52px;
    height: 52px;
    display: block;
    color: var(--c, var(--street));
    transition: color 0.6s;
  }

  .plane-switch input:checked + div {
    --p: 100%;
  }

  .plane-switch input:checked + div div {
    transform: translateX(100%);
  }

  .plane-switch input:checked + div div svg {
    color: var(--dot);
  }

  .plane-switch input:checked + div span.cloud {
    opacity: 1;
  }

  .plane-switch input:checked + div span.street-middle {
    transform: translateX(80px);
  }

  @keyframes clouds2 {
    0% {
      opacity: 0;
      transform: translateX(0);
    }

    100% {
      opacity: 1;
      transform: translateX(-100%);
    }
  }

  @keyframes lights2 {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(300px);
    }
  }
`;

export default PlaneButton;
