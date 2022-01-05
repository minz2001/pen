"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";

const TP=2*Math.PI;
const CSIZE=400;

const ctx=(()=>{
  let d=document.createElement("div");
  d.style.textAlign="center";
  body.append(d);
  let c=document.createElement("canvas");
  c.width=2*CSIZE;
  c.height=2*CSIZE;
  d.append(c);
  return c.getContext("2d");
})();
ctx.translate(CSIZE,CSIZE);

onresize=()=>{ 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.style.width=D+"px";
  ctx.canvas.style.height=D+"px";
}

const getRandomInt=(min,max,low)=>{
  if (low) {
    return Math.floor(Math.random()*Math.random()*(max-min))+min;
  } else {
    return Math.floor(Math.random()*(max-min))+min;
  }
}

var t=0;

var getColors=()=>{
  let c=["black"];
  let colorCount=2;
  let hr=Math.round(60/colorCount);
  let hue=getRandomInt(0,90,true)+30;
  for (let i=0; i<colorCount; i++) {
    let hd=Math.round(360/colorCount)*i+getRandomInt(-hr,hr);
    let sat=70+getRandomInt(0,31);
    let col=(hue+hd)%360;
    let lf=Math.random();
    let lum=Math.round(50+20*Math.pow(Math.sin((col+90)*TP/360),2));
    c.splice(getRandomInt(0,c.length+1),0,"hsl("+col+","+sat+"%,"+lum+"%)");
  }
  c.splice(getRandomInt(0,c.length+1),0,"black");
  return c;
}

var SS=2;

var udm=[];
var setSymmetry=()=>{
  udm=[];
  if (t%400==0) colors=getColors();
  let c=[8,4,16,32,6,12,24][getRandomInt(0,7,true)];
  for (let i=0; i<c; i++) {
    let z=i*TP/c;
    udm.push(new DOMMatrix([Math.cos(z),Math.sin(z),-Math.sin(z),Math.cos(z),0,0]));
  }
  speed=Math.round(400/c);
}

var speed=10;

var draw=()=>{
  let path=new Path2D();
if (Math.random()<0.3) SS=3;
else if (Math.random()<0.3) SS=1;
else SS=2;
  for (let i=0; i<speed; i++) {
    let x=SS*Math.round((-CSIZE+2*CSIZE*Math.random())/SS);
    let y=SS*Math.round((-CSIZE+2*CSIZE*Math.random())/SS);
    let p=new Path2D();
    let p2=new Path2D();
    p.rect(x,y,SS,SS);
    p2.rect(y,x,SS,SS);
    for (let px of [p,p2]) {
      for (let mt of udm) {
	path.addPath(px,mt);
      }
    }
  }
  ctx.fillStyle=colors[t%colors.length];
  ctx.fill(path);
}

var colors=getColors();

var stopped=true;
var start=()=>{
  if (stopped) { 
    stopped=false;
    colors=getColors();
    requestAnimationFrame(animate);
  } else {
    stopped=true;
  }
}
body.addEventListener("click", start, false);

var animate=(ts)=>{
  if (stopped) return;
  if (t%500==0) colors=getColors();
  t++;
  if (t%1000==0) setSymmetry();
  draw();
  requestAnimationFrame(animate);
}

onresize();

setSymmetry();
start();
